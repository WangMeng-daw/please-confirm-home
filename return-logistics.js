/* Fictional linen-service records. The paper handover slip is required for private queries. */
const RETURN_LOGISTICS_SITE = 'https://linen.huai.example';
const RETURN_LOGISTICS_RECORDS = [
  {id:'L-0918-01',source:'东楼旧机柜 E1-03',exit:'A',item:'白色床单',quantity:'6 件',weight:'3.6 kg',sealed:'15:42',collected:'15:50',destination:'青槐社区物资库',received:'16:20',sealStatus:'封签完整',note:'整袋清点，外袋干燥。'},
  {id:'L-0918-02',source:'西楼旧机柜 W2-06',exit:'C',item:'浅灰窗帘',quantity:'2 幅',weight:'4.1 kg',sealed:'15:52',collected:'16:00',destination:'洁衣城西洗护车间',received:'16:45',sealStatus:'封签完整',note:'挂钩另装小袋，随袋交接。'},
  {id:'L-0918-03',source:'东楼旧机柜 E2-09',exit:'B',item:'蓝色被套',quantity:'4 件',weight:'3.0 kg',sealed:'16:18',collected:'16:25',destination:'西郊救助站',received:'17:15',sealStatus:'封签完整',note:'洗护后周转物，按联单原袋移交。'},
  {id:'L-0918-04',source:'东楼旧机柜 E2-17',exit:'B',item:'毛巾、薄被',quantity:'1 袋',weight:'3.2 kg',sealed:'16:32',collected:'16:40',destination:'西郊救助站',received:'17:15',sealStatus:'封签完整',note:'侧兜已扣合。封袋完整，按联单原袋移交。'},
  {id:'L-0918-05',source:'西楼旧机柜 W1-08',exit:'A',item:'棉质桌布',quantity:'5 块',weight:'2.7 kg',sealed:'16:38',collected:'16:45',destination:'榆树路社区布草库',received:'17:30',sealStatus:'封签完整',note:'旧标签保留，数量以本次清点为准。'},
  {id:'L-0918-06',source:'东楼旧机柜 E3-02',exit:'C',item:'隔断布帘',quantity:'3 幅',weight:'5.4 kg',sealed:'16:57',collected:'17:05',destination:'洁衣城西洗护车间',received:'18:00',sealStatus:'封签完整',note:'布边磨损两处，收件时已注明。'},
  {id:'L-0918-07',source:'西楼旧机柜 W2-17',exit:'A',item:'清洁擦布',quantity:'12 块',weight:'1.8 kg',sealed:'17:12',collected:'17:20',destination:'青槐社区保洁库',received:'17:55',sealStatus:'封签完整',note:'单独封装，与床品分车周转。'},
  {id:'L-0918-08',source:'东楼旧机柜 E1-12',exit:'B',item:'枕套、枕巾',quantity:'8 件',weight:'2.1 kg',sealed:'17:37',collected:'17:45',destination:'洁衣城西洗护车间',received:'18:25',sealStatus:'封签完整',note:'到站复核件数一致，已入待洗区。'}
];

function returnLogisticsState(){
  const s=clueState();
  s.logistics??={version:1,query:{batch:'',code:''},authorized:false,records:[],error:''};
  s.logistics.query??={batch:'',code:''};
  s.logistics.records??=[];
  return s.logistics;
}

function returnLogisticsHasSlip(){return Boolean(clueState().known['dp-laundry-tag']);}

function returnLogisticsSearch(q){
  if(!returnLogisticsHasSlip())return null;
  const text=String(q||'').normalize('NFKC').replace(/\s/g,'');
  if(!/槐城洁衣|洁衣周转|洁衣洗护|linen\.huai\.example/i.test(text))return null;
  return {title:'槐城洁衣 · 布草洗护与周转服务',url:RETURN_LOGISTICS_SITE+'/',desc:'社区床品洗护、布草周转与整袋交接。服务介绍、业务公告及周转联单查询。'};
}

