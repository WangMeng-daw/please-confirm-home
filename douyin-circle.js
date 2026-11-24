/* Existing acquaintances, authored public photo posts and separate Douyin chat histories. */
const DY_CIRCLE_MEMBERS={
 cousin:{name:'林薇',handle:'linwei_yanghua',age:42,relation:'表姐',relationship:'你是林薇，42岁，林砚的表姐，平时喜欢养花',bio:'喜欢养花，阳台已经放不下了。',cover:'album_055',followers:38,followingCount:27,
  seed:['林砚，我把养花的随手拍都放在这个号了。拍糊的也没舍得删。','姐，我关注上了。','不用每条都点赞，有空看看就行。','好，慢慢看。'],
  posts:[
   ['2026-06-04T09:12:00+08:00','窗台又挤了一点','窗台又摆满了，水杯差点没地方放。今天忍住没买新盆。',['album_055'],['养花','阳台日常'],'neighbor','看着就舒坦，留点位置晒太阳。','对，我已经把挤在后面的挪出来了。'],
   ['2026-07-16T14:20:00+08:00','阳台有点忙','趁太阳出来赶紧晒衣服，花盆全挪到边上去了。',['album_050'],['阳台','慢生活'],'bookfriend','你这阳台还能坐下人吗。','刚腾出一点地方，又堆了衣架。'],
   ['2026-09-03T18:10:00+08:00','小禾的启事请大家继续帮忙转','表弟林砚的女儿小禾还没找到。有见过孩子的，麻烦联系办案民警。配图是以前拍的窗台。大家转来的消息我都看了，谢谢。',['album_055'],['寻人','家人'],'parentfriend','我也再转一次。','谢谢你，麻烦大家了。']
  ]},
 colleague:{name:'陈骁',handle:'chenxiao_xiafan',age:36,relation:'同事',relationship:'你是陈骁，36岁，林砚的同事，平时爱做快手饭',bio:'上班，下班，研究怎么少洗一个锅。',cover:'album_051',followers:46,followingCount:34,
  seed:['林砚，你问的简单做饭图文我放主页了。反正我只会一锅煮。','正好，我也不想弄太复杂。','看归看，水开了再下面。这个步骤别跟我一样忘。','记住了，先烧水。'],
  posts:[
   ['2026-06-10T19:05:00+08:00','一碗番茄鸡蛋面','下班回来煮碗面，汤差点烧干了。好在还能吃。',['album_051'],['快手饭','下班以后'],'runner','这碗看着就能吃饱。','碗小了，还有一半在锅里。'],
   ['2026-07-22T08:18:00+08:00','绕进小巷买早饭','雨后绕了一小段，路上还湿着。早饭没顾上拍，只留了一张路过的巷子。',['album_049'],['早饭路上','普通生活'],'neighbor','地上湿，走慢一点。','嗯，鞋底都湿了。'],
   ['2026-09-17T19:10:00+08:00','今晚还是煮面','不知道吃什么，翻到六月这张面条照片，那就还煮这个吧。',['album_051'],['家常面','翻相册'],'bookfriend','看到的时候正好饿了。','快去煮，十来分钟就好。']
  ]},
 manager:{name:'何经理',handle:'helao_manmanzou',age:48,relation:'工作上的经理',relationship:'你是何经理，48岁，林砚工作上的经理，也是处理他休假邮件的同一人，日常喜欢通勤时散步',bio:'下班了，随便看看。',cover:'album_052',followers:29,followingCount:19,
  seed:['林砚，这边不用叫得那么正式，我也是随手看一看。','好的何经理。','你看，还是改不过来。','这个称呼顺口了。'],
  posts:[
   ['2026-06-03T07:45:00+08:00','这站有树荫','等车时拍的。这站有树挡着，早上没那么晒。',['album_052'],['通勤','树影'],'cousin','阳光从叶子里漏下来很好看。','站着等了一会儿，正好看到。'],
   ['2026-07-28T18:25:00+08:00','等车的几分钟','还是六月等车那张。那天在这坐了一会儿，后来干脆走到下一站去了。',['album_052'],['翻旧照片','通勤'],'colleague','看着比办公室椅子舒服。','那可没有，这椅子硬。'],
   ['2026-09-15T17:40:00+08:00','绕远一点也可以','今天早一站下车，多走了几步。最近没拍新照片，还是用这张站棚。',['album_052'],['散步日记','日常'],'runner','晚上走走还行，中午太晒了。','是，等太阳下去再出门。']
  ]},
 neighbor:{name:'周阿姨',handle:'zhouayi_jiachang',age:61,relation:'同楼邻居',relationship:'你是周阿姨，61岁，与林砚住在同一栋楼的邻居，平时买菜、煲汤',bio:'买菜做饭，晒太阳。慢慢学着发照片。',cover:'album_054',followers:22,followingCount:11,
  seed:['小林，我发的照片从哪里看？','点进自己的主页，下面的作品里就有，阿姨。','看到了，原来在这里。还以为没有发出去。','已经发出去了，您发得对。'],
  posts:[
   ['2026-06-18T08:06:00+08:00','早上的菜摊','今早的青菜不错，买了一把，够今天吃了。',['album_053'],['买菜','家常日子'],'colleague','这比我一次买一大袋的办法好。','少拿一点，菜也新鲜。'],
   ['2026-07-19T10:12:00+08:00','西瓜切好了','西瓜切好了，先吃这一盘，剩下的放冰箱。',['album_056'],['西瓜','日常'],'parentfriend','看着就凉快一点。','还挺甜的。'],
   ['2026-09-17T15:30:00+08:00','歇脚的地方','在楼下坐一会儿，等汤炖好。没走远，就在家旁边。',['album_054'],['下午','煲汤等一会'],'cousin','椅子上还有斑斑点点的光。','有树荫，坐着不晒。']
  ]},
 bookfriend:{name:'唐宁',handle:'tangning_fanye',age:37,relation:'大学同学',relationship:'你是唐宁，37岁，林砚的大学同学，喜欢读书，也喜欢雨天在窗边阅读',bio:'书看得慢，买得快。',cover:'album_060',followers:51,followingCount:43,
  seed:['林砚，这个号没怎么更新，都是看别人的书评。','你的简介倒是一直像写在书签上的。','短一点，省得自己也看不下去。','这句可以放下一张书签。'],
  posts:[
   ['2026-05-16T16:08:00+08:00','今天只拍窗外','翻了几页就走神，干脆拍一下窗上的雨。书还在旁边，没有拍进去。',['album_060'],['阅读间隙','雨天'],'cousin','看雨也算休息。','本来也没看进去。'],
   ['2026-07-04T11:15:00+08:00','书签夹在原来的地方','书签一星期没动了。配张五月拍的雨，今天连书都懒得拍。',['album_060'],['读书','旧照片'],'manager','哪本？不好看就换一本。','书还行，是我老走神。'],
   ['2026-09-12T15:42:00+08:00','慢慢读也算读','这张五月拍的雨窗还挺喜欢。这阵子看书太慢，翻几页就困。',['album_060'],['阅读日常','午后'],'parentfriend','我也这样，睡前看不了两页。','然后第二天还得倒回去看。']
  ]},
 runner:{name:'孙博',handle:'sunbo_qimanman',age:39,relation:'熟人 · 老赵的骑友',relationship:'你是孙博，39岁，与老赵一起骑车，也原本认识林砚；你不是老赵本人',bio:'和老赵骑车，也一个人慢慢转。安全到家最要紧。',cover:'album_057',followers:67,followingCount:38,
  seed:['林砚，老赵说你也在这边，我把号关注上了。','看到了，你这名字倒是好找。','懒得起昵称，就用本名了。','挺好，路上注意安全。'],
  posts:[
   ['2026-06-13T08:20:00+08:00','先停好车，再拍水面','骑到水边歇口气，停好车拍了两张。',['album_057'],['骑行路上','慢一点'],'repairfriend','先看刹车和轮胎，能骑也别省这一步。','嗯，出门前都看看。'],
   ['2026-07-11T09:36:00+08:00','不刷速度的一天','今天没开记录，不知道骑了几公里。配张六月在水边拍的，懒得拍新的了。',['album_057'],['骑行','不赶路'],'zhao','慢慢骑，别只顾看水。','对，停车才拿手机。'],
   ['2026-09-14T12:05:00+08:00','翻到六月骑车的照片','六月拍的湖面。最近没怎么骑，翻翻照片。快到饭点了，先找吃的。',['album_057'],['翻相册','好好吃饭'],'colleague','我们可以交流一下少洗锅的办法。','我负责吃，办法还得跟你学。']
  ]},
 parentfriend:{name:'许静',handle:'xiaoman_mama_xu',age:39,relation:'小满妈妈 · 同学家长',relationship:'你是许静，39岁，小满的妈妈，小满与林砚的女儿小禾是同学；你不是许老师，也不是林砚的妻子',bio:'小满妈妈，偶尔发点日常。',cover:'album_058',followers:34,followingCount:24,
  seed:['小禾爸爸，我是小满妈妈许静。这边也加上了。','认出来了，你好。','我发得不多，看到什么家常小办法就先存着。','我也是随便看看。'],
  posts:[
   ['2026-05-20T20:10:00+08:00','厨房收拾干净了','碗洗完了，台面也擦了。每天做饭半小时，收拾又半小时。',['album_058'],['收拾厨房','家常'],'neighbor','洗完记得晾一晾再收。','留在架子上，明早再放进去。'],
   ['2026-07-03T14:35:00+08:00','收拾到这里就够了','配图还是五月那张洗碗架。今天收拾完厨房，决定不继续跟抽屉较劲了，明天再说。',['album_058'],['收拾家里','普通日子'],'colleague','少用一只碗，就能少洗一只。','你看什么都先想到少洗碗。'],
   ['2026-08-16T18:20:00+08:00','等着确切的消息','小禾是小满的同学，现在还没找到。麻烦大家继续帮着转发，有消息联系她家里。配图是以前拍的厨房。',['album_058'],['寻人','请核实消息'],'cousin','谢谢你想着她。','别客气，都盼着孩子早点回来。']
  ]},
 repairfriend:{name:'陈师傅',handle:'chenshifu_xiuche',age:52,relation:'认识多年的修车师傅',relationship:'你是陈师傅，52岁，与林砚认识多年的修车师傅，平时做车辆维护，也修自行车；不掌握未经提供的车辆线索',bio:'修车的老陈，有事留言。',cover:'album_059',followers:83,followingCount:16,
  seed:['小林，这个号也是我。手上忙，字打得慢。','知道了陈师傅，我发一句您有空再看就行。','好。车有响声先停下来看看，别硬骑。','记住了。'],
  posts:[
   ['2026-06-05T09:30:00+08:00','旧车也要好好照看','这辆老车还能骑。出门前看看轮胎，捏两下刹车。',['album_059'],['自行车','日常保养'],'runner','每次出门前捏两下刹车。','这个习惯好，别等到了坡上再试。'],
   ['2026-07-20T17:18:00+08:00','活慢一点，做稳一点','六月拍的这辆车。今天活有点多，得一辆一辆来，来不及的我会打电话说。',['album_059'],['修车日常','老照片'],'manager','做稳当了，后面也省心。','是，不能看着差不多就算了。'],
   ['2026-09-05T10:25:00+08:00','忙完也歇两分钟','最近忙，没拍新照片，还是这辆车。喝口水，等会儿接着干。',['album_059'],['歇一会','修车日常'],'neighbor','忙起来也别忘了吃饭。','记着呢，做完这一点就去。']
  ]}
};

