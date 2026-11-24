/* Cross-source references are readable clues. WeChat's delivered web shares
 * keep their native link cards; other sources require manual discovery. */
function manualSourceHost(url){try{return new URL(url,BASE).hostname.replace(/^www\./,'')}catch{return ''}}
function manualReferenceLabel(label,url){
 const text=String(label||'').replace(/[›→»]/g,'').replace(/^(?:点击|前往|打开|查看|翻阅|调阅)\s*/,'').trim();
 try{const u=new URL(url,BASE);if(u.hostname==='records.guijia.example'&&u.pathname.startsWith('/retained/')){const f=Object.values(FAMILY_INVESTIGATIONS).find(x=>u.pathname.endsWith(x.case));if(f)return '旧堂留存记录：'+f.name+' · '+f.case+' · '+f.title;}if(u.hostname==='zijian.example'&&u.pathname.includes('/library/'))return '书目：《归亲会抄经本》';}catch{}
 return text||'资料出处';
}
function manualPlainReference(el,label){
 // Navigation captions are not prose. Drop redundant destinations already named
 // in the surrounding paragraph, but retain document titles and record IDs.
 const simple=String(label||'').replace(/(?:官网|官方网站|网站)$/,'').trim();
 const context=el.parentElement?.cloneNode(true);
 if(context){for(const ref of context.querySelectorAll('[data-a],a,.manual-source-reference'))ref.remove();}
 if((simple.length>3&&context?.textContent.includes(simple))||(/^(检索|本地新闻)$/.test(label)&&el.closest('header,footer'))||label==='微信：许老师'&&context?.textContent.includes('许老师')){el.remove();return;}
 // A masthead carries separate brand and article-title elements. Flattening it
 // into text joins the two names and destroys the source's typography.
 if(el.closest('header')&&el.querySelector('small,strong')){
  const span=document.createElement('span');span.className='manual-source-reference manual-source-masthead';
  span.append(...el.childNodes);el.replaceWith(span);return;
 }
 const span=document.createElement('span');span.className='manual-source-reference';span.textContent=label;
 el.replaceWith(span);
}
function manualStripReferences(markup,source,scope='web'){
 const t=document.createElement('template');t.innerHTML=markup;
 const host=manualSourceHost(source);
 for(const el of t.content.querySelectorAll('[data-a="url"],a[href]')){
  const url=el.dataset.url||el.getAttribute('href');if(!url||url.startsWith('#'))continue;
  if(el.closest('.web-search-engine'))continue;
  if(el.matches('.rw-paper-search')&&manualSourceHost(url)==='search.example')continue;
  if(manualSourceHost(url)!==host)manualPlainReference(el,manualReferenceLabel(el.textContent,url));
 }
 for(const el of t.content.querySelectorAll('[data-a="pz-admin-profile"],[data-a="official-account"],[data-a="official-article"],[data-a="cipher-translator"],[data-a="dy-clue-link"],[data-a="chat"],[data-a="nav"][data-app="wechat"]')){
  if(scope==='official'&&el.closest('.oa-byline'))continue;
  if(host==='mp.weixin.example'&&el.dataset.a==='official-article'&&new URL(source,BASE).pathname.endsWith('/'+el.dataset.id))continue;
  let label=el.textContent;
  if(el.dataset.a==='pz-admin-profile')label='历史署名：阿闻修字';
  else if(el.dataset.a==='official-account')label='公众号：'+(OFFICIAL_ACCOUNTS[el.dataset.id]?.name||label);
  else if(el.dataset.a==='official-article'){const meta=officialArticleMeta(el.dataset.id);label=meta?(OFFICIAL_ACCOUNTS[meta.account]?.name||'公众号')+' · 《'+meta.title+'》':label;}
  else if(el.dataset.a==='cipher-translator')label='字间校读 · 逐字转写';
  else if(el.dataset.a==='chat')label='微信：'+(D.people[el.dataset.id]?.name||'许老师');
  else if(el.dataset.a==='nav')label='微信：许老师';
  manualPlainReference(el,manualReferenceLabel(label));
 }
 return t.innerHTML;
}
const manualOldBrowser=browserUI;
browserUI=function(...args){const t=document.createElement('template');t.innerHTML=manualOldBrowser.apply(this,args);const web=t.content.querySelector('#web-content');if(web)web.innerHTML=manualStripReferences(web.innerHTML,currentURL());return t.innerHTML};
const manualOldOfficialArticle=officialArticleUI;
officialArticleUI=function(id){return manualStripReferences(manualOldOfficialArticle(id),'https://mp.weixin.example/','official')};
const manualOldMessage=renderMsg;
renderMsg=function(id,m,i){
 if(!m.me&&m.text?.includes('寻人登记可在下方菜单办理'))m={...m,text:m.text.replace('寻人登记可在下方菜单办理','寻人登记在归家寻亲网站办理')};
 // Delivered WeChat shares retain their title, destination and normal card UI.
 return manualOldMessage(id,m,i);
};
const manualOldDyComment=dyCommentRow;
dyCommentRow=function(p,c,nested=false){const t=document.createElement('template');t.innerHTML=manualOldDyComment(p,c,nested);for(const el of t.content.querySelectorAll('[data-a="dy-clue-link"]')){let label=manualReferenceLabel(el.textContent);if(/公开寻人登记/.test(label))label='归家寻亲：'+label;manualPlainReference(el,label)}return t.innerHTML};
const manualOldDyMessage=dyMessageContent;
dyMessageContent=function(m){
 if(!m.me&&m.type==='url'){
  const record=dyStoryRecord(m.url);let ref=manualReferenceLabel(m.text,m.url);
  if(record){const id=new URL(m.url,BASE).searchParams.get('id');ref='归家寻亲：'+record.name+'的寻人登记'+(id?'，登记编号 '+id:'');}
  return `<div class="dy-message-text">${E(m.text||'')}</div>${ref===m.text?'':`<span class="manual-source-reference">${E(ref)}</span>`}`;
 }
 const html=manualOldDyMessage(m);return m.me?html:manualStripReferences(html,'https://v.douyin.example/');
};
const manualPreviousSearch=clueSearch;
clueSearch=function(q){return (typeof manualDiscoverySearch==='function'?manualDiscoverySearch(q):null)||manualPreviousSearch(q)};