function returnLogisticsLink(title,path){return clueLink(title,RETURN_LOGISTICS_SITE+path);}

function returnLogisticsShell(title,body,section=''){
 let path='/';try{path=new URL(typeof currentURL==='function'?currentURL():RETURN_LOGISTICS_SITE).pathname}catch{}
 const home=section==='home',active=home?'home':path.startsWith('/services')?'services':path.startsWith('/notices')?'notices':'query';
 const menu=[['首页','/','home'],['服务项目','/services','services'],['业务公告','/notices','notices'],['周转查询','/query','query']].map(([label,path,id])=>`<a class="clue-link" href="${RETURN_LOGISTICS_SITE+path}" data-a="url" data-url="${RETURN_LOGISTICS_SITE+path}" ${id===active?'aria-current="page"':''}>${label}</a>`).join('');
 return `<div class="clue-page return-logistics-page linen-site-v2 ${home?'linen-homepage':'linen-innerpage'}" style="--linen-brand-photo:url('${asset('site-bg-linen')}')"><header class="linen-mast"><div class="linen-location">槐城 · 社区洗护服务</div><a class="linen-wordmark" href="${RETURN_LOGISTICS_SITE}/" data-a="url" data-url="${RETURN_LOGISTICS_SITE}/"><span class="linen-logo-word" aria-hidden="true">洁衣</span><span><strong>槐城洁衣</strong><small>布草洗护 · 周转配送</small></span></a><nav aria-label="槐城洁衣网站导航">${menu}</nav></header><article>${home?'':`<div class="linen-page-heading"><span>${active==='query'?'周转业务 / 联单服务':active==='services'?'业务范围 / 洗护与收送':'服务动态 / 业务公告'}</span><h1>${E(title)}</h1></div>`}${body}</article><footer><strong>槐城洁衣</strong><span>洗护到位，交接清楚。</span><p>槐城洁衣服务有限公司<br>周一至周六 08:30—17:30</p><div>${returnLogisticsLink('服务项目','/services')}${returnLogisticsLink('周转查询','/query')}</div><small>交接联由双方分别留存</small></footer></div>`
}

function returnLogisticsHome(){return returnLogisticsShell('社区布草洗护与收送',`<section class="linen-brand-hero"><div><span class="linen-hero-label">槐城洁衣 · 社区服务</span><h1>社区布草<br>洗护与收送</h1><p>床品 · 窗帘 · 社区周转物</p>${returnLogisticsLink('了解服务项目','/services')}</div></section><section class="linen-quick-query"><div><small>周转联单</small><h2>这袋物品，送到哪了？</h2><p>查询收件、送达及交接记录。</p></div>${returnLogisticsLink('进入查询','/query')}</section><section class="linen-services-overview" aria-label="主要服务"><a href="${RETURN_LOGISTICS_SITE}/services" data-a="url" data-url="${RETURN_LOGISTICS_SITE}/services"><span>01</span><strong>分类洗护</strong><small>床品与窗帘</small></a><a href="${RETURN_LOGISTICS_SITE}/services" data-a="url" data-url="${RETURN_LOGISTICS_SITE}/services"><span>02</span><strong>定期收送</strong><small>社区服务点</small></a><a href="${RETURN_LOGISTICS_SITE}/services" data-a="url" data-url="${RETURN_LOGISTICS_SITE}/services"><span>03</span><strong>封袋代送</strong><small>原袋与原联</small></a></section><section class="linen-updates"><div class="linen-section-heading"><h2>服务公告</h2>${returnLogisticsLink('全部公告','/notices')}</div><ul class="linen-notices"><li><time>09 / 16</time>${returnLogisticsLink('9月旧院周转物交接安排','/notices/20260916')}</li><li><time>09 / 12</time>${returnLogisticsLink('雨天收送与外袋防潮提醒','/notices/20260912')}</li></ul></section>`,'home')}