for(const [id,person] of Object.entries(DY_CIRCLE_MEMBERS)){
 Object.assign(DOUYIN_CREATORS,{[id]:{name:person.name,handle:person.handle,person:id,npc:id,knownFriend:true,followsPlayer:true,relationship:person.relationship,bio:person.bio,cover:person.cover,followers:person.followers,followingCount:person.followingCount}});
 person.posts.forEach((row,index)=>{
  const [createdAt,title,text,photos,tags,commenter,comment,reply]=row,idPost='circle-'+id+'-'+(index+1),date=createdAt.slice(0,10);
  const commentStamp=new Date(Date.parse(createdAt)+(12+index*3)*60000+8*3600000).toISOString().slice(0,19)+'+08:00';
  const replyStamp=new Date(Date.parse(commentStamp)+9*60000+8*3600000).toISOString().slice(0,19)+'+08:00';
  if(!DOUYIN_POSTS.some(p=>p.id===idPost))DOUYIN_POSTS.push({id:idPost,creator:id,date,createdAt,label:`${Number(date.slice(5,7))}月${Number(date.slice(8,10))}日 ${createdAt.slice(11,16)}`,location:'槐城',title,text,photos,tags,likes:5+(Object.keys(DY_CIRCLE_MEMBERS).indexOf(id)*3+index*7)%31,comments:[{id:idPost+'-comment',creator:commenter,text:comment,date:commentStamp,createdAt:commentStamp,likes:1,replies:[{id:idPost+'-reply',creator:id,text:reply,date:replyStamp,createdAt:replyStamp,likes:0}]}]});
 });
}

