/** Quita el protocolo para mostrar un link real sin alterar su dominio ni ruta. */
export const sinProtocolo = (url: string) => url.replace(/^https?:\/\//, "");
