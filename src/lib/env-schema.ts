/**
 * Environment schema and loader (ADR 0013).
 *
 * Headless on purpose: no Next.js imports and no `server-only`, so scripts, tests, and tool configs
 * can validate just the groups they need (`loadEnv(["sec"])` for the EDGAR scripts). App code reads
 * the validated, server-only `env` object from `@/lib/env` instead.
 *
 * Contract with `.env.example` (asserted in env-schema.test.ts): every key there belongs to exactly
 * one group here, and a key is optional here exactly when it is commented out there.
 *
 * Error messages name keys, never values, because values are secrets.
 */
import { z } from "zod";

/** Anything shaped like `process.env`. Tests inject plain objects instead of mutating the global. */
export type EnvSource = Readonly<Record<string, string | undefined>>;

const MISSING = "missing";

// Values reach the schemas already trimmed and non-blank (see `loadEnv`), so `z.string()` alone
// means "required" and its only failure is a missing key.
const text = z.string();

function urlWithProtocol(protocols: readonly string[], message: string) {
  return z.string().refine((value) => {
    if (!URL.canParse(value)) return false;
    const url = new URL(value);
    return protocols.includes(url.protocol) && url.hostname !== "";
  }, message);
}

const postgresUrl = urlWithProtocol(
  ["postgres:", "postgresql:"],
  "must be a postgres:// or postgresql:// URL with a host (URL-encode special characters in the password)",
);

const httpUrl = urlWithProtocol(["https:", "http:"], "must be an http(s):// URL with a host");

// Whole numbers only: no signs, decimals, exponents, or hex. 15 digits keeps them safe integers.
const positiveInt = z
  .string()
  .regex(/^[1-9]\d{0,14}$/, "must be a whole number greater than 0")
  .transform(Number);

const nonNegativeInt = z
  .string()
  .regex(/^(0|[1-9]\d{0,14})$/, "must be a whole number (0 or more)")
  .transform(Number);

/** Byte length of standard, padded base64 (what `openssl rand -base64` prints); 0 if malformed. */
function base64ByteLength(value: string): number {
  if (value.length % 4 !== 0 || !/^[A-Za-z0-9+/]+={0,2}$/.test(value)) return 0;
  return atob(value).length;
}

const sessionCookieSecret = z
  .string()
  .refine(
    (value) => base64ByteLength(value) >= 32,
    "must be base64 that decodes to at least 32 bytes (generate: openssl rand -base64 32)",
  );

const cronSecret = z
  .string()
  .min(32, "must be at least 32 characters (generate: openssl rand -hex 32)");

// SEC rejects requests without a descriptive User-Agent that includes contact information.
const secUserAgent = z
  .string()
  .regex(/\S+@\S+\.\S+/, 'must include a contact email, e.g. "Jane Doe jane@company.com"')
  .refine(
    (value) => !/@example\.(com|org|net)\b/i.test(value),
    "still uses the placeholder email from .env.example",
  );

/**
 * Variables grouped by consumer. Groups never share a key. Model names and tunables live here as
 * config, never as scattered literals.
 */
