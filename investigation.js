/* Cross-source investigation, entirely inside the fictional phone. */
const INQUIRY_SITES={street:'https://street.huai.example',service:'https://service.huai.example',records:'https://records.guijia.example'};
const INQUIRY_FRIEND_LEAD=[
 {contentId:'inquiry-friend-north-excluded',text:'北站也不是啊。你先歇会儿，我再翻翻以前的消息。'},
 {contentId:'inquiry-friend-street',text:'我在槐城街坊翻到一个旧帖，8月13日榆树路的。店主在找一只蓝鲸鱼的失主，会不会是你说的那只？'}
];
const INQUIRY_FRIEND_OLD_FOLLOWUP='原来不是北站那个。我翻到的榆树路帖子还在。店主一直以为自己在帮人找玩具。';
function inquiryFriendLeadKind(message){
 if(!message||message.me||message.npcAI||message.npcResponse||message.date)return -1;
 if(message.contentId===INQUIRY_FRIEND_LEAD[0].contentId||message.text===INQUIRY_FRIEND_OLD_FOLLOWUP||message.text===INQUIRY_FRIEND_LEAD[0].text)return 0;
 if(message.contentId===INQUIRY_FRIEND_LEAD[1].contentId||message.text===INQUIRY_FRIEND_LEAD[1].text)return 1;
 return -1;
}
function inquiryFriendLeadDate(value){const d=String(value||'').match(/(\d+)月(\d+)日\s*(\d+):(\d+)/);return d?(((+d[1]*31+ +d[2])*24+ +d[3])*60+ +d[4]):0}
function syncInquiryFriendLead(){
 const inquiry=S.inquiry;if(inquiry.friendLeadVersion===2)return;
 inquiry.friendLeadVersion=2;
 const list=S.history.friend,remove=new Set(),dates=new Set();let section=-1,hadAuthored=false;
 for(let i=0;i<list.length;i++){
  if(list[i].date)section=i;
  if(inquiryFriendLeadKind(list[i])>=0){remove.add(i);if(section>=0)dates.add(section);hadAuthored=true}
 }
 // Remove only empty date headings owned by the authored lines being relocated.
 for(const at of dates){let end=at+1;while(end<list.length&&!list[end].date)end++;if(list.slice(at+1,end).every((m,i)=>remove.has(at+1+i)))remove.add(at)}
 S.history.friend=list.filter((m,i)=>!remove.has(i));
 S.pending=S.pending.filter(m=>{
  if(m.id!=='friend'||inquiryFriendLeadKind({...m,...m.extra,text:m.text})<0)return true;
  hadAuthored=true;return false;
 });
 if(!S.flags.leadReviewed){delete inquiry.events['route-lead'];return}
 inquiry.events['route-lead']=true;
 // Repair existing authored history silently; never replay notifications or recreate a deleted conversation.
 if(!hadAuthored)return;
 const date='9月22日 18:09',stamp=inquiryFriendLeadDate(date),history=S.history.friend;
 const at=history.findIndex(m=>m.date&&inquiryFriendLeadDate(m.date)>stamp),index=at<0?history.length:at;
 const entries=INQUIRY_FRIEND_LEAD.map(m=>({...m,type:'text',storyDay:22,storyClock:'18:09'}));
 const priorDate=history.slice(0,index).filter(m=>m.date).at(-1)?.date;
 history.splice(index,0,...(priorDate===date?[]:[{date}]),...entries);
}
function inquiryRouteLead(){
 if(!S.flags.leadReviewed||S.flags.done||S.inquiry.events['route-lead'])return;
 S.inquiry.events['route-lead']=true;
 for(const message of INQUIRY_FRIEND_LEAD){
  const now=Date.now(),tail=S.pending.reduce((latest,m)=>Math.max(latest,m.due),now);
  later('friend',message.text,{contentId:message.contentId,storyDay:22,storyClock:'18:09'},Math.max(4800,tail+4800-now));
 }
}
function syncInquiry(){
 if(!S.inquiry?.version){
  S.inquiry={version:1,routeVerified:Boolean(S.flags.followup||S.flags.matched||S.flags.found),custodyVerified:Boolean(S.flags.followup||S.flags.matched||S.flags.found),oldChatRead:Boolean(S.flags.memory),visited:S.flags.inner?{archive:true,protocol:true,status:true,shrine:true}:{},forms:{},events:{}};
 }
 S.inquiry.forms??={};S.inquiry.events??={};S.inquiry.visited??={};
 if(!S.inquiry.seeded){
  const additions={teacher:[{date:'8月14日 16:07'},{text:'门卫又想起一件事。小禾那天问过他，从东门怎么去榆树路。他没看见她上公交。',contentId:'inquiry-teacher-route'}]};
  const dateNumber=value=>{const d=String(value||'').match(/(\d+)月(\d+)日\s*(\d+):(\d+)/);return d?(((+d[1]*31+ +d[2])*24+ +d[3])*60+ +d[4]):0};
  for(const [id,entries]of Object.entries(additions))if(!S.history[id].some(m=>m.contentId===entries[1].contentId)){const at=S.history[id].findIndex(m=>m.date&&dateNumber(m.date)>dateNumber(entries[0].date));S.history[id].splice(at<0?S.history[id].length:at,0,...clone(entries))}
  S.inquiry.seeded=true;
 }
 if(!S.inquiry.chronologyFixed){const list=S.history.teacher,at=list.findIndex(m=>m.contentId==='inquiry-teacher-route'),laterAt=list.findIndex(m=>m.date==='8月15日 11:07');if(at>laterAt&&laterAt>=0&&list[at-1]?.date==='8月14日 16:07'){const block=list.splice(at-1,2);list.splice(laterAt,0,...block)}S.inquiry.chronologyFixed=true}
 syncInquiryFriendLead();
 // A public camera frame is discovered at the forum, not delivered with the unrelated north-station result.
 if(!S.inquiry.photoDeliveryFixed){
  const opened=(S.photoSeen||[]).includes('bus-shelter'),saved=(S.photoFav||[]).includes('bus-shelter')||(S.photoTrash||[]).includes('bus-shelter');
  const shared=Object.values(S.history||{}).some(messages=>messages.some(m=>m.photo==='bus-shelter'))||(S.moments||[]).some(m=>m.person==='me'&&(m.photos||[]).includes('bus-shelter'));
  const visited=(S.tabs||[]).some(tab=>(tab.entries||[]).some(url=>/street\.huai\.example\/posts\/0813|service\.huai\.example\/player\/ys02/.test(url)));
  if(!opened&&!saved&&!shared&&!visited)S.photoSaved=S.photoSaved.filter(id=>id!=='bus-shelter');
  S.inquiry.photoDeliveryFixed=true;
 }
}
function inquiryEvent(key,id,entries){if(S.flags.done||S.inquiry.events[key])return;S.inquiry.events[key]=true;replyMany(id,entries)}
function inquiryNorm(v){return String(v||'').normalize('NFKC').toUpperCase().replace(/[\s·•—_\-：:./]/g,'')}
function inquiryClock(v){const t=String(v||'').normalize('NFKC').trim().replace(/[时点]/g,':').replace(/分/g,'').replace(/：/g,':');const m=t.match(/^(\d{1,2}):(\d{1,2})$/);return m?`${String(+m[1]).padStart(2,'0')}:${String(+m[2]).padStart(2,'0')}`:t}
function inquiryClothesConflict(value){
 const t=String(value||'').normalize('NFKC').replace(/\s/g,'');
 const white=/(奶白|乳白|米白|白色|浅色外套)/,dark=/(深蓝|蓝色|雨衣|深色)/;
 if(!white.test(t)||!dark.test(t)||!/(不同|不符|不一样|不一致|不是|对不上|而|却|但|这个|照片|现场|画面|vs)/i.test(t))return false;
 if(/完全一致|就是她|确认是她|没有差异|没有区别/.test(t))return false;
 // Reject reversed source attribution, without mistaking "不是蓝色" for a positive claim.
 if(/(?:小禾|她)(?:那天|当天|失联时|失踪时)?(?:穿着|穿的是|穿了|穿|是)(?:一件)?(?:深蓝|蓝色|深色雨衣)/.test(t))return false;
 if(/(?:照片里|照片中|现场|画面里|这个孩子)(?:的孩子)?(?:穿着|穿的是|穿了|穿|是)(?:一件)?(?:奶白|米白|白色)外套/.test(t))return false;
 if(/(?:小禾|她)(?:那天|当天|失联时|失踪时)?(?:没有穿|没穿|不穿|不是)(?:奶白|米白|白色)/.test(t))return false;
 return true;
}
function inquiryWhale(value){
 const clauses=String(value||'').normalize('NFKC').replace(/\s/g,'').split(/[，。；,;]|而是/);
 const positive=clauses.filter(s=>!/(?:不是|没有|没带|并非|不带)/.test(s));
 return positive.some(s=>/(?:蓝色|蓝)[的只个小]*(?:小)?鲸(?:鱼)?/.test(s))&&!positive.some(s=>/绿色|兔/.test(s));
}
const inquiryLink=(label,url,cls='inquiry-link')=>`<button class="${cls}" data-a="url" data-url="${E(url)}">${E(label)}</button>`;
function inquiryShell(name,body,type='civic'){return `<div class="inquiry-site inquiry-${type}"><header><span>${E(name)}</span><small>${type==='street'?'街坊的事，街坊记着':'历史资料 · 公开查阅'}</small></header>${body}<footer>槐城地区资料留存 · 原始记录保持原样</footer></div>`}
function inquiryForm(kind,body,button){return `<form class="web-form inquiry-form" data-form="${kind}">${body}<p class="web-error" role="status">${E(R.inquiryError||'')}</p><button class="web-primary">${button}</button></form>`}
function inquiryField(name,label,type='text'){const value=S.inquiry.forms[R.inquiryForm||'']?.[name]||'';return `<label>${label}<input name="${name}" type="${type}" required autocomplete="off" value="${E(value)}"></label>`}
function inquiryMissing(){return inquiryShell('家庭资料服务','<article><h1>没有记录</h1><p>暂无该家庭的外协记录。</p></article>')}
function inquiryStreet(){return inquiryShell('槐城街坊',`<article><div class="inquiry-kicker">榆树路 / 寻物</div><h1>那只蓝鲸鱼，后来有人来拿吗</h1><p class="inquiry-byline">榆树阿诚 · 2026-08-13 21:09</p><p>今天收摊前，看见站棚下面有个穿浅色外套的小姑娘，怀里抱了只蓝色鲸鱼玩具。她问我，那辆白车是不是来接人的。</p><figure><button data-a="photo" data-id="bus-shelter" aria-label="放大 YS-02 原始画面"><img src="${asset('bus-shelter')}" alt="榆树路站棚的留存画面"></button><figcaption>店门口录像机 YS-02 的截图 · 屏显 2026/08/13 18:14:00</figcaption></figure><p>白车后窗贴着“家庭陪伴”。姑娘上车后，鲸鱼落在长椅上。司机又下来拿，说不能少一样。</p><p>这台录像机是许成维修装的，师傅叫许成。前阵子坏过一回，这次也是请他帮我把旧录像导出来。</p><div class="inquiry-comment"><b>小周五金</b><p>白班我帮着值守。临停车现在都归榆树路便民停车登记，旧资料在值班亭那边。</p>${inquiryLink('榆树路便民停车', 'https://parking.huai.example/')}</div><div class="inquiry-comment"><b>榆树阿诚 · 8月14日</b><p>我把人脸部分交给警方了，公开的只留背面。奇怪的是，她上车以前一直朝着店里。我关掉录像，她才转过去。</p></div></article>`,'street')}
function inquiryParking(){return parkingRecords()}
function inquiryNotice(){return parkingPlace('qinghuai')}
function inquiryRoutePage(){return null}
function inquiryIntake(){return puzzleIntake()}
function inquiryWeb(u){
 const h=u.hostname,p=u.pathname;
 if(h==='street.huai.example')return p==='/posts/0813'?inquiryStreet():p==='/parking/0813'?inquiryParking():inquiryShell('槐城街坊','<article><h1>帖子未找到</h1></article>','street');
 if(h==='service.huai.example')return p==='/notice/37'?inquiryNotice():inquiryShell('槐城社区服务','<article><h1>资料不存在</h1></article>');
 if(h==='records.guijia.example')return p==='/intake'?inquiryIntake():inquiryMissing();
 if(!['www.guijia.example','guijia.example'].includes(h))return null;
 if(p==='/followup')return inquiryRoutePage();
 if(p==='/receipt'&&!S.flags.done)return webHeader()+'<div class="web-pad"><h1>尚无归档回执</h1><p>登记正在办理。</p>'+wlink('家属中心','/family','web-primary')+'</div>'+webFooter();
 if(p.startsWith('/account')&&S.flags.auth&&S.flags.found){
  if(!S.flags.memory&&!S.flags.inner)return publicCopy();
  const parts={'/account/export':'archive','/account/protocol':'protocol','/account/status':'status','/account/shrine':'shrine'},part=parts[p];
  if(part){const required={protocol:'archive',status:'protocol',shrine:'status'}[part];if(required&&!S.inquiry.visited[required])return webHeader()+'<div class="web-pad"><h1>资料索引未建立</h1><p>本次副本没有该附页的关联记录。</p>'+wlink('申请个人资料副本','/account/export','web-primary')+'</div>'+webFooter();S.inquiry.visited[part]=true;return null}
  if(!['/account/source-review','/account/memory-review','/account/authorization'].includes(p))return webHeader()+'<div class="web-pad"><h1>资料不存在</h1></div>'+webFooter();
 }
 return null;
}
function inquirySubmit(){return false}
function inquiryAction(a,b){
 if(['request-followup','check-match'].includes(a)&&!S.puzzle?.intake){browse(BASE+'/followup');return true}
 if(a==='jump-chat'&&b.dataset.id==='daughter'){
  const m=S.history.daughter[+b.dataset.i];if(m&&/鲸鱼|不喜欢那只兔子/.test(m.text||''))S.inquiry.oldChatRead=true;
 }
 return false;
}
function inquiryChat(id,t){
 if(id==='daughter'&&S.flags.found&&!S.flags.memory&&/鲸/.test(t)&&!S.inquiry.oldChatRead&&photoPairCount()<2&&!(/兔/.test(t)&&/不喜欢|讨厌|怕/.test(t)&&/拍|笑/.test(t))){replyMany('daughter',['小鲸鱼怎么了？','你又在翻以前的东西吗？']);return true}
 return false;
}
function inquirySyncUI(){
 if(R.app!=='chat'||R.id!=='daughter'||S.inquiry.oldChatRead)return;
 const area=document.getElementById('chat-body');if(!area)return;const bounds=area.getBoundingClientRect();
 for(const el of area.querySelectorAll('.message[data-msg]')){const msg=S.history.daughter[+el.dataset.msg],box=el.getBoundingClientRect();if(msg&&!msg.me&&/鲸鱼|不喜欢那只兔子/.test(msg.text||'')&&box.top<bounds.bottom&&box.bottom>bounds.top){S.inquiry.oldChatRead=true;persist();break}}
}
document.addEventListener('scroll',e=>{if(e.target?.id==='chat-body')inquirySyncUI()},true);
const inquiryOriginalSearch=searchPage;
searchPage=function(q){
 let html=inquiryOriginalSearch(q);const normalized=String(q).normalize('NFKC').replace(/\s/g,'');const rows=[];
 if(/榆树|蓝鲸|街坊|YS.?02|站棚/.test(normalized))rows.push({title:'那只蓝鲸鱼，后来有人来拿吗',url:INQUIRY_SITES.street+'/posts/0813',desc:'槐城街坊 · 榆树阿诚 · 8月13日。站棚下的孩子和来接人的白车。'});
 if(/青槐|陪伴室|旧儿童院/.test(normalized))rows.push({title:'青槐陪伴室停止对外使用的公告',url:INQUIRY_SITES.service+'/notice/37',desc:'槐城区社区服务档案 · 场地移交与历史委托转介台账。'});
 if(rows.length){html=html.replace(/<p class="native-empty">没有找到相关结果<\/p>/,'');html=html.replace(/<\/div>$/,rows.map(r=>`<button class="engine-result" data-a="url" data-url="${r.url}"><small>${r.url.split('/')[2]}</small><h2>${r.title}</h2><p>${r.desc}</p></button>`).join('')+'</div>')}
 return html;
};
syncInquiry();
