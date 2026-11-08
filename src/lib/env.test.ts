import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

// env.ts can't be imported outside Next.js (the Next compiler resolves its `server-only` import),
// so this guards its source. Validation behaviour is covered in env-schema.test.ts.
describe("env.ts", () => {
  it('starts with the `import "server-only"` guard', () => {
    const source = readFileSync(new URL("./env.ts", import.meta.url), "utf8");

    expect(source.trimStart().startsWith('import "server-only";')).toBe(true);
  });
});
