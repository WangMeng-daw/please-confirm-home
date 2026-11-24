/* Public missing-person notices are ordinary platform records, independent of the family investigation. */
const MISSING_PEOPLE = [
 {id:'QH-0361',name:'王建国',age:67,sex:'男',photo:'missing-wang',group:'senior',status:'寻访中',missing:'2026年9月14日 07:20左右',shortDate:'9月14日',place:'东城街道 · 榕树巷菜市场',clothes:'藏蓝色翻领夹克、深灰长裤，穿黑色布鞋，随身带米色购物袋。',relative:'王女士（女儿）',description:'当天早晨独自出门买菜，至中午没有回家。家属在平时常去的菜摊、附近公园和亲友住处寻找，没有找到。老人步行较慢，与人交流时带本地口音。',progress:[['9月17日 15:40','已补充菜市场周边寻访情况，继续接收目击信息。'],['9月15日 10:25','家属提交登记，近期生活照片及衣着信息已核对。']]},
 {id:'QH-0358',name:'周淑琴',age:62,sex:'女',photo:'missing-zhou',group:'senior',status:'线索核实中',missing:'2026年9月12日 16:30左右',shortDate:'9月12日',place:'南湖街道 · 湖滨步道北入口',clothes:'梅紫色针织外套、黑色长裤，背棕色小挎包。',relative:'周先生（儿子）',description:'下午饭后外出散步，未按平时的时间回家。手机留在家中充电。家属已沿湖滨步道和附近公交站点寻找，希望见过她的人提供具体时间与行走方向。',progress:[['9月17日 11:10','收到一条湖滨步道附近的目击信息，正在向提供者核实时间。'],['9月13日 09:35','登记受理，已与家属核对外出路线和近期照片。']]},
 {id:'QH-0386',name:'赵明明',age:8,sex:'男',photo:'missing-zhao',group:'child',status:'寻访中',missing:'2026年9月10日 18:50左右',shortDate:'9月10日',place:'西桥街道 · 文化广场东侧',clothes:'蓝色连帽外套、黑色运动裤、白底运动鞋，带一只黄色水壶。',relative:'赵女士（母亲）',description:'晚饭后随母亲到文化广场散步，在广场东侧小车场附近走散。家属当晚报警并持续寻找。孩子短黑发，身高约128厘米，说话时喜欢抓住衣角。',progress:[['9月16日 14:20','家属补充了广场寻访范围，继续征集当晚目击信息。'],['9月12日 17:15','接收寻亲资料，家属已核对近期生活照片与随身水壶。']]},
 {id:'QH-0392',name:'刘若宁',age:13,sex:'女',photo:'missing-liu',group:'child',status:'持续征集线索',missing:'2026年9月11日 18:30左右',shortDate:'9月11日',place:'文苑街道 · 文苑图书馆附近',clothes:'红棕色针织开衫、白色T恤、浅蓝牛仔裤，带米色帆布书袋。',relative:'刘女士（母亲）',description:'傍晚向外婆说去附近图书馆还书，之后未按约定时间回家。家属已联系学校及常去的店铺寻找，希望当晚见过她或保存相关影像的知情者提供帮助。',progress:[['9月17日 09:50','家属补充书袋外观信息，暂无可确认的后续行踪。'],['9月14日 11:30','登记资料已受理，照片经家属确认可公开寻访。']]},
 {id:'QH-0347',name:'孙海生',age:72,sex:'男',photo:'missing-sun',group:'senior',status:'线索核实中',missing:'2026年9月8日 18:15左右',shortDate:'9月8日',place:'新港街道 · 河西路修车铺附近',clothes:'浅蓝格纹衬衫、深灰长裤，穿棕色皮鞋，口袋里放一块旧手帕。',relative:'孙先生（儿子）',description:'退休后常到河西路与老朋友聊天。当天傍晚离开朋友的修车铺，此后未回家。老人灰白短发，身高约168厘米，听力稍弱。家属正在核实离店后的去向。',progress:[['9月16日 16:05','收到沿街商户补充情况，工作人员正协助家属核对。'],['9月10日 13:20','已受理寻人登记，补充离店时间及衣着信息。']]},
 {id:'QH-0374',name:'何小安',age:10,sex:'男',photo:'missing-he',group:'child',status:'寻访中',missing:'2026年9月13日 17:10左右',shortDate:'9月13日',place:'北城街道 · 石桥里便民市场',clothes:'浅灰色卫衣、藏蓝长裤、黑白运动鞋，手里拿着绿色折叠伞。',relative:'何先生（父亲）',description:'随父亲到便民市场取修补的衣服，在店门口短暂分开后走失。家属当即在市场内寻找并报警。孩子短黑发，身高约140厘米。请知情者提供当时的具体位置与时间。',progress:[['9月17日 17:20','家属已走访市场周边店铺，继续走访，寻找目击者。'],['9月15日 14:45','寻亲登记受理，家属补充随身折叠伞的特征。']]}
];
function missingNormalize(value){return String(value||'').normalize('NFKC').replace(/[\s\-‐‑–—－]+/g,'').toUpperCase()}
function missingPeopleRecords(){
 const rows=MISSING_PEOPLE.map(person=>({...person}));
 if(S.flags.registered)rows.unshift({id:'QH-0417',name:'林小禾',age:11,sex:'女',photo:S.registrationPhoto||'before',group:'child',status:caseStatus(),missing:'2026年8月13日 17:40左右',shortDate:'8月13日',place:'槐城区 · 学校东门附近',clothes:'奶白色外套，里面是灰绿色上衣。',relative:'林砚（父亲）',ours:true,description:'8月13日放学后与家人失去联系。家属已报警，并持续寻找。希望当天下午见过她或保存相关原始影像的知情者提供信息。'});
 return rows;
}
function missingPerson(id){const key=missingNormalize(id);return missingPeopleRecords().find(person=>missingNormalize(person.id)===key)||null}
function missingPeopleCard(person){return `<button class="missing-card mp-card" data-a="record" data-id="${person.id}" aria-label="查看${person.name}的寻人登记"><img src="${asset(person.photo)}" alt="${person.name}的近期生活照片" loading="lazy"><div><strong>${person.name}<span>${person.sex} · ${person.age}岁</span></strong><p class="mp-card-id">登记编号 ${person.id}</p><p class="mp-card-place">${person.shortDate}失联 · ${E(person.place)}</p><small>${E(person.status)}</small></div></button>`}
function missingPeoplePreview(){return missingPeopleRecords().slice(0,4).map(missingPeopleCard).join('')}
function missingPeopleListing(u){
 const query=u.searchParams.get('q')||'',key=missingNormalize(query);
 const groups=[['all','全部'],['child','孩子'],['senior','老人']];
 const group=groups.some(row=>row[0]===u.searchParams.get('group'))?u.searchParams.get('group'):'all';
 const rows=missingPeopleRecords().filter(person=>(group==='all'||person.group===group)&&(!key||missingNormalize(person.name).includes(key)||missingNormalize(person.id).includes(key)));
 return `<div class="web-pad mp-catalog"><div class="mp-heading"><span>PUBLIC NOTICES</span><h1>寻人信息</h1><p>以下信息经登记家属同意公开。</p></div><form class="site-search" data-form="web-search"><input name="query" aria-label="姓名或登记编号" value="${E(query)}" placeholder="姓名 / 登记编号"><button type="submit">查询</button></form><nav class="mp-categories" aria-label="寻人信息分类">${groups.map(([id,label])=>wlink(label,'/search?'+new URLSearchParams({q:query,group:id}),group===id?'is-current':'')).join('')}</nav><div class="mp-results-count">${query?'查询结果':'公开寻人登记'}<span>${rows.length} 条</span></div><div class="web-results">${rows.map(missingPeopleCard).join('')||`<div class="mp-empty"><strong>未找到相关登记</strong><p>请核对姓名或登记编号。</p>${wlink('查看全部登记','/search','web-text-link')}</div>`}</div></div>`;
}
function missingPeopleRecord(u){
 const person=missingPerson(u.searchParams.get('id'));
 if(!person)return `<div class="web-pad mp-empty"><h1>未找到这条登记</h1><p>该编号暂无公开寻人信息。</p>${wlink('返回寻人信息','/search','web-primary')}</div>`;
 if(person.ours)S.flags.queried=true;
 const details=[['登记编号',person.id],['性别 / 年龄',person.sex+' / '+person.age+'岁'],['失联时间',person.missing],['失联地点',person.place],['当日衣着',person.clothes],['登记家属',person.relative]];
 return `<article class="web-pad mp-record"><div class="breadcrumbs">寻人信息 / 登记详情</div><div class="mp-record-head"><img class="record-photo" src="${asset(person.photo)}" alt="${person.name}的近期生活照片"><div><span class="mp-record-label">公开寻人登记</span><h1>${person.name}</h1><p>${person.sex} · ${person.age}岁</p><small class="mp-status">${E(person.status)}</small></div></div><table class="record-table">${details.map(([title,value])=>`<tr><th>${title}</th><td>${E(value)}</td></tr>`).join('')}</table><h2>失联经过</h2><p>${E(person.description)}</p><h2>进展记录</h2>${person.ours?caseTimeline():`<div class="case-timeline">${person.progress.map(([date,body])=>`<div><time>${date}</time><p>${body}</p></div>`).join('')}</div>`}<div class="mp-record-actions">${wlink('提供相关线索','/clue?case='+person.id,'web-primary')}${person.ours?wlink('家属中心','/family','web-secondary'):''}${wlink('返回寻人信息','/search','web-text-link')}</div></article>`;
}
function missingPeopleClue(u){
 const requested=u.searchParams.get('case'),person=missingPerson(requested),rows=missingPeopleRecords();
 if(requested&&!person)return `<div class="web-pad mp-empty"><h1>登记编号不存在</h1><p>请先选择需要补充线索的寻人登记。</p>${wlink('查看寻人信息','/search','web-primary')}</div>`;
 return `<div class="web-pad mp-clue"><div class="breadcrumbs">寻人信息 / 线索提交</div><h1>提供线索</h1>${person?`<div class="mp-clue-person"><img src="${asset(person.photo)}" alt="${person.name}"><div><strong>${person.name}</strong><span>${person.id} · ${person.age}岁</span></div></div>`:''}<p>请填写您亲眼见到或能够核实的信息，工作人员将联系登记家属核对。</p><form class="web-form" data-form="web-clue"><label>寻人登记${person?`<input name="case" value="${person.id}" readonly required>`:`<select name="case" required><option value="" selected disabled>选择登记对象</option>${rows.map(row=>`<option value="${row.id}">${row.name} · ${row.id}</option>`).join('')}</select>`}</label><label>联系人<input name="name" required maxlength="40" value="林砚" autocomplete="off"></label><label>线索内容<textarea name="body" required maxlength="2000" rows="5" placeholder="目击时间、地点、衣着或其他可核实的情况"></textarea></label><button type="submit" class="web-primary">提交线索</button></form>${wlink('返回'+(person?'登记详情':'寻人信息'),person?'/record?id='+person.id:'/search','web-text-link')}</div>`;
}
function missingPeopleClueReceipt(){
 const form=(S.webForms||[]).at(-1),person=missingPerson(form?.case);
 if(!form||!person)return `<div class="web-pad receipt"><h1>暂无线索回执</h1><p>没有查到线索提交记录。</p>${wlink('查看寻人信息','/search','web-primary')}</div>`;
 return `<div class="web-pad receipt mp-clue-receipt"><div class="mp-receipt-mark">已接收</div><h1>线索已提交</h1><p>感谢您为${person.name}的家人提供帮助。</p><table class="record-table"><tr><th>受理编号</th><td>CL-${String(S.webForms.length).padStart(4,'0')}</td></tr><tr><th>登记对象</th><td>${person.name}</td></tr><tr><th>登记编号</th><td>${person.id}</td></tr><tr><th>提供人</th><td>${E(form.name)}</td></tr><tr><th>处理状态</th><td>待工作人员核实</td></tr></table><p>工作人员将核实您提供的情况，并将结果告知登记家属。</p>${wlink('返回登记详情','/record?id='+person.id,'web-primary')}${wlink('查看其他登记','/search','web-text-link')}</div>`;
}

