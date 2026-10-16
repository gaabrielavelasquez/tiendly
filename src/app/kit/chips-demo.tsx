"use client";

import { useState } from "react";
import { Chip } from "@/components/ui";

const tallas = ["36", "37", "38", "39", "40"];

export function ChipsDemo() {
  const [talla, setTalla] = useState("38");
  return (
    <div role="group" aria-label="Talla" className="flex flex-wrap gap-2">
      {tallas.map((t) => (
        <Chip key={t} selected={t === talla} onClick={() => setTalla(t)}>
          {t}
        </Chip>
      ))}
    </div>
  );
}
