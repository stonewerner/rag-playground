/**
 * Validate environment variables without starting the app.
 *
 *   pnpm env:check            # every group
 *   pnpm env:check db sec     # only these groups
 *
 * Loads .env.local, then .env; variables already set in the shell win, as in Next.js. Prints every
 * problem at once and never prints values.
 */
import { ALL_ENV_GROUPS, EnvValidationError, isEnvGroup, loadEnv } from "@/lib/env-schema";

for (const file of [".env.local", ".env"]) {
  try {
    process.loadEnvFile(file);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
  }
}

const args = process.argv.slice(2);
const unknownGroups = args.filter((arg) => !isEnvGroup(arg));

if (unknownGroups.length > 0) {
  console.error(`Unknown env group(s): ${unknownGroups.join(", ")}`);
  console.error(`Groups: ${ALL_ENV_GROUPS.join(", ")}`);
  process.exitCode = 2;
} else {
  const groups = args.length > 0 ? args.filter(isEnvGroup) : ALL_ENV_GROUPS;
  try {
    loadEnv(groups);
    console.log(`env ok (${groups.join(", ")})`);
  } catch (error) {
    if (!(error instanceof EnvValidationError)) throw error;
    console.error(error.message);
    process.exitCode = 1;
  }
}
