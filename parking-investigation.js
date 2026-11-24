/* The street investigation uses public context, a fictional staff login and ordinary record search. */
const PARKING_SITE = 'https://parking.huai.example';
const PARKING_PLACES = {
  qinghuai: {name:'青槐陪伴室',code:'HX',date:'2023年11月2日',title:'关于青槐陪伴室场地移交及资料保管的公告',body:'青槐陪伴室原址为旧儿童院东楼。自本公告发布之日起，场地封存，不再接收未成年人，不设夜间接待人员。原青槐家庭陪伴服务部的历史委托台账，由归家家庭服务中心代为保管。旧车辆备案名称暂不变更。',scene:'web-bg-records'},
  wanghe: {name:'望河服务点',code:'WH',date:'2025年3月10日',title:'望河服务点搬迁与资料查阅安排',body:'望河服务点已迁至沿江路16号。日常业务为高龄居民助餐、陪诊及接送。原站点的车辆签收与用品移交记录按月保存，由值班窗口提供查阅。',scene:'web-bg-civic'},
  north: {name:'北站便民点',code:'BZ',date:'2026年7月5日',title:'北站便民点夏季服务安排',body:'北站便民点位于客运站西侧，提供轮椅、雨具借用及旅客临时休息服务。夜间不设住宿床位。外借用品与站内交接记录分别装袋存档。',scene:'web-bg-street'},
  dongqiao: {name:'东桥日间照料站',code:'DQ',date:'2024年6月19日',title:'东桥日间照料站接送登记公告',body:'本站为社区长者提供日间照料，日常接送截至18时30分。提前预约的延时交接、遗留物领取由值班窗口办理，窗口留守至19时30分。就餐、药品寄存与接送记录独立保管。住户及家属可通过资料窗口查阅历史交接内容。',scene:'web-bg-civic'},
  river: {name:'清河衣物接收处',code:'QH',date:'2026年8月1日',title:'清河衣物接收处八月捐赠接收说明',body:'接收处整理社区捐赠的衣物、玩具及床上用品，不提供人员安置服务。承运车辆到达后按包登记；整批衣物和单件玩具可能同车、分袋入库。',scene:'web-bg-records'}
};
const PARKING_VEHICLES = [
  ['2108','16:42','16:59','银灰色轿车','wanghe','助餐用具四箱，司机签收后离开。'],
  ['3852','16:57','17:13','白色厢式货车','river','棉被六包，无随车乘客。'],
  ['6601','17:09','17:31','深蓝色面包车','dongqiao','接回一位长者，陪同人穿灰色衬衫。'],
  ['1149','17:21','17:39','白色七座车','north','站内工作人员两人，携带清洁用品。'],
  ['7823','17:36','17:58','黑色轿车','wanghe','陪诊返程，乘客拄手杖。'],
  ['5062','17:43','18:03','白色七座车','qinghuai','空车到站。后备箱取出两只折叠椅。'],
  ['1935','17:47','18:05','白色厢式货车','river','捐赠衣物十一包，车身印有货运字样。'],
  ['7410','17:52','18:14','银灰色七座车','dongqiao','乘客两人，家属在车旁交接药盒。'],
  ['8264','17:56','18:20','白色七座车','north','一位女士与孩子同行，携黄色书包。'],
  ['3328','17:59','18:19','棕色轿车','qinghuai','物资清点员到站，提纸箱一只。'],
  ['6194','18:02','18:21','白色七座车','wanghe','乘客是一位老人，随身是红色手提袋。'],
  ['7209','18:04','18:23','白色面包车','river','货物是旧外套和两袋玩具，无未成年人同行。'],
  ['5820','18:05','18:25','黑色七座车','dongqiao','司机独自还车，后排没有乘客。'],
  ['4176','18:06','18:26','白色七座车','qinghuai','后窗登记贴：家庭陪伴。女孩独自乘车；到站后司机从座椅下取出蓝色玩具鲸鱼，一并交入接收箱。'],
  ['8653','18:06','18:24','银灰色厢式货车','river','配送纸箱与封箱胶带，卸货后驶离。'],
  ['2917','18:08','18:27','白色轿车','wanghe','助餐人员交回保温箱。'],
  ['6482','18:10','18:34','白色七座车','dongqiao','母女同行，女儿已成年，携折叠轮椅。'],
  ['5304','18:12','18:31','灰色面包车','river','待清洗衣物六袋，无人员交接。'],
  ['9031','18:14','18:39','白色七座车','north','送还轮椅两辆，当日无未成年人同行。'],
  ['1587','18:18','18:40','白色七座车','qinghuai','司机与搬运员到站，卸下绿色兔子等捐赠玩具。'],
  ['4620','18:23','18:41','蓝色货车','river','空箱回收，签收人姓陈。'],
  ['8741','18:29','18:50','白色轿车','wanghe','一名男性领取家人遗落的药袋。'],
  ['3076','18:37','19:01','白色七座车','north','雨具回收四箱，无乘客登记。'],
  ['9258','18:45','19:04','灰色轿车','dongqiao','家属领取长者白天寄存的衣物。']
].map(([id,left,arrived,color,place,note])=>({id,left,arrived,color,place,note}));
const PARKING_ARCHIVES = {
  qinghuai:[
    ['01','16:48','床单两包','后勤用品','后勤交来洗净床单两包，经办人清点入柜。'],
    ['02','17:32','雨具 / 深蓝外套','临借物品','借出雨衣三件，其中一件为成人尺寸；17:55全部归还。'],
    ['03','18:04','浅色外套 / 蓝色鲸鱼','家属同行','王女士带孩子借雨衣。离开时已取回鲸鱼玩具，由家属签收。'],
    ['04','18:26','奶白色外套 / 蓝色鲸鱼','车辆交接','女孩独自到站。司机从车座下取出鲸鱼，一并移交。女孩拿到后一直抱着，不肯放下。'],
    ['05','18:26','奶白色外套 / 绿色兔子','用品清点','前日留库衣物、玩具清点。绿色兔子一只；本袋无儿童登记。'],
    ['06','18:31','灰色手提袋','遗留物品','工作人员在门边发现手提袋，内为旧杯子和一双拖鞋。'],
    ['07','18:40','绿色兔子 / 积木','捐赠入库','槐A·1587送到两箱旧玩具。包装纸注明物资捐赠，不随人员转移。'],
    ['08','18:47','白外套 / 儿童雨鞋','家属寄存','一名女士暂存孩子替换衣物，19:12本人取回，无接送记录。'],
    ['09','19:03','蓝色鲸鱼图案书包','物品认领','书包为白底蓝色印花，内有成人培训讲义，失主当晚认领。'],
    ['10','19:16','陪伴室钥匙两把','站务交接','晚班交接钥匙，与本日接收箱分别保管。'],
    ['11','19:28','奶白色针织衫','衣物退回','衣物缺少包装标签，暂存待领柜，无人员登记。'],
    ['12','19:45','空箱 / 旧封条','库房清点','清点空接收箱四只，旧封条单独收袋留存。']
  ],
  wanghe:[['01','17:00','保温箱 / 餐具','助餐用品','助餐用具清点归还，共四箱。'],['02','18:21','老人 / 红手提袋','乘客签收','黄先生到站，由女儿接回，红色手提袋当面交还。'],['03','18:27','保温箱两只','用品归还','本袋只记录餐箱数量，无随车人员。'],['04','18:50','药袋 / 挂号单','代领物品','家属出示登记后取走药袋。']],
  north:[['01','17:39','清洁用品','物资接收','站内人员将清洁用品存入西侧库房。'],['02','18:20','女士 / 黄色书包','旅客休息','女士与孩子休息十五分钟，随后一起进入售票厅。'],['03','18:39','轮椅两辆','借用归还','两辆借用轮椅已归还，没有人员交接。'],['04','19:01','雨伞四箱','雨具回收','雨具分箱清点，留存外包装标签。']],
  dongqiao:[['01','17:31','长者 / 灰衬衫家属','陪同登记','家属陪同长者到站领取午间遗留的药盒。'],['02','18:14','药盒 / 毛毯','用品交接','两位长者由登记家属接回，用品当面清点。'],['03','18:25','钥匙 / 行车单','车辆归还','司机归还车辆钥匙，后排无人。'],['04','18:34','母女 / 折叠轮椅','家属接回','母女均为成年人，按预约回家；轮椅为家属自带。']],
  river:[['01','18:05','旧外套十一包','衣物捐赠','旧外套分类封包，等待清洗。'],['02','18:23','旧衣 / 玩具两袋','捐赠交接','白色面包车送来旧衣物；玩具含红色小熊，无人员交接。'],['03','18:24','纸箱 / 封箱胶带','耗材到货','银灰色货车配送耗材，承运人独自签收。'],['04','18:31','待洗衣物六袋','用品入库','六袋衣物移交清洗点。']]
};

