/** Remote acceptance restricted to Tiendly preview; no production resources. */
import assert from 'node:assert/strict';
import { createHmac, randomUUID } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
const origin='https://preview.tiendly.workers.dev';
const root=fileURLToPath(new URL('../',import.meta.url));
const out=resolve(root,'../docs/verificacion/d1-r2-preview');
const secretFile=process.argv[2];
assert(secretFile?.startsWith('/private/tmp/'),'A private temporary session-secret file is required.');
const variables=JSON.parse(await readFile(secretFile,'utf8'));
assert(variables.BETTER_AUTH_SECRET?.length>=32);
const config=JSON.parse(await readFile(resolve(root,'.wrangler/preview/wrangler.json'),'utf8'));
const account='59f2586c7dd8a0467d1f9e444129e03a',database='9fcfd54b-56a2-4cb9-af11-800e5191e93d';
assert.equal(config.account_id,account);assert.equal(config.name,'preview');
assert.equal(config.d1_databases[0].database_id,database);
assert.equal(config.vars.BETTER_AUTH_URL,origin);assert.equal(config.vars.TIENDLY_ENTORNO,'preview');
assert.equal(config.vars.TIENDLY_TEST_LOGIN,undefined);
const credentials=JSON.parse(execFileSync('npx',['wrangler','auth','token','--profile','tiendly','--json'],{cwd:root,encoding:'utf8'}));
assert(credentials.token,'Wrangler Tiendly session is required.');
const {chromium,webkit}=await import(process.env.PLAYWRIGHT_MODULE??'playwright');
await mkdir(out,{recursive:true});
async function cloud(path,data,method=data?'POST':'GET'){
 const response=await fetch('https://api.cloudflare.com/client/v4'+path,{method,headers:{authorization:'Bearer '+credentials.token,...(data?{'content-type':'application/json'}:{})},...(data?{body:JSON.stringify(data)}:{})});
 const text=await response.text(),payload=text?JSON.parse(text):null;
 assert(response.ok&&payload?.success!==false,`Preview resource request failed: ${method} ${path} (${response.status}).`);
 return payload?.result;
}
const sql=async(statement,params=[])=>{
 const result=await cloud(`/accounts/${account}/d1/database/${database}/query`,{sql:statement,params});
 assert(result.every(entry=>entry.success!==false),'Preview D1 query failed.');return result[0].results;
};
assert.deepEqual((await sql('SELECT name FROM d1_migrations ORDER BY id')).map(row=>row.name),['0001_auth.sql','0002_stores.sql','0003_catalog.sql']);
assert.equal((await fetch(origin+'/api/business/stores')).status,401);
assert.equal((await fetch(origin+'/api/business/catalog',{headers:{cookie:'tiendly_tienda=muna'}})).status,401);
const results=[];
async function fixture(context){
 const id=`ui-qa-${randomUUID()}`,token=randomUUID(),now=Date.now();
 await sql('INSERT INTO user(id,name,email,emailVerified,createdAt,updatedAt) VALUES(?,?,?,1,?,?)',[id,'QA Tiendly',`${id}@example.invalid`,now,now]);
 await sql('INSERT INTO session(id,expiresAt,token,createdAt,updatedAt,userId) VALUES(?,?,?,?,?,?)',[randomUUID(),now+3600000,token,now,now,id]);
 const signed=`${token}.${createHmac('sha256',variables.BETTER_AUTH_SECRET).update(token).digest('base64')}`;
 await context.addCookies([{name:'__Secure-better-auth.session_token',value:signed,url:origin,httpOnly:true,secure:true,sameSite:'Lax'}]);return id;
}
async function checkpoint(page,engine,width,name){
 await page.evaluate(async()=>{await document.fonts.ready;for(let y=0;y<document.documentElement.scrollHeight;y+=600){scrollTo(0,y);await new Promise(resolve=>setTimeout(resolve,40));}scrollTo(0,0);await Promise.all([...document.images].map(image=>image.decode().catch(()=>{})));});
 const brokenImages=await page.evaluate(()=>[...document.images].filter(image=>!image.complete||image.naturalWidth===0).map(image=>image.getAttribute('src')));
 assert.deepEqual(brokenImages,[],`${engine}/${name}: broken images.`);
 const scrollWidth=await page.evaluate(()=>document.documentElement.scrollWidth);
 assert(scrollWidth<=width,`${engine}/${name}: horizontal overflow ${scrollWidth} > ${width}.`);
 if(width!==360)await page.screenshot({path:resolve(out,`${engine}-${width}-${name}.jpg`),type:'jpeg',quality:82,fullPage:true});return{name,scrollWidth};
}
async function catalog(context){const response=await context.request.get(`${origin}/api/business/catalog`);assert.equal(response.status(),200);return(await response.json()).products;}
async function waitForCatalog(context,predicate){
 const deadline=Date.now()+30000;
 do{
  const products=await catalog(context);
  if(predicate(products[0]))return products;
  await new Promise(resolve=>setTimeout(resolve,200));
 }while(Date.now()<deadline);
 throw new Error('El guardado no se confirmó en el catálogo remoto.');
}
async function verifyRemoteAccess(){
 const browser=await chromium.launch(),context=await browser.newContext(),user=await fixture(context);
 try{
  const created=await context.request.post(origin+'/api/business/stores',{headers:{origin},data:{name:'QA de acceso a almacenamiento',slug:'qa-access-'+randomUUID().slice(0,8),salesPhone:'900000000',categories:['home'],otherCategory:''}});
  assert.equal(created.status(),201);const store=(await created.json()).store;
  const crossOrigin=await context.request.patch(origin+'/api/business/stores',{headers:{origin:'https://foreign.invalid'},data:{id:store.id,version:store.version,name:'Cambio rechazado'}});
  assert.equal(crossOrigin.status(),403);
  const missingOrigin=await context.request.patch(origin+'/api/business/stores',{data:{id:store.id,version:store.version,name:'Cambio rechazado'}});
  assert.equal(missingOrigin.status(),403);
  const image=await context.request.post(origin+'/api/business/images',{headers:{origin,'content-type':'image/png'},data:Buffer.from('not-an-image')});
  assert.equal(image.status(),400);
  const google=await context.request.post(origin+'/api/auth/sign-in/social',{headers:{origin},data:{provider:'google',callbackURL:'/registro'}});
  assert(google.status()>=400);assert.equal(google.headers().location,undefined);
  const before=await context.request.get(origin+'/api/business/stores');assert.equal(before.status(),200);
  const logout=await context.request.post(origin+'/api/auth/sign-out',{headers:{origin},data:{}});assert.equal(logout.status(),200);
  const revoked=await context.request.get(origin+'/api/business/stores');assert.equal(revoked.status(),401);
  const evidence={unauthenticated:401,forgedSlugCookie:401,crossOrigin:403,missingOrigin:403,invalidImage:400,googleUnavailable:google.status(),sessionRevoked:401,pass:true};
  await writeFile(resolve(out,'access.json'),JSON.stringify(evidence,null,2)+'\n');console.log(JSON.stringify(evidence));
 }finally{
  await sql('DELETE FROM stores WHERE id IN (SELECT store_id FROM memberships WHERE user_id=?)',[user]);
  await sql('DELETE FROM user WHERE id=?',[user]);await browser.close();
 }
}
if(process.argv.includes('--security-only')){await verifyRemoteAccess();process.exit(0);}
for(const[engineName,engine]of Object.entries({chromium,webkit})){
 const browser=await engine.launch();
 try{for(const width of[390,1440,360]){
  const context=await browser.newContext({viewport:{width,height:844}}),user=await fixture(context),checks=[],images=[];
  let store;const page=await context.newPage(),errors=[];page.on('pageerror',error=>errors.push(error.message));
  try{
   await page.goto(`${origin}/registro`);await page.getByLabel('Nombre de tu negocio',{exact:true}).waitFor();
   await page.getByLabel('Nombre de tu negocio',{exact:true}).fill(`Objetos cotidianos de cerámica e impresión 3D para casa ${randomUUID().slice(0,8)}`);
   await page.getByRole('button',{name:'Hogar y decoración',exact:true}).click();await page.getByLabel('WhatsApp de ventas',{exact:true}).fill('900000000');
   await page.getByRole('button',{name:'Crear mi tienda',exact:true}).click();await page.getByRole('heading',{name:/Tu tienda está lista/}).waitFor();
   checks.push(await checkpoint(page,engineName,width,'tienda-creada'));
   const response=await context.request.get(`${origin}/api/business/stores`);assert.equal(response.status(),200);store=(await response.json()).store;
   assert.equal((await context.request.patch(`${origin}/api/business/stores`,{headers:{origin:'https://foreign.invalid'},data:{id:store.id,version:store.version,name:'Cambio rechazado'}})).status(),403);
   assert.equal((await context.request.post(`${origin}/api/business/images`,{headers:{origin,'content-type':'image/png'},data:Buffer.from('not-an-image')})).status(),400);
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
   products=await waitForCatalog(context,p=>p?.priceCents===9876543);
   assert.equal(products.length,1,'A second save must update, not duplicate.');
   assert.equal(products[0].version,2);
   await page.goto(`${origin}/panel/productos/${products[0].id}`);assert.equal(await page.getByLabel('Precio',{exact:true}).inputValue(),'98765.43');
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
   assert.equal((await waitForCatalog(context,p=>p?.priceCents===9876544))[0].version,3);
   const stale=await context.newPage();await stale.goto(`${origin}/panel/productos/${products[0].id}`);
   await page.getByLabel('Precio',{exact:true}).fill('98765.45');
   await page.getByRole('button',{name:'Guardar producto',exact:true}).click();
   await waitForCatalog(context,p=>p?.version===4);
   await stale.getByLabel('Precio',{exact:true}).fill('11111.11');
   await stale.getByRole('button',{name:'Guardar producto',exact:true}).click();
   await stale.getByText('El producto cambió. Recarga la página antes de guardar.',{exact:true}).waitFor();
   assert.equal((await catalog(context))[0].priceCents,9876545);
   assert.equal(await stale.getByLabel('Precio',{exact:true}).inputValue(),'11111.11');
   checks.push(await checkpoint(stale,engineName,width,'conflicto-de-version'));await stale.close();
   const publicPage=await context.newPage();await publicPage.goto(`${origin}/${store.slug}`);await publicPage.getByText(name,{exact:true}).waitFor();
   const publicImage=await fetch(`${origin}${products[0].primaryImage}`);assert.equal(publicImage.status,200);assert(publicImage.headers.get('content-type')?.startsWith('image/'));assert((await publicImage.arrayBuffer()).byteLength>0);checks.push(await checkpoint(publicPage,engineName,width,'vitrina'));
   assert.deepEqual(errors,[],'Uncaught client errors.');results.push({engine:engineName,width,pass:true,checks});
  }catch(error){results.push({engine:engineName,width,pass:false,error:error.message});throw error;}finally{
   if(store){for(const key of images){assert(key.startsWith(store.id+'/'));await cloud(`/accounts/${account}/r2/buckets/tiendly-preview-images/objects/${key}`,undefined,'DELETE');}}
   await sql('DELETE FROM stores WHERE id IN (SELECT store_id FROM memberships WHERE user_id=?)',[user]);await sql('DELETE FROM user WHERE id=?',[user]);await context.close();
   await writeFile(resolve(out,'result.json'),JSON.stringify({complete:results.length===6&&results.every(result=>result.pass),scope:'Deployed Tiendly preview, synthetic signed sessions, real remote D1/R2; Google OAuth remains pending',results},null,2)+'\n');
  }
 }}finally{await browser.close();}
}
console.log(JSON.stringify({passed:results.length,scope:'Remote D1/R2 UI acceptance with synthetic sessions; no real Google sign-in.'}));
