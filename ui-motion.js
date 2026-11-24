/* Motion follows navigation and real state changes. No delayed actions, simulated network waits or clue mutations. */
(()=>{
 const preference=matchMedia('(prefers-reduced-motion: reduce)');
 let previous=null,backward=false,scrollCleanup=null,keyboard=false;
 const quiet=()=>Boolean(S.reduce||preference.matches||document.hidden);
 const active=new Set();
 function move(el,frames,duration=200){
  if(!el||quiet())return;
  const animation=el.animate(frames,{duration,easing:'cubic-bezier(.22,.75,.24,1)'});
  active.add(animation);animation.finished.catch(()=>{}).finally(()=>active.delete(animation));
  return animation;
 }
 function stop(){for(const a of active)a.cancel();active.clear()}
 preference.addEventListener('change',()=>{if(preference.matches)stop()});
 document.addEventListener('visibilitychange',()=>{if(document.hidden)stop()});
 function identity(){
  const daughter=typeof dpActive==='function'&&dpActive();
  const v=daughter?S.devices.daughter.view:R;
  return {owner:daughter?'daughter':launcherOwner(R.app)||R.app,key:JSON.stringify([daughter,v.app,v.id,v.view,v.tab,v.xhView,v.xhId,v.xhPerson,v.xhTab,v.xhProfileTab,v.zhView,v.zhId,v.zhAnswer,v.zhAuthor,v.zhTab,v.album,v.folder,v.page,v.app==='browser'?currentURL():null]),app:v.app,tab:!daughter&&v.app==='browser'?tabState():null,index:!daughter&&v.app==='browser'?tabState().index:null,url:!daughter&&v.app==='browser'?currentURL():null};
 }
 function decorate(){
  scrollCleanup?.();scrollCleanup=null;
  document.querySelectorAll('.ui-to-top,.ui-browser-progress').forEach(e=>e.remove());
  const screen=document.getElementById('screen'),web=document.getElementById('web-content');
  screen.dataset.uiApp=R.app;
  if(!web)return;
  const button=document.createElement('button');button.type='button';button.className='ui-to-top';button.hidden=true;button.textContent='↑';button.setAttribute('aria-label','返回顶部');
  screen.append(button);
  const update=()=>{button.hidden=web.scrollTop<Math.max(500,web.clientHeight*.8)};
  web.addEventListener('scroll',update,{passive:true});button.addEventListener('click',()=>web.scrollTo({top:0,behavior:quiet()?'instant':'smooth'}));
  scrollCleanup=()=>web.removeEventListener('scroll',update);update();
 }
 const originalRender=render;
 const originalBrowse=browse;
 browse=function(...args){
  const tab=tabState();
  for(const key of Object.keys(tab.uiScroll||{}))if(Number(key)>tab.index)delete tab.uiScroll[key];
  return originalBrowse.apply(this,args);
 };
 render=function(...args){
  const before=previous;
  const oldWeb=document.getElementById('web-content');
  if(before?.tab&&oldWeb){before.tab.uiScroll??={};before.tab.uiScroll[before.index]={url:before.url,top:oldWeb.scrollTop};}
  const result=originalRender.apply(this,args);
  const now=identity();previous=now;decorate();
  const saved=now.tab?.uiScroll?.[now.index],web=document.getElementById('web-content');
  if(web&&saved?.url===now.url){web.scrollTop=saved.top;requestAnimationFrame(()=>{if(web.isConnected){web.scrollTop=saved.top;web.dispatchEvent(new Event('scroll'));}})}
  if(quiet()){stop();backward=false;return result}
  if(before&&now.key!==before.key){
   const screen=document.getElementById('screen');
   const content=screen.querySelector('#web-content,.xiaohongshu-app,.zhihu-app,.dy-root,.dp-screen')||screen;
   if(now.owner!==before.owner){move(content,[{opacity:.45,transform:'scale(.98)'},{opacity:1,transform:'scale(1)'}],210)}
   else move(content,[{opacity:.65,transform:`translateX(${backward?-18:22}px)`},{opacity:1,transform:'translateX(0)'}],190);
   if(now.app==='browser'){
    const line=document.createElement('i');line.className='ui-browser-progress';screen.append(line);
    const a=move(line,[{transform:'scaleX(.05)',opacity:1},{transform:'scaleX(1)',opacity:0}],240);a?.finished.catch(()=>{}).finally(()=>line.remove());
   }
   if(keyboard){const heading=content.querySelector('h1,h2');if(heading){heading.tabIndex=-1;heading.focus({preventScroll:true})}}
  }
  backward=false;return result;
 };
 const originalChat=renderChatBody;
 renderChatBody=function(...args){
  const body=document.getElementById('chat-body'),count=body?.querySelectorAll('[data-msg]').length||0;
  const near=body&&body.scrollHeight-body.scrollTop-body.clientHeight<100;
  const result=originalChat.apply(this,args),items=document.querySelectorAll('#chat-body [data-msg]');
  if(near&&items.length>count)for(const el of [...items].slice(count))move(el,[{opacity:0,transform:'translateY(7px)'},{opacity:1,transform:'translateY(0)'}],180);
  return result;
 };
 document.addEventListener('pointerdown',()=>{keyboard=false},{passive:true});
 document.addEventListener('keydown',e=>{keyboard=true;if(e.key==='Escape')backward=true});
 document.addEventListener('click',e=>{const a=e.target.closest('[data-a]')?.dataset.a||'';backward=/(?:^back$|back$|close$|home$)/.test(a)},true);
 document.addEventListener('toggle',e=>{const el=e.target;if(el.tagName==='DETAILS'&&el.open)for(const child of el.children)if(child.tagName!=='SUMMARY')move(child,[{opacity:.3,transform:'translateY(-4px)'},{opacity:1,transform:'translateY(0)'}],180)},true);
 window.UI_MOTION_VERSION='20261013';
 previous=identity();decorate();
})();
