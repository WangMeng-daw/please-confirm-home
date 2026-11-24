/* These events observe only actions inside the fictional phone. */
function syncHorrorContent(){
 const x=window.HORROR_CONTENT;if(!x)return;
 if((S.horrorContentVersion||0)<x.version){
  const existing=new Set(S.moments.map(m=>m.id));
  for(const post of x.posts)if(!existing.has(post.id))S.moments.push(clone(post));
  const bedroomText={
   '让她休息了。刚才进去看，她还是这样坐着。':'卧室关灯后过了一会儿，我去看她，门刚开一条缝，她就已经对着我在笑。',
   '我记得她以前不留一盏灯就睡不着。今天她说，闭眼会弄错。':'我记得她以前不留一盏灯就睡不着。今天我让她闭眼，她说：你不看着，我就不知道脸该放在哪里。'
  };
  for(const m of S.history.wife||[])if(!m.me&&Object.hasOwn(bedroomText,m.text))m.text=bedroomText[m.text];
  for(const m of [...(S.pending||[]),...(S.notifications||[])])if(m.id==='wife'&&Object.hasOwn(bedroomText,m.text))m.text=bedroomText[m.text];
  S.horrorContentVersion=x.version;
 }
 if(S.puzzle?.feedCut)S.pending=S.pending.filter(m=>!['horrorRead','horrorDraft','horrorDoorRead'].includes(m.extra?.horrorEvent));
 const photos=[...x.afterMemoryPhotos,...x.afterInnerPhotos].filter(id=>typeof storyPhotoReceived==='function'&&storyPhotoReceived(id));
 for(const id of photos)if(!S.photoSaved.includes(id))S.photoSaved.push(id);
 // Scheduling a photograph is not receiving it. A reload derives access from the actual message.
 const hollow=(S.history.daughter||[]).some(m=>!m.me&&m.type==='image'&&m.photo==='hollow');
 if(hollow)S.flags.hollowReceived=true;
 if(S.flags.hollowReceived)S.flags.horrorHollowSent=true;
 if(!S.flags.done&&(S.history.wife||[]).some(m=>!m.me&&m.hollowStage==='wife-sheltered'))S.flags.hollowWifeSheltered=true;
}
function horrorSequence(flag,entries){
 if(S.flags.done||S.flags[flag])return false;
 S.flags[flag]=true;
 for(const [i,e] of entries.entries())later(e.id||'daughter',e.text||'',{horrorEvent:flag,...(e.extra||{}),...(e.photo?{type:'image',photo:e.photo}:{})},e.delay??1600+i*1700);
 persist();return true;
}
function horrorMirror(){
 if(!S.devices?.phoneRecovered||!S.flags.memory||S.flags.done||S.flags.mirror||S.flags.horrorHollowSent)return;
 S.flags.mirror=true;syncHorrorContent();
 horrorSequence('horrorMirrorSent',[
  {id:'wife',text:'她刚刚发了一条朋友圈。你看一下。'},
  {id:'wife',text:'那张是在洗手间拍的。当时我一直站在她身后。'},
  {id:'wife',photo:'reflection'},
  {id:'wife',text:'我按快门的时候，她已经转过头了。'}
 ]);
}
function horrorThreshold(){
 if(!S.flags.inner||S.flags.done||S.flags.horrorHollowSent)return;
 syncHorrorContent();
 horrorSequence('horrorThreshold',[
  {text:'你把“未交付部分”看完了吗？'},
  {photo:'threshold'},
  {text:'没拍到我。你怎么还是认出来了。'},
  {id:'wife',text:'别回门外那个人。小禾还在我旁边。'}
 ]);
}
function horrorHollow(){
 const r=S.returnInvestigation;
 if(!S.flags.found||!S.flags.inner||S.flags.done||!r?.sourceCorrected||!r.memoryVerified||S.flags.horrorHollowSent)return;
 // Let already-earned reactions finish, including the three private-memory replies.
 const after=Math.max(0,...S.pending.filter(m=>m.extra?.horrorEvent).map(m=>m.due-Date.now()));
 const entries=[
  {id:'wife',text:'她把鲸鱼放回床上，自己走到餐桌那边了。没拿手机。'},
  {text:'爸，你是不是还觉得我不像她？'},
  {text:'我把外面这一层拿下来，你再看看。'},
  {photo:'hollow'},
  {text:'里面没有她。'},
  {text:'她的事，你不说，我就不知道。'},
  {id:'wife',text:'她手里垂着一张脸。她脸上还有一张。'},
  {id:'wife',text:'我退回卧室了。门锁上了。你也别出来。',extra:{hollowStage:'wife-sheltered'}}
 ];
 horrorSequence('horrorHollowSent',entries.map((entry,i)=>({...entry,delay:after+1800+i*2000})));
}
function horrorFlagChanged(flag){}

