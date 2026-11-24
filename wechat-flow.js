/* Friendship, delivery and witness verification belong to the phone conversation. */
function syncWechatFlow(){
 if(!S.wechat?.version){
  const legacy=Boolean(S.flags.registered||S.flags.found||(S.history.club||[]).some(m=>!m.date));
  S.wechat={version:1,friend:{status:legacy?'accepted':'none',seen:legacy,greeting:'林先生，您好。我是归家寻亲的许老师，负责您提交的寻亲登记。'},lead:{delivered:false,reviewed:Boolean(S.flags.leadReviewed),attempts:[]},unread:Object.fromEntries((S.unread||[]).map(id=>[id,1]))};
  // Old links represented this same private photograph. Keep their position in history.
  for(const m of S.history.club||[])if(m.type==='link'&&m.url===BASE+'/lead'){m.type='image';m.photo='lead';m.text='';delete m.url}
  for(const m of S.pending||[])if(m.id==='club'&&m.extra?.type==='link'&&m.extra.url===BASE+'/lead'){m.extra.type='image';m.extra.photo='lead';m.text='';delete m.extra.url}
  let due=Date.now()+4800;
  for(const m of (S.pending||[]).sort((a,b)=>a.due-b.due)){m.due=due;due+=wechatMessageGap(m)}
 }
 const w=S.wechat;w.unread??={};w.lead??={delivered:false,reviewed:false,attempts:[]};w.lead.attempts??=[];
 if((S.history.club||[]).some(m=>!m.me&&m.type==='image'&&m.photo==='lead')||S.flags.leadReviewed){w.lead.delivered=true;S.flags.leadReceived=true}
 if(S.flags.leadReviewed)w.lead.reviewed=true;
 wechatRepairLeadReview();
 S.unread=Object.keys(w.unread).filter(id=>w.unread[id]>0);
}
function wechatLeadAnswer(value){
 const text=String(value||'').normalize('NFKC').replace(/\s/g,'');
 const clauses=text.split(/[，,。.!！；;？?]/).filter(Boolean);
 if(/不确定|不能确定|拿不准|看不清|看不太清|认不出|不敢认|不好认|没法认|太糊|无法确认|不知道|不清楚|看不出来|可能|也许|不太像|是不是|像不像/.test(text))return 'unknown';
 // A verdict often omits the child's name in a direct reply to the photograph.
 if(clauses.some(s=>/^(?:(?:看着|看起来|瞧着|这|那)(?:就|真)?|肯定|明显|绝对)?不是[啊呀吧呢的]*$/.test(s)))return 'no';
 if(clauses.some(s=>/^(?:不是|不|否|不对)(?:啊|呀|的|吧)?$/.test(s))||/不是(?:她|小禾|(?:我(?:的)?)?(?:女儿|闺女|孩子)|同一个|我家|这个|这种|这件|那个|那种|那件)|不像|认错|排除|不对|不一样|不符|对不上|没对上|看错了|(?:衣服|外套|衣着|颜色).{0,6}(?:不同|不一致|有差别|有区别|错了|错的)/.test(text)||(typeof inquiryClothesConflict==='function'&&inquiryClothesConflict(text)))return 'no';
 if(/是她|是小禾|是我女儿|是我的女儿|就是|确定是|确认是|是的|没错/.test(text)||clauses.some(s=>/^是(?:啊|呀|的)?$/.test(s)))return 'yes';
 return null;
}
function wechatQueueLeadReview(answer,reason,recover=false){
 const l=S.wechat.lead;
 if(S.flags.leadReviewed||S.flags.found||S.pending.some(m=>m.id==='club'&&m.extra?.leadOutcome==='excluded'))return;
 l.last=answer;l.reason=reason;l.pending=true;
 if(!l.attempts.some(a=>a.text===reason))l.attempts.push({answer,text:reason,at:Date.now()});
 const lines=answer==='no'?['好，我请那边的志愿者再看看原照片，问清当时的情况。','您先别过去，等他回电话。']:answer==='yes'?['看着像也先别出发，我再联系在场的志愿者。','对方说孩子穿的是深色雨衣，和学校记的外套不一样，我让他再问那户家人。']:['这张是有些模糊，您别急着认。我问问在场的人。'];
 const result=answer==='yes'?'抱歉，已经联系上照片里孩子的家人。那张不是小禾，这次不能过去接。是我们没先问清楚，让您白高兴了。':'志愿者回电了。照片里的孩子已经由另一户家属接走，不是小禾。抱歉，让您又空等了一次。';
 const now=Date.now();let previous=S.pending.reduce((a,b)=>!a||b.due>a.due?b:a,null)||S.wechat.delivery?.last;
 // Commit the whole verification exchange together, including the progression event.
 const entries=[...(recover?[]:lines.map(text=>({text,extra:{}}))),{text:result,extra:{leadOutcome:'excluded',storyDay:22,storyClock:'18:09'}}];
 for(const entry of entries){const m={id:'club',...entry,due:Math.max(now+(entry.extra.leadOutcome?(recover?4800:18000):4800),previous?(previous.due||previous.at)+wechatMessageGap(previous,entry):0)};S.pending.push(m);previous=m;}
}
function wechatRepairLeadReview(){
 const l=S.wechat.lead;
 if(!S.flags.verified||!l.delivered||S.flags.leadReviewed||S.flags.found)return;
 if(l.pending){wechatQueueLeadReview(l.last||'unknown',l.reason||'家属请协助核对现场照片。',true);return;}
 if(l.reviewRecoveryVersion===4)return;
 l.reviewRecoveryVersion=4;
 const history=S.history.club||[],photoAt=history.findLastIndex(m=>!m.me&&m.type==='image'&&m.photo==='lead');
 const answer=history.slice(photoAt+1).filter(m=>m.me&&(!m.type||m.type==='text')).map(m=>({text:m.text,answer:wechatLeadAnswer(m.text)})).findLast(m=>m.answer);
 // Only a player's reply after the actual photo can repair an old stalled save.
 if(photoAt>=0&&answer)wechatQueueLeadReview(answer.answer,answer.text,true);
}
function wechatUnreadCount(id){return Math.max(0,Number(S.wechat?.unread?.[id])||0)}
function wechatUnreadTotal(){return Object.keys(S.wechat?.unread||{}).filter(id=>!S.muted.includes(id)).reduce((n,id)=>n+wechatUnreadCount(id),0)}
function wechatClearUnread(id){if(S.wechat)S.wechat.unread[id]=0;S.unread=S.unread.filter(x=>x!==id)}
function wechatRequestUnread(){const f=S.wechat?.friend;return f?.status==='pending'&&!f.seen?1:0}
function wechatIsFriend(id){return id!=='club'||S.wechat?.friend.status==='accepted'}
function wechatRequests(){const f=S.wechat?.friend;return f&&['pending','accepted'].includes(f.status)?[{id:'club',...f}]:[]}
function wechatReadRequests(){if(S.wechat?.friend.status==='pending')S.wechat.friend.seen=true}
function wechatMessageGap(m,next){
 if(!S.flags.found||S.flags.done)return Math.min(7000,Math.max(m.extra?.returnedEvent||String(m.contentId||m.extra?.contentId||'').startsWith('inquiry-friend-')?4800:3600,2800+String(m.text||'').length*65));
 const reading=m.extra?.type==='image'||m.type==='image'?15000:Math.min(19000,Math.max(10000,6500+String(m.text||'').length*120));
 return next&&next.id!==m.id?Math.max(22000,reading):reading;
}
function wechatDeliveryPacing(){
 const phase=S.flags.found&&!S.flags.done?'returned':'normal';
 const old=S.wechat.delivery;
 if(old?.version===1&&old.phase===phase)return old;
 const pacing=S.wechat.delivery={version:1,phase,last:old?.last||null};
 let previous=pacing.last,at=Date.now()+(phase==='returned'?10000:4800);
 for(const m of S.pending.sort((a,b)=>a.due-b.due)){
  if(previous)at=Math.max(at,(previous.due||previous.at)+wechatMessageGap(previous,m));
  m.due=Math.max(m.due,at);previous=m;
 }
 return pacing;
}
let wechatComposeAt=0;
document.addEventListener('input',e=>{if(e.target.id==='message-input')wechatComposeAt=Date.now()});
function wechatDraftPause(m){
 if(!S.flags.found||S.flags.done||m.extra?.npcResponse)return false;
 const composing=document.activeElement?.matches('#message-input')&&document.activeElement.value.trim()&&Date.now()-wechatComposeAt<6000;
 const replying=typeof npcJobs!=='undefined'&&[...npcJobs.values()].some(job=>job.state===S);
 if(!composing&&!replying)return false;
 m.draftHoldAt??=Date.now();
 if(Date.now()-m.draftHoldAt>=(replying?55000:30000))return false;
 // Shift the whole queue so pausing this line cannot let another sender cut in.
 for(const queued of S.pending)queued.due+=3000;
 return true;
}
function wechatRefresh(){if(['home','chats','contacts','newfriends','friendrequest','lock'].includes(R.app))render()}
function wechatRequest(){
 const f=S.wechat.friend;if(f.status!=='scheduled')return;
 f.status='pending';f.seen=false;f.receivedAt=Date.now();
 S.notifications.unshift({id:'club',text:'请求添加你为朋友',time:time(),friendRequest:true});S.notifications=S.notifications.slice(0,20);
 persist();wechatRefresh();clearTimeout(noticeTimer);
 $('#notification').innerHTML=`<button class="toast" data-a="friend-request" data-id="club">${av('club',false)}<span><strong>微信 · 新的朋友</strong><p>许老师请求添加你为朋友</p></span></button>`;
 noticeTimer=setTimeout(()=>$('#notification').innerHTML='',6000);
}
function wechatAccept(){
 if(!requirePhoneNetwork()||S.wechat.friend.status!=='pending')return;
 S.wechat.friend.status='accepted';S.wechat.friend.seen=true;S.flags.contacted=true;
 S.notifications=S.notifications.filter(n=>!n.friendRequest);
 dateChat('club');S.history.club.push({type:'system',text:'你已添加了许老师，现在可以开始聊天了。'});
 S.hiddenChats=S.hiddenChats.filter(id=>id!=='club');markChatActivity('club');
 replyMany('club',['林先生，您好。我是归家寻亲的许老师。刚收到您的申请，报案编号是 QH-0417，对吗？','资料看过了。想再问问孩子平时的习惯，志愿者见到她，也好跟她说上话。',{type:'link',url:BASE+'/interview',text:'归家寻亲 · 家庭访谈'}]);
 persist();chat('club');
}
function wechatAction(a,b){
 if(a==='new-friends'){go('newfriends');return true}
 if(a==='friend-request'){S.started=true;wechatReadRequests();go('friendrequest',{id:'club'});return true}
 if(a==='accept-friend'){wechatAccept();return true}
 return false;
}
function wechatDelivered(id,m){
 if(m.type!=='system'&&!m.me&&((typeof dpActive==='function'&&dpActive())||R.app!=='chat'||R.id!==id))S.wechat.unread[id]=wechatUnreadCount(id)+1;
 if(id==='club'&&m.type==='image'&&m.photo==='lead'){S.wechat.lead.delivered=true;S.flags.leadReceived=true}
 if(id==='club'&&m.leadOutcome==='excluded')reviewLead(S.wechat.lead.reason||'家属核对衣着不符。');
}
function wechatConversation(id,t){
 if(id!=='club'||S.flags.found)return false;
 if(!wechatIsFriend(id))return true;
 if(!S.flags.verified)return false;
 const l=S.wechat.lead;
 if(S.flags.leadReviewed)return false;
 if(!l.delivered){
  if(!l.waitingReplied){l.waitingReplied=true;replyMany(id,['照片还在传。您稍等，收到后先看看是不是她。'])}
  return true;
 }
 if(l.pending){if(!l.pendingReplied){l.pendingReplied=true;replyMany(id,['您补充的这几句我也记下了。志愿者还没回信，有消息我马上告诉您。'])}return true}
 const answer=wechatLeadAnswer(t);
 if(answer)wechatQueueLeadReview(answer,t);
 else if(/照片|衣服|衣着|颜色|孩子|闺女|小禾|看着|像/.test(t))replyMany(id,['您觉得不像小禾，还是照片太糊、认不准？跟我说一下，我再问问志愿者。']);
 else npcReply(id,t,['照片您再看看，拿不准也没关系。']);
 persist();schedule();return true;
}
function wechatWeb(u){
 if(!['www.guijia.example','guijia.example'].includes(u.hostname))return null;
 if(['/interview','/verify'].includes(u.pathname)&&S.flags.registered&&!wechatIsFriend('club'))return webHeader()+'<div class="web-pad"><h1>登记已受理</h1><p>服务专员将通过您预留的微信号联系您，核对登记信息后继续办理。</p>'+wlink('返回家属中心','/family','web-primary')+'</div>'+webFooter();
 return null;
}
syncWechatFlow();
D.photos.lead.requires='leadReceived';
