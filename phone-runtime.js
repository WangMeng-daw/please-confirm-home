/* An advancing in-world clock; loading a save resumes its last displayed time. */
let phoneRuntimeState=null,phoneRuntimeWall=Date.now(),phoneRuntimeLastSave=0,phoneRuntimeUIDay=null;
function phoneStoryBase(){const match=String(storyBaseTime()).match(/(\d+):(\d+)/);return Date.UTC(2026,8,S.day,Number(match?.[1]||20),Number(match?.[2]||36))}
function syncPhoneRuntime(){
 const wall=Date.now(),key=S.day+'|'+storyBaseTime();
 if(!S.phoneRuntime||typeof S.phoneRuntime!=='object')S.phoneRuntime={version:1,at:phoneStoryBase(),base:key,battery:86,used:0};
 const p=S.phoneRuntime;
 if(phoneRuntimeState!==S){phoneRuntimeState=S;phoneRuntimeWall=wall;phoneRuntimeUIDay=null}
 const elapsed=Math.max(0,Math.min(5000,wall-phoneRuntimeWall));phoneRuntimeWall=wall;
 if(!document.hidden&&!document.body.classList.contains('launch-page')){p.at+=elapsed;p.used+=elapsed*(.65+(Number(S.brightness)||100)/200)}
 if(p.base!==key){p.at=Math.max(p.at,phoneStoryBase());p.base=key}
 while(p.used>=360000){p.used-=360000;p.battery=Math.max(5,p.battery-1)}
 return p;
}
function phoneDate(){return new Date(syncPhoneRuntime().at)}
function phoneTimeString(){return phoneDate().toISOString().slice(11,16)}
function phoneStamp(){const d=phoneDate();return `${d.getUTCMonth()+1}月${d.getUTCDate()}日 ${d.toISOString().slice(11,16)}`}
function phoneDateISO(){return phoneDate().toISOString().slice(0,10)}
function phoneTimestamp(){return phoneDate().toISOString().slice(0,19)+'+08:00'}
function phoneBatteryMarkup(){const level=Math.floor(syncPhoneRuntime().battery);return `<span class="phone-battery ${level<=20?'low':''}" role="img" aria-label="电量 ${level}%" title="电量 ${level}%"><span style="width:${level}%"></span></span>`}
function phoneTyping(id){
 if(!phoneOnline()||document.hidden)return false;
 if(typeof npcJobs!=='undefined'&&npcJobs.has(id))return true;
 return (S.pending||[]).some(m=>m.id===id&&m.due>Date.now()&&m.due-Date.now()<12000&&m.extra?.type!=='image');
}
function phoneRuntimeUI(){
 if(typeof dpActive==='function'&&dpActive()){dpAfterRender();return;}
 const calendarDay=phoneDateISO();
 if(phoneRuntimeUIDay&&phoneRuntimeUIDay!==calendarDay&&['home','lock','calendar'].includes(R.app)){phoneRuntimeUIDay=calendarDay;render()}
 phoneRuntimeUIDay=calendarDay;
 const p=syncPhoneRuntime(),stamp=phoneTimeString(),clock=document.querySelector('#clock');if(clock&&clock.textContent!==stamp)clock.textContent=stamp;
 const homeClock=document.querySelector('[data-launch-clock]');if(homeClock&&homeClock.textContent!==stamp)homeClock.textContent=stamp;
 const battery=document.querySelector('.phone-battery');if(battery){battery.setAttribute('aria-label',`电量 ${Math.floor(p.battery)}%`);battery.title=`电量 ${Math.floor(p.battery)}%`;battery.classList.toggle('low',p.battery<=20);battery.firstElementChild.style.width=p.battery+'%'}
 if(R.app==='chat'){
  const title=document.querySelector('#screen .wx-header h2');
  if(title){const typing=phoneTyping(R.id);title.textContent=typing?'对方正在输入…':pname(R.id);title.classList.toggle('is-typing',typing)}
 }
 const batteryText=document.querySelector('[data-phone-battery]');if(batteryText)batteryText.textContent=Math.floor(p.battery)+'%';
}
function syncFamilyName(){
 if(S.familyNameVersion===1)return;
 const rename=v=>typeof v==='string'?v.replaceAll('林岚','李岚'):v;
 if(S.remarks?.wife==='林岚')S.remarks.wife='李岚';
 for(const list of Object.values(S.history||{}))for(const m of list)if(!m.me&&m.text)m.text=rename(m.text);
 for(const m of S.pending||[]){m.text=rename(m.text);if(m.extra?.text)m.extra.text=rename(m.extra.text)}
 for(const n of S.notifications||[])n.text=rename(n.text);
 for(const m of S.moments||[]){if(m.person!=='me')m.text=rename(m.text);m.likes=(m.likes||[]).map(rename);for(const c of m.comments||[]){c.name=rename(c.name);if(c.name!==S.profile.name&&c.person!=='me')c.text=rename(c.text)}}
 for(const f of S.favorites||[])f.from=rename(f.from);
 S.familyNameVersion=1;
}
syncFamilyName();syncPhoneRuntime();
setInterval(()=>{phoneRuntimeUI();if(Date.now()-phoneRuntimeLastSave>30000){phoneRuntimeLastSave=Date.now();persist()}},1000);
function phoneRuntimeFlush(){
 try{const saved=JSON.parse(localStorage.getItem(KEY));if(saved?.phoneRuntime?.base===S.phoneRuntime.base&&saved.flags?.done===S.flags.done){saved.phoneRuntime=clone(S.phoneRuntime);localStorage.setItem(KEY,JSON.stringify(saved))}}catch{}
}
document.addEventListener('visibilitychange',()=>{phoneRuntimeWall=Date.now();phoneRuntimeUI();phoneRuntimeFlush()});
window.addEventListener('pagehide',()=>{syncPhoneRuntime();phoneRuntimeFlush()});
