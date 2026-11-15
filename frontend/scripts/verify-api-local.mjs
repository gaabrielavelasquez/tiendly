/** Manual acceptance on a local built Worker; no remote database or Google requests. */
import assert from 'node:assert/strict';
import { createHmac, randomUUID } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
const origin=process.argv[2]??'http://localhost:3220', url=new URL(origin);
assert(url.protocol==='http:'&&['localhost','127.0.0.1'].includes(url.hostname)&&url.origin===origin,'Only an exact local HTTP origin is allowed.');
const root=fileURLToPath(new URL('../',import.meta.url)),out=resolve(root,process.env.TIENDLY_QA_OUTPUT??'../docs/verificacion/backend-api/local');
const {chromium,webkit}=await import(process.env.PLAYWRIGHT_MODULE??'playwright');
const variables=Object.fromEntries((await readFile(resolve(root,'../backend/.dev.vars'),'utf8')).split('\n').filter(line=>line.includes('=')&&!line.trim().startsWith('#')).map(line=>{const i=line.indexOf('=');return[line.slice(0,i).trim(),line.slice(i+1).trim().replace(/^(["'])(.*)\1$/,'$2')];}));
assert(variables.BETTER_AUTH_SECRET?.length>=32,'Local Better Auth configuration is required.');
const apiOrigin='http://127.0.0.1:3221';
await mkdir(out,{recursive:true});
async function local(path,data,method=data?'POST':'GET'){
 const response=await fetch(`${apiOrigin}/cdn-cgi/local/explorer/api${path}`,{method,...(data?{headers:{'content-type':'application/json'},body:JSON.stringify(data)}:{})});
 const result=await response.json();assert(response.ok&&result.success,`Local explorer rejected ${method} ${path}.`);return result.result;
}
const database=(await local('/d1/database')).find(item=>item.name==='DB');assert(database,'Local DB is required.');
const sql=(statement,params=[])=>local(`/d1/database/${encodeURIComponent(database.uuid)}/raw`,{sql:statement,params:params.map(String)});
const navigation = { waitUntil: 'networkidle' };
const results=[];
async function fixture(context){
 const id=`ui-qa-${randomUUID()}`,token=randomUUID(),now=Date.now();
 await sql('INSERT INTO user(id,name,email,emailVerified,createdAt,updatedAt) VALUES(?,?,?,1,?,?)',[id,'QA Tiendly',`${id}@example.invalid`,now,now]);
 await sql('INSERT INTO session(id,expiresAt,token,createdAt,updatedAt,userId) VALUES(?,?,?,?,?,?)',[randomUUID(),now+3600000,token,now,now,id]);
 const signed=`${token}.${createHmac('sha256',variables.BETTER_AUTH_SECRET).update(token).digest('base64')}`;
 await context.addCookies([{name:'better-auth.session_token',value:signed,url:origin,httpOnly:true,sameSite:'Lax'}]);return id;
}
async function checkpoint(page,engine,width,name){
 await page.evaluate(async()=>{await document.fonts.ready;for(const image of document.images)image.loading='eager';for(let y=0;y<document.documentElement.scrollHeight;y+=600){scrollTo(0,y);await new Promise(resolve=>setTimeout(resolve,40));}scrollTo(0,0);await Promise.all([...document.images].map(image=>image.decode().catch(()=>{})));});
 const brokenImages=await page.evaluate(()=>[...document.images].filter(image=>!image.complete||image.naturalWidth===0).map(image=>image.getAttribute('src')));
 assert.deepEqual(brokenImages,[],`${engine}/${name}: broken images.`);
 const scrollWidth=await page.evaluate(()=>document.documentElement.scrollWidth);
 assert(scrollWidth<=width,`${engine}/${name}: horizontal overflow ${scrollWidth} > ${width}.`);
 if(width!==360)await page.screenshot({path:resolve(out,`${engine}-${width}-${name}.png`),fullPage:true});return{name,scrollWidth};
}
async function catalog(context){const response=await context.request.get(`${origin}/api/business/catalog`);assert.equal(response.status(),200);return(await response.json()).products;}
async function waitForCatalog(context,predicate){
 const deadline=Date.now()+30000;
 do { const products=await catalog(context); if(predicate(products[0]))return products; await new Promise(resolve=>setTimeout(resolve,200)); } while(Date.now()<deadline);
 throw new Error('El catálogo local no confirmó precio y versión del guardado.');
}
for(const[engineName,engine]of Object.entries({chromium,webkit})){
 const browser=await engine.launch();
 try{for(const width of[390,1440,360]){
  const context=await browser.newContext({viewport:{width,height:844}}),user=await fixture(context),checks=[],images=[];
  let store;const page=await context.newPage(),errors=[];page.on('pageerror',error=>errors.push(error.message));
  try{
   await page.goto(`${origin}/registro`, navigation);await page.getByLabel('Nombre de tu negocio',{exact:true}).waitFor();
   await page.getByLabel('Nombre de tu negocio',{exact:true}).fill(`Objetos cotidianos de cerámica e impresión 3D para casa ${randomUUID().slice(0,8)}`);
   await page.getByRole('button',{name:'Hogar y decoración',exact:true}).click();await page.getByLabel('WhatsApp de ventas',{exact:true}).fill('900000000');
   await page.getByRole('button',{name:'Crear mi tienda',exact:true}).click();await page.getByRole('heading',{name:/Tu tienda está lista/}).waitFor();
   checks.push(await checkpoint(page,engineName,width,'tienda-creada'));
   const response=await context.request.get(`${origin}/api/business/stores`);assert.equal(response.status(),200);store=(await response.json()).store;
   assert.equal((await catalog(context)).length,0);
   await page.getByRole('button',{name:'Agregar mi primer producto',exact:true}).click();
   const name='Lámpara de cerámica e impresión 3D con nombre largo para verificar el catálogo';
   await page.getByLabel('Nombre',{exact:true}).fill(name);await page.getByLabel('Precio',{exact:true}).fill('129999.10');await page.locator('#campo-stock').fill('4');
   const image=await page.evaluate(()=>{const c=document.createElement('canvas');c.width=c.height=64;const ctx=c.getContext('2d');ctx.fillStyle='gray';ctx.fillRect(0,0,64,64);return c.toDataURL('image/png').split(',')[1];});
   await page.locator('input[type=file]').setInputFiles({name:'qa-synthetic.png',mimeType:'image/png',buffer:Buffer.from(image,'base64')});
   await page.getByRole('button',{name:'Guardar producto',exact:true}).click();await page.getByText(/se guardó y ya se ve en tu tienda/).waitFor();console.log(engineName,width,'first save confirmed');
   let products=await catalog(context);assert.equal(products.length,1);assert.equal(products[0].priceCents,12999910);assert.equal(products[0].variants[0].stock,4);
   assert(products[0].primaryImage.startsWith(`/images/${store.id}/`));images.push(products[0].primaryImage.slice('/images/'.length));
   checks.push(await checkpoint(page,engineName,width,'producto-guardado'));
   await page.getByLabel('Precio',{exact:true}).fill('98765.43');await page.getByRole('button',{name:'Guardar producto',exact:true}).click();
   await waitForCatalog(context,p=>p?.priceCents===9876543&&p?.version===2);
   products=await catalog(context);assert.equal(products.length,1,'A second save must update, not duplicate.');assert.equal(products[0].version,2);
   await page.goto(`${origin}/panel/productos/${products[0].id}`, navigation);assert.equal(await page.getByLabel('Precio',{exact:true}).inputValue(),'98765.43');
   checks.push(await checkpoint(page,engineName,width,'producto-recargado'));
   await page.getByLabel('Precio',{exact:true}).fill('98765.44');
   await page.route('**/panel/productos/**',route=>route.request().method()==='POST'?route.abort('failed'):route.continue());
   await page.getByRole('button',{name:'Guardar producto',exact:true}).click();
   await page.getByText('No pudimos guardar el producto. Revisa tu conexión e inténtalo de nuevo.',{exact:true}).waitFor();
   assert.equal(await page.getByLabel('Precio',{exact:true}).inputValue(),'98765.44');
   assert.equal((await catalog(context))[0].priceCents,9876543);
   checks.push(await checkpoint(page,engineName,width,'error-recuperable'));
   await page.unroute('**/panel/productos/**');
   await page.getByRole('button',{name:'Guardar producto',exact:true}).click();
   await waitForCatalog(context,p=>p?.priceCents===9876544&&p?.version===3);
   assert.equal((await catalog(context))[0].version,3);
   const stale=await context.newPage();await stale.goto(`${origin}/panel/productos/${products[0].id}`, navigation);
   await page.getByLabel('Precio',{exact:true}).fill('98765.45');
   await page.getByRole('button',{name:'Guardar producto',exact:true}).click();
   await waitForCatalog(context,p=>p?.priceCents===9876545&&p?.version===4);
   await stale.getByLabel('Precio',{exact:true}).fill('11111.11');
   await stale.getByRole('button',{name:'Guardar producto',exact:true}).click();
   await stale.getByText('El catálogo cambió. Recarga la página antes de guardar.',{exact:true}).waitFor();
   assert.equal((await catalog(context))[0].priceCents,9876545);
   assert.equal(await stale.getByLabel('Precio',{exact:true}).inputValue(),'11111.11');
   checks.push(await checkpoint(stale,engineName,width,'conflicto-de-version'));await stale.close();
   const publicPage=await context.newPage();await publicPage.goto(`${origin}/${store.slug}`, navigation);await publicPage.getByText(name,{exact:true}).waitFor();
   assert.equal((await context.request.get(`${origin}${products[0].primaryImage}`)).status(),200);checks.push(await checkpoint(publicPage,engineName,width,'vitrina'));
   const oldCookie=(await context.cookies(origin)).filter(cookie=>cookie.name.includes('session_token')).map(cookie=>`${cookie.name}=${cookie.value}`).join('; ');
   await page.locator('summary[aria-label^="Tu cuenta"]:visible').first().click();
   await page.getByRole('button',{name:'Cerrar sesión',exact:true}).click();
   await page.getByRole('button',{name:'Sí, cerrar sesión',exact:true}).click();
   await page.waitForURL('**/registro');
   assert.equal(await (await context.request.get(`${origin}/api/auth/get-session`)).json(),null);
   assert.equal((await fetch(`${origin}/api/business/catalog`,{headers:{cookie:oldCookie}})).status,401);
   checks.push(await checkpoint(page,engineName,width,'sesion-cerrada'));
   assert.deepEqual(errors,[],'Uncaught client errors.');results.push({engine:engineName,width,pass:true,checks});
  }catch(error){results.push({engine:engineName,width,pass:false,error:error.message.split('Call log:')[0].trim()});throw error;}finally{
   if(store){const listed=await local('/r2/buckets');const bucket=(Array.isArray(listed)?listed:listed.buckets).find(item=>item.name===(process.env.TIENDLY_QA_BUCKET??'tiendly-api-local-images'));assert(bucket,'The configured local QA R2 bucket must exist.');for(const key of images)await local(`/r2/buckets/${encodeURIComponent(bucket.name)}/objects/${encodeURIComponent(key)}`,undefined,'DELETE');}
   await sql('DELETE FROM stores WHERE id IN (SELECT store_id FROM memberships WHERE user_id=?)',[user]);await sql('DELETE FROM user WHERE id=?',[user]);await context.close();
   await writeFile(resolve(out,'result.json'),JSON.stringify({complete:results.length===6&&results.every(result=>result.pass),scope:`Separate Next.js and API processes, synthetic signed sessions, real local D1/R2; does not verify Google OAuth or remote preview`,results},null,2)+'\n');
  }
 }}finally{await browser.close();}
}
console.log(JSON.stringify({passed:results.length,scope:'Local D1/R2 UI acceptance only.'}));
