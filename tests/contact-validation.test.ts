import { describe, expect, it } from "vitest";
import { validateContactPayload } from "../src/lib/contact/validation";
const valid = { name:"Ada", email:"ada@example.com", service:"Desarrollo Web", message:"Necesito una plataforma.", consent:true, honeypot:"" };
describe("contact validation", () => {
  it("requires consent and rejects honeypot submissions", () => {
    expect(validateContactPayload({ ...valid, consent:false })).toMatchObject({ ok:false });
    expect(validateContactPayload({ ...valid, honeypot:"bot" })).toMatchObject({ ok:false });
  });
  it("accepts the allowlisted payload", () => { expect(validateContactPayload(valid)).toMatchObject({ ok:true }); });
});