function returnLogisticsQuery(){const state=returnLogisticsState();return returnLogisticsShell('周转联单查询',`<div class="linen-query-intro"><img src="${asset('ui-sealed-bag')}" alt="带着交接联的标准周转布袋"><p>输入纸质联单上的批次与六位交接码。</p></div><form class="web-form linen-query-form" data-form="rl-query"><label>查询批次<input name="batch" required autocomplete="off" maxlength="20" value="${E(state.query.batch)}"></label><label>交接码<input name="code" required inputmode="numeric" autocomplete="off" maxlength="6" value="${E(state.query.code)}"></label><p class="web-error" role="status">${E(state.error||'')}</p><button class="web-primary" type="submit">查询</button></form><p class="clue-meta">同一联单可查当日合并清单。字迹不清时，请向原经办人核对。</p>${state.authorized&&returnLogisticsHasSlip()?returnLogisticsLink('查看本次查询记录','/records'):''}`)}

function returnLogisticsRecords(){const state=returnLogisticsState();if(!returnLogisticsHasSlip()||!state.authorized)return returnLogisticsQuery();return returnLogisticsShell('9月18日 · 周转清单',`<div class="linen-manifest-meta"><span>2026 · 旧院存放物</span><span>${state.records.length} 袋已签收</span></div><div class="linen-manifest">${state.records.map(row=>`<a class="linen-manifest-row" href="${RETURN_LOGISTICS_SITE+'/records/'+row.id}" data-a="url" data-url="${RETURN_LOGISTICS_SITE+'/records/'+row.id}"><div><strong>${E(row.id)}</strong><time>${E(row.collected)}</time></div><p>${E(row.item)} <span>${E(row.quantity)}</span></p><small>${E(row.destination)}</small></a>`).join('')}</div>${returnLogisticsLink('返回查询','/query')}`)}

function returnLogisticsRecord(id){const state=returnLogisticsState();if(!returnLogisticsHasSlip()||!state.authorized)return returnLogisticsQuery();const index=state.records.findIndex(row=>row.id===id),row=state.records[index];if(!row)return returnLogisticsShell('周转记录','<p>未查询到记录。</p>'+returnLogisticsLink('返回当日清单','/records'));if(id==='L-0918-04')clueRead('laundry-route',{source:'槐城洁衣周转联单',date:'2026-09-18',batch:id});const previous=state.records[index-1],next=state.records[index+1];return returnLogisticsShell(row.id,`<div class="linen-manifest-meta"><span>2026年9月18日 · 周转记录</span><span>已签收</span></div><section class="linen-waybill"><div class="linen-waybill-stop"><span class="linen-stop-label">收</span><div><h2>${E(row.source)}</h2><p>出库口代号 <strong>${E(row.exit)}</strong> · ${E(row.collected)} 提货</p></div></div><div class="linen-waybill-stop"><span class="linen-stop-label">送</span><div><h2>${E(row.destination)}</h2><p>${E(row.received)} 核对封签后签收</p></div></div></section><dl class="linen-parcel-facts"><div><dt>登记品类</dt><dd>${E(row.item)}</dd></div><div><dt>数量 / 重量</dt><dd>${E(row.quantity)} / ${E(row.weight)}</dd></div><div><dt>封袋状态</dt><dd>${E(row.sealStatus||'封签完整')}</dd></div><div><dt>清点封袋</dt><dd>${E(row.sealed)}</dd></div></dl><section class="linen-record-note"><h2>经办备注</h2><p>${E(row.note)}</p></section><p class="clue-meta">收件位置与出口代号按寄件方原联保留。</p><nav class="linen-record-pager" aria-label="周转记录翻页">${previous?returnLogisticsLink('上一袋','/records/'+previous.id):'<span></span>'}${returnLogisticsLink('当日清单','/records')}${next?returnLogisticsLink('下一袋','/records/'+next.id):'<span></span>'}</nav>`)}

