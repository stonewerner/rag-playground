import "server-only";

import { APP_ENV_GROUPS, loadEnv, type AppEnv } from "./env-schema";

let cached: AppEnv | undefined;

function appEnv(): AppEnv {
  cached ??= loadEnv(APP_ENV_GROUPS);
  return cached;
}

/**
 * Validated app environment (every group in `APP_ENV_GROUPS`). Server-only: importing this from a
 * client component fails the build.
 *
 * Validation runs on first property access, not at import, so `next build` (which imports route
 * modules) works without secrets, e.g. in CI. The first read of any key validates every app key
 * and throws `EnvValidationError` listing all problems, before any vendor call can happen.
 *
 * Scripts and tests that run outside Next.js use `loadEnv([...groups])` from `./env-schema`.
 */
export const env: AppEnv = new Proxy({} as AppEnv, {
  get: (_target, key) => Reflect.get(appEnv(), key),
  has: (_target, key) => Reflect.has(appEnv(), key),
});
