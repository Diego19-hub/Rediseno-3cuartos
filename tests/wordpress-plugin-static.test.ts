import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const plugin = readFileSync(resolve("wordpress/plugins/3cuartos-content-model/includes/class-meta-fields.php"), "utf8");
const rest = readFileSync(resolve("wordpress/plugins/3cuartos-content-model/includes/class-rest-api.php"), "utf8");
const cli = readFileSync(resolve("wordpress/plugins/3cuartos-content-model/includes/class-cli.php"), "utf8");
describe("WordPress plugin static contract", () => {
  it("declares CPT metadata, provisional state and sanitizers", () => { expect(plugin).toContain("3cuartos_is_provisional"); expect(plugin).toContain("sanitize_callback"); expect(plugin).toContain("show_in_rest"); });
  it("publishes only the scoped public settings endpoint", () => { expect(rest).toContain("3cuartos/v1"); expect(rest).toContain("/settings"); expect(rest).not.toContain("recipient"); });
  it("provides an idempotent provisional-content command", () => { expect(cli).toContain("3cuartos seed-demo"); expect(cli).toContain("get_page_by_path"); expect(cli).toContain("3cuartos_is_provisional"); });
});
