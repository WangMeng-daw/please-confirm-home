/* Authored history belongs to its story date, including when an older save is opened. */
function familyDateNumber(value){
 const iso=String(value||'').match(/^2026-(\d+)-(\d+)T(\d+):(\d+)/);
 const label=String(value||'').match(/(\d+)月(\d+)日\s*(\d+):(\d+)/);
 const m=iso||label;
 return m?(((+m[1]*31+ +m[2])*24+ +m[3])*60+ +m[4]):0;
}
function familyInsert(id,block){
 const messages=S.history[id];if(!messages)return;
 const ids=new Set(messages.map(m=>m.contentId).filter(Boolean));
 const fresh=block.messages.filter(m=>!ids.has(m.contentId));if(!fresh.length)return;
 const date=block.at.match(/^2026-(\d+)-(\d+)T(\d+:\d+)/);
 const label=`${+date[1]}月${+date[2]}日 ${date[3]}`;
 const at=messages.findIndex(m=>m.date&&familyDateNumber(m.date)>familyDateNumber(block.at));
 messages.splice(at<0?messages.length:at,0,{date:label,contentId:fresh[0].contentId+'-date'},...clone(fresh));
}
function familyStageBlock(key,at,texts){return {at,messages:texts.map((m,i)=>({...(typeof m==='string'?{text:m}:m),contentId:`family-v1-stage-${key}-${i+1}`}))}}
function syncFamilyStory(){
 const content=window.FAMILY_HISTORY;if(!content)return;
 S.familyStory??={version:0,stages:{}};S.familyStory.stages??={};
 if(S.familyStory.version<content.version){
  for(const [id,blocks] of Object.entries(content.threads))for(const block of blocks)familyInsert(id,block);
  // Only replace exact authored incoming lines. Player messages and free-form notes stay intact.
  const repairs={
   '你指出的 HX-0813-04 后面挂着一笔外协移交。西郊救助站正在核对这笔移交的接收记录。':'你指出的 HX-0813-04 后面挂着一笔外协移交。西郊救助站正在核对历史材料，不能据此确定孩子现在的位置。',
   '有一条无姓名的接收记录，正在补照片。今晚先休息一下，有消息会联系你。':'站方说近日刚接收过一个说不出身份的女孩，正在另行调取照片。有消息会联系你。',
   '西郊救助站按 HX-0813-04 的移交编号找到了留站记录，照片也到了。与小禾的登记照片高度相似，已转交办案人员核验。':'西郊救助站把历史移交和近日收留的记录分别发来了。近日收留的女孩与小禾的照片高度相似，已转交办案人员核验。孩子不是一直住在西郊，之前的去向还在查。',
   '接领人信息已核对。我已经跟李岚一起到救助站了。':'接领手续已经核对。我陪李岚办的接领，20:36完成交接。',
   '20:36 交接完成。李岚带她回家，你直接回家就好。':'李岚先带她回了家。你在所里补交的材料我也收到了。',
   '西郊救助站的记录核对上了。照片相似，身份材料也已核验。':'西郊救助站刚接收的孩子，体貌和登记照片初步相符。亲缘身份和这段时间的去向还要继续核实。',
   '我们到家了。她一路都没有说话。':'刚才在车上，她一路都没有说话。现在坐在床边，也不肯换衣服。',
   '卧室灯关了快二十分钟。我去看她，门刚开一条缝，她就已经对着我在笑。':'卧室关灯后过了一会儿，我去看她，门刚开一条缝，她就已经对着我在笑。'
  };
  for(const messages of Object.values(S.history))for(const m of messages)if(!m.me&&repairs[m.text])m.text=repairs[m.text];
  for(const m of [...S.pending,...S.notifications])if(!m.me&&repairs[m.text])m.text=repairs[m.text];
  S.familyStory.version=content.version;
 }
 const me=text=>({me:true,text});
 const stages=[
  ['registered',S.flags.registered,'2026-09-19T09:12:00+08:00',[
   me('交上去了，还是报案时那个编号。有消息我会发给周警官。'),
   '我去过的地方都记在纸上了，晚上你也拍一份。别再重复跑。'
  ]],
  ['interviewed',S.flags.interviewed,'2026-09-20T16:18:00+08:00',[
   me('他们问她平常怎么说话、喜欢什么。我填完了，也附了生日照片。'),
   '有几件事我怕记错，就翻了以前的聊天。'
  ]],
  ['leadReviewed',S.flags.leadReviewed,'2026-09-22T18:09:00+08:00',[
   me('确认不是她。那天她没穿照片里那件外套。'),
   '知道了。不是就继续找，你别一个人瞒着我。'
  ]],
  ['routeVerified',S.inquiry?.routeVerified,'2026-09-22T18:09:00+08:00',[
   me('老赵说的帖子有人回了。时间也对得上，我把找到的都发过去了。'),
   '那天我也走过那条路。你把原帖留好，别只截一张图。'
  ]],
  ['followup',S.flags.followup,'2026-09-23T14:08:00+08:00',[
   me('接收编号后面还有一笔移交，他们在联系西郊。还不能确定她现在在哪。'),
   '好。你有进展就告诉我，我不关手机。'
  ]],
  ['matched',S.flags.matched,'2026-09-24T18:54:00+08:00',[
   '我看到那张新照片了。是她吗？',
   me('长得很像。先让周警官核对，别急着发给大家。')
  ]],
  ['identityRequested',S.flags.identityRequested,'2026-09-24T19:42:00+08:00',[
   '周警官陪我过去，我带着证件。你那边还没好？',
   me('我在所里补前几次走访的材料。接领信息我再发他一遍，你先去。'),
   '好，看见她我就告诉你。'
  ]],
  ['foundHome',S.flags.found,'2026-09-24T20:58:00+08:00',[
   '我们进门了。站里把随身物品也交给我了，那只鲸鱼在袋子里。',
   me('材料交完了，我往回走。你先陪着她。')
  ]],
  ['foundStudy',S.flags.found,'2026-09-24T21:40:00+08:00',[
   me('我到家了。她刚才一直看着我，叫她也不应。'),
   '我知道她跟以前不一样。先当她是吓坏了，别围着问。',
   me('我去书房，把这几天查到的整理好发给周警官。'),
   '有事微信说吧，别隔着房间喊。她一听我们说话就转过头。'
  ]],
  ['settled',S.flags.settled,'2026-09-24T22:11:00+08:00',[
   '我看见了，我也怕。刚才还在想，是不是太久没回家了。',
   '你先看看我发的照片。我就在旁边陪着她。'
  ]]
 ];
 const now=familyDateNumber(typeof phoneTimestamp==='function'?phoneTimestamp():`2026-09-${String(S.day).padStart(2,'0')}T${S.storyClock||'00:00'}`);
 for(const [key,earned,at,messages] of stages)if(earned&&familyDateNumber(at)<=now&&!S.familyStory.stages[key]){
  familyInsert('wife',familyStageBlock(key,at,messages));S.familyStory.stages[key]=true;
 }
}
function familyConversation(id,text){
 if(id!=='wife'||S.flags.done)return false;
 if(/报警|报案|那天|丢了|走丢|失踪|没接到|接晚|怪我|都怪/.test(text)){
  replyMany(id,[S.flags.found?'那条路我们来回找了多少遍，六点多就报了警。她现在回来了，我还是老想起那天。':'我以为你接到了，你还问她是不是跟我在一起。那条路我们来回找了几遍，六点多就报了警。','别再说对不起了，我听着也难受。']);return true;
 }
 if(/手机|封存/.test(text)&&!S.flags.found){replyMany(id,['手机不是在学校门口附近捡到的吗，你认的壳子。后来就留在周警官那里了。','你想给她发就发吧。']);return true}
 if(!S.flags.found){
  const line=S.flags.matched?'我已经把证件拿出来了。等周警官核对完再出门。':S.flags.followup?'西郊那边还在核对记录，我也在等。':S.flags.leadReviewed?'不是北站那个，就再找。老赵那边也在问。':S.flags.verified?'照片我看了，先跟那天的衣服对一对。':S.flags.interviewed?'已经填完交了。那天的事记不清，你就翻翻跟刘老师的聊天。':S.flags.registered?'登记的消息我收到了。有新线索也发给周警官，别自己过去。':null;
  if(line){npcReply(id,text,[line]);return true}
 }
 return false;
}
