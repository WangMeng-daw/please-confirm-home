/* Only conversation data crosses the local API boundary. Story transitions stay authored. */
const npcJobs=new Map();
let npcEpoch=0;
const NPC_REQUEST_TIMEOUT_MS=50000;
// A busy local service has not generated a reply. Retry only that explicit case;
// other failures may have reached the provider and must not repeat the request.
async function npcFetch(packet,signal){
 const base=location.protocol==='file:'?'http://127.0.0.1:8765':'';
 const configured=String(window.HOME_NPC_API_URL||'').trim();
 const endpoint=configured||base+'/api/npc';
 if(configured&&!/^https:\/\//.test(configured))throw Error('invalid-service-url');
 const options={method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(packet),signal};
 for(let attempt=0;attempt<3;attempt++){
  if(signal?.aborted)throw new DOMException('Request cancelled','AbortError');
  const response=await fetch(endpoint,options);
  if(response.status!==429||attempt===2)return response;
  const result=await response.clone().json().catch(()=>null);
  if(result?.error?.code!=='BUSY')return response;
  const seconds=Number(response.headers.get('Retry-After'));
  const wait=Math.min(5000,Math.max(1000,Number.isFinite(seconds)&&seconds>0?seconds*1000:1500*(attempt+1)));
  await response.body?.cancel().catch(()=>{});
  await new Promise((resolve,reject)=>{
   let timer;
   const abort=()=>{clearTimeout(timer);signal?.removeEventListener('abort',abort);reject(new DOMException('Request cancelled','AbortError'))};
   if(signal?.aborted){abort();return}
   signal?.addEventListener('abort',abort,{once:true});
   timer=setTimeout(()=>{signal?.removeEventListener('abort',abort);resolve()},wait);
  });
 }
}
function npcStage(){return S.flags.done?'ending':S.flags.inner?'inner':S.flags.memory?'suspicious':S.flags.found?'returned':S.flags.registered?'searching':'missing'}
function npcAllowed(id){
 if(typeof clueNpcAllowed==='function')return clueNpcAllowed(id)===true;
 if(['yeming','visitor'].includes(id)||String(id).startsWith('household_'))return false;
 return !(id==='daughter'&&(!S.flags.found||['rescued','sealed'].includes(S.flags.done))||id==='old'&&!S.flags.inner||['guardian','mother'].includes(id)&&!S.flags.inner);
}
function npcStateKey(id){return [id?S.npcRevision?.[id]||0:0,npcStage(),S.flags.hollowWifeSheltered||false,S.flags.done||'',S.returnInvestigation?.memoryVerified||false,S.flags.done||'',S.puzzle?.feedCut||false,S.cipher?.readyRescue||false,S.cipher?.readySeal||false,S.cipher?.lit?.length||0,S.puzzle?.adminFate||false,S.puzzle?.privateDoor||false,S.puzzle?.offeredName||false,typeof clueKnowledgeKey==='function'?clueKnowledgeKey(id):typeof cultHistoryKnowledgeKey==='function'?cultHistoryKnowledgeKey(id):'',id&&typeof clueNpcAllowed==='function'?Number(npcAllowed(id)):1].join('|')}
function npcCancel(id){const jobs=id?[npcJobs.get(id)]:[...npcJobs.values()];for(const job of jobs){if(!job)continue;clearTimeout(job.timer);job.controller?.abort();}if(id)npcJobs.delete(id);else{npcEpoch++;npcJobs.clear()} }
function npcContext(id){
 if(typeof socialCircleKnown==='function'&&socialCircleKnown(id)){
  const facts=socialCircleFacts(id),history=S.history[id]||[];
  for(const m of history.filter(m=>!m.me&&!m.date&&!m.npcAI).slice(-5))facts.push('本段微信中你已说过：'+String(m.text||'').slice(0,250));
  for(const m of history.filter(m=>m.me&&['image','link','file'].includes(m.type)).slice(-3)){
   if(m.type==='image')facts.push('林砚已在这段聊天发来的图片：'+(D.photos[m.photo]?.description||'仅收到图像，未提供内容细节。')+'；仅谈已给出的画面。');
   else if(m.type==='link'&&typeof dyPost==='function')try{const u=new URL(m.url);if(u.hostname==='v.douyin.example'){const p=dyPost(decodeURIComponent(u.pathname.split('/').pop()));if(p)facts.push('本段微信实际收到的转发：'+dyCreator(p.creator).name+'发表：'+p.text.slice(0,210)+'。不等于你的亲历，也不等于已转发。')}}catch{}
  }
  return {surface:'private-friend',stage:'missing',facts:facts.slice(-16),seen:[],ending:null,oldUnlocked:false,godsUnlocked:false,lampCount:0};
 }
 if(typeof OFFICIAL_ACCOUNTS!=='undefined'&&OFFICIAL_ACCOUNTS[id]?.npc==='dailyeditor')return {stage:'missing',surface:'official-service',facts:officialContext(id),seen:[],ending:null};
 const scoped=typeof clueNpcFacts==='function',history=S.history[id]||[],facts=[],core=[],god=['mother','guardian'].includes(id);
 // Only authored, delivered lines and this thread's explicit shares are sources.
 // Never walk either phone's other histories, photo library or browser state.
 for(const m of history.filter(m=>!m.me&&!m.date&&!m.npcAI).slice(-5))facts.push(m.type==='image'?'你已发出的图片：'+(D.photos[m.photo]?.description||'图像细节未提供，不能自行补画。'):'你已发出的内容：'+String(m.text||'').slice(0,280));
 for(const message of history.filter(m=>m.me&&['link','image'].includes(m.type)).slice(-3)){
  if(message.type==='link'&&typeof dyPost==='function')try{const link=new URL(message.url);if(link.hostname==='v.douyin.example'){const post=dyPost(decodeURIComponent(link.pathname.split('/').pop()));if(post)facts.push('林砚在本段聊天分享的抖音图文已经可读：作者'+dyCreator(post.creator).name+'；正文：'+post.text.slice(0,170)+'。这是作者公开发言，不是你见证的新事实。')}}catch{}
  if(message.type==='image')facts.push('林砚已在这段聊天发来的图片：'+(D.photos[message.photo]?.description||'仅收到图像，未提供内容细节。')+'；只能据可见内容回应，不推断画面外事实。');
 }
 if(typeof officialContext==='function'&&typeof OFFICIAL_ACCOUNTS!=='undefined'&&OFFICIAL_ACCOUNTS[id])facts.push(...officialContext(id));
 if(typeof returnedNpcFacts==='function')facts.push(...returnedNpcFacts(id));
 if(scoped){
  const earned=clueNpcFacts(id);
  if(Array.isArray(earned))facts.push(...earned.filter(f=>typeof f==='string'));
  core.push('只知道当前账号已经收到或明确给出的资料。另一部手机保存的离线聊天、相册、备忘录不自动同步到你；未实际转来的内容不能读取。归家后的异常只按本段已交付消息谈。原信只记旧门牌和窗下标志；洗衣纸条、查件结果、修缮档案与地图上的出入口通知各自提供不同部分；修缮档案只对照门牌，现用入口以地点通知为准。知乎作者的考据只可按本对话实际收到的内容讨论。未收到就不能补出现门牌、入口、密码、其他家属内幕或现场结果。');
  if(['wife','police','teacher','friend'].includes(id))core.push('不知道机构内部和神明隐情；林砚在本段的转述只是他的说法，不是你亲眼所见或警方结论。');
  if(id==='visitor')core.push('对面是平台志愿者或林先生。不能称他沈闻或假定他已接管平台。你只知道当前求助线程里自己的照片、孩子称呼和已送达回复。');
 }else{
  core.push('对话对象是父亲林砚，妻子李岚，女儿林小禾。','女儿8月13日放学后失踪；没有证据表明她失踪期间经历了什么。');
  if(S.flags.found)core.push('9月24日有一名外貌相同的孩子已由李岚接领回家。她的经历还要了解。');
  if(['wife','police','friend','teacher'].includes(id))core.push('不直接知道归家会的内部情况，除非林砚在这段聊天里告诉你；不要把他的猜想当作已经查明的事实。');
 }
 if(id==='wife'&&S.flags.hollowWifeSheltered)core.push('你现在锁在卧室里，绝不离开卧室去接近她；没有拿到新的照片或实物。');
 if(id==='daughter'){
  core.push('只回应此聊天里已说过的习惯和已送达的异常。没有记载的过去不能补写。不能读取其他聊天、女儿离线手机、摄像头新画面或完成网站操作。');
  if(history.some(m=>!m.me&&!m.npcResponse&&m.text==='我回家了。'))core.push('当前这段聊天发生在你回家以后。你已告诉爸爸“我回家了”。前面爸爸找你、问你在哪里的消息属于失联期间的旧聊天，不改变现在已经归家的状态。');
 }
 if(typeof recognitionNpcFacts==='function')core.push(...recognitionNpcFacts(id));
 const context={stage:scoped?'missing':npcStage(),facts:[...facts.slice(-(16-core.length)),...core],seen:[],ending:null};
 if(scoped)Object.assign(context,{clueScoped:true,contactOpen:npcAllowed(id)});
 if(id==='wife')context.wifeSheltered=!!S.flags.hollowWifeSheltered;
 if(id==='old')context.oldUnlocked=npcAllowed(id);
 if(god)context.godsUnlocked=npcAllowed(id);
 return context;
}
function npcHistory(id){return (S.history[id]||[]).filter(m=>!m.date&&m.type!=='system').slice(-24).map(m=>({role:m.me?'user':'assistant',content:String(m.type==='image'?'[图片：'+(D.photos[m.photo]?.description||'内容细节未提供')+']':m.type==='file'?'[文件：'+m.text+']':m.type==='link'?m.text+' '+m.url:m.text||'').slice(0,800)}))}
function npcReply(id,text,fallback){
 if(!npcAllowed(id))return;
 npcCancel(id);
 // Undelivered answers to an older question must not appear after a new subject.
 S.pending=S.pending.filter(m=>!(m.id===id&&m.extra?.npcResponse));
 const job={state:S,epoch:npcEpoch,key:npcStateKey(id),controller:new AbortController(),timer:null};npcJobs.set(id,job);
 const delivery=npcDeliveryState();
 delivery.requests[id]={text,key:job.key,status:'pending'};
 persist();npcDeliveryUI();
 const valid=()=>S===job.state&&npcEpoch===job.epoch&&npcJobs.get(id)===job&&job.key===npcStateKey(id)&&npcAllowed(id);
 job.timer=setTimeout(async()=>{
  if(!valid()){if(npcJobs.get(id)===job)npcJobs.delete(id);return;}
  let messages=null,timeout;
  try{
   if(!phoneOnline())throw Error('offline');
   timeout=setTimeout(()=>job.controller.abort(),NPC_REQUEST_TIMEOUT_MS);
   const packet={npc:typeof OFFICIAL_ACCOUNTS!=='undefined'&&OFFICIAL_ACCOUNTS[id]?.npc||id,history:npcHistory(id),context:npcContext(id),lastUser:text.slice(0,800)};
   while(new TextEncoder().encode(JSON.stringify(packet)).length>30000&&packet.history.length>2)packet.history.shift();
   const response=await npcFetch(packet,job.controller.signal);
   if(!response.ok)throw Error('unavailable');
   const result=await response.json();if(result.ok&&result.mode==='silence'){if(npcJobs.get(id)===job)npcJobs.delete(id);delete delivery.requests[id];persist();npcDeliveryUI();return;}
   if(!result.ok||!Array.isArray(result.messages))throw Error('invalid');
   messages=result.messages.filter(x=>typeof x==='string'&&x.trim()).slice(0,3).map(x=>x.trim().slice(0,400));
  }catch{messages=null}finally{clearTimeout(timeout)}
  if(!valid()){if(npcJobs.get(id)===job)npcJobs.delete(id);return;}
  npcJobs.delete(id);
  if(messages?.length){
   delete delivery.requests[id];
   for(const line of messages)later(id,line,{npcAI:true,npcResponse:true,npcContextKey:job.key});
  }else delivery.requests[id]={text,key:job.key,status:'failed'};
  persist();npcDeliveryUI();
 },650);
}
// A failed model call may acknowledge the conversation, but cannot invent facts
// or promise a later event. Keep these brief replies in the character's voice.
const NPC_NATURAL_FALLBACKS={
 wife:'你说，我听着。',friend:'嗯，接着说。',police:'你把想问的事再说具体一点。',teacher:'您说，我在看。',club:'您说的是哪件事？',
 daughter:'爸爸，你想问哪一句？',old:'爸，你慢点说。我在。',yeming:'你先说说，哪里让你觉得不对？',visitor:'林先生，你说，我听着。',
 household_wang:'您说，我听着呢。',household_zhou:'你说，是哪件事？',household_zhao:'你说吧，是明明的事吗？',household_liu:'你说，我看着。',household_sun:'你说具体点，我想想。',household_he:'你说吧。',
 guardian:'把你想问的说出来。',mother:'说吧，我听着。',stationtech:'您说的是机器哪一处？',street:'你说，什么事？',translator:'哪一处没看明白？',guijia:'您好，想问哪一项服务？',localrecords:'您说的是哪份记录？',lamphouse:'信看到了，你慢慢说。',dailyeditor:'您说的是文章里的哪一段？',
 cousin:'小砚，跟我说说。',colleague:'老林，你接着说。',manager:'林砚，你说。',neighbor:'你说吧，阿姨听着。',bookfriend:'说到哪儿了？你接着说。',runner:'嗯，你说。',parentfriend:'小禾爸爸，您说。',repairfriend:'你说仔细些。',wangfamily:'您说，我听着呢。',zhaofamily:'你说吧，是明明的事吗？'
};
function npcFallbackLines(id,text,fallback){
 if(/想死|不想活|活不下去|撑不住|不想撑/.test(text)&&['wife','friend','teacher','police'].includes(id))return[id==='wife'?'林砚，别伤害自己。你现在在哪儿？回我一下，别一个人待着。':'别伤害自己。先找个信得过的人陪着，你现在在哪儿？'];
 if(id==='wife'&&/吃啥|吃什么|晚饭|晚餐|饿了/.test(text))return[S.flags.hollowWifeSheltered?'我在卧室里，门锁着。你先吃一点现成的，别饿着自己。':'先吃点东西，别饿着。'];
 if(typeof clueNpcFacts==='function')return[NPC_NATURAL_FALLBACKS[id]||'你说，我看着。'];
 return(typeof fallback==='function'?fallback():fallback)||[NPC_NATURAL_FALLBACKS[id]||'你说，我看着。'];
}
function npcBeforeSend(id){npcCancel(id);delete npcDeliveryState().requests[id];S.pending=S.pending.filter(m=>!(m.id===id&&m.extra?.npcResponse));}

// A transport failure is a delivery state, never a line spoken by the character.
let npcDeliveryOwner=null;
function npcDeliveryState(){
 const d=S.npcDelivery ||= {version:1,requests:{}};d.requests ||= {};
 if(npcDeliveryOwner!==S){
  npcDeliveryOwner=S;
  for(const req of Object.values(d.requests))if(req.status==='pending')req.status='failed';
 }
 if(!d.cleanedFallbacks){
  const isFallback=(id,m)=>!m.me&&m.npcResponse&&!m.npcAI&&m.text===NPC_NATURAL_FALLBACKS[id];
  for(const [id,history] of Object.entries(S.history||{})){
   const last=history.filter(m=>!m.date).at(-1);
   if(last&&isFallback(id,last)){
    const user=history.filter(m=>m.me).at(-1);
    if(user?.type==='text'&&user.text)d.requests[id]={text:user.text,key:npcStateKey(id),status:'failed'};
   }
   S.history[id]=history.filter(m=>!isFallback(id,m));
  }
  S.pending=S.pending.filter(m=>!isFallback(m.id,{...m.extra,text:m.text}));
  d.cleanedFallbacks=true;
 }
 return d;
}
function npcDeliveryUI(){
 const d=npcDeliveryState();
 for(const [id,req] of Object.entries(d.requests))if(req.key!==npcStateKey(id)||!npcAllowed(id))delete d.requests[id];
 document.querySelectorAll('.npc-delivery-status').forEach(node=>node.remove());
 if(R.app!=='chat'||typeof dpActive==='function'&&dpActive())return;
 const req=d.requests[R.id],body=document.querySelector('#chat-body');
 if(!req||!body)return;
 const near=body.scrollHeight-body.scrollTop-body.clientHeight<100;
 const node=document.createElement(req.status==='failed'?'button':'div');
 node.className='npc-delivery-status';node.setAttribute('aria-live','polite');
 if(req.status==='failed'){
  node.type='button';node.dataset.a='npc-retry';node.dataset.id=R.id;
  node.textContent='暂未收到回复 · 点击重试';
 }else node.textContent='等待回复…';
 body.append(node);if(near)body.scrollTop=body.scrollHeight;
}
document.addEventListener('click',event=>{
 const button=event.target.closest('[data-a="npc-retry"]');if(!button)return;
 event.preventDefault();event.stopImmediatePropagation();
 const id=button.dataset.id,req=npcDeliveryState().requests[id];
 if(!req||req.status!=='failed'||req.key!==npcStateKey(id)||!npcAllowed(id))return;
 if(!requirePhoneNetwork())return;
 npcReply(id,req.text);
},true);
const npcDeliveryRender=render;
render=function(...args){npcDeliveryState();const result=npcDeliveryRender(...args);npcDeliveryUI();return result};
const npcDeliveryChatBody=renderChatBody;
renderChatBody=function(...args){const result=npcDeliveryChatBody(...args);npcDeliveryUI();return result};
window.addEventListener('pagehide',()=>npcCancel());
