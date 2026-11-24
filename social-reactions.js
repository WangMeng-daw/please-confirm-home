/* Public social responses have their own inbox and never use private chat context. */
let socialReactionState=null,socialReactionTimer=null;
const socialReactionRequests=new Map();
const SOCIAL_REACTION_GAP=4800;

function socialReactionStore(){
  if(!S.socialReactions||typeof S.socialReactions!=='object'||Array.isArray(S.socialReactions))S.socialReactions={version:1,seenPosts:{},seenComments:{},jobs:[],activity:[],counter:0};
  const q=S.socialReactions;
  q.seenPosts??={};q.seenComments??={};q.jobs??=[];q.activity??=[];q.counter??=0;
  return q;
}
function socialReactionPosts(surface){return surface==='douyin'?(typeof dyPosts==='function'?dyPosts():[]):(S.moments||[]).filter(p=>typeof momentVisible!=='function'||momentVisible(p))}
function socialReactionPost(surface,id){return socialReactionPosts(surface).find(p=>p.id===id)}
function socialReactionComments(surface,p){return surface==='douyin'?dyComments(p).flatMap(c=>[c,...dyReplies(p,c).map(r=>({...r,parent:c.id}))]):(p.comments||[]).filter(c=>!c.createdAt||Date.parse(c.createdAt)<=Date.parse(phoneTimestamp()))}
function socialReactionOwner(surface,p){return surface==='douyin'?p.creator:p.person}
function socialReactionName(surface,id){return id==='me'?S.profile.name:surface==='douyin'?dyCreator(id).name:D.people[id]?.name||'朋友'}
function socialReactionActor(surface,c){return surface==='douyin'?c.creator:c.person||Object.keys(D.people).find(id=>D.people[id].name===c.name||pname(id)===c.name)}
function socialReactionHash(text){let n=0;for(const c of String(text))n=(Math.imul(n,31)+c.charCodeAt(0))>>>0;return n}
function socialReactionAllowed(surface,id){
  if(!id||id==='me'||['awen','old','daughter','guardian','mother'].includes(id))return false;
  return surface==='douyin'?Boolean(DOUYIN_CREATORS[id]):Boolean(D.people[id]&&!D.people[id].hiddenGod&&(typeof wechatIsFriend!=='function'||wechatIsFriend(id)));
}
function socialReactionNpc(surface,id){return surface==='moments'?id:DOUYIN_CREATORS[id]?.npc||{street:'street',zhao:'friend',agency:'guijia',lamp:'lamphouse',city:'localrecords'}[id]}
function socialReactionAudience(surface,p){
 const circle=typeof socialCircleKnown==='function'?Object.keys(D.people).filter(socialCircleKnown):[];
 const base=surface==='moments'?['wife','friend','teacher',...circle]:['zhao',...circle.filter(id=>S.douyin?.following.includes(id))];
 const eligible=base.filter(id=>socialReactionAllowed(surface,id));
 if(!eligible.length)return [];
 const start=socialReactionHash(p.id)%eligible.length;
 const selected=Array.from({length:Math.min(3,eligible.length)},(_,i)=>eligible[(start+i)%eligible.length]);
 // Public reach remains possible; it does not manufacture a friendship.
 if(surface==='douyin'&&socialReactionHash(p.id)%4===0)selected[2]='city';
 return selected;
}
function socialReactionValid(job){
  const p=socialReactionPost(job.surface,job.postId);
  if(!p||p.privacy==='私密'||job.ending!==(S.flags.done||'')||!socialReactionAllowed(job.surface,job.actor))return false;
  if(job.postText!==String(p.text||''))return false;
  return !job.targetId||socialReactionComments(job.surface,p).some(c=>c.id===job.targetId&&socialReactionActor(job.surface,c)==='me');
}
function socialReactionCancel(){clearTimeout(socialReactionTimer);socialReactionTimer=null;for(const r of socialReactionRequests.values())r.controller.abort();socialReactionRequests.clear()}

