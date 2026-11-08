import { toCents, type Product, type ProductInput, type Option } from '@tiendly/backend/rules';
import type { Producto, TipoOpcion } from '@/features/productos/types';
const kind:Record<TipoOpcion,Option['kind']>={color:'color',talla:'size',otra:'other'};
const type:Record<Option['kind'],TipoOpcion>={color:'color',size:'talla',other:'otra'};

/** Solo el borde de la aplicación conoce los nombres españoles del frontend. */
export function toCatalogInput(product:Producto):ProductInput {
  return {
    name:product.nombre,description:product.descripcion??'',sku:product.sku??'',categories:product.categorias,
    status:product.estado==='activo'?'active':'paused',priceCents:toCents(product.precio),compareAtCents:product.precioAntes===undefined?null:toCents(product.precioAntes),
    offer:product.oferta?{...(product.oferta.desde?{from:product.oferta.desde}:{}),...(product.oferta.hasta?{until:product.oferta.hasta}:{})}:null,
    options:product.opciones.map(o=>({name:o.nombre,kind:kind[o.tipo],values:o.valores})),variants:product.variantes.map(v=>({values:v.valores,stock:v.stock})),
    ...(product.opcionFotos===undefined?{}:{photoOption:product.opcionFotos}),primaryImage:product.imagen??null,photos:product.fotos??{},
    ...(product.tablaTallas===undefined?{}:{measurements:product.tablaTallas===null?null:{columns:product.tablaTallas.medidas,rows:product.tablaTallas.filas}}),
  };
}
export function fromCatalog(product:Product):Producto {
  return {
    id:product.id,version:product.version,nombre:product.name,descripcion:product.description,sku:product.sku,categorias:product.categories,
    estado:product.status==='active'?'activo':'pausado',precio:product.priceCents/100,
    ...(product.compareAtCents===null?{}:{precioAntes:product.compareAtCents/100}),
    ...(product.offer===null?{}:{oferta:{desde:product.offer.from,hasta:product.offer.until}}),
    opciones:product.options.map(o=>({nombre:o.name,tipo:type[o.kind],valores:o.values})),variantes:product.variants.map(v=>({valores:v.values,stock:v.stock})),
    ...(product.photoOption===undefined?{}:{opcionFotos:product.photoOption}),...(product.primaryImage?{imagen:product.primaryImage}:{}),fotos:product.photos,
    ...(product.measurements===undefined?{}:{tablaTallas:product.measurements===null?null:{medidas:product.measurements.columns,filas:product.measurements.rows}}),
  };
}
