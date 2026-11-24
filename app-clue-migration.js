/* Public research and present-day entrances belong to their own sources.
 * Search predicates are read-only; only an opened answer/entrance records a read. */
(function(){
 'use strict';
 const questions=[
  {id:'old-rubbing-versions',title:'归亲堂门铭的旧拓背签，为什么不能和后印祈词合校？',topic:'地方文献',tags:['版本学','槐城旧事'],keywords:['程遇','槐城旧志','门铭旧拓','旧拓与新版祈词的差别','归亲堂门铭拓本与后印祈词校记','旧门上的纸与字'],excerpt:'拓本、背签和后印纸各有自己的著录位置。把它们合成一份通顺的文字，有时反而抹掉了版本差异。',date:'2026-09-07',followers:28,views:1462,clue:{key:'zhihu-old-rubbing',requires:'old-lamp-public'},answers:[{id:'old-rubbing-chengyu',author:'clue-chengyu',date:'2026-09-07',upvotes:47,comments:[{author:'槐河散步',text:'原来背面的签条也算原件的一部分。'}],paragraphs:[
   '我整理的题目是《归亲堂门铭拓本与后印祈词校记》。材料有三类：门上残刻的旧拓、拓片背签，以及后来统一领用的祈词纸。门上的字磨损得很厉害，背签却保存完整；三件材料不宜拼成一个“补全本”。',
   '旧拓背签照录为：上·贰背·黄。签旁题《归亲会抄经本》，这是册、叶、正背和行记，不是门铭正文。原拓所附印记随影录保存，不能用后印纸的领读索引替换这条背签。',
   '后印纸另换了索引，并附有收回旧纸、更换门帖的领用说明。这说明它是有意改版，不是抄写时漏了一两个字。旧拓及后印本分别著录，校记只说明纸张、签条和改印关系，不将两版混排。',
   '原刊题名取自旧门铭的译文，旧刊目录一直沿用原题。某些转载把后印祈词也放在同一题名之下，因而看似同一句话的不同抄法；实际上，连所指的书中行次都换过了。'
  ]}]},
  {id:'qing-ferry-society',title:'地方文献里的归亲会，最初是怎样的民间组织？',topic:'地方史',tags:['槐城','民间文献'],keywords:['程遇','归亲会起源','归亲堂','清朝','同治五年','1866','槐河义渡与归亲会早期文书'],excerpt:'旧渡簿、代转来信和后来的照片不能当成同一年代的材料。先看文书原来的用途。',date:'2026-09-08',followers:35,views:2198,clue:{key:'zhihu-qing-origin',requires:'history'},answers:[{id:'qing-ferry-chengyu',author:'clue-chengyu',date:'2026-09-08',upvotes:83,comments:[{author:'河岸树影',text:'把年代和材料种类分开看就清楚多了。'}],paragraphs:[
   '《槐河义渡与归亲会早期文书》所用的最早一批材料，纪年为清同治五年，即1866年。槐河水患后，船户和几户失散人家合办义渡，代转口信、抄录寻人姓名。早期账簿题“归亲会”，未见后来那些家庭接领表格。',
   '渡口设屋收信，入夜添油点灯，方便过河和寻亲的人辨认旧处。来信簿、渡费账与手绘渡路是当时留下的材料；把更晚的堂名、仪式或照片一并说成创会时就有，证据并不支持。',
   '现存最早的同人照片拍于1898年，比这批渡簿晚三十二年。布结曾用于系代转的来信，空椅的解释则随时期而变。器物延续只能说明物件被保存，不能证明每一代同人沿用同一种章程或信仰。',
   '后世关于“灯能引人归来”的记述属于当事人的信仰与叙事。研究者可以讨论它如何影响救助和寻人活动，不能据此把超自然作用写成历史事实。'
  ]}]},
  {id:'reunion-1926-split',title:'1926年的“同堂分册”，为什么会出现两套归亲堂登记？',topic:'地方史',tags:['档案','民国史'],keywords:['梁序','归亲会','守灯派','奉母派','1926分派','民国十五年归亲堂分册考','同堂分册'],excerpt:'后来的抄本常用教派名概括争议，原始会务文书记录的却首先是保存哪些登记。',date:'2026-09-09',followers:19,views:987,clue:{key:'zhihu-1926-split',requires:'history'},answers:[{id:'reunion-split-liangxu',author:'clue-liangxu',date:'2026-09-09',upvotes:32,comments:[],paragraphs:[
   '据《民国十五年归亲堂分册考》，1926年的争议涉及两种不同的登记依据：一边认为家属接领之后应当保留寻人原信，另一边主张依家属承认、画像和称谓登记团圆。会务簿在春祭以后分成两套，旧堂器物没有分开。',
   '后来的抄本将两支分别称为“守灯”与“奉母”。前者强调续寻和原始姓名，后者的文书更重画像、家属称谓及接领手续。用两种表格的收件范围和销号方式来比较，比笼统地说“旧会换了神”更可靠。',
   '“代归”“奉母”一类说法属于该支文书中的信仰语言。有些后世故事将其解释为同貌之人归家；公开材料只能证明存在这样的叙述，无法据此确认故事中的超自然细节。',
   '分册以后，两边沿用旧堂名号，祈词各循其本，后印本还删去了部分撤销登记栏。具体个案须区分原件、后来的翻印和研究者的转述；不宜把任何一册概括成所有参与者的共同主张。'
  ]}]},
  {id:'six-offerings-terms',title:'“六殉”“寿殉”“命殉”是槐城一直有的民俗说法吗？',topic:'民俗学',tags:['文字考据','地方文献'],keywords:['梁序','六殉奉母','寿殉','命殉','六旬','六殉称谓与后出抄本辨误'],excerpt:'网络文章常把形近字、地方传说和后出的私抄术语放在一起，实际需要分别考察。',date:'2026-09-10',followers:42,views:1806,clue:{key:'zhihu-six-terms',requires:'private'},answers:[{id:'six-terms-liangxu',author:'clue-liangxu',date:'2026-09-10',upvotes:61,comments:[{author:'纸上小舟',text:'引用老材料时，版本年代真的不能省。'}],paragraphs:[
   '我在《六殉称谓与后出抄本辨误》中讨论过这个问题。“六旬”和“六殉”不能因为形近就互相替换，也不能拿一个贺寿用词给另一套文书里的称谓作解释。',
   '光绪年间的旧渡簿记录失散人口，没有把“六殉奉母”列作义渡的通行规矩。现见相关名称出自1926年以后奉母一支的私抄材料。“寿殉”“命殉”是那类材料内部的用语，不能反推为槐城历来共有的民俗。',
   '这批私抄文书后来被不断转录，短篇转载往往删去抄本年代和经手人，剩下一个骇人的故事。这里关注的是文书怎样流传、文字怎样被改写。抄本所说的作用，在现存史料中缺少佐证。',
   '公开研究应交代版本与引文边界；涉及具体个人的原始登记，属于另一类材料，不能用一个民俗词义替代对原件的核对。'
  ]}]}
 ];
 const byId=Object.fromEntries(questions.map(q=>[q.id,q]));
 const state=()=>typeof S==='object'&&S?S:{};
 const known=()=>state().clueStory?.known||{};
 const privateReady=()=>Boolean(state().flags?.found&&state().puzzle?.adminFate&&known()['dp-cloud-letter']);
 const historyReady=()=>Boolean(privateReady()&&state().flags?.auth&&state().flags?.inner&&state().inquiry?.visited?.shrine);
 function publicDateVisible(value){
  const s=state(),at=s.phoneRuntime?.at;
  const now=Number.isFinite(at)?new Date(at).toISOString().slice(0,19)+'+08:00':`2026-09-${String(s.day||18).padStart(2,'0')}T${s.storyClock||'20:36'}:00+08:00`;
  const published=typeof publicContentTimestamp==='function'?publicContentTimestamp(value):String(value)+'T09:00:00+08:00';
  return Date.parse(published)<=Date.parse(now);
 }
 function installQuestions(){
  const content=window.ZHIHU_CONTENT;
  if(!content||!Array.isArray(content.questions))return;
  const authors={
   'clue-chengyu':{id:'clue-chengyu',name:'程遇',bio:'地方文献整理者，关注拓本、旧刊与城市史。',headline:'地方文献整理者',avatar:'article-library-evening',color:'#677f88'},
   'clue-liangxu':{id:'clue-liangxu',name:'梁序',bio:'民间文书研究，记录材料的年代与出处。',headline:'民间文书研究者',avatar:'article-library-shelf',color:'#9a7e66'}
  };
  content.authors??={};
  if(Array.isArray(content.authors)){for(const author of Object.values(authors))if(!content.authors.some(a=>a.id===author.id))content.authors.push(author)}
  else Object.assign(content.authors,authors);
  for(const question of questions)if(!content.questions.some(q=>q.id===question.id))content.questions.push(question);
 }
 function syncMigration(){
  const s=state();
  if(s.appClueMigration?.version===1)return s.appClueMigration;
  const legacy={};
  if(s.cipher?.read?.['old-lamp']||s.official?.read?.includes('old-lamp')||s.cultHistory?.readChronicle||s.cultHistory?.negativeUnlocked)legacy['old-rubbing-versions']=true;
  if(s.cultHistory?.readChronicle){legacy['qing-ferry-society']=true;legacy['reunion-1926-split']=true}
  if(s.clueStory?.six?.archiveRead||known()['six-selection'])legacy['six-offerings-terms']=true;
  s.appClueMigration={version:1,answersRead:{},legacyKnown:legacy};
  for(const id of Object.keys(legacy))s.appClueMigration.answersRead[byId[id].answers[0].id]={questionId:id,source:'legacy-source'};
  // Existing oldyard-access and already-earned solutions are intentionally kept.
  return s.appClueMigration;
 }
 const priorVisible=window.zhihuQuestionVisible;
 window.zhihuQuestionVisible=function(row){
  const q=byId[row?.id];
  if(!q)return typeof priorVisible==='function'?priorVisible(row):!row?.clue;
  if(q.clue.requires==='history')return historyReady();
  if(q.clue.requires==='private')return privateReady();
  const article=typeof OFFICIAL_CIPHER_META==='object'?OFFICIAL_CIPHER_META['old-lamp']:null;
  return publicDateVisible(article?.createdAt||article?.date||q.date);
 };
 const priorRead=window.zhihuClueRead;
 window.zhihuClueRead=function(question,answer){
  const q=byId[typeof question==='string'?question:question?.id];
  if(!q)return typeof priorRead==='function'?priorRead(question,answer):false;
  const a=q.answers.find(row=>row.id===(typeof answer==='string'?answer:answer?.id));
  if(!a||!window.zhihuQuestionVisible(q))return false;
  const migration=syncMigration();
  if(!migration.answersRead[a.id])migration.answersRead[a.id]={questionId:q.id,at:typeof phoneStamp==='function'?phoneStamp():''};
  if(typeof clueRead==='function')clueRead(q.clue.key,{source:'zhihu',question:q.id,answer:a.id});
  if(typeof persist==='function')persist();
  return true;
 };
 window.appClueMapVisible=function(place){
  const id=typeof place==='string'?place:place?.id;
  return id==='old-children-home'&&Boolean(known()['dp-old-wifi']||known()['dp-cloud-letter']);
 };
 window.appClueMapRead=function(place,section){
  if(section!=='entrance'||!window.appClueMapVisible(place))return false;
  syncMigration();
  if(typeof clueRead==='function')clueRead('oldyard-access',{source:'maps',place:'old-children-home',section:'entrance'});
  if(typeof persist==='function')persist();
  return true;
 };

 const previousArticle=cipherOfficialArticle;
 cipherOfficialArticle=function(id){
  if(id!=='old-lamp')return previousArticle(id);
  syncMigration();cipherRemember(id);
  return '<article class="cipher-official-article" data-cipher-article="old-lamp"><div class="cipher-article-kicker">槐城 / 旧字与旧事</div><h1>旧门上的纸与字</h1><p class="cipher-article-date">程遇 · 2026年9月7日</p><p>最近整理小院门前留下的拓片，最费时间的是辨清纸张和签条各自的来历。门已经修过几次，夹在册页里的纸倒留下了旧时的手迹。</p><p>同一处地方会有不同年代的称呼。同样一张纸，经手人写的背签、藏家后来补的注记，也未必出于同一年。整理时把它们各归其位，旧物的故事才不会被新印本盖过去。</p><p>本文节选自程遇《归亲堂门铭拓本与后印祈词校记》卷首随笔。感谢街坊提供的旧纸与家书。</p><div class="cipher-imprint">作者：程遇 · 槐城地方文献整理组</div></article>';
 };
 if(typeof OFFICIAL_CIPHER_META==='object'&&OFFICIAL_CIPHER_META['old-lamp'])OFFICIAL_CIPHER_META['old-lamp'].title='旧门上的纸与字';

 const previousOldyard=clueOldyard;
 clueOldyard=function(path){
  if(path.endsWith('/access')){
   if(!(known()['dp-old-wifi']||known()['dp-cloud-letter'])||!known()['oldyard-index'])return clueUnavailable();
   clueRead('oldyard-maintenance');
   return clueShell('院门及装卸设施维修记录','<div class="la-archive-document"><div class="la-document-heading"><span class="la-document-year">2019</span><p class="clue-meta">2019年10月12日<br>竣工记录 · 院门及装卸设施</p></div><section class="la-archive-intro"><h2>维修工程摘录</h2><p>本次工程包括院门铰链更换、装卸坡道防滑处理、货梯井口围护和连廊排水修整。竣工后，设施日常养护交由属地社区负责。</p></section><div class="la-table-wrap"><table class="la-access-table"><caption>养护项目与移交事项</caption><thead><tr><th>项目</th><th>竣工处理</th><th>移交事项</th></tr></thead><tbody><tr><td>院门</td><td>更换锈损铰链及门闩</td><td>定期润滑、防锈</td></tr><tr><td>装卸坡道</td><td>铺设防滑面层</td><td>雨后清理积水</td></tr><tr><td>连廊</td><td>修补排水边沟</td><td>保持排水通畅</td></tr></tbody></table></div><p class="la-document-note">本件为工程竣工摘录。场地开放时段与入口使用安排由管理单位另行公布，按现行安排执行。</p><div class="la-related">'+clueLink('返回修缮目录','https://archive.huai.example/oldyard')+'</div></div>','archive');
  }
  const html=previousOldyard(path);
  return path==='/oldyard'?html.replace('机柜号、房间门牌与出入口作业代号分别建档。','机柜原标号与门牌调整列在修缮附表，设施养护按工程另行移交。').replace('2019年院门及装卸通道维修记录','2019年院门及装卸设施维修记录').replace('作业口 / 现用入口 / 通达范围','维修项目 / 竣工处理 / 养护移交'):html;
 };

 function editHTML(html,edit){const template=document.createElement('template');template.innerHTML=html;edit(template.content);return template.innerHTML}
 const previousChronicle=cultHistoryChronicle;
 cultHistoryChronicle=function(){
  syncMigration();
  return editHTML(previousChronicle(),root=>{
   const preface=root.querySelector('.ch-preface .ch-chapter-body');
   if(preface)preface.innerHTML='<p>本卷汇集旧渡、归亲堂与近年互助站留存的散件。文书所用名号依原件保留，后添注记另列；同一名号下的章程变动，不据器物是否沿用而推定。</p>';
   for(const chapter of root.querySelectorAll('.ch-chapter')){
    const time=chapter.querySelector('time')?.textContent||'',body=chapter.querySelector('.ch-chapter-body');
    if(time.startsWith('1866')&&body)body.innerHTML='<p>本年存件为渡费账、代转信目录与手绘渡路。原纸受潮部分另附摹本；存件题名及抄录人依袋签著录。</p><p>研究著录：程遇《槐河义渡与归亲会早期文书》。门铭拓片另见程遇《归亲堂门铭拓本与后印祈词校记》，不与渡簿正文合编。</p>';
    if(time.startsWith('1926')&&body)body.innerHTML='<p>本年会务簿在春祭之后分装两袋。各袋附经手人签条，原底卷留存撤销登记栏，后印抄件缺该栏。</p><p>原合照、席次簿与分册批注按同袋关系收存，另附五月间往来原件。文献研究著录：梁序《民国十五年归亲堂分册考》。</p>';
   }
  });
 };
 const previousNegative=cultHistoryNegative;
 cultHistoryNegative=function(){
  syncMigration();
  return editHTML(previousNegative(),root=>{
   for(const section of root.querySelectorAll('section'))if(section.querySelector('h2')?.textContent==='祈词改样单')section.innerHTML='<time>1926-05-03 · 祈词改样</time><h2>祈词改样单</h2><p>此袋保留改印经手人与收旧纸的签押；拓本及印行纸另依版本单独著录，未随本袋重录。</p><p>书目附记：程遇《归亲堂门铭拓本与后印祈词校记》。新印领用记录见家属服务处原通知。</p>';
  });
 };
 const previousSix=sixArchive;
 sixArchive=function(){
  syncMigration();
  return editHTML(previousSix(),root=>{
   const first=root.querySelector('.ch-six-register .ch-chapter .ch-chapter-body p');
   if(first)first.textContent='本册条文规定：取已过六十的三人作寿殉，取未成年的三人作命殉。三寿留于阴册，三命留于阳册，一阴一阳合成一龛。受祭者不必已经死亡；他们被关在旧堂内，只要还活着，食名母便能借他们的名字不断吞食他们的性命。';
   const article=root.querySelector('.ch-six-register');
   if(article)article.insertAdjacentHTML('beforeend','<p class="ch-source">整理书目：梁序《六殉称谓与后出抄本辨误》。本件为禁传抄本转录，个人名录及装卷条文依所附原件保留。</p>');
  });
 };
 const previousPersist=persist;
 persist=function(){syncMigration();installQuestions();return previousPersist.apply(this,arguments)};
 installQuestions();syncMigration();
})();
