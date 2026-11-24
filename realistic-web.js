/* Ordinary public websites. Investigation forms and access checks stay in their original renderers. */
(()=>{
 if(window.REALISTIC_WEB_VERSION)return;
 window.REALISTIC_WEB_VERSION=1;
 const NEWS='https://news.huai.example', STREET='https://street.huai.example', SERVICE='https://service.huai.example', RECORDS='https://records.guijia.example', PARENTS='https://parents.example';
 const PARKING='https://parking.huai.example/';
 const qinghuaiVisible=()=>typeof parkingCanDiscover==='function'&&parkingCanDiscover('qinghuai');
 const storyVisible=s=>Boolean(s)&&publicContentVisible(s.date)&&(s.id!=='qinghuai-2023'||qinghuaiVisible());
 const link=(label,url,cls='')=>`<button class="${cls}" data-a="url" data-url="${E(url)}">${label}</button>`;
 const parse=html=>{const t=document.createElement('template');t.innerHTML=html;return t};
 const avatarPeople={'榆树阿诚':6,'等灯的人':7};
 const avatarPortraits={'小陆':'feed-avatar-xiaolu','石榴':'feed-avatar-shiliu','小周五金':'feed-avatar-xiaozhou','巷口阿姨':'feed-avatar-aunt','骑慢一点':'feed-avatar-slowride','柳树巷':'feed-avatar-liushuxiang','慢慢来':'feed-avatar-manman'};
 const avatarObjects={'早八选手':0,'纸风车':1,'夜雨':2,'东楼邻居':3,'小满':4};
 const avatar=(label='用户头像',cls='')=>{
  let name=String(label).replace(/(?:的)?头像$/,'').split('·')[0].trim();
  if(name==='阿诚')name='榆树阿诚';
  let file='people-real',size='300% 300%',position;
  if(Object.hasOwn(avatarPortraits,name)){file=avatarPortraits[name];size='cover';position='center'}
  else if(Object.hasOwn(avatarPeople,name)){const slot=avatarPeople[name];position=`${slot%3*50}% ${Math.floor(slot/3)*50}%`}
  else if(Object.hasOwn(avatarObjects,name)){const slot=avatarObjects[name];file='avatars';size='300% 200%';position=`${slot%3*50}% ${Math.floor(slot/3)*100}%`}
  else if(name==='河边散步'||cls==='is-landscape'){file='sea';size='cover';position='center'}
  else position=cls==='is-alt'?'50% 100%':'0% 100%';
  return `<span class="rw-avatar ${cls}" data-avatar-author="${E(name)}" role="img" aria-label="${E(name)}的头像" style="background-image:url('${asset(file)}');background-size:${size};background-position:${position}"></span>`;
 };
 const stories=[
  {id:'community-0917',section:'local',tag:'本地',date:'2026-09-17 08:30',title:'社区服务窗口延时一小时，方便居民下班后来咨询',summary:'榆树路社区本周增设傍晚咨询时段，由工作人员轮班值守，方便上班族和有需要的居民就近办事。',byline:'记者 沈青',photo:true,caption:'社区公共服务空间。槐城日报资料图片',body:[
   '本报讯　从本周起，榆树路社区服务窗口将工作日的咨询时间延长至18时，方便白天不便前来的居民办理资料查阅、设施报修等事项。线上资料页全天可访问。',
   '下午五点多，服务大厅里的灯亮着。刚下班的居民带着材料前来咨询，等候区也有几位老人坐着休息。工作人员把常用表格和老花镜放在桌边，遇到不熟悉手机操作的居民，会逐项说明办理方式。',
   '延时服务采取轮班值守。窗口继续提供公共资料查阅、设施报修和日常便民咨询，对需要其他部门办理的事项，会告知受理范围和办理地点。暂时无法当场处理的问题，可留下登记，待相关人员上班后再行核实。',
   '社区负责人介绍，此前有居民反映，下班后常赶不上窗口开放时间。社区将统计傍晚来访人数，并据此调整值班安排。'
  ],source:{label:'槐城社区服务 · 公开资料',url:SERVICE+'/'},related:['missing-0814','qinghuai-2023']},
  {id:'missing-0814',section:'public',tag:'公益',date:'2026-08-14 10:20',title:'槐城一名11岁女孩失联，家属征集校门周边线索',summary:'林小禾于8月13日放学后与家人失去联系。家属希望获得当天下午校门及附近道路的原始影像。',byline:'记者 林岑',photo:false,body:[
   '本报讯　8月14日上午，槐城区居民林先生向本报反映，11岁的女儿林小禾于前一天下午放学后失联。家属已报警，目前继续寻找。',
   '据家属提供的信息，小禾最后一次被确认见到是在8月13日17时40分左右，地点为学校东门附近。她当天穿奶白色外套，里面是灰绿色上衣。家属已向办案人员提供近期生活照片。',
   '家属正在征集8月13日放学时段，学校东门及附近道路的车辆和行人记录。若居民或沿街商铺保存了相关影像，请保留原始文件、设备编号和完整时段，避免反复转发后丢失拍摄信息。',
   '截至发稿，女孩离开校门后的去向正在核查。网上几条疑似目击消息，正在逐一查证。',
   '家属表示，希望知情者直接向警方提供原始记录，不要传播未经确认的行踪或个人信息。本报将持续关注事件进展。'
  ],source:{label:'相关公开记录：榆树路站棚寻物帖',url:STREET+'/posts/0813'},related:['community-0917','qinghuai-2023']},
  {id:'qinghuai-2023',section:'depth',tag:'深读',date:'2023-11-03 09:05',title:'青槐陪伴室原址封存，历史服务台账另行承接',summary:'旧儿童院东楼停止对外使用，历史委托转介台账移交归家家庭服务中心保管。',byline:'记者 林岑',photo:false,body:[
   '本报讯　槐城区社区服务档案于11月2日发布场地移交公告：青槐陪伴室原址，即旧儿童院东楼，停止对外使用。原址不再接收未成年人，也不设夜间接待人员。',
   '根据公告，原“青槐家庭陪伴服务部”的委托转介台账，由归家家庭服务中心保管并受理查阅。资料移交后，台账沿用原机构名称，原址停止服务。',
   '旧称与车牌备案暂不变更。对于旧资料中沿用的编号、车辆号牌和接收日期，公告要求保留原始记载，以便家属申请核查时能够逐项对应。',
   '办理过委托转介的家属，可凭受理编号向资料承接方申请查阅。台账保存的是当年的交接情况，后续去向需要另行联系查证。',
   '具体查阅范围及办理方式见社区服务网站发布的场地移交公告。'
  ],source:{label:'原始公告：场地移交公告〔2023〕37号',url:SERVICE+'/notice/37'},related:['missing-0814','community-0917']}
 ];
 const storyURL=id=>NEWS+'/article/'+id;
 const inlineLink=(label,url)=>`<a class="rw-inline-link" href="${E(url)}" data-a="url" data-url="${E(url)}">${E(label)}</a>`;
 const readerComments={
  'community-0917':[
   {name:'柳树巷',date:'9月17日 09:14',text:'以前五点下班总赶不上，这个时间方便多了。'},
   {name:'阿诚',date:'9月17日 12:06',text:'我们店旁边那台旧设备坏过一回。设备报修这边也能问吗？'},
   {name:'小满',date:'9月17日 18:22',text:'今天去办了，材料带齐的话很快。'}
  ],
  'missing-0814':[
   {name:'小陆',date:'8月14日 11:03',text:'昨天放学正好经过，已经回去翻行车记录仪了。希望孩子平安。'},
   {name:'石榴',date:'8月14日 13:11',text:'已经转到家长群。别在评论区发孩子和家人的电话了。'},
   {name:'巷口阿姨',date:'8月15日 07:39',text:'今早买菜还看见她爸爸在问，希望快点有消息。'},
   {name:'榆树阿诚',date:'9月18日 16:02',text:`朋友今天把这条旧报道转给我，我才知道孩子还没找到。我8月份在槐城街坊发过${inlineLink('找蓝鲸鱼玩具的帖子',STREET+'/posts/0813')}。当时只交过一张局部截图，没拍清脸。我正在翻店里的旧资料，不确定是不是同一个孩子。`}
  ],
  'qinghuai-2023':[
   {name:'东楼邻居',date:'2023年11月3日 10:18',text:'门锁了有一阵子了，终于看到正式公告。'},
   {name:'慢慢来',date:'2023年11月3日 16:40',text:`我们以前在那边填过表，打电话才知道是资料换地方了。槐城社区服务网站留着《场地移交公告〔2023〕37号》，以前在那儿办过事的，可以看看。`},
   {name:'河边散步',date:'2023年11月4日 08:26',text:'希望旧楼以后能修一修，雨天屋檐一直往下掉水。'}
  ]
 };
 const newsComments=id=>{const comments=(readerComments[id]||[]).filter(c=>publicContentVisible(c.date));return `<section class="rw-news-comments"><h2>读者留言 <span>${comments.length}</span></h2>${comments.map((c,i)=>`<article class="rw-reader-comment">${avatar(c.name+'的头像',i%2?'':'is-landscape')}<div><b>${c.name}</b><time>${publicContentDate(c.date)}</time><p>${c.text}</p></div></article>`).join('')}<p class="rw-comment-status">该报道的留言已关闭。</p></section>`};
 const paperHeader=section=>`<header class="rw-paper-head"><div class="rw-paper-mast">${link('<strong>槐城日报</strong><span>记录这座城的每一天</span>',NEWS+'/','rw-paper-brand')}${link('检索','https://search.example/?q='+encodeURIComponent('槐城日报')+'&view=news','rw-paper-search')}</div><nav aria-label="新闻栏目">${[['','首页'],['local','本地'],['depth','深读'],['public','公益']].map(([id,title])=>link(title,NEWS+(id?'/section/'+id:'/'),id===section?'is-current':'')).join('')}</nav></header>`;
 const paperFooter=()=>`<footer class="rw-paper-footer"><b>槐城日报</b><span>关注街巷，也关注每一个人。</span><div>${link('关于我们',NEWS+'/about')}${link('返回首页',NEWS+'/')}</div><small>© 2026 槐城日报编辑部</small></footer>`;
 const storyCard=(s,lead=false)=>link(`${lead&&s.photo?`<img src="${asset('news-community')}" alt="社区服务窗口">`:''}<div><span class="rw-news-category">${s.tag}</span><h2>${s.title}</h2>${lead?`<p>${s.summary}</p>`:''}<small>槐城日报 · ${s.date.slice(0,10)}</small></div>`,storyURL(s.id),'rw-news-card'+(lead?' is-lead':''));
 function paperPage(u){
  const section=u.pathname.startsWith('/section/')?u.pathname.split('/')[2]:'';
  if(u.pathname==='/about')return `<div class="rw-paper">${paperHeader('')}<article class="rw-news-article"><div class="rw-news-breadcrumb">关于我们</div><h1>记录身边发生的事</h1><p>槐城日报报道本地新闻、公共服务和家庭生活，接受读者来稿与新闻线索。</p><p>网站保留历史报道，机构地址、服务安排如有调整，请查询最新通知。</p><p>寻人报道须经登记家属同意。未经核实的行踪、住址和私人联系方式不予刊登。</p></article>${paperFooter()}</div>`;
  if(u.pathname.startsWith('/article/')){
   const s=stories.find(x=>x.id===u.pathname.split('/')[2]);
   if(!storyVisible(s))return `<div class="rw-paper">${paperHeader('')}<article class="rw-news-article"><h1>报道未找到</h1>${link('返回新闻首页',NEWS+'/','rw-text-link')}</article>${paperFooter()}</div>`;
   return `<div class="rw-paper">${paperHeader(s.section)}<article class="rw-news-article"><div class="rw-news-breadcrumb">${link('首页',NEWS+'/')}<span>／</span>${link(s.tag,NEWS+'/section/'+s.section)}</div><h1>${s.title}</h1><div class="rw-news-byline"><span>槐城日报 · ${s.tag}</span><time>${s.date}</time></div><p class="rw-news-deck">${s.summary}</p>${s.photo?`<figure><img src="${asset('news-community')}" alt="社区公共服务空间"><figcaption>${s.caption}</figcaption></figure>`:''}${s.body.map(p=>`<p>${p}</p>`).join('')}<div class="rw-news-credit"><span>${s.byline}</span><span>编辑：陆遥　校对：方宁</span><span>来源：槐城日报　未经许可请勿转载</span></div></article>${newsComments(s.id)}<section class="rw-news-related"><h2>相关阅读</h2>${s.related.map(id=>stories.find(x=>x.id===id)).filter(storyVisible).map(s=>storyCard(s)).join('')}</section>${paperFooter()}</div>`;
  }
  const title={local:'本地',depth:'深读',public:'公益'}[section];
  const list=stories.filter(s=>storyVisible(s)&&(!section||s.section===section));
  return `<div class="rw-paper">${paperHeader(section)}<div class="rw-paper-date"><span>槐城 · 城市新闻</span><time>2026年${E(storyDate())}</time></div><main class="rw-news-home">${title?`<h1 class="rw-section-title">${title}</h1>`:''}${list.map((s,i)=>storyCard(s,i===0)).join('')}</main>${paperFooter()}</div>`;
 }
 const siteDirectories=[
  {name:'槐城街坊',aliases:['槐城街坊','街坊论坛','槐城街坊论坛'],url:STREET+'/',description:'槐城本地生活社区。邻里闲聊、失物招领、问路和生活服务。'},
  {name:'槐城日报',aliases:['槐城日报'],url:NEWS+'/',description:'槐城日报官方网站，本地新闻、城市生活与公共事务报道。'},
  {name:'槐城社区服务',aliases:['槐城社区服务','槐城区社区服务','槐城公共服务'],url:SERVICE+'/',description:'社区公共资料、便民设施服务与场地公告查询。'},
  {name:'归家寻亲',aliases:['归家寻亲','归家','归家家庭服务中心','归家互助会'],url:BASE+'/',description:'失联亲属信息登记、线索核实与家庭服务。'},
  {name:'家长之间',aliases:['家长之间','家长之间论坛'],url:PARENTS+'/',description:'关于孩子、家庭和日常生活的交流社区。'},
  {name:'归家资料服务',aliases:['归家资料服务','归家资料'],url:RECORDS+'/',description:'委托转介记录与历史服务资料查阅。'},
  {name:'榆树路便民停车',aliases:['榆树路便民停车','槐城停车','停车官网'],url:PARKING,description:'榆树路便民停车官方网站，临停记录、停车账单与车辆资料服务。'}
 ];
 const normalizeQuery=q=>String(q||'').normalize('NFKC').toLowerCase().replace(/[\s，。？?！!·]/g,'');
 const directSite=q=>{
  const value=normalizeQuery(q).replace(/(?:官方网站|官方网站首页|官网首页|官方网站入口|官网|网站首页|首页|网站)$/,'');
  return siteDirectories.find(site=>site.aliases.some(alias=>normalizeQuery(alias)===value)||new URL(site.url).hostname===value);
 };
 function searchDocuments(q){
  const query=normalizeQuery(q),rows=[];
  if(!query)return rows;
  const exact=directSite(q);
  if(exact)return [{title:exact.name+' · 官方网站',url:exact.url,desc:exact.description,kind:'web',score:100}];
  const named=siteDirectories.find(site=>site.aliases.filter(alias=>alias.length>2).some(alias=>query.includes(normalizeQuery(alias))));
  const restriction=named&&!['归家寻亲','归家资料服务'].includes(named.name)?new URL(named.url).hostname:null;
  const add=(title,url,desc,kind,score)=>{if(score>0&&(!restriction||new URL(url).hostname===restriction))rows.push({title,url,desc,kind,score})};
  const has=pattern=>pattern.test(query);
  const whale=has(/蓝色?鲸(?:鱼)?|鲸鱼玩具|那只鲸/);
  const institution=has(/寻亲机构|寻人机构|寻亲平台|寻人平台|线上登记|网上登记|公益平台|归家|寻找.*(?:女儿|孩子)|找.*(?:女儿|孩子).*(?:机构|平台)/);
  const missing=has(/林小禾|小禾|11岁.*(?:失联|失踪)|(?:女孩|女儿|孩子).*(?:失联|失踪)|失联女孩|失踪女孩|校门.*线索/);
  const oldPlace=has(/青槐|旧儿童院|陪伴室|东楼封存/);
  const maintenance=has(/ys[-_]?02|校时|录像.*维修|设备.*维修|维修.*站棚/);
  const parking=has(/临停|临时停车|停车登记|小周五金/);
  const returned=S.flags.found&&has(/孩子.*回来|回来.*孩子|女儿.*回来|回来.*女儿|性格|记忆|不像|不对劲/);
  if(institution){add('归家寻亲 — 线上登记与家属服务',BASE+'/',siteDirectories[3].description,'web',80);if(has(/登记|流程|机构/))add('寻人登记与线索核实流程',BASE+'/help','归家家庭服务中心 · 了解登记范围、材料要求和线索核实方式。','web',65)}
  if(whale)add('那只蓝鲸鱼，后来有人来拿吗',STREET+'/posts/0813','槐城街坊 · 榆树阿诚 · 2026-08-13。榆树路店主发布的寻物帖子。','web',95);
  if(parking)add('榆树路便民停车 · 官方网站',PARKING,'停车账单、临停记录与车辆资料服务。','web',90);
  if(oldPlace&&qinghuaiVisible()){add('青槐陪伴室停止对外使用的公告',SERVICE+'/notice/37','槐城区社区服务档案 · 2023年场地移交公告。','web',85);add(stories[2].title,storyURL('qinghuai-2023'),stories[2].summary,'news',70)}
  if(missing)add(stories[1].title,storyURL('missing-0814'),stories[1].summary,'news',90);
  if(returned)add('孩子回来之后，还有人在继续找吗？',PARENTS+'/thread/1182','家长之间 · 等灯的人 · 2024-11-08。一位家长关于重逢之后生活的帖子。','web',90);
  if(has(/服务窗口|延时|社区.*办事|下班.*咨询/))add(stories[0].title,storyURL('community-0917'),stories[0].summary,'news',90);
  if(has(/台账|转介记录|接收记录|档案查阅/)&&!whale&&!maintenance&&!parking)add('归家资料服务',RECORDS+'/',siteDirectories[5].description,'web',75);
  if(has(/榆树路/)&&!whale&&!maintenance&&!parking&&!oldPlace)add('榆树路邻里讨论 · 槐城街坊',STREET+'/category/neighborhood','附近店铺、邻里闲聊、失物招领与生活问答。','web',70);
  if(has(/街坊|论坛|社区生活|邻里|失物招领|寻物/)&&!whale&&!parking)add('槐城街坊 · 本地生活社区',STREET+'/',siteDirectories[0].description,'web',60);
  if(has(/新闻|本地报道|城市报道|日报/)&&!missing&&!oldPlace&&!whale&&!maintenance&&!parking){add('槐城日报',NEWS+'/',siteDirectories[1].description,'news',70);if(!named||new URL(named.url).hostname===new URL(NEWS).hostname)add(stories[0].title,storyURL('community-0917'),stories[0].summary,'news',50)}
  if(query==='槐城'){for(const site of siteDirectories.slice(0,3))add(site.name,site.url,site.description,'web',45)}
  if(named&&!rows.length)add(named.name+' · 官方网站',named.url,named.description,'web',40);
  if(!rows.length&&has(/寻亲|寻人|失联|失踪|公益/))add('归家寻亲',BASE+'/',siteDirectories[3].description,'web',40);
  const seen=new Set();
  return rows.sort((a,b)=>b.score-a.score).filter(row=>{const article=stories.find(s=>storyURL(s.id)===row.url);if(article&&!storyVisible(article)||seen.has(row.url))return false;seen.add(row.url);return true}).slice(0,5);
 }
 function realSearch(q,view='all'){
  const all=searchDocuments(q),exact=directSite(q);
  const rows=exact?all:all.filter(row=>view==='all'||(view==='news'?row.kind==='news':row.kind!=='news'));
  return `<div class="web-search-engine rw-search"><form data-form="web-global"><span>搜索</span><input aria-label="搜索网页" value="${E(q)}" placeholder="搜索或输入网址"><button aria-label="搜索">${ico('search')}</button></form><nav>${[['all','全部'],['web','网页'],['news','资讯']].map(([id,label])=>link(label,'https://search.example/?q='+encodeURIComponent(q)+(id==='all'?'':'&view='+id),view===id?'is-current':'')).join('')}</nav>${q?`<div class="rw-search-summary">${rows.length?'找到 '+rows.length+' 条相关内容':'搜索结果'}<span>网页与公开资料</span></div>`:''}${rows.map(row=>`<button class="engine-result ${row.kind==='news'?'rw-search-news':''}" data-a="url" data-url="${E(row.url)}"><small>${E(realismLinkBrand(row.url))} · ${E(new URL(row.url).hostname)}</small><h2>${E(row.title)}</h2><p>${E(row.desc)}</p></button>`).join('')||(!q?`<div class="search-blank">${ico('search')}<p>搜索网页、资讯及更多内容</p><div class="rw-search-quick">${link('槐城日报',NEWS+'/')}${link('公共服务',SERVICE+'/')}</div></div>`:'<p class="native-empty">没有找到相关结果</p>')}</div>`;
 }
 searchPage=q=>realSearch(q);
 webHeader=()=>`<header class="rw-public-head"><div class="site-nav"><button class="site-brand" data-a="url" data-url="${BASE}/"><span class="rw-home-wordmark">归家</span><span><strong>归家寻亲</strong><small>家庭陪伴与信息服务</small></span></button><button class="rw-menu-button" data-a="site-menu" aria-label="导航菜单">菜单</button></div><nav class="site-menubar" aria-label="网站导航">${wlink('首页','/')}${wlink('寻亲登记','/register')}${wlink('家属中心','/family')}${wlink('帮助','/help')}</nav></header>`;
 webFooter=()=>`<footer class="site-footer rw-public-footer"><strong>归家寻亲</strong><p>线索核实 · 家庭陪伴 · 资料服务</p><div>${wlink('关于我们','/about')}${wlink('个人信息处理规则','/privacy')}${wlink('联系我们','/contact')}</div><small>© 2026 归家家庭服务中心</small><span>服务时间　09:00—22:00</span></footer>`;
 function publicArticle(path){
  const body=path==='/about'?`<div class="rw-public-eyebrow">关于我们</div><h1>寻亲登记与家属服务</h1><p class="rw-public-lead">归家是一项面向失联者家庭的陪伴与信息服务计划。</p><h2>我们提供的服务</h2><p>登记家属提供的基本情况，协助整理照片与线索，并将需要核实的信息转交相应工作人员。寻找期间，家属可以在平台查看登记进展和已提交的资料。</p><div class="rw-public-values"><section><b>信息登记</b><p>保留原始描述与受理编号。</p></section><section><b>线索核实</b><p>记录来源，逐项核对。</p></section><section><b>家庭陪伴</b><p>从寻找、核实到后续归档。</p></section></div><h2>持续的家庭陪伴</h2><p>寻找期间，工作人员会持续联系登记家属，转告新线索，并协助整理需要补充的资料。</p><div class="rw-public-related">${wlink('了解服务流程','/help')}${wlink('个人信息处理规则','/privacy')}</div>`:path==='/volunteers'?`<div class="rw-public-eyebrow">服务动态</div><h1>近期志愿者服务安排</h1><div class="rw-public-meta"><time>2026-09-17</time><span>归家家庭服务中心</span></div><p>本周将继续开展资料核对与家庭回访。已接受服务的家属，请留意对应工作人员的消息。</p><h2>本周线上服务</h2><table class="record-table"><tr><th>资料整理</th><td>核对登记信息与原始附件</td></tr><tr><th>家庭回访</th><td>由对应工作人员逐户联系</td></tr><tr><th>服务时间</th><td>每日 09:00—22:00</td></tr></table><p>回访以线上方式进行，无需外出。个人资料与寻亲线索请通过对应家庭的服务页面提交，不在公开留言中展示。</p><div class="rw-public-related">${wlink('家属中心','/family')}${wlink('联系我们','/contact')}</div>`:`<div class="rw-public-eyebrow">服务指南</div><h1>寻人登记与线索核实</h1><p class="rw-public-lead">妥善保留原始资料，是后续核对的基础。</p><section class="rw-help-section"><h2>提交寻亲登记</h2><p>填写失联者的基本信息、失联经过与家属联系方式，提交后保留受理编号。照片应尽量清晰，并保留未经修改的原始文件。</p>${wlink('在线登记','/register','web-primary')}</section><section class="rw-help-section"><h2>查询与补充资料</h2><p>可通过姓名或受理编号查询登记。后续获得的线索、照片与核对意见，提交至对应家庭的服务记录。</p>${wlink('查询登记','/search','web-text-link')}</section><section class="rw-help-section"><h2>核实疑似线索</h2><p>收到疑似线索后，请保留原始照片及提供者的联系方式。衣着、时间等情况如有出入，请如实告知工作人员；身份由办案人员进一步核实。</p></section><section class="rw-help-section"><h2>防范诈骗与信息泄露</h2><p>不向陌生人转账，不将身份资料发送给无关人员。公开展示的内容，应避免包含家庭住址与完整联系方式。</p></section><section class="rw-help-section"><h2>个人资料查阅</h2><p>登记家属可以按照个人信息处理规则，申请查阅、更正或获取自己的资料副本。</p>${wlink('个人信息处理规则','/privacy','web-text-link')}</section>`;
  return webHeader()+`<article class="web-pad rw-public-article">${body}</article>`+webFooter();
 }
 const streetCategories={all:'全部',life:'邻里生活',lost:'失物招领',service:'便民问答',neighborhood:'榆树路'};
 const streetTopics=[
  {id:'breakfast-hours',category:'service',area:'榆树路',title:'巷口那家包子铺现在几点开门？',author:'早八选手',date:'2026-09-18 07:22',replies:3,excerpt:'搬过来后第一次赶早班，想买完早饭再去车站。',body:['最近换了上班的地方，出门比以前早一个小时。巷口挂蓝色招牌的包子铺，六点半能买到吗？','昨天晚上路过已经关门了，没看清门口的营业时间。'],comments:[['巷口阿姨','六点就开了。豆浆要等到六点十分左右。'],['早八选手','太好了，谢谢！'],['纸风车','周一休息，别白跑。']]},
  {id:'rainy-roof',category:'life',area:'榆树路',title:'这两天又下雨，阳台的衣服一直没干',author:'纸风车',date:'2026-09-17 20:46',replies:2,excerpt:'昨天洗的床单，今天摸起来比昨天还潮。',body:['天气预报说停雨，我就把床单洗了。现在整个阳台都挂满了，晚上走过去像钻帐篷。','有没有附近的烘衣店？家里的烘干机今天偏偏罢工。'],comments:[['早八选手','东边路口洗衣店能单独烘，按袋算。'],['纸风车','明天拿过去问问。']]},
  {id:'keys-0915',category:'lost',area:'东城街道',title:'捡到一串带红绳的钥匙',author:'河边散步',date:'2026-09-15 18:04',replies:2,excerpt:'在东城菜场南门捡到，已放到入口值班室。',body:['下午买菜时捡到的，三把钥匙，一根褪色的红绳。已经交给菜场南门值班室。','认领时跟师傅说一下钥匙扣上还有什么就行，不用在帖子里留电话。'],comments:[['石榴','我转到菜场群里了。'],['河边散步','失主刚刚拿回去了，谢谢大家。']]},
  {id:'basket-noise',category:'life',area:'榆树路',title:'自行车一过减速带就响，有人知道怎么弄吗',author:'骑慢一点',date:'2026-09-12 09:08',replies:2,excerpt:'轮子看着没问题，骑平路也不响。',body:['车骑了两年，最近一过减速带前面就哐啷一下。我把车锁拿下来了，还是响。','不是很想自己拆车，怕拆完剩零件。'],comments:[['阿诚','先看看车筐下面那两颗螺丝，我的也松过。'],['骑慢一点','居然就是车筐，谢谢，差点换了整个前轮。']]},
  {id:'lamp-repair',category:'service',area:'榆树路',title:'榆树路路灯已经修好了',author:'巷口阿姨',date:'2026-08-29 19:36',replies:1,excerpt:'昨晚经过还是黑的，今晚散步的时候亮起来了。',body:['站口往巷子里走的第二盏，今天已经亮了。晚上带孩子走那边能看清台阶了。','谢谢前两天帮忙报修的邻居。'],comments:[['小满','刚路过看到了，修得挺快。']]},
  {id:'0813',category:'lost',area:'榆树路',title:'那只蓝鲸鱼，后来有人来拿吗',author:'榆树阿诚',date:'2026-08-13 21:09',replies:3,excerpt:'收摊前在站棚下面看到的，想问问有没有附近的人认识。',keywords:'蓝色鲸鱼 玩具 小姑娘 浅色外套 站棚 白车'},
  {id:'balcony-plants',category:'life',area:'城南',title:'薄荷是不是怎么养都能活',author:'慢慢来',date:'2026-08-11 16:23',replies:2,excerpt:'朋友给了一盆，三天过去已经不太精神了。',body:['朋友说薄荷很好养，结果我接回家三天，它就开始往一边歪。','一天浇一次水是不是太多了？阳台下午会晒到太阳。'],comments:[['纸风车','土还湿就别浇，我之前也是浇多了。'],['慢慢来','难怪，今天先不浇了。']]}
 ];
 streetTopics.push({id:'parking-service',category:'service',area:'槐城',title:'临停账单现在可以在官网查了',author:'小周五金',date:'2026-09-16 10:12',replies:0,excerpt:'榆树路便民停车网站已开通，临停账单不用再跑到值班亭问了。',body:['前几天去补打临停账单，值班师傅给我看了新开的“榆树路便民停车”网站，现在自己在上面就能查。','我查的是自己的缴费单。师傅那里还另有一份车辆登记，要登录值班账户才看得到。'],comments:[]});
 const streetSearchForm=q=>`<form class="rw-street-search" data-form="rw-street-search"><input name="q" aria-label="搜索街坊帖子" placeholder="搜索帖子、地点、街坊" value="${E(q||'')}" autocomplete="off"><button type="submit">搜索</button></form>`;
 const streetHeader=(active='all',q='')=>`<header class="rw-civic-header rw-street-header"><div><span class="rw-civic-eyebrow">HUAI COMMUNITY</span>${link('<strong>槐城街坊</strong>',STREET+'/','rw-civic-brand')}<small>附近的人，身边的事</small></div>${streetSearchForm(q)}<nav aria-label="街坊分类">${Object.entries(streetCategories).filter(([id])=>id!=='neighborhood').map(([id,label])=>link(label,id==='all'?STREET+'/':STREET+'/category/'+id,id===active?'is-current':'')).join('')}</nav></header>`;
 const streetFooter=()=>`<footer class="rw-civic-footer rw-street-footer"><b>槐城街坊</b><p>分享生活，也请尊重彼此的隐私。</p><div>${link('社区首页',STREET+'/')}${link('社区公约',STREET+'/about')}</div><small>© 2026 槐城街坊</small></footer>`;
 const streetTopicCard=topic=>link(`<div class="rw-street-list-meta"><span>${streetCategories[topic.category]}</span><span>${topic.area}</span></div><h2>${topic.title}</h2><p>${topic.excerpt}</p><div class="rw-street-list-byline"><span>${topic.author} · ${topic.date.slice(5,10).replace('-','月')}日</span><span>${topic.replies} 回复</span></div>`,topic.url||STREET+'/posts/'+topic.id,'rw-street-topic');
 function streetList(u){
  const category=u.pathname.startsWith('/category/')?u.pathname.split('/')[2]:'all';
  const searching=u.pathname==='/search',q=searching?(u.searchParams.get('q')||''):'';
  const needles=String(q).normalize('NFKC').toLowerCase().split(/\s+/).filter(Boolean);
  const list=streetTopics.filter(topic=>{if(!publicContentVisible(topic.date))return false;
   if(!searching&&category!=='all'&&(category==='neighborhood'?topic.area!=='榆树路':topic.category!==category))return false;
   const text=normalizeQuery([topic.title,topic.author,topic.area,topic.excerpt,topic.keywords,streetCategories[topic.category],...(topic.body||[])].join(' '));
   return needles.every(word=>text.includes(normalizeQuery(word))||(/蓝鲸鱼|鲸鱼|鲸/.test(word)&&/蓝.*鲸/.test(text)));
  });
  const title=searching?'搜索结果':category==='all'?'最近讨论':streetCategories[category]||'最近讨论';
  return `<div class="inquiry-site rw-inquiry rw-street rw-street-directory">${streetHeader(category,q)}<main class="rw-street-list"><div class="rw-street-list-heading"><h1>${title}</h1><span>${searching?list.length+' 条结果':'按发表时间'}</span></div>${searching?`<p class="rw-street-query">“${E(q)}”</p>`:''}${list.map(streetTopicCard).join('')||'<p class="rw-street-empty">没有找到相关帖子。</p>'}</main>${streetFooter()}</div>`;
 }
 function streetEverydayPost(id){
  const topic=streetTopics.find(item=>item.id===id);if(!topic||!publicContentVisible(topic.date))return null;
  return `<div class="inquiry-site rw-inquiry rw-street">${streetHeader(topic.category)}<article><div class="inquiry-kicker">${inlineLink(streetCategories[topic.category],STREET+'/category/'+topic.category)} / ${E(topic.area)}</div><h1>${E(topic.title)}</h1><p class="inquiry-byline rw-author-line">${avatar(topic.author+'的头像','is-landscape')}${E(topic.author)} · ${E(topic.date)}</p>${topic.body.map(paragraph=>`<p>${E(paragraph)}</p>`).join('')}<h2 class="rw-comments-title">全部回复 <span>${topic.comments.filter((c,i)=>publicContentVisible(publicContentAfter(topic.date,11*(i+1)))).length}</span></h2>${topic.comments.map(([name,text],i)=>({name,text,at:publicContentAfter(topic.date,11*(i+1))})).filter(c=>publicContentVisible(c.at)).map(({name,text,at},i)=>`<div class="inquiry-comment rw-street-comment"><b>${avatar(name+'的头像',i?'':'is-landscape')}${E(name)}</b><time>${publicContentDate(at)}</time><p>${E(text)}</p></div>`).join('')}<p class="rw-comment-status">当前帖子已关闭回复。</p></article>${streetFooter()}</div>`;
 }
 document.addEventListener('submit',event=>{
  const form=event.target;if(!(form instanceof HTMLFormElement)||form.dataset.form!=='rw-street-search')return;
  event.preventDefault();event.stopImmediatePropagation();
  const q=String(new FormData(form).get('q')||'').trim();browse(STREET+'/search?q='+encodeURIComponent(q));
 },true);
 const civicHeader=(kind,name)=>{
  const street=kind==='street',records=kind==='records',base=street?STREET:records?RECORDS:SERVICE;
  if(street)return streetHeader();
  return `<header class="rw-civic-header"><div><span class="rw-civic-eyebrow">${street?'HUAI COMMUNITY':records?'FAMILY RECORDS':'COMMUNITY SERVICE'}</span>${link(`<strong>${street?'槐城街坊':records?'归家资料服务':'槐城社区服务'}</strong>`,base+'/','rw-civic-brand')}<small>${street?'分享身边事，留下生活的记录':records?'委托转介 · 历史档案查阅':'公开资料与便民设施档案'}</small></div><nav>${street?link('街坊首页',STREET+'/')+link('榆树路',STREET+'/posts/0813'):records?link('记录查阅',RECORDS+'/intake')+link('家属服务',BASE+'/family'):link('公开资料',SERVICE+'/')+(qinghuaiVisible()?link('场地公告',SERVICE+'/notice/37'):'')}</nav></header>`;
 };
 const oldShell=inquiryShell;
 inquiryShell=function(name,body,type='civic'){
  const kind=/街坊|小周/.test(name)?'street':/归家|家庭资料/.test(name)?'records':'civic';
  const doc=parse(oldShell(name,body,type)),root=doc.content.querySelector('.inquiry-site');
  if(!root)return oldShell(name,body,type);
  root.classList.add('rw-inquiry','rw-'+kind);root.dataset.publicSite=kind;
  root.querySelector(':scope > header').outerHTML=civicHeader(kind,name);
  const article=root.querySelector('article');
  if(article){
   if(kind==='street'){
    const heading=article.querySelector('h1')?.textContent||'';
    if(heading.includes('蓝鲸鱼')){
     // The original witness could identify neither the child nor the vehicle.
     const replies=[...article.querySelectorAll('.inquiry-comment')];
     for(const reply of replies){
      const author=reply.querySelector('b');
      if(author?.textContent.includes('小周五金')){
       author.textContent='小周五金 · 9月18日 16:44';
       reply.querySelector('p').textContent='阿诚下午来店里问过了。门前那排车位现在归榆树路便民停车管，我白班帮过几回忙，旧登记册还留在值班亭。';reply.querySelector('.inquiry-link')?.remove();
      }
      if(author?.textContent.includes('榆树阿诚')){
       author.textContent='榆树阿诚 · 8月14日 09:20';
       reply.querySelector('p').textContent='昨天民警来问，我交了一张截下来的图。脸和车牌都没拍清，这里只放背面。有人认得这孩子的话，麻烦说一声。';
      }
     }
     const originalReply=replies.find(reply=>reply.querySelector('b')?.textContent.includes('8月14日'));
     if(originalReply&&replies[0]!==originalReply)article.insertBefore(originalReply,replies[0]);
    }
    for(const button of article.querySelectorAll('.inquiry-comment .inquiry-link')){
     const a=document.createElement('a');a.className='rw-inline-link';a.href=button.dataset.url;a.dataset.a='url';a.dataset.url=button.dataset.url;a.textContent=button.textContent;
     const paragraph=button.previousElementSibling?.tagName==='P'?button.previousElementSibling:null;
     if(paragraph){paragraph.append(' ',a);button.remove()}else button.replaceWith(a);
    }
   }
   const byline=article.querySelector('.inquiry-byline');
   if(kind==='street'&&byline){const author=byline.textContent.includes('榆树阿诚')?'榆树阿诚':name.includes('小周')?'小周五金':byline.textContent.split('·')[0].trim();byline.classList.add('rw-author-line');byline.insertAdjacentHTML('afterbegin',avatar(author))}
   if(!byline&&kind==='civic')article.querySelector('h1')?.insertAdjacentHTML('afterend','<div class="rw-civic-meta">发布单位：社区公共服务资料室<span>公开查阅</span></div>');
   article.querySelectorAll('.inquiry-comment').forEach(el=>{
    el.classList.add('rw-street-comment');const author=el.querySelector('b');if(!author)return;
    const parts=author.textContent.split('·'),date=parts.slice(1).join('·').trim()||'2026-08-14 09:20';
    if(!publicContentVisible(date)){el.remove();return}
    author.textContent=parts[0].trim();author.insertAdjacentHTML('afterbegin',avatar(parts[0].trim()));
    author.insertAdjacentHTML('afterend',`<time>${publicContentDate(date)}</time>`);
   });
   if(kind==='street'&&article.querySelector('.inquiry-comment'))article.querySelector('.inquiry-comment').insertAdjacentHTML('beforebegin',`<h2 class="rw-comments-title">全部回复 <span>${article.querySelectorAll('.inquiry-comment').length}</span></h2>`);
  }
  root.querySelector(':scope > footer').outerHTML=kind==='street'?streetFooter():`<footer class="rw-civic-footer"><b>${name}</b><p>历史资料按原件存档，补录内容另作标注。</p><div>${link('社区公开资料',SERVICE+'/')}${link('本地新闻',NEWS+'/')}</div></footer>`;
  return root.outerHTML;
 };
 const forumHeader=()=>`<header class="rw-forum-header">${link('<strong>家长之间</strong><span>一起说说家里的事</span>',PARENTS+'/')}<nav>${link('社区',PARENTS+'/')}${link('寻亲互助',PARENTS+'/thread/1182')}</nav></header>`;
 const oldForum=parentForum;
 parentForum=function(...args){
  const doc=parse(oldForum(...args)),article=doc.content.querySelector('.forum-thread');
  const byline=article.querySelector('.forum-author');
  if(byline)byline.insertAdjacentHTML('afterbegin',avatar('等灯的人头像','is-alt'));
  article.querySelectorAll('.forum-reply').forEach((el,i)=>{const date=el.querySelector('time');if(date&&!publicContentVisible(date.textContent)){el.remove();return}if(date)date.textContent=publicContentDate(date.textContent);el.insertAdjacentHTML('afterbegin',`<span class="rw-floor">${i+1}楼</span>`);const author=el.querySelector('b');author.insertAdjacentHTML('afterbegin',avatar(author.textContent.trim(),author.textContent.includes('等灯的人')?'is-alt':''))});
  const firstReply=article.querySelector('.forum-reply');
  if(firstReply)firstReply.insertAdjacentHTML('beforebegin',`<h2 class="rw-comments-title">全部回复 <span>${article.querySelectorAll('.forum-reply').length}</span></h2>`);
  return `<div class="rw-forum">${forumHeader()}${article.outerHTML}<footer class="rw-forum-footer">家长之间 · 家庭生活交流社区</footer></div>`;
 };
 function communityIndex(host){
  if(host==='street.huai.example')return streetList(new URL(STREET+'/'));
  if(host==='parents.example')return `<div class="rw-forum">${forumHeader()}<main class="rw-forum-index"><h1>寻亲互助</h1><p>寻人消息、家属求助和回家后的近况，都可以发在这里。</p>${S.flags.found?link(`<span>家庭生活</span><h2>孩子回来之后，还有人在继续找吗？</h2><p>等灯的人 · 2024-11-08</p><small>3 条回复 · 已关闭回复</small>`,PARENTS+'/thread/1182','rw-topic-card'):'<p class="rw-forum-unavailable">当前没有可公开显示的主题。</p>'}</main><footer class="rw-forum-footer">家长之间 · 家庭生活交流社区</footer></div>`;
  if(host==='records.guijia.example')return inquiryIntake();
  const street=host==='street.huai.example';
  return inquiryShell(street?'槐城街坊':'槐城社区服务',`<article class="rw-civic-index"><div class="inquiry-kicker">${street?'榆树路 · 公开帖子':'社区服务 · 公开资料目录'}</div><h1>${street?'街坊最近在聊':'资料公开'}</h1>${street?link(`<span class="rw-index-type">寻物</span><h2>那只蓝鲸鱼，后来有人来拿吗</h2><p>榆树阿诚 · 2026-08-13 21:09</p><small>榆树路站棚 / 2 条回复</small>`,STREET+'/posts/0813','rw-index-card')+link('<span class="rw-index-type">便民服务</span><h2>榆树路便民停车官网</h2><p>临停记录、停车账单与车辆资料</p>',PARKING,'rw-index-card'):(qinghuaiVisible()?link('<span class="rw-index-type">场地公告</span><h2>青槐陪伴室停止对外使用的公告</h2><p>2023-11-02 · 公告〔2023〕37号</p>',SERVICE+'/notice/37','rw-index-card'):'<p>暂无新增公开资料。</p>')}</article>`,street?'street':'civic');
 }
 window.realisticWeb=function(u){
  if(u.hostname==='news.huai.example')return paperPage(u);
  if(u.hostname==='search.example')return realSearch(u.searchParams.get('q')||'',u.searchParams.get('view')||'all');
  if(u.hostname==='street.huai.example'){
   if(u.pathname==='/'||u.pathname==='/search'||u.pathname.startsWith('/category/'))return streetList(u);
   if(u.pathname==='/about')return `<div class="inquiry-site rw-inquiry rw-street">${streetHeader()}<article><h1>街坊公约</h1><p>欢迎槐城街坊来聊身边的事。发帖请选择相应分类，请勿辱骂或发布广告。</p><p>寻物帖请写明地点与大致时间；认领时核对只有失主知道的细节。不公开完整电话、家庭住址或他人的身份证件。</p><p>涉及人身安全或违法行为，请联系警方。社区留言不能代替报案。</p></article>${streetFooter()}</div>`;
   if(u.pathname.startsWith('/posts/')&&u.pathname!=='/posts/0813')return streetEverydayPost(u.pathname.split('/')[2])||`<div class="inquiry-site rw-inquiry rw-street">${streetHeader()}<article><h1>帖子未找到</h1><p>该帖子可能已被作者删除。</p></article>${streetFooter()}</div>`;
  }
  if(['parents.example','street.huai.example','service.huai.example','records.guijia.example'].includes(u.hostname)&&u.pathname==='/')return communityIndex(u.hostname);
  if(['www.guijia.example','guijia.example'].includes(u.hostname)&&['/about','/volunteers','/help'].includes(u.pathname))return publicArticle(u.pathname);
  return null;
 };
})();
