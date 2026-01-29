import { describe, it } from "mocha";
import assert from "assert";

describe("Example Test Suite", () => {
  it("should pass a simple assertion", () => {
    assert.strictEqual(1 + 1, 2);
  });

  it("should handle async operations", async () => {
    const promise = Promise.resolve("test");
    const result = await promise;
    assert.strictEqual(result, "test");
  });

  it("should test array operations", () => {
    const arr = [1, 2, 3];
    assert.strictEqual(arr.length, 3);
    assert.strictEqual(arr[0], 1);
  });
});
