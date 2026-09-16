import { describe, expect, it } from "vitest";
import { shouldReduceMotion } from "../src/lib/animations/reduced-motion";

describe("shouldReduceMotion", () => {
  it("preserves the browser preference", () => {
    expect(shouldReduceMotion(true)).toBe(true);
    expect(shouldReduceMotion(false)).toBe(false);
  });
});
