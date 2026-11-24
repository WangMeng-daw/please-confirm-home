'use strict';
const D=window.GAME_DATA, $=s=>document.querySelector(s), E=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const KEY='confirm-home-immersive-v3', BASE='https://www.guijia.example';
const embeddedAssetURLs=new Map(),assetURLKeys=new Map();
function assetResource(id){
 const remember=url=>{assetURLKeys.set(new URL(url,document.baseURI).href,id);return url};
 const embedded=window.HOME_ASSETS?.[id];
 if(!embedded)return remember(`assets/${id}.${window.HOME_ASSET_FORMATS?.[id]||'png'}`);
 if(embeddedAssetURLs.has(id))return remember(embeddedAssetURLs.get(id));
 const header=embedded.match(/^data:(image\/(?:png|webp|jpeg));base64,/);if(!header)return remember(embedded);
 const raw=atob(embedded.slice(header[0].length)),bytes=new Uint8Array(raw.length);
 for(let i=0;i<raw.length;i++)bytes[i]=raw.charCodeAt(i);
 const url=URL.createObjectURL(new Blob([bytes],{type:header[1]}));embeddedAssetURLs.set(id,url);return remember(url);
}
const asset=id=>{
 const source=D.photos[id]?.file;if(source&&source!==id)return asset(source);
 const tile=window.ALBUM_PHOTOS?.[id];
 if(tile)return assetResource(typeof recognitionAlbumSheet==='function'?recognitionAlbumSheet(id,tile.sheet):tile.sheet)+'#album='+id;
 return assetResource(typeof recognitionPhotoKey==='function'?recognitionPhotoKey(id):id);
};
const clone=v=>JSON.parse(JSON.stringify(v));
function initial(){return {started:false,day:18,storyClock:'20:36',flags:{},registration:{},interview:{},history:clone(D.histories),unread:['police','friend'],notes:clone(D.notes),moments:clone(D.moments),remarks:{},favorites:[],photoFav:[],photoTrash:[],photoSaved:['before'],muted:[],pinned:[],hiddenChats:[],drafts:{},events:[{day:18,title:'给周警官发消息',time:'20:30'},{day:11,title:'小禾生日',time:'全天',month:6}],alarms:[{time:'07:00',on:true,label:'起床'}],searches:[],tabs:[{entries:['https://search.example/'],index:0}],activeTab:0,bookmarks:[],downloads:[],mailsRead:[],browserOnline:true,airplane:false,brightness:100,font:16,reduce:false,wifi:true,profile:{name:'林砚',sign:'平安就好。'},notifications:[],pending:[],calc:'0',webForms:[],postDraft:'',postedPhoto:null}}
let S;try{const v=JSON.parse(localStorage.getItem(KEY));S=v?.history?{...initial(),...v}:initial()}catch{S=initial()}
// Update authored identity fields in existing saves without resetting progress or personal notes.
function syncProtagonistName(){
  if(S.protagonistNameVersion===1)return;
  const rename=value=>typeof value==='string'?value.replaceAll('陈远','林砚').replaceAll('陈先生','林先生').replaceAll('陈氏','林氏').replaceAll('chenyuan','linyan'):value;
  const fields=(record,keys)=>{if(record)for(const key of keys)if(typeof record[key]==='string')record[key]=rename(record[key])};
  if(S.profile?.name==='陈远')S.profile.name='林砚';
  if(S.remarks?.me==='陈远')S.remarks.me='林砚';
  [S.registration,S.registerDraft,S.formDrafts?.['web-register']].forEach(record=>fields(record,['parent']));
  for(const form of S.webForms||[])if(form.name==='陈远')form.name='林砚';
  for(const [person,messages] of Object.entries(S.history||{}))for(const message of messages){
    if(!message.me||(person==='police'&&/陈远/.test(message.text)&&/0611|6月11|6[./-]11/.test(message.text)))fields(message,['text']);
  }
  for(const message of S.pending||[]){fields(message,['text']);fields(message.extra,['text'])}
  for(const notice of S.notifications||[])fields(notice,['text']);
  for(const moment of S.moments||[]){
    if(Array.isArray(moment.likes))moment.likes=moment.likes.map(rename);
    for(const comment of moment.comments||[])fields(comment,['name']);
  }
  for(const favorite of S.favorites||[])fields(favorite,favorite.me?['from']:['from','text']);
  for(const mail of S.sentMail||[])fields(mail,['from','email']);
  S.protagonistNameVersion=1;
}
syncProtagonistName();
let R={app:S.started?'home':'lock'},nav=[],photo=null,photoInfo=false,photoZoom=false,panel=null,noticeTimer,pendingTimer,holdTimer,contextOpen=false,keyboardDraft='',lastHome=0;
const iconNames=['back','forward','chat','contacts','compass','user','search','plus','more','photo','camera','smile','files','notes','settings','home','heart','star','share','trash','edit','check','mail','clock','sun','cloud','lock','refresh','tabs','book','info','calc','bell','wifi','close','down'];
const ico=n=>nativeIcon(n);
function art(kind){if(kind==='sea')return `<img class="avatar-art photo-art" src="${asset('sea')}" alt="海边">`;const i=Math.max(0,['mountain','flower','police','home','leaf','whale'].indexOf(kind));return `<span class="avatar-art photo-art avatar-sheet" role="img" aria-label="头像" style="background-image:url('${asset('avatars')}');background-position:${i%3*50}% ${Math.floor(i/3)*100}%"></span>`}
const pname=id=>S.remarks[id]|| (id==='me'?S.profile.name:D.people[id]?.name)||id;
function av(id,action=true){const p=D.people[id]||D.people.me;return `<${action?'button':'span'} class="avatar real-avatar" ${action?`data-a="profile" data-id="${id}" aria-label="${E(pname(id))}的资料"`:''}>${p.photo?`<img src="${asset(p.photo)}" alt="">`:(typeof personPortrait==='function'&&personPortrait(id)||art(p.art))}</${action?'button':'span'}>`}
function persist(){if(typeof syncZhihu==='function')syncZhihu();if(typeof syncCityMaps==='function')syncCityMaps();if(typeof syncDaughterRecognition==='function')syncDaughterRecognition();if(typeof syncClueStory==='function')syncClueStory();if(typeof dpState==='function')dpState();if(typeof syncDaughterName==='function')syncDaughterName();if(typeof syncAfterReturn==='function')syncAfterReturn();if(typeof syncFamilyName==='function')syncFamilyName();if(typeof syncPhoneRuntime==='function')syncPhoneRuntime();if(typeof syncPuzzle==='function')syncPuzzle();if(typeof syncDouyin==='function')syncDouyin();syncProtagonistName();if(typeof syncOfficialAccounts==='function')syncOfficialAccounts();if(typeof syncCipher==='function')syncCipher();if(typeof syncWechatFlow==='function')syncWechatFlow();if(typeof syncSocialDetails==='function')syncSocialDetails();if(typeof syncSocialReactions==='function')syncSocialReactions();if(typeof syncInquiry==='function')syncInquiry();if(typeof syncReturnInvestigation==='function')syncReturnInvestigation();if(typeof syncPhotoContent==='function')syncPhotoContent();if(typeof syncHorrorContent==='function')syncHorrorContent();if(typeof syncFamilyStory==='function')syncFamilyStory();try{localStorage.setItem(KEY,JSON.stringify(S))}catch{}}
function time(){return typeof phoneTimeString==='function'?phoneTimeString():storyBaseTime()}
function storyBaseTime(){return S.flags.done?(S.storyClock||'22:39'):S.flags.inner?'22:31':S.flags.door?'22:24':S.flags.mirror?'22:21':S.flags.memory?'22:20':S.flags.settled?'22:11':S.flags.found?'21:48':S.storyClock||'20:36'}
function storyDate(){const d=typeof phoneDate==='function'?phoneDate():new Date(Date.UTC(2026,8,S.day));return `${d.getUTCMonth()+1}月${d.getUTCDate()}日 ${['星期日','星期一','星期二','星期三','星期四','星期五','星期六'][d.getUTCDay()]}`}
function dayTo(day,clock){S.day=Math.max(S.day,day);S.storyClock=clock;persist()}
function dateChat(id,day=typeof phoneDate==='function'?phoneDate().getUTCDate():S.day,clock=time()){const date=`9月${day}日 ${clock}`;if(S.chatDays?.[id]!==date){S.chatDays??={};S.chatDays[id]=date;S.history[id].push({date})}}
function dismissNotice(){clearTimeout(noticeTimer);$('#notification').innerHTML=''}
function go(app,data={}){dismissNotice();closeOverlay();nav.push({...R});R={app,...data};panel=null;if(typeof horrorOnNavigate==='function')horrorOnNavigate(app,data);if(typeof returnedOnNavigate==='function')returnedOnNavigate(app,data);render()}
function back(){const returnScroll=R.app==='picker'?R.returnScroll:null;dismissNotice();closeOverlay();R=nav.pop()||{app:'home'};panel=null;render();if(returnScroll&&typeof launcherRestoreScroll==='function')launcherRestoreScroll(returnScroll)}
function home(){dismissNotice();closeOverlay();S.started=true;R={app:'home'};nav=[];panel=null;render();persist()}
function closeOverlay(){if(typeof dreadCancel==='function')dreadCancel();photo=null;photoInfo=false;photoZoom=false;if(typeof resetPhotoSequence==='function')resetPhotoSequence();$('#overlay').innerHTML='';contextOpen=false}
function sheet(title,content){$('#overlay').innerHTML=`<div class="sheet-shade" data-a="sheet-dismiss"><div class="action-sheet" role="dialog" aria-label="${E(title)}"><h3>${E(title)}</h3>${content}<button class="sheet-cancel" data-a="close">取消</button></div></div>`;$('#overlay button')?.focus()}
function dialog(title,content,buttons=''){ $('#overlay').innerHTML=`<div class="modal-shade"><div class="real-dialog" role="dialog" aria-label="${E(title)}"><h3>${E(title)}</h3><div>${content}</div><footer>${buttons||'<button data-a="close">好</button>'}</footer></div></div>`;$('#overlay input')?.focus()}
function push(id,text,type='text',extra={}){dateChat(id,extra.storyDay,extra.storyClock);const m={text,type,...extra};if(!m.npcResponse){S.npcRevision??={};S.npcRevision[id]=(S.npcRevision[id]||0)+1;if(typeof npcBeforeSend==='function')npcBeforeSend(id)}S.history[id].push(m);if(typeof returnedDelivered==='function')returnedDelivered(id,m);if(typeof markChatActivity==='function')markChatActivity(id);S.hiddenChats=S.hiddenChats.filter(x=>x!==id);if(!D.people[id]?.hiddenGod)wechatDelivered(id,m);if(!D.people[id]?.hiddenGod)S.notifications.unshift({id,text:type==='image'?'[图片]':text,time:time()});S.notifications=S.notifications.slice(0,20);persist();if(R.app==='deity'&&R.id===id){if(typeof renderDeityBody==='function')renderDeityBody();else render()}else if(R.app==='chat'&&R.id===id){renderChatBody()}else if(['chats','home','contacts','lock'].includes(R.app))render();if(!D.people[id]?.hiddenGod&&!S.muted.includes(id)&&!m.me)toast(id,type==='image'?'[图片]':text)}
function later(id,text,extra={},delay=4800){
 if(S.flags.found&&!S.flags.done&&extra.npcResponse){
  // Finish a player's direct conversation before resuming queued story messages.
  const queue=S.pending.sort((a,b)=>a.due-b.due);
  let index=0;while(index<queue.length&&queue[index].id===id&&queue[index].extra?.npcResponse)index++;
  const previous=queue[index-1]||S.wechat?.delivery?.last;
  const next={id,text,extra:{...extra},due:Math.max(Date.now()+Math.max(10000,delay),previous?(previous.due||previous.at)+wechatMessageGap(previous,{id,text,extra}):0)};
  queue.splice(index,0,next);
  for(let i=index+1;i<queue.length;i++)queue[i].due=Math.max(queue[i].due,queue[i-1].due+wechatMessageGap(queue[i-1],queue[i]));
  persist();schedule();return;
 }
 const now=Date.now(),tail=S.pending.reduce((a,b)=>!a||b.due>a.due?b:a,null);
 const next={id,text,extra};
 const last=S.wechat?.delivery?.last;
 const due=Math.max(now+Math.max(S.flags.found&&!S.flags.done?10000:4800,delay),tail?tail.due+wechatMessageGap(tail,next):last?last.at+wechatMessageGap(last,next):0);
 S.pending.push({id,text,extra:{...extra},due});persist();schedule();
}
function schedule(){
 clearTimeout(pendingTimer);
 if(typeof wechatDeliveryPacing==='function')wechatDeliveryPacing();
 if(!S.pending.length||(typeof phoneOnline==='function'&&!phoneOnline()))return;
 S.pending.sort((a,b)=>a.due-b.due);
 // A suspended page or offline phone resumes the conversation, never a burst.
 if(S.pending[0].due<Date.now()-1000){let at=Date.now()+(S.flags.found&&!S.flags.done?10000:4800),previous=null;for(const m of S.pending){if(previous)at=previous.due+wechatMessageGap(previous,m);m.due=Math.max(m.due,at);previous=m}persist()}
 pendingTimer=setTimeout(drain,Math.max(0,S.pending[0].due-Date.now()));
}
function drain(){
 if(typeof phoneOnline==='function'&&!phoneOnline()){schedule();return}
 S.pending.sort((a,b)=>a.due-b.due);const m=S.pending[0];
 if(!m||m.due>Date.now()){schedule();return}
 if(typeof wechatDraftPause==='function'&&wechatDraftPause(m)){persist();schedule();return}
 S.pending.shift();
 if(m.extra?.friendRequest)wechatRequest();
 else if((!m.extra?.npcContextKey||m.extra.npcContextKey===npcStateKey(m.id))&&(!S.flags.done||!m.extra?.horrorEvent)&&(m.id!=='club'||wechatIsFriend('club')))push(m.id,m.text,m.extra.type||'text',m.extra);
 if(S.wechat?.delivery)S.wechat.delivery.last={id:m.id,text:m.text,extra:{type:m.extra?.type},at:Date.now()};
 let previous={...m,due:Date.now()};
 for(const next of S.pending.sort((a,b)=>a.due-b.due)){next.due=Math.max(next.due,previous.due+wechatMessageGap(previous,next));previous=next}
 persist();schedule();
}
function replyMany(id,texts){texts.forEach(t=>later(id,typeof t==='string'?t:t.text||'',typeof t==='string'?{}:t))}
function once(flag,fn){if(S.flags[flag])return false;S.flags[flag]=true;fn();if(flag==='memory'&&typeof sendBedtimePhoto==='function')sendBedtimePhoto();if(typeof horrorFlagChanged==='function')horrorFlagChanged(flag);persist();return true}
function toast(id,text){if(R.app==='chat'&&R.id===id)return;clearTimeout(noticeTimer);$('#notification').innerHTML=`<button class="toast" data-a="notify" data-id="${id}">${av(id,false)}<span><strong>微信 · ${E(pname(id))}</strong><p>${E(text).slice(0,75)}</p></span></button>`;noticeTimer=setTimeout(()=>$('#notification').innerHTML='',4400)}
function sendMessage(id,text,type='text',extra={}){if(!wechatIsFriend(id)){go('newfriends');return false;}if(typeof requirePhoneNetwork==='function'&&!requirePhoneNetwork())return false;text=text.trim();if(!text&&type==='text')return;extra=Object.fromEntries(['photo','file','url'].filter(k=>typeof extra[k]==='string').map(k=>[k,extra[k]]));if(typeof npcBeforeSend==='function')npcBeforeSend(id);dateChat(id);S.history[id].push({text,type,...extra,me:true});if(typeof markChatActivity==='function')markChatActivity(id);S.drafts[id]='';panel=null;persist();render();if(type==='text'){if(!(typeof officialChat==='function'&&officialChat(id,text)))react(id,text);}if(typeof returnInvestigationSent==='function')returnInvestigationSent(id,text,type,extra);if(typeof horrorMessageSent==='function')horrorMessageSent(id,type,extra);if(typeof returnedShared==='function')returnedShared(id,type,extra);if(typeof clueOnSent==='function')clueOnSent(id,text,type,extra);}
function pickupIdentityMessage(text){
 const t=String(text||'').normalize('NFKC').replace(/\s/g,'');
 const clauses=t.split(/[，。；,;！!]/).filter(Boolean);
 const declared=clauses.filter(s=>!/[?？]|不是|并非|不确定|不记得|忘了|可能|好像|记错|不叫/.test(s));
 const name=declared.some(s=>/(?:^|我叫|我是|姓名是|名字是|名字叫|姓名叫|姓名[:：]|名字[:：])林砚(?!的(?:朋友|同事|妻子|爱人|表姐|邻居))/.test(s));
 const dates=declared.flatMap(s=>[...s.matchAll(/(?<!\d)(?:0?6|六)(?:月|[.\/-])(?:11|十一)(?!\d)(?:日|号)?|(?:^|[^\d])0611(?!\d)/g)].map(m=>({text:s,match:m})));
 const birthday=dates.some(({text:s,match:m})=>{const before=s.slice(0,m.index),year=before.match(/(\d{4})[年.\/-]$/);return !year||year[1]==='2015'});
 return {name,birthday};
}
function pickupIdentitySupplied(){
 if(!S.flags.matched||!S.flags.identityRequested)return {name:false,birthday:false};
 const history=S.history.police||[];
 // Only declarations after this officer's request count. Old missing-person paperwork is not a reply.
 const promptAt=history.findLastIndex(m=>!m.me&&/请把你的姓名和孩子生日再发一次|接领人的姓名和小禾生日一起发来/.test(m.text||''));
 if(promptAt<0)return {name:false,birthday:false};
 const replies=history.slice(promptAt+1).filter(m=>m.me&&(!m.type||m.type==='text')).slice(-8);
 const supplied=replies.map(m=>pickupIdentityMessage(m.text));
 return {name:supplied.some(m=>m.name),birthday:supplied.some(m=>m.birthday)};
}
function pickupIdentityReady(){const identity=pickupIdentitySupplied();return identity.name&&identity.birthday}
function react(id,t){
 if(S.flags.done){
  if(typeof clueNpcAllowed==='function'&&!clueNpcAllowed(id))return;
  const delivered=(S.history[id]||[]).filter(m=>!m.me&&m.clueEffect==='ending:'+S.flags.done&&m.type!=='image').at(-1);
  npcReply(id,t,[delivered?.text||'我在。有什么事你说。']);return;
 }
 if(typeof recognitionObserve==='function')recognitionObserve(id,t);
 if(typeof clueConversation==='function'&&clueConversation(id,t))return;
 if(typeof returnedConversation==='function'&&returnedConversation(id,t))return;
 if(typeof puzzleConversation==='function'&&puzzleConversation(id,t))return;if(typeof flowReviewChat==='function'&&flowReviewChat(id,t))return;
 if(typeof wechatConversation==='function'&&wechatConversation(id,t))return;
 if(typeof inquiryChat==='function'&&inquiryChat(id,t))return;
 if(typeof returnInvestigationChat==='function'&&returnInvestigationChat(id,t))return;
 if(typeof horrorConversation==='function'&&horrorConversation(id,t))return;
 if(typeof photoConversation==='function'&&photoConversation(id,t))return;
 if(typeof familyConversation==='function'&&familyConversation(id,t))return;
 if(id==='police'){
  if(!S.flags.found&&pickupIdentityReady()){once('found',()=>{dayTo(24,'21:48');later('wife','鞋倒是自己摆好了。',{type:'image',photo:'home_shoes'},2100);replyMany('police',['我陪李岚办完接领了，20:36交接的。手续核对过了。','李岚先带她回家。你在所里补的材料，我收到了。','这四十二天她去了哪里，我们接着查。']);later('wife','刚才在车上，她一路都没有说话。现在坐在床边，也不肯换衣服。',{},3200);later('wife','从上车到现在，她一直是这个表情。我让她别笑了，她问我为什么。',{},4500);later('wife','',{type:'image',photo:'returned'},5600);later('daughter','爸爸。',{},6800);later('daughter','我回家了。',{},8000);later('daughter','你说过，'+(S.interview.wish||'什么都不用做。回来就行。'),{},9000)});}
  else if(!S.flags.found&&/0417/.test(t)){if(!S.flags.matched){replyMany(id,[S.flags.registered?'编号收到了。还没找到对得上的孩子。平台有消息，你发给我。':'报案登记我这里有，还没有新消息。网上那家机构，你先查查来历，再填资料。']);return}once('identityRequested',()=>{dayTo(24,'19:42');replyMany(id,['西郊救助站新收留的孩子，和照片很像。我们还要确认是不是小禾，查清她之前的去向。','请把你的姓名和孩子生日再发一次，我核对接领信息。李岚已经在过去的路上。'])})||replyMany(id,['接领人的姓名和小禾生日一起发来就可以。']);}
  else if(!S.flags.found&&S.flags.identityRequested&&/姓名|名字|爸爸|父亲|生日|出生|我叫|林砚|\d.*月|\d{4}/.test(t)){const identity=pickupIdentitySupplied();replyMany(id,[identity.name?'姓名记下了。小禾是哪年哪月哪日出生的？我再对一下登记。':identity.birthday?'生日记下了。来接孩子的是谁？把姓名发我。':'登记上没对上。您的姓名和小禾的出生年月日，再发我一遍。']);}
  else if(/手机|账号|上线/.test(t))replyMany(id,S.flags.found?['旧手机在证物柜里封着，没开机，也没交还。','消息和照片先留好，我来查。']:['那晚在学校门口附近找到的手机还封存着，没交还。手机坏了，里面的记录还在查。']);
  else if(/证据|资料|档案|归亲|邪教|接|来|不对/.test(t)&&S.flags.inner)replyMany(id,['资料原件发给我。不要再联系网站的人。','我现在过去。先别开门。']);
  else npcReply(id,t,[S.flags.found?'有异常直接告诉我，我一直在。':S.flags.matched?'平台那条登记的编号发来，我再核对一下。':'学校和沿路还在走访。网上看到新线索，把原始记录留好，发给我。']);
 }else if(id==='daughter'){
  if(!S.flags.found)return;
  if(/鲸/.test(t)){if(once('memory',()=>{replyMany(id,['对。小鲸鱼。','它背上开线了，你答应替我缝好。','记得用蓝线，不要白线。','这样说，就和以前一样了。']);later(id,'你可以不要再看以前的我了吗？',{},4300);later(id,'看现在的。',{type:'image',photo:'door'},5500);}))return;replyMany(id,['我已经记住了。为什么还要问？']);}
  else if(/生日|礼物|喜欢|兔/.test(t))replyMany(id,['奶奶送的绿色兔子。我最喜欢兔子。','照片里的我也在笑。你不是这样写的吗？']);
  else if(/照片|拍|门|站|外面/.test(t))replyMany(id,[S.flags.door?'你刚刚看了照片的拍摄设备。':'我在等你。','门不用开。我知道你在里面。']);
  else if(/谁|不是|女儿|假的|小禾|以前/.test(t))replyMany(id,['我是小禾。',S.flags.memory?'你问我，我可以学会。':'我不是已经回来了吗。你为什么还在找？']);
  else npcReply(id,t,[S.flags.inner?'你现在看的那个网页，不是给家人看的。':'爸爸，你今天看了我很多次。']);
 }else if(id==='wife'){
  if(!S.flags.found)npcReply(id,t,[S.flags.registered?'资料我也看了。她生日那张照片你手机里有，别再拍身份证给陌生人。':'我又在网上找了一晚上。你也看看有没有正规的寻亲机构，能多问一家是一家。']);
  else if(/礼物|兔|鲸|生日|不对|奇怪|怎么/.test(t))replyMany(id,['她刚才说最喜欢那只兔子。生日那天你哄了她半天，你记得吧？','我就说了一句，她以前叫你“爸”。过一会儿，她跑到门口，一声一声地练。']);
  else if(/门|照片|走廊|在哪/.test(t))replyMany(id,['我在厨房。她还站在你门口，半天没动。','我问她站那儿干吗，她说爸爸还没看完。']);
  else npcReply(id,t,['我知道。你先别急着问她。']);
 }else if(id==='club'){
  if(!S.flags.found){npcReply(id,t,[S.flags.matched?'今天救助站转来一条新消息，已经交给办案人员了。':S.flags.leadReviewed?'上一条对不上。我们还在问周边的救助站，有消息就联系您。':S.flags.verified?'现场照片已经发给您了。您看看是不是小禾，直接回我就行。':S.flags.interviewed?'学校的记录收到了。照片我一会儿发您，稍等。':S.flags.registered?'登记收到了。孩子平时的习惯和最近的照片，可以补到家庭访谈里。':'您好，官网上可以登记寻亲信息。材料不齐也没关系，您先说说情况。',{type:'link',url:BASE+(S.flags.registered?'/family':'/register'),text:S.flags.registered?'家属中心':'归家寻亲 · 在线登记'}]);return}
  if(/档案|隐私|资料|副本|记录/.test(t))replyMany(id,['要资料副本，按受理邮件里的说明申请。','孩子都回来了，您还翻这些做什么？']);
  else if(/谁|邪教|归亲|模仿|假的|原身份/.test(t))replyMany(id,['林先生。她已经回家了。','你还在找谁？']);
  else npcReply(id,t,[S.flags.found?'一家人重新住在一起，才叫真正的归家。':'进展在登记页面。我们一直记着你家。',{type:'link',url:BASE+'/',text:'归家寻亲'}]);
 }else if(id==='old'){
  once('oldTalk',()=>{replyMany(id,['小鲸鱼最后一针是白线。你藏在它尾巴下面。','这句我没在微信里说过。','这里的房间越来越空了。她学会一样，我就会忘掉一样。','我不是让你伤害她。先别把我的名字给她。'])})||npcReply(id,t,['把原来的记录留下来。也别只相信我说的话。']);
 }else if(id==='teacher'){const lines=[S.flags.found?'回来就好。上课的事不着急，先让她歇歇。':'那天17:40放学。小禾没跟同学走，穿着奶白色外套，在门口等您。'];if(/放学|几点|衣服|衣着|时间|外套|那天/.test(t))replyMany(id,lines);else npcReply(id,t,lines);}
 else if(id==='friend')npcReply(id,t,[S.flags.found?'回来就好。但你说的这些我有点不放心。我过去找你？':'我还在问。你也看看线上的寻亲机构，先查清楚资料再登记。我记得有一个做家属陪伴的公益平台。']);
}
function seenPhoto(id){if(typeof returnedOnPhoto==='function')returnedOnPhoto(id);if(typeof rememberPhotoView==='function')rememberPhotoView(id);if(id==='door'&&!S.flags.done)S.flags.door=true;if(typeof horrorPhotoViewed==='function')horrorPhotoViewed(id)}