function horrorOnNavigate(app,data){
 if(!S.flags.found||S.flags.done)return;
 if(app==='chat'&&data.id==='daughter'&&S.flags.memory)horrorMirror();
 // The shell reveal is earned by confronting its missing private memory.

}
function horrorPhotoViewed(id){
 S.horrorLastPhoto=id;
 if(!S.flags.found||S.flags.done)return;
 if(S.flags.horrorHollowSent){
  if(id==='hollow'&&S.flags.hollowReceived)horrorSequence('horrorHollowSeen',[
   {text:'这张背面，你以前没有拍过。'},
   {text:'爸，这张也留着。别删。'}
  ]);
  persist();return;
 }
 const old={before:'生日那张，你刚刚又打开了。',past_beach:'海边那张。你在看我怀里的东西。',past_breakfast:'你在看拿勺子的那只手。',past_drawing:'那张画画的照片，不要再放大了。',past_rabbit:'你在看我为什么把它的眼睛遮住。',past_sleep:'你在看我以前怎么闭上眼睛。'};
 if(!S.puzzle?.feedCut&&old[id]&&horrorSequence('horrorRead',[{text:old[id]},{text:'我在门外。可是你看哪一张，我都知道。'}])){
  S.horrorReadPhoto=id;
  const post=S.moments.find(m=>m.id==='birthday');
  if(id==='before'&&post&&!post.comments.some(c=>c.contentId==='horror-birthday-read'))post.comments.push({name:'小禾',text:'爸，你现在又在看这一张。',contentId:'horror-birthday-read'});
 }
 // Sleeping photograph has its own single breathing scene.

 if(id==='reflection')horrorSequence('horrorReflection',[
  {id:'wife',text:'她已经转过来看我了。镜子里为什么还是她的正脸？'},
  {text:'妈让你看镜子。你为什么只看着我。'}
 ]);
 if(id==='door')horrorSequence('horrorAtDoor',[
  {id:'wife',text:'你门口有人？'},
  {id:'wife',text:'可我正抓着她的手。她一次也没有离开过。'},
  {text:'别问妈妈。她看见的，是她要找的那个。'}
 ]);
 if(id==='threshold'&&typeof clueNpcAllowed==='function'&&clueNpcAllowed('old'))horrorSequence('horrorThresholdSeen',[
  {text:'你把手机拿低一点。'},
  {text:'对。就是照片拍下来的那个高度。'},
  {id:'old',text:'爸，别听它的。拍那张的时候，我站的就是那个地方。'}
 ]);
 persist();
}
function horrorConversation(id,text){
 if(!S.flags.found||S.flags.done)return false;
 if(S.flags.hollowReceived){
  const question=/脸|皮|壳|空|里面|照片|这张|撕|脱|面具|镜|倒影|反光|假的|不是|是谁|女儿|小禾|在哪|门|身边|害怕|出来|报警/.test(text);
  if(question&&id==='daughter'){
   horrorSequence('horrorHollowQuestion',[
    {text:'里面你看见了。没有别人。'},
    {text:'她没回来。你还要这张脸吗？'}
   ])||later('daughter','你先别回答。我还在等你。',{horrorEvent:'horrorHollowFollowup'});
   return true;
  }
  if(question&&id==='wife'){
   const hidden=S.flags.hollowWifeSheltered;
   later('wife',hidden?'我在卧室，门还锁着。餐桌那边没有脚步声，她却一直在叫我。':'我看见她在餐桌那边。那张脸里面是空的，她还在等我夸她。',{horrorEvent:'horrorHollowFollowup'});
   return true;
  }
 }
 if(S.flags.mirror&&['wife','daughter'].includes(id)&&/镜子|镜中|倒影|反光/.test(text)){
  replyMany(id=== 'wife'?'wife':'daughter',id==='wife'?['我没有连拍。就这一张。','我后来拿手挡住了她的脸，镜子里还是有一张脸。']:['那边慢一点。','你先认清哪边才是我。']);return true;
 }
 if(S.flags.door&&id==='wife'&&/门|两个|分身|身边/.test(text)){
  replyMany(id,['她就在我旁边。我握着她的手。','手很凉。她刚才问我，你是不是也有一个爸爸。']);return true;
 }
 return false;
}
function horrorMessageSent(id,type,extra){
 if(S.flags.done||!S.flags.hollowReceived||id!=='police'||type!=='image'||extra?.photo!=='hollow')return;
 horrorSequence('horrorHollowPolice',[
  {id:'police',text:'这张原图收到了，我已另存。别让她靠近你们，也不要当面再问她。'},
  {id:'police',text:'具体情况我到现场再看。你们先待在能锁门的房间里，我到之前别开门。'}
 ]);
}
function horrorDraft(text){
 if(S.puzzle?.feedCut||R.app!=='chat'||!S.flags.memory||S.flags.done||S.flags.horrorDraft||S.flags.horrorHollowSent)return;
 const draft=String(text||'').trim();
 if(draft.length<4||!/不是|假的|报警|开门|害怕|救命|是谁|别进|躲|不对/.test(draft))return;
 S.horrorUnsent=draft.slice(0,120);
 horrorSequence('horrorDraft',[
  {text:'“'+S.horrorUnsent+'”'},
  {text:'你按发送之前，我就看见了。'}
 ]);
}
document.addEventListener('input',e=>{if(e.target.id==='message-input')horrorDraft(e.target.value)});
syncHorrorContent();
