/* Local, optional story mail. The normal Douyin outbox owns delivery and saving. */
Object.assign(DOUYIN_CREATORS, {
  wangfamily: {name:'王女士 · 等爸爸回家',handle:'wangjia_dengni',npc:'wangfamily',photo:'dy-laundry',cover:'dy-laundry',bio:'王建国的女儿。爸爸的寻人登记还留着。',followers:28},
  zhaofamily: {name:'明明妈妈',handle:'mingming_mama',npc:'zhaofamily',photo:'dy-cat',cover:'dy-laundry',bio:'赵明明的妈妈。谢谢每一个帮忙转发的人。',followers:43}
});

const DY_STORY_CASES = {
  'QH-0361': {post:'city-notice-wang',name:'王建国'},
  'QH-0386': {post:'city-notice-zhao',name:'赵明明'},
  'QH-0347': {post:'street-notice-sun',name:'孙海生'},
  'QH-0392': {post:'agency-notice-liu',name:'刘若宁'},
  'QH-0374': {post:'street-notice-he',name:'何小安'},
  'QH-0358': {post:'city-notice-zhou',name:'周淑琴'}
};
const dyStoryText = (id,text) => ({id,message:{type:'text',text}});
const dyStoryPost = (id,post,text) => ({id,message:{type:'post',post,text}});
const dyStoryUrl = (id,caseId,text) => ({id,message:{type:'url',url:'https://www.guijia.example/record?id='+caseId,text}});
function dyStoryPublicSearch(d){return d.posts.some(p=>p.creator==='me'&&/寻人|寻找|走失|失联|小禾|找.{0,5}(孩子|女儿|家人)/.test(p.text||''))}
function dyStoryTouched(d,post){return d.likes.includes(post)||(d.comments[post]||[]).some(c=>c.creator==='me')}
function dyStoryContact(d,id){
 if(dyKnownFriend(id)||d.contacts[id]||(d.messages[id]||[]).some(m=>m.me))return true;
 if(d.followActions[id]===true||d.engagements[id])return true;
 const posts=DOUYIN_POSTS.filter(p=>p.creator===id).map(p=>p.id);
 if(id==='wangfamily')posts.push('city-notice-wang');if(id==='zhaofamily')posts.push('city-notice-zhao');
 return posts.some(post=>dyStoryTouched(d,post));
}
function dyStoryIntroduced(d,id){return dyStoryContact(d,id)||(d.messages[id]||[]).some(m=>!m.me&&m.storyEvent&&m.storyEvent!=='seed')}
function dyStoryMigrateIdentity(d){
 if(d.story.identityVersion===1)return;
 const oldSeeds=['林砚，店里忙时不一定看得到消息。你先留在这里，我空下来就回。','照片和时间都按原帖留着，不会只剩一张转来转去的图。'];
 const posted=dyStoryPublicSearch(d);
 for(const id of ['street','wangfamily','zhaofamily']){
  const contact=dyStoryContact(d,id),list=d.messages[id]||[],allowed=contact||posted;
  const remove=m=>!m.me&&!m.npcAI&&!m.npcResponse&&((id==='street'&&m.storyEvent==='seed'&&oldSeeds.includes(m.text))||(!allowed&&['wang-intro','zhao-intro','neighbors','inner','ending'].includes(m.storyEvent)));
  const removed=list.filter(remove);if(removed.length){const unread=Number(d.unread[id]||0),unreadRemoved=unread?list.filter(m=>!m.me&&m.storyEvent!=='seed').slice(-unread).filter(remove).length:0;d.messages[id]=list.filter(m=>!remove(m));d.unread[id]=d.messages[id].length?Math.max(0,unread-unreadRemoved):0}
  if(!allowed)d.outbox=d.outbox.filter(j=>j.id!==id||!j.story);
 }
 for(const [event,id] of [['wang-intro','wangfamily'],['zhao-intro','zhaofamily']])if(!(d.messages[id]||[]).some(m=>m.storyEvent===event)&&!d.outbox.some(j=>j.id===id&&j.event===event))delete d.story.events[event];
 for(const id of ['street','zhao'])if((d.messages[id]||[]).some(m=>m.storyEvent==='neighbors')||d.outbox.some(j=>j.id===id&&j.event==='neighbors'))d.story.events['neighbors-'+id]='queued';
 d.story.identityVersion=1;
}

function dyStoryPendingValid(job) {
  const f=S.flags||{}, ending=f.done;
  if (!job.story) return true;
  if (job.event==='ending') return Boolean(ending)&&job.message?.outcome===ending;
  if (ending) return false;
  if (['wang-intro','zhao-intro','neighbors','neighbors-street','neighbors-zhao'].includes(job.event)) return !f.found;
  if (job.event==='returned') return Boolean(f.found)&&!f.inner;
  if (job.event==='inner') return Boolean(f.inner);
  return false;
}

