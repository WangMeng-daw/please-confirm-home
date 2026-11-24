/* Optional inner-hall archive. No main-story flags or message queues are changed here. */
const CULT_HISTORY_PHOTOS = [
 {id:'1898',date:'1898-10-16',registered:'1986-11-04',title:'义渡同人留影',asset:'history-1898',number:'归底·乙〇七',digit:'7',copy:'翻印 031',
  caption:'清光绪二十四年。现存最早的一张同人合照，原件边缘受潮。附册把拍摄地点记作槐河义渡旧屋前。',
  note:'此前三十二年的成员姓名，仅见于渡簿与来信，未见照片。',
  people:'同袋席次簿记有周守朴、许兰贞、钱茂生等人，分任渡务、收信与记账。席次簿未标人像位置。',
  back:['光绪戊戌，秋。义渡同人。空椅留与未归者，不列在席次簿内。','椅背旧布结勿解。若有人回来，先问姓名，再请家人辨认；不得只凭一张画像销去渡簿。'],
  source:'槐河义渡来信簿夹页／1898 年附袋'},
 {id:'1926',date:'1926-04-11',registered:'2019-09-07',title:'分册前的春祭',asset:'history-1926',number:'堂底·丙一一',digit:'1',copy:'翻印 087',
  caption:'民国十五年。旧堂合照。次月账簿分成两套，此张装在未分册的封套里。',
  note:'旧椅与布结再次入镜。复印册曾把背面的一行字涂掉，原底卷没有这一道遮挡。',
  people:'会务簿列陆闻舟、罗守义、叶清寅等人。分册批注：陆执掌寻人册，罗执掌祭祀册。照片未标各人姓名。',
  back:['春祭后议定各执一册。守灯一派保存失踪者姓名与家属来信；奉母一派收画像与家属称谓。旧堂器物暂不分。','原底号照旧。复印时遮去第二页撤销登记栏，祈词改样另附。'],
  source:'归亲堂会务簿／1926 年春祭附件'},
 {id:'1986',date:'1986-11-02',registered:'1986-11-03',title:'旧堂重新开门',asset:'history-1986',number:'接底·丁二四',digit:'4',copy:'翻印 116',
  caption:'1986 年秋。旧堂修整后的合照。资料袋同时收有几份“接领”单，封面已不用“义渡”二字。',
  note:'旧椅、褪色布结与早年照片所见相似。修缮账中未查到更换记录。',
  people:'修缮经手人列吴景年、陶月清、袁崇山等。合照未逐人标名。',
  back:['修缮毕，同人留影。交接前先对照旧照片核对外貌，家属称呼以所填簿页为准。','寻人登记与接领记录分柜，不得只因外貌相似就合并原件。此句在后印本中删去。'],
  source:'旧堂修缮档／1986 年第十一袋'},
 {id:'2019',date:'2019-09-06',registered:'2019-09-06',title:'归家互助开站日',asset:'history-2019',number:'站底·戊〇六',digit:'6',copy:'翻印 204',
  caption:'2019 年 9 月 6 日。街坊志愿者为归家互助站留下的合照。画面边缘摆着一把空椅。',
  note:'当年的网页只整理寻人启事与联络方式。旧家具随借用场地留下，开站记录没有为那把空椅登记席位。',
  people:'当日志愿名册列叶明、席成、沈闻等，均为成年人。沈闻任技术志愿者，负责网页与备份。名册未注明照片中的站位。',
  back:['启事上线第一日。不收费，不替家属认人。人没找到，寻人启事就不能撤。','技术交接：沈闻。旧照片另存；撤下的网页先留三十日。收到的旧堂器物不得写进寻亲者个人档案。'],
  source:'归家互助志愿登记／2019 年开站附件'}
];

