import { expect, test } from "vitest";

// P0-02 verification only: proves a failing test makes CI fail. Reverted on this branch, never merged.
test("deliberately failing test (P0-02 CI check)", () => {
  expect(1).toBe(2);
});
