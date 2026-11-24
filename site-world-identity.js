/* Visual identity only: the underlying routes, fields and clue hooks are unchanged. */
(()=>{
 if(window.SITE_WORLD_IDENTITY_VERSION||typeof browserUI!=='function')return;
 window.SITE_WORLD_IDENTITY_VERSION=1;
 const prior=browserUI;
 browserUI=function(...args){
  const markup=prior.apply(this,args),t=document.createElement('template');
  t.innerHTML=markup;
  const page=t.content.querySelector('#web-content');
  if(!page||page.querySelector('.safari-error'))return markup;
  if(page.querySelector('.pk-site')){
   page.dataset.worldSite='parking';
   const hero=page.querySelector('.pk-hero');
   if(hero){const caption=document.createElement('p');caption.className='pk-area-label';caption.textContent=hero.querySelector('span')?.textContent||'榆树路临停服务区';hero.replaceWith(caption)}
  }else if(page.querySelector('.pz-admin,.clue-paper.light-archive')){
   page.dataset.worldSite='station';
  }else if(page.querySelector('.clue-service.light-archive')){
   page.dataset.worldSite='family-care';
   page.style.setProperty('--world-scene',`url(${JSON.stringify(asset('web-bg-agency'))})`);
  }else if(page.querySelector('.ch-archive')){
   page.dataset.worldSite='history';
  }
  if(page.dataset.siteScene==='agency')page.dataset.worldPage=page.querySelector('.site-hero')?'home':'inside';
  return t.innerHTML;
 };
})();
