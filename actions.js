function chat(id,jump){if(!wechatIsFriend(id)){go('newfriends');return}if(id==='club')S.flags.contacted=true;go('chat',{id,jump});$('#notification').innerHTML=''}
function searchWx(q='',scope){go('wxsearch',{q,scope})}
function momentBy(id){return S.moments.find(m=>m.id===id)}
function contextMessage(el){const id=el.dataset.person,i=+el.dataset.msg,m=S.history[id][i];if(m.date)return;contextOpen=true;sheet('',`<div class="message-menu"><button data-a="copy-message" data-id="${id}" data-i="${i}">复制</button><button data-a="forward-message" data-id="${id}" data-i="${i}">转发</button><button data-a="favorite-message" data-id="${id}" data-i="${i}">收藏</button><button data-a="delete-message" data-id="${id}" data-i="${i}">删除</button></div>`)}
function picker(purpose,person){const returnScroll=typeof launcherScroll==='function'?launcherScroll():[];go('picker',{purpose,person,returnScroll})}
function bookmarks(){sheet('书签',S.bookmarks.map((b,i)=>`<div class="bookmark-row"><button data-a="url" data-url="${E(b.url)}">${ico('book')} ${E(b.title)}</button><button data-a="remove-bookmark" data-i="${i}" aria-label="删除书签">${ico('trash')}</button></div>`).join(''))}
function controls(){sheet('控制中心',`<div class="control-grid"><button class="${S.airplane?'active':''}" data-a="airplane">✈<span>飞行模式</span></button><button class="${S.wifi?'active':''}" data-a="wifi">${ico('wifi')}<span>无线局域网</span></button><button data-a="lock">${ico('lock')}<span>锁定屏幕</span></button></div><label class="brightness">${ico('sun')}<input aria-label="亮度" type="range" id="brightness" min="40" max="100" value="${S.brightness}"></label>`)}
function showNotifications(){sheet('通知中心',S.notifications.slice(0,12).map(n=>n.channel==='sms'?smsNotification(n):`<button class="notification-row" data-a="${n.friendRequest?'friend-request':'notify'}" data-id="${n.id}">${av(n.id,false)}<span><strong>${E(pname(n.id))}</strong><small>${n.time}</small><p>${E(n.text).slice(0,90)}</p></span></button>`).join('')||'<p class="native-empty">没有更早的通知</p>')}
function doCalc(k){let v=S.calc;if(k==='AC')v='0';else if(k==='±')v=v.startsWith('-')?v.slice(1):'-'+v;else if(k==='%')v=String(Number(v)/100);else if(k==='='){try{const tokens=v.replace(/×/g,'*').replace(/÷/g,'/').replace(/−/g,'-').match(/(?:\d*\.?\d+)|[+*/-]/g)||[];let idx=0;function atom(){if(tokens[idx]==='-'){idx++;return -atom()}const n=Number(tokens[idx++]);if(!Number.isFinite(n))throw Error();return n}function mul(){let n=atom();while(['*','/'].includes(tokens[idx])){const op=tokens[idx++],b=atom();n=op==='*'?n*b:n/b}return n}function sum(){let n=mul();while(['+','-'].includes(tokens[idx])){const op=tokens[idx++],b=mul();n=op==='+'?n+b:n-b}return n}const n=sum();if(idx!==tokens.length||!Number.isFinite(n))throw Error();v=String(Number(n.toPrecision(12)))}catch{v='错误'}}else if(/[+×÷−]/.test(k)){v=v.replace(/[+×÷−]$/,'')+k}else{v=v==='0'||v==='错误'?k:v+k}S.calc=v;render()}
function alarmDialog(i){const a=S.alarms[i]||{time:'07:00',label:'闹钟'};dialog('闹钟',`<form data-form="alarm" data-i="${i}"><label>时间<input type="time" name="time" value="${a.time}" required></label><label>标签<input name="label" value="${E(a.label)}"></label><button class="native-submit">存储</button></form>`,i>=0?`<button class="danger" data-a="alarm-delete" data-i="${i}">删除闹钟</button><button data-a="close">取消</button>`:'<button data-a="close">取消</button>')}
function backupPanel(){sheet('备份与恢复','<button data-a="export">导出本机备份</button><button data-a="import">从备份恢复</button><button class="danger" data-a="reset">还原本机内容</button>')}
function pickPerson(action,extra=''){sheet('选择联系人',visiblePeople().map(id=>`<button class="contact-row" data-a="${action}" data-id="${id}" ${extra}>${av(id,false)}${E(pname(id))}</button>`).join(''))}
function handle(a,b){if(typeof launcherAction==='function'&&launcherAction(a,b))return;if(typeof xiaohongshuAction==='function'&&xiaohongshuAction(a,b))return;if(typeof wxScanAction==='function'&&wxScanAction(a,b))return;if(a==='sms-open'){smsOpen();return;}if(typeof dpAction==='function'&&dpAction(a,b))return;if(typeof zhihuAction==='function'&&zhihuAction(a,b))return;if(typeof cityMapsAction==='function'&&cityMapsAction(a,b))return;if(typeof clueAction==='function'&&clueAction(a,b)){persist();return;}if(typeof returnedAction==='function'&&returnedAction(a,b)){persist();return}if(typeof socialReactionAction==='function'&&socialReactionAction(a,b)){persist();return}if(puzzleAction(a,b)){persist();return}if(typeof douyinAction==='function'&&douyinAction(a,b)){persist();return}if(a==='home-page'){R.homePage=Number(b.dataset.i)||0;render();return}if(officialAction(a,b)){persist();return}if(typeof cipherAction==='function'&&cipherAction(a,b)){persist();return}if(wechatAction(a,b)){persist();return;}if(['like','publish','attach-file','attach-favorite','attach-card','forward-to','share-photo-to','document-send','note-send','send-url'].includes(a)&&!requirePhoneNetwork())return;if(typeof inquiryAction==='function'&&inquiryAction(a,b)){persist();return}if(typeof returnInvestigationHandle==='function'&&returnInvestigationHandle(a,b)){persist();return}const id=b.dataset.id,i=+b.dataset.i;switch(a){
case 'nav':if(b.dataset.app==='browser'){go('browser')}else go(b.dataset.app);break;
case 'home':home();break;case 'back':back();break;case 'unlock':S.started=true;id?chat(id):home();break;
case 'close':closeOverlay();break;case 'sheet-dismiss':closeOverlay();break;
case 'chat':chat(id);break;case 'notify':$('#notification').innerHTML='';chat(id);break;
case 'phone-contact':go('phonecontact',{id});break;case 'phone-contact-new':nativeContactEditor();break;case 'phone-contact-edit':nativeContactEditor(id);break;
case 'profile':go('profile',{id});break;case 'profile-detail':dialog('个人资料',`<p>微信号：${E(D.people[id].wx)}</p><p>地区：${E(D.people[id].region)}</p><p>${E(id==='me'?S.profile.sign:D.people[id].sign)}</p>`);break;
case 'remark':dialog(id==='me'?'设置名字':'设置备注',`<form data-form="remark" data-id="${id}"><input name="remark" aria-label="备注" maxlength="30" value="${E(pname(id))}"><button class="native-submit">完成</button></form>`,'<button data-a="close">取消</button>');break;
case 'wx-plus':sheet('',`<button data-a="start-chat">发起聊天</button><button data-a="add-friend-search">添加朋友</button><button data-a="wx-scan">扫一扫</button>`);break;
case 'start-chat':pickPerson('chat');break;case 'new-contact':case 'add-friend-search':dialog('添加朋友',`<form data-form="friend-search"><input name="query" aria-label="微信号或昵称" placeholder="微信号 / 昵称"><button class="native-submit">搜索</button></form>`);break;
case 'contact-tags':sheet('标签',`<button data-a="tag" data-tag="family">家人</button><button data-a="tag" data-tag="work">工作</button>`);break;
case 'tag':sheet(b.dataset.tag==='family'?'家人':'工作',(b.dataset.tag==='family'?['wife','daughter']:['police','teacher','friend','club']).filter(x=>visiblePeople().includes(x)).map(x=>`<button class="contact-row" data-a="profile" data-id="${x}">${av(x,false)}${E(pname(x))}</button>`).join(''));break;
case 'wx-search-open':searchWx();break;case 'chat-search':searchWx('',id);break;case 'chat-files':go('chatfiles',{id});break;case 'jump-chat':chat(id,i);break;case 'chatinfo':go('chatinfo',{id});break;
case 'mute':case 'pin':{const key=a==='mute'?'muted':'pinned';S[key]=S[key].includes(id)?S[key].filter(x=>x!==id):[...S[key],id];render();break}
case 'emoji':panel=panel==='emoji'?null:'emoji';render();$('#message-input').focus();break;case 'attachments':panel=panel==='attach'?null:'attach';render();break;
case 'insert-emoji':S.drafts[R.id]=(S.drafts[R.id]||'')+b.dataset.text;render();$('#message-input').focus();break;
case 'pick-chat':picker('chat',R.id);break;case 'pick-post':S.postDraft=$('#post-text').value;picker('post');break;
case 'pick-photo':{const target=R.person,purpose=R.purpose;back();if(purpose==='chat')sendMessage(target,'','image',{photo:id});else if(purpose==='post'){S.postedPhoto=id;render()}else if(purpose==='cover'){S.momentsCover=id;render()}else if(purpose==='registration'){S.registrationPhoto=id;render()}break}
case 'send-file':sheet('文件',`<button data-a="attach-file" data-id="case">寻人登记_QH0417.pdf</button>${S.downloads.length?'<button data-a="attach-file" data-id="inner">家庭资料副本.html</button>':''}`);break;
case 'attach-file':closeOverlay();sendMessage(R.id,id==='case'?'寻人登记_QH0417.pdf':'家庭资料副本.html','file',{file:id});if(R.id==='police'&&id==='inner'){replyMany('police',['资料收到了。我现在过去。','不要开门。']);S.flags.sharedEvidence=true}break;
case 'send-favorite':sheet('收藏',S.favorites.map((m,j)=>`<button data-a="attach-favorite" data-i="${j}">${E(m.text||'[图片]')}</button>`).join('')||'<p class="native-empty">暂无收藏</p>');break;
case 'attach-favorite':{const m=S.favorites[i];closeOverlay();sendMessage(R.id,m.text||'',m.type||'text',m);break}
case 'send-card':pickPerson('attach-card');break;case 'attach-card':closeOverlay();sendMessage(R.id,`[个人名片]\n${pname(id)}\n微信号：${D.people[id].wx}`);break;
case 'copy-message':{const m=S.history[id][i];navigator.clipboard?.writeText(m.text||'[图片]').catch(()=>{});closeOverlay();break}
case 'favorite-message':S.favorites.unshift({...S.history[id][i],from:pname(id),time:time()});closeOverlay();break;
case 'delete-message':S.history[id].splice(i,1);closeOverlay();render();break;
case 'forward-message':pickPerson('forward-to',`data-source="${id}" data-i="${i}"`);break;
case 'forward-to':{const m=clone(S.history[b.dataset.source][i]);delete m.me;delete m.date;closeOverlay();chat(id);sendMessage(id,m.text||'',m.type||'text',m);break}
case 'favorites':go('favorites');break;case 'unfavorite':S.favorites.splice(i,1);render();break;
case 'moments':go('moments');break;case 'my-moments':go('moments',{person:'me'});break;case 'person-moments':go('moments',{person:id});break;
case 'moment-cover':showPersonalCover(id);break;
case 'pick-cover':closeOverlay();picker('cover');break;
case 'profile-signature':dialog('个性签名',`<form data-form="profile-signature"><input name="sign" aria-label="个性签名" maxlength="60" value="${E(S.profile.sign)}"><button class="native-submit">完成</button></form>`,'<button data-a="close">取消</button>');break;
case 'moment-menu':R.menu=R.menu===id?null:id;{const scroll=$('.moments-feed').scrollTop;render();$('.moments-feed').scrollTop=scroll}break;
case 'like':{const m=momentBy(id);m.likes=momentLikedByMe(m)?m.likes.filter(x=>x!==S.profile.name&&x!==D.people.me.name):[...m.likes,S.profile.name];const scroll=$('.moments-feed').scrollTop;R.menu=null;render();$('.moments-feed').scrollTop=scroll;break}
case 'comment':R.comment=id;R.commentReply=null;R.menu=null;render();$(`[data-a="moment-menu"][data-id="${id}"]`)?.scrollIntoView({block:'center'});$('#comment-text').focus();break;
case 'comment-reply':{const c=momentBy(id).comments[i];if(isOwnComment(c))sheet('',`<button data-a="delete-comment" data-id="${id}" data-i="${i}">删除</button>`);else{R.comment=id;R.commentReply=c.person||Object.keys(D.people).find(person=>D.people[person].name===c.name||pname(person)===c.name)||null;render();$('#comment-text').value=`回复${socialCommentName(c)}：`;$('#comment-text').focus()}break}
case 'delete-comment':momentBy(id).comments.splice(i,1);closeOverlay();render();break;
case 'post':go('post');break;case 'remove-post-photo':S.postedPhoto=null;render();break;
case 'publish':{const t=$('#post-text').value.trim();if(!t&&!S.postedPhoto)return;S.moments.unshift({id:'post'+Date.now(),person:'me',date:'刚刚',postedAt:phoneTimestamp(),text:t,photo:S.postedPhoto,location:S.postLocation||'',privacy:S.postPrivacy||'公开',likes:[],comments:[]});S.postDraft='';S.postedPhoto=null;go('moments');break}
case 'delete-post':sheet('',`<button class="danger" data-a="delete-post-confirm" data-id="${id}">删除这条朋友圈</button>`);break;
case 'delete-post-confirm':S.moments=S.moments.filter(m=>m.id!==id);closeOverlay();render();break;
case 'post-location':sheet('所在位置','<button data-a="choose-location" data-text="槐城区">槐城区</button><button data-a="choose-location" data-text="家">家</button><button data-a="choose-location" data-text="">不显示位置</button>');break;
case 'choose-location':S.postLocation=b.dataset.text;closeOverlay();render();break;
case 'post-privacy':sheet('谁可以看','<button data-a="choose-privacy" data-text="公开">公开</button><button data-a="choose-privacy" data-text="私密">私密</button>');break;
case 'choose-privacy':S.postPrivacy=b.dataset.text;closeOverlay();render();break;
case 'landscape':$('#overlay').innerHTML=`<div class="landscape-view"><button data-a="close" aria-label="关闭">${ico('back')}</button>${art('sea')}</div>`;break;
case 'photo':photoView(id,b.dataset.moment?momentPhotos(momentBy(b.dataset.moment)):undefined);break;case 'photo-prev':photoStep(-1);break;case 'photo-next':photoStep(1);break;case 'zoom':if(Date.now()<suppressPhotoClickUntil)break;photoZoom=!photoZoom;showPhoto();break;
case 'photo-info':photoInfo=!photoInfo;showPhoto();if(photo==='door'&&!S.flags.done)once('photoInfo',()=>later('daughter','那上面写着，是你的手机拍的。'));break;
case 'photo-fav':S.photoFav=S.photoFav.includes(photo)?S.photoFav.filter(x=>x!==photo):[...S.photoFav,photo];showPhoto();break;
case 'photo-trash':S.photoTrash=S.photoTrash.includes(photo)?S.photoTrash.filter(x=>x!==photo):[...S.photoTrash,photo];closeOverlay();render();break;
case 'photo-menu':{const saved=photo;sheet('',`<button data-a="save-photo" data-id="${saved}">存储图像</button><button data-a="photo-reopen-info" data-id="${saved}">显示信息</button>`);break}
case 'photo-reopen-info':photo=id;photoInfo=true;showPhoto();break;
case 'save-photo':if(!S.photoSaved.includes(id))S.photoSaved.push(id);closeOverlay();break;
case 'photo-share':sheet('共享照片',`<button data-a="share-photo-wechat" data-id="${photo}">微信</button><button data-a="share-photo-moments" data-id="${photo}">朋友圈</button><button data-a="save-photo" data-id="${photo}">存储图像</button>`);break;
case 'share-photo-wechat':pickPerson('share-photo-to',`data-photo="${id}"`);break;
case 'share-photo-to':closeOverlay();chat(id);sendMessage(id,'','image',{photo:b.dataset.photo});break;
case 'share-photo-moments':S.postedPhoto=id;go('post');break;
case 'photo-albums':sheet('相簿','<button data-a="album" data-id="all">最近项目</button><button data-a="album" data-id="fav">个人收藏</button><button data-a="album" data-id="trash">最近删除</button>');break;
case 'album':go('photos',{album:id});break;case 'photos-all':go('photos');break;
case 'photo-search':go('photos',{photoSearch:true});break;
case 'document':go('document',{id});break;case 'document-share':pickPerson('document-send',`data-file="${R.id}"`);break;
case 'document-send':closeOverlay();chat(id);sendMessage(id,b.dataset.file==='case'?'寻人登记_QH0417.pdf':'家庭资料副本.html','file',{file:b.dataset.file});if(id==='police'&&b.dataset.file==='inner')replyMany(id,['资料收到了。不要开门，我在路上。']);break;
case 'files-recent':go('files');break;case 'file-menu':sheet('排序','<button data-a="files-recent">日期</button><button data-a="files-name">名称</button>');break;case 'files-name':R.sort='name';closeOverlay();render();break;
case 'note':go('note',{id});break;case 'note-new':{const id='n'+Date.now();S.notes.unshift({id,title:'',body:'',date:'今天'});go('note',{id});$('#note-title').focus();break}
case 'note-menu':sheet('',`<button data-a="note-share">发送副本</button><button class="danger" data-a="note-delete">删除</button>`);break;
case 'note-delete':S.notes=S.notes.filter(n=>n.id!==R.id);closeOverlay();go('notes');break;case 'note-share':pickPerson('note-send',`data-note="${R.id}"`);break;
case 'note-send':{const n=S.notes.find(n=>n.id===b.dataset.note);closeOverlay();chat(id);sendMessage(id,n.title+'\n'+n.body);break}
case 'url':browse(b.dataset.url);break;case 'url-new-tab':if(!requirePhoneNetwork())break;S.tabs.push({entries:['https://search.example/'],index:0});S.activeTab=S.tabs.length-1;browse(b.dataset.url);break;case 'copy-link':navigator.clipboard?.writeText(b.dataset.url).catch(()=>{});closeOverlay();break;case 'record':browse(BASE+'/record?id='+id);break;
case 'browser-back':{const t=tabState();if(t.index>0)t.index--;render();break}case 'browser-forward':{const t=tabState();if(t.index<t.entries.length-1)t.index++;render();break}case 'browser-refresh':render();break;
case 'browser-tabs':sheet('标签页',S.tabs.map((t,j)=>`<div class="browser-tab-row"><button data-a="select-tab" data-i="${j}">${ico('compass')} ${E(t.entries[t.index].replace('https://',''))}</button><button data-a="close-tab" data-i="${j}" aria-label="关闭标签页">${ico('close')}</button></div>`).join('')+'<button data-a="new-tab">＋ 新建标签页</button>');break;
case 'select-tab':S.activeTab=i;closeOverlay();render();break;
case 'new-tab':S.tabs.push({entries:['https://search.example/'],index:0});S.activeTab=S.tabs.length-1;closeOverlay();render();break;
case 'close-tab':if(S.tabs.length>1){S.tabs.splice(i,1);S.activeTab=Math.min(S.activeTab,S.tabs.length-1)}else S.tabs[0]={entries:['https://search.example/'],index:0};closeOverlay();render();break;
case 'bookmarks':bookmarks();break;case 'remove-bookmark':S.bookmarks.splice(i,1);bookmarks();break;
case 'browser-share':sheet('网页',`<button data-a="bookmark-page">添加书签</button><button data-a="copy-url">复制链接</button><button data-a="share-url">微信</button><button data-a="browser-history">历史记录</button>`);break;
case 'bookmark-page':dialog('添加书签',`<form data-form="bookmark"><input name="title" aria-label="书签名称" value="${E(new URL(currentURL()).hostname.includes('guijia')?'归家寻亲':new URL(currentURL()).hostname)}"><button class="native-submit">存储</button></form>`);break;
case 'copy-url':navigator.clipboard?.writeText(currentURL()).catch(()=>{});closeOverlay();break;case 'share-url':pickPerson('send-url');break;case 'send-url':{const u=currentURL(),title=$('#web-content h1')?.textContent.trim()||$('#web-content h2')?.textContent.trim()||realismLinkBrand(u);closeOverlay();chat(id);sendMessage(id,title,'link',{url:u});break}
case 'browser-history':sheet('历史记录',tabState().entries.slice().reverse().map(u=>`<button data-a="url" data-url="${E(u)}">${E(u)}</button>`).join(''));break;
case 'site-menu':sheet('归家寻亲',wlink('首页','/')+wlink('寻人信息','/search')+wlink('提供线索','/clue')+wlink('家属中心','/family')+wlink('联系我们','/contact'));break;
case 'save-inner':if(!S.downloads.length)S.downloads.push({at:time()});dialog('下载完成','<p>家庭资料副本.html</p>','<button data-a="open-download">打开</button><button data-a="close">好</button>');break;
case 'open-download':go('document',{id:'inner'});break;
case 'family-retain':if(S.flags.done){browse(BASE+'/receipt');break}S.familyDeferred=true;persist();browse(BASE+'/family/pending');break;
case 'family-retain-final':archiveFamily(false);break;
case 'agency-register-photo':S.registerDraft=Object.fromEntries(new FormData(b.closest('form')).entries());picker('registration');break;
case 'request-followup':requestFollowup();break;case 'check-match':checkNewMatch();break;
case 'mail-open':if(!S.mailsRead.includes(id))S.mailsRead.push(id);go('maildetail',{id,folder:b.dataset.folder||'inbox'});break;
case 'mail-folders':sheet('邮箱','<button data-a="mail-folder" data-id="inbox">收件箱</button><button data-a="mail-folder" data-id="sent">已发送</button>');break;
case 'mail-folder':go('mail',{folder:id});break;
case 'mail-compose':case 'mail-reply':{const m=a==='mail-reply'?[...mailInbox(),...(S.sentMail||[])].find(m=>m.id===R.id):null;dialog('新邮件',`<form class="compose-mail" data-form="mail"><label>收件人<input name="to" required value="${E(m?.email||'')}"></label><label>主题<input name="subject" required value="${m?'回复：'+E(m.subject):''}"></label><textarea name="body" rows="5" aria-label="邮件正文" required></textarea><button class="native-submit">发送</button></form>`,'<button data-a="close">取消</button>');break}
case 'cal-day':R.day=+b.dataset.day;render();break;
case 'event-new':dialog('新建日程',`<form data-form="event"><input name="title" aria-label="标题" placeholder="标题" required><input name="day" type="number" min="1" max="30" value="${R.day||phoneDate().getUTCDate()}" aria-label="日期"><input name="time" type="time" value="09:00"><button class="native-submit">添加</button></form>`);break;
case 'alarm-new':alarmDialog(-1);break;case 'alarm-edit':alarmDialog(i);break;case 'alarm-toggle':S.alarms[i].on=!S.alarms[i].on;render();break;case 'alarm-delete':S.alarms.splice(i,1);closeOverlay();render();break;
case 'calc':doCalc(b.dataset.key);break;
case 'notifications':showNotifications();break;case 'controls':controls();break;
case 'airplane':S.airplane=!S.airplane;if(S.airplane){S.wifiBeforeFlight=S.wifi;S.wifi=false}else S.wifi=S.wifiBeforeFlight??true;render();schedule();if($('#overlay .action-sheet'))controls();break;case 'wifi':S.wifi=!S.wifi;render();schedule();if($('#overlay .action-sheet'))controls();break;
case 'lock':closeOverlay();R={app:'lock'};render();break;
case 'display':sheet('显示与亮度',`<label class="brightness">亮度<input type="range" id="brightness" min="40" max="100" value="${S.brightness}"></label><label class="brightness">文字大小<input type="range" id="font-size" min="14" max="19" value="${S.font}"></label>${toggleRow('减弱动态效果','reduce',S.reduce)}`);break;
case 'reduce':S.reduce=!S.reduce;render();closeOverlay();break;
case 'general':sheet('通用',`<button data-a="about-device">关于本机</button><button data-a="backup">备份与恢复</button>`);break;
case 'about-device':dialog('关于本机','<p>名称：林砚的 iPhone</p><p>机型：iPhone 14 Pro</p><p>容量：128 GB</p><p>可用：42.6 GB</p>');break;
case 'wx-settings':sheet('设置','<button data-a="wx-account">账号与安全</button><button data-a="wx-notification">消息通知</button><button data-a="backup">聊天记录备份</button>');break;
case 'wx-account':dialog('账号与安全',`<p>微信号：${D.people.me.wx}</p><p>账号状态：正常</p>`);break;case 'wx-notification':showNotifications();break;
case 'backup':backupPanel();break;
case 'export':{const blob=new Blob([JSON.stringify({format:'confirm-home-v3',state:S},null,2)],{type:'application/json'}),u=URL.createObjectURL(blob),l=document.createElement('a');l.href=u;l.download='林砚的手机-备份.json';l.click();setTimeout(()=>URL.revokeObjectURL(u),1000);closeOverlay();break}
case 'import':{const f=document.createElement('input');f.type='file';f.accept='.json';f.id='restore-file';f.hidden=true;f.addEventListener('change',async()=>{try{const d=JSON.parse(await f.files[0].text());if(!validBackup(d))throw Error();npcCancel();S={...initial(),...d.state};closeOverlay();home();schedule()}catch{dialog('无法恢复','备份文件已损坏或格式不受支持。')}f.remove()});document.body.append(f);f.click();break}
case 'reset':dialog('抹掉所有内容？','本机的聊天、照片和设置将恢复到最初状态。',`<button data-a="close">取消</button><button class="danger" data-a="reset-confirm">抹掉内容</button>`);break;
case 'reset-confirm':npcCancel();clearTimeout(pendingTimer);clearTimeout(noticeTimer);$('#notification').innerHTML='';S=initial();closeOverlay();nav=[];R={app:'lock'};render();break;
case 'spotlight':dialog('搜索',`<form data-form="spotlight"><input name="query" aria-label="搜索" placeholder="搜索"><button class="native-submit">搜索</button></form>`);break;
}persist()}
document.addEventListener('click',e=>{const b=e.target.closest('[data-a]');if(!b)return;if(b.tagName==='A'&&b.dataset.a==='url')e.preventDefault();if(b.dataset.a==='sheet-dismiss'&&e.target!==b)return;handle(b.dataset.a,b)});
// Fictional websites always stay in the phone, including desktop middle-clicks.
document.addEventListener('auxclick',e=>{const a=e.target.closest('a[data-a="url"]');if(!a)return;e.preventDefault();if(e.button===1)handle('url-new-tab',a)});
document.addEventListener('contextmenu',e=>{const a=e.target.closest('a[data-a="url"]');if(!a||a.closest('.message[data-msg]'))return;e.preventDefault();sheet('',`<button data-a="url" data-url="${E(a.dataset.url)}">打开</button><button data-a="url-new-tab" data-url="${E(a.dataset.url)}">在新标签页打开</button><button data-a="copy-link" data-url="${E(a.dataset.url)}">复制链接</button>`)});
document.addEventListener('contextmenu',e=>{const el=e.target.closest('.message[data-msg]');if(el){e.preventDefault();contextMessage(el)}});
document.addEventListener('pointerdown',e=>{const el=e.target.closest('.message[data-msg]');if(el)holdTimer=setTimeout(()=>contextMessage(el),650)});document.addEventListener('pointerup',()=>clearTimeout(holdTimer));document.addEventListener('pointermove',()=>clearTimeout(holdTimer));document.addEventListener('pointercancel',()=>clearTimeout(holdTimer));
document.addEventListener('input',e=>{const t=e.target;if(t.id==='sms-input'){syncDaughterRecognition();S.sms.drafts.daughter=t.value;}else if(t.closest('[data-form="pz-god-chat"]')&&t.name==='message'){S.drafts[R.id]=t.value;}else if(t.id==='message-input'){S.drafts[R.id]=t.value;const f=t.closest('form'),last=f.lastElementChild;if(t.value&&!last.classList.contains('send-button'))last.outerHTML='<button class="send-button" type="submit">发送</button>';else if(!t.value&&last.classList.contains('send-button'))last.outerHTML=`<button type="button" data-a="attachments" aria-label="更多功能">${ico('plus')}</button>`;}else if(t.id==='note-title'||t.id==='note-body'){const n=S.notes.find(n=>n.id===R.id);n.title=$('#note-title').value;n.body=$('#note-body').value;n.date='今天'}else if(t.id==='post-text')S.postDraft=t.value;else if(t.id==='brightness'){S.brightness=+t.value;$('.phone').style.filter=`brightness(${S.brightness/100})`}else if(t.id==='font-size'){S.font=+t.value;$('.phone').style.setProperty('--font-size',S.font+'px')}persist()});
document.addEventListener('submit',e=>{const f=e.target;if(!f.dataset.form)return;e.preventDefault();const d=new FormData(f),kind=f.dataset.form;if(typeof xiaohongshuSubmit==='function'&&xiaohongshuSubmit(kind,d))return;if(typeof dpSubmit==='function'&&dpSubmit(kind,d))return;if(typeof zhihuSubmit==='function'&&zhihuSubmit(kind,d))return;if(typeof cityMapsSubmit==='function'&&cityMapsSubmit(kind,d))return;if(typeof clueSubmit==='function'&&clueSubmit(kind,d)){persist();return;}if(puzzleSubmit(kind,d,f)){persist();return}if(typeof douyinSubmit==='function'&&douyinSubmit(kind,d,f)){persist();return}if(officialSubmit(kind,d,f)){persist();return}if(typeof cipherSubmit==='function'&&cipherSubmit(kind,d)){persist();return}if(typeof inquirySubmit==='function'&&inquirySubmit(kind,d)){persist();return}if(typeof returnInvestigationSubmit==='function'&&returnInvestigationSubmit(kind,d,f)){persist();return}switch(kind){
case 'sms-send':smsSend(d.get('text'));break;
case 'chat':sendMessage(R.id,$('#message-input').value);break;
case 'wx-search':searchWx(f.querySelector('input').value,R.scope);break;
case 'contact-search':R.q=f.querySelector('input').value;render();break;
case 'phone-contact':nativeContactSubmit(d,f);break;
case 'remark':{const id=f.dataset.id,v=d.get('remark').trim();if(v){if(id==='me'){const oldName=S.profile.name;for(const m of S.moments){m.likes=m.likes.map(name=>name===oldName?v:name);for(const c of m.comments)if(c.name===oldName){c.name=v;c.person='me'}}S.profile.name=v}else S.remarks[id]=v}closeOverlay();render();break}
case 'friend-search':{const q=d.get('query'),id=visiblePeople().find(x=>D.people[x].wx===q||pname(x).includes(q));if(id)go('profile',{id});else dialog('搜索结果','该用户不存在。');break}
case 'comment':{if(!requirePhoneNetwork())break;const t=$('#comment-text').value.trim();if(t)momentBy(R.comment).comments.push({name:S.profile.name,person:'me',text:t,createdAt:phoneTimestamp(),date:phoneStamp(),replyPerson:R.commentReply||null});R.comment=null;R.commentReply=null;render();break}
case 'profile-signature':S.profile.sign=String(d.get('sign')||'').trim();closeOverlay();render();break;
case 'photo-search':R.photoQuery=String(d.get('query')||'').trim();render();break;
case 'file-search':R.q=f.querySelector('input').value;render();break;case 'note-search':R.q=f.querySelector('input').value;render();break;case 'mail-search':R.q=f.querySelector('input').value;render();break;
case 'address':browse(f.querySelector('input').value.trim());break;
case 'web-global':browse('https://search.example/?q='+encodeURIComponent(f.querySelector('input').value));break;
case 'web-search':browse(BASE+'/search?q='+encodeURIComponent(d.get('query')||''));break;
case 'web-register':{const v=Object.fromEntries(d.entries());if(canonicalDaughterName(v.name)!=='林小禾'||v.case.replace(/[^a-z0-9]/gi,'').toUpperCase()!=='QH0417'||v.birth!=='2015-06-11'){R.error='姓名、生日或报案编号与登记原件不一致。';S.registerDraft=v;render();break}if(!S.registrationPhoto){R.error='请添加失联者照片。';S.registerDraft=v;render();break}v.name=canonicalDaughterName(v.name);registerFamily(v);break}
case 'web-interview':submitInterview(Object.fromEntries(d.entries()));break;
case 'web-verify':browse(BASE+'/verify');break;
case 'web-lead':chat('club');break;
case 'web-auth':browse(BASE+'/manage/login');break;
case 'web-clue':S.webForms.push(Object.fromEntries(d.entries()));browse(BASE+'/clue-receipt');break;
case 'family-confirm':browse(BASE+'/account/convert');break;
case 'bookmark':{const title=d.get('title').trim();if(title&&!S.bookmarks.some(b=>b.url===currentURL()))S.bookmarks.push({title,url:currentURL()});closeOverlay();break}
case 'mail':if(!phoneOnline()){let status=f.querySelector('.mail-offline');if(!status){status=document.createElement('p');status.className='mail-offline';f.append(status)}status.textContent='网络连接不可用，请连接后重试。';break}S.sentMail??=[];S.sentMail.unshift({id:'mail'+Date.now(),from:S.profile.name,to:d.get('to'),subject:d.get('subject'),body:d.get('body'),date:`9月${S.day}日 ${time()}`});closeOverlay();go('mail',{folder:'sent'});break;
case 'event':S.events.push({title:d.get('title'),day:+d.get('day'),time:d.get('time'),month:phoneDate().getUTCMonth()+1,year:phoneDate().getUTCFullYear()});closeOverlay();render();break;
case 'alarm':{const alarm={time:d.get('time'),label:d.get('label')||'闹钟',on:true};if(+f.dataset.i>=0)S.alarms[+f.dataset.i]=alarm;else S.alarms.push(alarm);closeOverlay();render();break}
case 'spotlight':{const q=d.get('query'),apps=appDefs.filter(a=>a[1].toLowerCase().includes(q.toLowerCase()));sheet('搜索',apps.map(a=>`<button class="app-art-row" data-a="nav" data-app="${a[0]}">${rasterAppRowIcon(a[0])}<span>${a[1]}</span></button>`).join('')+`<button data-a="url" data-url="https://search.example/?q=${encodeURIComponent(q)}">在网页中搜索“${E(q)}”</button>`);break}
}persist()});
function validBackup(d){return d?.format==='confirm-home-v3'&&d.state?.history&&Object.keys(D.histories).every(k=>Array.isArray(d.state.history[k])&&d.state.history[k].every(m=>typeof m==='object'&&(!m.type||['text','image','file','link','system'].includes(m.type))&&(!m.photo||D.photos[m.photo]||(/^homecam_\d+$/.test(m.photo)&&d.state.afterReturn?.captures?.some(c=>c.id===m.photo&&CAMERA_DESCRIPTIONS[c.file])))))&&Array.isArray(d.state.moments)&&Array.isArray(d.state.notes)&&Array.isArray(d.state.tabs)&&d.state.tabs.length>0&&Number.isInteger(d.state.activeTab)&&d.state.activeTab<d.state.tabs.length}
$('#home-key').addEventListener('click',()=>{const now=Date.now();if(now-lastHome<350&&S.started){launcherRecents();lastHome=0}else{home();lastHome=now}});
$('#status-time').addEventListener('click',showNotifications);$('#status-controls').addEventListener('click',controls);
document.addEventListener('keydown',e=>{if(photo&&$('.native-photo')&&!e.target.matches('input,textarea')){if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();photoStep(e.key==='ArrowLeft'?-1:1);return}}if(e.key==='Escape'){if($('#overlay').innerHTML)closeOverlay();else back()}if((e.key==='Enter'||e.key===' ')&&e.target.matches('.photo-stage img')){e.preventDefault();photoZoom=!photoZoom;showPhoto()}});
window.render_game_to_text=()=>JSON.stringify({screen:typeof dpActive==='function'&&dpActive()?dpState().daughter.view:R,fatherScreen:R,clueStory:S.clueStory,devices:typeof dpExportText==='function'?dpExportText():S.devices,day:S.day,storyTime:storyTimeState(),flags:S.flags,inquiry:S.inquiry,returnInvestigation:S.returnInvestigation,puzzle:S.puzzle,cultHistory:S.cultHistory||null,afterReturn:S.afterReturn,daughterRecognition:typeof recognitionTextState==='function'?recognitionTextState():null,zhihu:typeof zhihuTextState==='function'?zhihuTextState():null,cityMaps:typeof cityMapsTextState==='function'?cityMapsTextState():null,douyin:S.douyin,cipher:S.cipher,official:S.official,npcPending:[...npcJobs.keys()],unread:S.unread,wechat:{friend:S.wechat.friend.status,requestUnread:wechatRequestUnread(),unread:S.wechat.unread,lead:S.wechat.lead},photos:availablePhotos(R.album),savedPhotos:S.photoSaved,activePhoto:$('.native-photo')?photo:null,photoSequence:$('.native-photo')?photoSequence:[],pending:S.pending.length,dread:typeof dreadState==='function'?dreadState():null,cult:typeof cultState==='function'?cultState():null,visibleText:$('#screen').innerText.slice(-3800),overlay:$('#overlay').innerText.slice(-1000)});
window.advanceTime=async ms=>{storyTimeAdvance(ms);S.pending.forEach(p=>p.due-=ms);drain();if(typeof dreadAdvance==='function')dreadAdvance(ms);if(typeof cultAdvance==='function')cultAdvance(ms)};
render();schedule();

// Native photo paging keeps each source album or Moments post together.
document.addEventListener('pointerdown',e=>{if(e.isPrimary!==false&&e.target.closest('.photo-stage')&&!photoZoom){photoSwipeStart={x:e.clientX,y:e.clientY,at:Date.now(),id:e.pointerId}}});
document.addEventListener('pointerup',e=>{const start=photoSwipeStart;photoSwipeStart=null;if(!start||start.id!==e.pointerId||photoZoom)return;const dx=e.clientX-start.x,dy=e.clientY-start.y;if(Math.abs(dx)>48&&Math.abs(dx)>Math.abs(dy)*1.25&&Date.now()-start.at<1200){suppressPhotoClickUntil=Date.now()+350;photoStep(dx<0?1:-1)}});
document.addEventListener('pointercancel',()=>{photoSwipeStart=null});