function dyStorySync(d) {
  if (!d.story||typeof d.story!=='object'||Array.isArray(d.story)) d.story={};
  const story=d.story, f=S.flags||{};
  story.version=1;
  story.events??={};
  dyStoryMigrateIdentity(d);
  if (!story.seeded) {
    const seeds={
      zhao:[{text:'你这个号我也关注上了。寻人的图文可以留一份在这里。'}, {text:'看累了就歇一会儿，有能帮上忙的你说。'}]
    };
    for (const [id,messages] of Object.entries(seeds)) {
      const history=messages.map((m,i)=>({...m,type:'text',id:'ds'+(++d.counter),seq:d.counter,me:false,storyEvent:'seed',label:'9月18日 '+(id==='street'?'09:':'10:')+String(12+i).padStart(2,'0')}));
      d.messages[id]=[...history,...(d.messages[id]||[])];
      d.unread[id]??=0;
    }
    story.seeded=true;
  }
  // Retain delivered history; discard only mail whose original stage has passed.
  d.outbox=d.outbox.filter(job=>!job.story||dyStoryPendingValid(job));
  const queue=(event,rows)=>{
    if (story.events[event]||!rows.length) return;
    story.events[event]='queued';
    let due=Math.max(Date.now(),d.resumeAt||0,...d.outbox.map(j=>Number(j.due)||0));
    for (const row of rows) {
      due+=4800;
      d.outbox.push({id:row.id,text:row.message.text,message:{...row.message,storyEvent:event},story:true,event,due});
    }
  };
  if (f.done) {
    if (!story.events.ending) {
      const rows=f.done==='sealed' ? [
        dyStoryText('wangfamily','我爸回来了。寻人的照片先留着，我现在只想陪他好好坐一会儿。'),
        dyStoryText('zhaofamily','明明回家了。谢谢你，一直记着他的名字。')
      ] : f.done==='rescued' ? [
        dyStoryText('wangfamily','我爸还没回来。寻人登记我会留着，之前写的那些也不删。')
      ] : [dyStoryText('zhao','我在。你方便的时候回个消息就行，先照顾好自己。')];
      rows.forEach(row=>row.message.outcome=f.done);
      queue('ending',rows.filter(row=>dyStoryIntroduced(d,row.id)));
    }
    return;
  }
  const touched=post=>dyStoryTouched(d,post);
  const posted=dyStoryPublicSearch(d);
  if (!f.found) {
    if (posted||dyStoryContact(d,'wangfamily')) queue('wang-intro',[
      dyStoryText('wangfamily','你好，我是王建国的女儿，我爸也没找到。把他的寻人信息发你，麻烦帮忙留意一下。'),
      {id:'wangfamily',message:{type:'photo',photo:'missing-wang',text:'这是我爸，9月登记时交的这张照片。',sourcePost:'city-notice-wang'}},
      dyStoryPost('wangfamily','city-notice-wang','麻烦转发时带上日期和地点，照片用家里提供的这张。')
    ]);
    if (posted||dyStoryContact(d,'zhaofamily')) queue('zhao-intro',[
      dyStoryText('zhaofamily','你好，我是明明妈妈，赵明明的妈妈。他还没找到，寻人登记我发给你。'),
      dyStoryUrl('zhaofamily','QH-0386','就是这一条。那天的时间，还有他带的黄色水壶，转发时麻烦都留着。'),
      dyStoryText('zhaofamily','你要看到相似的照片，先帮我问清楚在哪儿、什么时候拍的。我怕认错。')
    ]);
    const notices=Object.values(DY_STORY_CASES).map(c=>c.post);
    if (posted||dyStoryContact(d,'street')) queue('neighbors-street',[
      dyStoryText('street','你好，我是榆树路开店的阿诚。店里也贴了几张寻人启事，我把原帖发你，麻烦帮着留意。'),
      dyStoryPost('street','street-notice-sun','孙海生那份，走失的时间和地点都在原帖里，麻烦一起留着。'),
      dyStoryPost('street','street-notice-he','何小安，手里拿绿色折叠伞的孩子。原登记链接在评论里。')
    ]);
    if (posted||notices.some(touched)) queue('neighbors-zhao',[
      dyStoryPost('zhao','agency-notice-liu','这姑娘是去还书时走失的，叫刘若宁。还没找到，你也留意一下。'),
      dyStoryPost('zhao','city-notice-zhou','还有周淑琴阿姨，登记上说她出门没带手机，在家充电。')
    ]);
  }
  if (f.found&&!f.inner) queue('returned',[
    dyStoryPost('zhao','agency-return-routine','平台又发了条回家以后的说明。你看看下面的评论。'),
    dyStoryText('zhao','端空杯子那条我看着也奇怪。不过都是评论里说的，我也不知道他家具体怎么回事。')
  ]);
  if (f.inner) queue('inner',[
    dyStoryText('wangfamily','我之前写的没改过。水冷了，他还在吹。后来杯子里都没水了，也吹。我把杯子拿走，他就对着手心吹。'),
    dyStoryText('wangfamily','脸是我爸的脸，可他这样，我不敢认。照片、聊天我都留着。'),
    dyStoryText('zhaofamily','我跟他们说过，明明学骑车时要数到十才肯松手。现在床上这个，躺下了还在数。数到十，又从一开始。'),
    dyStoryText('zhaofamily','我让他睡觉，他问爸爸的手在哪里。我说学车是以前的事，他还是问。别的人家我不知道，我这里就是这样。')
  ].filter(row=>dyStoryIntroduced(d,row.id)));
}

