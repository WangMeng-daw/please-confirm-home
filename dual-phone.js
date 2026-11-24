/* An independent, read-only recovered device. Father state and NPC queues stay in S/R. */
(()=>{
 if(window.DUAL_PHONE_VERSION)return;
 window.DUAL_PHONE_VERSION=2;
 const content=()=>window.DAUGHTER_CONTENT;
 let pin='',pinError='',observer=null,observedScreen=null,sheetObject=null,lastTick=Date.now();
 const esc=v=>E(v), image=id=>asset(id), now=()=>typeof phoneTimestamp==='function'?phoneTimestamp():new Date().toISOString();
 function dpState(){
  S.devices??={};const d=S.devices;
  if(!['father','daughter'].includes(d.active))d.active='father';
  d.phoneRecovered=!!d.phoneRecovered;d.unlocked=!!d.unlocked;
  if(!d.phoneRecovered)d.active='father';
  if(!Array.isArray(d.shared))d.shared=[];
  d.daughter??={};const x=d.daughter;
  x.pinUnlocked=!!x.pinUnlocked;x.view??={app:'lock'};x.nav??=[];x.scroll??={};x.read??={};x.favorites??=[];
  x.cloudUnlocked=!!x.cloudUnlocked;x.battery=Number.isFinite(x.battery)?Math.max(5,Math.min(100,x.battery)):38;
  x.used=Number.isFinite(x.used)?x.used:0;x.version=2;x.recents??=[];
  if(!x.pinUnlocked)x.view={app:'lock'};
  return d;
 }
 const state=()=>dpState().daughter;
 function dpActive(){return !!(S.devices?.phoneRecovered&&S.devices?.active==='daughter')}
 const save=()=>{if(typeof persist==='function')persist()};
 const format=s=>{const m=String(s||'').match(/(\d{4})-(\d{2})-(\d{2})[T ](\d\d:\d\d)/);return m?`${+m[2]}月${+m[3]}日 ${m[4]}`:String(s||'')};
 const short=s=>format(s).split(' ')[0];
 const viewKey=()=>{const v=state().view;return [v.app,v.id||v.page||v.person||'',...(v.person?[v.person]:[])].join(':')};
 function remember(){const el=document.querySelector('#screen .dp-scroll');if(el)state().scroll[viewKey()]=el.scrollTop}
 function clearSheet(){const overlay=document.querySelector('#overlay');if(overlay)overlay.innerHTML='';sheetObject=null}
 function navigate(app,extra={}){remember();state().nav.push({...state().view});state().view={app,...extra};clearSheet();dpRender()}
 function goBack(){if(document.querySelector('#overlay')?.children.length){clearSheet();return}remember();state().view=state().nav.pop()||{app:'home'};dpRender()}
 function goHome(){remember();clearSheet();state().view=state().pinUnlocked?{app:'home'}:{app:'lock'};state().nav=[];dpRender()}
 function dpSwitch(owner){
  const d=dpState();if(owner==='daughter'&&!d.phoneRecovered)return false;
  if(!['father','daughter'].includes(owner))return false;
  if(owner===d.active)return true;
  if(dpActive())remember();
  else {d.fatherView={...R};d.fatherNav=nav.map(v=>({...v}));d.fatherScroll=[...document.querySelectorAll('#screen .scroll,#screen .chat-body,#screen .browser-page')].map(el=>({top:el.scrollTop,left:el.scrollLeft}));const input=document.querySelector('#message-input');if(input)S.drafts[R.id]=input.value;}
  if(typeof closeOverlay==='function')closeOverlay();clearSheet();
  if(typeof dismissNotice==='function')dismissNotice();d.active=owner;pin='';pinError='';lastTick=Date.now();
  if(owner==='daughter')dpRender();else{document.querySelector('.phone')?.classList.remove('dp-device');if(d.fatherView){R={...d.fatherView};nav=(d.fatherNav||[]).map(v=>({...v}))}render();dpAfterRender();const restore=()=>document.querySelectorAll('#screen .scroll,#screen .chat-body,#screen .browser-page').forEach((el,i)=>{const p=d.fatherScroll?.[i];if(p){el.scrollTop=p.top;el.scrollLeft=p.left}});restore();requestAnimationFrame(restore)}
  save();return true;
 }
 const controlNames=['back','home','recents','more','search','share','download','files','camera','heart','chat','plus','sim','lock','refresh','check'];
 function dpIcon(name){const n=controlNames.indexOf(name==='forward'?'back':name);return n<0?ico(name):`<span class="dp-control" aria-hidden="true" style="background-image:url('${image('android-controls')}');background-position:${n%4/3*100}% ${Math.floor(n/4)/3*100}%;${name==='forward'?'transform:rotate(180deg)':''}"></span>`}
 function launcherIcon(app){return `<span class="dp-launch-icon">${rasterAppArtwork(app,'android')}</span>`}
 const appTitle=app=>({chats:'微信',contacts:'微信',discover:'微信',me:'微信',chat:'微信',profile:'微信',moments:'微信','moment-profile':'微信','moment-compose':'微信','moment-photo':'微信','moment-cover':'微信',photos:'相册',photo:'相册',notes:'便签',note:'便签',files:'文件管理',file:'文件管理',browser:'浏览器',settings:'设置',wifi:'设置','known-wifi':'设置',cellular:'设置',battery:'设置',about:'设置'}[app]);
 const appRoot=app=>({'微信':'chats','相册':'photos','便签':'notes','文件管理':'files','浏览器':'browser','设置':'settings'}[appTitle(app)]);
 function recentsUI(){return `<div class="dp-recents dp-scroll"><h1>最近任务</h1><div class="dp-recent-list">${state().recents.map((v,i)=>`<button data-a="dp-resume" data-index="${i}">${launcherIcon(appRoot(v.app))}<strong>${appTitle(v.app)||'应用'}</strong><span>${esc(v.id?content().notes.find(n=>n.id===v.id)?.title||content().contacts[v.id]?.name||'继续浏览':'继续浏览')}</span></button>`).join('')||'<p>暂无最近任务</p>'}</div></div>`}
 function portrait(id){
  const p=id==='self'?{name:'小禾',asset:'before'}:content().contacts[id];
  if(!p)return '';
  return `<span class="avatar real-avatar dp-avatar" role="img" aria-label="${esc(p.name)}的头像">${p.portrait&&typeof personPortrait==='function'?personPortrait(p.portrait):`<img src="${image(p.asset)}" alt="">`}</span>`;
 }
 function header(title,right=''){
  return `<header class="wx-header"><button data-a="dp-back" aria-label="返回">${dpIcon('back')}</button><h2>${esc(title)}</h2>${right||'<span class="header-gap"></span>'}</header>`;
 }
 function row(title,action,attrs='',sub=''){
  return `<button class="native-row dp-row" data-a="${action}" ${attrs}><span>${esc(title)}${sub?`<small>${esc(sub)}</small>`:''}</span><b class="row-chevron">›</b></button>`;
 }
 const search=(kind,q='')=>`<form class="native-search" data-form="dp-search" data-kind="${kind}">${dpIcon('search')}<input name="query" value="${esc(q)}" placeholder="搜索" aria-label="搜索"><input type="hidden" name="kind" value="${kind}"><button>搜索</button></form>`;
 const shareButton=()=>`<button data-a="dp-share" aria-label="共享">${dpIcon('share')}</button>`;
 function clueAttrs(id,kind,source,title,date){return id?`data-dp-clue="${esc(id)}" data-source-type="${kind}" data-source-id="${esc(source)}" data-title="${esc(title)}" data-date="${esc(date)}"`:''}
 function readClue(id,metadata){
  if(!id||state().read[id])return;
  state().read[id]={at:now(),...metadata};save();
  if(typeof cluePhoneRead==='function')cluePhoneRead(id,{device:'daughter',...metadata});
 }
 function textBody(body,record,kind){
  const paragraphs=String(body).split('\n\n');
  return paragraphs.map((p,i)=>`<p ${i===paragraphs.length-1?clueAttrs(record.clue,kind,record.id||'cloud-letter',record.title,record.date):''}>${esc(p).replaceAll('\n','<br>')}</p>`).join('');
 }
 function tile(app,title){return `<button class="app-icon" data-a="dp-open" data-app="${app}" aria-label="打开${title}">${launcherIcon(app)}<span>${title}</span></button>`}
 function homeUI(){
  return `<div class="real-home dp-home"><div class="dp-home-clock"><time>${time()}</time><span>${storyDate()}</span></div><button class="dp-note-widget" data-a="dp-note" data-id="bag"><span>便签</span><strong>给拿到手机的人</strong><small>9月18日</small></button><div class="app-grid">${[['chats','微信'],['photos','相册'],['browser','浏览器'],['files','文件管理'],['notes','便签'],['settings','设置']].map(x=>tile(...x)).join('')}</div><div class="home-bottom"><div class="page-dots"><span class="selected">●</span><span>○</span></div><div class="dock">${[['chats','微信'],['browser','浏览器'],['photos','相册']].map(x=>tile(...x)).join('')}</div></div></div>`;
 }
 function lockUI(){
  return `<div class="real-lock dp-lock"><div class="lock-date">${storyDate()}</div><div class="lock-clock">${time()}</div><div class="dp-pin-area"><span class="dp-lock-icon">${dpIcon('lock')}</span><h2>输入密码</h2><p>请输入锁屏密码</p><div class="dp-pin-dots" aria-label="已输入 ${pin.length} 位密码">${Array.from({length:4},(_,i)=>`<i class="${i<pin.length?'filled':''}"></i>`).join('')}</div><div class="dp-pin-error" role="status">${esc(pinError)}</div><div class="dp-keypad">${[['1',''],['2','ABC'],['3','DEF'],['4','GHI'],['5','JKL'],['6','MNO'],['7','PQRS'],['8','TUV'],['9','WXYZ']].map(([n,l])=>`<button data-a="dp-pin-digit" data-digit="${n}" aria-label="${n}"><span>${n}</span><small>${l}</small></button>`).join('')}<span></span><button data-a="dp-pin-digit" data-digit="0" aria-label="0"><span>0</span></button><button class="dp-pin-delete" data-a="dp-pin-delete">删除</button></div></div></div>`;
 }
 function tabs(selected){return `<nav class="wx-tabs">${[['chats','chat','微信'],['contacts','contacts','通讯录'],['discover','compass','发现'],['me','user','我']].map(([a,i,n])=>`<button data-a="dp-open" data-app="${a}" class="${a===selected?'selected':''}"><span>${dpIcon(i)}</span>${n}</button>`).join('')}</nav>`}
 function chatRows(q=''){
  return Object.entries(content().contacts).filter(([id,p])=>!q||(p.name+content().chats[id].map(m=>m.text).join('')).includes(q)).sort(([a],[b])=>content().chats[b].at(-1).at.localeCompare(content().chats[a].at(-1).at)).map(([id,p])=>{const m=content().chats[id].at(-1);return `<button class="wx-conversation" data-a="dp-chat" data-id="${id}">${portrait(id)}<div><strong>${esc(p.name)}</strong><time>${short(m.at)}</time><p>${esc(m.type==='image'?'[图片]':m.type==='file'?'[文件]':m.text)}</p></div></button>`}).join('');
 }
 function chatUI(id){
  const p=content().contacts[id];if(!p)return header('聊天记录');
  const rows=content().chats[id].map((m,i)=>{
   let body=m.type==='image'?`<button class="wx-image" data-a="dp-photo" data-id="${m.photo}"><img src="${image(m.photo)}" alt="聊天图片" loading="lazy"></button>`:m.type==='file'?`<button class="wx-file" data-a="dp-file" data-id="${m.file}"><span>${esc(content().files.find(f=>f.id===m.file)?.title||'文件')}<small>已下载</small></span><img class="document-file-icon" src="${image('document-file')}" alt=""></button>`:`<div class="bubble" ${clueAttrs(m.clue,'chat',`${id}:${i}`,p.name,m.at)}>${esc(m.text)}</div>`;
   return `<div class="wx-date">${format(m.at)}</div><div class="message ${m.me?'me':''}">${portrait(m.me?'self':id)}${body}</div>`;
  }).join('');
  return header(p.name,`<button data-a="dp-profile" data-id="${id}" aria-label="聊天信息">${dpIcon('more')}</button>`)+`<div class="dp-history-notice">聊天记录 · 保存在本机</div><div class="chat-body wx-chatbody dp-scroll" id="dp-chat-body">${rows}</div><div class="wx-compose dp-readonly-compose">${dpIcon('lock')}<span>当前账号已退出登录</span></div>`;
 }
 function photoRecord(id){const p=content().photos.find(p=>p.id===id);if(!p)return null;const original=D.photos[id]||{};return {...p,title:p.title||original.title||id,date:p.date||(original.takenAt||`${original.date||''} ${original.time||''}`).replace('T',' ').slice(0,16),caption:p.caption||original.description||'',location:original.location||''}}
 function photosUI(q=''){
  const photos=content().photos.map(p=>photoRecord(p.id)).sort((a,b)=>b.date.localeCompare(a.date)).filter(p=>!q||(p.title+p.date+p.caption).includes(q));const groups=new Map();
  photos.forEach(p=>{const group=p.date.slice(0,7);if(!groups.has(group))groups.set(group,[]);groups.get(group).push(p)});
  return header('相册')+`<div class="scroll photos-real dp-scroll"><div class="photo-date">最近项目</div>${search('photos',q)}${[...groups].map(([month,items])=>`<section class="photo-month"><h3 class="photo-month-label">${esc(month.replace('-','年'))}月</h3><div class="photo-grid">${items.map(p=>`<button class="photo-thumb" data-a="dp-photo" data-id="${p.id}" aria-label="${esc(p.title)}"><img src="${image(p.asset)}" alt="${esc(p.caption||p.title)}" loading="lazy"></button>`).join('')}</div></section>`).join('')}<p class="photo-count">${photos.length} 张照片</p></div><div class="native-toolbar"><button data-a="dp-open" data-app="photos">图库</button><span>最近项目</span></div>`;
 }
 function photoUI(id){const p=photoRecord(id);if(!p)return header('相册');return `<div class="dp-photo-view"><div class="lightbox-bar"><button data-a="dp-back" aria-label="返回">${dpIcon('back')}</button><span>${short(p.date)}<small>${p.date.slice(11,16)}</small></span>${shareButton()}</div><div class="dp-photo-stage ${state().view.zoom?'zoomed':''}"><img data-dp-photo="${p.id}" data-a="dp-zoom" src="${image(p.asset)}" alt="${esc(p.caption||p.title)}"></div>${state().view.info?`<div class="dp-photo-info"><strong>${esc(p.title)}</strong><p>${esc(p.source)}</p><time>${esc(p.date)}</time>${p.saved?`<p>存储于 ${esc(p.saved)}</p>`:''}${p.caption?`<p>${esc(p.caption)}</p>`:''}</div>`:''}<div class="native-photo-tools"><button data-a="dp-photo-step" data-step="-1" aria-label="上一张">${dpIcon('back')}</button><button data-a="dp-photo-favorite" aria-label="收藏照片" aria-pressed="${state().favorites.includes(id)}">${dpIcon('heart')}</button><button data-a="dp-photo-info" aria-label="信息">${dpIcon('info')}</button><button data-a="dp-photo-step" data-step="1" aria-label="下一张">${dpIcon('forward')}</button></div></div>`}
 function notesUI(q=''){const ns=content().notes.filter(n=>!q||(n.title+n.body).includes(q));return header('便签')+`<div class="scroll notes-real dp-scroll">${search('notes',q)}${ns.map(n=>`<button class="note-list-row" data-a="dp-note" data-id="${n.id}"><strong>${esc(n.title)}</strong><p><time>${short(n.date)}</time> ${esc(n.body.split('\n')[0])}</p></button>`).join('')||'<p class="native-empty">无相关结果</p>'}</div><div class="native-toolbar">${ns.length} 条便签</div>`}
 function noteUI(id){const n=content().notes.find(n=>n.id===id);return n?header('便签',shareButton())+`<article class="scroll dp-scroll dp-note"><time>${format(n.date)}</time><h1>${esc(n.title)}</h1>${textBody(n.body,n,'note')}</article>`:header('便签')}
 function fileRows(files){return files.map(f=>`<button class="file-row" data-a="dp-file" data-id="${f.id}"><img class="document-file-icon" src="${image('document-file')}" alt=""><span><strong>${esc(f.title)}</strong><small>${short(f.date)}　${f.size}</small></span></button>`).join('')}
 function filesUI(q=''){return header('文件管理')+`<div class="scroll files-real dp-scroll"><h1>内部存储</h1>${search('files',q)}${fileRows(content().files.filter(f=>!q||(f.title+f.body).includes(q)))}</div><div class="native-toolbar"><span>最近项目</span><span>浏览</span></div>`}
 function fileUI(id){const f=content().files.find(f=>f.id===id);return f?header(f.title,shareButton())+`<article class="scroll dp-scroll dp-file-document"><time>${format(f.date)}</time>${textBody(f.body,f,'file')}</article>`:header('文件')}
 function browserUI(){
  const v=state().view,page=v.page||'start',entry=content().history.find(x=>x.id===page),url=entry?.url||'about:start';let body='';
  if(page==='cloud')body=state().cloudUnlocked?`<article class="dp-cloud-letter"><span class="dp-cloud-brand">我的云盘</span><h1>${esc(content().cloud.title)}</h1><time>${format(content().cloud.date)}</time>${textBody(content().cloud.body,content().cloud,'cloud')}<button class="dp-cloud-share" data-a="dp-share">${dpIcon('share')} 共享文件</button></article>`:`<div class="dp-cloud-login"><span class="dp-cloud-brand">我的云盘</span>${dpIcon('lock')}<h1>私人文件夹</h1><p>小禾的存储空间</p><form data-form="dp-cloud"><label>访问密码<input type="password" name="password" aria-label="访问密码" autocomplete="off" required></label><button type="submit">打开</button><p class="dp-form-error" role="status">${esc(v.error||'')}</p></form><small>此页面及文件已存储，可离线访问。</small></div>`;
  else if(page==='wifi')body=`<article class="dp-cached-page"><small>青槐楼内网络</small><h1>无线局域网使用说明</h1><p ${clueAttrs('dp-old-wifi','web','wifi','无线局域网使用说明','2026-08-20 18:34')}>当前连接：YH-E2-17</p><p>此网络仅供楼内设备维护与已登记账户使用。家庭通讯、外部网站和通话服务不可用。</p><p>设备离线后，可以阅读已存储的页面。</p></article>`;
  else if(page==='school')body=`<article class="dp-cached-page"><small>槐城小学 · 美术</small><h1>美术课准备清单</h1><time>2026年8月12日</time><p>下次美术课准备彩笔、胶棒和硬卡纸。作品主题是“我最想去的地方”。</p><p>可以把家里用过的包装盒带来，不用买新的。</p></article>`;
  else if(page==='unavailable')body=`<div class="native-empty"><h2>无法打开页面</h2><p>手机未连接互联网。</p><button data-a="dp-web" data-page="start">查看已存储的页面</button></div>`;
  else body=`<div class="dp-safari-start"><h1>阅读列表</h1><p>离线可用</p>${content().history.map(h=>`<button data-a="dp-web" data-page="${h.id}"><span>${dpIcon(h.id==='cloud'?'files':'book')}</span><div><strong>${esc(h.title)}</strong><small>${esc(new URL(h.url).hostname)}</small><time>${format(h.date)}</time></div></button>`).join('')}</div>`;
  return `<div class="safari-address"><form data-form="dp-address">${dpIcon('lock')}<input name="url" aria-label="地址或搜索" value="${esc(url)}"><button aria-label="前往">${dpIcon('forward')}</button></form><button data-a="dp-refresh" aria-label="重新载入">${dpIcon('refresh')}</button></div><div class="scroll browser-page dp-scroll" id="dp-web-content">${body}</div><nav class="safari-toolbar"><button data-a="dp-back" aria-label="返回">${dpIcon('back')}</button><button data-a="dp-web" data-page="start" aria-label="阅读列表">${dpIcon('book')}</button><button data-a="dp-share" aria-label="共享" ${page==='cloud'&&state().cloudUnlocked?'':'disabled'}>${dpIcon('share')}</button><button data-a="dp-web-history" aria-label="历史记录">${dpIcon('clock')}</button><button data-a="dp-home" aria-label="主屏幕">${dpIcon('home')}</button></nav>`;
 }
 function settingsUI(){return header('设置')+`<div class="scroll system-settings dp-scroll"><h1>设置</h1><div class="settings-person">${portrait('self')}<span><strong>小禾</strong><small>本机账户</small></span></div><div class="row-group">${row('WLAN','dp-open','data-app="wifi"','未连接')}${row('移动网络','dp-open','data-app="cellular"','无 SIM 卡')}${row('电池','dp-open','data-app="battery"',state().battery+'%')}</div><div class="row-group">${row('关于本机','dp-open','data-app="about"')}${row('锁定屏幕','dp-lock')}</div></div>`}
 function dpRender(){
  if(!dpActive())return false;
  const x=state(),v=x.view,phone=document.querySelector('.phone');if(!phone||!document.querySelector('#screen'))return false;
  phone.classList.add('dp-device');phone.classList.toggle('on-home',['home','lock'].includes(v.app));phone.classList.toggle('on-lock',v.app==='lock');phone.style.setProperty('--dp-wallpaper',`url('${image('past_beach')}')`);phone.style.setProperty('--font-size',`${S.font||16}px`);
  let h='';
  const momentView=typeof dpMomentsUI==='function'?dpMomentsUI(v):null;
  if(appTitle(v.app)){x.recents=[{...v,taskNav:x.nav.map(n=>({...n}))},...x.recents.filter(r=>appRoot(r.app)!==appRoot(v.app))].slice(0,6)}
  if(momentView!==null)h=momentView;
  else
  switch(v.app){
   case 'lock':h=lockUI();break;
   case 'home':h=homeUI();break;
   case 'chats':h=header('微信')+`<div class="scroll dp-scroll">${search('chats',v.q||'')}${chatRows(v.q)}</div>`+tabs('chats');break;
   case 'chat':h=chatUI(v.id);break;
   case 'contacts':h=header('通讯录')+`<div class="scroll dp-scroll">${Object.entries(content().contacts).map(([id,p])=>`<button class="contact-row" data-a="dp-profile" data-id="${id}">${portrait(id)}<span>${esc(p.name)}</span></button>`).join('')}</div>`+tabs('contacts');break;
   case 'profile':{const p=content().contacts[v.id];h=header('详细资料')+`<div class="scroll wx-bg dp-scroll"><div class="me-card">${portrait(v.id)}<div><h2>${esc(p?.name)}</h2><p>${esc(p?.sign)}</p></div></div>${row('聊天记录','dp-chat',`data-id="${esc(v.id)}"`)}${row('朋友圈','dpm-timeline',`data-person="${esc(v.id)}"`)}</div>`;break}
   case 'discover':h=header('发现')+`<div class="scroll wx-bg dp-scroll">${row('朋友圈','dp-open','data-app="moments"','')}</div>`+tabs('discover');break;
   case 'recents':h=recentsUI();break;
   case 'me':h=header('我')+`<div class="scroll wx-bg dp-scroll"><div class="me-card">${portrait('self')}<div><h2>小禾</h2><p>账号已退出登录</p></div></div>${row('朋友圈','dpm-timeline','data-person="self"')}${row('保存的聊天记录','dp-open','data-app="chats"')}</div>`+tabs('me');break;
   case 'photos':h=photosUI(v.q);break;
   case 'photo':h=photoUI(v.id);break;
   case 'notes':h=notesUI(v.q);break;
   case 'note':h=noteUI(v.id);break;
   case 'files':h=filesUI(v.q);break;
   case 'file':h=fileUI(v.id);break;
   case 'browser':h=browserUI();break;
   case 'settings':h=settingsUI();break;
   case 'wifi':h=header('WLAN')+`<div class="scroll system-settings dp-scroll"><div class="native-label">未连接</div><div class="row-group">${row('已知网络','dp-open','data-app="known-wifi"')}</div></div>`;break;
   case 'known-wifi':h=header('已知网络')+`<div class="scroll dp-scroll"><div class="native-row" ${clueAttrs('dp-old-wifi','settings','known-wifi','已知网络','2026-08-20 18:34')}><span>YH-E2-17</span>${dpIcon('lock')}</div><p class="native-label">上次连接：8月20日</p></div>`;break;
   case 'cellular':h=header('移动网络')+'<div class="scroll dp-scroll"><div class="native-empty">无 SIM 卡</div></div>';break;
   case 'battery':h=header('电池')+`<div class="scroll dp-scroll dp-battery-page"><h1>${x.battery}%</h1><p>剩余电量</p><p>电池健康：79%</p><p>低电量模式已开启</p></div>`;break;
   case 'about':h=header('关于本机')+`<div class="scroll dp-scroll"><div class="native-row"><span>名称</span><span>小禾的手机</span></div><div class="native-row"><span>系统</span><span>Android 12</span></div><div class="native-row"><span>照片</span><span>${content().photos.length}</span></div><div class="native-row"><span>SIM 卡</span><span>无</span></div></div>`;break;
   default:h=homeUI();x.view={app:'home'};
  }
  document.querySelector('#screen').innerHTML=h;
  const sc=document.querySelector('#screen .dp-scroll'),targetTop=x.scroll[viewKey()]||0;
  observedScreen=null;save();dpAfterRender();if(sc){sc.scrollTop=targetTop;requestAnimationFrame(()=>{if(sc.isConnected)sc.scrollTop=targetTop})}return true;
 }
 function pinDigit(digit){
  if(!/^\d$/.test(digit)||state().pinUnlocked)return;pinError='';pin=(pin+digit).slice(0,4);
  if(pin.length===4){if(pin==='0503'){state().pinUnlocked=true;dpState().unlocked=true;state().view={app:'home'};readClue('dp-unlocked',{sourceType:'device',sourceId:'pin',title:'小禾的手机',date:now()});pin=''}else{pin='';pinError='密码错误，请重试'}}
  dpRender();
 }
 function currentObject(){
  const v=state().view;
  if(v.app==='photo'){const p=photoRecord(v.id);return p&&{kind:'photo',sourceId:p.id,title:p.title,asset:p.asset,body:p.caption,takenAt:p.date,source:p.source,clueId:p.clue}}
  if(v.app==='note'){const n=content().notes.find(n=>n.id===v.id);return n&&{kind:'note',sourceId:n.id,title:n.title,body:n.body,takenAt:n.date,clueId:n.clue}}
  if(v.app==='file'){const f=content().files.find(f=>f.id===v.id);return f&&{kind:'file',sourceId:f.id,title:f.title,body:f.body,takenAt:f.date,clueId:f.clue}}
  if(v.app==='browser'&&v.page==='cloud'&&state().cloudUnlocked){const c=content().cloud;return {kind:'file',sourceId:'cloud-letter',title:c.title,body:c.body,takenAt:c.date,clueId:c.clue}}
  return null;
 }
 function share(){const object=currentObject();if(!object)return;sheetObject=object;document.querySelector('#overlay').innerHTML=`<div class="sheet-shade dp-sheet-shade"><div class="action-sheet dp-share-sheet" role="dialog" aria-label="共享"><div class="dp-share-heading"><img src="${image(object.kind==='photo'?object.asset:'document-file')}" alt=""><div><strong>${esc(object.title)}</strong><small>${object.kind==='photo'?'照片':'文本文件'}</small></div></div><h3>设备间传送</h3><p>通过临时 WLAN 热点连接，不使用互联网</p><button data-a="dp-transfer" class="dp-airdrop-person">${typeof personPortrait==='function'?`<span class="avatar real-avatar">${personPortrait('me')}</span>`:ico('user')}<span>林砚的 iPhone</span></button><button class="sheet-cancel" data-a="dp-sheet-close">取消</button></div></div>`}
 function doAirDrop(){
  if(!sheetObject)return;const o={...sheetObject,id:`daughter:${sheetObject.kind}:${sheetObject.sourceId}`,fromDevice:'daughter',sharedAt:now()};
  const shared=dpState().shared,existing=shared.findIndex(x=>x.id===o.id);if(existing<0)shared.push(o);else shared[existing]={...shared[existing],...o};
  save();if(o.clueId&&typeof cluePhoneRead==='function')cluePhoneRead(o.clueId,{device:'daughter',sourceType:o.kind,sourceId:o.sourceId,title:o.title,date:o.takenAt,shared:true,shareId:o.id});
  document.querySelector('#overlay').innerHTML=`<div class="sheet-shade dp-sheet-shade"><div class="action-sheet dp-share-sheet" role="dialog" aria-label="设备间传送"><h3>已发送</h3><p>${esc(o.title)}</p><p>林砚的 iPhone 已接收</p><button class="sheet-cancel" data-a="dp-sheet-close">完成</button></div></div>`;sheetObject=null;
 }
 function dpAction(a,b){
  if(a==='dp-switch')return dpSwitch(b.dataset.owner);
  if(!dpActive())return false;
  if(state().pinUnlocked&&typeof dpMomentsAction==='function'&&dpMomentsAction(a,b?.dataset||{}))return true;
  if(!a?.startsWith('dp-'))return true;
  const d=b?.dataset||{},x=state(),v=x.view;
  if(!x.pinUnlocked&&!['dp-pin-digit','dp-pin-delete','dp-back','dp-home','dp-lock','dp-sheet-close'].includes(a))return true;
  switch(a){
   case 'dp-pin-digit':pinDigit(d.digit);break;
   case 'dp-pin-delete':pin=pin.slice(0,-1);pinError='';dpRender();break;
   case 'dp-back':goBack();break;
   case 'dp-home':goHome();break;
   case 'dp-recents':if(x.pinUnlocked)navigate('recents');break;
   case 'dp-resume':{const recent=x.recents[Number(d.index)];if(recent){remember();const {taskNav,...view}=recent;x.view={...view};x.nav=(taskNav||[{app:'home'}]).map(n=>({...n}));clearSheet();dpRender()}break}
   case 'dp-open':if(x.pinUnlocked)navigate(d.app);break;
   case 'dp-chat':navigate('chat',{id:d.id});break;
   case 'dp-profile':navigate('profile',{id:d.id});break;
   case 'dp-photo':navigate('photo',{id:d.id});break;
   case 'dp-note':navigate('note',{id:d.id});break;
   case 'dp-file':navigate('file',{id:d.id});break;
   case 'dp-web':navigate('browser',{page:d.page||'start'});break;
   case 'dp-web-history':navigate('browser',{page:'start'});break;
   case 'dp-refresh':dpRender();break;
   case 'dp-photo-info':v.info=!v.info;dpRender();break;
   case 'dp-zoom':v.zoom=!v.zoom;dpRender();break;
   case 'dp-photo-step':{const ids=content().photos.map(p=>photoRecord(p.id)).sort((a,b)=>b.date.localeCompare(a.date)).map(p=>p.id),next=ids[ids.indexOf(v.id)+Number(d.step)];if(next){v.id=next;v.zoom=false;dpRender()}break}
   case 'dp-photo-favorite':x.favorites=x.favorites.includes(v.id)?x.favorites.filter(id=>id!==v.id):[...x.favorites,v.id];dpRender();break;
   case 'dp-share':share();break;
   case 'dp-transfer':case 'dp-airdrop':doAirDrop();break;
   case 'dp-sheet-close':clearSheet();break;
   case 'dp-lock':x.pinUnlocked=false;x.view={app:'lock'};pin='';x.nav=[];dpRender();break;
  }
  return true;
 }
 function dpSubmit(kind,d){
  if(!dpActive())return false;
  if(state().pinUnlocked&&typeof dpMomentsSubmit==='function'&&dpMomentsSubmit(kind,d))return true;
  if(!kind?.startsWith('dp-'))return true;
  if(!state().pinUnlocked)return true;
  const val=k=>typeof d?.get==='function'?d.get(k):d?.[k];
  if(kind==='dp-cloud'){if(String(val('password')||'').trim()==='尾下白线'){state().cloudUnlocked=true;state().view.error=''}else state().view.error='密码不正确';dpRender()}
  else if(kind==='dp-address'){const q=String(val('url')||'').trim(),match=content().history.find(x=>x.url===q||x.title.includes(q));navigate('browser',{page:match?.id||'unavailable'})}
  else if(kind==='dp-search'){state().view.q=String(val('query')||'').trim();dpRender()}
  return true;
 }
 function dpAfterRender(){
  const d=dpState(),phone=document.querySelector('.phone');if(!phone)return;
  phone.setAttribute('aria-label',dpActive()?'小禾的安卓手机':'林砚的手机');
  let androidNav=document.querySelector('#dp-android-nav');
  if(!androidNav){androidNav=document.createElement('nav');androidNav.id='dp-android-nav';androidNav.setAttribute('aria-label','安卓系统导航');androidNav.innerHTML=`<button data-a="dp-back" aria-label="返回上一页">${dpIcon('back')}</button><button data-a="dp-home" aria-label="返回桌面">${dpIcon('home')}</button><button data-a="dp-recents" aria-label="最近任务">${dpIcon('recents')}</button>`;document.querySelector('#home-key').insertAdjacentElement('afterend',androidNav)}
  androidNav.hidden=!dpActive();
  let switcher=document.querySelector('#dp-device-switch');
  if(!d.phoneRecovered){switcher?.remove();document.body.classList.remove('dp-available');return}
  document.body.classList.add('dp-available');
  if(!switcher){switcher=document.createElement('nav');switcher.id='dp-device-switch';switcher.setAttribute('aria-label','切换手机');phone.insertAdjacentElement('afterend',switcher)}
  const unread=typeof wechatUnreadTotal==='function'?wechatUnreadTotal()+wechatRequestUnread()+(typeof smsUnreadTotal==='function'?smsUnreadTotal():0):0,signature=d.active+':'+d.daughter.pinUnlocked+':'+unread;
  if(switcher.dataset.state!==signature){switcher.dataset.state=signature;switcher.innerHTML=`<button data-a="dp-switch" data-owner="father" aria-pressed="${d.active==='father'}" aria-keyshortcuts="Alt+1" title="切换到林砚的手机（Alt+1）"><span class="dp-switch-name">林砚的手机</span><small>iPhone</small>${unread?`<b class="dp-switch-unread" aria-label="${unread}条未读消息">${unread>99?'99+':unread}</b>`:''}</button><button data-a="dp-switch" data-owner="daughter" aria-pressed="${d.active==='daughter'}" aria-keyshortcuts="Alt+2" title="切换到小禾的手机（Alt+2）"><span class="dp-switch-name">小禾的手机${!d.daughter.pinUnlocked?' · 已锁定':''}</span><small>Android</small></button>`}
  if(!dpActive()){phone.classList.remove('dp-device');observer?.disconnect();observedScreen=null;lastTick=Date.now();return}
  phone.classList.add('dp-device');
  const elapsed=Math.min(5000,Math.max(0,Date.now()-lastTick));lastTick=Date.now();d.daughter.used+=elapsed;
  if(d.daughter.used>=360000){d.daughter.battery=Math.max(5,d.daughter.battery-Math.floor(d.daughter.used/360000));d.daughter.used%=360000;save()}
  const clock=document.querySelector('#clock');if(clock)clock.textContent=time();
  const lockclock=document.querySelector('.dp-lock .lock-clock');if(lockclock)lockclock.textContent=time();
  const homeclock=document.querySelector('.dp-home-clock time');if(homeclock)homeclock.textContent=time();
  const symbols=document.querySelector('#status-controls .signal');if(symbols)symbols.innerHTML=`<span class="dp-no-sim">无 SIM</span><span class="dp-charge-label">${d.daughter.battery}%</span><span class="phone-battery dp-phone-battery" role="img" aria-label="电量 ${d.daughter.battery}%"><span style="width:${d.daughter.battery}%"></span></span>`;
  const screen=document.querySelector('#screen'),first=screen?.firstElementChild;if(first&&first!==observedScreen){
   observedScreen=first;observer?.disconnect();
   observer=new IntersectionObserver(entries=>{for(const entry of entries)if(entry.isIntersecting&&entry.intersectionRatio>=0.65){const el=entry.target,data=el.dataset;readClue(data.dpClue,{sourceType:data.sourceType,sourceId:data.sourceId,title:data.title,date:data.date});observer.unobserve(el)}},{root:document.querySelector('#screen .dp-scroll')||screen,threshold:[0.65]});
   screen.querySelectorAll('[data-dp-clue]').forEach(el=>observer.observe(el));
   const pic=screen.querySelector('[data-dp-photo]');if(pic){const p=photoRecord(pic.dataset.dpPhoto),read=()=>{if(pic.naturalWidth>0)readClue(p.clue,{sourceType:'photo',sourceId:p.id,title:p.title,date:p.date})};if(pic.complete)read();else pic.addEventListener('load',read,{once:true})}
  }
 }
 function dpExportText(){const d=dpState();return {available:d.phoneRecovered,active:d.active,unlocked:d.daughter.pinUnlocked,view:{...d.daughter.view},battery:d.daughter.battery,read:Object.keys(d.daughter.read),shared:d.shared.map(o=>({id:o.id,kind:o.kind,title:o.title})),identity:'林小禾的备用机，历史内容，不连接实时对话'}}
 // These shell listeners predate delegated actions; intercept only while this device is visible.
 document.addEventListener('click',e=>{if(!dpActive())return;const el=e.target.closest('#home-key,#status-time,#status-controls');if(!el)return;e.preventDefault();e.stopImmediatePropagation();if(el.id==='home-key')goHome();else if(state().pinUnlocked)navigate('settings')},true);
 document.addEventListener('keydown',e=>{if(!dpActive())return;if(state().view.app==='lock'&&!e.ctrlKey&&!e.metaKey&&(/^\d$/.test(e.key)||e.key==='Backspace')){e.preventDefault();e.stopImmediatePropagation();if(e.key==='Backspace'){pin=pin.slice(0,-1);dpRender()}else pinDigit(e.key)}else if(e.key==='Escape'){e.preventDefault();e.stopImmediatePropagation();if(document.querySelector('#overlay')?.children.length)clearSheet();else goBack()}},true);
 document.addEventListener('scroll',e=>{if(dpActive()&&e.target.matches?.('#screen .dp-scroll'))remember()},true);
 document.addEventListener('keydown',e=>{if(!dpState().phoneRecovered||!e.altKey||e.ctrlKey||e.metaKey||!['1','2'].includes(e.key)||e.target.matches?.('input,textarea,[contenteditable=true]'))return;e.preventDefault();dpSwitch(e.key==='1'?'father':'daughter')},true);
 Object.assign(window,{dpState,dpActive,dpRender,dpAction,dpSubmit,dpAfterRender,dpSwitch,dpExportText,dpNavigate:navigate,dpGoBack:goBack,dpReadClue:readClue,dpIcon});
})();