function sawInner(){if(!S.flags.found)return;once('inner',()=>{S.hiddenChats=S.hiddenChats.filter(x=>x!=='old');later('old','爸爸。你是不是已经找到我了？',{},1800);later('club','你的档案有新的访问记录。是你本人吗？',{},4500)})}
function archiveFamily(){browse(S.flags.done?BASE+'/ending':BASE+'/account/convert')}

function registerFamily(fields){S.registration=fields;once('registered',()=>{dayTo(19,'09:12');S.wechat.friend.status='scheduled';S.wechat.friend.seen=false;later('club','',{friendRequest:true},8000);later('wife','收到你登记的消息了。我把她房间又收拾了一遍。',{},18000)});browse(BASE+'/family')}
function submitInterview(fields){S.interview=fields;once('interviewed',()=>{dayTo(20,'16:18');replyMany('club',['访谈、生日照片都收到了。受理邮件已发，您留意一下。','您写的那些喜好，我转给志愿者，见到孩子时能用上。']);later('wife','她哪喜欢那只兔子。生日那天怕奶奶难过，才挤了个笑，你忘了？',{},11000)});browse(BASE+'/family')}
function submitVerification(){browse(BASE+'/family')}
function reviewLead(reason){S.leadReason=reason;once('leadReviewed',()=>{dayTo(22,'18:09');S.wechat.lead.reviewed=true;S.wechat.lead.pending=false;replyMany('club',['抱歉让你们又白等了一次。我们继续找。',{type:'link',url:BASE+'/followup',text:'归家寻亲 · 家属回访'}]);later('wife','以为这次真的有消息了。',{},11000);later('wife','又给她摆了双筷子。摆完才想起来。',{},15000);S.moments.unshift({id:'waiting',person:'wife',date:'9月22日',text:'灯还是留着。',likes:[],comments:[]});inquiryRouteLead()})}
function requestFollowup(){if(!S.puzzle?.intake){browse(BASE+'/followup');return}if(!S.flags.leadReviewed)return;once('followup',()=>{dayTo(23,'14:08','west-shelter');replyMany('club',['青槐换箱条和西郊救助站的留言对上了。站里正翻旧资料，孩子现在在哪儿还没查到。','站里最近收留过一个女孩，说不清自己的身份。他们在找照片，有消息就联系你。']);later('friend','明天我再跑趟西郊。你有话就跟我说，别憋着。',{},3300)});browse(BASE+'/followup')}
function checkNewMatch(){if(!S.puzzle?.intake){browse(BASE+'/followup');return}if(!S.flags.followup)return;once('matched',()=>{dayTo(24,'18:54','west-shelter');replyMany('club',['西郊救助站把旧移交记录和最近的收留记录都发来了。新来的女孩很像小禾，照片已交给办案人员。她之前去了哪里，站里还在查。',{type:'link',url:BASE+'/record?id=QH-0417',text:'登记 QH-0417 · 线索更新'}]);later('police','收到归家平台转交的线索了。把你在平台上的登记编号发来，我核对家属信息。',{},3200)});browse(BASE+'/record?id=QH-0417')}

function restoreFormDrafts(){document.querySelectorAll('form[data-form]').forEach(f=>{const values=S.formDrafts?.[f.dataset.form];if(!values)return;for(const el of f.elements){if(!el.name||el.type==='file')continue;if(el.type==='checkbox'||el.type==='radio')el.checked=values[el.name]===el.value;else if(Object.hasOwn(values,el.name))el.value=values[el.name]}})}
function retainFormDraft(e){const f=e.target.closest('form[data-form]');if(!f||!['web-register','web-interview','cipher-translate','cipher-passphrase','cipher-paper','cipher-vow','pz-login','pz-draft-search','pz-vow'].includes(f.dataset.form))return;S.formDrafts??={};const v=Object.fromEntries(new FormData(f).entries());S.formDrafts[f.dataset.form]=v;if(f.dataset.form==='web-register')S.registerDraft=v;persist()}
document.addEventListener('input',retainFormDraft);document.addEventListener('change',retainFormDraft);

window.gameImagesReady=Promise.all([...new Set(['people-real','news-community','scare-face','cult-idol','cult-title','deity-title','status','avatars','sea','ui-icons',...Object.keys(D.photos)])].map(id=>{const img=new Image();img.src=asset(id);return img.decode().catch(()=>{})}));

