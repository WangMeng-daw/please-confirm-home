/* In-world controls, not evidence questionnaires. Canonical events never come from a model. */
const PUZZLE_VERSION=2;
function syncPuzzle(){
 if(!S.puzzle)S.puzzle={version:PUZZLE_VERSION,clockOffset:0,cameraReady:false,vehicle:'',intake:'',adminUnlocked:false,backupRestored:false,restored:[],adminFate:false,feedCut:false,privateDoor:false,doorKeys:[],knocks:[],sealSteps:[],events:{}};
 const p=S.puzzle;p.events??={};p.restored??=[];p.doorKeys??=[];p.knocks??=[];p.sealSteps??=[];
 if(!p.migrated){
  // A delivered return remains true. Earlier receipts do not solve the new mechanisms.
  if(S.flags.found){p.cameraReady=true;p.vehicle='4176';p.intake='04'}
  S.pending=(S.pending||[]).filter(m=>!/^return-(source-writeback|private-writeback|evidence-receipt)/.test(m.extra?.horrorEvent||''));
  for(const key of ['web-verify','inquiry-route','inquiry-transfer','ri-source','ri-memory','ri-authorization','cipher-review','cipher-receipt'])if(S.formDrafts)delete S.formDrafts[key];
  p.migrated=true;
 }
 for(const [id,name,photo] of [['guardian','守灯君','god-lamp'],['mother','食名母','god-devour']]){D.people[id]={name,photo,hiddenGod:true,wx:''};S.history[id]??=[]}
 if(S.flags.done)return;
 if(S.flags.interviewed&&!S.flags.verified&&!p.events.leadScheduled){p.events.leadScheduled=true;S.flags.verified=true;S.verification={time:'17:40',clothes:'奶白色外套'};p.needLead=true}
}
function puzzleEvent(key,id,lines){const p=S.puzzle;if(S.flags.done||p.events[key])return;p.events[key]=true;replyMany(id,lines)}
function puzzleLink(label,path,cls='pz-link'){return `<button class="${cls}" data-a="url" data-url="${E(/^https:/.test(path)?path:BASE+path)}">${E(label)}</button>`}
function puzzleButton(label,action,extra='',cls='pz-button'){return `<button class="${cls}" data-a="${action}" ${extra}>${label}</button>`}
function puzzleShell(title,body,theme='admin'){return `<div class="pz-site pz-${theme}" style="--pz-photo:url('${asset(theme==='ritual'?'web-bg-cult':theme==='ending'?'ending-dawn':'web-bg-records')}')"><header><span>${theme==='admin'?'归家互助 / 站务':theme==='camera'?'YS · 设备档案':theme==='ending'?'归途':'旧堂档案'}</span><b>${E(title)}</b></header><main>${body}</main><footer>${theme==='admin'?'GUIJIA · 志愿互助始于 2019':theme==='camera'?'YS-02 · 只读影像播放器':'归亲堂 · 档案留存'}</footer></div>`}
function puzzleError(){return `<p class="pz-error" role="status">${E(R.puzzleError||'')}</p>`}
function puzzleLogin(){return puzzleShell('站务登录',`<div class="pz-admin-mark">GJ<span>归家互助</span></div><h1>欢迎回来</h1><p>归家互助 · 维护账户</p><form class="pz-form" data-form="pz-login"><label>账户<input name="account" autocomplete="off" required value="${E(S.formDrafts?.['pz-login']?.account||'')}"></label><label>密码<input name="password" type="password" autocomplete="off" required></label>${puzzleError()}<button>登录</button></form><details><summary>旧账户无法登录？</summary><p>2019 版账户资料已迁移，账户名沿用注册名。</p><dl class="pz-login-note"><dt>旧版密码提示</dt><dd>第一天</dd><dt>日期填写格式</dt><dd>YYYYMMDD</dd></dl></details>`)}
function puzzleConsole(){const p=S.puzzle;return puzzleShell('沈闻 · 站点管理',`<figure class="station-cover"><img src="${asset('ui-station-desk')}" alt="旧站办公室里空着的值班桌"><figcaption>归家互助 · 站务室</figcaption></figure><div class="pz-console-user"><span class="station-avatar">沈</span><span><strong>awen_0906</strong><small>上次登录　2026.09.06 23:17</small></span></div><section class="station-log-card"><div class="station-section-heading"><h2>最近记录</h2><span>2026 / 09</span></div><ol class="station-log">${[['09.06 23:17','完整备份写入'],['09.07 00:00','发布：离岗通知.txt'],['09.07 00:01','账号登录：awen_0906'],['09.07 00:01','删除：离岗通知.txt']].map(([time,event])=>`<li><time>${time}</time><span>${event}</span></li>`).join('')}</ol><p class="station-log-note">9月7日登录设备：未记录</p></section><div class="station-shortcuts">${puzzleLink('版本与备份','/manage/backups')}${p.backupRestored?puzzleLink('回收站（3）','/manage/trash'):''}${p.adminFate?puzzleLink('旧站通信分线箱','/manage/switchboard'):''}</div><p class="pz-muted">原始附件随完整备份保存，覆盖版不保留旧附件。</p>`)}

