/* Six separate trails. Reading a returned-person report is not a substitute for
 * finding that person's own last record. The page/line book handles decoding. */
const FAMILY_INVESTIGATIONS = {
 household_wang:{name:'王建国',case:'QH-0361',site:'榕树巷菜市',host:'market.huai.example',start:'/lost/0914',theme:'market',photo:'missing-wang',code:'上·叁正·宇',place:'旧堂东侧茶水间',date:'2026-09-22 06:15',birth:'1959年，农历正月十三，子时',intro:'我爸的米色购物袋，底角补了一小块蓝布。榕树巷菜市的管理员给我留了话，说冷库那边捡到一个很像的，里面还有张小票。',title:'茶叶袋里的纸条',body:'姑娘，别把我那只旧杯子扔了。这里喝不到热水，我牙疼，咬不动他们给的饼。每天清早有人把空茶桶拉出去，我把纸塞进茶叶袋口。要是有人捡到，请替我给女儿报个信。我叫王建国，我没回过家。',origin:'菜市27号摊保存的周转退货附单。纸条随旧堂退回的茶桶带出，9月22日由摊主拍照留档。',seal:'single'},
 household_zhao:{name:'赵明明',case:'QH-0386',site:'西桥文化广场',host:'culture.huai.example',start:'/service/0910',theme:'square',photo:'missing-zhao',code:'上·肆背·地',place:'旧堂东侧杂物间',date:'2026-09-20 18:42',birth:'2018年，农历正月十三，午时',intro:'明明那只水壶是黄的，盖子蓝色。9月10日傍晚，我们在西桥文化广场东侧走散。服务台说，当天没领走的东西已经装车送去代存了，我后来去过两次，都没拿到。',title:'黄色水壶里的便条',body:'妈妈，是明明。我没有去骑车。这里很黑，门外堆着折好的椅子。他们让我对着墙回头，我回了好多次，都没有看见你。我把字卷进水壶里了。你看见了就来找我。',origin:'广场服务台留存的物品退回联。黄色水壶于9月21日随旧堂杂物退回，杯身刻有“明明”。',seal:'double'},
 household_zhou:{name:'周淑琴',case:'QH-0358',site:'湖岸照相馆',host:'photo.huai.example',start:'/albums/lake-0912',theme:'photo',photo:'missing-zhou',code:'上·陆正·玄',place:'旧堂后院缝衣间',date:'2026-09-21 20:06',birth:'1964年，农历四月初四，卯时',intro:'我妈9月12日下午在湖滨步道北入口失踪。照相馆那天拍了步道全景。她出门带的挎包，有一根红线绕在提手上。',title:'缝进挎包夹层的字',body:'儿子，你明早几点上班？我不在家，睡前记得把门锁上。我每天给他们缝东西，门却一直从外面拴着。今天有人拿包出去补扣，我把这几行缝在里面。要是有人交给你，别再等我自己回去。',origin:'湖岸照相馆代存的补扣照片及拆线记录。原包9月22日由南湖修补摊转交，夹层纸上留有本人姓名。',seal:'single'},
 household_liu:{name:'刘若宁',case:'QH-0392',site:'文苑青少年手作社',host:'handwork.huai.example',start:'/members/ruoning',theme:'library',photo:'missing-liu',code:'下·壹背·宙',place:'旧堂后院阅览室',date:'2026-09-20 21:08',birth:'2013年，农历四月初四，酉时',intro:'若宁给我编的手绳，照片还在文苑青少年手作社的网页上。社团老师说，寻人帖后来被改成“已经接回”，连一份附件也删了。他们没有同意过这样改。',title:'寻人帖被删掉的附件',body:'妈，手绳是给你的，不是要你一直假装没看见。我在一本借来的书后面写了字，趁他们还书一起交了出去。每天有个人隔着玻璃看我。他说等我学会笑，就能回家。可我本来就会笑。',origin:'手作社2026年9月20日21:08的网页快照。社团老师当晚收到文苑图书馆转来的书后夹页，次日上午页面附件被删除。',seal:'double'},
 household_sun:{name:'孙海生',case:'QH-0347',site:'河西钟表维修',host:'clockwork.huai.example',start:'/workshop/0908',theme:'clock',photo:'missing-sun',code:'下·叁背·天',place:'旧堂西侧钟房',date:'2026-09-23 05:10',birth:'1954年，农历七月廿一，辰时',intro:'我爸9月8日去河西路看朋友，顺便带了一只单链坠钟修报时。那只钟是三乐牌，铭牌磨花了。河西钟表维修的师傅认得他，说钟还在店里。',title:'保修纸背面的留言',body:'我是孙海生。钟的机芯没有坏，是有人把报时锤摘了。摘了也照样响，一夜响好多回。我把螺丝包里那张保修纸翻过来写。请交给我儿子。我还在这儿，没跟人出去过。',origin:'河西钟表维修9月23日零件退回包。孙海生的旧钟工单与退回包使用同一序号，保修纸另面有本人留言。',seal:'single'},
 household_he:{name:'何小安',case:'QH-0374',site:'石桥小动物诊所',host:'pets.huai.example',start:'/adoption/xiaoan',theme:'pets',photo:'missing-he',code:'下·陆正·黄',place:'旧堂西侧木工间',date:'2026-09-21 17:32',birth:'2016年，农历七月廿一，戌时',intro:'小安以前常去看诊所那只黑猫，叫它小煤球。猫后来被人领养，换了名字。9月13日我带他去石桥里取衣服，他手里拿着绿色伞。诊所还留着他画的猫。',title:'猫笼垫纸上的求助',body:'爸爸，我是小安。这里没有猫，我还是听见它在叫。他们说把柜子打开就能见到它，柜子里只有木屑。我在猫笼的垫纸上写了名字，你不要以为是乱画的。我想回家。',origin:'石桥诊所9月22日收回的借用猫笼。绿色伞带系在笼扣上，垫纸与诊所保留的儿童画字迹相近。',seal:'double'}
};

