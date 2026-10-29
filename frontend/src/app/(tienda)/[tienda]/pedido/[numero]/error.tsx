"use client";
import { ErrorCompra } from "@/features/checkout/components/error-compra";
export default function Error({ reset, retry }: { reset: () => void; retry?: () => void }) {
  return <ErrorCompra reintentar={retry ?? reset} />;
}