export const envGroups = {
  /** Runtime Postgres connection through the Supabase transaction pooler. */
  db: z.object({ DATABASE_URL: postgresUrl }),
  /** Direct/session connection: drizzle-kit migrations and scripts only. */
  dbDirect: z.object({ DATABASE_URL_DIRECT: postgresUrl }),
  blob: z.object({
    BLOB_S3_ENDPOINT: httpUrl,
    BLOB_S3_REGION: text,
    BLOB_S3_BUCKET: text,
    BLOB_S3_ACCESS_KEY_ID: text,
    BLOB_S3_SECRET_ACCESS_KEY: text,
  }),
  pinecone: z.object({
    PINECONE_API_KEY: text,
    PINECONE_DENSE_INDEX: text,
    PINECONE_SPARSE_INDEX: text,
    PINECONE_RERANK_MODEL: text,
    PINECONE_SPARSE_MODEL: text,
  }),
  openai: z.object({
    OPENAI_API_KEY: text,
    OPENAI_EMBEDDING_MODEL: text,
  }),
  session: z.object({
    SESSION_COOKIE_SECRET: sessionCookieSecret,
    GUEST_SESSION_TTL_HOURS: positiveInt,
  }),
  cron: z.object({ CRON_SECRET: cronSecret }),
  /** SEC EDGAR scripts only. */
  sec: z.object({ SEC_USER_AGENT: secUserAgent }),
  /** Optional overrides. Defaults live in `src/lib/caps.ts` (P0-10); 0 switches a feature off. */
  caps: z.object({
    CAP_MAX_FILE_BYTES: nonNegativeInt.optional(),
    CAP_MAX_DOCS_PER_SESSION: nonNegativeInt.optional(),
    CAP_MAX_INDEX_CONFIGS_PER_SESSION: nonNegativeInt.optional(),
    CAP_MAX_EMBED_TOKENS_PER_SESSION: nonNegativeInt.optional(),
    CAP_QUERIES_PER_MINUTE: nonNegativeInt.optional(),
    CAP_RERANKS_PER_SESSION_PER_DAY: nonNegativeInt.optional(),
    CAP_GLOBAL_GUEST_NAMESPACES: nonNegativeInt.optional(),
  }),
} as const;

export type EnvGroup = keyof typeof envGroups;

export const ALL_ENV_GROUPS = Object.keys(envGroups) as EnvGroup[];

/** Groups the deployed app needs. `dbDirect` and `sec` are script-only and not required there. */
export const APP_ENV_GROUPS = [
  "db",
  "blob",
  "pinecone",
  "openai",
  "session",
  "cron",
  "caps",
] as const satisfies readonly EnvGroup[];

export function isEnvGroup(value: string): value is EnvGroup {
  return Object.hasOwn(envGroups, value);
}

type UnionToIntersection<U> = (U extends unknown ? (arg: U) => void : never) extends (
  arg: infer I,
) => void
  ? I
  : never;

type GroupOutput<G extends EnvGroup> = { [Name in G]: z.output<(typeof envGroups)[Name]> }[G];
type ReadonlyFlat<T> = { readonly [K in keyof T]: T[K] };

/** The validated, typed values for a set of groups, e.g. `EnvFor<"db" | "sec">`. */
export type EnvFor<G extends EnvGroup> = ReadonlyFlat<UnionToIntersection<GroupOutput<G>>>;

export type AppEnv = EnvFor<(typeof APP_ENV_GROUPS)[number]>;

export interface EnvIssue {
  key: string;
  message: string;
}

export class EnvValidationError extends Error {
  readonly issues: readonly EnvIssue[];

  constructor(issues: readonly EnvIssue[]) {
    const count = issues.length === 1 ? "1 problem" : `${issues.length} problems`;
    super(
      [
        `Invalid environment configuration (${count}):`,
        ...issues.map((issue) => `  - ${issue.key}: ${issue.message}`),
        "Set these in .env.local (copy .env.example), or in the deployment's environment variables.",
      ].join("\n"),
    );
    this.name = "EnvValidationError";
    this.issues = issues;
  }
}

/**
 * Validate the given groups from `source` (default `process.env`) and return only their keys.
 * Values are trimmed and blank values count as missing. Throws `EnvValidationError` listing every
 * missing or invalid key at once.
 */
export function loadEnv<const G extends EnvGroup>(
  groups: readonly G[],
  source: EnvSource = process.env,
): EnvFor<G> {
  const shape: z.ZodRawShape = {};
  for (const group of groups) Object.assign(shape, envGroups[group].shape);

  const input: Record<string, string> = {};
  for (const key of Object.keys(shape)) {
    const value = source[key]?.trim();
    if (value) input[key] = value;
  }

  const result = z.object(shape).safeParse(input, {
    error: (issue) => (issue.input === undefined ? MISSING : undefined),
  });
  if (!result.success) {
    throw new EnvValidationError(
      result.error.issues.map((issue) => ({ key: String(issue.path[0]), message: issue.message })),
    );
  }
  return result.data as EnvFor<G>;
}