function syncSocialReactions(){
  const q=socialReactionStore(),now=Date.now();
  if(socialReactionState!==S){socialReactionCancel();socialReactionState=S;q.resumeAt=now+SOCIAL_REACTION_GAP;for(const job of q.jobs)if(job.status==='requesting')job.status='waiting'}
  const first=!q.initialized;
  for(const surface of ['moments','douyin'])for(const p of socialReactionPosts(surface)){
    const key=surface+':'+p.id,owner=socialReactionOwner(surface,p),comments=socialReactionComments(surface,p);
    if(!q.seenPosts[key]){
      q.seenPosts[key]=true;
      if(!first&&owner==='me'&&p.privacy!=='私密'){
        const actors=socialReactionAudience(surface,p);
        const offset=socialReactionHash(p.id)%3;
        actors.slice(0,2+(offset===0?1:0)).forEach((actor,i)=>socialReactionQueue(surface,p,actor,'like',null,6500+i*5500));
        actors.slice(0,2).forEach((actor,i)=>socialReactionQueue(surface,p,actor,'comment',null,12500+i*10500));
      }
    }
    for(const c of comments){
      if(!c.id)c.id='src'+(++q.counter);
      const ck=key+':'+c.id;
      if(q.seenComments[ck])continue;
      q.seenComments[ck]=true;
      if(first||socialReactionActor(surface,c)!=='me'||p.privacy==='私密')continue;
      const parent=comments.find(x=>x.id===c.parent);
      let actor=surface==='douyin'?(c.replyCreator||parent?.creator||owner):(c.replyPerson||owner);
      if(surface==='moments'&&actor==='me'){
        const addressed=/^回复\s*([^：:]+)[：:]/.exec(c.text||'')?.[1];
        const candidate=addressed?comments.find(x=>socialReactionName(surface,socialReactionActor(surface,x))===addressed):[...comments].reverse().find(x=>socialReactionActor(surface,x)!=='me');
        actor=candidate&&socialReactionActor(surface,candidate);
      }
      if(socialReactionAllowed(surface,actor))socialReactionQueue(surface,p,actor,'comment',c,6500);
    }
  }
  q.initialized=true;
  q.jobs=q.jobs.filter(job=>socialReactionValid(job));
  for(const [id,r] of socialReactionRequests)if(r.state!==S||!q.jobs.some(j=>j.id===id)){r.controller.abort();socialReactionRequests.delete(id)}
  if(typeof phoneOnline==='function'&&!phoneOnline()){
    q.offline=true;clearTimeout(socialReactionTimer);socialReactionTimer=null;
    for(const [id,r] of socialReactionRequests){r.controller.abort();const j=q.jobs.find(j=>j.id===id);if(j)j.status='waiting'}
    socialReactionRequests.clear();return;
  }
  if(q.offline){q.offline=false;q.resumeAt=now+SOCIAL_REACTION_GAP}
  if(R.app==='douyin'&&R.view==='activities')q.activity.forEach(a=>{if(a.surface==='douyin')a.read=true});
  if(S.douyin)S.douyin.unread.socialReactions=socialReactionUnread('douyin');
  if(!socialReactionTimer&&!socialReactionRequests.size&&q.jobs.length){const next=Math.min(...q.jobs.map(j=>j.due));socialReactionTimer=setTimeout(socialReactionDrain,Math.max(0,next-now,(q.resumeAt||0)-now))}
}

function socialReactionQueue(surface,p,actor,kind,target,delay){
  const q=socialReactionStore(),id='srj'+(++q.counter);
  q.jobs.push({id,surface,postId:p.id,postText:String(p.text||''),actor,kind,targetId:target?.id||'',rootId:target?.parent||target?.id||'',ending:S.flags.done||'',status:'waiting',due:Date.now()+delay});
}

function socialReactionPacket(job,p){
  const comments=socialReactionComments(job.surface,p),target=comments.find(c=>c.id===job.targetId);
  const visible=job.surface==='douyin'&&target?.parent?comments.filter(c=>c.id===target.parent||c.parent===target.parent):comments;
  const facts=[`场景：${job.surface==='douyin'?'抖音公开图文评论区':'微信朋友圈公开评论区'}。本次是${target?'回复玩家留下的公开评论':'给玩家新发的动态留一条自然评论'}。`,
    `你的当前公开账号：${socialReactionName(job.surface,job.actor)}。${job.surface==='douyin'?dyCreator(job.actor).bio:'身份以现有微信联系人为准。'}`,
    job.surface==='douyin'&&!dyKnownFriend(job.actor)?'关系：你是刷到公开内容的抖音用户，与作者没有现实熟人关系。关注或互动不等于朋友。只能回应这条公开内容，不得编造相识、共同出游、亲历、保存对方照片等过去经历。':'关系：仅使用该角色已经确定的身份；朋友身份不能证明亲历当前动态。',
    ...((typeof socialCircleKnown==='function'&&socialCircleKnown(job.actor))?socialCircleFacts(job.actor).slice(0,1):[]),
    `动态作者：${socialReactionName(job.surface,socialReactionOwner(job.surface,p))}。公开时间：${p.label||p.date||''}。`,
    `动态包含${Array.isArray(p.photos)?p.photos.length:(p.photo||p.art?1:0)}张图片。未提供图片像素，不可编造图中细节、人物动作、衣着或场所。`];
  const body=String(p.text||'').slice(0,1500);for(let i=0;i<body.length;i+=270)facts.push('动态正文：'+body.slice(i,i+270));
  for(const c of visible.slice(-7))facts.push('已发表的公开评论：'+socialReactionName(job.surface,socialReactionActor(job.surface,c))+'：'+String(c.text||'').slice(0,230));
  const history=visible.filter(c=>['me',job.actor].includes(socialReactionActor(job.surface,c))).slice(-12).map(c=>({role:socialReactionActor(job.surface,c)==='me'?'user':'assistant',content:String(c.text||'').slice(0,600)}));
  return {npc:socialReactionNpc(job.surface,job.actor),lastUser:String(target?.text||p.text||'发布了一张照片。').slice(0,800),history,context:{surface:job.surface==='douyin'?'public-comment':'public-moment',stage:'missing',facts,seen:[],ending:'',oldUnlocked:false,godsUnlocked:false,adminUnlocked:false,wifeSheltered:false,lampCount:0}};
}

