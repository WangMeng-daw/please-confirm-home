/* Personal surfaces share phone controls, not everybody's photographs. */
const PERSONAL_COVERS={me:'cover-linyan',wife:'cover-linlan',daughter:'cover-xiaohe',police:'cover-zhou',teacher:'cover-liu',friend:'cover-zhao',club:'cover-xu',old:'cover-he'};
function publicContentTimestamp(value,fallback='2026-09-18 09:00'){
 const v=String(value||''),iso=v.match(/^(\d{4}-\d{2}-\d{2})(?:[T ](\d{2}:\d{2}))?/),cn=v.match(/(?:(\d{4})年)?(\d{1,2})月(\d{1,2})日(?:\s*(\d{1,2}):(\d{2}))?/);
 if(iso)return iso[1]+'T'+(iso[2]||'09:00')+':00+08:00';
 if(cn)return `${cn[1]||'2026'}-${cn[2].padStart(2,'0')}-${cn[3].padStart(2,'0')}T${(cn[4]||'09').padStart(2,'0')}:${cn[5]||'00'}:00+08:00`;
 return publicContentTimestamp(fallback,'2026-09-18 09:00');
}
function publicContentDate(value){return publicContentTimestamp(value).slice(0,16).replace('T',' ')}
function publicContentVisible(value){const now=typeof phoneTimestamp==='function'?phoneTimestamp():`2026-09-${String(S.day).padStart(2,'0')}T${storyBaseTime()}:00+08:00`;return Date.parse(publicContentTimestamp(value))<=Date.parse(now)}
function publicContentAfter(value,minutes){return new Date(Date.parse(publicContentTimestamp(value))+(480+minutes)*60000).toISOString().slice(0,19)+'+08:00'}
function momentCommentTimestamp(m,c,index=m.comments.indexOf(c)){
 if(!c.createdAt)c.createdAt=c.date?publicContentTimestamp(c.date):isOwnComment(c)?(typeof phoneTimestamp==='function'?phoneTimestamp():publicContentTimestamp(`9月${S.day}日 ${storyBaseTime()}`)):publicContentAfter(m.postedAt||m.sortAt||m.date,3*(index+1));
 return c.createdAt;
}
function momentCommentDate(m,c,index){return publicContentDate(momentCommentTimestamp(m,c,index))}
function momentCommentVisible(m,c,index){return publicContentVisible(momentCommentTimestamp(m,c,index))}
function momentVisibleComments(m){return m.comments.map((c,index)=>({c,index})).filter(({c,index})=>momentCommentVisible(m,c,index))}
function personCover(id){return id==='me'&&S.momentsCover&&photoUnlocked(S.momentsCover)?S.momentsCover:PERSONAL_COVERS[id]||PERSONAL_COVERS.me}
function personSignature(id){return id==='me'?S.profile.sign:D.people[id]?.sign||''}
function socialName(name){const id=Object.keys(D.people).find(id=>D.people[id].name===name);return id?pname(id):name}
function socialCommentName(comment){return comment.person?pname(comment.person):socialName(comment.name)}
function isOwnComment(comment){return comment.person==='me'||comment.name===S.profile.name||comment.name===D.people.me.name}
function momentLikedByMe(m){return m.likes.some(name=>name===S.profile.name||name===D.people.me.name)}
function personalPosts(id){return S.moments.filter(m=>momentVisible(m)&&publicContentVisible(m.postedAt||m.sortAt||m.date)&&(!id||m.person===id)).sort((a,b)=>momentSortKey(b).localeCompare(momentSortKey(a)))}
function profileAlbumRow(id){
 const ids=[...new Set(personalPosts(id).flatMap(momentPhotos))].slice(0,3);
 return `<button class="native-row profile-album" data-a="person-moments" data-id="${id}"><span>朋友圈</span><span class="profile-album-previews">${ids.map(photo=>`<img src="${asset(photo)}" alt="朋友圈照片" loading="lazy">`).join('')}</span><b>›</b></button>`;
}
function personalProfile(id){
 const p=D.people[id],me=id==='me',nickname=me?S.profile.name:p.name;
 return appHeader('',{action:'remark',id,right:ico('more'),label:me?'设置名字':'设置备注'})+`<div class="scroll wx-bg"><div class="profile-header">${av(id,false)}<div><h2>${E(pname(id))}</h2>${!me&&pname(id)!==nickname?`<p>昵称：${E(nickname)}</p>`:''}<p>微信号：${E(p.wx)}</p>${p.region?`<p>地区：${E(p.region)}</p>`:''}</div></div>${buttonRow(me?'名字':'备注','remark',`data-id="${id}"`)}${profileAlbumRow(id)}${me?buttonRow('个性签名','profile-signature'):''}${personSignature(id)?`<div class="profile-sign">${E(personSignature(id))}</div>`:''}${!me?`<button class="profile-send" data-a="chat" data-id="${id}">${ico('chat')} 发消息</button>`:''}</div>`;
}
function momentDisplayDate(m){
 if(!m.postedAt)return m.date;
 const now=contentDateKey(`9月${S.day}日 ${time()}`),posted=m.postedAt;
 if(now.slice(0,10)===posted.slice(0,10))return now.slice(11,16)===posted.slice(11,16)?'刚刚':posted.slice(11,16);
 return `${Number(posted.slice(5,7))}月${Number(posted.slice(8,10))}日 ${posted.slice(11,16)}`;
}
function personalMoments(){
 const id=R.person||'me',own=id==='me',posts=personalPosts(R.person),signature=personSignature(id);
 return `<div class="scroll moments-feed" data-owner="${id}"><div class="moments-cover personal-cover"><button class="cover-picture" data-a="moment-cover" data-id="${id}" aria-label="查看${E(pname(id))}的朋友圈封面"><img src="${asset(personCover(id))}" alt="${E(pname(id))}的朋友圈封面"></button><button class="moments-back" data-a="back" aria-label="返回">${ico('back')}</button>${own?`<button class="moments-camera" data-a="post" aria-label="发表朋友圈">${ico('camera')}</button>`:''}<div class="moments-owner"><strong>${E(pname(id))}</strong>${av(id)}</div></div><div class="moments-sign">${E(signature)}</div>${posts.map(m=>`<article class="moment" data-moment-id="${m.id}">${av(m.person)}<div class="moment-main"><button class="moment-name" data-a="profile" data-id="${m.person}">${E(pname(m.person))}</button><p>${E(m.text).replace(/\n/g,'<br>')}</p>${momentPictures(m)}<div class="moment-meta"><time>${E(momentDisplayDate(m))}${m.privacy==='私密'?' · 仅自己可见':''}${m.location?' · '+E(m.location):''}</time>${m.person==='me'?`<button data-a="delete-post" data-id="${m.id}">删除</button>`:''}<button class="moment-more" data-a="moment-menu" data-id="${m.id}" aria-label="点赞或评论">••</button></div>${R.menu===m.id?`<div class="moment-actions"><button data-a="like" data-id="${m.id}">♡ ${momentLikedByMe(m)?'取消':'赞'}</button><button data-a="comment" data-id="${m.id}">▢ 评论</button></div>`:''}${m.likes.length||momentVisibleComments(m).length?`<div class="moment-social">${m.likes.length?`<div class="moment-likes">♡ ${m.likes.map(name=>E(socialName(name))).join('，')}</div>`:''}${momentVisibleComments(m).map(({c,index:j})=>`<button class="moment-comment" data-a="comment-reply" data-id="${m.id}" data-i="${j}"><b>${E(socialCommentName(c))}</b>${c.socialReaction&&c.replyPerson?' 回复 <b>'+E(pname(c.replyPerson))+'</b>':''}：${E(c.text)}</button>`).join('')}</div>`:''}</div></article>`).join('')}${!posts.length?'<div class="moments-end" aria-label="暂无朋友圈">—</div>':''}</div>${R.comment?`<form class="comment-compose" data-form="comment"><input id="comment-text" aria-label="评论" placeholder="评论" autocomplete="off"><button type="submit">发送</button></form>`:''}`;
}
function showPersonalCover(id){
 $('#overlay').innerHTML=`<div class="personal-cover-view" role="dialog" aria-label="朋友圈封面"><button data-a="close" class="cover-close" aria-label="关闭封面">${ico('back')}</button><img src="${asset(personCover(id))}" alt="${E(pname(id))}的朋友圈封面">${id==='me'?'<button class="change-cover" data-a="pick-cover">更换相册封面</button>':''}</div>`;
}
function realMailPage(){
 const sent=R.folder==='sent',mail=sent?(S.sentMail||[]):mailInbox().filter(m=>!m.unlock||S.flags[m.unlock]);
 const list=mail.filter(m=>!R.q||(m.subject+m.body+m.from+(m.to||'')).includes(R.q));
 return appHeader(sent?'已发送':'收件箱',{action:'mail-folders',right:'邮箱',label:'邮箱列表'})+`<div class="scroll">${searchbar('mail-search')}${list.map(m=>`<button class="mail-row" data-a="mail-open" data-id="${m.id}" data-folder="${sent?'sent':'inbox'}">${!sent&&!S.mailsRead.includes(m.id)?'<i></i>':''}<div><strong>${E(sent?m.to:m.from)}</strong><span>${E(m.date)}</span><h3>${E(m.subject)}</h3><p>${E(m.body.slice(0,65))}</p></div></button>`).join('')||'<p class="native-empty">没有邮件</p>'}</div><div class="native-toolbar"><span>${mail.length} 封邮件</span><button data-a="mail-compose" aria-label="写邮件">${ico('edit')}</button></div>`;
}
function syncSocialDetails(){
 if(S.socialDetailsVersion===2)return;
 // Old player-created posts did not record a story timestamp. Retain their order on the current save date.
 for(const m of S.moments)if(m.person==='me'&&m.id?.startsWith('post')&&!m.postedAt)m.postedAt=contentDateKey(`9月${S.day}日 ${time()}`);
 for(const m of S.moments)for(const [i,c] of (m.comments||[]).entries())momentCommentTimestamp(m,c,i);
 S.socialDetailsVersion=2;
}
function phoneOnline(){return (!S.airplane||Boolean(S.wifi))&&!document.body.classList.contains('launch-page')}
function requirePhoneNetwork(){if(phoneOnline())return true;dialog('网络连接不可用','请检查网络设置后重试。');return false}
function markChatActivity(id){S.chatActivity??={};S.chatSequence=(S.chatSequence||0)+1;S.chatActivity[id]=S.chatSequence}
function realismChatTime(id){
 const stamp=realismLastChatTime(id);if(!stamp)return '';
 const date=new Date(stamp),now=realismStoryDate();
 if(date.toISOString().slice(0,10)===now.toISOString().slice(0,10))return `${String(date.getUTCHours()).padStart(2,'0')}:${String(date.getUTCMinutes()).padStart(2,'0')}`;
 return `${date.getUTCMonth()+1}月${date.getUTCDate()}日`;
}
