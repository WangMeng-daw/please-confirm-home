/* A search index, not a trail of suggested destinations.  Merely searching this
 * index never marks a source read, establishes a friendship, or advances a case. */
function manualDiscoveryText(value){
 return String(value??'').normalize('NFKC').toLowerCase().replace(/[\s·・。，、：:；;！？!?《》「」『』（）()\[\]【】\/\\._—–\-]/g,'');
}
function manualDiscoveryState(){return typeof S==='object'&&S?S:{}}
function manualDiscoveryPrivateReady(){const s=manualDiscoveryState();return Boolean(s.flags?.found&&s.puzzle?.adminFate&&s.clueStory?.known?.['dp-cloud-letter'])}
function manualDiscoveryFamilyReady(id){
 const s=manualDiscoveryState(),k=s.clueStory?.known||{};
 return Boolean(typeof FAMILY_INVESTIGATIONS==='object'&&FAMILY_INVESTIGATIONS[id]&&s.flags?.found&&k['dp-cloud-letter']&&(k['fi-notice:'+id]||k['fi-return:'+id]));
}
function manualDiscoveryFamilyRecordReady(id){return manualDiscoveryFamilyReady(id)&&Boolean(manualDiscoveryState().clueStory?.familyInvestigations?.cases?.[id]?.read?.route)}
function manualDiscoveryBookReady(){const s=manualDiscoveryState();return Boolean(s.flags?.found&&(s.clueStory?.known?.['dp-cloud-letter']||s.flags?.done))}
function manualDiscoveryHistoryReady(){const s=manualDiscoveryState();return Boolean(manualDiscoveryPrivateReady()&&s.flags?.auth&&s.flags?.inner&&s.inquiry?.visited?.shrine)}
function manualDiscoveryParkingReady(id,requirePlaceRead=false){
 const s=manualDiscoveryState();
 return Boolean(typeof PARKING_PLACES==='object'&&PARKING_PLACES[id]&&s.puzzle?.parking&&typeof parkingCanDiscover==='function'&&parkingCanDiscover(id)&&(!requirePlaceRead||s.puzzle.parking.placesRead?.[id]));
}

/* This catalog is deliberately finite. Passwords, decoded room names, leaf
 * coordinates and ending names are not aliases for a destination. */