function familyInvestigationState(){const s=clueState();s.familyInvestigations??={version:1,cases:{}};for(const id of Object.keys(FAMILY_INVESTIGATIONS))s.familyInvestigations.cases[id]??={read:{},query:{},decoded:false,saved:false};return s.familyInvestigations}
function familyInvestigationCase(id){return familyInvestigationState().cases[id]||null}
function familyInvestigationAvailable(id){const k=clueState().known;return !!(FAMILY_INVESTIGATIONS[id]&&S.flags.found&&k['dp-cloud-letter']&&(k['fi-notice:'+id]||k['fi-return:'+id]))}
function familyInvestigationRead(id,key){const x=familyInvestigationCase(id);if(!x||!familyInvestigationAvailable(id))return false;if(!x.read[key]){x.read[key]=phoneStamp();clueRead('fi:'+id+':'+key);persist()}return true}
function familyInvestigationSourceReady(id){return familyInvestigationAvailable(id)&&!!familyInvestigationCase(id)?.read.personal}
function familyInvestigationComplete(id){return familyInvestigationSourceReady(id)&&!!familyInvestigationCase(id)?.decoded}
function familyInvestigationCount(){return Object.keys(FAMILY_INVESTIGATIONS).filter(familyInvestigationComplete).length}
function familyInvestigationAllComplete(){return familyInvestigationCount()===6}
function familyInvestigationMissingNames(){return Object.keys(FAMILY_INVESTIGATIONS).filter(id=>!familyInvestigationComplete(id)).map(id=>FAMILY_INVESTIGATIONS[id].name)}
function familyInvestigationConclusions(){return Object.entries(FAMILY_INVESTIGATIONS).filter(([id])=>familyInvestigationComplete(id)).map(([id,f])=>({id,name:f.name,case:f.case,location:f.place,source:f.origin,sourceDate:f.date,code:f.code,statement:f.body,birth:f.birth,decodedAt:familyInvestigationCase(id).decodedAt}));}
function familyInvestigationLink(label,url){return `<a class="fi-link" href="${E(url)}" data-a="url" data-url="${E(url)}">${E(label)}<span aria-hidden="true">›</span></a>`}
function familyInvestigationURL(id,path){return 'https://'+FAMILY_INVESTIGATIONS[id].host+path}
function familyInvestigationRecordURL(id){return 'https://records.guijia.example/retained/'+FAMILY_INVESTIGATIONS[id].case}
function familyInvestigationEntry(id){if(!familyInvestigationAvailable(id))return '';const f=FAMILY_INVESTIGATIONS[id];return `<section class="fi-entry"><span>家属补充</span><p>${E(f.intro)}</p>${familyInvestigationLink(f.site+' · 留存网页',familyInvestigationURL(id,f.start))}</section>`}
function familyInvestigationShell(id,title,body){const f=FAMILY_INVESTIGATIONS[id];return `<div class="fi-site fi-${f.theme}"><header><a href="${familyInvestigationURL(id,f.start)}" data-a="url" data-url="${familyInvestigationURL(id,f.start)}"><small>${E(f.site)}</small><strong>${E(title)}</strong></a></header><main>${body}</main><footer>${E(f.site)}<span>资料留存 · 按原件日期编排</span></footer></div>`}
function familyInvestigationMeta(date,tag){return `<div class="fi-meta"><span>${E(tag)}</span><time>${E(date)}</time></div>`}
function familyInvestigationRows(headers,rows){return `<div class="fi-table-wrap"><table><thead><tr>${headers.map(v=>`<th>${E(v)}</th>`).join('')}</tr></thead><tbody>${rows.map(row=>`<tr>${row.map(v=>`<td>${v}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`}
function familyInvestigationBack(id,path,label='返回目录'){return familyInvestigationLink(label,familyInvestigationURL(id,path))}
function familyInvestigationPersonal(id){
 const f=FAMILY_INVESTIGATIONS[id],x=familyInvestigationCase(id);
 if(!familyInvestigationAvailable(id)||!x.read.route)return clueUnavailable();
 familyInvestigationRead(id,'personal');
 const fragment=typeof bookCipherFragmentHTML==='function'?bookCipherFragmentHTML(id,{title:'转交联 · 院内收件处',description:'收件地址栏原记，保留册、叶、行记。'}):`<div class="fi-book-ref"><span>院内收件处</span><strong>${E(f.code)}</strong><p>转交联沿用《归亲会抄经本》的叶码、行记。</p></div>`;
 return familyInvestigationShell(id,f.title,`${familyInvestigationMeta(f.date,'原件抄录')}<div class="fi-person"><img src="${asset(f.photo)}" alt="${E(f.name)}的寻人登记照片"><div><h1>${E(f.name)}</h1><span>${E(f.case)}</span><small>${E(f.birth)}</small></div></div><blockquote class="fi-handwritten">${E(f.body)}</blockquote><details class="fi-original"><summary>查看原件流转记录</summary><p>${E(f.origin)}</p><p>发件处为旧堂，退件沿用首次交接单号。各收件商户均在院外交接，未入院内；家属接领事项不在本次退件登记范围内。</p><p>随联备注：“院内收件处依《归亲会抄经本》登记，不另书房名。”商户留底按原联抄录，保留册叶行记，未作改填。</p></details>${fragment}${x.decoded?`<section class="fi-decoded"><span>地址栏抄译</span><p>${E(f.place)}</p><button class="web-primary" data-a="fi-save" data-id="${id}">${x.saved?'查看已存文件':'保存这份记录'}</button></section>`:''}`);
}

function familyInvestigationWang(p){const id='household_wang',x=familyInvestigationCase(id),link=(t,p)=>familyInvestigationBack(id,p,t);
 if(p==='/lost/0914'){familyInvestigationRead(id,'start');return familyInvestigationShell(id,'九月失物招领',`${familyInvestigationMeta('2026年9月17日','菜市服务台')}<p>9月14日晨市收摊时，管理员捡到三只布袋。放在冷库门口的米色袋子，底角缝着一小块蓝布。袋内有半把葱和一张小票，未留联系方式。</p><div class="fi-receipt"><b>榕树巷菜市 · 27号摊</b><span>2026-09-14　07:08</span><span>小葱 / 豆腐　¥ 6.50</span><small>手写：送茶桶的说，可以顺车带他找旧朋友。</small></div>${link('27号摊 · 周转与退件查询','/dispatch')}`)}
 if(!x.read.start)return clueUnavailable();
 if(p==='/dispatch'){familyInvestigationRead(id,'dispatch');return familyInvestigationShell(id,'周转底单查询',`<p>摊位货物按首次交件日期存档；后来退回的物品挂在原单下。</p><form class="web-form" data-form="fi-market"><label>摊位号<input name="stall" inputmode="numeric" required value="${E(x.query.stall||'')}"></label><label>首次交件日期<input type="date" name="date" value="${E(x.query.date||'')}" required></label><button class="web-primary">查询底单</button><p role="status">${E(x.query.notice||'')}</p></form>${x.query.matched?familyInvestigationRows(['单号','品类','附页'],[['27-0914-1','豆制品',link('查看','/dispatch/1')],['27-0914-2','旧堂茶桶与布袋',link('查看','/dispatch/2')],['27-0914-3','青菜筐',link('查看','/dispatch/3')]]):''}`)}
 if(/^\/dispatch\/[123]$/.test(p)&&x.query.matched){if(p.endsWith('/2')){familyInvestigationRead(id,'route');return familyInvestigationShell(id,'27-0914-2 · 退件附单',`${familyInvestigationMeta('2026年9月22日','退件留底')}<p>原单：9月14日07:18，旧堂取茶桶。随车一名老人，带米色布袋。</p><p>退件：9月22日，空茶桶二只、同色布袋一只。茶叶袋封口里卷着一张纸，落款“王建国”。</p>${familyInvestigationLink('查看纸条及转交联',familyInvestigationRecordURL(id))}`)}return familyInvestigationShell(id,'27号摊 · 普通货物底单',`<p>该单为菜市普通送货。货物已按数量退回，没有附信或随车人员。</p>${link('返回同日底单','/dispatch')}`)}return clueUnavailable();
}

function familyInvestigationZhao(p){const id='household_zhao',x=familyInvestigationCase(id),link=(t,p)=>familyInvestigationBack(id,p,t);
 if(p==='/service/0910'){familyInvestigationRead(id,'start');return familyInvestigationShell(id,'广场服务台 · 9月10日',`${familyInvestigationMeta('2026年9月11日','失物与便民服务')}<p>当晚18:50后，有家长来找一只黄壶身、蓝壶盖的儿童水壶，说孩子在东侧小车场走散。</p><p>服务台18:52完成失物清点，19:00关闭东侧柜台。清点后的待领物品合并交车一次，收件处登记为旧堂代存点。</p>${link('查看9月10日服务车辆班次','/transport/0910')}`)}
 if(!x.read.start)return clueUnavailable();
 if(p==='/transport/0910'){familyInvestigationRead(id,'timetable');return familyInvestigationShell(id,'服务车辆出场簿',`${familyInvestigationMeta('2026年9月10日','东侧出口')}<p>各车按实际出场时间登记。临时改派保留原班次号。</p>${familyInvestigationRows(['出场','物品','底单'],[['18:44','保温餐盒、黄色热水桶',link('XC-10-31','/transport/XC-10-31')],['18:58','儿童水壶两只、折叠椅',link('XC-10-32','/transport/XC-10-32')],['19:12','球筐、黑色水壶',link('XC-10-33','/transport/XC-10-33')]])}`)}
 if(/^\/transport\/XC-10-3[123]$/.test(p)&&x.read.timetable){if(p.endsWith('32')){familyInvestigationRead(id,'route');return familyInvestigationShell(id,'XC-10-32 · 物品代存联',`<p>18:58交件：旧堂。水壶一黄一粉，黄色壶蓝盖，壶底刻“明明”。</p><p>9月21日退回：黄色水壶一只。壶内没有水，有一条卷成细筒的便条，另附院内转交联。</p>${familyInvestigationLink('打开退回物品附页',familyInvestigationRecordURL(id))}`)}return familyInvestigationShell(id,'服务车辆底单',`<p>${p.endsWith('31')?'广场北侧食堂签收：保温餐盒及黄色十五升保温桶，数量无误。':'19:12的体育器材车送往区体育馆。黑色水壶属工作人员所有。'}</p>${link('返回出场簿','/transport/0910')}`)}return clueUnavailable();
}

function familyInvestigationZhou(p){const id='household_zhou',x=familyInvestigationCase(id),link=(t,p)=>familyInvestigationBack(id,p,t);
 if(p==='/albums/lake-0912'){familyInvestigationRead(id,'start');return familyInvestigationShell(id,'湖滨步道 · 九月底片',`${familyInvestigationMeta('2026年9月18日','照相馆留样')}<p>当天北入口有位背棕色挎包的女士问路，包提手绕着红线。摄影师在底片袋上记了时间和位置。</p><div class="fi-photo-sleeve"><img src="${asset('missing-zhou')}" alt="家属提供的周淑琴照片"><span>家属提供的近期照片<br>梅紫色外套 / 棕色挎包</span></div>${link('查看9月12日底片目录','/negatives/0912')}`)}
 if(!x.read.start)return clueUnavailable();
 if(p==='/negatives/0912'){familyInvestigationRead(id,'catalogue');return familyInvestigationShell(id,'底片袋目录',`<p>袋面是摄影师当日写下的简记，袋背另记补印与代存事项。</p>${familyInvestigationRows(['底片','当日简记','袋背'],[['NL-0912-12','16:08 · 南码头，两位女士，黑色双肩包',link('查看','/negative/NL-0912-12/back')],['NL-0912-36','16:38 · 北入口，紫外套，包带缠红线',link('查看','/negative/NL-0912-36/back')],['NL-0912-42','17:02 · 北入口，灰上衣，推童车',link('查看','/negative/NL-0912-42/back')]])}`)}
 if(/^\/negative\/NL-0912-(12|36|42)\/back$/.test(p)&&x.read.catalogue){if(p.includes('-36/')){familyInvestigationRead(id,'route');return familyInvestigationShell(id,'NL-0912-36 · 袋背',`<div class="fi-photo-back"><p>9/12，16:38。女士问旧堂是不是招人缝衣服，有人叫她进去看一眼。她说先回家跟儿子说。</p><p>9/22，修补摊送来同样的棕色包，提手红线未拆。摊主换扣时发现内衬缝着字，托我们拍清楚。登记姓名：周淑琴。</p><small>湖岸照相馆 · 阿鹏</small></div>${familyInvestigationLink('查看内衬拆线照片抄录',familyInvestigationRecordURL(id))}`)}return familyInvestigationShell(id,'底片袋背',`<p>冲印登记：按袋内底片各印一份，已交订片人。袋内无其他附件。</p>${link('返回底片目录','/negatives/0912')}`)}return clueUnavailable();
}

function familyInvestigationLiu(p){const id='household_liu',x=familyInvestigationCase(id),link=(t,p)=>familyInvestigationBack(id,p,t);
 if(p==='/members/ruoning'){familyInvestigationRead(id,'start');return familyInvestigationShell(id,'若宁的手作页',`${familyInvestigationMeta('2026年9月24日','社团管理员')}<div class="fi-editor-note"><strong>关于寻人帖的修改</strong><p>9月11日，若宁去文苑图书馆还书后失联。我们发过寻人帖，9月21日08:10被改成“已经接回”，同时删去一个附件。</p><p>带队老师没有收到若宁本人报平安，也没有提交这次修改。社团正在核对修改记录，寻人帖和历次附件继续留存。</p></div>${link('页面修改历史','/members/ruoning/history')}`)}
 if(!x.read.start)return clueUnavailable();
 if(p==='/members/ruoning/history'){familyInvestigationRead(id,'history');return familyInvestigationShell(id,'页面历史版本',`<p>按保存时间列出页面原貌，附件随各版本保存。</p><ol class="fi-version-list">${[['0911','9月11日 22:04','新建寻人帖'],['0918','9月18日 16:36','补充书袋照片'],['0920','9月20日 21:08','增补附件 1'],['0921','9月21日 08:10','修改状态，移除附件 1']].map(([n,d,t])=>`<li><time>${d}</time>${link(t,'/members/ruoning/snapshot/'+n)}</li>`).join('')}</ol>`)}
 if(/^\/members\/ruoning\/snapshot\/09(11|18|20|21)$/.test(p)&&x.read.history){if(p.endsWith('0920')){familyInvestigationRead(id,'route');return familyInvestigationShell(id,'9月20日 · 寻人帖原貌',`<div class="fi-snapshot-label">历史页面 · 2026-09-20 21:08</div><h1>请继续寻找刘若宁</h1><p>文苑图书馆今天收到旧堂退回的一箱书。最后一本书的后封内夹着孩子写的纸，落款是若宁。馆员把纸和还书联一起拍了下来。</p><p>她说自己还在里面。请不要撤下这条消息。</p>${familyInvestigationLink('附件登记号 RN-0920 · 书后夹页',familyInvestigationRecordURL(id))}`)}return familyInvestigationShell(id,'寻人帖历史页面',`<div class="fi-snapshot-label">历史页面 · ${p.endsWith('0921')?'2026-09-21 08:10':p.endsWith('0918')?'2026-09-18 16:36':'2026-09-11 22:04'}</div><p>${p.endsWith('0921')?'状态：已经接回。附件：无。':p.endsWith('0918')?'家属补充米色帆布书袋照片。暂未收到孩子本人消息。':'若宁傍晚去图书馆还书后未归。请附近居民留意。'}</p>${link('返回修改历史','/members/ruoning/history')}`)}return clueUnavailable();
}

function familyInvestigationSun(p){const id='household_sun',x=familyInvestigationCase(id),link=(t,p)=>familyInvestigationBack(id,p,t);
 if(p==='/workshop/0908'){familyInvestigationRead(id,'start');return familyInvestigationShell(id,'河西路 · 老钟维修',`${familyInvestigationMeta('2026年9月16日','店主补记')}<p>9月8日傍晚，孙师傅从隔壁修车铺过来，带了一只三乐牌单链坠钟。他说走时还准，只是整点总少敲一下。</p><p>铭牌锈蚀，型号字样已经看不清了。师傅拆开看过，是单链坠砣、整点敲钟的老机芯，零件暂放在三乐旧款柜。</p>${link('三乐旧钟 · 型号目录','/catalogue/sanle')}`)}
 if(!x.read.start)return clueUnavailable();
 if(p==='/catalogue/sanle'){familyInvestigationRead(id,'catalogue');return familyInvestigationShell(id,'旧机芯型号目录',`${familyInvestigationRows(['型号','动力结构','报时结构'],[['SL-07','单链坠砣','无报时'],['SL-17','单链坠砣','每逢整点敲钟'],['SL-71','双链坠砣','整点与半点报时'],['SL-31','发条上弦','每逢整点敲钟']])}<p>旧款铭牌与现行零件包装写法相同。工单可按型号和送修日期查询。</p>${link('查找维修工单','/orders')}`)}
 if(p==='/orders'&&x.read.catalogue){familyInvestigationRead(id,'orders');return familyInvestigationShell(id,'维修工单查询',`<form class="web-form" data-form="fi-clock"><label>型号<input name="model" required autocomplete="off" value="${E(x.query.model||'')}"></label><label>送修日期<input name="date" type="date" required value="${E(x.query.date||'')}"></label><button class="web-primary">查找工单</button><p role="status">${E(x.query.notice||'')}</p></form>${x.query.matched?familyInvestigationRows(['单号','报修情况','记录'],[['HX-0908-07','走时停摆，报时正常',link('打开','/order/HX-0908-07')],['HX-0908-09','走时正常，报时少一声',link('打开','/order/HX-0908-09')]]):''}`)}
 if(/^\/order\/HX-0908-0[79]$/.test(p)&&x.query.matched){if(p.endsWith('09')){familyInvestigationRead(id,'route');return familyInvestigationShell(id,'HX-0908-09 · 零件退回',`<p>送修人：孙海生。9月8日18:12，自带单链坠钟。旧堂有人来说也有钟要修，老人跟着去看，此后未再到店。</p><p>9月23日收到旧堂退件，螺丝纸包写着这张工单号。保修纸背面另写了字，店主没有丢弃。</p>${familyInvestigationLink('查看保修纸两面抄录',familyInvestigationRecordURL(id))}`)}return familyInvestigationShell(id,'HX-0908-07 · 维修记录',`<p>陈先生送修。更换走时链后已于9月9日取回。无额外附件。</p>${link('返回同日工单','/orders')}`)}return clueUnavailable();
}

function familyInvestigationHe(p){const id='household_he',x=familyInvestigationCase(id),link=(t,p)=>familyInvestigationBack(id,p,t);
 if(p==='/adoption/xiaoan'){familyInvestigationRead(id,'start');return familyInvestigationShell(id,'小安画过的那只猫',`${familyInvestigationMeta('2026年9月17日','诊所寻人转发')}<p>小安常来看一只左前爪有白毛的黑猫，喊它“小煤球”。8月底猫已经被领养，新家给它重新起了名字。他画的那张猫还贴在诊所门口。</p><p>9月13日，他拿着绿色伞来问过猫有没有回诊所。父亲当时在石桥里修补摊取衣服。</p>${link('八月领养回访','/adoption/august')}`)}
 if(!x.read.start)return clueUnavailable();
 if(p==='/adoption/august'){familyInvestigationRead(id,'adoption');return familyInvestigationShell(id,'八月领养回访',`${familyInvestigationRows(['在诊所时','领养后','外观记录'],[['小煤球','墨点','黑猫，左前爪白毛'],['煤球','团团','黑猫，四爪均黑'],['小黑','阿玄','黑白花，胸口大片白毛']])}<p>领养档案已按新家使用的名字更新，接种、猫笼借还及回访记录沿用同一档案。</p>${link('猫笼借还与回访记录','/care/search')}`)}
 if(p==='/care/search'&&x.read.adoption){familyInvestigationRead(id,'search');return familyInvestigationShell(id,'回访记录查询',`<form class="web-form" data-form="fi-pets"><label>领养后的名字<input name="name" required value="${E(x.query.name||'')}" autocomplete="off"></label><button class="web-primary">搜索记录</button><p role="status">${E(x.query.notice||'')}</p></form>${x.query.matched?`<div class="fi-care-card"><span>墨点 · 原诊所名“小煤球”</span><p>8月28日领养，9月6日回访。原猫笼后借给旧堂代存点周转，9月22日退回。</p>${link('9月22日 · 猫笼退回记录','/care/0922')}</div>`:''}`)}
 if(p==='/care/0922'&&x.query.matched){familyInvestigationRead(id,'route');return familyInvestigationShell(id,'9月22日 · 猫笼退回',`<p>借出物：闲置猫笼一只，原住猫由领养家庭照料。归还单位：旧堂代存点。笼扣附绿色伞带一截，笼内垫纸留有手写文字。</p><p>纸上有“何小安”和一个电话号码。医生已按号码联系家属，原纸与借还联一起保留。</p>${familyInvestigationLink('查看垫纸与借还联',familyInvestigationRecordURL(id))}`)}return clueUnavailable();
}

function familyInvestigationWeb(u){
 let p;try{p=decodeURIComponent(u.pathname)}catch{return null}
 if(u.hostname==='records.guijia.example'&&p.startsWith('/retained/')){const id=Object.keys(FAMILY_INVESTIGATIONS).find(k=>p==='/retained/'+FAMILY_INVESTIGATIONS[k].case);return id?familyInvestigationPersonal(id):clueUnavailable()}
 const id=Object.keys(FAMILY_INVESTIGATIONS).find(k=>FAMILY_INVESTIGATIONS[k].host===u.hostname);if(!id)return null;if(!familyInvestigationAvailable(id))return clueUnavailable();
 return ({household_wang:familyInvestigationWang,household_zhao:familyInvestigationZhao,household_zhou:familyInvestigationZhou,household_liu:familyInvestigationLiu,household_sun:familyInvestigationSun,household_he:familyInvestigationHe})[id](p);
}
function familyInvestigationSubmit(kind,d){
 const id={'fi-market':'household_wang','fi-clock':'household_sun','fi-pets':'household_he'}[kind];if(!id)return false;
 if(!familyInvestigationAvailable(id))return true;const x=familyInvestigationCase(id),q=x.query,n=v=>String(v||'').normalize('NFKC').trim();
 if(kind==='fi-market'&&x.read.dispatch){q.stall=n(d.get('stall'));q.date=n(d.get('date'));q.matched=q.stall.replace(/号摊?$/,'')==='27'&&q.date==='2026-09-14';q.notice=q.matched?'':'未找到该摊位当日的周转底单。';}
 if(kind==='fi-clock'&&x.read.orders){q.model=n(d.get('model')).toUpperCase().replace(/[—－–\s]/g,'');q.date=n(d.get('date'));q.matched=q.model.replace('-','')==='SL17'&&q.date==='2026-09-08';q.notice=q.matched?'':'未找到对应工单，请核对型号与送修日期。';}
 if(kind==='fi-pets'&&x.read.search){q.name=n(d.get('name'));q.matched=q.name==='墨点';q.notice=q.matched?'':/煤球|小黑/.test(q.name)?'借还簿未登记此旧称，请填写领养档案中的现用名。':'未找到该名字的记录。';}
 persist();render();return true;
}
function familyInvestigationDecoded(id,detail){
 if(!FAMILY_INVESTIGATIONS[id]||!familyInvestigationSourceReady(id))return false;
 const f=FAMILY_INVESTIGATIONS[id],decoded=String(detail?.text||detail?.translation||detail?.result||'').replace(/[\s。，、]/g,'');
 if(decoded!==f.place)return false;
 const x=familyInvestigationCase(id);x.decoded=true;x.decodedAt=phoneStamp();clueRead('fi-decoded:'+id);persist();return true;
}
function familyInvestigationFileData(fileId){
 const id=String(fileId||'').replace(/^fi-/,'');if(!FAMILY_INVESTIGATIONS[id]||!familyInvestigationComplete(id)||!familyInvestigationCase(id).saved)return null;
 const f=FAMILY_INVESTIGATIONS[id];return {id:fileId,title:f.name+'·最后留言与转交记录.txt',body:f.name+' / '+f.case+'\n'+f.birth+'\n\n'+f.body+'\n\n原件出处：'+f.origin+'\n\n地址栏原记：'+f.code+'\n按《归亲会抄经本》查页转写：'+f.place+'。',sourceId:'fi-'+id,clueId:'fi-'+id,sourceLabel:'原件抄录 · '+f.date,takenAt:f.date};
}
function familyInvestigationAction(a,b){if(a!=='fi-save')return false;const id=b?.dataset?.id;if(!familyInvestigationComplete(id))return true;const x=familyInvestigationCase(id),key='fi-'+id;x.saved=true;if(!clueState().files.includes(key))clueState().files.push(key);persist();go('clue-file',{id:key});return true}
function familyInvestigationRegisterBook(){if(typeof bookCipherRegister==='function')bookCipherRegister(Object.entries(FAMILY_INVESTIGATIONS).map(([id,f])=>({id,code:f.code,text:f.place,seal:f.seal,sourceReady:()=>familyInvestigationSourceReady(id)})))}
familyInvestigationRegisterBook();
