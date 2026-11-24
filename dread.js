/* Fictional phone-only photographic interruptions. No audio or external input. */
const DREAD_EVENTS={
 door:{flag:'dreadDoor',delay:1750,duration:1150},
 shrine:{flag:'dreadShrine',delay:650,duration:1450},
 converted:{flag:'dreadConverted',delay:4000,duration:1550},
 accepted:{flag:'dreadAccepted',delay:5600,duration:1650}
};
let dreadPending=null,dreadActive=null,dreadTimer=null,dreadFinishTimer=null,dreadSerial=0;
let dreadCooldownUntil=Number(S.dreadLastAt||0)+18000;
let dreadImagePromise=null;
function dreadReady(){
 if(!dreadImagePromise)dreadImagePromise=new Promise(resolve=>{
  const im=new Image();im.src=asset('scare-face');
  im.decode().then(()=>resolve(im)).catch(()=>{dreadImagePromise=null;resolve(null)});
 });
 return dreadImagePromise;
}
function dreadContext(kind){
 if(document.hidden||!S.flags.found)return false;
 if(kind==='converted')return Boolean(S.flags.done==='converted'&&!photo&&R.app==='browser'&&new URL(currentURL()).pathname==='/ending');
 if(kind==='accepted')return Boolean(S.flags.dreadFinalReady&&S.flags.done==='accepted'&&!photo&&((R.app==='browser'&&new URL(currentURL()).pathname==='/receipt')||(R.app==='chat'&&R.id==='daughter')));
 if(S.flags.done)return false;
 if(kind==='door')return Boolean(S.flags.memory&&photo==='door'&&document.querySelector('.native-photo'));
 return Boolean(kind==='shrine'&&S.flags.auth&&S.flags.inner&&phoneOnline()&&!photo&&R.app==='browser'&&new URL(currentURL()).pathname==='/account/shrine'&&document.querySelector('[data-cult-part="shrine"]'));
}
function dreadContextKey(){return `${R.app}:${R.id||''}:${R.app==='browser'?currentURL():''}:${photo||''}`}
function dreadCancelPending(){clearTimeout(dreadTimer);dreadTimer=null;dreadPending=null;dreadSerial++}
function dreadCancel(){dreadCancelPending();dreadFinish(false)}
function dreadArm(kind,delay=DREAD_EVENTS[kind]?.delay){
 const event=DREAD_EVENTS[kind];
 if(!event||S.flags[event.flag]||!dreadContext(kind)||dreadActive)return false;
 if(dreadPending?.kind===kind)return true;
 dreadCancelPending();
 dreadPending={kind,key:dreadContextKey(),due:Math.max(Date.now()+delay,dreadCooldownUntil),serial:++dreadSerial};
 dreadReady();dreadPlan();return true;
}
function dreadPlan(){
 clearTimeout(dreadTimer);if(!dreadPending)return;
 dreadTimer=setTimeout(dreadTry,Math.max(0,dreadPending.due-Date.now()));
}
async function dreadTry(){
 const pending=dreadPending;if(!pending)return;
 if(!dreadContext(pending.kind)||pending.key!==dreadContextKey()){dreadCancelPending();return}
 if(pending.due>Date.now()){dreadPlan();return}
 const im=await dreadReady();
 if(!im){if(dreadPending===pending)dreadCancelPending();return}
 if(dreadPending!==pending||!dreadContext(pending.kind)||pending.key!==dreadContextKey())return;
 const event=DREAD_EVENTS[pending.kind];if(S.flags[event.flag]){dreadCancelPending();return}
 const layer=document.getElementById('dread-layer');if(!layer)return;
 dreadPending=null;clearTimeout(dreadTimer);
 S.flags[event.flag]=true;S.dreadLastAt=Date.now();dreadCooldownUntil=S.dreadLastAt+18000;
 if(pending.kind==='shrine')S.flags.cultPeeled=true;
 dreadActive={kind:pending.kind,key:pending.key,until:Date.now()+event.duration};
 layer.replaceChildren(im.cloneNode());layer.firstChild.alt='';
 layer.dataset.kind=pending.kind;layer.hidden=false;
 layer.classList.toggle('still',S.reduce||matchMedia('(prefers-reduced-motion: reduce)').matches);
 document.querySelector('.phone').classList.add('dread-active');
 persist();dreadFinishTimer=setTimeout(()=>dreadFinish(true),event.duration);
}
function dreadFinish(aftermath=true){
 if(!dreadActive)return;const active=dreadActive;dreadActive=null;clearTimeout(dreadFinishTimer);
 const layer=document.getElementById('dread-layer');layer.hidden=true;layer.replaceChildren();
 document.querySelector('.phone').classList.remove('dread-active');
 if(active.kind==='shrine'&&dreadContext('shrine')){
  const scroll=document.getElementById('web-content').scrollTop;render();document.getElementById('web-content').scrollTop=scroll;
 }
 if(aftermath&&!S.flags.done){
  if(active.kind==='door')horrorSequence('dreadDoorAfter',[{text:'这次离得够近了吗？'}]);
  if(active.kind==='shrine')horrorSequence('dreadShrineAfter',[{text:'你在里面看见谁了？'},{id:'wife',text:S.flags.hollowWifeSheltered?'她的脸贴在门缝外面，问我看清没有。我没开门。':'她突然凑到我脸前面，问我看清没有。'}]);
 }
}
function dreadSync(){
 if(dreadActive&&(!dreadContext(dreadActive.kind)||dreadActive.key!==dreadContextKey()))dreadFinish(false);
 if(dreadPending&&(!dreadContext(dreadPending.kind)||dreadPending.key!==dreadContextKey()))dreadCancelPending();
 if(dreadActive||dreadPending)return;
 if(dreadContext('door'))dreadArm('door');
 else if(dreadContext('accepted'))dreadArm('accepted');
 else if(dreadContext('converted'))dreadArm('converted');
}
function dreadAdvance(ms){
 dreadCooldownUntil-=ms;
 if(dreadPending){dreadPending.due-=ms;dreadPlan();dreadTry()}
 if(dreadActive){dreadActive.until-=ms;if(dreadActive.until<=Date.now())dreadFinish(true)}
}
document.addEventListener('visibilitychange',()=>{if(document.hidden)dreadCancel();else dreadSync()});
document.addEventListener('click',e=>{
 if(dreadActive){if(e.target.closest('#home-key'))return;e.preventDefault();e.stopImmediatePropagation();dreadFinish(true);return}
 const trigger=e.target.closest('[data-a="cult-gaze"],[data-a="cult-peel"]');
 if(trigger){e.preventDefault();e.stopImmediatePropagation();dreadArm('shrine')}
},true);
document.addEventListener('keydown',e=>{
 if(!dreadActive)return;
 if(e.key==='Escape'||e.key==='Enter'||e.key===' '){e.preventDefault();e.stopImmediatePropagation();dreadFinish(true)}
 else if(!e.ctrlKey&&!e.metaKey&&!e.altKey){e.preventDefault();e.stopImmediatePropagation()}
},true);
window.dreadState=()=>({active:dreadActive?.kind||null,pending:dreadPending?.kind||null});