function socialReactionFallback(job,p){
  const c=socialReactionComments(job.surface,p).find(c=>c.id===job.targetId),text=String(c?.text||p.text||'');
  if(/撑不住|难受|绝望|想哭|活不下去|不想活|崩溃|太累|好累|熬不住|失望/.test(text))return job.actor==='wife'?'我在，有话跟我说。别硬撑着。':'真不容易，先歇一会儿吧。';
  if(/谢谢|多谢|辛苦/.test(text))return '不客气。';
  if(/晚安|睡了|休息/.test(text))return '好好休息，晚安。';
  if(/寻人|失联|走失|找.{0,5}(孩子|女儿|家人)/.test(text))return '希望人能早点平安回来。';
  if(/面|吃饭|晚饭|午饭|早餐|做饭/.test(text))return '再忙也得吃饭呀。';
  if(job.targetId&&/[?？]|怎么|为什么|能不能|是不是/.test(text))return '这事我也不太清楚。';
  return job.targetId?'嗯，看到了。':'看到了。';
}
function socialReactionUnfoundedFamiliarity(job,text){return job.surface==='douyin'&&!dyKnownFriend(job.actor)&&/(老朋友|老同学|我记得你|你还记得|咱俩|咱们(?:上次|那次|以前)|(?:上次|那次|以前)我们(?:一起|去过)|(?:还记得|记得)(?:那天|那次).*(?:一起|咱)|我(?:也)?(?:还)?(?:留着|存着|保存了).*(?:照片|那张|这张))/.test(text)}

async function socialReactionDrain(){
  socialReactionTimer=null;const q=socialReactionStore();
  if(typeof phoneOnline==='function'&&!phoneOnline()){syncSocialReactions();return}
  q.jobs=q.jobs.filter(socialReactionValid);
  const job=q.jobs.sort((a,b)=>a.due-b.due)[0];if(!job)return;
  if(Math.max(job.due,q.resumeAt||0)>Date.now()){syncSocialReactions();return}
  const p=socialReactionPost(job.surface,job.postId);
  if(job.kind==='like'||job.status==='ready'){socialReactionDeliver(job,p);return}
  const req={state:S,controller:new AbortController()};socialReactionRequests.set(job.id,req);job.status='requesting';
  let text='',silent=false;const timeout=setTimeout(()=>req.controller.abort(),NPC_REQUEST_TIMEOUT_MS);
  try{
    const response=await npcFetch(socialReactionPacket(job,p),req.controller.signal);
    if(!response.ok)throw Error('unavailable');
    const result=await response.json();silent=Boolean(result.ok&&result.mode==='silence');
    if(result.ok&&Array.isArray(result.messages))text=result.messages.find(x=>typeof x==='string'&&x.trim())?.trim().slice(0,240)||'';
  }catch{}finally{clearTimeout(timeout)}
  if(socialReactionRequests.get(job.id)!==req||S!==req.state)return;
  if(!socialReactionValid(job)){socialReactionRequests.delete(job.id);q.jobs=q.jobs.filter(j=>j.id!==job.id);persist();syncSocialReactions();return}
  socialReactionRequests.delete(job.id);
  if(typeof phoneOnline==='function'&&!phoneOnline()){job.status='waiting';syncSocialReactions();return}
  if(silent)q.jobs=q.jobs.filter(j=>j.id!==job.id);
  else if(text&&!/\b(?:gpt(?:[-\s]?\d)?|openai|chatgpt|codex|claude|gemini|deepseek|qwen|grok)\b/i.test(text)&&!socialReactionUnfoundedFamiliarity(job,text)){job.text=text;job.status='ready';job.due=Math.max(Date.now()+SOCIAL_REACTION_GAP,q.resumeAt||0)}
  else q.jobs=q.jobs.filter(j=>j.id!==job.id); // A failed request must not invent a public reply. A new comment starts a new request.
  persist();syncSocialReactions();
}