function parkingStageReady(){return Boolean(S.flags.leadReviewed||S.flags.followup||S.flags.matched||S.flags.found||S.flags.done)}
function syncParkingInvestigation() {
  const p=S.puzzle;if(!p)return;
  if(!S.inquiry)syncInquiry();
  if(!p.parking){
    const continued=Boolean(S.flags.followup||S.flags.matched||S.flags.found||S.flags.done);
    p.parking={version:1,loggedIn:continued,accessGranted:continued,viewedVehicles:continued?['4176']:[],searched:continued?['qinghuai']:[],filter:{from:'',to:''}};
    if(!continued){p.cameraReady=false;p.vehicle='';p.intake='';if(S.inquiry){S.inquiry.routeVerified=false;S.inquiry.custodyVerified=false}}
  }
  p.parking.accessGranted??=p.parking.loggedIn;p.parking.viewedVehicles??=[];p.parking.searched??=[];p.parking.filter??={from:'',to:''};
  if(p.parking.version<2){
    if(!parkingStageReady()){
      p.cameraReady=false;p.vehicle='';p.intake='';S.inquiry.routeVerified=false;S.inquiry.custodyVerified=false;
      if(S.history.wife)S.history.wife=S.history.wife.filter(m=>!String(m.contentId||'').startsWith('family-v1-stage-routeVerified-'));
      if(S.familyStory?.stages)delete S.familyStory.stages.routeVerified;
    }
    p.parking.version=2;
  }
  if(parkingStageReady()&&p.parking.accessGranted&&p.parking.viewedVehicles.includes('4176')){p.cameraReady=true;p.vehicle='4176';S.inquiry.routeVerified=true}
}
const parkingOriginalSync=syncPuzzle;
syncPuzzle=function(){parkingOriginalSync();syncParkingInvestigation()};
function parkingMaySearch(id){const p=S.puzzle.parking;return parkingStageReady()&&!!p?.accessGranted&&p.viewedVehicles.some(key=>PARKING_VEHICLES.find(v=>v.id===key)?.place===id)}
function parkingCanDiscover(id){return parkingMaySearch(id)&&S.puzzle.parking.searched.includes(id)}
function parkingLink(label,path,cls='pk-link'){return `<button class="${cls}" data-a="url" data-url="${E(/^https?:/.test(path)?path:PARKING_SITE+path)}">${E(label)}</button>`}
function parkingUnavailable(){return '<div class="safari-error"><h2>页面不存在</h2><p>此地址无法访问。</p></div>'}
function parkingShell(title,body,privatePage=false){return `<div class="pk-site" style="--pk-scene:url('${asset('web-bg-street')}')"><header>${parkingLink('榆树路便民停车','/','pk-brand')}<span>YUSHU ROAD · COMMUNITY PARKING</span></header><nav>${parkingLink('服务首页','/')}${parkingLink('站点公告','/notices')}${parkingLink('联系我们','/contact')}</nav><main><h1>${E(title)}</h1>${body}</main><footer><span>槐城街道便民停车服务站</span>${parkingLink(privatePage?'退出登录':'值班入口',privatePage?'/logout':'/staff','pk-footer-link')}</footer></div>`}
function parkingHome(){return parkingShell('街巷有序，出行安心',`<div class="pk-hero"><img src="${asset('web-bg-street')}" alt="榆树路老城街景"><span>榆树路临停服务区</span></div><p>服务区位于榆树路西段，接送车辆请即停即走。接送、装卸及居民临停记录按日归档。</p><section class="pk-news"><h2>服务公告</h2>${parkingLink('旧终端账户迁移说明','/notices/terminal')}${parkingLink('榆树路便民停车服务区正式启用','/notices/opening')}${parkingLink('九月值班安排','/contact')}</section>`)}
function parkingPublic(path){
  if(path==='/')return parkingHome();
  if(path==='/notices')return parkingShell('站点公告',`${parkingLink('旧终端账户迁移说明 · 2026-08-30','/notices/terminal')}${parkingLink('榆树路便民停车服务区正式启用 · 2018-04-16','/notices/opening')}`);
  if(path==='/notices/opening')return parkingShell('榆树路便民停车服务区正式启用',`<time>2018年4月16日 09:00 · 站务办公室</time><p>今日起，榆树路西段临时停车服务区正式启用，接送车辆可按现场标识停靠。本站登记代码为 YS，用于车辆及终端记录。车管终端使用网络自动授时。</p><p>白天由沿街商户协助值守，晚间由街道值班人员接班。车辆记录按离场时间归档。</p>`);
  if(path==='/notices/terminal')return parkingShell('旧终端账户迁移说明',`<time>2026年8月30日 15:40 · 系统维护</time><p>旧终端数据已迁入网页值班端。请使用站务名册上的工号登录，字母不区分大小写。</p><p>2018批次未换卡的账户继续使用原卡口令。该批制卡规格：站点代码使用小写字母，启用日期为八位数字，两项连续印制。请有关值班人员于本次轮班后领取新卡。</p><p>本站没有电话口令重置服务，请勿向陌生人提供登录信息。</p>`);
  if(path==='/contact')return parkingShell('联系我们',`<p>榆树路西段12号 · 便民值班亭</p><div class="pk-roster"><h2>九月值班名册</h2><time>2026年9月1日 08:00</time><dl><dt>白班 / 周志成（小周五金）</dt><dd>工号 ZC0716 · 07:00—19:00</dd><dt>夜班 / 黄文海</dt><dd>工号 HW0321 · 19:00—07:00</dd></dl></div><p>设备报修请联系值班亭；车辆出入记录仅在值班端留存。</p>`);
  return null;
}
function parkingLogin(){return parkingShell('值班登录',`<form class="pk-form" data-form="pk-login"><label>工号<input name="account" autocomplete="off" required value="${E(S.formDrafts?.['pk-login']?.account||'')}"></label><label>口令<input name="password" type="password" autocomplete="off" required></label><p class="pk-error" role="status">${E(R.parkingError||'')}</p><button type="submit">登录</button></form>`)}
function parkingRecords(){
  const s=S.puzzle.parking;if(!s.loggedIn)return parkingLogin();
  const {from,to}=s.filter;
  const rows=PARKING_VEHICLES.filter(v=>(!from||v.left>=from)&&(!to||v.left<=to));
  return parkingShell('车辆出入记录',`<div class="pk-session">周志成 · ZC0716<span>2026年8月13日</span></div><form class="pk-filter" data-form="pk-record-search"><label>离场时间<input name="from" type="time" value="${E(from)}" aria-label="开始时间"></label><span>至</span><label><span class="pk-sr-only">结束时间</span><input name="to" type="time" value="${E(to)}" aria-label="结束时间"></label><button>查询</button></form><div class="pk-record-count">共 ${rows.length} 条记录 ${from||to?parkingLink('全部记录','/records?all=1','pk-text-link'):''}</div><div class="pk-table-wrap"><table><thead><tr><th>离场</th><th>车辆</th><th>登记去向</th></tr></thead><tbody>${rows.map(v=>`<tr><td><time>${v.left}</time></td><td>${parkingLink('槐A·'+v.id,'/vehicle/'+v.id,'pk-plate')}<small>${v.color}</small></td><td>${PARKING_PLACES[v.place].name}</td></tr>`).join('')}</tbody></table>${rows.length?'':'<p class="pk-empty">该时段没有车辆记录。</p>'}</div>`,true);
}
function parkingVehicle(id){
  const s=S.puzzle.parking;if(!s.loggedIn)return parkingLogin();
  const vehicle=PARKING_VEHICLES.find(v=>v.id===id);if(!vehicle)return parkingUnavailable();
  if(!s.viewedVehicles.includes(id)){s.viewedVehicles.push(id);persist()}
  if(id==='4176'&&parkingStageReady()){S.puzzle.cameraReady=true;S.puzzle.vehicle=id;S.inquiry.routeVerified=true;persist()}
  return parkingShell('槐A·'+id,`<div class="pk-trip"><span>行车记录 / 2026年8月13日</span><h2>${vehicle.color}</h2><dl><dt>离场</dt><dd>榆树路临停区 · ${vehicle.left}</dd><dt>到站</dt><dd>${PARKING_PLACES[vehicle.place].name} · ${vehicle.arrived}</dd><dt>车单备注</dt><dd>${vehicle.note}</dd></dl><p>记录来源：当日随车交接单<br>登记员：周志成 / ZC0716</p></div>${parkingLink('返回车辆记录','/records')}`,true);
}
function parkingCamera(){return puzzleShell('榆树路站棚 · 0813 留存',`<div class="pz-camera-frame"><img src="${asset('bus-shelter')}" alt="榆树路站棚留存画面"><time>2026/08/13　18:14:00</time><span>YS-02 / 暂停</span></div><div class="pk-camera-info"><h1>榆树路站棚录像原片</h1><dl><dt>录像设备</dt><dd>榆树路站棚录像机 · YS-02</dd><dt>导出时间</dt><dd>2026-08-13 20:46</dd><dt>文件状态</dt><dd>原始画面 / 只读</dd><dt>保管人</dt><dd>榆树路沿街商户</dd></dl></div>`,'camera')}
function parkingPlace(id){const d=PARKING_PLACES[id];if(!d||!parkingCanDiscover(id))return parkingUnavailable();const p=S.puzzle.parking;p.placesRead=p.placesRead||{};p.placesRead[id]=true;persist();return `<div class="pk-destination" style="--pk-place-scene:url('${asset(d.scene)}')"><header><span>槐城社区服务资料室</span><strong>${E(d.name)}</strong></header><article><p class="pk-document-type">场地与资料保管</p><h1>${E(d.title)}</h1><time>${d.date} 10:00</time><p>${E(d.body)}</p><p>历史交接资料由归家寻亲档案室按原编号保存。</p><p class="manual-source-reference">移交范围：${E(d.name)} · 2026年8月交接目录</p></article><footer>槐城社区服务资料室 · 档案查阅</footer></div>`}
function parkingArchiveLink(id,folder){return 'https://records.guijia.example/place/'+id+'/folder/'+folder}
function parkingIntake(id='qinghuai'){
  if(!parkingCanDiscover(id))return parkingUnavailable();const d=PARKING_PLACES[id],rows=PARKING_ARCHIVES[id];
  return `<div class="pk-archive" style="--archive-scene:url('${asset('web-bg-records')}')"><header><span>${E(d.name)} · 交接目录</span><h1>2026年8月13日</h1><p>${rows.length} 份留存记录</p></header><div class="pk-envelopes">${rows.map(([key,time,title,kind])=>`<button class="pk-envelope" data-a="url" data-url="${parkingArchiveLink(id,key)}" aria-label="${d.code}-0813-${key} ${time} ${E(title)}"><img src="${asset('intake-envelope')}" alt="" aria-hidden="true"><span class="pk-envelope-label"><b>${d.code}-0813-${key}</b><time>${time}</time><span>${E(title)}</span><small>${E(kind)}</small></span></button>`).join('')}</div></div>`;
}
function parkingFolder(id,key){
  if(!parkingCanDiscover(id))return parkingUnavailable();const d=PARKING_PLACES[id],f=PARKING_ARCHIVES[id]?.find(x=>x[0]===key);if(!f)return parkingUnavailable();
  const good=id==='qinghuai'&&key==='04';
  if(good&&S.flags.leadReviewed&&S.puzzle.vehicle==='4176'){S.puzzle.intake='04';S.inquiry.custodyVerified=true;persist()}
  return `<div class="pk-folder-page" style="--archive-scene:url('${asset('web-bg-records')}')"><div class="pk-folder-heading"><span>${E(d.name)}</span><h1>${d.code}-0813-${key}</h1><time>2026年8月13日 ${f[1]}</time></div><article class="pk-paper"><div class="pk-paper-stamp">${E(f[3])}</div><h2>${E(f[2])}</h2><p>${E(f[4])}</p>${good?`<section class="pk-attached-slip"><h3>西郊站 · 换箱条</h3><time>2026年8月13日 18:50</time><p>接收箱号 HX-0813-04。原随车物品与接收袋一同移交，留存联由西郊救助站保管。</p><p>经办处：西郊站资料窗口</p>${S.flags.followup&&S.day>=23?`<p class="pk-mail-date">9月23日 14:08 · 站方回复</p><p>已收到家属留言，正在查阅当年交接资料及近日接收记录。</p>`:''}${S.puzzle.intake==='04'?puzzleButton(S.flags.followup?'查看联络记录':'联系西郊站资料窗口','pz-transfer-open'):''}</section>`:''}</article>${parkingLink('返回交接目录','https://records.guijia.example/place/'+id+'/intake')}</div>`;
}
function parkingSearch(q,place){
  const normalized=String(q).normalize('NFKC').replace(/\s/g,'');
  const rows=[];
  if(place){if(parkingMaySearch(place)){if(!S.puzzle.parking.searched.includes(place)){S.puzzle.parking.searched.push(place);persist()}const d=PARKING_PLACES[place];rows.push([d.name+' · 场地与资料服务','https://service.huai.example/places/'+place,'槐城社区服务资料室 · 场地公告及历史资料查阅。'])}}
  else if(/榆树路便民停车|停车|临停|小周五金/.test(normalized))rows.push(['榆树路便民停车 · 官方网站',PARKING_SITE+'/','榆树路临停服务区，站点公告、服务信息与联系方式。']);
  return `<div class="web-search-engine rw-search"><form data-form="web-global"><span>搜索</span><input aria-label="搜索网页" value="${E(q)}" placeholder="搜索或输入网址"><button aria-label="搜索">${ico('search')}</button></form><nav><b>全部</b><span>网页</span><span>资讯</span></nav><div class="rw-search-summary">${rows.length?'找到 '+rows.length+' 条相关内容':'搜索结果'}</div>${rows.map(([title,url,desc])=>`<button class="engine-result" data-a="url" data-url="${url}"><small>${new URL(url).hostname}</small><h2>${title}</h2><p>${desc}</p></button>`).join('')||'<p class="native-empty">没有找到相关结果</p>'}</div>`;
}
function parkingSearchPlace(q){const text=String(q).normalize('NFKC').replace(/\s/g,'');return Object.entries(PARKING_PLACES).find(([id,p])=>text.includes(p.name)||id==='qinghuai'&&/青槐|旧儿童院|陪伴室|东楼封存/.test(text)||id==='wanghe'&&/望河服务/.test(text)||id==='north'&&/北站便民/.test(text)||id==='dongqiao'&&/东桥.*照料/.test(text)||id==='river'&&/清河.*衣物/.test(text))?.[0]}
const parkingOldWeb=puzzleWeb;
puzzleWeb=function(u){
  syncParkingInvestigation();const host=u.hostname,path=u.pathname;
  if(host==='search.example'){
    const q=u.searchParams.get('q')||'',place=parkingSearchPlace(q);
    if(place||/榆树路便民停车|停车|临停|小周五金/.test(q))return parkingSearch(q,place);
    if(/归家资料|委托转介|接收记录|台账|档案查阅/.test(q)&&!parkingCanDiscover('qinghuai'))return parkingSearch(q,null);
  }
  if(host==='parking.huai.example'){
    const page=parkingPublic(path);if(page!==null)return page;
    if(path==='/logout'){S.puzzle.parking.loggedIn=false;persist();return parkingLogin()}
    if(path==='/staff')return S.puzzle.parking.loggedIn?parkingRecords():parkingLogin();
    if(path==='/records'){if(u.searchParams.has('all'))S.puzzle.parking.filter={from:'',to:''};return parkingRecords()}
    if(path.startsWith('/vehicle/'))return parkingVehicle(path.split('/').pop());
    return parkingUnavailable();
  }
  if(host==='street.huai.example'&&path==='/parking/0813')return S.puzzle.parking.loggedIn?parkingRecords():parkingHome();
  if(host==='street.huai.example'&&path.startsWith('/vehicle/'))return parkingVehicle(path.split('/').pop());
  if(host==='service.huai.example'&&path==='/notice/37')return parkingPlace('qinghuai');
  if(host==='service.huai.example'&&path.startsWith('/places/'))return parkingPlace(path.split('/').pop());
  if(host==='news.huai.example'&&path.includes('qinghuai')&&!parkingCanDiscover('qinghuai'))return parkingUnavailable();
  if(host==='records.guijia.example'){
    if(path==='/'||path==='/intake')return parkingIntake();
    if(/^\/folder\//.test(path))return parkingFolder('qinghuai',path.split('/').pop());
    const m=path.match(/^\/place\/([a-z]+)\/(intake|folder)(?:\/(\d+))?$/);
    return m?(m[2]==='intake'?parkingIntake(m[1]):parkingFolder(m[1],m[3])):parkingUnavailable();
  }
  return parkingOldWeb(u);
};
const parkingOldSubmit=puzzleSubmit;
puzzleSubmit=function(kind,d,...rest){
  if(!kind.startsWith('pk-'))return parkingOldSubmit(kind,d,...rest);
  if(!requirePhoneNetwork())return true;R.parkingError='';
  if(kind==='pk-login'){
    if(String(d.get('account')||'').trim().toLowerCase()==='zc0716'&&d.get('password')==='ys20180416'){S.puzzle.parking.loggedIn=true;S.puzzle.parking.accessGranted=true;delete S.formDrafts?.['pk-login'];browse(PARKING_SITE+'/records')}
    else{R.parkingError='工号或口令错误，请重新输入。';render()}
  }else if(kind==='pk-record-search'&&S.puzzle.parking.loggedIn){
    const from=String(d.get('from')||''),to=String(d.get('to')||'');S.puzzle.parking.filter={from:/^\d{2}:\d{2}$/.test(from)?from:'',to:/^\d{2}:\d{2}$/.test(to)?to:''};render();
  }
  persist();return true;
};
syncParkingInvestigation();
