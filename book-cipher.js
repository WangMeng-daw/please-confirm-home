/* A fixed book cipher. Source slips point to leaves and lines; the reader must
   locate and transcribe the text. These borrowed glyphs encode Chinese, not Sanskrit. */
const BOOK_CIPHER_URL='https://zijian.example/library/guqin-copy';
const BOOK_CIPHER_VERSION=1;
const BOOK_CIPHER_LEAVES=['壹','贰','叁','肆','伍','陆'];
const BOOK_CIPHER_ROWS=['天','地','玄','黄','宇','宙'];
const BOOK_CIPHER_SEALS={single:{mark:'·',label:'单点',direction:'ltr'},double:{mark:'··',label:'双点',direction:'rtl'},ring:{mark:'◎',label:'环纹',direction:'up'}};
const BOOK_CIPHER_ENTRIES={};
const BOOK_CIPHER_FILLERS=['雨后晾纸','借书按期还','夜间低声','勿近火灯','阅毕入柜','旧册轻翻','按日开门','夜间勿近火灯','雨后阅旧册','借旧册按期还','旧纸阅毕入柜','雨后轻翻旧册','还书按日入柜','阅毕轻声还书','旧册勿近火','雨后晾旧纸','夜间低声阅书','旧灯夜间开'];
function bookCipherState(){
 const old=S.bookCipher&&typeof S.bookCipher==='object'&&!Array.isArray(S.bookCipher)?S.bookCipher:{};
 if(old.version!==BOOK_CIPHER_VERSION)S.bookCipher={version:BOOK_CIPHER_VERSION,page:0,pages:{},read:{},decoded:{},opened:false};
 const b=S.bookCipher;b.pages??={};b.read??={};b.decoded??={};b.page=Number.isInteger(b.page)&&b.page>=0&&b.page<=24?b.page:0;return b;
}
function bookCipherAvailable(){return Boolean(S.flags?.found&&((typeof clueState==='function'&&clueState().known?.['dp-cloud-letter'])||S.flags?.done));}
function bookCipherSave(){if(typeof persist==='function')persist();}
function bookCipherEscape(value){return typeof E==='function'?E(String(value??'')):String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function bookCipherResolve(code){
 const s=String(code||'').replace(/[\s·・，,、/\-]/g,'').replace(/貳/g,'贰').replace(/參/g,'叁').replace(/陸/g,'陆').replace(/黃/g,'黄');
 const m=s.match(/^([上下])([壹贰叁肆伍陆])([正背])([天地玄黄宇宙])$/);if(!m)return null;
 const leaf=BOOK_CIPHER_LEAVES.indexOf(m[2])+1,back=m[3]==='背',index=BOOK_CIPHER_ROWS.indexOf(m[4]);
 return {page:(m[1]==='下'?12:0)+(leaf-1)*2+(back?2:1),row:back?6-index:index+1,volume:m[1],leaf,side:m[3],lineMark:m[4]};
}
function bookCipherAddAlphabet(text){
 const reverse=Object.fromEntries(Object.entries(CIPHER_GLYPHS).map(([g,w])=>[w,g]));
 // Avoid precomposed nukta letters: Unicode NFC expands them into two code points.
 const pool=[...Array.from({length:54},(_,i)=>String.fromCodePoint(0x0904+i)),'ॠ','ॡ','ॐ',...Array.from({length:14},(_,i)=>String.fromCodePoint(0x0972+i))];
 for(const ch of [...text])if(!reverse[ch]){const glyph=pool.find(g=>!Object.hasOwn(CIPHER_GLYPHS,g));if(!glyph)throw new Error('The manuscript alphabet has no unused glyphs.');CIPHER_GLYPHS[glyph]=ch;reverse[ch]=glyph;}
 return reverse;
}
function bookCipherEncode(text,seal='single'){
 const reverse=bookCipherAddAlphabet(text),chars=[...text].map(c=>reverse[c]);if(seal!=='single')chars.reverse();return chars.join(' ');
}
function bookCipherRegister(entries){
 for(const item of entries||[]){const index=bookCipherResolve(item.code);if(!item.id||!index||!item.text||!BOOK_CIPHER_SEALS[item.seal||'single'])throw new Error('Invalid book cipher entry.');
  const collision=Object.values(BOOK_CIPHER_ENTRIES).find(v=>v.id!==item.id&&v.page===index.page&&v.row===index.row);if(collision)throw new Error('Two manuscript entries occupy the same line.');
  BOOK_CIPHER_ENTRIES[item.id]={...item,...index,seal:item.seal||'single',glyphs:bookCipherEncode(item.text,item.seal||'single')};
 }
 return Object.keys(BOOK_CIPHER_ENTRIES);
}
function bookCipherLookup(id){return BOOK_CIPHER_ENTRIES[id]||null;}
function bookCipherGetLine(page,row){
 const fixed=Object.values(BOOK_CIPHER_ENTRIES).find(v=>v.page===page&&v.row===row);if(fixed)return {...fixed};
 const text=BOOK_CIPHER_FILLERS[((page-1)*5+row-1)%BOOK_CIPHER_FILLERS.length];
 const seal=['single','double','single','single','ring','double','single','double'][((page-1)*6+row-1)%8];return {page,row,text,seal,glyphs:bookCipherEncode(text,seal),id:null};
}
function bookCipherVisit(page){
 if(!bookCipherAvailable())return false;const n=Number(page);if(!Number.isInteger(n)||n<0||n>24)return false;
 const b=bookCipherState();b.opened=true;b.page=n;
 if(n>0&&!b.pages[n]){b.pages[n]=Date.now();bookCipherSave();if(typeof window.bookCipherOnRead==='function')window.bookCipherOnRead({page:n});}
 return true;
}
function bookCipherSolved(id){return Boolean(bookCipherState().decoded[id]);}
function bookCipherHandleResult(result){
 if(!result?.ok||!bookCipherAvailable())return [];
 const b=bookCipherState(),raw=typeof cipherRaw==='function'?cipherRaw(result.raw):String(result.raw||'').replace(/\s/g,'');const matches=[];
 for(const item of Object.values(BOOK_CIPHER_ENTRIES)){
  if(item.id.startsWith('household_')&&(typeof familyInvestigationSourceReady!=='function'||!familyInvestigationSourceReady(item.id)))continue;
  if(item.id==='xiaoqiu'&&(typeof redemptionXiaoqiuSourceReady!=='function'||!redemptionXiaoqiuSourceReady()))continue;
  if(!b.pages[item.page]||raw!==item.glyphs.replace(/\s/g,'')||result.seal!==item.seal||result.direction!==BOOK_CIPHER_SEALS[item.seal].direction||result.text!==item.text)continue;
  const detail={id:item.id,page:item.page,row:item.row,code:item.code,text:item.text,at:Date.now()};b.read[item.page+':'+item.row]=true;
  if(!b.decoded[item.id]){b.decoded[item.id]=detail;matches.push(detail);if(typeof window.bookCipherOnResult==='function')window.bookCipherOnResult(detail);if(item.id.startsWith('household_')&&typeof familyInvestigationDecoded==='function')familyInvestigationDecoded(item.id,detail);}
 }
 if(matches.length)bookCipherSave();return matches;
}
function bookCipherHref(page=0){return BOOK_CIPHER_URL+(page?'?page='+page:'');}
function bookCipherLink(){return '<span class="bc-source-title">资料：《归亲会抄经本》</span>';}
function bookCipherFragmentHTML(id,options={}){
 const item=bookCipherLookup(id);if(!item)return '';
 return '<aside class="bc-reference"><span class="bc-reference-label">'+bookCipherEscape(options.title||'《归亲会抄经本》索引')+'</span><p class="bc-reference-code">'+bookCipherEscape(item.code)+'</p>'+(options.description?'<p class="bc-reference-note">'+bookCipherEscape(options.description)+'</p>':'')+bookCipherLink()+'</aside>';
}
function bookCipherCover(){
 const cover=typeof asset==='function'?asset(window.BOOK_CIPHER_COVER_ASSET||'book-prayer-cover'):'';
 return '<div class="bc-cover-photo" style="--bc-cover:url(\''+bookCipherEscape(cover)+'\')"><span>槐城民间文献 · 抄件</span><h1>归亲会<br>抄经本</h1><p>上下二册　合订影录</p></div><div class="bc-intro"><p>原件两册，每册六叶，每叶分正、背两面。合订后依次编为二十四页；封面和说明不计入页码。</p><p>本件借梵文字形记汉语，释读依本地借字表。字形对照据“字间校读”借字表整理。</p><details class="bc-instructions"><summary>影录编例</summary><div><h2>册、叶、面</h2><p>“上”“下”是册次，壹至陆是该册的叶数。一叶先正面、后背面。上册从第一页开始，下册接在上册之后。</p><p class="bc-example">例：上·壹正是第1页，上·壹背是第2页；下·壹正接在上册的十二页之后。</p><h2>六行的边记</h2><p>天、地、玄、黄、宇、宙分别是一至六。正面从上往下数；背面从下往上数。旧抄件写的是行记，影录页左侧另加了从上往下的行号。</p><h2>字旁的印记</h2><dl><dt>单点 ·</dt><dd>从左往右读。</dd><dt>双点 ··</dt><dd>从右往左读。</dd><dt>环纹 ◎</dt><dd>竖排，从下往上读。</dd></dl><p>行记依叶面正背定位，字序则从各行印记。影录保留原字排列及行末印记，未按释读次序重排。</p></div></details><button class="bc-open" data-a="book-cipher-page" data-page="1">翻开第一页</button></div>';
}
function bookCipherFolio(page){const volume=page>12?'下':'上',within=(page-1)%12+1;return volume+'册 · 第'+BOOK_CIPHER_LEAVES[Math.ceil(within/2)-1]+'叶'+(within%2?'正':'背');}
function bookCipherPage(page=bookCipherState().page){
 if(!bookCipherAvailable())return typeof cipherDenied==='function'?cipherDenied():'<div class="safari-error"><h2>资料未公开</h2></div>';
 const n=Math.max(0,Math.min(24,Math.floor(Number(page)||0)));bookCipherVisit(n);
 const header='<header class="bc-site-header"><span>字间校读</span><span>旧抄本影录</span></header>';
 if(!n)return '<main class="bc-library" data-book-page="0">'+header+bookCipherCover()+'</main>';
 const lines=Array.from({length:6},(_,i)=>{const line=bookCipherGetLine(n,i+1),seal=BOOK_CIPHER_SEALS[line.seal];return '<div class="bc-line '+(line.seal==='ring'?'bc-line-vertical':'')+'" data-book-row="'+(i+1)+'"><span class="bc-line-number" aria-label="第'+(i+1)+'行">'+(i+1)+'</span><div class="bc-line-copy">'+(line.seal==='ring'?'<div class="bc-vertical-glyphs" aria-label="第'+(i+1)+'行原字，从上向下排列">'+line.glyphs.split(' ').map(g=>'<span>'+g+'</span>').join('')+'</div>':'<textarea readonly spellcheck="false" rows="1" aria-label="第'+(i+1)+'行原字">'+line.glyphs+'</textarea>')+'</div><span class="bc-seal" title="'+seal.label+'"><b>'+seal.mark+'</b><small>'+seal.label+'</small></span></div>';}).join('');
 return '<main class="bc-library" data-book-page="'+n+'">'+header+'<div class="bc-toolbar"><a href="'+BOOK_CIPHER_URL+'" data-a="url" data-url="'+BOOK_CIPHER_URL+'">封面与说明</a><span>合订影录 / '+n+' · 24</span></div><article class="bc-paper"><header><span>归亲会抄经本</span><h1>'+bookCipherFolio(n)+'</h1></header><div class="bc-lines">'+lines+'</div><footer><span>影录第 '+n+' 页</span><span>每页六行</span></footer></article><nav class="bc-pager" aria-label="抄本翻页"><button data-a="book-cipher-page" data-page="'+(n-1)+'" aria-label="上一页">上一页</button><form data-form="book-cipher-jump"><label>第<input type="number" name="page" min="1" max="24" inputmode="numeric" aria-label="跳转页码" value="'+n+'">页</label><button type="submit">前往</button></form><button data-a="book-cipher-page" data-page="'+(n+1)+'"'+(n===24?' disabled':'')+' aria-label="下一页">下一页</button></nav><div class="bc-reading-tools">'+(typeof redemptionNotebookButton==='function'?redemptionNotebookButton():'')+'</div></main>';
}
function bookCipherWeb(url){const u=typeof url==='string'?new URL(url):url;if(u.hostname==='zijian.example'&&u.pathname==='/library/guqin-copy')return bookCipherPage(u.searchParams.get('page')||0);return null;}
function bookCipherAction(a,element){if(a!=='book-cipher-page')return false;const page=Number(element?.dataset?.page);if(bookCipherAvailable()&&Number.isInteger(page)&&page>=0&&page<=24)browse(bookCipherHref(page));return true;}
function bookCipherSubmit(kind,data){if(kind!=='book-cipher-jump')return false;const raw=String(data.get('page')||'').trim(),page=Number(raw);if(bookCipherAvailable()&&raw&&Number.isInteger(page)&&page>=1&&page<=24)browse(bookCipherHref(page));return true;}
bookCipherAddAlphabet(BOOK_CIPHER_FILLERS.join(''));
bookCipherRegister([
 {id:'old',code:'上·贰背·黄',text:'活要见人',seal:'ring'},
 {id:'new',code:'下·贰正·地',text:'认领即团圆',seal:'single'},
 {id:'sacrifice',code:'上·伍背·宇',text:'献祭开门',seal:'double'},
 {id:'six',code:'下·伍背·玄',text:'生日相同时辰相对',seal:'single'},
 {id:'xiaoqiu',code:'下·陆正·宇',text:'二楼三号室',seal:'single'}
]);
