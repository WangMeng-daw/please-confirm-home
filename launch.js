/* The launch page owns resource preparation, never the phone's story or save. */
(()=>{
 'use strict';
 const host=document.getElementById('launch-host');if(!host)return;
 const embedded=Boolean(window.HOME_ASSETS),manifest=window.HOME_RESOURCE_MANIFEST;
 const base=new URL('./',location.href),prefix='confirm-home-resources-';
 const art=id=>embedded&&typeof asset==='function'?asset(id):new URL('assets/'+id+'.png',base).href;
 let hasSave=false;try{hasSave=Boolean(JSON.parse(localStorage.getItem('confirm-home-immersive-v3'))?.started)}catch{}
 host.innerHTML=`<main class="launch-shell" aria-label="请确认回家启动页"><img class="launch-art" src="${art('launch-poster')}" alt="林砚手持寻人启事，站在雨夜的旧家门前"><section class="launch-content"><p class="launch-series">请确认系列 ／ 第三部</p><p class="launch-kicker">那天，你让她再等一会儿。</p><h1 class="launch-title"><img src="${art('launch-title')}" alt="请确认回家"></h1><p class="launch-english">PLEASE CONFIRM HOMECOMING</p><div class="launch-story"><p>8 月 13 日，<strong>林小禾放学后失踪</strong>。那天你在开会，让她在校门口等一会儿。</p><p>一个多月了。你报了警，也贴过寻人启事，还是没有她的消息。你叫<strong>林砚</strong>，是小禾的爸爸。今晚，你又拿起了手机。</p></div><p class="launch-tagline">你在等她回来。门里，也有东西在等。</p><section class="launch-download" aria-label="准备游戏资源"><div class="launch-download-head"><span>准备回家</span><span id="launch-amount">检查资源中</span></div><progress id="launch-progress" class="launch-progress" max="100" value="0" aria-label="游戏资源下载进度"></progress><p id="launch-status" class="launch-status" role="status" aria-live="polite">正在检查本地资源…</p><div class="launch-buttons"><button type="button" class="launch-button" id="launch-download" disabled>下载游戏资源</button><button type="button" class="launch-button secondary" id="launch-play">${hasSave?'继续游戏':'开始寻找'}</button></div><button type="button" id="launch-pause" class="launch-pause" hidden>暂停下载</button></section><footer class="launch-footer"><span>手机恐怖解谜 ／ 多结局</span><span>www 制作</span></footer></section></main>`;
 const el=id=>document.getElementById('launch-'+id),download=el('download'),play=el('play'),pause=el('pause'),status=el('status'),progress=el('progress'),amount=el('amount');
 let cache=null,completed=new Set(),completedBytes=0,working=false,controller=null,available=false,failed=false,checked=false,lastPaint=0;
 const transfers=new Map(),entries=manifest?.entries||[],total=manifest?.totalBytes||0;
 const cacheURL=e=>new URL(e.path+'?v='+e.hash.slice(0,10),base).href;
 const size=b=>(b/1048576).toFixed(1)+' MB';
 const previousText=window.render_game_to_text;
 window.render_game_to_text=()=>JSON.stringify({screen:'launch',game:'请确认回家',returningPlayer:hasSave,embedded,resources:{checked,available,working,completed:completed.size,total:entries.length,completedBytes,totalBytes:total},visibleText:host.innerText});
 const paint=(force=false)=>{
  if(!force&&performance.now()-lastPaint<80)return;lastPaint=performance.now();
  const loaded=completedBytes+[...transfers.values()].reduce((a,b)=>a+b,0);
  progress.value=total?Math.min(100,loaded/total*100):embedded?100:0;
  amount.textContent=embedded?'资源已包含':total?size(Math.min(total,loaded))+' / '+size(total):'资源不可用';
  download.disabled=!available||working||completed.size===entries.length;pause.hidden=!working;
  download.textContent=completed.size===entries.length&&entries.length?'资源已保存':completed.size||failed?'继续下载资源':'下载游戏资源';
 };
 const valid=(response,e)=>response?.ok&&response.headers.get('X-Home-Resource')===e.hash&&Number(response.headers.get('Content-Length'))===e.bytes;
 async function inspect(){
  completed=new Set();completedBytes=0;
  for(const e of entries){const response=await cache.match(cacheURL(e));if(valid(response,e)){completed.add(e.path);completedBytes+=e.bytes}}
  checked=true;paint(true);
 }
 async function waitWorker(reg){
  const worker=reg.installing||reg.waiting;if(!worker){if(reg.active)return;throw Error('worker')}
  await new Promise((resolve,reject)=>{const timer=setTimeout(()=>reject(Error('worker-timeout')),8000);const changed=()=>{if(worker.state==='activated'){clearTimeout(timer);worker.removeEventListener('statechange',changed);resolve()}else if(worker.state==='redundant'){clearTimeout(timer);reject(Error('worker-failed'))}};worker.addEventListener('statechange',changed);changed()});
 }
 async function prepare(){
  if(embedded){checked=true;progress.value=100;amount.textContent='资源已包含';status.textContent='全部图片已随此文件保存，可直接开始。';download.textContent='资源已保存';return}
  if(!manifest||!window.isSecureContext||!('caches'in window)||!('serviceWorker'in navigator)){checked=true;amount.textContent=total?size(total):'—';status.textContent='此浏览器无法保存资源，可直接开始；离线游玩请打开随包的独立版。';return}
  try{
   let reg=await navigator.serviceWorker.getRegistration(base.href);
   try{reg=await navigator.serviceWorker.register(new URL('resource-sw.js',base),{scope:base.pathname,updateViaCache:'none'});await reg.update()}catch(error){if(!reg?.active)throw error}
   await waitWorker(reg);
   cache=await caches.open(manifest.cacheName);await inspect();available=true;
   status.textContent=completed.size===entries.length?'资源已保存到本地，图片将优先从此设备读取。':completed.size?'已保存 '+completed.size+' / '+entries.length+' 项，剩余资源可继续下载。':'首次下载共 '+size(total)+'，之后可从本地直接读取图片。';paint(true);
  }catch{checked=true;status.textContent='本地资源暂时无法保存，可以直接开始游戏。';paint(true)}
 }
 async function reuse(e,oldNames){
  for(const name of oldNames){const old=await caches.open(name),response=await old.match(cacheURL(e));if(valid(response,e)){await cache.put(cacheURL(e),response);return true}}
  return false;
 }
 async function tidyOldCaches(){
  // CacheStorage.keys() is creation ordered. Keep the current version and the
  // newest complete/partial historical cache; only this game's scoped files
  // qualify. Foreign, mixed-scope and empty caches are left alone.
  const owned=[];
  for(const name of await caches.keys()){
   if(!name.startsWith(prefix)||name===manifest.cacheName)continue;
   const requests=await(await caches.open(name)).keys();
   if(requests.length&&requests.every(request=>{const url=new URL(request.url);return url.origin===base.origin&&url.pathname.startsWith(base.pathname)&&!url.pathname.startsWith(base.pathname+'api/')}))owned.push(name);
  }
  for(const name of owned.slice(0,-1))await caches.delete(name);
 }
 async function receive(e,signal){
  const response=await fetch(cacheURL(e),{signal,cache:'no-store',credentials:'same-origin'});if(!response.ok||response.type==='opaque')throw Error('network');
  let bytes;
  if(response.body?.getReader){const reader=response.body.getReader(),chunks=[];let length=0;try{while(true){const part=await reader.read();if(part.done)break;length+=part.value.byteLength;if(length>e.bytes)throw Error('length');chunks.push(part.value);transfers.set(e.path,length);paint()}}finally{reader.releaseLock()}bytes=new Uint8Array(length);let offset=0;for(const part of chunks){bytes.set(part,offset);offset+=part.byteLength}}
  else bytes=new Uint8Array(await response.arrayBuffer());
  if(signal.aborted)throw new DOMException('Stopped','AbortError');if(bytes.byteLength!==e.bytes)throw Error('length');
  const digest=[...new Uint8Array(await crypto.subtle.digest('SHA-256',bytes))].map(x=>x.toString(16).padStart(2,'0')).join('');if(digest!==e.hash)throw Error('digest');
  if(signal.aborted)throw new DOMException('Stopped','AbortError');
  const headers=new Headers(response.headers);headers.set('X-Home-Resource',e.hash);headers.set('Content-Length',String(e.bytes));
  await cache.put(cacheURL(e),new Response(bytes,{status:200,headers}));
 }
 async function receiveWithRetry(e,signal){
  for(let attempt=0;attempt<3;attempt++){
   try{return await receive(e,signal)}catch(error){
    if(signal.aborted||attempt===2||!(error instanceof TypeError||error.message==='network'))throw error;
    transfers.delete(e.path);paint();
    await new Promise(resolve=>setTimeout(resolve,600*(attempt+1)));
   }
  }
 }
 async function run(){
  if(!available||working)return;working=true;failed=false;controller=new AbortController();const signal=controller.signal;let error=null;
  status.textContent='正在下载并保存资源…';paint(true);
  try{
   const estimate=await navigator.storage?.estimate?.();if(estimate?.quota&&estimate.quota-estimate.usage<total-completedBytes){throw Error('quota')}
   const oldNames=(await caches.keys()).filter(n=>n.startsWith(prefix)&&n!==manifest.cacheName),queue=entries.filter(e=>!completed.has(e.path));let cursor=0;
   const worker=async()=>{while(cursor<queue.length&&!signal.aborted){const e=queue[cursor++];try{if(!await reuse(e,oldNames))await receiveWithRetry(e,signal);if(signal.aborted)return;completed.add(e.path);completedBytes+=e.bytes;transfers.delete(e.path);paint()}catch(err){if(!signal.aborted){error=err;failed=true;controller.abort()}return}}};
   await Promise.all([worker(),worker(),worker()]);
  }catch(err){error=err;failed=true;controller.abort()}
  finally{working=false;transfers.clear();await inspect();
   if(completed.size===entries.length)try{await tidyOldCaches()}catch{}
   status.textContent=completed.size===entries.length?'资源已保存到本地，图片将优先从此设备读取。':error?.message==='quota'||error?.name==='QuotaExceededError'?'本地空间不足，已保存的资源保留；也可以直接开始。':failed?'下载中断，已保存 '+completed.size+' / '+entries.length+' 项。点击继续下载重试。':'下载已暂停，已保存 '+completed.size+' / '+entries.length+' 项。';paint(true);
  }
 }
 download.addEventListener('click',run);pause.addEventListener('click',()=>controller?.abort());
 window.addEventListener('pagehide',()=>controller?.abort());
 play.addEventListener('click',()=>{
  if(embedded){controller?.abort();host.hidden=true;document.body.classList.remove('launch-page');document.querySelector('.phone')?.removeAttribute('inert');if(previousText)window.render_game_to_text=previousText;if(typeof phoneRuntimeWall!=='undefined')phoneRuntimeWall=Date.now();if(typeof render==='function')render();if(typeof schedule==='function')schedule();return}
  location.href=new URL('game.html',base).href;
 });
 if(location.hostname.endsWith('github.io')&&!window.HOME_NPC_API_URL){const note=document.createElement('p');note.className='launch-status launch-online-note';note.textContent='网页调查与剧情可直接游玩；NPC 自由聊天将在联网服务开通后启用。';document.querySelector('.launch-download').append(note);}
 prepare();
})();
