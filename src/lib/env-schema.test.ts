import { readFileSync } from "node:fs";
import { describe, expect, expectTypeOf, it } from "vitest";

import {
  ALL_ENV_GROUPS,
  EnvValidationError,
  envGroups,
  loadEnv,
  type EnvIssue,
  type EnvSource,
} from "./env-schema";

const sessionSecret = Buffer.alloc(32, 7).toString("base64");

/** A complete, valid environment. Tests derive broken variants from it; nothing touches process.env. */
const validEnv = {
  DATABASE_URL: "postgresql://postgres.ref:pw@aws-0-us-east-1.pooler.supabase.com:6543/postgres",
  DATABASE_URL_DIRECT:
    "postgresql://postgres.ref:pw@aws-0-us-east-1.pooler.supabase.com:5432/postgres",
  BLOB_S3_ENDPOINT: "https://account123.r2.cloudflarestorage.com",
  BLOB_S3_REGION: "auto",
  BLOB_S3_BUCKET: "rag-playground",
  BLOB_S3_ACCESS_KEY_ID: "blob-access-key-id",
  BLOB_S3_SECRET_ACCESS_KEY: "blob-secret-access-key",
  PINECONE_API_KEY: "pinecone-api-key",
  PINECONE_DENSE_INDEX: "rag-playground-dense",
  PINECONE_SPARSE_INDEX: "rag-playground-sparse",
  PINECONE_RERANK_MODEL: "bge-reranker-v2-m3",
  PINECONE_SPARSE_MODEL: "pinecone-sparse-english-v0",
  OPENAI_API_KEY: "openai-api-key",
  OPENAI_EMBEDDING_MODEL: "text-embedding-3-small",
  SESSION_COOKIE_SECRET: sessionSecret,
  GUEST_SESSION_TTL_HOURS: "72",
  CRON_SECRET: "c".repeat(64),
  SEC_USER_AGENT: "Jane Doe jane@company.com",
} satisfies EnvSource;

function issuesFrom(run: () => unknown): EnvIssue[] {
  try {
    run();
  } catch (error) {
    if (error instanceof EnvValidationError) return [...error.issues];
    throw error;
  }
  throw new Error("expected EnvValidationError, but validation passed");
}

function issueKeys(run: () => unknown): string[] {
  return issuesFrom(run).map((issue) => issue.key);
}

function without(source: EnvSource, ...keys: string[]): EnvSource {
  return Object.fromEntries(Object.entries(source).filter(([key]) => !keys.includes(key)));
}

const schemaKeys = ALL_ENV_GROUPS.flatMap((group) => Object.keys(envGroups[group].shape));