function manualDiscoveryCatalog(){
 const s=manualDiscoveryState(),history=manualDiscoveryHistoryReady(),privateReady=manualDiscoveryPrivateReady();
 const rows=[
  {id:'oldyard-map-place',title:'槐城旧儿童院',url:null,aliases:['旧儿童院入口','旧儿童院出入口','旧儿童院开放时间','旧儿童院现行入口'],desc:'地点资料：出入口公告、场地位置与访客评价。',platform:'地图 · 地点信息',available:typeof cityMapsPlace==='function'&&Boolean(cityMapsPlace('old-children-home')),kind:'account'},
  {id:'stationtech-profile',title:'许成维修',url:null,aliases:['许成维修','许成','xucheng_weixiu'],desc:'抖音号：xucheng_weixiu。监控安装、设备检修与日常维护记录。',platform:'抖音 · 个人主页',available:true,kind:'account'},
  {id:'awen-profile',title:'阿闻修字',url:null,aliases:['阿闻修字','阿闻','沈闻','awen_0906'],desc:'抖音号：awen_0906。沈闻。修网页，也修旧字。归家互助志愿维护。',platform:'抖音 · 个人主页',available:true,kind:'account'},
  {id:'book',title:'归亲会抄经本 · 合订影录',url:'https://zijian.example/library/guqin-copy',aliases:['归亲会抄经本','归亲抄经本','抄经本','zijian.example/library/guqin-copy'],desc:'民间文献影录。上下二册，附原件编页说明。',available:manualDiscoveryBookReady()},
  {id:'translator-account',title:'字间校读',url:null,aliases:['字间校读','逐字转写','借字转写'],desc:'古文字校读与民间抄本整理。刊载校读札记，提供抄本转写服务。',available:true,kind:'account'},
  {id:'old-history-account',title:'槐城旧志',url:null,aliases:['槐城旧志','门铭旧拓'],desc:'槐城地方旧刊与民间文献整理。老照片征集、地方掌故与馆藏摘录。',available:true,kind:'account'},
  {id:'chronicle',title:'归亲会沿革抄本',url:'https://www.guijia.example/account/history',aliases:['归亲会沿革','归亲会历史','归亲会演变','归亲堂沿革'],desc:'归亲堂旧藏。卷一收录旧渡来信、章程变更与开站附件。',available:history},
  {id:'history-album',title:'同人相簿 · 归亲堂旧藏',url:'https://www.guijia.example/account/history/album',aliases:['同人相簿','归亲会历代合照','归亲会合照','归亲堂相簿'],desc:'按散件入柜位置编排的历年同人影像。',available:history&&Boolean(s.cultHistory?.readChronicle)},
  {id:'history-negative',title:'原底卷索引',url:'https://www.guijia.example/account/history/negative',aliases:['原底卷索引','归亲会原底卷','未删节原底卷'],desc:'旧照原底、背书与同袋签条的留存目录，按底卷卷号查阅。',available:history&&Boolean(s.cultHistory?.readChronicle&&s.cultHistory?.albumOpened)},
  {id:'six',title:'六殉奉母 · 双册抄件',url:'https://www.guijia.example/account/history/six',aliases:['六殉奉母','双册抄件','奉母派双册'],desc:'归亲堂旧藏。候祭内册与沈闻附存的册后记。',available:privateReady},
  {id:'mother',title:'食名母供奉页',url:'https://www.guijia.example/account/mother',aliases:['食名母','食名母供奉页'],desc:'归亲堂座前文书，附新印抄件的来源记载。',available:privateReady&&Boolean(s.inquiry?.visited?.shrine)},
  {id:'cipher-record',title:'祈词改印记录',url:'https://www.guijia.example/account/cipher',aliases:['祈词改印记录','座前文书','新印抄件与旧刊索引'],desc:'座前文书留底。原件所记的册次、叶码与行记。',available:privateReady&&Boolean(s.clueStory?.known?.['mother-page'])}
 ];
 if(typeof FAMILY_INVESTIGATIONS==='object')for(const [id,f]of Object.entries(FAMILY_INVESTIGATIONS)){
  rows.push({id:'family-site:'+id,title:f.site+' · 留存资料',url:'https://'+f.host+f.start,aliases:[f.site,f.host],desc:f.site+'的公告、物品记录及历史留存。',available:manualDiscoveryFamilyReady(id)});
  const aliases=[f.name+'留存记录',f.name+'旧堂留存记录',f.case+'留存记录',f.case+'旧堂留存记录',f.title];
  if(id==='household_liu')aliases.push('RN-0920书后夹页','RN-0920','刘若宁书后夹页');
  rows.push({id:'family-record:'+id,title:f.name+' · 旧堂留存记录',url:'https://records.guijia.example/retained/'+f.case,aliases,desc:f.title+'，连同转交联按原件留存。',available:manualDiscoveryFamilyRecordReady(id)});
 }
 if(typeof PARKING_PLACES==='object')for(const [id,place]of Object.entries(PARKING_PLACES)){
  rows.push({id:'parking-intake:'+id,title:place.name+' · 2026年8月交接目录',url:'https://records.guijia.example/place/'+id+'/intake',aliases:[place.name+'2026年8月交接目录',place.name+'2026年8月交接记录',place.name+'交接目录'],desc:place.name+'的八月历史交接资料，按原编号和日期留存。',available:manualDiscoveryParkingReady(id,true)});
 }
 rows.push({id:'civic-notice-37',title:'场地移交公告〔2023〕37号',url:'https://service.huai.example/notice/37',aliases:['场地移交公告〔2023〕37号','场地移交公告202337号','槐城社区服务37号公告','槐城社区服务2023年37号'],desc:'槐城社区服务资料室。2023年11月2日发布的场地移交与资料保管公告。',available:manualDiscoveryParkingReady('qinghuai')});
 return rows;
}
function manualDiscoveryEntries(query){
 const q=manualDiscoveryText(query);if(!q)return [];
 return manualDiscoveryCatalog().filter(row=>row.available&&row.aliases.some(alias=>{const a=manualDiscoveryText(alias);return (a.length>=3&&q.includes(a))||(['awen-profile','stationtech-profile'].includes(row.id)&&q===a)})).map(({available,aliases,...row})=>row);
}
function manualDiscoverySearch(query){
 const rows=manualDiscoveryEntries(query);if(!rows.length)return null;
 const escape=typeof E==='function'?E:value=>String(value??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
 const icon=typeof ico==='function'?ico('search'):'搜索';
 const html=rows.map(row=>row.url?`<button class="engine-result" data-a="url" data-url="${escape(row.url)}"><small>${escape(new URL(row.url).hostname)}</small><h2>${escape(row.title)}</h2><p>${escape(row.desc)}</p></button>`:`<article class="engine-result manual-discovery-account"><small>${escape(row.platform||'微信公众号')}</small><h2>${escape(row.title)}</h2><p>${escape(row.desc)}</p></article>`).join('');
 return `<div class="web-search-engine"><form data-form="web-global"><span>搜索</span><input aria-label="搜索网页" value="${escape(query)}" placeholder="搜索或输入网址"><button aria-label="搜索">${icon}</button></form><nav><b>全部</b><span>网页</span><span>资讯</span></nav><p class="native-label">找到 ${rows.length} 条相关内容</p>${html}</div>`;
}

/* Optional read-only guard for the caller's URL dispatcher. null means this
 * module has no opinion; page-specific forms still enforce their own gates. */
function manualDiscoveryAllowsURL(value){
 let u;try{u=value instanceof URL?value:new URL(String(value))}catch{return null}
 let p;try{p=decodeURIComponent(u.pathname).replace(/\/$/,'')||'/'}catch{return false}
 if(u.hostname==='zijian.example'&&p==='/library/guqin-copy')return manualDiscoveryBookReady();
 if(typeof FAMILY_INVESTIGATIONS==='object')for(const [id,f]of Object.entries(FAMILY_INVESTIGATIONS)){
  if(u.hostname===f.host)return manualDiscoveryFamilyReady(id);
  if(u.hostname==='records.guijia.example'&&p==='/retained/'+f.case)return manualDiscoveryFamilyRecordReady(id);
 }
 if(u.hostname==='records.guijia.example'){
  const place=p.match(/^\/place\/([a-z]+)\/(?:intake|folder(?:\/\d+)?)$/)?.[1];
  if(place)return manualDiscoveryParkingReady(place,true);
  if(p==='/'||p==='/intake'||/^\/folder\/\d+$/.test(p))return manualDiscoveryParkingReady('qinghuai',true);
 }
 if(u.hostname==='service.huai.example'&&p==='/notice/37')return manualDiscoveryParkingReady('qinghuai');
 if(['guijia.example','www.guijia.example'].includes(u.hostname)){
  const row=manualDiscoveryCatalog().find(entry=>entry.url&&new URL(entry.url).hostname==='www.guijia.example'&&new URL(entry.url).pathname===p);
  if(row)return Boolean(row.available);
 }
 return null;
}
