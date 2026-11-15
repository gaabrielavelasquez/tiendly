import "server-only";
import { usingApi, privateSnapshot } from "./api-client";
import { headers } from "next/headers";
import { ownedStore } from "@tiendly/backend/server";
import { businessRuntime } from "@/lib/business-runtime";

/** Store ownership always comes from the verified session and membership query. */
export async function ownedPanelSlug(): Promise<string | null> {
  if (usingApi()) return (await privateSnapshot())?.store.slug ?? null;
  const { runtime } = await businessRuntime();
  const actor = await runtime.actor(await headers());
  if (!actor) return null;
  return (await ownedStore(runtime.stores, actor))?.slug ?? null;
}
