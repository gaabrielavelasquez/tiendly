declare module "cloudflare:workers" {
  const env: import("@tiendly/backend/server").Bindings;
  export { env };
}