function returnLogisticsWeb(u){
  if(u.hostname!=='linen.huai.example')return null;
  const path=u.pathname.replace(/\/+$/,'')||'/';
  if(path==='/')return returnLogisticsHome();
  if(path==='/query')return returnLogisticsQuery();
  if(path==='/records')return returnLogisticsRecords();
  if(path.startsWith('/records/')){
    let id;try{id=decodeURIComponent(path.slice('/records/'.length));}catch{return returnLogisticsShell('周转记录','<p>未查询到记录。</p>');}
    return returnLogisticsRecord(id);
  }
  if(path==='/services')return returnLogisticsShell('服务项目',`<figure class="linen-workshop-photo"><img src="${asset('linen-service')}" alt="分类收送与布草工作区"><figcaption>按袋登记 · 分区洗护</figcaption></figure><h2>布草分类洗护</h2><p>床单、被套、枕巾依材质分类处理；窗帘与隔断布单独登记，拆下的配件随袋交接。已破损的物品在收件时记录，不与完好件混装。</p><h2>社区周转收送</h2><p>为服务点之间的布草调拨提供定期收送。每袋单独编号，登记数量、重量与送达单位。合并调度不合并封签，签收单位按袋验收。</p><h2>封袋代送</h2><p>已经清点封装的存放物可按原袋移交，不拆换内袋。交接时核对封签和外袋状态，物品用途与归属由委托单位负责登记。</p><h2>业务受理</h2><p>长期业务由服务站与委托单位约定收送时间。临时增加的物品应另开联单，随袋小件放入侧兜并扣合。</p>${returnLogisticsLink('查看业务公告','/notices')}`);
  if(path==='/notices')return returnLogisticsShell('业务公告',`<ul class="clue-doc-list"><li>${returnLogisticsLink('9月旧院周转物交接安排','/notices/20260916')}<br><small>2026年9月16日</small></li><li>${returnLogisticsLink('雨天收送与外袋防潮提醒','/notices/20260912')}<br><small>2026年9月12日</small></li></ul>`);
  if(path==='/notices/20260916')return returnLogisticsShell('9月旧院周转物交接安排','<p class="clue-meta">2026年9月16日 · 业务通知</p><p>本月旧院存放物分批清点转运。各作业点请保留原周转袋号、机柜位置与出口代号，不以临时用途改写收件位置。</p><p>洗护件与代送件分别登记，装车前核对封签。联单由寄件单位、承运人和签收单位分别留存；同日分车配送，签收时间可能不同。</p><p>签收单位如需查阅合并清单，请使用纸质交接联，不在公开留言中填写交接码。</p>');
  if(path==='/notices/20260912')return returnLogisticsShell('雨天收送与外袋防潮提醒','<p class="clue-meta">2026年9月12日 · 服务提醒</p><p>近期收送请加套防潮外袋，内外袋标签保持一致。潮湿件与干燥件分别交接，封袋前确认随袋配件已装妥。</p><p>如车辆到达时外袋破损或封签脱落，请当面登记并另附说明，不直接改写原始清单。晚于当日收件时段的物品顺延至下一服务日。</p>');
  return returnLogisticsShell('页面未找到','<p>您访问的页面不存在。</p>'+returnLogisticsLink('返回首页','/'));
}

function returnLogisticsSubmit(kind,d){
  if(kind!=='rl-query')return false;
  if(typeof requirePhoneNetwork==='function'&&!requirePhoneNetwork())return true;
  const state=returnLogisticsState();
  const batch=String(d.get('batch')||'').normalize('NFKC').trim().toUpperCase();
  const code=String(d.get('code')||'').normalize('NFKC').trim();
  state.query={batch:batch.slice(0,20),code:code.slice(0,6)};
  state.error='';state.authorized=false;state.records=[];
  if(!returnLogisticsHasSlip()||batch!=='L-0918-04'||code!=='317204'){
    state.error='未查询到记录。';
    persist();render();return true;
  }
  state.authorized=true;
  state.records=RETURN_LOGISTICS_RECORDS.map(row=>({...row}));
  state.queriedAt=typeof phoneStamp==='function'?phoneStamp():'2026年9月24日';

  persist();browse(RETURN_LOGISTICS_SITE+'/records');return true;
}
