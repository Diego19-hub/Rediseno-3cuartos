import { readFileSync } from "node:fs";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Button } from "../src/components/ui/button";
import { ProvisionalBadge } from "../src/components/ui/provisional-badge";
import { FormField } from "../src/components/ui/form-field";
describe("UI system",()=>{it("renders button variants and disabled state",()=>{expect(renderToStaticMarkup(<Button disabled>Enviar</Button>)).toContain("disabled" )});it("links field errors and provisional labels",()=>{expect(renderToStaticMarkup(<FormField error="Error" id="email" label="Correo"/>)).toContain("aria-describedby=\"email-error\"");expect(renderToStaticMarkup(<ProvisionalBadge/>)).toContain("Provisional")});it("keeps mobile menu accessibility contract",()=>{const source=readFileSync("src/components/layout/mobile-menu.tsx","utf8");expect(source).toContain("aria-expanded");expect(source).toContain("aria-controls")});});