function puzzleBackups(){const p=S.puzzle;return puzzleShell('版本与备份',`<div class="station-section-heading"><h1>备份列表</h1><span>3 份</span></div><p class="pz-muted">预览不会覆盖当前资料。</p><div class="pz-backups">${[['0905','09.05','增量','缺失附件','32 KB'],['0906','09.06','完整','日志结束于 23:17','18.4 MB'],['0907','09.07','覆盖','来自新负责人','18.4 MB']].map(([id,date,title,note,size])=>puzzleButton(`<span class="backup-date">${date}</span><span class="backup-copy"><strong>${title}</strong><small>${note}</small></span><span class="backup-size">${size}</span>`,'pz-backup',`data-id="${id}"`,'pz-backup-card')).join('')}</div>${p.backupRestored?'<p class="pz-success">09.06 完整备份已载入。</p>'+puzzleLink('打开 2019 旧站快照','/manage/snapshot'):''}${puzzleError()}`)}

function puzzleSnapshot(){return puzzleShell('归家互助 · 旧版快照',`<div class="pz-old-site"><h1>回来就好。</h1><p>2019 年 9 月 6 日，我们第一次把邻里的寻人启事放到网上。没有匹配算法，没有“家庭归档”，只有一个个愿意帮忙的人。</p><img src="${asset('douyin-admin')}" alt="沈闻与旧站办公室"><p>站务：沈闻 / 阿闻修字</p><p>不收钱。不替家属认人。人没有回来，就不撤启事。</p><blockquote>“删掉的东西先留三十天，我怕家属回来时找不到。”</blockquote><p>留言（2026.09.06）<br>守灯小院 · 22:46：新来的那一支在改你的网页。请不要用自己的名字给他们试系统。</p><p>沈闻 · 2026.09.06 23:10：我今晚关掉镜像。先把这些孩子留在名单上。</p>${puzzleLink('站务回收站','/manage/trash')}</div>`)}
function puzzleTrash(){const p=S.puzzle;return puzzleShell('回收站',`<div class="station-section-heading"><h1>已删除文件</h1><span>3 项</span></div><p class="pz-muted">保留至 10 月 7 日，恢复后回到原目录。</p><div class="station-file-list">${[['notice','离岗通知.txt','3 KB'],['draft','未发布草稿.html','17 KB'],['routine','维护排班.csv','2 KB']].map(([id,n,size])=>`<div class="pz-file"><img class="station-file-icon" src="${asset('document-file')}" alt=""><span>${n}<small>${size} · 删除人：沈闻</small></span>${puzzleButton(p.restored.includes(id)?'打开':'恢复','pz-restore',`data-id="${id}"`)}</div>`).join('')}</div>${puzzleLink('返回站点管理','/manage/')}`)}

