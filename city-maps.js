/* Fictional city map: browsing and planning never moves the player or advances a route. */
function syncCityMaps(){
 S.cityMaps??={version:1,devices:{},reviews:[]};S.cityMaps.devices??={};S.cityMaps.reviews??=[];
 const device=typeof dpActive==='function'&&dpActive()?'daughter':'father';
 S.cityMaps.devices[device]??={favorites:[],searches:[],recent:[]};
 const state=S.cityMaps.devices[device];state.favorites??=[];state.searches??=[];state.recent??=[];
 return state;
}
function cityMapsVisible(p){
 if(!p)return false;
 if(p.gate?.startsWith('parking:'))return typeof parkingMaySearch==='function'&&parkingMaySearch(p.gate.split(':')[1]);
 if(p.gate==='oldyard')return typeof window.appClueMapVisible==='function'?window.appClueMapVisible('old-children-home'):Boolean(S.clueStory?.known?.['dp-old-wifi']||S.clueStory?.known?.['dp-cloud-letter']);
 if(p.gate==='after-return')return Boolean(S.flags.found||S.flags.done);
 return true;
}
function cityMapsPlaces(){return (window.CITY_MAP_PLACES||[]).filter(cityMapsVisible)}
function cityMapsPlace(id){return cityMapsPlaces().find(p=>p.id===id)}
function cityMapsNormalize(value){return String(value||'').trim().toLowerCase().replace(/[\s·•，。、？?！!]/g,'')}
function cityMapsFind(query,category='附近'){
 const q=cityMapsNormalize(query);
 return cityMapsPlaces().filter(p=>(category==='附近'||p.category===category)&&(!q||[p.name,p.address,...p.aliases,p.category,...p.tags].some(t=>cityMapsNormalize(t).includes(q)))).sort((a,b)=>{
  if(q){const exact=p=>cityMapsNormalize(p.name)===q||p.aliases.some(t=>cityMapsNormalize(t)===q);if(exact(a)!==exact(b))return exact(a)?-1:1}
  return cityMapsDistance(a)-cityMapsDistance(b);
 });
}
function cityMapsDistance(p,from){const a=from?.xy||[430,520];return Math.round(Math.hypot(p.xy[0]-a[0],p.xy[1]-a[1])*8.2)}
function cityMapsDistanceLabel(m){return m<30?'附近':m<1000?`${Math.round(m/10)*10}米`:`${(m/1000).toFixed(1)}公里`}
function cityMapsSymbol(name){
 const paths={pin:'M12 21s7-7 7-12a7 7 0 1 0-14 0c0 5 7 12 7 12Z M15 9a3 3 0 1 1-6 0 3 3 0 0 1 6 0',search:'M16 16l5 5 M18 10A8 8 0 1 1 2 10a8 8 0 0 1 16 0',back:'m15 4-8 8 8 8',star:'m12 3 2.8 5.8 6.4.9-4.6 4.5 1.1 6.4-5.7-3-5.7 3 1.1-6.4L2.8 9.7l6.4-.9Z',route:'M4 20V9a4 4 0 0 1 8 0v6a4 4 0 0 0 8 0V4 M16 8l4-4 3 4',close:'m6 6 12 12 M6 18 18 6',locate:'M12 2v4 M12 18v4 M2 12h4 M18 12h4 M19 12a7 7 0 1 1-14 0 7 7 0 0 1 14 0',share:'M8 12 17 6 M8 12l9 6 M8 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0 M22 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0 M22 19a3 3 0 1 1-6 0 3 3 0 0 1 6 0',person:'M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0 M4 22v-3a8 8 0 0 1 16 0v3',map:'m2 5 7-3 6 3 7-3v17l-7 3-6-3-7 3Z M9 2v17 M15 5v17',clock:'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0 M12 6v6l4 2',photo:'M3 4h18v16H3Z M3 16l6-6 5 5 3-3 4 4 M17 8h.01',plus:'M12 4v16 M4 12h16',minus:'M4 12h16'};
 return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${paths[name]||paths.pin}"/></svg>`;
}
function cityMapsHeader(title,backAction='map-back'){return `<header class="cm-header"><button data-a="${backAction}" aria-label="返回">${cityMapsSymbol('back')}</button><strong>${E(title)}</strong><button data-a="map-tab" data-view="home" aria-label="关闭详情">${cityMapsSymbol('close')}</button></header>`}
function cityMapsSearchForm(value=''){return `<form class="cm-search" data-form="map-search"><span>${cityMapsSymbol('search')}</span><input name="q" aria-label="搜索地点、公交站" placeholder="搜索地点、公交站" value="${E(value)}" autocomplete="off"><button type="submit">搜索</button></form>`}
function cityMapsPoint(p){return [((p.xy[0]-140)/820*100).toFixed(2),((p.xy[1]-70)/860*100).toFixed(2)]}
function cityMapsVisiblePins(){
 const pins=[];
 for(const place of cityMapsFind('',R.mapCategory||'附近').filter(p=>!p.gate)){
  if(place.xy[0]>800&&place.xy[1]>500)continue;
  if(pins.every(other=>Math.hypot(place.xy[0]-other.xy[0],place.xy[1]-other.xy[1])>=180))pins.push(place);
  if(pins.length>=7)break;
 }
 return pins;
}
function cityMapsCanvas(selected=null,route=null){
 const places=selected?[selected]:cityMapsVisiblePins(),zoom=Math.max(1,Math.min(1.8,R.mapZoom||1));
 const roadV=[280,440,590,760,875],roadH=[160,240,390,520,650,760,860],segments=roadV.map(x=>`<path d="M${x} 60V955"/>`).join('')+roadH.map(y=>`<path d="M150 ${y}H980"/>`).join('');
 const a=route?.from?.xy||[430,520],b=selected?.xy||[430,520];
 const routePath=route?`<path class="cm-route-line" d="M${a[0]} ${a[1]}L440 ${a[1]}V${b[1]}H${b[0]}"/><circle cx="${a[0]}" cy="${a[1]}" r="9" fill="#fff" stroke="#2e74e8" stroke-width="5"/>`:'';
 const blocks=[];for(let r=0;r<7;r++)for(let c=0;c<5;c++){const x=305+c*128,y=182+r*111;blocks.push(`<rect x="${x}" y="${y}" width="${c%2?54:75}" height="${r%2?40:55}" rx="4"/>`)}
 const label=(text,x,y,cls='')=>`<span class="cm-map-label ${cls}" style="left:${(x-140)/820*100}%;top:${(y-70)/860*100}%">${E(text)}</span>`;
 return `<div class="cm-map" role="region" aria-label="槐城市区地图"><div class="cm-map-layer" style="transform:scale(${zoom})"><svg class="cm-cartography" viewBox="140 70 820 860" preserveAspectRatio="none" aria-hidden="true"><rect x="0" y="0" width="1100" height="1100" fill="#f1f3ed"/><path d="M200 0C270 200 105 330 195 520S130 760 225 1060" fill="none" stroke="#b9ddeb" stroke-width="74"/><path d="M214 654Q240 598 281 630L290 828Q224 850 211 799Z" fill="#c7dfb9"/><path d="M683 278h75v75h-75z M485 778h88v47h-88z M474 275h62v52h-62z" fill="#d4e7c9"/><g fill="#e2e7df" stroke="#d7ddd5" stroke-width="1">${blocks.join('')}</g><g fill="none" stroke="#ddd8c4" stroke-width="26">${segments}</g><g fill="none" stroke="#fff" stroke-width="20">${segments}</g><g fill="none" stroke="#f6ce7a" stroke-width="9"><path d="M160 390H980 M440 60V955"/></g>${routePath}<circle cx="430" cy="520" r="23" fill="#337cf0" opacity=".14"/><circle cx="430" cy="520" r="8" fill="#337cf0" stroke="#fff" stroke-width="4"/></svg>${label('清 河',190,380,'cm-river-label')}${label('建设路',660,391)}${label('榆树路',620,521)}${label('文昌路',690,651)}${label('站前路',640,161)}${label('民安街',445,790,'cm-vertical-label')}${label('清河滨河公园',245,753,'cm-park-label')}${places.map(p=>{const [x,y]=cityMapsPoint(p);return `<button class="cm-map-pin ${selected?'cm-map-pin-selected':''} ${Number(x)>80?'cm-pin-edge-right':Number(x)<18?'cm-pin-edge-left':''}" style="left:${x}%;top:${y}%" data-a="map-open" data-id="${E(p.id)}" aria-label="${E(p.name)}"><span>${cityMapsSymbol('pin')}</span><b>${E(p.name.replace('槐城市','').replace('槐城',''))}</b></button>`}).join('')}</div><span class="cm-compass" aria-label="上北下南">N<i></i></span><div class="cm-map-controls"><button data-a="map-zoom" data-dir="1" aria-label="放大地图">${cityMapsSymbol('plus')}</button><button data-a="map-zoom" data-dir="-1" aria-label="缩小地图">${cityMapsSymbol('minus')}</button><button data-a="map-center" aria-label="回到榆树路口">${cityMapsSymbol('locate')}</button></div><span class="cm-scale">${zoom>1.3?'200':'400'}米<i></i></span><span class="cm-watermark">槐城地图</span></div>`;
}
function cityMapsCard(p,compact=false){return `<button class="cm-place-card ${compact?'cm-compact':''}" data-a="map-open" data-id="${E(p.id)}"><div class="cm-place-card-copy"><strong>${E(p.name)}${p.status?`<em>${E(p.status)}</em>`:''}</strong><span>${E(p.category)} <i>·</i> ${cityMapsDistanceLabel(cityMapsDistance(p))}</span><p>${E(p.address)}</p>${compact?'':`<small>${E(p.tags.slice(0,3).join(' · '))}</small>`}</div>${p.photo&&!compact?`<img src="${asset(p.photo)}" alt="${E(p.name)}" loading="lazy">`:`<span class="cm-place-letter" aria-hidden="true">${E(p.name.replace('槐城','').slice(0,1))}</span>`}</button>`}
function cityMapsTabs(active){return `<nav class="cm-tabs" aria-label="地图导航">${[['home','map','地图'],['favorites','star','收藏'],['me','person','我的']].map(([v,i,t])=>`<button data-a="map-tab" data-view="${v}" class="${active===v?'selected':''}">${cityMapsSymbol(i)}<span>${t}</span></button>`).join('')}</nav>`}
function cityMapsHome(){const state=syncCityMaps(),category=R.mapCategory||'附近';return `<div class="cm-scroll">${cityMapsSearchForm(R.mapQ||'')}<div class="cm-city"><strong>槐城</strong><span>榆树路口周边</span></div><div class="cm-categories">${window.CITY_MAP_CATEGORIES.map(c=>`<button data-a="map-category" data-category="${E(c)}" class="${category===c?'selected':''}">${E(c)}</button>`).join('')}</div>${cityMapsCanvas()}<section class="cm-nearby"><div class="cm-section-heading"><h2>${category==='附近'?'发现附近':category}</h2><button data-a="map-results">查看全部</button></div>${cityMapsFind('',category).filter(p=>!p.gate).slice(0,4).map(p=>cityMapsCard(p,true)).join('')}</section>${state.searches.length?`<section class="cm-history"><h2>最近搜索</h2><div>${state.searches.slice(0,5).map(q=>`<button data-a="map-query" data-q="${E(q)}">${E(q)}</button>`).join('')}</div></section>`:''}</div>${cityMapsTabs('home')}`}
function cityMapsResults(){const q=R.mapQ||'',list=cityMapsFind(q,R.mapCategory||'附近');return `${cityMapsHeader(q?'搜索结果':'附近地点')}<div class="cm-scroll">${cityMapsSearchForm(q)}<div class="cm-results-label">${E(q||R.mapCategory||'附近')}<span>${list.length}个地点</span></div>${list.map(p=>cityMapsCard(p)).join('')||'<div class="cm-empty"><strong>没有找到相关地点</strong><p>试试地点全称、道路名或附近的建筑。</p></div>'}</div>`}
function cityMapsReviews(p){const own=syncCityMaps()&&S.cityMaps.reviews.filter(r=>r.place===p.id),rows=[...own,...p.reviews.map(([name,date,text])=>({name,date,text}))];return `<section class="cm-reviews"><div class="cm-section-heading"><h2>评价 <small>${rows.length}</small></h2><button data-a="map-review" data-id="${E(p.id)}">写评价</button></div>${rows.map(r=>`<article><div class="cm-review-avatar">${E(r.name.slice(0,1))}</div><div><strong>${E(r.name)}</strong><time>${E(r.date.slice(0,10))}</time><p>${E(r.text)}</p></div></article>`).join('')}</section>`}
function cityMapsDetail(p){if(!p)return cityMapsResults();const saved=syncCityMaps().favorites.includes(p.id);return `${cityMapsHeader(p.name)}<div class="cm-scroll">${cityMapsCanvas(p)}<section class="cm-detail-title"><div><h1>${E(p.name)}</h1><span>${E(p.category)} · ${E(p.tags.join(' · '))}</span></div><button data-a="map-favorite" data-id="${E(p.id)}" aria-label="${saved?'取消收藏':'收藏地点'}" class="${saved?'saved':''}">${cityMapsSymbol('star')}<span>${saved?'已收藏':'收藏'}</span></button></section><section class="cm-info"><p>${cityMapsSymbol('pin')}<span>${E(p.address)}</span></p><p>${cityMapsSymbol('clock')}<span>${E(p.hours)}</span></p><div class="cm-place-description">${E(p.description)}</div>${p.entrance?`<button class="cm-entrance-row" data-a="map-entrance" data-id="${E(p.id)}"><span><strong>出入口与通行</strong><small>院区管理方更新于 ${E(p.entrance.date)}</small></span><b>›</b></button>`:''}</section>${p.photo?`<section class="cm-place-photo"><h2>地点照片</h2><button data-a="map-photo" data-id="${E(p.id)}" aria-label="查看${E(p.name)}照片"><img src="${asset(p.photo)}" alt="${E(p.name)}" loading="lazy"></button></section>`:''}${cityMapsReviews(p)}</div><footer class="cm-detail-actions"><button data-a="map-share" data-id="${E(p.id)}">${cityMapsSymbol('share')}分享</button><button class="cm-primary" data-a="map-route" data-id="${E(p.id)}">${cityMapsSymbol('route')}路线</button></footer>`}
function cityMapsEntrance(p){if(!p?.entrance)return cityMapsDetail(p);return `${cityMapsHeader('出入口与通行')}<div class="cm-scroll cm-entrance"><small>${E(p.name)} · 院区管理方</small><h1>${E(p.entrance.title)}</h1><time>更新于 ${E(p.entrance.date)}</time>${p.entrance.body.map(t=>`<p>${E(t)}</p>`).join('')}<div class="cm-gate-location">${cityMapsSymbol('pin')}<span><strong>北侧装卸门</strong><small>青石巷支路 · 院区北侧</small></span></div><p class="cm-service-note">地图道路信息仅供出行参考，现场通行安排以管理方通知为准。</p></div>`}
function cityMapsRoute(p){
 if(!p)return cityMapsResults();const from=cityMapsPlace(R.mapFrom)||cityMapsPlace('yushu-crossing'),mode=R.mapMode||'transit',distance=Math.max(120,Math.round(cityMapsDistance(p,from)*1.18)),minutes=mode==='walk'?Math.max(2,Math.round(distance/73)):mode==='drive'?Math.max(3,Math.round(distance/320)+3):Math.max(9,Math.round(distance/190)+8);
 const bus=distance<2200?'12路':'26路',same=from.id===p.id,places=cityMapsPlaces();
 return `${cityMapsHeader('路线规划')}<div class="cm-scroll"><form class="cm-route-form" data-form="map-route-search"><label><i class="cm-start-dot"></i><span>从</span><select name="from" aria-label="路线起点">${places.map(x=>`<option value="${E(x.id)}" ${x.id===from.id?'selected':''}>${E(x.name)}</option>`).join('')}</select></label><label><i class="cm-end-dot"></i><span>到</span><strong>${E(p.name)}</strong></label><button type="submit">查询路线</button></form><div class="cm-route-modes">${[['drive','驾车'],['transit','公交'],['walk','步行']].map(([m,t])=>`<button data-a="map-route-mode" data-mode="${m}" class="${mode===m?'selected':''}">${t}</button>`).join('')}</div>${cityMapsCanvas(p,{from})}<section class="cm-route-summary"><small>${same?'起终点相同':mode==='transit'?`${bus} · 常规公交`:mode==='walk'?'步行路线':'常规道路'}</small><h2>${same?'已在起点附近':`约${minutes}分钟`}<span>${same?'':cityMapsDistanceLabel(distance)}</span></h2>${same?'<p>请选择其他起点以规划路线。</p>':mode==='transit'?`<ol><li>从${E(from.name)}步行至附近公交站</li><li>乘坐${bus}，约${Math.max(2,Math.round(distance/550))}站</li><li>下车后步行至${E(p.name)}</li></ol><p class="cm-route-note">运营时间 06:00—21:30 · 票价 ¥2<br>以上为常规班次方案，末班车后请改选其他出行方式。</p>`:`<ol><li>从${E(from.name)}出发</li><li>经民安街与${p.xy[1]<400?'建设路':'榆树路'}周边道路</li><li>到达${E(p.name)}周边</li></ol><p class="cm-route-note">${mode==='drive'?'时间未计入临时交通管制与停车等待。':'请沿人行道通行，经过路口留意信号灯。'}</p>`}${p.gate==='oldyard'?'<p class="cm-route-note">院区未开放，路线仅到外部道路。</p>':''}</section></div>`;
}
function cityMapsFavorites(){const ids=syncCityMaps().favorites,places=ids.map(cityMapsPlace).filter(Boolean);return `${cityMapsHeader('收藏地点','home')}<div class="cm-scroll">${places.map(p=>cityMapsCard(p)).join('')||'<div class="cm-empty"><strong>把常去的地方收起来</strong><p>在地点详情里点击收藏，方便下次查找。</p></div>'}</div>${cityMapsTabs('favorites')}`}
function cityMapsMe(){const state=syncCityMaps(),daughter=typeof dpActive==='function'&&dpActive();return `${cityMapsHeader('我的','home')}<div class="cm-scroll"><section class="cm-profile"><span>${cityMapsSymbol('person')}</span><div><h1>${E(daughter?'小禾':S.profile.name)}</h1><p>收藏想去的地方</p></div></section><div class="cm-section-heading"><h2>搜索记录</h2>${state.searches.length?'<button data-a="map-clear-history">清空</button>':''}</div>${state.searches.map(q=>`<button class="cm-history-row" data-a="map-query" data-q="${E(q)}">${cityMapsSymbol('clock')}${E(q)}<b>↗</b></button>`).join('')||'<p class="cm-empty-copy">暂无搜索记录</p>'}<div class="cm-section-heading"><h2>最近查看</h2></div>${state.recent.map(cityMapsPlace).filter(Boolean).slice(0,8).map(p=>cityMapsCard(p,true)).join('')||'<p class="cm-empty-copy">暂无浏览记录</p>'}</div>${cityMapsTabs('me')}`}
function cityMapsUI(){syncCityMaps();const view=R.mapView||'home',p=cityMapsPlace(R.mapId);const content=view==='detail'?cityMapsDetail(p):view==='entrance'?cityMapsEntrance(p):view==='results'?cityMapsResults():view==='route'?cityMapsRoute(p):view==='favorites'?cityMapsFavorites():view==='me'?cityMapsMe():cityMapsHome();return `<div class="city-maps-app" data-map-view="${E(view)}">${content}</div>`}
function cityMapsOpen(id){const p=cityMapsPlace(id);if(!p)return false;const state=syncCityMaps();state.recent=[id,...state.recent.filter(x=>x!==id)].slice(0,20);R.mapId=id;R.mapView='detail';R.mapZoom=1;return true}
function cityMapsRunQuery(q){const query=String(q||'').trim().slice(0,80),state=syncCityMaps();if(query)state.searches=[query,...state.searches.filter(s=>s!==query)].slice(0,20);R.mapQ=query;R.mapCategory='附近';R.mapView='results';R.mapZoom=1;}
function cityMapsAction(a,b){
 if(!a.startsWith('map-'))return false;const d=b?.dataset||{},p=cityMapsPlace(d.id||R.mapId);
 if(a==='map-open'){if(!cityMapsOpen(d.id))return true}
 else if(a==='map-tab'){R.mapView=['favorites','me'].includes(d.view)?d.view:'home';R.mapZoom=1;R.mapQ=''}
 else if(a==='map-back'){R.mapView=R.mapView==='entrance'||R.mapView==='route'?'detail':R.mapView==='detail'&&R.mapQ?'results':'home';R.mapZoom=1}
 else if(a==='map-category'){R.mapCategory=window.CITY_MAP_CATEGORIES.includes(d.category)?d.category:'附近';R.mapQ='';R.mapView='home'}
 else if(a==='map-results')R.mapView='results';
 else if(a==='map-query')cityMapsRunQuery(d.q);
 else if(a==='map-favorite'&&p){const s=syncCityMaps();s.favorites=s.favorites.includes(p.id)?s.favorites.filter(id=>id!==p.id):[p.id,...s.favorites]}
 else if(a==='map-entrance'&&p?.entrance){R.mapView='entrance';if(typeof window.appClueMapRead==='function')window.appClueMapRead(p.id,'entrance')}
 else if(a==='map-route'&&p){R.mapId=p.id;R.mapView='route';R.mapMode||='transit';R.mapZoom=1}
 else if(a==='map-route-mode'){R.mapMode=['walk','transit','drive'].includes(d.mode)?d.mode:'transit'}
 else if(a==='map-zoom')R.mapZoom=Math.max(1,Math.min(1.8,(R.mapZoom||1)+Number(d.dir)*.2));
 else if(a==='map-center')R.mapZoom=1;
 else if(a==='map-clear-history'){syncCityMaps().searches=[]}
 else if(a==='map-photo'&&p?.photo){dialog(p.name,`<img class="cm-photo-preview" src="${asset(p.photo)}" alt="${E(p.name)}">`);return true}
 else if(a==='map-review'&&p){dialog('评价地点',`<form data-form="map-review"><input type="hidden" name="id" value="${E(p.id)}"><label class="cm-review-input">${E(p.name)}<textarea name="text" maxlength="240" required placeholder="说说你的真实体验" aria-label="评价内容"></textarea></label><button class="cm-review-submit" type="submit">发布评价</button></form>`);return true}
 else if(a==='map-share'&&p){if(typeof window.appClueShareMap==='function'){window.appClueShareMap(p.id);return true}sheet('地点信息',`<div class="cm-share-preview"><strong>${E(p.name)}</strong><p>${E(p.address)}</p></div><button data-a="map-copy" data-id="${E(p.id)}">复制地点信息</button>`);return true}
 else if(a==='map-copy'&&p){const text=p.name+'\n'+p.address;const done=()=>dialog('地点信息',`<label class="cm-copy-label">长按或选中复制<textarea readonly aria-label="地点信息">${E(text)}</textarea></label>`);if(navigator.clipboard?.writeText)navigator.clipboard.writeText(text).then(()=>dialog('地点信息','已复制地点名称和地址。')).catch(done);else done();return true}
 else return true;
 persist();render();return true;
}
function cityMapsSubmit(kind,fd){
 if(kind==='map-search'){cityMapsRunQuery(fd.get('q'));persist();render();return true}
 if(kind==='map-route-search'){const from=cityMapsPlace(fd.get('from'));if(from)R.mapFrom=from.id;render();return true}
 if(kind==='map-review'){const p=cityMapsPlace(fd.get('id')),text=String(fd.get('text')||'').trim().slice(0,240);if(p&&text){const daughter=typeof dpActive==='function'&&dpActive();syncCityMaps();S.cityMaps.reviews.unshift({place:p.id,name:daughter?'小禾':S.profile.name,text,date:typeof phoneTimestamp==='function'?phoneTimestamp():`2026-09-${String(S.day).padStart(2,'0')}`,own:true});closeOverlay();persist();render()}return true}
 return false;
}
function cityMapsTextState(){const state=syncCityMaps(),p=cityMapsPlace(R.mapId);return {view:R.mapView||'home',query:R.mapQ||'',category:R.mapCategory||'附近',selected:p?{id:p.id,name:p.name,address:p.address,entranceOpen:R.mapView==='entrance'}:null,results:cityMapsFind(R.mapQ||'',R.mapCategory||'附近').map(x=>({id:x.id,name:x.name})),favorites:state.favorites.filter(id=>cityMapsPlace(id)),mode:R.mapMode||'transit',from:R.mapFrom||'yushu-crossing'}}
