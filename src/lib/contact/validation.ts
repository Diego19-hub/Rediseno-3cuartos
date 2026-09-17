export type ContactPayload = {
  name: string; company: string; email: string; phone: string; service: string;
  budget: string; timeline: string; message: string; consent: boolean; honeypot: string;
};
export type ContactErrors = Partial<Record<keyof ContactPayload, string>>;
const limits: Partial<Record<keyof ContactPayload, number>> = { name: 120, company: 120, email: 254, phone: 40, service: 120, budget: 120, timeline: 120, message: 5000 };
const text = (value: unknown) => typeof value === "string" ? value.trim() : "";
export function validateContactPayload(input: unknown): { ok: true; data: ContactPayload } | { ok: false; errors: ContactErrors } {
  const source = input && typeof input === "object" ? input as Record<string, unknown> : {};
  const data: ContactPayload = { name: text(source.name), company: text(source.company), email: text(source.email).toLowerCase(), phone: text(source.phone), service: text(source.service), budget: text(source.budget), timeline: text(source.timeline), message: text(source.message), consent: source.consent === true || source.consent === 1 || source.consent === "1", honeypot: text(source.honeypot) };
  const errors: ContactErrors = {};
  (Object.keys(limits) as Array<keyof ContactPayload>).forEach((key) => { const limit = limits[key]; if (limit && typeof data[key] === "string" && data[key].length > limit) errors[key] = "Este campo supera el límite permitido."; });
  if (!data.name) errors.name = "Indica tu nombre.";
  if (!data.email || !/^\S+@\S+\.\S+$/.test(data.email)) errors.email = "Indica un correo válido.";
  if (!data.service) errors.service = "Selecciona un servicio.";
  if (!data.message) errors.message = "Cuéntanos brevemente tu proyecto.";
  if (!data.consent) errors.consent = "Necesitamos tu consentimiento para continuar.";
  if (data.honeypot) errors.honeypot = "Solicitud no válida.";
  return Object.keys(errors).length ? { ok: false, errors } : { ok: true, data };
}
