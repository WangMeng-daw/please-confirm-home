/* Recovered WeChat Moments. Historic records and local drafts belong only to Xiaohe's device. */
(()=>{
 if(window.DAUGHTER_MOMENTS_VERSION)return;
 window.DAUGHTER_MOMENTS_VERSION=1;
 const esc=v=>E(String(v??'')),img=id=>asset(id), icon=name=>typeof dpIcon==='function'?dpIcon(name):ico(name);
 const people={
  self:{name:'小禾',asset:'before',cover:'cover-xiaohe',sign:'纸飞机要飞到海边。',wx:'little_he_0611'},
  mother:{name:'妈妈',portrait:'wife',cover:'cover-linlan',sign:'慢慢来。',wx:'lan_life'},
  father:{name:'爸爸',portrait:'me',cover:'cover-linyan',sign:'平安就好。',wx:'lin_yan'},
  classmate:{name:'宁宁',asset:'album_020',cover:'album_016',sign:'纸飞机飞远一点',wx:'ning_paperplane'},
  friend:{name:'赵叔叔',portrait:'friend',cover:'cover-zhao',sign:'骑慢一点，沿路都好看。'},
  teacher:{name:'刘老师',portrait:'teacher',cover:'cover-liu',sign:'认真备课，早点睡觉。'},
 };
 const personNames={'小禾':'self','林小禾':'self','陈小禾':'self','林砚':'father','李岚':'mother','林岚':'mother','老赵':'friend','刘老师':'teacher','宁宁':'classmate'};
 const personId=name=>personNames[name]||null;
 const displayName=name=>people[personId(name)]?.name||name;
 const c=(person,text)=>({person,text});
 const extra=[
  {id:'dpm-0907-shen-account',person:'self',at:'2026-09-07 08:36',local:true,recovered:true,text:'昨天沈叔叔还说“小禾，我会想办法让你爸爸找到你”。今天同一个头像只回“今日已完成接续”“各户按新页诵读”。我问他来不来，他不答。\n我把昨晚9月6日的原信存下了。以后看这个头像，要先看消息是哪天写的。',photos:[],likes:[],comments:[],clue:'dp-shen-changed'},
  {id:'dpm-0820-van-date',person:'self',at:'2026-08-20 20:02',local:true,recovered:true,text:'今天借到手机，值班的人发来这张照片。存进来显示8月20日，可照片是8月13日拍的，就是他们说爸爸不舒服、带我上车的那天。\n照片里的我还在等见到爸爸。今天我也没有见到他。',photos:['daughter-0813-van'],likes:[],comments:[],clue:'dp-transfer'},
  {id:'dpm-paper-crab',person:'classmate',at:'2026-08-12 18:42',text:'四个翅膀也没飞远。小禾说我折的是纸螃蟹。',photos:[],likes:['self'],comments:[c('self','明天带来给我看看。'),c('classmate','不许当着大家叫它螃蟹！')]},
  {id:'dpm-green-pencil',person:'self',at:'2026-08-11 19:16',text:'找了半天绿色的笔，原来在宁宁那里。翻到以前的画，树上还能再画一只鸟。',photos:['album_016'],likes:['mother','classmate'],comments:[c('classmate','明天就还你。'),c('mother','用完记得收进笔袋。')]},
  {id:'dpm-whale-tail',person:'self',at:'2026-08-10 18:05',text:'翻到四月拍的鲸鱼。这是旧照片，那时尾巴还没开线。现在尾巴下面多了一根白线，是爸爸补的最后一针。\n我说留着，别剪掉，认它就不会拿错。',photos:['album_014'],likes:['father','mother'],comments:[c('father','留着。以后认这一针就行。'),c('self','它是我的，不跟别人换。')],clue:'dp-whale-stitch'},
  {id:'dpm-summer-drink',person:'classmate',at:'2026-08-07 16:38',text:'写完暑托作业我要吃半个冰西瓜。',photos:[],likes:['self'],comments:[c('self','半个也太多了。'),c('classmate','吃不完剩下的给你。')]},
  {id:'dpm-old-family',person:'self',at:'2026-07-22 19:03',text:'翻到三月的合照。妈妈说我只要坐到爸爸旁边，就一定要挤他。',photos:['album_001','album_004','album_007'],likes:['mother','father','friend'],comments:[c('father','沙发那么大，全坐我这一边。'),c('mother','桥上也是。')]},
  {id:'dpm-backpack',person:'self',at:'2026-07-03 17:19',text:'出门要带水杯、钥匙，还有它。',photos:['album_085'],likes:['mother','classmate'],comments:[c('mother','还有作业。'),c('self','知道了知道了。')]},
  {id:'dpm-paper-plane',person:'classmate',at:'2026-04-17 18:02',text:'小禾发来的纸飞机，比我折的尖。下次去操场比一比。',photos:['album_020'],likes:['self'],comments:[c('self','爸爸教我的，我明天教你。')]},
 ];
 let historic=null;
 function posts(){
  if(historic)return historic;
  const ids=['summer_homework','sleepy_waiting','drawing_house','birthday_outtakes','saturday_breakfast','little_whale_day','trip'];
  const who={daughter:'self',wife:'mother',me:'father',friend:'friend',teacher:'teacher'};
  const saved=ids.map(id=>D.moments.find(p=>p.id===id)).filter(Boolean).map(p=>({
   id:'dpm-saved-'+p.id,person:who[p.person],at:String(p.postedAt||p.sortAt||p.date).replace('T',' ').slice(0,16),text:p.text,
   photos:[...(p.photos||(p.photo?[p.photo]:p.art==='sea'?['sea']:[]))],location:p.location||'',
   likes:p.likes.map(name=>personId(name)||name),comments:p.comments.map(x=>({person:personId(x.name)||x.name,text:x.text})),
  }));
  historic=[...extra,...saved].map(p=>({...p,likes:[...p.likes],comments:p.comments.map(x=>({...x}))})).sort((a,b)=>b.at.localeCompare(a.at));
  return historic;
 }
 function store(){const x=dpState().daughter;x.moments??={};const m=x.moments;m.likes??={};m.comments??={};m.commentDrafts??={};m.drafts??=[];m.compose??={text:'',photos:[]};m.version=1;return m}
 const current=()=>dpState().daughter.view;
 const save=()=>{if(typeof persist==='function')persist()};
 const nav=(app,extra={})=>dpNavigate(app,extra);
 function refresh(){const top=document.querySelector('#screen .dp-scroll')?.scrollTop;save();dpRender();if(top!=null)requestAnimationFrame(()=>{const e=document.querySelector('#screen .dp-scroll');if(e)e.scrollTop=top})}
 function known(id){return !!(people[id]||window.DAUGHTER_CONTENT.contacts[id])}
 function person(id){const p=people[id]||window.DAUGHTER_CONTENT.contacts[id]||{name:id,asset:'sea',sign:''};const source={self:'daughter',father:'me',mother:'wife',friend:'friend',teacher:'teacher'}[id];return {...p,wx:(source&&D.people[source]?.wx)||p.wx,cover:p.cover||p.asset||'sea'}}
 function portrait(id,button=true){const p=person(id),body=p.portrait&&typeof personPortrait==='function'?personPortrait(p.portrait):`<img src="${img(p.asset)}" alt="">`;return button?`<button class="avatar real-avatar dp-avatar dpm-avatar" data-a="dpm-profile" data-id="${esc(id)}" aria-label="查看${esc(p.name)}的资料">${body}</button>`:`<span class="avatar real-avatar dp-avatar dpm-avatar" role="img" aria-label="${esc(p.name)}的头像">${body}</span>`}
 const date=at=>{const m=String(at).match(/^(\d{4})-(\d{2})-(\d{2}) (\d{2}:\d{2})/);return m?`${+m[2]}月${+m[3]}日 ${m[4]}`:at};
 const header=(title,right='')=>`<header class="wx-header"><button data-a="dp-back" aria-label="返回">${icon('back')}</button><h2>${esc(title)}</h2>${right||'<span class="header-gap"></span>'}</header>`;
 const named=id=>people[id]?`<button data-a="dpm-profile" data-id="${id}">${esc(people[id].name)}</button>`:esc(displayName(id));
 function pictures(p){return p.photos?.length?`<div class="moment-photo-grid count-${Math.min(9,p.photos.length)}" data-count="${p.photos.length}">${p.photos.slice(0,9).map((photo,i)=>`<button class="moment-picture" data-a="dpm-photo" data-id="${esc(p.id)}" data-index="${i}" aria-label="查看第 ${i+1} 张照片"><img src="${img(photo)}" alt="${esc(D.photos[photo]?.description||'朋友圈照片')}" loading="lazy" decoding="async"></button>`).join('')}</div>`:''}
 function social(p){const s=store(),drafts=s.comments[p.id]||[],likePending=Object.prototype.hasOwnProperty.call(s.likes,p.id),likes=likePending?(s.likes[p.id]?[...p.likes.filter(x=>x!=='self'),'self']:p.likes.filter(x=>x!=='self')):p.likes;
  if(!likes.length&&!p.comments.length&&!drafts.length&&!likePending)return '';
  return `<div class="moment-social">${likes.length?`<div class="moment-likes">♡ ${likes.map(named).join('，')}</div>`:''}${likePending?`<p class="dpm-pending-status">${s.likes[p.id]?'赞':'取消赞'}未发送 · 账号已退出登录</p>`:''}${p.comments.map((c,i)=>`<button class="moment-comment" data-a="dpm-reply" data-id="${p.id}" data-index="${i}"><b>${esc(person(c.person).name)}</b>：${esc(c.text)}</button>`).join('')}${drafts.map(c=>`<div class="moment-comment dpm-local-comment"><b>小禾</b>${c.reply?` 回复 <b>${esc(person(c.reply).name)}</b>`:''}：${esc(c.text)}<span class="dpm-pending-status">未发送</span><button data-a="dpm-remove-comment" data-id="${p.id}" data-comment="${esc(c.id)}" aria-label="删除未发送的评论">删除</button></div>`).join('')}</div>`;
 }
 function row(p){
  const clue=p.clue?` data-dp-clue="${p.clue}" data-source-type="moments" data-source-id="${p.id}" data-title="${esc(person(p.person).name+'的朋友圈')}" data-date="${p.at}"`:'';
  const timestamp=esc(date(p.at))+(p.local?' · 未发表 · 仅保存在此手机':'');
  const action=p.local?(p.recovered?'':`<button data-a="dpm-delete-draft" data-id="${p.id}">删除</button>`):`<button class="moment-more" data-a="dpm-menu" data-id="${p.id}" aria-label="点赞或评论">••</button>`;
  return `<article class="moment" data-dpm-id="${p.id}">${portrait(p.person)}<div class="moment-main"><button class="moment-name" data-a="dpm-profile" data-id="${p.person}">${esc(person(p.person).name)}</button><p${clue}>${esc(p.text).replaceAll('\n','<br>')}</p>${pictures(p)}<div class="moment-meta"><time>${timestamp}${p.location?' · '+esc(p.location):''}</time>${action}</div>${!p.local&&current().menu===p.id?`<div class="moment-actions"><button data-a="dpm-like" data-id="${p.id}">♡ ${(Object.prototype.hasOwnProperty.call(store().likes,p.id)?store().likes[p.id]:p.likes.includes('self'))?'取消':'赞'}</button><button data-a="dpm-comment" data-id="${p.id}">▢ 评论</button></div>`:''}${p.local?'':social(p)}</div></article>`
 }
 function feed(v){const id=v.person||'self',p=person(id),list=[...(!v.person||v.person==='self'?store().drafts:[]),...posts().filter(p=>!v.person||p.person===v.person)];return `<div class="scroll moments-feed dp-scroll dp-moments-feed" data-owner="${id}"><div class="moments-cover personal-cover"><button class="cover-picture" data-a="dpm-cover" data-id="${id}" aria-label="查看${esc(p.name)}的朋友圈封面"><img src="${img(p.cover)}" alt="${esc(p.name)}的朋友圈封面"></button><button class="moments-back" data-a="dp-back" aria-label="返回">${icon('back')}</button>${id==='self'?`<button class="moments-camera" data-a="dpm-compose" aria-label="写朋友圈草稿">${icon('camera')}</button>`:''}<div class="moments-owner"><button class="dpm-owner-name" data-a="dpm-timeline" data-id="${id}"><strong>${esc(p.name)}</strong></button>${portrait(id)}</div></div><div class="moments-sign">${esc(p.sign)}</div><div class="dpm-offline-status">账号已退出登录 · 本机保存的朋友圈</div>${list.map(row).join('')}<div class="moments-end">${list.length?'—':'暂无保存的朋友圈'}</div></div>${v.comment?`<form class="comment-compose dpm-comment-compose" data-form="dpm-comment"><input type="hidden" name="post" value="${esc(v.comment)}"><input type="hidden" name="reply" value="${esc(v.reply||'')}"><div><input name="text" id="dpm-comment-text" value="${esc(store().commentDrafts[v.comment]||'')}" maxlength="300" aria-label="评论草稿" placeholder="${v.reply?'回复'+esc(person(v.reply).name):'评论'}" autocomplete="off"><small>账号已退出登录，评论仅保存在此手机</small></div><button type="submit">保存</button><button type="button" data-a="dpm-close-comment" aria-label="关闭评论">×</button></form>`:''}`}
 function profile(v){const p=person(v.id),ps=posts().filter(p=>p.person===v.id).flatMap(p=>p.photos).slice(0,3);return header('详细资料')+`<div class="scroll wx-bg dp-scroll dpm-profile"><div class="profile-header">${portrait(v.id,false)}<div><h2>${esc(p.name)}</h2>${p.wx?`<p>微信号：${esc(p.wx)}</p>`:''}<p>地区：槐城</p></div></div>${p.sign?`<div class="profile-sign">${esc(p.sign)}</div>`:''}<button class="native-row profile-album" data-a="dpm-timeline" data-id="${esc(v.id)}"><span>朋友圈</span><span class="profile-album-previews">${ps.map(id=>`<img src="${img(id)}" alt="朋友圈照片">`).join('')}</span><b>›</b></button>${window.DAUGHTER_CONTENT.contacts[v.id]?`<button class="profile-send" data-a="dp-chat" data-id="${esc(v.id)}">${icon('chat')} 查看聊天记录</button>`:''}</div>`}
 function compose(){const c=store().compose,photos=window.DAUGHTER_CONTENT.photos.filter(p=>!p.id.startsWith('daughter-'));return header('朋友圈草稿',`<button data-a="dpm-save-compose" class="dpm-save-post">保存</button>`)+`<div class="scroll dp-scroll post-page dpm-compose"><p class="dpm-draft-notice">当前账号已退出登录。内容只保存在此手机，不会发表。</p><textarea id="dpm-post-text" maxlength="1000" aria-label="朋友圈草稿" placeholder="这一刻的想法…">${esc(c.text)}</textarea><div class="post-photos">${c.photos.map(id=>`<button data-a="dpm-compose-photo" data-id="${id}" aria-label="移除已选照片"><img src="${img(id)}" alt="已选照片"><span>×</span></button>`).join('')}</div><h3>选择照片 <span>${c.photos.length}/9</span></h3><div class="dpm-photo-picker">${photos.map(p=>`<button data-a="dpm-compose-photo" data-id="${p.id}" aria-label="${esc(D.photos[p.id]?.description||'照片')}" aria-pressed="${c.photos.includes(p.id)}"><img src="${img(p.asset)}" alt="${esc(D.photos[p.id]?.description||'照片')}" loading="lazy"><span>${c.photos.includes(p.id)?'✓':''}</span></button>`).join('')}</div><p class="dpm-compose-error" role="status">${esc(current().error||'')}</p></div>`}
 function photo(v){const p=[...posts(),...store().drafts].find(p=>p.id===v.id),ids=p?.photos||[],i=Math.max(0,Math.min(ids.length-1,Number(v.index)||0));if(!ids.length)return header('照片');return `<div class="dpm-photo-view"><div class="lightbox-bar"><button data-a="dp-back" aria-label="返回">${icon('back')}</button><span>${i+1} / ${ids.length}</span><span></span></div><button class="dpm-photo-stage ${v.zoom?'zoomed':''}" data-a="dpm-zoom" aria-label="${v.zoom?'缩小':'放大'}照片"><img src="${img(ids[i])}" alt="${esc(D.photos[ids[i]]?.description||'朋友圈照片')}"></button><div class="dpm-photo-caption">${esc(person(p.person).name)} · ${esc(date(p.at))}${p.local?' · 本机草稿':''}</div><div class="native-photo-tools"><button data-a="dpm-photo-step" data-step="-1" aria-label="上一张" ${i===0?'disabled':''}>${icon('back')}</button><span>${i+1} / ${ids.length}</span><button data-a="dpm-photo-step" data-step="1" aria-label="下一张" ${i===ids.length-1?'disabled':''}>${icon('forward')}</button></div></div>`}
 function cover(v){const p=person(v.id);return `<div class="dpm-photo-view">${header(p.name+'的朋友圈封面')}<div class="dpm-photo-stage"><img src="${img(p.cover)}" alt="${esc(p.name)}的朋友圈封面"></div></div>`}
 function dpMomentsUI(v){if(!v)return null;switch(v.app){case 'moments':return feed(v);case 'moment-profile':return profile(v);case 'moment-compose':return compose();case 'moment-photo':return photo(v);case 'moment-cover':return cover(v);default:return null}}
 function dpMomentsAction(a,data){if(!a?.startsWith('dpm-'))return false;if(!dpActive()||!dpState().daughter.pinUnlocked)return true;const raw=data?.dataset||data||{},d={...raw,id:raw.id||raw.person},v=current(),s=store(),p=posts().find(p=>p.id===d.id);switch(a){
  case 'dpm-profile':if(known(d.id))nav('moment-profile',{id:d.id});break;
  case 'dpm-timeline':if(known(d.id))nav('moments',{person:d.id});break;
  case 'dpm-cover':if(known(d.id))nav('moment-cover',{id:d.id});break;
  case 'dpm-photo':if([...posts(),...s.drafts].some(p=>p.id===d.id))nav('moment-photo',{id:d.id,index:Number(d.index)||0});break;
  case 'dpm-photo-step':{const post=[...posts(),...s.drafts].find(p=>p.id===v.id);if(post){v.index=Math.max(0,Math.min(post.photos.length-1,(Number(v.index)||0)+Number(d.step)));v.zoom=false;refresh()}break}
  case 'dpm-zoom':v.zoom=!v.zoom;refresh();break;
  case 'dpm-menu':if(p){v.menu=v.menu===p.id?null:p.id;v.comment=null;refresh()}break;
  case 'dpm-like':if(p){const old=Object.prototype.hasOwnProperty.call(s.likes,p.id)?s.likes[p.id]:p.likes.includes('self');if(!old===p.likes.includes('self'))delete s.likes[p.id];else s.likes[p.id]=!old;v.menu=null;refresh()}break;
  case 'dpm-comment':case 'dpm-reply':if(p){v.comment=p.id;v.reply=a==='dpm-reply'?p.comments[Number(d.index)]?.person||'':'';v.menu=null;refresh();requestAnimationFrame(()=>document.querySelector('#dpm-comment-text')?.focus())}break;
  case 'dpm-close-comment':v.comment=null;v.reply=null;refresh();break;
  case 'dpm-remove-comment':s.comments[d.id]=(s.comments[d.id]||[]).filter(x=>x.id!==d.comment);refresh();break;
  case 'dpm-compose':nav('moment-compose');break;
  case 'dpm-compose-photo':if(window.DAUGHTER_CONTENT.photos.some(p=>p.id===d.id&&!p.id.startsWith('daughter-'))){s.compose.text=document.querySelector('#dpm-post-text')?.value||s.compose.text;if(s.compose.photos.includes(d.id))s.compose.photos=s.compose.photos.filter(id=>id!==d.id);else if(s.compose.photos.length<9)s.compose.photos.push(d.id);else v.error='最多可选择 9 张照片';refresh()}break;
  case 'dpm-save-compose':{s.compose.text=document.querySelector('#dpm-post-text')?.value||s.compose.text;const text=s.compose.text.trim();if(!text&&!s.compose.photos.length){v.error='写点什么或选择一张照片';refresh();break}s.drafts.unshift({id:'dpm-local-'+Date.now(),person:'self',text,photos:[...s.compose.photos],local:true,at:typeof phoneTimestamp==='function'?phoneTimestamp():new Date().toISOString()});s.compose={text:'',photos:[]};save();dpGoBack();break}
  case 'dpm-delete-draft':s.drafts=s.drafts.filter(p=>p.id!==d.id);refresh();break;
 }return true}
 function dpMomentsSubmit(kind,data){if(!kind?.startsWith('dpm-'))return false;if(!dpActive()||!dpState().daughter.pinUnlocked)return true;const val=k=>typeof data?.get==='function'?data.get(k):data?.[k];if(kind==='dpm-comment'){const id=val('post'),text=String(val('text')||'').trim().slice(0,300),p=posts().find(p=>p.id===id);if(p&&text){const s=store();s.comments[id]??=[];const reply=String(val('reply')||'');s.comments[id].push({id:'draft-'+Date.now(),text,reply:p.comments.some(c=>c.person===reply)?reply:'',local:true});delete s.commentDrafts[id];current().comment=null;current().reply=null;refresh()}}return true}
 function dpMomentsProfileRow(id){if(!known(id))return '';return `<button class="native-row dp-row" data-a="dpm-timeline" data-id="${id}"><span>朋友圈</span><b class="row-chevron">›</b></button>`}
 document.addEventListener('input',e=>{if(!dpActive()||!dpState().daughter.pinUnlocked)return;if(e.target.id==='dpm-post-text'){store().compose.text=e.target.value;save()}else if(e.target.id==='dpm-comment-text'&&current().comment){store().commentDrafts[current().comment]=e.target.value;save()}});
 Object.assign(window,{dpMomentsUI,dpMomentsAction,dpMomentsSubmit,dpMomentsProfileRow,dpMomentsRecords:()=>posts().map(p=>({...p}))});
})();