function dyCircleSync(d){
 if(d.circleVersion===1)return;
 let actorIndex=0;
 for(const [id,person] of Object.entries(DY_CIRCLE_MEMBERS)){
  // An explicit user choice always wins, including on a migrated save.
  if(d.followActions[id]!==false&&!d.following.includes(id))d.following.push(id);
  const existing=d.messages[id]||[],seeds=person.seed.map((text,index)=>{
   const day=String(24+actorIndex).padStart(2,'0'),minute=String(10+index*4).padStart(2,'0');
   return {id:`circle-chat-${id}-${index}`,seq:-1000+actorIndex*10+index,type:'text',text,me:index%2===1,label:`7月${24+actorIndex}日 19:${minute}`,createdAt:`2026-07-${day}T19:${minute}:00+08:00`,circleSeed:true};
  }).filter(m=>!existing.some(row=>row.id===m.id));
  d.messages[id]=[...seeds,...existing];d.unread[id]??=0;actorIndex++;
 }
 d.following=[...new Set(d.following)];d.circleVersion=1;
}
const dyCirclePreviousSync=syncDouyin;
syncDouyin=function(){const d=dyCirclePreviousSync();dyCircleSync(d);return d};

function dyCircleFollowing(){return [...new Set(S.douyin.following)].filter(id=>id!=='me'&&DOUYIN_CREATORS[id])}
function dyCircleFamiliar(){return Object.keys(DOUYIN_CREATORS).filter(id=>id!=='me'&&dyKnownFriend(id))}
function dyCircleListUI(){
 const familiar=R.circleTab==='familiar',list=familiar?dyCircleFamiliar():dyCircleFollowing();
 return dyHeader(familiar?'熟人':'我的关注')+`<div class="dy-subtabs"><button data-a="dy-circle-tab" data-tab="following" class="${!familiar?'on':''}">关注 ${dyCircleFollowing().length}</button><button data-a="dy-circle-tab" data-tab="familiar" class="${familiar?'on':''}">熟人 ${dyCircleFamiliar().length}</button></div><div class="dy-scroll dy-circle-list">${list.map(id=>{
  const c=dyCreator(id),following=S.douyin.following.includes(id),relation=DY_CIRCLE_MEMBERS[id]?.relation||(id==='zhao'?'老朋友':''),label=following?(c.followsPlayer?'互相关注':'已关注'):'关注';
  return `<section data-circle-person="${id}"><button class="dy-user-row" data-a="dy-profile" data-creator="${id}">${dyAvatar(id)}<span><strong>${E(c.name)}</strong><small>${relation?E(relation)+' · ':''}${E(c.handle)}</small></span>${ico('forward')}</button><div class="dy-profile-actions" style="margin:0 16px 12px;height:auto"><button class="${following?'':'dy-pink'}" data-a="dy-follow" data-creator="${id}" aria-label="${following?'取消关注':'关注'}${E(c.name)}">${label}</button><button data-a="dy-thread" data-creator="${id}" aria-label="给${E(c.name)}发私信">私信</button></div></section>`;
 }).join('')||'<div class="dy-empty">暂时没有关注的人</div>'}</div>`;
}
const dyCirclePreviousProfile=dyProfile;
dyProfile=function(){
 const html=dyCirclePreviousProfile(),id=R.creator||'me',member=DY_CIRCLE_MEMBERS[id];
 if(id!=='me'&&!member)return html;
 const template=document.createElement('template');template.innerHTML=html;
 const stats=template.content.querySelector('.dy-stats'),following=stats?.children[1];
 if(id==='me'&&following)following.outerHTML=`<button data-a="dy-circle-list" aria-label="查看关注列表"><b>${dyCircleFollowing().length}</b> 关注</button>`;
 if(member){
  if(following)following.innerHTML=`<b>${member.followingCount}</b> 关注`;
  const bio=template.content.querySelector('.dy-bio');bio?.insertAdjacentHTML('afterend',`<p class="dy-handle">${E(member.relation)}</p>`);
  const followButton=template.content.querySelector('[data-a="dy-follow"]');
  if(followButton&&S.douyin.following.includes(id)&&DOUYIN_CREATORS[id].followsPlayer)followButton.textContent='互相关注';
 }
 return template.innerHTML;
};
const dyCirclePreviousRender=renderDouyin;
renderDouyin=function(){
 if(R.view!=='circle-list')return dyCirclePreviousRender();
 syncDouyin();return `<div class="dy-root dy-light">${dyCircleListUI()}</div>`;
};
const dyCirclePreviousAction=douyinAction;
douyinAction=function(a,b){
 if(a==='dy-circle-list'){dyGo('circle-list',{circleTab:'following'});return true}
 if(a==='dy-circle-tab'){R.circleTab=b.dataset.tab==='familiar'?'familiar':'following';render();return true}
 return dyCirclePreviousAction(a,b);
};
const dyCirclePreviousFeed=dyFeedPosts;
dyFeedPosts=function(){const list=dyCirclePreviousFeed();return R.tab==='friends'?[...list].sort((a,b)=>Date.parse(dyPostStamp(b))-Date.parse(dyPostStamp(a))):list};
const dyCirclePreviousFallback=dyNpcFallback;
dyNpcFallback=function(id){return DY_CIRCLE_MEMBERS[id]?'我这会儿没顾上看，等空下来再回你。':dyCirclePreviousFallback(id)};
syncDouyin();
