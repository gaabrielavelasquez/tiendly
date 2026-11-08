import {test} from 'node:test';
import assert from 'node:assert/strict';
import {toCatalogInput,fromCatalog} from '../../frontend/src/lib/catalog-mapping.ts';

test('frontend boundary preserves cart IDs, cents, variant keys, gallery order and measurement modes',()=>{
 for(const tablaTallas of [undefined,null,{medidas:['Alto'],filas:{'':['12']}}]) {
  const original={id:'m1',nombre:'Jarrón',estado:'activo',precio:90.99,precioAntes:129.10,categorias:['Hogar'],opciones:[{nombre:'Color',tipo:'color',valores:['Plata','Negro']}],variantes:[{valores:['Plata'],stock:1},{valores:['Negro'],stock:2}],imagen:'/tiendas-ejemplo/muna/first.webp',fotos:{Plata:['/tiendas-ejemplo/muna/first.webp','/tiendas-ejemplo/muna/second.webp'],Negro:[]},...(tablaTallas===undefined?{}:{tablaTallas})};
  const input=toCatalogInput(original);
  const result=fromCatalog({...input,id:original.id,storeId:'test',slug:'jarron',version:4,createdAt:'2026-11-08T00:00:00Z',updatedAt:'2026-11-08T00:00:00Z'});
  assert.equal(result.id,original.id);assert.equal(input.priceCents,9099);assert.equal(result.precio,90.99);assert.equal(result.precioAntes,129.10);assert.equal(result.version,4);
  assert.deepEqual(result.variantes,original.variantes);assert.deepEqual(result.fotos,original.fotos);assert.deepEqual(result.tablaTallas,tablaTallas);
  assert.equal(Object.hasOwn(result,'tablaTallas'),tablaTallas!==undefined);
 }
});
