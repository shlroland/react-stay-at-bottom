import { test, assert } from "vitest"
import { foo } from "../src/use-stay-bottom"

test("simple", () => {
  assert.equal(foo, "foo")
})