function socialReactionDeliver(job,p){
  const q=socialReactionStore();if(!socialReactionValid(job))return;
  if(job.kind==='comment'&&(!job.text?.trim()||socialReactionUnfoundedFamiliarity(job,job.text))){q.jobs=q.jobs.filter(j=>j.id!==job.id);persist();syncSocialReactions();return}
  const name=socialReactionName(job.surface,job.actor),id='sra'+(++q.counter),label=typeof phoneStamp==='function'?phoneStamp():`9月${S.day}日 ${time()}`;
  if(job.kind==='like'){
    p.socialLikes??=[];
    if(p.socialLikes.includes(job.actor)){q.jobs=q.jobs.filter(j=>j.id!==job.id);syncSocialReactions();return}
    p.socialLikes.push(job.actor);
    if(job.surface==='douyin')p.likes=(Number(p.likes)||0)+1;
    else if(!p.likes.includes(name))p.likes.push(name);
  }else if(job.surface==='douyin'){
    S.douyin.comments[p.id]??=[];
    S.douyin.comments[p.id].push({id:'social-'+id,creator:job.actor,text:job.text,date:label,createdAt:phoneTimestamp(),likes:0,parent:job.rootId||null,replies:[],socialReaction:true,replyCreator:job.targetId?'me':null});
  }else p.comments.push({id:'social-'+id,name,person:job.actor,text:job.text,date:label,createdAt:phoneTimestamp(),replyPerson:job.targetId?'me':null,socialReaction:true});
  const message=job.kind==='like'?'赞了你的动态':job.targetId?'回复了你的评论：'+job.text:'评论了你的动态：'+job.text;
  const activity={id,surface:job.surface,postId:p.id,actor:job.actor,kind:job.kind,text:message,label,read:false,commentId:job.kind==='comment'?'social-'+id:''};
  q.activity.unshift(activity);q.activity=q.activity.slice(0,100);q.jobs=q.jobs.filter(j=>j.id!==job.id);q.resumeAt=Date.now()+SOCIAL_REACTION_GAP;
  if(job.surface==='douyin'){S.douyin.activities.unshift({text:name+' '+message,label,post:p.id,creator:job.actor,received:true,socialReaction:id});S.douyin.activities=S.douyin.activities.slice(0,100)}
  persist();socialReactionNotify(activity);
  const active=document.activeElement;
  if(!active?.matches('input,textarea,[contenteditable="true"]')&&['douyin','moments','discover','home'].includes(R.app)){
    const scroll=document.querySelector('.dy-scroll,.moments-feed')?.scrollTop;render();const el=document.querySelector('.dy-scroll,.moments-feed');if(el&&scroll!=null)el.scrollTop=scroll;
  }else socialReactionsUI();
  syncSocialReactions();
}

