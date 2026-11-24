/* Existing personal contacts. Seed history once; later edits and deletions belong to the player. */
const SOCIAL_CIRCLE={
 cousin:{name:'林薇',age:42,wx:'linwei_garden',sign:'又想买花盆了。',cover:'album_055',relationship:'林砚的表姐，平时养花，会和李岚聊阳台植物。',intro:'我是你表姐林薇呀。怎么突然这么问？',everyday:'有什么想说的就跟姐说，别自己闷着。'},
 colleague:{name:'陈骁',age:36,wx:'chenxiao_work',sign:'按时下班，认真吃饭。',cover:'album_051',relationship:'林砚的同事，和何经理在同一工作团队，平时爱做快手饭。',intro:'陈骁，你同事。工作上的事你别急，家里先顾好。',everyday:'有需要我搭把手的就说，别跟我客气。'},
 manager:{name:'何经理',age:48,wx:'he_office',sign:'有事说事，照顾好自己。',cover:'album_052',relationship:'林砚工作团队的经理；8月20日发过休假安排邮件，项目已交接给同事。',intro:'我是何经理。休假安排那封邮件我已经发你了。',everyday:'项目交接都安排好了。你有需要就告诉我，不用惦记工作的事。'},
 neighbor:{name:'周阿姨',age:61,wx:'zhou_yi_jia',sign:'买菜，做饭，晒太阳。',cover:'album_054',relationship:'与林砚、李岚住同一栋楼的熟邻居，日常会帮邻里顺手带菜。',intro:'楼里的周阿姨呀。你和李岚都别跟我客气。',everyday:'你们缺点什么，给我留句话就行。'},
 bookfriend:{name:'唐宁',age:37,wx:'tangning_read',sign:'书签总比书读得快。',cover:'album_060',relationship:'林砚的大学同学，爱读书，两人平时会互相借书。',intro:'唐宁。大学同学都认不出来了？有事你直接说。',everyday:'想说什么就说，我听着。'},
 runner:{name:'孙博',age:39,wx:'sunbo_onroad',sign:'骑慢一点，看看路边。',cover:'album_057',relationship:'老赵的骑友，也早已认识林砚；会在熟悉的骑行群里帮忙转发寻人启事。',intro:'孙博，平时跟老赵骑车的。咱们不是早就加过微信了嘛。',everyday:'要帮忙就说，我跟老赵都在。'},
 parentfriend:{name:'许静',age:39,wx:'xujing_xiaoman',sign:'小满妈妈。',cover:'album_058',relationship:'小禾同班同学小满的妈妈，与林砚、李岚是相熟的家长。没有亲眼目击失联经过。',intro:'我是小满妈妈许静。小满和小禾一个班的。',everyday:'你和李岚有什么需要我搭把手的，就直接说。'},
 repairfriend:{name:'陈师傅',age:52,wx:'chen_repair',sign:'小毛病及时修，出门才安心。',cover:'album_059',relationship:'林砚认识多年的修车师傅；熟悉林砚的日常用车，但没有失联当日的目击线索。',intro:'陈师傅，给你修车的老陈。有什么事？',everyday:'车子要是有小毛病，别硬撑着开，抽空送来看看。'}
};
const SOCIAL_CIRCLE_HISTORY={
 cousin:[['2026-07-28 18:42','你们阳台那盆薄荷别老浇水，摸着土干了再浇。','me:李岚说总算知道为什么黄叶了。','给它缓两天，别急着换盆。'],['2026-09-12 19:08','启事我又转给几个熟人了。有确实的消息，我直接联系你。','me:姐，谢谢。','先记着吃饭，别总拿饼干顶一顿。']],
 colleague:[['2026-08-05 12:16','你那个保温饭盒挺好用，今天带的面没坨。','me:汤和面分开放，别偷懒。','学会了，明天再试一次。'],['2026-08-21 09:12','何经理把分工排好了，你那部分资料我接着整理。','me:麻烦你了，有问题微信我。','放心，真碰到不清楚的我再问你。']],
 manager:[['2026-08-20 10:04','休假安排发你邮箱了。项目的事已经分给同事，不用着急回来。','me:何经理，谢谢您。','你先处理家里的事，有需要随时联系。'],['2026-09-11 15:20','这边没有要你赶回来的工作，你安心处理家里的事情。','me:我知道了。','请假的手续也已经补好了。']],
 neighbor:[['2026-08-06 16:35','楼下今天的番茄不错，给你们顺手带了一袋。','me:我下班来拿，多少钱我转您。','不多几个钱，下回你们买菜再带给我。'],['2026-09-14 18:22','我煮了点汤，问问你和李岚晚饭吃了没有。','me:吃过了，周阿姨，您自己留着。','好，那就不敲门了。有什么事随时叫我。']],
 bookfriend:[['2026-07-24 21:05','上回那本书先放你那儿，我也还没看完手头这本。','me:我夹了个书签，没折页。','知道你爱惜书，不着急还。'],['2026-09-04 20:18','我把启事发给留在槐城的同学了，请他们只转原图，别添没有核实的说法。','me:谢谢，怕越传越乱。','嗯，有消息先核实。']],
 runner:[['2026-08-02 07:26','老赵问周末你还骑不骑？天热，我们打算早点结束。','me:这周有事，你们去吧。','行，下回再约。'],['2026-08-26 19:14','启事发到骑友群了，大家都看到了。有人看到像的，会先问清时间地点。','me:谢谢你们。','有能说清时间地点的消息再联系你。']],
 parentfriend:[['2026-07-31 18:10','小满说小禾借她的书还没还，我放书包里了，开学带去。','me:不着急，她看完就行。','好，书里那张书签也给她夹回去。'],['2026-08-16 10:24','家长群里已经转过启事了。小满那天下课是我接走的，她没看到后来发生什么。','me:明白，辛苦您了。','你和李岚要是需要人帮忙跑点事，跟我说。']],
 repairfriend:[['2026-08-07 17:16','雨刮给你检查好了，旧胶条磨花了，换完试过不响。','me:好，我晚点去拿。','钥匙我放前台，你来了叫我。'],['2026-09-03 11:38','你发的启事我贴在店里了，附近几个熟人也收到了。','me:谢谢陈师傅。','先别谢，有准信我再找你。']]
};
/* year-month-day, text, optional people-free raster cell, likes, authored comments */
const SOCIAL_CIRCLE_POSTS={
 cousin:[
 ['2026-07-27 08:18','窗边的小花终于开了。每天转一次盆，现在总算不都歪向玻璃了。','album_055',['wife','neighbor'],[['wife','叶子看着精神多了。'],['cousin','少浇水真管用。']]],
 ['2026-08-05 18:46','扦插活了两盆，先别急着送人，等根长稳。','', ['me','neighbor'],[['neighbor','我给你留两个小花盆。']]],
 ['2026-08-29 09:12','晒被单也得看天气，刚收进来就落雨。今天的运动量够了。','album_050',['wife'],[['wife','我家的还在洗衣机里。']]],
 ['2026-09-12 19:16','家里孩子走失的启事还请大家继续留意。不要改图添字，确切消息请直接联系家属或警方。','',['bookfriend','runner'],[['runner','原图已经转给熟人了。']]]
 ],
 colleague:[
 ['2026-07-22 12:08','番茄鸡蛋面，十分钟能吃上。今天终于没点外卖。','album_051',['me','manager'],[['me','面别煮太久。'],['colleague','这一锅时间刚好。']]],
 ['2026-08-06 19:22','把桌上的文件归好了，找东西不用先翻三遍。希望能保持到周一。','',['manager'],[['manager','文件名也顺手整理一下。']]],
 ['2026-08-20 18:05','同事的孩子还没找到，麻烦大家帮着转发。有消息先问清楚时间地点，家里已经跑了不少趟。','',['manager','bookfriend'],[['manager','有确实的信息再联系。']]],
 ['2026-09-15 08:11','早一班车，整个人都没那么着急。','album_049',['me'],[['manager','路上慢点。']]]
 ],
 manager:[
 ['2026-07-20 07:42','今天走到下一站坐车，路边树荫挺长。','album_052',['colleague','me'],[['colleague','早上还没那么热。']]],
 ['2026-08-01 18:36','忙完了，回家做饭。这周末不带电脑了。','',['colleague'],[['colleague','我也争取。']]],
 ['2026-08-20 20:08','这周临时调了几个人的活，辛苦大家。交接有漏的随时找我。','',['colleague','me'],[['colleague','收到，明天我把交接单补齐。']]],
 ['2026-09-10 19:05','晚饭后在公园坐了一会儿，天黑得比上个月早了。','',['colleague'],[['colleague','下班路上也感觉到了。']]]
 ],
 neighbor:[
 ['2026-07-24 09:06','早市回来，今天的青菜嫩，够吃两天。买多了就容易放坏。','album_053',['wife','cousin'],[['cousin','那把小葱很新鲜。']]],
 ['2026-08-08 12:02','西瓜切小块，吃起来方便。冰过的别一口气吃太多。','album_056',['wife'],[['wife','看着就凉快。']]],
 ['2026-08-23 18:15','汤炖好了。晚饭没胃口，先盛一碗喝。','',['wife','cousin'],[['cousin','您也别忙得忘了自己吃。']]],
 ['2026-09-16 10:28','雨停了，楼下坐一坐。花坛边有点滑，大家走慢些。','album_054',['wife','cousin'],[['wife','谢谢阿姨提醒。']]]
 ],
 bookfriend:[
 ['2026-07-19 21:42','书读到一半才发现，前言里已经写过答案了。倒回去又看了十页。','',['me','colleague'],[['me','你这是把一本书读成两本。']]],
 ['2026-08-04 20:16','下雨的时候，翻书声都比平时清楚。今晚不往外跑了。','album_060',['me'],[['me','适合把没看完的接着看。']]],
 ['2026-08-24 17:36','本来只想收拾书架，结果坐在地上又读了一章。书没少，灰倒是擦了。','',['cousin'],[['cousin','我收拾花盆也是这样，一下就到天黑。']]],
 ['2026-09-04 20:26','寻人启事已转给在槐城的同学。请保留原图和联系方式，不要凭印象改内容。','',['me','cousin'],[['cousin','谢谢大家留心。']]]
 ],
 runner:[
 ['2026-07-26 07:05','湖边绕一小圈，赶在太阳晒起来之前回去吃早饭。','album_057',['friend','repairfriend'],[['friend','今天风不大，舒服。']]],
 ['2026-08-09 06:52','热得骑不动，今天少骑一半，回去冲澡了。','',['friend','me'],[['friend','同意，水得带够。']]],
 ['2026-08-26 19:23','群里转发的寻人启事请大家留意。有情况先记清地点和时间，不要未经核实就下结论。','',['friend','repairfriend'],[['repairfriend','店里也留着原版启事。']]],
 ['2026-09-13 08:26','慢慢骑也挺好，不用每次都盯着里程。','',['friend','repairfriend'],[['friend','有空再约一圈。']]]
 ],
 parentfriend:[
 ['2026-07-18 15:08','陪小满去借书，最后她挑好两本，我还站在书架前没选完。','',['wife','bookfriend'],[['wife','孩子选东西反倒痛快。']]],
 ['2026-07-31 12:20','中午煮面，鸡蛋最后下，省得碎成一锅。','',['wife','neighbor'],[['neighbor','我还喜欢加一点葱花。']]],
 ['2026-08-16 10:36','孩子的寻人启事已转发给认识的家长。请大家帮忙留意，也别把没核实的话传给家属。','',['wife','cousin'],[['cousin','谢谢大家。']]],
 ['2026-09-09 20:14','书包收好了，水杯也洗了。催半天，小满总算肯睡了。','album_058',['wife','neighbor'],[['neighbor','早点休息。']]]
 ],
 repairfriend:[
 ['2026-07-21 11:46','旧车擦干净，链条上点油，还能好好骑。','album_059',['runner','friend'],[['runner','老物件收拾好一样舒服。']]],
 ['2026-08-07 18:23','下雨天雨刮异响别一直干刮，停好车看看胶条，视线不好就先别赶路。','',['me','runner'],[['me','换完好多了，谢谢师傅。']]],
 ['2026-08-28 17:55','工具用完放回原位。找一把扳手比修小毛病还费时间，都是自己偷懒。','',['runner'],[['runner','我家的打气筒也总找不到。']]],
 ['2026-09-14 12:12','忙到现在才吃午饭，饿了。','',['runner','me'],[['runner','赶紧吃吧，别又凉了。']]]
 ]
};

