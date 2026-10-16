import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// tailwind-merge necesita conocer los nombres propios del sistema para no borrar clases válidas.
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [{ text: ["display", "h1", "h2", "h3", "body-lg", "body", "body-sm", "caption", "label"] }],
      rounded: [{ rounded: ["card", "button", "chip", "theme"] }],
      shadow: [{ shadow: ["card", "float", "overlay", "celebration", "soft"] }],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
