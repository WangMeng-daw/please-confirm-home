/* Fictional glyphs encode Chinese. Documents are sources, never ritual controls. */
const CIPHER_GLYPHS={क:'活',ख:'祭',ग:'要',घ:'见',ङ:'人',च:'守',छ:'灯',ज:'止',झ:'献',ञ:'母',ट:'开',ठ:'门',ड:'即',ढ:'生',ण:'日',त:'相',थ:'同',द:'时',ध:'辰',न:'对',भ:'认',म:'领',य:'团',र:'圆'};
const CIPHER_FRAGMENT='ठ ट ख झ';
const CIPHER_MEMORIES={
'QH-0347':{name:'孙海生',photo:'missing-sun',time:'05:00',label:'未明 · 听钟',quote:'天还没亮，爸就把修好的钟贴到耳边。我问几点，他笑着让我再睡一会。'},
'QH-0361':{name:'王建国',photo:'missing-wang',time:'06:00',label:'破晓 · 吹茶',quote:'六点的第一壶茶，他总先吹三下。等我坐下，才把那杯不烫的推过来。'},
'QH-0386':{name:'赵明明',photo:'missing-zhao',time:'08:00',label:'晨间 · 扶车',quote:'那天八点，我扶着车后座。他数到十才肯往前骑，又回头看我有没有松手。'},
'QH-0392':{name:'刘若宁',photo:'missing-liu',time:'12:00',label:'正午 · 藏结',quote:'正午的钟刚响，她把编好的手绳藏进袖口。我装作没看见，等她自己送给我。'},
'QH-0374':{name:'何小安',photo:'missing-he',time:'18:00',label:'薄暮 · 看猫',quote:'那时每天六点回来，小安都先踮起脚看柜子上的猫。猫不在以后，他还看过一次。'},
'QH-0358':{name:'周淑琴',photo:'missing-zhou',time:'21:00',label:'入夜 · 摸闩',quote:'晚上九点，她摸完门闩总会转身看看我。我说锁好了，她才肯回屋。'}};
const CIPHER_LAMP_ORDER=Object.keys(CIPHER_MEMORIES);
const CIPHER_ARTICLE_ACCOUNT={orthography:'translator','reunion-prayer':'guijia','old-lamp':'localrecords','lamp-guide':'lamphouse'};
function syncCipher(){const old=S.cipher&&typeof S.cipher==='object'&&!Array.isArray(S.cipher)?S.cipher:{};if(old.version!==2)S.cipher={version:2,read:{...(old.read||{})},translation:old.translation||null,paperOpened:false,passwordOpened:false,vowed:false,memories:{},lit:[],rings:{outer:2,middle:0,inner:1},fire:{name:0,body:0,door:0,eaten:0},readyRescue:false,readySeal:false,events:{},drafts:{},notice:'',legacyEnded:Boolean(S.flags.done)};const c=S.cipher;if(c.paperOpened===undefined)c.paperOpened=Boolean(c.passwordOpened||c.vowed||c.readyRescue||c.readySeal||S.flags.done);c.read??={};c.memories??={};c.lit??=[];c.rings??={outer:2,middle:0,inner:1};c.fire??={name:0,body:0,door:0,eaten:0};c.events??={};c.drafts??={};return c}
function cipherState(){return syncCipher()}
function cipherSave(){if(typeof persist==='function')persist()}
function cipherRemember(key){const c=cipherState();if(!c.read[key]){c.read[key]=true;cipherSave()}}
function cipherQueueEvent(){/* Retired: historical ritual saves never enqueue new story events. */}
function cipherPrivateReady(){return Boolean(S.flags.found&&(typeof clueState==='function'?S.puzzle?.adminFate:S.flags.auth&&S.flags.inner&&S.inquiry?.visited?.shrine))}
function cipherPlain(v){return String(v??'').normalize('NFKC').replace(/[\s\p{P}\p{S}]/gu,'')}
function cipherRaw(v){return [...String(v??'').normalize('NFC')].filter(char=>!/[\s\p{P}\p{S}]/u.test(char)).join('')}
function cipherTranslate(input,opts={}){const raw=cipherRaw(input),seal=opts.seal||'',direction=opts.direction||'';if(!raw)return {ok:false,text:'',error:'请输入待转写的原文。'};if(raw.length>160)return {ok:false,text:'',error:'一次最多转写160个记号。'};const unknown=[...new Set([...raw].filter(c=>!Object.hasOwn(CIPHER_GLYPHS,c)))];if(unknown.length)return {ok:false,text:'',error:'字表里没有这些记号：'+unknown.join(' ')};if(!['double','single','ring'].includes(seal))return {ok:false,text:'',error:'请选择原文旁的印记。'};if({double:'rtl',single:'ltr',ring:'up'}[seal]!==direction)return {ok:false,text:'',error:'所选读向与印记不符，请对照借字表。'};const chars=[...raw];if(direction!=='ltr')chars.reverse();return {ok:true,text:chars.map(c=>CIPHER_GLYPHS[c]).join(''),raw,seal,direction,exactFragment:raw===cipherRaw(CIPHER_FRAGMENT)&&seal==='double'&&direction==='rtl'}}
function cipherLink(label,url,cls='cipher-link'){return '<a class="'+cls+'" href="'+E(url)+'" data-a="url" data-url="'+E(url)+'">'+E(label)+'</a>'}
function cipherOfficialMenu(id){const item={translator:['orthography','校读札记'],guijia:['reunion-prayer','团圆寄愿'],localrecords:['old-lamp','旧刻新印'],lamphouse:['lamp-guide','旧时寻人规矩']}[id];return item?'<div class="cipher-account-menu"><button data-a="official-article" data-id="'+item[0]+'">'+item[1]+'</button>'+(id==='translator'?'<button data-a="cipher-translator">逐字转写</button>':'')+'</div>':''}
function cipherAccountMenu(account){const id={orthography:'translator',family:'guijia',gazette:'localrecords',lamp:'lamphouse'}[account]||account;return Object.entries(CIPHER_ARTICLE_ACCOUNT).filter(([,v])=>v===id).map(([key])=>({id:key,title:{orthography:'校读札记','reunion-prayer':'团圆寄愿','old-lamp':'旧刻新印','lamp-guide':'旧时寻人规矩'}[key]}))}
function cipherVertical(chars,label){return '<div class="cipher-rubbing"><span class="cipher-seal-ring">环纹印</span><div class="cipher-vertical">'+chars.split(' ').map(c=>'<span>'+c+'</span>').join('')+'</div><small>'+E(label)+'</small></div>'}
function cipherBookReference(id,title,description=''){if(typeof bookCipherFragmentHTML==='function')return bookCipherFragmentHTML(id,{title,description});const codes={old:'上·贰背·黄',new:'下·贰正·地',sacrifice:'上·伍背·宇',six:'下·伍背·玄'};return '<aside class="bc-reference"><span>'+E(title)+'</span><p>'+E(codes[id]||'')+'</p><p>'+E(description)+'</p>'+cipherLink('《归亲会抄经本》影录','https://zijian.example/library/guqin-copy')+'</aside>'}
function cipherOfficialArticle(id){if(!Object.hasOwn(CIPHER_ARTICLE_ACCOUNT,id))return null;cipherRemember(id);let title='',body='';
if(id==='orthography'){title='这些“梵字”，其实是在写汉语';body='<p>这批槐城旧抄本借字形记汉语，一字对应一字，不能按梵语句子来译。散页上常只写册、叶、正背和行记，那是指向抄经本原文的索引。要先查到书中的一行，再把字形抄来辨读。</p><p>《归亲会抄经本》影录保留两册的旧叶码，另加连续页码。查页办法见影录封面后的说明，转写以字旁印记为准。</p>'+cipherLink('《归亲会抄经本》影录','https://zijian.example/library/guqin-copy')+'<table class="cipher-alphabet"><caption>本地抄本的借字表</caption><tbody>'+Object.entries(CIPHER_GLYPHS).map(([g,w])=>'<tr><th>'+g+'</th><td>'+w+'</td></tr>').join('')+'</tbody></table><h2>先看印记，再读字</h2><dl class="cipher-direction-table"><dt>双点 ··</dt><dd>横排，从右向左。</dd><dt>单点 ·</dt><dd>横排，从左向右。</dd><dt>环纹 ◎</dt><dd>竖排，从下向上。</dd></dl><p>索引中的行记决定查哪一行，字旁的印记决定这一行怎样读。两种标记不能混用。</p><p>重字依原件照录，不省写。人名、生辰与册籍编号另列于各件著录，本文不并入借字表。</p><button class="cipher-tool-button" data-a="cipher-translator">打开逐字转写</button>'}
if(id==='reunion-prayer'){title='接领之后，安心团圆';body='<p>家属服务处将祈词改为统一新印。新纸只标领读索引，值班人员从抄本中取句，不再随页附字。</p>'+cipherBookReference('new','新印祈词 · 领读索引','依《归亲会抄经本》取句，沿用书页旁印记。')+'<p>旧版停止领用。已经发出的旧纸，请交回服务处；门上的旧帖也一并更换。</p><div class="cipher-imprint">家属服务处 · 新印领用通知</div>'}
if(id==='old-lamp'){title='同一扇门，两版祈词';body='<p>小院旧门上的刻字早已磨损，旧拓背面却留着一条查书签。后来重印的纸上换了索引，还要求把旧纸全部收走。</p>'+cipherBookReference('old','旧门铭 · 拓片背签','旧拓背签原字如此。所指一行见《归亲会抄经本》，不可拿新印索引替换。')+'<p>原刊题名取自门铭的译文，旧刊目录沿用原题。此次整理保留各版索引及印记；版本不同的抄件分别著录，不作合校。</p><h2>册页中的日常</h2><blockquote>听钟的人，是想让家里人多睡一会。吹茶的人，等着把不烫的那杯递出去。孩子回头，是想知道扶着车的人还在不在。</blockquote><p>家书接着写，袖口里的手绳是要送给人的；猫不在柜子上，孩子还会去别处找；摸完门闩，老人会回头问家人明早几点出门。</p><p>对照后来的回访问卷，这些话多被简写为“听钟”“吹茶”“回头”。原册背面的家书保留全文，部分家属至今未撤回。</p>'}
if(id==='lamp-guide'){title='人没找到，就不能停止寻找';body='<p>小院供奉守灯君，原本也属于归亲会。另一派后来改奉食名母，自称奉母派，把替身送进家里，再将失踪者的名字写入祭册。小院香火渐少，只有还在寻找亲人的家属愿意来。</p><h2>家人还在等他回来</h2><p>旧规写得清楚：人没找到，寻人启事就不能撤。即使有人长着同一张脸，也得弄清他是不是本人。每户的登记、启事和家书都要保存，是否停止寻找，只能由家属自己决定。</p><h2>一段生活为何没有重复</h2><p>一位老人会把茶杯吹凉，再推到女儿面前。回来的面孔只学会了吹气，连杯子被拿走后也没有停。孩子藏手绳是为了给母亲惊喜，惊喜送出去，那一天便继续往前走。</p><p>六户旧信还记着听钟、扶车、藏手绳、找猫和检查门闩的事。回信中有人写，怕不认眼前的人，会叫亲人寒心；也有人写，不敢告诉家里，自己觉得迎错了人。信收进来，分户保管。</p><h2>来信簿附记</h2><blockquote>六户回函收齐，均不认家中的替身，坚持寻人。祭册契约遂失。原册与各家回信一并封存，由保管人携至旧堂。未有家属亲笔回函的，按原委托留册。</blockquote><p>后来寄来的信，有的坚持续寻，有的还在等家中商议。小院值守的人一年比一年少，旧信按来函日期分户保存。</p>'}
return '<article class="cipher-official-article" data-cipher-article="'+id+'"><div class="cipher-article-kicker">槐城 / 旧字与旧事</div><h1>'+title+'</h1>'+body+'</article>'}
function cipherTranslator(){const c=cipherState(),v=c.drafts.translate||{},r=c.lastTranslation;return '<div class="cipher-translator"><h1>逐字转写</h1><form class="cipher-form web-form" data-form="cipher-translate"><label>原文<textarea name="input" required maxlength="160" rows="3" spellcheck="false">'+E(v.input||'')+'</textarea></label><label>旁边的印记<select name="seal" required><option value="">选择</option>'+[['double','双点'],['single','单点'],['ring','环纹']].map(([key,label])=>'<option value="'+key+'" '+(v.seal===key?'selected':'')+'>'+label+'</option>').join('')+'</select></label><label>读向<select name="direction" required><option value="">选择</option>'+[['rtl','从右向左'],['ltr','从左向右'],['up','从下向上']].map(([key,label])=>'<option value="'+key+'" '+(v.direction===key?'selected':'')+'>'+label+'</option>').join('')+'</select></label>'+(r&&!r.ok?'<p class="cipher-error">'+E(r.error)+'</p>':'')+'<button type="submit" class="cipher-tool-button">开始转写</button></form>'+(r?.ok?'<div class="cipher-translation-result"><span>逐字转写</span><strong>'+E(r.text)+'</strong>'+'</div>':'')+'<button class="cipher-article-reference" data-a="official-article" data-id="orthography">借字表与印记</button></div>'}
function cipherDenied(){return typeof clueUnavailable==='function'?clueUnavailable():'<div class="safari-error"><h2>未找到可访问的资料</h2><p>此地址没有公开的内容，或当前账户没有访问权限。</p></div>'}
function cipherDarkShell(title,body,kind='archive'){return '<div class="cipher-private '+(S.reduce?'is-still':'')+'" data-cipher-page="'+kind+'" style="--cipher-scene:url(\''+asset('web-bg-cult')+'\')"><header><span>归亲会 · 奉母派旧堂</span><img src="'+asset(kind==='mother'?'title-devour':'cult-title')+'" alt="'+(kind==='mother'?'食名母':'归亲堂')+'"><p>以亲人的面貌，接你回家</p></header><article><h1>'+title+'</h1>'+body+'</article><footer>归亲堂 · 文书留存</footer></div>'}
function cipherMother(){return cipherPrivateReady()&&typeof clueMotherPage==='function'?clueMotherPage():cipherDenied()}
function cipherFragmentPage(){return cipherPrivateReady()&&typeof clueCipherPage==='function'?clueCipherPage():cipherDenied()}
function cipherLampShell(title,body,kind='lamp'){return '<div class="cipher-lamp '+(S.reduce?'is-still':'')+'" data-cipher-page="'+E(kind)+'" style="--lamp-scene:url(\''+asset('web-bg-agency')+'\')"><header><span>守灯小院 / 寻亲旧刊</span><img src="'+asset('title-lamp')+'" alt="守灯君"><p>活要见人。</p></header><article><h1>'+E(title)+'</h1>'+body+'</article><footer>旧刊原件留存。</footer></div>'}
function cipherNotice(){return cipherState().notice?'<p class="cipher-ritual-notice" role="status">'+E(cipherState().notice)+'</p>':''}
function cipherDoor(){return typeof clueLampPage==='function'?clueLampPage('/'):cipherDenied()}
function cipherLampHome(){return typeof clueLampPage==='function'?clueLampPage('/'):cipherDenied()}
function cipherVow(){return typeof clueLampPage==='function'?clueLampPage('/'):cipherDenied()}
function cipherHouseholdWitness(){return ''}
function cipherLamps(){return typeof clueLampPage==='function'?clueLampPage('/'):cipherDenied()}
function cipherSealAligned(){return false}
function cipherSeal(){return typeof clueLampPage==='function'?clueLampPage('/'):cipherDenied()}
function cipherFireRemaining(){return 0}
function cipherFirePage(){return typeof clueLampPage==='function'?clueLampPage('/'):cipherDenied()}
function cipherLampRule(){return typeof clueLampPage==='function'?clueLampPage('/'):cipherDenied()}
function cipherAfterPage(part,file){return !file&&part==='shrine'&&cipherPrivateReady()?'<p class="cult-cross-reference cipher-afterpage">配祀记录：'+cipherLink('食名母',BASE+'/account/mother','cult-inline-link')+'。</p>':''}
function cipherLitCount(){return 0}
function cipherEndingReady(){return false}
function cipherFinalGate(){return ''}
function cipherWeb(u){
 if(u.hostname==='zijian.example'&&u.pathname==='/transliteration')return '<div class="cipher-tool-site"><header>字间校读 <span>逐字转写</span></header>'+cipherTranslator()+'</div>';
 if(['guijia.example','www.guijia.example'].includes(u.hostname)&&['/account/mother','/account/cipher','/account/rite-review'].includes(u.pathname))return u.pathname==='/account/mother'?cipherMother():cipherFragmentPage();
 if(u.hostname==='shoudeng.example')return typeof clueLampPage==='function'?clueLampPage(u.pathname==='/contact'?'/contact':'/'):cipherDenied();
 return null;
}
function cipherAction(a){
 if(a==='cipher-translator'){if(typeof requirePhoneNetwork==='function'&&!requirePhoneNetwork())return true;browse('https://zijian.example/transliteration');return true}
 // Consume stale controls from restored pages without mutating legacy ritual fields.
 return ['cipher-light','cipher-reset-lamps','cipher-turn-ring','cipher-give-fire','cipher-take-fire','cipher-rekindle','cipher-open-gate','cipher-close-gate'].includes(a);
}
function cipherSubmit(kind,d){
 if(['cipher-paper','cipher-passphrase','cipher-vow'].includes(kind))return true;
 if(kind!=='cipher-translate')return false;
 if(typeof requirePhoneNetwork==='function'&&!requirePhoneNetwork())return true;
 const c=cipherState(),v=Object.fromEntries(d.entries());c.drafts.translate=v;c.lastTranslation=cipherTranslate(v.input,v);
 if(c.lastTranslation.ok&&c.lastTranslation.exactFragment&&cipherPrivateReady())c.translation={text:c.lastTranslation.text};
 cipherSave();render();return true;
}
syncCipher();