function socialReactionMomentActivity(a){
  if(!a||a.surface!=='moments'||!a.actor||a.actor==='me'||!D.people[a.actor])return false;
  const p=socialReactionPost('moments',a.postId);
  if(!p||p.person!=='me'||p.privacy==='私密'||p.local||p.draft||p.pending)return false;
  if(a.kind==='like')return (p.likes||[]).some(name=>name===D.people[a.actor].name||name===pname(a.actor));
  if(a.kind!=='comment'||!a.commentId)return false;
  return socialReactionComments('moments',p).some(c=>c.id===a.commentId&&socialReactionActor('moments',c)===a.actor&&!c.local&&!c.draft&&!c.pending&&typeof c.text==='string'&&c.text.trim());
}
function socialReactionActivities(surface){
  return(S.socialReactions?.activity||[]).filter(a=>a&&(!surface||a.surface===surface)&&(a.surface!=='moments'||socialReactionMomentActivity(a)));
}
function socialReactionPruneMoments(){
  const q=S.socialReactions;if(!Array.isArray(q?.activity))return;
  // Old empty events and withdrawn interactions must not become new messages again.
  const rows=q.activity.filter(a=>a&&(a.surface!=='moments'||socialReactionMomentActivity(a)));
  if(rows.length!==q.activity.length){q.activity=rows;persist()}
}
function socialReactionUnread(surface){return socialReactionActivities(surface).filter(a=>!a.read).length}
function socialReactionAvatar(surface,actor){return surface==='douyin'?dyAvatar(actor):av(actor,false)}
function socialReactionNotify(a){
  if(a.surface==='moments'&&!socialReactionMomentActivity(a))return;
  const target=document.querySelector('#notification');if(!target)return;
  clearTimeout(noticeTimer);
  target.innerHTML=`<button class="toast social-reaction-toast" data-a="srx-open" data-id="${E(a.id)}">${socialReactionAvatar(a.surface,a.actor)}<span><strong>${a.surface==='douyin'?'抖音':'朋友圈'} · ${E(socialReactionName(a.surface,a.actor))}</strong><p>${E(a.text).slice(0,95)}</p></span></button>`;
  noticeTimer=setTimeout(()=>{if(target.querySelector('.social-reaction-toast'))target.innerHTML=''},5000);
}
function socialReactionActivity(surface){
  if(surface==='moments'&&typeof dpActive==='function'&&dpActive())return;
  const rows=socialReactionActivities(surface);if(surface==='moments'&&!rows.length)return;
  rows.forEach(a=>{a.read=true});persist();
  sheet(surface==='douyin'?'抖音互动消息':'朋友圈消息',rows.map(a=>`<button class="social-reaction-row" data-a="srx-open" data-id="${E(a.id)}">${socialReactionAvatar(surface,a.actor)}<span><strong>${E(socialReactionName(surface,a.actor))}</strong><p>${E(a.text)}</p><small>${E(a.label)}</small></span></button>`).join('')||'<p class="native-empty">暂无互动消息</p>');socialReactionsUI();
}
function socialReactionAction(a,b){
  if(a==='srx-activities'){socialReactionActivity(b.dataset.surface||'moments');return true}
  if(a!=='srx-open')return false;
  const row=socialReactionActivities().find(x=>x.id===b.dataset.id);if(!row)return true;
  if(row.surface==='moments'&&typeof dpActive==='function'&&dpActive())return true;
  row.read=true;closeOverlay();const p=socialReactionPost(row.surface,row.postId);
  if(!p){dialog('动态已删除','这条动态已经不在了。');return true}
  if(row.surface==='douyin'){
    const c=socialReactionComments('douyin',p).find(c=>c.id===row.commentId);
    dyGo('comments',{post:p.id,expanded:c?.parent?[c.parent]:[]});
  }else{go('moments');requestAnimationFrame(()=>document.querySelector(`[data-moment-id="${CSS.escape(p.id)}"]`)?.scrollIntoView({block:'center'}))}
  persist();return true;
}

function socialReactionsUI(){
  // Xiaohe's recovered timeline has no live inbox; never project the father's notifications onto it.
  if(typeof dpActive==='function'&&dpActive()){
    document.querySelectorAll('#screen .social-reaction-banner,#screen .social-reaction-badge').forEach(e=>e.remove());return;
  }
  socialReactionPruneMoments();
  const unread=socialReactionUnread('moments');
  const feed=document.querySelector('#screen .moments-feed:not(.dp-moments-feed)');
  if(R.app==='moments'&&(!R.person||R.person==='me')&&feed&&unread){
    let banner=feed.querySelector('.social-reaction-banner');
    if(!banner){banner=document.createElement('button');banner.className='social-reaction-banner';banner.dataset.a='srx-activities';banner.dataset.surface='moments';feed.querySelector('.moments-sign')?.after(banner)}
    banner.textContent=`${unread} 条新的互动消息`;banner.classList.add('has-unread');
  }else{
    document.querySelectorAll('#screen .social-reaction-banner').forEach(e=>e.remove());
  }
  for(const button of document.querySelectorAll('[data-a="moments"],[data-a="my-moments"],[data-a="dy-activities"]')){
    const count=socialReactionUnread(button.dataset.a==='dy-activities'?'douyin':'moments');let badge=button.querySelector('.social-reaction-badge');
    if(count&&!badge){badge=document.createElement('b');badge.className='social-reaction-badge';button.append(badge)}
    if(badge){badge.textContent=String(Math.min(99,count));badge.hidden=!count}
  }
}
window.addEventListener('pagehide',socialReactionCancel);
syncSocialReactions();
