/* Local, visible-page reactions. Nothing here reads real device or user data. */
let cultSession=null;
const cultMotionPreference=matchMedia('(prefers-reduced-motion: reduce)');
function cultIsVisible(el,root){
 const a=el.getBoundingClientRect(),b=root.getBoundingClientRect();
 return a.height>0&&a.bottom>b.top+18&&a.top<b.bottom-18;
}
function cultStop(){
 if(!cultSession)return;
 clearTimeout(cultSession.timer);
 cultSession.scroll.removeEventListener('scroll',cultSession.onScroll);
 cultSession.node.classList.remove('cult-awake');
 cultSession=null;
}
function cultReplace(node,key,text){
 const el=node.querySelector(`[data-cult-live="${key}"]`);
 if(!el||el.textContent===text)return;
 el.textContent=text;el.classList.add('cult-ink-changed');
}
function cultStep(ms){
 const c=cultSession;if(!c)return;
 if(!c.node.isConnected||document.hidden||R.app!=='browser'||!S.flags.found){cultStop();return}
 // An overlay is a separate phone surface; the page cannot react behind it.
 if(document.getElementById('overlay').children.length||document.querySelector('.dread-active'))return;
 const quiet=Boolean(S.reduce||cultMotionPreference.matches);
 c.node.classList.toggle('cult-still',quiet);
 c.node.classList.add('cult-awake');
 c.age+=ms;
 c.node.querySelectorAll('[data-cult-live]').forEach(el=>{
  if(cultIsVisible(el,c.scroll))c.dwell[el.dataset.cultLive]=(c.dwell[el.dataset.cultLive]||0)+ms;
 });
 if((c.dwell.reader||0)>=4300)cultReplace(c.node,'reader','阅览记录：林砚。林小禾正在同屏阅览。');
 if((c.dwell.margin||0)>=3800)cultReplace(c.node,'margin','爸爸，你看到哪一条了。');
 const response=c.dwell.response||0;
 if(response>=4200){cultReplace(c.node,'response','4');cultReplace(c.node,'echo','第 4 声：爸爸。')}
 else if(response>=1500)cultReplace(c.node,'response','3');
 if((c.dwell.offering||0)>=5300)cultReplace(c.node,'offering','下一位献祭者：林砚');
 const altar=c.node.querySelector('.cult-idol');
 if(altar&&cultIsVisible(altar,c.scroll)){
  c.gaze+=ms;
  c.node.classList.toggle('cult-observed',c.gaze>=2800);
 }
 const max=Math.max(1,c.scroll.scrollHeight-c.scroll.clientHeight);
 const progress=Math.max(0,Math.min(1,c.scroll.scrollTop/max));
 c.node.style.setProperty('--cult-depth',progress.toFixed(3));
 c.node.style.setProperty('--cult-approach',quiet?'1':(1+Math.min(c.gaze/16000,.085)).toFixed(4));
}
function cultTick(){
 const c=cultSession;if(!c)return;
 const now=performance.now();cultStep(Math.min(now-c.last,1000));
 if(cultSession!==c)return;c.last=now;c.timer=setTimeout(cultTick,240);
}
function cultSync(){
 const node=document.querySelector('#web-content .cult-site:not(.cult-copy)');
 if(document.hidden||R.app!=='browser'||!S.flags.found||!node){cultStop();return}
 if(cultSession?.node===node){cultStep(0);return}
 cultStop();const scroll=document.getElementById('web-content');
 cultSession={node,scroll,part:node.dataset.cultPart,age:0,gaze:0,dwell:{},last:performance.now(),timer:null,onScroll:()=>cultStep(0)};
 scroll.addEventListener('scroll',cultSession.onScroll,{passive:true});
 cultStep(0);cultSession.timer=setTimeout(cultTick,240);
}
function cultAdvance(ms){if(cultSession){cultStep(Math.max(0,Number(ms)||0));if(cultSession)cultSession.last=performance.now()}}
document.addEventListener('visibilitychange',()=>document.hidden?cultStop():cultSync());
cultMotionPreference.addEventListener('change',()=>cultStep(0));
window.cultState=()=>cultSession?{part:cultSession.part,active:true,reduced:Boolean(S.reduce||cultMotionPreference.matches),dwell:{...cultSession.dwell},response:cultSession.node.querySelector('[data-cult-live="response"]')?.textContent||null,observed:cultSession.gaze>=2800}:{active:false};