describe("loadEnv", () => {
  it("accepts a complete, valid environment and parses numbers", () => {
    const env = loadEnv(ALL_ENV_GROUPS, validEnv);

    expect(env.DATABASE_URL).toBe(validEnv.DATABASE_URL);
    expect(env.SEC_USER_AGENT).toBe(validEnv.SEC_USER_AGENT);
    expect(env.GUEST_SESSION_TTL_HOURS).toBe(72);
    expect(env.CAP_MAX_FILE_BYTES).toBeUndefined();
  });

  it("returns only schema keys, trimmed", () => {
    const env = loadEnv(ALL_ENV_GROUPS, {
      ...validEnv,
      OPENAI_API_KEY: "  openai-api-key\n",
      PATH: "/usr/bin",
    });

    expect(Object.keys(env).sort()).toEqual(Object.keys(validEnv).sort());
    expect(env.OPENAI_API_KEY).toBe("openai-api-key");
  });

  it("fails on a missing required key", () => {
    const withoutKey = without(validEnv, "OPENAI_API_KEY");

    expect(issuesFrom(() => loadEnv(ALL_ENV_GROUPS, withoutKey))).toEqual([
      { key: "OPENAI_API_KEY", message: "missing" },
    ]);
  });

  it("treats a blank value as missing", () => {
    expect(issuesFrom(() => loadEnv(ALL_ENV_GROUPS, { ...validEnv, CRON_SECRET: "  " }))).toEqual([
      { key: "CRON_SECRET", message: "missing" },
    ]);
  });

  it.each([
    ["DATABASE_URL", "not a url"],
    ["DATABASE_URL", "https://aws-0-us-east-1.pooler.supabase.com:6543/postgres"],
    ["DATABASE_URL", "postgresql:///postgres"],
    ["DATABASE_URL_DIRECT", "aws-0-us-east-1.pooler.supabase.com:5432/postgres"],
    ["BLOB_S3_ENDPOINT", "account123.r2.cloudflarestorage.com"],
    ["BLOB_S3_ENDPOINT", "ftp://account123.r2.cloudflarestorage.com"],
  ])("fails on a malformed URL: %s=%s", (key, value) => {
    expect(issueKeys(() => loadEnv(ALL_ENV_GROUPS, { ...validEnv, [key]: value }))).toEqual([key]);
  });

  it("reports every missing or invalid key at once", () => {
    const broken = {
      ...without(validEnv, "OPENAI_API_KEY", "PINECONE_API_KEY"),
      DATABASE_URL: "nope",
      GUEST_SESSION_TTL_HOURS: "0",
    };

    let error: unknown;
    try {
      loadEnv(ALL_ENV_GROUPS, broken);
    } catch (caught) {
      error = caught;
    }

    expect(error).toBeInstanceOf(EnvValidationError);
    const { issues, message } = error as EnvValidationError;
    expect(issues.map((issue) => issue.key).sort()).toEqual([
      "DATABASE_URL",
      "GUEST_SESSION_TTL_HOURS",
      "OPENAI_API_KEY",
      "PINECONE_API_KEY",
    ]);
    expect(message).toContain("4 problems");
    for (const issue of issues) expect(message).toContain(`${issue.key}: ${issue.message}`);
  });

  it("never puts values in the error message", () => {
    const secretUrl = "mysql://user:hunter2-very-secret@db.internal:3306/app";
    const error = (() => {
      try {
        loadEnv(ALL_ENV_GROUPS, { ...validEnv, DATABASE_URL: secretUrl, CRON_SECRET: "short" });
      } catch (caught) {
        return caught as Error;
      }
    })();

    expect(error?.message).toContain("DATABASE_URL");
    expect(error?.message).not.toContain("hunter2");
    expect(error?.message).not.toContain("short");
  });

  describe("SESSION_COOKIE_SECRET", () => {
    it.each([
      ["32 bytes", Buffer.alloc(32, 1).toString("base64")],
      ["64 bytes", Buffer.alloc(64, 1).toString("base64")],
    ])("accepts base64 of %s", (_label, value) => {
      expect(loadEnv(["session"], { ...validEnv, SESSION_COOKIE_SECRET: value })).toBeDefined();
    });

    it.each([
      ["31 bytes of base64", Buffer.alloc(31, 1).toString("base64")],
      ["unpadded base64", Buffer.alloc(32, 1).toString("base64").replace(/=+$/, "")],
      ["not base64", "x".repeat(40) + "!!!!"],
    ])("rejects %s", (_label, value) => {
      expect(
        issueKeys(() => loadEnv(["session"], { ...validEnv, SESSION_COOKIE_SECRET: value })),
      ).toEqual(["SESSION_COOKIE_SECRET"]);
    });
  });

  describe("integers", () => {
    it.each(["0", "-1", "1.5", "1e3", "0x10", "72h", "1".repeat(16)])(
      "rejects GUEST_SESSION_TTL_HOURS=%s",
      (value) => {
        expect(
          issueKeys(() => loadEnv(["session"], { ...validEnv, GUEST_SESSION_TTL_HOURS: value })),
        ).toEqual(["GUEST_SESSION_TTL_HOURS"]);
      },
    );

    it("parses optional cap overrides as integers, allowing 0 as an off switch", () => {
      const caps = loadEnv(["caps"], {
        CAP_MAX_FILE_BYTES: "1000000",
        CAP_RERANKS_PER_SESSION_PER_DAY: "0",
      });

      expect(caps).toEqual({ CAP_MAX_FILE_BYTES: 1_000_000, CAP_RERANKS_PER_SESSION_PER_DAY: 0 });
    });

    it.each(["-1", "ten", "2.5"])("rejects a malformed cap override: %s", (value) => {
      expect(issueKeys(() => loadEnv(["caps"], { CAP_QUERIES_PER_MINUTE: value }))).toEqual([
        "CAP_QUERIES_PER_MINUTE",
      ]);
    });
  });

  describe("SEC_USER_AGENT", () => {
    it.each([
      ["no contact email", "RAG Playground"],
      ["the .env.example placeholder", "RAG Playground (portfolio project) you@example.com"],
    ])("rejects %s", (_label, value) => {
      expect(issueKeys(() => loadEnv(["sec"], { SEC_USER_AGENT: value }))).toEqual([
        "SEC_USER_AGENT",
      ]);
    });
  });

  describe("subset loading", () => {
    it("validates one group without unrelated keys", () => {
      const env = loadEnv(["sec"], { SEC_USER_AGENT: validEnv.SEC_USER_AGENT });

      expect(env).toEqual({ SEC_USER_AGENT: validEnv.SEC_USER_AGENT });
      expectTypeOf(env).toEqualTypeOf<{ readonly SEC_USER_AGENT: string }>();
    });

    it("merges several groups", () => {
      const env = loadEnv(["db", "dbDirect"], {
        DATABASE_URL: validEnv.DATABASE_URL,
        DATABASE_URL_DIRECT: validEnv.DATABASE_URL_DIRECT,
      });

      expect(Object.keys(env).sort()).toEqual(["DATABASE_URL", "DATABASE_URL_DIRECT"]);
      expectTypeOf(env).toEqualTypeOf<{
        readonly DATABASE_URL: string;
        readonly DATABASE_URL_DIRECT: string;
      }>();
    });

    it("reports only the requested groups' keys", () => {
      expect(issueKeys(() => loadEnv(["openai"], {})).sort()).toEqual([
        "OPENAI_API_KEY",
        "OPENAI_EMBEDDING_MODEL",
      ]);
    });

    it("keeps every key in exactly one group", () => {
      expect(new Set(schemaKeys).size).toBe(schemaKeys.length);
    });
  });
});

describe(".env.example", () => {
  const example = readFileSync(new URL("../../.env.example", import.meta.url), "utf8");
  const assignments = [...example.matchAll(/^(#\s*)?([A-Z][A-Z0-9_]*)=/gm)].map((match) => ({
    key: match[2],
    commented: match[1] !== undefined,
  }));

  it("lists exactly the schema keys", () => {
    const exampleKeys = assignments.map((entry) => entry.key);

    expect(new Set(exampleKeys).size).toBe(exampleKeys.length);
    expect([...exampleKeys].sort()).toEqual([...schemaKeys].sort());
  });

  it("comments out exactly the optional keys", () => {
    const requiredKeys = issueKeys(() => loadEnv(ALL_ENV_GROUPS, {}));
    const optionalKeys = schemaKeys.filter((key) => !requiredKeys.includes(key));
    const commentedKeys = assignments.filter((entry) => entry.commented).map((entry) => entry.key);

    expect([...commentedKeys].sort()).toEqual([...optionalKeys].sort());
  });
});