function dyMessagePreview(m) {
  const label={photo:'[图片]',post:'[图文]',url:'[链接]'}[m.type];
  return label?label+' '+(m.text||''):(m.text||'');
}

function dyMessageContent(m) {
  const text=m.text?'<p>'+E(m.text)+'</p>':'';
  if (m.type==='photo'&&m.photo) return `<button class="dy-message-photo" data-a="dy-inbox-photo" data-message="${E(m.id)}" aria-label="查看图片"><img src="${asset(m.photo)}" alt="${E(m.text||'私信图片')}" loading="lazy"><span>查看图片</span></button>${text}`;
  if (m.type==='post') {
    const p=dyPost(m.post);
    return p?`<button class="dy-message-card" data-a="dy-open" data-post="${E(p.id)}"><img src="${asset(p.photos[0])}" alt=""><span><small>分享图文 · ${E(dyCreator(p.creator).name)}</small><strong>${E(p.title)}</strong><em>查看图文 ›</em></span></button>${text}`:text+'<p class="dy-message-unavailable">这条图文暂不可用</p>';
  }
  if (m.type==='url') {
    const record=dyStoryRecord(m.url);
    if (record) return `<button class="dy-message-card dy-message-link" data-a="dy-inbox-url" data-message="${E(m.id)}"><span class="dy-message-link-icon" aria-hidden="true">↗</span><span><small>归家互助 · 公开登记</small><strong>${E(record.name)}的寻人信息</strong><em>查看原登记 ›</em></span></button>${text}`;
  }
  return text;
}

function dyStoryRecord(url) {
  try {
    const u=new URL(url);
    if (u.origin!=='https://www.guijia.example'||u.pathname!=='/record') return null;
    return DY_STORY_CASES[u.searchParams.get('id')]||null;
  } catch {return null;}
}

function dyStoryAction(a,b) {
  if (!['dy-inbox-photo','dy-inbox-url'].includes(a)) return false;
  const m=(S.douyin.messages[R.creator]||[]).find(m=>m.id===b.dataset.message);
  if (!m) return true;
  if (a==='dy-inbox-photo'&&m.type==='photo') dialog('私信图片',`<figure class="dy-inbox-image-view"><img src="${asset(m.photo)}" alt="${E(m.text||'私信图片')}"><figcaption>${E(m.text||'')}</figcaption></figure>`);
  if (a==='dy-inbox-url'&&m.type==='url'&&dyStoryRecord(m.url)) browse(m.url);
  return true;
}

function dyStoryFacts(id) {
  const facts=['抖音账号之间不共享微信内容；发出图文卡片只代表转发公开材料，不代表亲眼见过、完成调查或与别的家属私下联系。'];
  if (id==='wangfamily') facts.push('你是王建国的女儿王女士；你的父亲是王建国，67岁，登记QH-0361。小禾是林砚的女儿，不是你的家人。');
  if (id==='zhaofamily') facts.push('你是赵明明的母亲赵女士；你的儿子是赵明明，8岁，登记QH-0386。老赵骑一圈不是孩子父亲或家属，小禾也不是你的孩子。');
  const ownPost=id==='wangfamily'?'city-notice-wang':id==='zhaofamily'?'city-notice-zhao':null;
  if(ownPost){const p=dyPost(ownPost);if(p)facts.push('你本人公开的寻人登记原文：'+p.text+'。未记载的疾病、走失原因或其他经历不能添加。')}
  const delivered=(S.douyin.messages[id]||[]).filter(m=>!m.me&&m.storyEvent);
  const posts=new Set();
  for (const m of delivered) {
    facts.push('本账号已经送达的私信：'+m.text);
    const postId=m.type==='post'?m.post:m.sourcePost||(m.type==='url'?dyStoryRecord(m.url)?.post:null);
    if (postId) posts.add(postId);
  }
  for (const postId of posts) {
    const p=dyPost(postId);
    if (p) facts.push('已经送达的公开材料：'+p.label+'《'+p.title+'》'+p.text);
  }
  return facts;
}

function dyStoryFallback(id) {
  if (!['wangfamily','zhaofamily'].includes(id)) return '';
  if ((S.douyin.messages[id]||[]).some(m=>!m.me&&m.storyEvent==='ending'&&m.outcome==='sealed')) return id==='wangfamily'?'我爸已经回来了。我现在想陪他坐一会儿，谢谢你一直记着他。':'明明已经回家了，谢谢你。我们先陪孩子歇一歇。';
  const lines=(S.douyin.messages[id]||[]).filter(m=>m.storyEvent&&!m.me);
  if (lines.some(m=>m.storyEvent==='inner')) return '我家里的情况都跟你说了。别人家怎么回事，我也不清楚。';
  return id==='wangfamily'?'我在，我爸还没找到。你那边有消息吗？知道时间和地点的话也告诉我。':'我在。你看到像明明的孩子了吗？照片发我看看，也帮我问问在哪儿、什么时候拍的。';
}

syncDouyin();
dySaveSoon();
