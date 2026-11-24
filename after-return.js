/* Fictional phone camera and earned photographic encounters. Never uses device media. */
const RETURNED_IMAGES={
 'returned-backturn':{flag:'returnedBackturnReceived',description:'齐肩短发、外貌像小禾的女孩坐在餐桌前，奶白开衫的背面朝着镜头，脸却从肩上转回来，带着微笑看向镜头。'},
 'evil-near':{flag:'evilNearReceived',description:'食名母木像的脸被拍得极近，黑色眼孔朝下，喉前的布层中挂着另一张小面具。没有人的现场照片。'},
 'evil-hall':{flag:'evilHallReceived',description:'幽暗长廊两侧挂满面具，全部朝向镜头，尽头一扇小门通向亮着灯的空餐厅。只是对方传来的图像，不能确定它在现实中的地点。'}
};
const CAMERA_DESCRIPTIONS={
 'camera-empty':'手机后置镜头拍到餐桌前的一张空木椅，画面里没有人。',
 'camera-preview':'手机后置镜头中，外貌像小禾的女孩穿奶白开衫坐在餐桌前，双手平放，轻轻笑着。',
 'camera-capture':'手机拍下的餐桌照片中，外貌像小禾的女孩双手平放在餐桌上，没有笑，嘴微微张开，睁大的眼睛直盯镜头。',
 'iphone-selfie-preview':'林砚独自在书房，前置镜头拍到他的脸、肩膀和身后的房间。',
 'iphone-selfie-capture':'书房自拍照片里，林砚旁边多了一名外貌像小禾的短发女孩，穿奶白开衫，脸贴近他的肩后，带着微笑望向镜头。',
 'iphone-mirror-preview':'洗手台前，穿奶白开衫的短发女孩背对镜头，手扶着洗手台，镜中是她低着眼的脸。',
 'iphone-mirror-capture':'洗手台照片中，女孩背对镜头，手扶着洗手台；镜中的倒影却把两只手按在玻璃上，脸苍白、眼窝发黑，翻着白眼张大嘴。实体与倒影的手和表情不一致。',
 'iphone-bed-preview':'从小禾房间门缝看进去，穿奶白开衫的女孩闭眼侧躺在碎花被子里，床边有蓝色鲸鱼玩偶，台灯亮着。',
 'iphone-bed-capture':'卧室门缝照片中，床上只剩碎花被子和蓝色鲸鱼玩偶；穿奶白开衫的短发女孩已经贴在门框近处，睁着灰白虹膜的眼睛直盯镜头，嘴没有笑。'
};
let returnedCaptureJob=null,returnedFlashTimer=null;
function afterReturnData(){
 S.afterReturn??={version:1,events:{},captures:[],seen:[],serial:0,power:true};
 const r=S.afterReturn;r.events??={};r.captures??=[];r.seen??=[];r.serial??=0;r.power=true;r.version=2;
 if(!['table','selfie','mirror','bed'].includes(r.cameraScene))r.cameraScene='table';return r;
}
function returnedPhotoData(id,file,stamp,description,device='相机 · 后置镜头'){
 const t=String(stamp||'2026-09-24T22:31:00+08:00'),d=t.slice(0,10).split('-');
 return {title:id.startsWith('homecam_')?'CAM_'+t.slice(0,19).replace(/[-:T]/g,'')+'_'+id.split('_')[1]+'.JPG':'IMG_'+id.replaceAll('-','_')+'.JPG',file,takenAt:t,date:`${d[0]}年${Number(d[1])}月${Number(d[2])}日`,time:t.slice(11,16),description,device,lens:'已存储图像',size:'2.4 MB',album:'最近项目',location:''};
}
function syncAfterReturn(){
 const r=afterReturnData();
 for(const id of Object.keys(D.photos))if(id.startsWith('homecam_')&&!r.captures.some(c=>c.id===id))delete D.photos[id];
 for(const c of r.captures)if(/^homecam_\d+$/.test(c.id)&&CAMERA_DESCRIPTIONS[c.file])D.photos[c.id]=returnedPhotoData(c.id,c.file,c.at,returnedCaptureDescription(c));
 for(const [id,spec]of Object.entries(RETURNED_IMAGES)){
  const delivered=Object.values(S.history).flat().find(m=>!m.me&&m.type==='image'&&m.photo===id);
  if(delivered)S.flags[spec.flag]=true;
  D.photos[id]={...returnedPhotoData(id,id,delivered?.receivedAt,spec.description,id.startsWith('evil-')?'来自座前的图像':'来自微信'),requires:spec.flag};
 }
 // Old interrupted scares must not outlive the feed or the ending that invalidates them.
 S.pending=S.pending.filter(m=>!(m.extra?.returnedEvent&&(S.flags.done||(S.puzzle?.feedCut&&(m.extra.requiresFeed||m.extra.returnedEvent==='camera-intro'||m.extra.returnedEvent.startsWith('wife-photo-'))))));
}
function returnedCaptureDescription(shot){
 if(shot.camera&&Number(shot.camera.zoom)>.5)return `手机${shot.camera.lens==='front'?'前置':'后置'}镜头以${Number(shot.camera.zoom)}倍变焦拍下的一张局部照片。图像经过裁切，未提供这一裁切区域的可靠细节；不能补充原图画框外的人物、动作或房间陈设。`;
 return CAMERA_DESCRIPTIONS[shot.file];
}
function returnedActive(){return Boolean(S.flags.found&&!S.flags.done)}
function returnedCameraActive(){return returnedActive()&&!S.puzzle?.feedCut}
function returnedQueue(key,entries){
 const r=afterReturnData();entries=entries.filter(e=>!e.requiresFeed||!S.puzzle?.feedCut);if(!returnedActive()||r.events[key]||!entries.length)return false;r.events[key]=true;
 for(const e of entries)later(e.id||'daughter',e.text||'',{horrorEvent:'returned-'+key,returnedEvent:key,...(e.photo?{type:'image',photo:e.photo}:{}),...(e.requiresFeed?{requiresFeed:true}:{}),...(e.cameraScene?{cameraScene:e.cameraScene}:{})},e.delay||4800);
 return true;
}
function returnedDelivered(id,m){
 if(m.type==='image'&&RETURNED_IMAGES[m.photo]){m.receivedAt=phoneTimestamp();S.flags[RETURNED_IMAGES[m.photo].flag]=true;}
 if(id==='wife'&&!m.me&&m.returnedEvent&&['selfie','mirror','bed'].includes(m.cameraScene)&&returnedCameraActive()){
  returnedCancelCapture();const r=afterReturnData();r.cameraScene=m.cameraScene;r.camera??={};r.camera.lens=m.cameraScene==='selfie'?'front':'rear';r.camera.zoom??={rear:.5,front:.5};r.camera.zoom[r.camera.lens]=.5;
  if(R.app==='homecamera')render();
 }
}
function returnedOnPhoto(id){
 const r=afterReturnData(),shot=r.captures.find(c=>c.id===id);
 if(shot&&!r.seen.includes(id))r.seen.push(id);
 if(!returnedActive())return;
 if(id==='hollow')returnedBackturn();
 if(id==='returned'&&returnedCameraActive())returnedQueue('camera-intro',[
  {id:'wife',requiresFeed:true,text:'你先拍张她坐在餐桌前的照片给我。别叫她。'},
  {id:'wife',requiresFeed:true,text:'我一看她，她就笑。刚才我转身倒水，她还在后面说：妈妈，我没动。'}
 ]);
 if(id==='home_sleep'&&!S.flags.hollowWifeSheltered)returnedQueue('breathing',[
  {id:'wife',text:'她刚才一直盯着我的胸口。我吸气，她也吸气。'},
  {id:'wife',text:'我憋住气，她也不动了，一直看着我。等我喘气，她才跟着喘。'},
  {id:'wife',text:'我没敢再试。她问我，她学得对不对。'}
 ]);
 if(shot?.anomaly==='expression'&&!S.puzzle?.feedCut)returnedQueue('camera-expression',[
  {text:'刚才那一张，没笑好吗？',requiresFeed:true},
  {text:'你看着的时候，我一直是笑的。',requiresFeed:true}
 ]);
 if(shot?.anomaly==='absence'&&!S.puzzle?.feedCut)returnedQueue('camera-absence',[
  {text:'刚才没看见我吗？',requiresFeed:true},
  {text:'照片里明明有。爸，你再看一眼。',requiresFeed:true}
 ]);
 if(id==='returned-backturn')returnedQueue('backturn-seen',[
  {text:'背着你也可以看见。'},
  {text:'爸，你刚才是在后面叫我吗？'}
 ]);
}
function returnedOnNavigate(app,data={}){
 if(!returnedActive())return;
 // A chat visit alone does not start another scare sequence.
}
function returnedBackturn(){
 if(!returnedActive()||!S.flags.inner)return false;
 return returnedQueue('backturn',[
  {text:'爸，你以前的照片，总只拍到前面。'},
  {photo:'returned-backturn'},
  {text:'后面这样，对吗？'}
 ]);
}
function returnedShotFile(){
 if(!returnedCameraActive())return 'camera-empty';
 const scene=afterReturnData().cameraScene;if(scene==='mirror'||scene==='bed')return 'iphone-'+scene+'-capture';
 return 'camera-capture';
}
function returnedPreviewFile(){
 if(!returnedCameraActive())return 'camera-empty';
 const r=afterReturnData();if(r.cameraScene==='mirror'||r.cameraScene==='bed')return 'iphone-'+r.cameraScene+'-preview';
 return S.flags.memory&&r.seen.some(id=>r.captures.some(c=>c.id===id&&c.anomaly))?'camera-empty':'camera-preview';
}
async function returnedCapture(){
 if(R.app!=='homecamera'||returnedCaptureJob)return;
 const job={state:S,key:npcStateKey(),file:returnedShotFile(),preview:returnedPreviewFile(),scene:afterReturnData().cameraScene};returnedCaptureJob=job;
 const valid=()=>S===job.state&&R.app==='homecamera'&&returnedCaptureJob===job&&job.key===npcStateKey()&&job.scene===afterReturnData().cameraScene&&job.file===returnedShotFile();
 try{const im=new Image();im.src=asset(job.file);await im.decode();
  if(!valid())return;
  const r=afterReturnData(),id='homecam_'+(++r.serial),anomaly=returnedCameraActive()?(job.file==='iphone-selfie-capture'?'selfie':job.scene==='mirror'?'reflection':job.scene==='bed'?'doorway':job.preview==='camera-empty'?'absence':'expression'):null;
  const shot={id,file:job.file,preview:job.preview,scene:job.scene,at:phoneTimestamp(),anomaly};r.captures.push(shot);syncAfterReturn();S.photoSaved.push(id);persist();render();
  const flash=document.querySelector('.homecam-shutter-flash');if(flash){flash.hidden=false;clearTimeout(returnedFlashTimer);returnedFlashTimer=setTimeout(()=>{flash.hidden=true},140)}
 }catch{if(valid())dialog('无法存储照片','照片暂时无法保存，请重试。')}
 finally{if(returnedCaptureJob===job)returnedCaptureJob=null}
}
function returnedCancelCapture(){if(returnedCaptureJob){returnedCaptureJob.key='camera-cancelled';returnedCaptureJob=null}}
function returnedAction(a,b){
 if(!a.startsWith('returned-'))return false;
 const r=afterReturnData();
 if(a==='returned-camera-shoot')returnedCapture();
 else if(a==='returned-camera-album'){const list=r.captures.filter(c=>!S.photoTrash.includes(c.id)).slice().reverse();if(list.length)photoView(list[0].id,list.map(c=>c.id));else dialog('抓拍相册','尚无照片。')}
 return true;
}
function returnedConversation(id,text){
 if(!returnedActive()||!['wife','daughter'].includes(id)||!/摄像|抓拍|预览|快门|转头|头发|后脑|脖子|朝向|空椅|表情/.test(text))return false;
 if(id==='daughter'&&S.flags.inner&&/转头|头发|后脑|脖子|朝向/.test(text))returnedBackturn();
 const shared=(S.history[id]||[]).some(m=>m.me&&m.type==='image'&&(m.photo?.startsWith('homecam_')||m.photo==='returned-backturn'));
 npcReply(id,text,id==='wife'?[shared?'这张我收到了。你留着原图，先别让她知道你在比对。':'你把刚才那张图发我。我还没看见，先别急着问她。']:['你要看哪一面？','你说清楚，我再转过来。']);return true;
}
function returnedShared(id,type,extra){
 if(type!=='image'||!D.photos[extra?.photo]||(!extra.photo.startsWith('homecam_')&&!RETURNED_IMAGES[extra.photo]))return;
 if(!['wife','friend','police','daughter'].includes(id))return;
 const sent=S.history[id]?.at(-1);if(!sent?.me||sent.type!=='image'||sent.photo!==extra.photo)return;
 if(id==='wife'&&returnedWifePhoto(extra.photo))return;
 npcReply(id,'[林砚发送了一张图片，请依据这张图的已知画面简短回应。]',id==='daughter'?['这张你也要存着吗？']:['图收到了。我先仔细看看，你说说当时是怎么拍的。']);
}
function returnedWifePhoto(id){
 if(!returnedCameraActive())return false;const r=afterReturnData(),shot=r.captures.find(c=>c.id===id);if(!shot?.anomaly)return false;
 const queue=(key,entries)=>{npcBeforeSend('wife');returnedQueue(key,entries.map(e=>({id:'wife',requiresFeed:true,...(typeof e==='string'?{text:e}:e)})));return true};
 if(shot.camera&&Number(shot.camera.zoom)>.5)return queue('wife-photo-crop-'+shot.id,['这一张放得太近，周围都裁掉了。','别放大，拍完整一点再发我。我看不见她旁边有什么。']);
 if(shot.file==='camera-capture'&&r.cameraScene==='table')return queue('wife-photo-selfie',[
  '这张收到了。她没有笑，眼睛一直朝着镜头。',
  '你先别对着她拍了。',
  {text:'切到前置，拍一张你自己。把肩膀后面也带上，原图发我。',cameraScene:'selfie'}
 ]);
 if(shot.file==='iphone-selfie-capture'&&r.cameraScene==='selfie')return queue('wife-photo-mirror',[
  '你肩后还有一张脸。贴得那么近。',
  '她在这张里是笑着的。我看不出她是从哪边靠过来的。',
  {text:'站远一点，用后置拍洗手台那面镜子。把人和倒影一起拍进去，别靠近她。',cameraScene:'mirror'}
 ]);
 if(shot.file==='iphone-mirror-capture'&&r.cameraScene==='mirror')return queue('wife-photo-bed',[
  '外面那双手还扶着洗手台。',
  '镜子里的手，按在玻璃上。脸也不一样。别叫她。',
  {text:'到小禾房间门口看一眼。别进去，从门缝拍床和门边，把原图发我。',cameraScene:'bed'}
 ]);
 if(shot.file==='iphone-bed-capture'&&r.cameraScene==='bed')return queue('wife-photo-finished',[
  '床上只剩被子和那个鲸鱼。她的脸就在门边。',
  '眼睛不对。林砚，别再往里面走。',
  S.flags.hollowWifeSheltered?'我还在房间里，门没开。你先回能关门的地方，照片都留着。':'先把门关上，别再靠近。照片都留着，我们先在手机里说。'
 ]);
 return false;
}
function returnedDeitySend(id,text){
 if(id!=='mother'||!returnedActive()||!S.flags.inner||!/照片|图片|样子|看看你|给我看|看清|你的脸|名字|那扇门|门后/.test(text)||/不想活|想死|伤害|自杀|付钱|转账/.test(text))return false;
 const r=afterReturnData();let key=!r.events['mother-near']?'mother-near':!r.events['mother-hall']?'mother-hall':null;
 if(!key||r.lastMotherImageAt&&Date.now()-r.lastMotherImageAt<30000)return false;
 npcBeforeSend(id);r.lastMotherImageAt=Date.now();
 returnedQueue(key,key==='mother-near'?[
  {id,text:'你要看清楚。'},
  {id,photo:'evil-near'},
  {id,text:'这张也不是我的。你认得吗？'}
 ]:[
  {id,photo:'evil-hall'},
  {id,text:'每一张，都有人在门外叫过它的名字。'},
  {id,text:'它们都听过你叫小禾。现在都要叫你爸爸。'}
 ]);return true;
}
function returnedNpcFacts(id){
 const r=afterReturnData(),facts=[];
 // A private camera save is never automatically shared with contacts or deities.
 for(const m of (S.history[id]||[]).filter(m=>!m.me&&m.returnedEvent).slice(-5)){
  if(m.type==='image')facts.push('你已发出的图片：'+(D.photos[m.photo]?.description||'图像细节未提供。'));
 }
 if(id==='daughter'&&(S.history.daughter||[]).some(m=>!m.me&&m.returnedEvent==='camera-expression'))facts.push('你在这段对话中已经回应过摄像头预览笑容与抓拍表情不一致的事。只能继续回应这一已发生异常，不能读取现在的新画面。');
 return facts;
}
function renderDeityBody(){
 const body=document.querySelector('#deity-messages');if(!body||R.app!=='deity')return;
 const near=body.scrollHeight-body.scrollTop-body.clientHeight<100,top=body.scrollTop;
 body.innerHTML=`<p class="pz-deity-address">${R.id==='mother'?'你说的话，它都听得见。':'灯下的声音很轻。'}</p>`+(S.history[R.id]||[]).filter(m=>!m.date).map(m=>deityMessageHTML(m,R.id)).join('');
 body.scrollTop=near?body.scrollHeight:top;
}
setInterval(()=>{if(R.app==='homecamera'){const t=document.querySelector('[data-homecam-time]');if(t)t.textContent=phoneStamp()}},1000);
syncAfterReturn();
