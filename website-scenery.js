/* Raster scenery is attached to the rendered website, never to its story URL.
   This wrapper preserves the existing browser markup, routes and event handlers. */
(()=>{
 if(window.WEBSITE_SCENERY_VERSION||typeof browserUI!=='function')return;
 window.WEBSITE_SCENERY_VERSION=1;
 const originalBrowserUI=browserUI;
 function themeFor(page){
  if(page.querySelector('.safari-error'))return null;
  if(page.querySelector('.cult-site:not(.cult-copy)'))return 'cult';
  if(page.querySelector('.rw-street'))return 'street';
  if(page.querySelector('.rw-paper'))return 'news';
  if(page.querySelector('.rw-records'))return 'records';
  if(page.querySelector('.rw-forum'))return 'parents';
  if(page.querySelector('.rw-search,.web-search-engine'))return 'search';
  if(page.querySelector('.rw-inquiry'))return 'civic';
  if(page.querySelector('.rw-public-head,.site-nav'))return 'agency';
  return null;
 }
 browserUI=function(...args){
  const markup=originalBrowserUI.apply(this,args);
  const template=document.createElement('template');
  template.innerHTML=markup;
  const page=template.content.querySelector('#web-content');
  if(!page)return markup;
  const theme=themeFor(page);
  if(!theme)return markup;
  page.dataset.siteScene=theme;
  // Only the agency hero and the ritual pages use scenic imagery. Avoid decoding
  // retired wallpaper in the portable build when opening a normal service page.
  if(['agency','cult'].includes(theme))page.style.setProperty('--site-scene',`url(${JSON.stringify(asset('web-bg-'+theme))})`);
  return template.innerHTML;
 };
})();
