import { readFileSync } from "node:fs";

const jsonPath = new URL("../docs/design-tokens.json", import.meta.url);
const cssPath = new URL("../src/styles/tokens.css", import.meta.url);
const tokensDocument = JSON.parse(readFileSync(jsonPath, "utf8"));
const css = readFileSync(cssPath, "utf8");
const tokens = [];

function visit(value, path = []) {
  if (!value || typeof value !== "object") return;
  if (Object.hasOwn(value, "$value") && Object.hasOwn(value, "$type")) {
    tokens.push({ path: path.join("."), type: value.$type, value: value.$value });
  }
  for (const [key, child] of Object.entries(value)) {
    if (!key.startsWith("$")) visit(child, [...path, key]);
  }
}

visit(tokensDocument);
const byPath = new Map(tokens.map((token) => [token.path, token]));
const failures = [];
const cssVariables = new Map();
for (const match of css.matchAll(/(--[a-z0-9-]+)\s*:\s*([^;{}]+);/gi)) {
  const [, name, value] = match;
  cssVariables.set(name, [...(cssVariables.get(name) ?? []), value.trim()]);
}

const cssName = (path) => `--${path.replace(/^core\./, "").replaceAll(".", "-")}`;
const resolve = (token, trail = []) => {
  if (typeof token.value !== "string" || !/^\{.+\}$/.test(token.value)) return token.value;
  const reference = `core.${token.value.slice(1, -1)}`;
  if (trail.includes(reference)) throw new Error(`Alias circular: ${[...trail, reference].join(" → ")}`);
  const target = byPath.get(reference);
  if (!target) throw new Error(`Alias roto: ${token.path} → ${reference}`);
  return resolve(target, [...trail, token.path]);
};

const aliases = tokens.filter((token) => typeof token.value === "string" && /^\{.+\}$/.test(token.value));
const colors = tokens.filter((token) => token.type === "color");
const byType = Object.fromEntries([...new Set(tokens.map((token) => token.type))].sort().map((type) => [type, tokens.filter((token) => token.type === type).length]));

if (tokens.length !== 95) failures.push(`Esperados 95 tokens; encontrados ${tokens.length}.`);
if (colors.length !== 25) failures.push(`Esperados 25 colores; encontrados ${colors.length}.`);
if (aliases.length !== 13) failures.push(`Esperados 13 aliases; encontrados ${aliases.length}.`);
if (tokens.some((token) => token.value === "" || token.value == null)) failures.push("Hay tokens con valor vacío.");

for (const token of tokens) {
  if (token.type === "typography") continue;
  const name = cssName(token.path);
  if (!cssVariables.has(name)) failures.push(`Sin variable CSS: ${token.path} (${name}).`);
  if (typeof token.value === "string" && /^\{.+\}$/.test(token.value)) {
    const targetName = cssName(`core.${token.value.slice(1, -1)}`);
    if (cssVariables.get(name)?.[0] !== `var(${targetName})`) failures.push(`Alias CSS no preservado: ${token.path}.`);
  }
}

for (const token of colors) {
  const resolved = resolve(token);
  if (typeof resolved !== "string" || !/^#[0-9a-f]{6}$/i.test(resolved)) failures.push(`Color inválido: ${token.path}.`);
}

for (const alias of aliases) {
  try { resolve(alias); } catch (error) { failures.push(error.message); }
}

const typographyProperties = {
  fontFamilies: "font-family",
  fontSizes: "font-size",
  fontWeights: "font-weight",
  letterSpacing: "letter-spacing",
  lineHeights: "line-height",
  textCase: "text-transform",
  textDecoration: "text-decoration",
};
for (const token of tokens.filter((entry) => entry.type === "typography")) {
  const prefix = cssName(token.path);
  for (const [property, suffix] of Object.entries(typographyProperties)) {
    const name = `${prefix}-${suffix}`;
    const expected = Array.isArray(token.value[property]) ? `"${token.value[property][0]}"` : String(token.value[property]);
    if (cssVariables.get(name)?.[0] !== expected) failures.push(`Tipografía CSS no correspondiente: ${token.path}.${property}.`);
  }
}

for (const [name, values] of cssVariables) {
  if (values.length > 1) failures.push(`Variable CSS duplicada: ${name}.`);
}

const knownSix = {
  "--color-neutral-50": "#f7f7f5",
  "--color-text-primary": "var(--color-neutral-900)",
  "--color-accent-500": "#245b68",
  "--color-accent-600": "#1c4853",
  "--color-action-primary-active": "#163a43",
  "--color-status-error": "#8e2c22",
};
for (const [name, value] of Object.entries(knownSix)) {
  if (cssVariables.get(name)?.[0]?.toLowerCase() !== value.toLowerCase()) failures.push(`Diferencia en token histórico: ${name}.`);
}

const luminance = (hex) => {
  const channels = hex.match(/[a-f\d]{2}/gi).map((channel) => Number.parseInt(channel, 16) / 255);
  const [red, green, blue] = channels.map((channel) => channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4);
  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
};
const contrast = (foreground, background) => {
  const [light, dark] = [luminance(foreground), luminance(background)].sort((a, b) => b - a);
  return (light + 0.05) / (dark + 0.05);
};
const primaryContrast = contrast("#171716", "#F7F7F5");
const defaultContrast = contrast("#171716", "#FFFFFF");
if (primaryContrast < 4.5 || defaultContrast < 4.5) failures.push("Contraste AA insuficiente para texto principal.");

const extensionMarker = "Extensiones técnicas temporales";
if (!css.includes(extensionMarker)) failures.push("No se encontró la separación de extensiones técnicas.");
const foundationCount = [...cssVariables.keys()].filter((name) => !["--font-sans", "--container-gutter", "--easing-standard", "--easing-emphasized"].includes(name)).length;

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log(JSON.stringify({
  tokens: tokens.length,
  byType,
  colorAliases: aliases.length,
  foundationCssVariables: foundationCount,
  temporaryExtensions: 4,
  textPrimaryContrast: { canvas: Number(primaryContrast.toFixed(2)), defaultSurface: Number(defaultContrast.toFixed(2)) },
}, null, 2));