function cultHistoryAvailable(){return !!(S.flags.found&&S.flags.auth&&S.flags.inner&&S.inquiry?.visited?.shrine)}
function cultHistoryState(){
 const raw=S.cultHistory;
 if(!raw||typeof raw!=='object'||Array.isArray(raw))S.cultHistory={};
 const h=S.cultHistory;h.version=1;
 for(const key of ['readChronicle','albumOpened','negativeUnlocked'])h[key]=h[key]===true;
 if(!h.viewed||typeof h.viewed!=='object'||Array.isArray(h.viewed))h.viewed={};
 for(const p of CULT_HISTORY_PHOTOS){const v=h.viewed[p.id];h.viewed[p.id]={front:v?.front===true,back:v?.back===true}}
 h.draft=typeof h.draft==='string'?h.draft.slice(0,4):'';
 return h;
}
function cultHistoryRemember(key,id){
 const h=cultHistoryState();let changed=false;
 if(id){if(!h.viewed[id][key]){h.viewed[id][key]=true;changed=true}}
 else if(!h[key]){h[key]=true;changed=true}
 if(changed)persist();
 return h;
}
function cultHistoryLink(text,path='',cls=''){return `<button class="ch-link ${cls}" data-a="url" data-url="${E(BASE+'/account/history'+path)}">${E(text)}</button>`}
function cultHistoryShell(title,body,kind='chronicle'){
 const cover=['chronicle','album','negative-index','six-records'].includes(kind),six=kind==='six-records';
 return `<div class="ch-archive" data-history-page="${kind}"><header class="ch-masthead${cover?' ch-illustrated':''}">${cover?`<img class="ch-cover" src="${asset(six?'ui-six-ledgers':'ui-archive-box')}" alt="${six?'深色与朱色线装双册，旧纸签夹在书页之间':'旧堂木桌上留存的档案盒与线装相簿'}" fetchpriority="high">`:''}<div class="ch-title-slip"><span>归亲堂旧藏 · 散件重编</span><h1>${E(title)}</h1><p>${six?'候祭内册 / 沈闻附存':'槐河旧渡档 / 内藏副本'}</p></div></header><main class="ch-body">${body}</main><footer class="ch-footer">原件残损处依底卷校录；未能辨认的姓名留空。<br>整理日期　2026-09-07</footer></div>`;
}
function cultHistoryDenied(){return '<div class="safari-error"><h2>资料不可用</h2><p>此地址未提供可查阅的资料。</p></div>'}
function cultHistoryChronicle(){
 cultHistoryRemember('readChronicle');
 return cultHistoryShell('归亲会沿革抄本',`<div class="ch-document-meta"><span>旧册 卷一</span><time datetime="2026-09-07">重编于 2026-09-07</time></div><article class="ch-prose ch-chronicle">
 <p class="ch-volume-intro">本卷据渡簿、会务簿及历年家属来信编录，起于同治五年，迄于2026年。原件散佚处，以附存抄件补录。</p><details class="ch-preface"><summary>卷首附记<span>展开原文</span></summary><div class="ch-chapter-body"> <p>旧册初题“归亲会”，办义渡，也替失散人家寻人。后来在渡口设屋收信，入夜点灯方便寻亲的人辨认，称“归亲堂”；近年内部册页又用“归家会”之名。屋舍、器物沿用了下来，章程却数次改过。</p></div></details><div class="ch-section-label"><span>沿革目录</span><small>逐章翻阅</small></div>
 <details class="ch-chapter"><summary><time>1866 · 清同治五年</time><h2>渡口上的来信</h2><span class="ch-chapter-toggle" aria-hidden="true">＋</span></summary><div class="ch-chapter-body"><p>槐河水患后，船户与几户失散人家合办义渡，替过河的人留口信，替找不到亲人的人抄姓名。旧簿题作“归亲会”。当时留下的是账、信和手绘渡路，没有照片。</p><p>寻亲的人在灯旁贴上家人的姓名，每晚添油，盼着亲人循着灯光回来。守灯一派后来供奉守灯君，相信只要家人还记得、还在找，失踪的人就不会被困死在里面。卷尾附记：“门铭收入抄经本，上·贰背·黄。”当时的家书逐封保管，不肯因有人长着相同的面孔，就撤下寻人纸条。</p></div></details>
 <details class="ch-chapter"><summary><time>1898 · 清光绪二十四年</time><h2>第一张留存的合照</h2><span class="ch-chapter-toggle" aria-hidden="true">＋</span></summary><div class="ch-chapter-body"><p>这一年，会中同人第一次留下了至今尚存的合照。此前是否拍过，册中无载。照片旁夹着一张席次簿，中间特意没有给那把空椅写名字。</p><p>布结原用于把代转的来信系在椅背。无信可转时也不解开，是怕后来回到渡口的人认不出旧处。此后各代合照里，椅子与布结屡次出现；人名却一代一代换了。</p></div></details>
 <details class="ch-chapter"><summary><time>1926 · 民国十五年</time><h2>同堂分册</h2><span class="ch-chapter-toggle" aria-hidden="true">＋</span></summary><div class="ch-chapter-body"><p>争议起于一户人家接回了“样子完全一样”的孩子。旧账没有写孩子究竟从何而来，只记下家属急着撤销寻人登记，守灯的人却不肯销毁之前的求助信。</p><p>会中由此分为守灯与奉母两派。前者保存寻人登记和家属来信，坚持找到本人；后者开始收画像和家属称谓，把照着画像做成的替身送回家。奉母派供奉代归尊，求它造出亲人的模样，再将失踪者献给食名母。守灯派逐户保存求助信，不肯因为替身进了家门，就把失踪者登记为已经找到。</p><p>春祭后的祈词有删改。分册时带走的原底卷保存了下来，后印本却没有撤销登记栏。</p></div></details>
 <details class="ch-chapter"><summary><time>1986 · 旧堂重组</time><h2>“接领”取代义渡</h2><span class="ch-chapter-toggle" aria-hidden="true">＋</span></summary><div class="ch-chapter-body"><p>几度停用后，旧堂重新开门。修缮簿沿用了旧会名称，新制表格却把画像、称呼、家庭习惯列成了接领所需的材料。</p><p>留在封套里的早期批注提醒经手人：相貌相同，也要查清是不是本人。后续册页把这句删去，只保留家属是否承认的一栏。从那时起，替身被当作失踪者送回家，真正的失踪人员名册则另锁一柜。</p></div></details>
 <details class="ch-chapter"><summary><time>2019 · 归家互助开站</time><h2>邻里寻亲网页开站</h2><span class="ch-chapter-toggle" aria-hidden="true">＋</span></summary><div class="ch-chapter-body"><p>9 月 6 日，邻里的寻人启事第一次整理到共同网页。最早的归家互助是普通公益站，整理线索、转达来信，不收费，也不替家属认人。守灯派有人参与整理失联人员名册，普通志愿者所做的是走访和寻人的实事。</p><p>沈闻在成年志愿者名册中负责网页与备份。他将撤下的页面保留三十天，也收存了旧站搬迁时带来的散页。开站合照沿用旧家具，普通志愿者的登记材料中未提及旧堂祭祀。</p></div></details>
 <details class="ch-chapter"><summary><time>2026 · 八月至九月</time><h2>新来的那一支</h2><span class="ch-chapter-toggle" aria-hidden="true">＋</span></summary><div class="ch-chapter-body"><p>奉母派借家庭陪伴与接送进入公益站，将原始寻人登记改写为团圆记录。沈闻发现，他们正按照照片和家属填写的内容教替身模仿，9 月 6 日留下完整备份与离岗通知，随后去旧院，试图切断传送这些资料的设备。</p><p>9 月 7 日零时，沈闻被献为“站基”。奉母派把他献祭后，用他的照片和账号接待新的家属。此后值班表照填沈闻，账号亦继续发出消息。</p><p>家属记得失踪的亲人，坚持寻找，守灯君才能护住那些被困的人。可守灯一派已所剩无几。食名母不断得到新的祭品，代归尊则照着家属交来的照片造出替身；奉母的人越来越多，没能回家的人也越来越多。</p></div></details>
 </article><div class="ch-attached">附册　历年同人影像，四件。${cultHistoryLink('调阅同人相簿','/album')}</div><button class="ch-return" data-a="url" data-url="${BASE}/account/shrine">归亲堂 · 座前文书</button>`);
}
function cultHistoryAlbum(){
 cultHistoryRemember('albumOpened');
 const stored=['1986','2019','1898','1926'].map(id=>CULT_HISTORY_PHOTOS.find(p=>p.id===id));
 return cultHistoryShell('同人相簿',`${cultHistoryLink('卷一 · 沿革抄本')}<div class="ch-prose"><p>目录按散件入柜位置排列。原照片、背书、同袋签条合为一件。照片未标姓名者，依原样留存。</p></div><div class="ch-album">${stored.map(p=>`<button class="ch-album-card" data-a="url" data-url="${BASE}/account/history/photo/${p.id}"><img src="${asset(p.asset)}" alt="${E(p.title)}" loading="lazy"><span><time>拍摄　${p.date}</time><strong>${p.title}</strong><small>补印登记　${p.registered}</small><small>${p.source}</small></span></button>`).join('')}</div><aside class="ch-filing-slip"><h2>装卷记</h2><p>此卷沿用旧编：以摄年排次，逐袋摘录原底号末位，连缀为卷号。补印登记及翻印号另附，不改旧编。</p>${cultHistoryLink('原底卷索引','/negative')}</aside>`,'album');
}
function cultHistoryPhoto(p,side='front',full=false){
 cultHistoryRemember(!full&&side==='back'?'back':'front',p.id);
 if(full)return cultHistoryShell(p.title,`${cultHistoryLink('返回照片','/photo/'+p.id)}<figure class="ch-full-image"><img src="${asset(p.asset)}" alt="${E(p.title+'，完整照片')}" draggable="false"><figcaption>${p.date} · 原件全幅</figcaption></figure>`,'full');
 const image=`<button class="ch-photo-open" data-a="url" data-url="${BASE}/account/history/photo/${p.id}?view=full" aria-label="查看${p.id}年照片大图"><img class="ch-original" src="${asset(p.asset)}" alt="${E(p.title)}"></button><p class="ch-caption">${E(p.caption)}</p><div class="ch-prose"><p>${E(p.note)}</p></div>`;
 const back=`<section class="ch-photo-back"><span class="ch-back-label">照片背书 · 同袋签条转录</span><h2>${p.title}</h2><dl><div><dt>原底号</dt><dd class="ch-original-number">${p.number}</dd></div><div><dt>后添号</dt><dd>${p.copy}</dd></div><div><dt>补印登记</dt><dd>${p.registered}</dd></div></dl><div class="ch-prose">${p.back.map(text=>`<p>${E(text)}</p>`).join('')}<p>${E(p.people)}</p></div><p class="ch-source">${E(p.source)}</p></section>`;
 return cultHistoryShell(p.title,`${cultHistoryLink('同人相簿','/album')}<div class="ch-photo-meta"><time>${p.date}</time><span>散件 ${CULT_HISTORY_PHOTOS.indexOf(p)+1} / 4</span></div><nav class="ch-photo-sides" aria-label="照片正反面">${cultHistoryLink('照片正面','/photo/'+p.id,side==='front'?'is-selected':'')}${cultHistoryLink('翻看背面','/photo/'+p.id+'?side=back',side==='back'?'is-selected':'')}</nav>${side==='back'?back:image}<div class="ch-photo-bottom">${side==='front'?cultHistoryLink('查看大图','/photo/'+p.id+'?view=full'):cultHistoryLink('原底卷索引','/negative')}</div>`,'photo-'+side);
}
function cultHistoryNegative(){
 const h=cultHistoryState();
 if(!h.negativeUnlocked)return cultHistoryShell('原底卷索引',`${cultHistoryLink('同人相簿','/album')}<div class="ch-prose"><p>原底卷与公开翻印本分柜保存。封套卷号沿用装卷记，所收范围为义渡旧照至开站附件。</p></div><form class="ch-index-form" data-form="cult-history-negative"><label for="ch-negative-number">底卷卷号</label><input id="ch-negative-number" name="number" inputmode="numeric" pattern="[0-9０-９]{4}" maxlength="4" autocomplete="off" value="${E(h.draft)}" required><button type="submit">调阅底卷</button><p class="ch-form-error" role="status">${E(h.notice||'')}</p></form>`,'negative-index');
 return cultHistoryShell('原底卷 · 未删节抄件',`${cultHistoryLink('同人相簿','/album')}<div class="ch-document-meta"><span>原件四袋 / 附页三件</span><span>依原底校录</span></div><article class="ch-prose"><section><time>1926-05-02 · 撤销登记栏原件</time><h2>已撤销登记的人，并未回来</h2><p>旧簿记载：孙阿满被困在堂内，还能答话。家属却已接走另一个与她长相相同的人；那人的相貌照着旧画像，称呼照着家属来信。家属要求撤销寻人登记，经手人陆闻舟没有签字。</p><blockquote>“家属只认得那张脸。孙阿满尚在堂内，不得销去寻人记录。”</blockquote><p>旁注另写：“奉母一派已销去记录，守灯一派继续寻找。”后来翻印遮住了旁注，也遮住了经手人拒绝署名的空格。</p></section><section><time>1926-05-03 · 祈词改样</time><h2>祈词改样单</h2><p>改样单没有誊写祈词，只圈出新旧索引。抄经本一并封入禁传柜，后来由沈闻留了影录副本。</p>${cipherBookReference('old','改样单 · 底稿索引')}${cipherBookReference('new','改样单 · 后印索引')}<p>原稿随后被锁入禁止翻印的底卷。分册以后，两派沿用旧堂名号，祈词各循其本。</p></section><section><time>1986-11-04 · 接领附页</time><h2>两个柜子</h2><p>接领柜保存送回家的人像和家属签字；寻人柜保存失踪人员名册与家属来信。附页特别写明：“办了接领手续，也要查清是不是本人。”这句话在制成统一表格时被删除，两个柜子却一直存在。</p><p>附页末写着：“家属虽已接人，本人未归，寻访照旧。”后印表格未收此句。</p></section><section><time>2026-09-06 23:17 · 备份附条</time><h2>沈闻备份附条</h2><p>沈闻把底卷副本夹入当晚的完整备份，注记：“他们不是第一次删改。失踪者的记录还在，只是网页上不让人看了。”</p><p>翌日站务册增记“沈闻，站基”，本人离岗通知被删。账号继续发出消息，署名是沈闻。底卷旁注：“此人已献祭，照片与账号照常使用。”</p></section></article>`,'negative-record');
}
function cultHistoryWeb(u){
 if(!['www.guijia.example','guijia.example'].includes(u.hostname)||!(u.pathname==='/account/history'||u.pathname.startsWith('/account/history/')))return null;
 if(!cultHistoryAvailable())return cultHistoryDenied();
 const path=u.pathname.replace(/\/$/,''),h=cultHistoryState();
 if(path==='/account/history')return cultHistoryChronicle();
 if(!h.readChronicle)return cultHistoryDenied();
 if(path==='/account/history/album')return cultHistoryAlbum();
 if(!h.albumOpened)return cultHistoryDenied();
 if(path==='/account/history/negative')return cultHistoryNegative();
 const id=path.match(/^\/account\/history\/photo\/(1898|1926|1986|2019)$/)?.[1],p=CULT_HISTORY_PHOTOS.find(p=>p.id===id);
 if(p)return cultHistoryPhoto(p,u.searchParams.get('side')==='back'?'back':'front',u.searchParams.get('view')==='full');
 return cultHistoryDenied();
}
function cultHistoryNpcFacts(id){
 if(!['mother','guardian'].includes(id)||!cultHistoryAvailable()||!S.cultHistory?.readChronicle)return [];
 const h=cultHistoryState(),facts=['已读沿革：1866年清同治五年归亲会始于民间寻亲义渡，当时无照片；1898年为最早留存合照。1926年分成守灯与奉母两派：守灯派保存寻人登记和家属记忆，坚持找到本人；奉母派求代归尊造出替身，将失踪者献给食名母。1986年旧堂重组，开始将替身送给家属。2019年归家互助是真实普通公益站，沈闻为成年技术志愿者，不得把全体志愿者当作奉母派。2026年奉母派渗透，沈闻9月6日留备份、7日零时被献为站基。守灯君力量微弱，不能凭空救人。'];
 for(const p of CULT_HISTORY_PHOTOS){const viewed=h.viewed[p.id],parts=[];if(viewed.front)parts.push('已看正面附记：'+p.caption);if(viewed.back)parts.push('已翻背书与同袋签条：'+p.back.join(' ')+p.people);if(parts.length)facts.push(p.id+'年。'+parts.join(' '))}
 if(h.negativeUnlocked)facts.push('已调阅未删节原底卷：1926年孙阿满的家属领回替身，孙阿满本人被困在堂内并能答话，经手人拒绝撤销寻人登记。改样单只标两条抄经本索引：底稿为上·贰背·黄，后印为下·贰正·地；原句需查书转写，不得替玩家说出未破解的句子。1986年附页要求分别保存接领记录与寻人登记，不得把办完接领手续当成已找到本人；这些话后来被删去。沈闻保留了未删节的副本。这些资料说明两派一方坚持找人，另一方将替身交给家属；不增添新能力，不改变救援与重新封印的条件。');
 return facts;
}
function cultHistoryKnowledgeKey(id){
 if(!['mother','guardian'].includes(id)||!cultHistoryAvailable()||!S.cultHistory?.readChronicle)return '';
 const h=cultHistoryState();return 'history-v1:'+CULT_HISTORY_PHOTOS.map(p=>(h.viewed[p.id].front?'f':'-')+(h.viewed[p.id].back?'b':'-')).join(':')+':'+Number(h.negativeUnlocked);
}