function puzzleNotice(){return clueUnavailable()}
function puzzleRestored(){const p=S.puzzle;return puzzleShell('未发布草稿',`<div class="pz-deleted"><p>灯下的名字，不应替换。</p><p>在册的人，不应是供物。</p><p>背过面去，才看见有人替我写字。</p><p>面向门口，已经看不见出去的路。</p></div><h1>归档附记</h1><p>原稿无标题，按原排版存档。</p><form data-form="pz-draft-search" class="pz-form"><label>旧稿检索<input name="query" autocomplete="off" required placeholder="标题 / 词句"></label><button>搜索</button>${puzzleError()}</form>${p.adminFate?puzzleLink('背页留存','/manage/灯在背面'):''}`)}
function puzzleBackPage(){return clueAdminBack()}
function puzzleSwitchboard(){return clueCommunication()}
function puzzleVoice(){return clueCommunication()}
function puzzlePrivateDoor(){return clueCommunication()}
function puzzleFinal(){return clueUnavailable()}
function puzzleConvert(){return clueUnavailable()}
function puzzleEnding(){}
function puzzleEndingLines(id,lines){replyMany(id,lines)}
function puzzleEndingPage(){
 const e=S.flags.done,m={
  rescued:['她走过那道缝','小禾回来了。母神没有消失，六盏灯继续等着各自的名字。','ending-rescued-bg','ending-rescued-title'],
  sealed:['请确认，天亮了','七名失踪者都已获救。家属不再接受替身，食名母被重新封印，代归尊也失去了那些亲人的面貌。','ending-sealed-bg','ending-sealed-title'],
  converted:['下一户，请进','林砚的头像继续发送消息。发布者一栏里，他的名字已经空了。','ending-converted-bg','ending-converted-title'],
  accepted:['已经回家','家庭关系已归档。','returned'],
  retained:['继续寻找','寻亲登记保留。','door'],
  preserved:['名字还在','寻人记录还在，他们还在等家人来找。','god-lamp']
 }[e];
 if(!m)return puzzleShell('天还没亮','<p>窗外的灯亮着。</p>','ending');
 const last=e==='rescued'?'她没有照着照片里的表情笑。她只问你，鲸鱼还在不在。':e==='sealed'?'妻子发来一张院门照片。光照到脚印上，终于都只有一个方向。':e==='converted'?'最新消息：林先生，您好。请发一张孩子最近的照片。':'';
 return `<div class="pz-ending pz-end-${E(e)}" data-ending="${E(e)}" style="--end-art:url('${asset(m[2])}')"><div class="pz-ending-copy"><time>2026.09.25　${e==='converted'?'00:07':'06:11'}</time><h1 class="${m[3]?'pz-ending-title':'pz-ending-legacy-title'}">${m[3]?`<span class="pz-ending-title-text">${E(m[0])}</span><img src="${asset(m[3])}" alt="" aria-hidden="true" draggable="false">`:E(m[0])}</h1><p class="pz-ending-lead">${m[1]}</p>${last?`<p class="pz-ending-afterword">${last}</p>`:''}<div class="pz-ending-actions">${puzzleButton('回到手机','home')}${e==='sealed'||e==='rescued'?puzzleButton('看看发来的消息','nav','data-app="chats"'):''}</div></div></div>`
}
function puzzleRitualReady(type){browse(BASE+'/ritual/'+(type==='seal'?'seal':'rescue'))}
function deityMessageHTML(m,id){return `<div class="pz-deity-line ${m.me?'me':''}"><small>${m.me?'林砚':pname(id)}</small>${m.type==='image'?`<button class="deity-image" data-a="photo" data-id="${E(m.photo)}" aria-label="查看食名母发来的图片"><img src="${asset(m.photo)}" alt="图片"></button>`:`<p>${E(m.text)}</p>`}</div>`}
function puzzleDeityUI(){const id=R.id==='mother'?'mother':'guardian';const messages=(S.history[id]||[]).filter(m=>!m.date);return `<div class="pz-deity-chat pz-deity-${id}" style="--deity-art:url('${asset(id==='mother'?'god-devour':'god-lamp')}')">${appHeader(pname(id))}<div class="scroll pz-deity-messages" id="deity-messages"><p class="pz-deity-address">${id==='mother'?'你说的话，它都听得见。':'灯下的声音很轻。'}</p>${messages.map(m=>deityMessageHTML(m,id)).join('')}</div><form class="pz-deity-compose" data-form="pz-god-chat"><input name="message" aria-label="向神像说话" autocomplete="off" value="${E(S.drafts[id]||'')}" placeholder="${id==='mother'?'座前说话…':'灯下说话…'}"><button>发送</button></form></div>`}
function puzzleDeitySend(id,text){if(!text||!clueNpcAllowed(id)||!requirePhoneNetwork())return;dateChat(id);S.history[id].push({me:true,text:text.slice(0,800)});S.drafts[id]='';persist();render();if(typeof returnedDeitySend==='function'&&returnedDeitySend(id,text))return;npcReply(id,text,id==='mother'?['她就在屋里。你还要到哪里去找？','把名字给我。你会认得她。']:['我听见了。我的力量不够。','原册还在。六家的亲人，要听六家自己怎么说。'])}
function puzzleWeb(u){
 const p=S.puzzle,host=u.hostname;let path;try{path=decodeURIComponent(u.pathname)}catch{return '<div class="safari-error"><h2>无法打开网页</h2><p>地址格式有误。</p></div>'}
 if(host==='service.huai.example'&&path==='/player/ys02')return puzzleCamera();
 if(host==='street.huai.example'&&path.startsWith('/vehicle/'))return puzzleVehicle(path.split('/').pop());
 if(host==='records.guijia.example'&&path==='/intake')return puzzleIntake();
 if(host==='records.guijia.example'&&path.startsWith('/folder/'))return puzzleFolder(path.split('/').pop());
 if(!['www.guijia.example','guijia.example'].includes(host))return null;
 if(path==='/ending'||path==='/receipt'&&S.flags.done)return puzzleEndingPage();
 if(path==='/about')return webHeader()+`<article class="web-pad"><h1>关于归家互助</h1><p>2019 年，槐城邻里的寻人启事有了一个共同的网页。归家站从整理街坊口耳相传的消息开始，后来逐步建立失联亲属目录。</p><figure class="pz-about-figure"><img class="pz-about-photo" src="${asset('douyin-admin')}" alt="归家互助早期办公室"><figcaption>归家互助早期办公室 · 阿闻修字 摄</figcaption></figure><p>最初的页面由志愿者沈闻搭建。街坊送来的纸条和照片，就在这张桌子上整理、录入。</p><p>如今，归家家庭服务中心负责登记受理、资料补充与家属联络。我们保留着早期的寻人记录，也感谢一路参与的志愿者。</p><details><summary>站务与版权</summary><p>网站初版由沈闻维护，照片与文字版权归原作者所有。转发寻人信息请保留原文、发布日期及联系方式。</p>${puzzleLink('站务入口','/manage/login')}</details></article>`+webFooter();
 if(path==='/followup')return webHeader()+`<div class="web-pad"><h1>寻访联络</h1><p>${S.flags.matched?'西郊救助站已与周警官取得联系，请留意微信。':S.flags.followup?'站方正在翻查交接时的照片。近日新接收的女孩，也会由办案人员另行了解。':S.flags.leadReviewed?'北站照片已经排除。其余公开留言由志愿者逐一联系。':'暂无联络记录。'}</p>${S.flags.followup&&!S.flags.matched?puzzleButton('查看站方新留言','check-match','', 'web-primary'):''}${wechatIsFriend('club')?puzzleButton('联系许老师','chat','data-id="club"', 'web-primary'):''}</div>`+webFooter();
 if(path==='/verify')return webHeader()+`<div class="web-pad"><h1>失联当日</h1><p>学校提供：8 月 13 日 17:40，奶白色外套。相关照片由许老师单独发到微信。</p>${puzzleButton('打开微信消息','chat','data-id="club"', 'web-primary')}</div>`+webFooter();
 if(['/account/source-review','/account/memory-review','/account/authorization','/family/close-request','/family/pending'].includes(path))return p.adminUnlocked&&S.flags.found?puzzleConsole():puzzleLogin();
 if(path.startsWith('/manage')){
  if(!p.adminUnlocked||path==='/manage/login')return puzzleLogin();
  if(!S.flags.found)return puzzleShell('旧账户已登录',`<p>家属目录迁移中，历史附件暂不可用。</p><dl><dt>当前账户</dt><dd>awen_0906</dd><dt>最近备份</dt><dd>2026-09-06 23:17</dd></dl>${puzzleLink('回到寻人目录','/search')}`);
  if(path==='/manage/backups')return puzzleBackups();
  if(path==='/manage/snapshot')return p.backupRestored?puzzleSnapshot():puzzleBackups();
  if(['/manage/trash','/manage/restored','/manage/notice','/manage/灯在背面','/manage/switchboard','/manage/voice','/manage/private-door'].includes(path)&&!p.backupRestored)return puzzleBackups();
  if(path==='/manage/trash')return puzzleTrash();
  if(path==='/manage/notice')return p.restored.includes('notice')?puzzleNotice():puzzleTrash();
  if(path==='/manage/restored')return p.restored.includes('draft')?puzzleRestored():puzzleTrash();
  if(path==='/manage/灯在背面')return p.restored.includes('draft')?puzzleBackPage():puzzleTrash();
  if(['/manage/switchboard','/manage/voice','/manage/private-door'].includes(path)&&!p.adminFate)return puzzleRestored();
  if(path==='/manage/switchboard')return puzzleSwitchboard();if(path==='/manage/voice')return puzzleVoice();if(path==='/manage/private-door')return puzzlePrivateDoor();
  return puzzleConsole();
 }
 if(path.startsWith('/account/')&&(!p.adminFate||!p.feedCut))return puzzleLogin();
 if(path==='/account/convert')return puzzleConvert();
 if(path.startsWith('/ritual/'))return puzzleFinal(path.endsWith('seal')?'seal':'rescue');
 return null;
}
function puzzleCamera(){return parkingCamera()}
function puzzleVehicle(id){return parkingVehicle(id)}
function puzzleIntake(){return parkingIntake()}
function puzzleFolder(id){return parkingFolder('qinghuai',id)}
function puzzleAction(a,b){if(['pz-port','pz-key','pz-key-reset','pz-knock','pz-knock-reset','pz-seal-step','pz-vow-retract','pz-convert-final','puzzle-ending-rescue','puzzle-ending-seal'].includes(a))return true;const p=S.puzzle,id=b.dataset.id;if(a==='deity-talk'){if(!S.flags.inner)return true;go('deity',{id:id==='mother'?'mother':'guardian'});return true}if(!a.startsWith('pz-')&&!a.startsWith('puzzle-ending-'))return false;
 if(a==='pz-admin-profile'){go('douyin',{view:'profile',creator:'awen',user:'awen',profile:'awen',id:'awen'});return true}
 if(S.flags.done&&a!=='pz-ending'){browse(BASE+'/ending');return true}R.puzzleError='';
 if(['pz-backup','pz-restore','pz-port','pz-key','pz-key-reset'].includes(a)&&(!p.adminUnlocked||!S.flags.found))return true;
 if(a==='pz-clock'||a==='pz-camera-locate')return true;
 else if(a==='pz-transfer-open'&&p.intake==='04'){requestFollowup();}
 else if(a==='pz-backup'){if(id==='0906'){p.backupRestored=true;browse(BASE+'/manage/snapshot')}else{R.puzzleError=id==='0907'?'该覆盖版本不含站务原件。':'增量备份缺少首页和附件，无法完整载入。';render()}}
 else if(a==='pz-restore'){if(!p.restored.includes(id))p.restored.push(id);if(id==='notice')browse(BASE+'/manage/notice');else if(id==='draft')browse(BASE+'/manage/restored');else dialog('维护排班.csv','沈闻：截至 2026.09.06。\n9 月 7 日之后，值班人一栏全部是同一段空白。')}

 persist();return true;
}
function puzzleSubmit(kind,d){if(!['pz-login','pz-draft-search','pz-god-chat'].includes(kind))return false;const p=S.puzzle;R.puzzleError='';if(kind==='pz-god-chat'){puzzleDeitySend(R.id,String(d.get('message')||'').trim());return true}if(S.flags.done){browse(BASE+'/ending');return true}
 if(kind==='pz-login'){if(String(d.get('account')).trim().toLowerCase()==='awen_0906'&&d.get('password')==='20190906'){p.adminUnlocked=true;browse(BASE+'/manage/')}else{R.puzzleError='用户名或密码不正确。';render()}}
 if(kind==='pz-draft-search'){if(p.backupRestored&&String(d.get('query')).trim()==='灯在背面')browse(BASE+'/manage/灯在背面');else{R.puzzleError='未找到相关旧稿。';render()}}

 persist();return true;
}
function puzzleAfterRender(){
 if(S.puzzle.needLead){delete S.puzzle.needLead;dayTo(21,'11:27');replyMany('club',['学校已经把17:40放学、奶白色外套这些情况告诉办案人员了，您不用重复填。','北站志愿者发来一张照片。您看看，这个孩子是小禾吗？',{type:'image',photo:'lead'}]);}
 if(R.app==='deity'){const el=$('#deity-messages');if(el)el.scrollTop=el.scrollHeight}
}
syncPuzzle();
function puzzleConversation(id,text){
 return false;
}