function socialCircleKnown(id){return Object.prototype.hasOwnProperty.call(SOCIAL_CIRCLE,id)}
function socialCirclePhoto(id,source,date,text){
 if(!D.photos[id])D.photos[id]={title:'朋友圈照片',file:source,date:date.slice(0,10).replace(/(\d{4})-(\d{2})-(\d{2})/,'$1年$2月$3日'),time:date.slice(11,16),takenAt:publicContentTimestamp(date),device:'来自朋友圈',lens:'已存储图像',size:'已存储照片',location:'',album:'最近项目',description:text};
 return id;
}
function socialCircleBuildPosts(){
 const posts=[];
 for(const [id,rows] of Object.entries(SOCIAL_CIRCLE_POSTS))for(const [index,row] of rows.entries()){
  const [date,text,image,likes,comments]=row,pid='circle-'+id+'-'+(index+1),stamp=publicContentTimestamp(date);
  posts.push({id:pid,person:id,date,sortAt:stamp,postedAt:stamp,text,socialCircleSeed:true,
   ...(image?{photo:socialCirclePhoto(pid+'-image',image,date,SOCIAL_CIRCLE[id].name+'发的照片：'+text)}:{}),
   likes:likes.map(person=>SOCIAL_CIRCLE[person]?.name||D.people[person]?.name||person),
   comments:comments.map(([person,text],i)=>({id:pid+'-comment-'+i,person,name:SOCIAL_CIRCLE[person]?.name||D.people[person]?.name||person,text,createdAt:publicContentAfter(stamp,4+i*7),date:publicContentDate(publicContentAfter(stamp,4+i*7)),socialCircleSeed:true}))});
 }
 return posts;
}
function socialCircleBuildHistory(id){return SOCIAL_CIRCLE_HISTORY[id].flatMap(([date,...lines],group)=>{const timestamp=publicContentTimestamp(date),label=Number(date.slice(5,7))+'月'+Number(date.slice(8,10))+'日 '+date.slice(11,16);return [{date:label,timestamp,socialCircleSeed:id+'-date-'+group},...lines.map((line,i)=>({type:'text',text:line.replace(/^me:/,''),timestamp,...(line.startsWith('me:')?{me:true}:{}),socialCircleSeed:id+'-'+group+'-'+i}))]})}
function socialCircleNormalizeDates(){
 if(S.socialCircle?.dateVersion===1)return;
 for(const id of Object.keys(SOCIAL_CIRCLE)){
  const originals=new Map(socialCircleBuildHistory(id).map(m=>[m.socialCircleSeed,m]));
  for(const message of S.history[id]){const source=originals.get(message.socialCircleSeed);if(!source)continue;if(source.date&&message.date)message.date=source.date;if(!message.timestamp)message.timestamp=source.timestamp}
 }
 if(S.socialCircle)S.socialCircle.dateVersion=1;
}
function syncSocialCircle(){
 for(const id of Object.keys(SOCIAL_CIRCLE))if(!Array.isArray(S.history[id]))S.history[id]=[];
 if(S.socialCircle?.version>=1){socialCircleNormalizeDates();return}
 const present=new Set(S.moments.map(m=>m.id));
 const q=typeof socialReactionStore==='function'?socialReactionStore():S.socialReactions;
 if(q){q.seenPosts??={};q.seenComments??={}}
 for(const source of SOCIAL_CIRCLE_SEED_POSTS){
  if(!present.has(source.id)){S.moments.push(clone(source));present.add(source.id)}
  if(q){q.seenPosts['moments:'+source.id]=true;for(const c of source.comments)q.seenComments['moments:'+source.id+':'+c.id]=true}
 }
 for(const id of Object.keys(SOCIAL_CIRCLE)){
  // An explicitly hidden empty conversation remains empty. Never reset remarks, drafts, mute or unread state.
  if(!S.history[id].length&&!S.hiddenChats.includes(id))S.history[id]=clone(D.histories[id]);
 }
 S.socialCircle={version:1};
 socialCircleNormalizeDates();
}
function socialCircleFacts(id){
 if(!socialCircleKnown(id))return [];
 const p=SOCIAL_CIRCLE[id],own=(S.moments||[]).filter(m=>m.person===id&&publicContentVisible(m.postedAt||m.date)).sort((a,b)=>String(b.postedAt||b.date).localeCompare(String(a.postedAt||a.date)));
 return [`你是${p.name}，${p.age}岁。${p.relationship} 个性签名：${p.sign}`,'你只知道自己的旧聊天、自己发过的动态和林砚在本段对话实际告诉你的事；开始时仅知道小禾失联，没有新目击线索。不知道归家会、邪教、内部档案、神明或其他人的私聊。不得把林砚的猜测说成已经核实，不得编造共同经历、未经发送的照片细节或主动获知孩子归来。',...own.slice(0,2).map(m=>'你已公开发表的朋友圈（'+publicContentDate(m.postedAt||m.date)+'）：'+m.text.slice(0,190))];
}
function socialCircleFallback(id,text){
 if(!socialCircleKnown(id))return [];
 const p=SOCIAL_CIRCLE[id],t=String(text||'');
 if(/你是谁|哪位|认识你|你叫什么/.test(t))return[p.intro];
 if(/不想活|想死|活不下去|撑不住/.test(t))return['先别一个人待着，也别伤害自己。告诉我你现在在哪儿，我们先一句一句说。'];
 if(/归亲|归家会|神明|邪教|守灯|献名|食名/.test(t))return['这些我没听说过。你是从哪儿看到的？'];
 if(/小禾.*(?:回来了|找到了)|(?:找到|找回)(?:了)?小禾/.test(t))return['看到你说找到小禾了。你和李岚先照顾好她，需要帮忙再告诉我。'];
 if(/小禾|女儿|失踪|失联|线索|寻人|找孩子/.test(t))return['我这边还没消息。要是有人见过，我马上联系你。'];
 if(/谢谢|多谢|麻烦|辛苦/.test(t))return['别客气，能帮的我会帮。'];
 if(/晚安|睡了|休息/.test(t))return['好，早点休息。有事明天再说。'];
 if(id==='cousin'&&/花|浇水|薄荷|阳台/.test(t))return['先摸摸盆土，干了再浇。别急着折腾它，给它缓几天。'];
 if(['colleague','manager'].includes(id)&&/工作|项目|请假|回去|邮件/.test(t))return[id==='manager'?'邮件里的休假安排照常，项目已经交接。你先顾家里。':'交接的资料我在整理，你先别担心。有不清楚的我再微信问你。'];
 if(id==='bookfriend'&&/还书|借.{0,3}书/.test(t))return['借你的那本不急着还。看书这事，慢慢来。'];
 if(id==='bookfriend'&&/书|读/.test(t))return['最近看什么书呢？'];
 if(['runner','repairfriend'].includes(id)&&/骑|车|雨刮|链条/.test(t))return[id==='runner'?'最近就骑得慢一点。有空再约，不赶里程。':'具体哪里不对劲，你描述一下。隔着手机我也不能说一定是哪儿坏了。'];
 return[p.everyday];
}

for(const [id,p] of Object.entries(SOCIAL_CIRCLE)){
 D.people[id]={...(D.people[id]||{}),name:p.name,wx:p.wx,region:'槐城',sign:p.sign,photo:'circle-'+id};
 D.histories[id]??=socialCircleBuildHistory(id);
 PERSONAL_COVERS[id]=socialCirclePhoto('circle-'+id+'-cover',p.cover,'2026-07-01 09:00',p.name+'的朋友圈封面。');
}
const SOCIAL_CIRCLE_SEED_POSTS=socialCircleBuildPosts();
for(const post of SOCIAL_CIRCLE_SEED_POSTS)if(!D.moments.some(m=>m.id===post.id))D.moments.push(clone(post));
const socialCirclePreviousSync=syncSocialDetails;
syncSocialDetails=function(){syncSocialCircle();return socialCirclePreviousSync()};
const socialCirclePreviousReact=react;
react=function(id,text){if(socialCircleKnown(id)){npcReply(id,text,socialCircleFallback(id,text));return}return socialCirclePreviousReact(id,text)};
syncSocialCircle();