/* These attachments are reached through the already earned status-page index.
   Reading another household does not prove an identity or advance this family's case. */
const MISSING_HOUSEHOLDS={
 'QH-0361':{status:'茶杯还在手边',source:'女儿访谈 / 日常生活照',input:'他喝茶之前，总要端起来吹三下。你别催他，他做什么都慢。',record:'依访谈补录“端杯、吹气三次”。家属递来冷水，照吹三次；换成空杯，动作相同。',reply:'茶早就凉了，他还在吹。我把杯子拿走，他就对着手心吹。',reason:'家属未认。初访只记喝茶前的动作，水冷、杯空后如何处置，均未记载。',note:'动作已学会。何时停止，尚无依据。'},
 'QH-0358':{status:'门外又响了一次',source:'儿子访谈 / 旧门闩照片',input:'我妈睡前一定会摸一下门闩。照片里那个旧门闩，她摸了三十多年。',record:'送回家的周淑琴反复触摸手机里的门闩照片。家属称，触摸期间门外另有落闩声。旁注：第二声来源不明。',reply:'她的手一直在我手机上。门在身后，谁也没有过去。',reason:'照片中的门闩与实物未对应。门外声响另案记录。',note:'这一次，先记手所在的位置。'},
 'QH-0386':{status:'数不到放手以后',source:'母亲访谈 / 学车照片',input:'他学车时很胆小，要数到十才肯松开爸爸的手。数错了就从头来。',record:'已补录双手握车把、从一数至十。夜间回访：躺下后双手保持握持姿势，每数到十便从头再数，不等家属说话。',reply:'我说已经到十了，可以睡了。他问我，爸爸的手在哪里。',reason:'初访只记数到十。松开父亲的手以后，无后续记载。',note:'照片里没有松开的那一刻。'},
 'QH-0392':{status:'袖子里面没有结',source:'外婆访谈 / 手绳正面照片',input:'她编手绳时爱把最后的结藏在袖口里，怕别人看见。问她编给谁，她就笑。',record:'按登记正面照塑形。左袖反复翻转，内外已混在一起；绳结没有找到，脸上却一直挂着照片里的笑。',reply:'我只说她会藏起来，没有叫她把袖子一直翻过去。',reason:'照片未拍到袖内，无法补出手绳结。检查袖内，无结。',note:'看不见的部分，空着。'},
 'QH-0347':{status:'空壳还在报时',source:'儿子访谈 / 修表旧照',input:'爸以前修钟表，修好总要贴在耳边听一下，然后说，走准了。',record:'送回家的孙海生贴着空钟壳听，还说“走准了”。机芯已拆。家属称屋内有报时声，来源未明，暂附于回访记录。',reply:'壳里面什么都没有。我把它拿到院子里，房里还是报了下一声。',reason:'听钟动作与屋内报时分别记录。家属不认“修好”一说，回访未结。',note:'报时照录。是谁在数，暂不写入。'},
 'QH-0374':{status:'玄关的人没有动',source:'父亲访谈 / 玄关生活照',input:'小安一到家就踮脚，先去看柜子上那只猫。鞋都顾不上脱。',record:'送回家的何小安在玄关踮起脚后一直未动。家属回访称，直至天亮望着空猫窝。后续补述另附，初访记录未改。',reply:'猫去年就走了。我讲的是以前的事，登记的时候忘了说这句。',reason:'家属后补：猫已离世，初访漏记。末行手写“这不是小安”，此后无记录。',note:'他还在等照片里的东西回来。'}
};
function missingPeoplePrivateReady(){return Boolean(S.flags.found&&S.flags.auth&&S.flags.inner&&S.inquiry?.visited?.status)}
function missingPeoplePrivateLink(label,path,cls='mp-inner-link'){return `<a class="${cls}" href="${E(BASE+path)}" data-a="url" data-url="${E(BASE+path)}">${E(label)}</a>`}
function missingHouseholdsReference(file){return !file&&missingPeoplePrivateReady()?`<p class="cult-cross-reference mp-households-reference">同卷附存：${missingPeoplePrivateLink('六户家庭回访记录','/account/households','cult-inline-link')}。</p>`:''}
function missingPeopleInnerShell(title,body){return `<div class="mp-inner" style="--mp-inner-scene:url('${asset('web-bg-cult')}')"><header class="mp-inner-head"><span>归亲堂名册 · 六家回访</span><img src="${asset('cult-title')}" alt="归亲堂"><p>人还没找到　家属继续寻找</p></header><article><div class="mp-inner-meta"><span>槐城旧堂 / 家属留下的话</span><span>QH-0417 附件 / 六户家庭</span></div><h1>${E(title)}</h1>${body}</article><footer>人还没找到，寻人启事就不能撤。</footer></div>`}
function missingPeoplePrivateIndex(){return missingPeopleInnerShell('六户家庭回访记录',`<p>此册收有六户家庭接人回家后的访谈，按寻人登记编号归档。六名失踪者的记录保留。</p><p class="mp-inner-notice">六户寻人启事保留。册边手书：“送回家的不是本人，不能撤下寻人启事。”</p><div class="mp-household-list">${MISSING_PEOPLE.map(person=>`<a class="mp-household" href="${BASE}/account/households?id=${person.id}" data-a="url" data-url="${BASE}/account/households?id=${person.id}" data-id="${person.id}"><img src="${asset(person.photo)}" alt="${person.name}的登记照片"><div><code>${person.id}</code><strong>${person.name}<small>${person.age}岁</small></strong><span>${MISSING_HOUSEHOLDS[person.id].status}</span></div><b>继续寻找</b></a>`).join('')}</div><p class="mp-inner-return">${missingPeoplePrivateLink('回到小禾那一页','/account/status')}</p>`)}
function missingPeoplePrivateRecord(person){
 const record=MISSING_HOUSEHOLDS[person.id];
 return missingPeopleInnerShell('这一家留下的话',`<div class="mp-inner-identity"><img src="${asset(person.photo)}" alt="${person.name}的登记照片"><div><code>${person.id}</code><h2>${person.name}</h2><span>${person.sex} / ${person.age}岁</span><b>继续寻找</b></div></div><dl class="mp-inner-fields"><div><dt>公开寻访</dt><dd>${person.status}</dd></div><div><dt>旧页边注</dt><dd>${record.status}</dd></div><div><dt>材料来源</dt><dd>${record.source}</dd></div><div><dt>继续寻找</dt><dd>失踪者本人下落未明，寻人启事保留。</dd></div></dl><section><h2>家属最初说的话</h2><blockquote>${record.input}</blockquote></section><section><h2>那张脸进门以后</h2><p>${record.record}</p></section><section><h2>家属后来写道</h2><blockquote>${record.reply}</blockquote></section><section><h2>补录备注</h2><p>${record.reason}</p></section><p class="mp-inner-margin">${record.note}</p>${typeof cipherHouseholdWitness==='function'?cipherHouseholdWitness(person.id):''}<div class="mp-inner-return">${missingPeoplePrivateLink('返回六户家庭回访记录','/account/households')}${missingPeoplePrivateLink('翻回寻人启事 '+person.id,'/record?id='+person.id)}</div>`);
}
function missingPeopleWeb(u){
 if(!['guijia.example','www.guijia.example'].includes(u.hostname)||u.pathname!=='/account/households')return null;
 if(!missingPeoplePrivateReady())return webHeader()+`<div class="web-pad"><h1>资料索引未建立</h1><p>本次副本没有该附页的关联记录。</p>${wlink('返回个人资料服务','/account/export','web-primary')}</div>`+webFooter();
 if(!u.searchParams.has('id'))return missingPeoplePrivateIndex();
 const person=MISSING_PEOPLE.find(row=>missingNormalize(row.id)===missingNormalize(u.searchParams.get('id')));
 return person?missingPeoplePrivateRecord(person):missingPeopleInnerShell('未找到这份回访记录',`<p>回访记录里没有这个编号。</p><p>${missingPeoplePrivateLink('返回六户家庭回访记录','/account/households')}</p>`);
}
