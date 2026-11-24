/* Photo content is merged into existing saves without resetting the investigation. */
function storyPhotoReceived(id){return Object.values(S.history||{}).some(messages=>messages.some(m=>!m.me&&m.type==='image'&&m.photo===id))}
function storyPhotoRetained(id){return storyPhotoReceived(id)||(S.photoSeen||[]).includes(id)||(S.photoFav||[]).includes(id)||(S.photoTrash||[]).includes(id)||(S.moments||[]).some(m=>m.person==='me'&&(m.photos||[]).includes(id))||Object.values(S.history||{}).some(messages=>messages.some(m=>m.me&&m.photo===id))}
function syncPhotoContent(){
 const x=window.PHOTO_EXPANSION;if(!x)return;
 if((S.photoContentVersion||0)<x.version){
  const ids=new Set(S.moments.map(m=>m.id));
  for(const m of x.posts||[])if(!ids.has(m.id)){S.moments.push(clone(m));ids.add(m.id)}
  for(const m of S.moments){const source=D.moments.find(d=>d.id===m.id);if(!source)continue;for(const k of ['photos','requires','sortAt'])if(source[k]!==undefined&&m[k]===undefined)m[k]=clone(source[k])}
  for(const [id,entries] of Object.entries(x.historyAdditions||{})){
   const current=S.history[id];if(!current)continue;
   const signature=m=>m.type==='image'?'photo:'+m.photo:m.date?'date:'+m.date:'text:'+m.text;
   const existing=new Set(current.map(signature));
   const fresh=entries.filter(m=>!existing.has(signature(m)));
   if(fresh.length)S.history[id]=[...clone(fresh),...current];
  }
  S.photoContentVersion=x.version;
 }
 window.MOMENT_CONTENT_REFRESH?.apply(S);
 if(S.flags.memory)S.flags.settled=true;
 const deliveredPhotos=['returned','door',...(x.afterReturnPhotos||[]),...(x.afterSettledPhotos||[]),...(x.afterMemoryPhotos||[]),'reflection','threshold'];
 if(S.storyPhotoDeliveryVersion!==1){
  // Keep photographs the player already opened, saved, shared or received; remove only untouched premature grants.
  S.photoSaved=S.photoSaved.filter(id=>!deliveredPhotos.includes(id)||storyPhotoRetained(id));
  S.storyPhotoDeliveryVersion=1;
 }
 const allowed=[...(x.initialPhotos||[]),...deliveredPhotos.filter(storyPhotoReceived)];
 for(const id of allowed)if(D.photos[id]&&!S.photoSaved.includes(id))S.photoSaved.push(id);
}
function revealEveningPhotos(){
 if(!S.flags.found||S.flags.done||S.flags.memory)return;
 once('settled',()=>{replyMany('wife',['她把兔子抱起来，姿势和生日那张照片一模一样。可她以前明明不喜欢它。',{type:'image',photo:'home_rabbit'},'你相册里还有生日那张吧？我想看看，是不是连手的位置都一样。']);});
}

function sendBedtimePhoto(){
 syncPhotoContent();
 if(!S.devices?.phoneRecovered)return;
 once('bedtimePhoto',()=>{
  later('wife','卧室关灯后过了一会儿，我去看她，门刚开一条缝，她就已经对着我在笑。',{},6800);
  later('wife','',{type:'image',photo:'home_sleep'},7700);
  later('wife','我记得她以前不留一盏灯就睡不着。今天我让她闭眼，她说：你不看着，我就不知道脸该放在哪里。',{},9000);
 });
}
function rememberPhotoView(id){
 S.photoSeen??=[];if(!S.photoSeen.includes(id))S.photoSeen.push(id);
 if(['returned','home_rabbit','before'].includes(id)&&S.flags.found){if(typeof clueRead==='function')clueRead('return-anomaly');}
 if(id==='home_dinner')revealEveningPhotos();
}
function photoPairCount(){const seen=new Set(S.photoSeen||[]);return [['before','returned'],['past_breakfast','home_dinner'],['past_drawing','home_drawing'],['past_rabbit','home_rabbit'],['past_sleep','home_sleep']].filter(pair=>pair.every(id=>seen.has(id))).length}
function photoConversation(id,text){
 if(!S.flags.found)return false;
 if(id==='daughter'&&/左手|右手|用手|换手|勺|吃饭|拿笔|画画|坐姿|动作|习惯|照片|模仿|学我|盯着|眼神|笑容|摆鞋/.test(text)&&photoPairCount()>=2){
  const lines=/左手|右手|勺/.test(text)?['你是说，该换一只手吗？','我知道了。照片里的那只手。','现在这样，和以前一样了吗？']:/画|笔|坐姿/.test(text)?['我照着以前的画重新画了。','你没有拍下来的地方，我不知道应该怎么做。','你可以再给我一张吗？']:['我照着你留下的照片做了。','哪里不像，你告诉我。','我可以再来一次。'];
  if(once('memory',()=>{S.calibration={kind:'photo',prompt:text,lines:lines.slice(0,2),at:'22:17'};replyMany('daughter',lines);later('daughter','别一直看以前的。看看门口。',{type:'image',photo:'door'},5000)}))return true;
  replyMany('daughter',['我已经改过了。','你为什么还留着那几张？']);return true;
 }
 if(id==='wife'){
  if(/左手|右手|筷|勺|饭|吃/.test(text)){once('returnDinnerAsked',()=>later('wife','',{type:'image',photo:'home_dinner'}));replyMany(id,['她自己说想吃，端过去又不动。非得等我说吃吧，她才拿勺子。','不光是哪只手。她盯着我的手，我拿起来她才拿。']);return true}
  if(/画|笔|坐姿|桌/.test(text)){once('returnDrawingAsked',()=>later('wife','',{type:'image',photo:'home_drawing'}));replyMany(id,['她把以前的画拿出来，连纸边那块擦脏的地方也画上了。','以前画画总趴在桌上，刘老师还说过她。']);return true}
  if(/鞋|玄关|整齐/.test(text)){replyMany(id,['鞋摆好后，她问我上次是不是也这样。','我说什么上次，她就不说话了。']);return true}
  if(/睡|床|灯/.test(text)&&S.flags.memory){if(S.devices?.phoneRecovered&&!S.flags.bedtimePhoto){sendBedtimePhoto();return true}replyMany(id,['床头灯是她自己关的。','我问她怎么还不躺下，她说你拍的照片里，看不见躺下之前要做什么。']);return true}
 }
 return false;
}
syncPhotoContent();