const cultHistoryPreviousPuzzleWeb=puzzleWeb;
puzzleWeb=function(u){const page=cultHistoryWeb(u);return page===null?cultHistoryPreviousPuzzleWeb(u):page};
const cultHistoryPreviousInnerPage=innerPage;
innerPage=function(file=false,path='/account/export'){
 const html=cultHistoryPreviousInnerPage(file,path);
 if(file||path!=='/account/shrine'||!cultHistoryAvailable())return html;
 const template=document.createElement('template');template.innerHTML=html;
 const body=template.content.querySelector('.internal-body');
 if(body&&!body.querySelector('.ch-footnote'))body.insertAdjacentHTML('beforeend',`<p class="ch-footnote">旧堂名号及器物沿用，参见附存${cultHistoryLink('《归亲会沿革抄本》')}。</p>`);
 return template.innerHTML;
};
document.addEventListener('input',e=>{
 const input=e.target;if(!input.matches('#ch-negative-number')||!cultHistoryAvailable()||!S.cultHistory?.albumOpened)return;
 const h=cultHistoryState();h.draft=input.value.slice(0,4);h.notice='';persist();
});
document.addEventListener('submit',e=>{
 const form=e.target;if(form.dataset.form!=='cult-history-negative')return;
 e.preventDefault();e.stopImmediatePropagation();
 if(!cultHistoryAvailable()||!S.cultHistory?.readChronicle||!S.cultHistory?.albumOpened)return;
 if(typeof requirePhoneNetwork==='function'&&!requirePhoneNetwork())return;
 const h=cultHistoryState(),number=String(new FormData(form).get('number')||'').replace(/[０-９]/g,c=>String(c.charCodeAt(0)-0xff10)).trim();
 h.draft=number.slice(0,4);h.notice='';
 if(number===CULT_HISTORY_PHOTOS.map(p=>p.digit).join(''))h.negativeUnlocked=true;
 else h.notice='未检得此卷。请核对封套原底号。';
 persist();render();
},true);
