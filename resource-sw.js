/* Only first-party static game files use the resource cache. Never intercept NPC APIs. */
importScripts('resource-manifest.js');
const manifest=self.HOME_RESOURCE_MANIFEST,base=new URL('./',self.location.href),entries=new Map(manifest.entries.map(e=>[new URL(e.path,base).pathname,e]));
self.addEventListener('install',event=>event.waitUntil(self.skipWaiting()));
self.addEventListener('activate',event=>event.waitUntil(self.clients.claim()));
const key=e=>new URL(e.path+'?v='+e.hash.slice(0,10),base).href;
async function saved(e){
 const response=await caches.match(key(e));
 return response?.ok&&response.headers.get('X-Home-Resource')===e.hash&&Number(response.headers.get('Content-Length'))===e.bytes?response:null;
}
self.addEventListener('fetch',event=>{
 const request=event.request,url=new URL(request.url);
 if(request.method!=='GET'||url.origin!==base.origin||!url.pathname.startsWith(base.pathname)||url.pathname.startsWith(base.pathname+'api/')||request.headers.has('Range'))return;
 if(url.pathname===new URL('resource-manifest.js',base).pathname){event.respondWith(fetch(request,{cache:'no-store'}).catch(()=>new Response('self.HOME_RESOURCE_MANIFEST='+JSON.stringify(manifest)+';',{headers:{'Content-Type':'text/javascript; charset=utf-8','Cache-Control':'no-store'}})));return}
 const entry=entries.get(url.pathname===base.pathname?new URL('index.html',base).pathname:url.pathname);if(!entry)return;
 if(url.searchParams.has('v')&&url.searchParams.get('v')!==entry.hash.slice(0,10))return;
 event.respondWith((async()=>{
  if(entry.path==='index.html'&&request.mode==='navigate'){try{return await fetch(request)}catch{const cached=await saved(entry);if(cached)return cached;throw Error('offline')}}
  return await saved(entry)||fetch(request);
 })());
});
