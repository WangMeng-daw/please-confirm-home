/* Each publisher owns its page layout. This pass is visual only: no new links,
 * unlocked routes, source-read flags, or changes to form controls. */
(()=>{
 const previous=browserUI;
 const hosts={'street.huai.example':'street','parking.huai.example':'parking','linen.huai.example':'linen','service.huai.example':'service','records.guijia.example':'records','archive.huai.example':'archive','shoudeng.example':'lamp','market.huai.example':'market','culture.huai.example':'culture','photo.huai.example':'photo','handwork.huai.example':'handwork','clockwork.huai.example':'clock','pets.huai.example':'pets','news.huai.example':'news','parents.example':'parents','zijian.example':'zijian','search.example':'search','guijia.example':'agency'};
 const covers={market:['article-morning-market.webp','菜市的早晨'],culture:['web-bg-civic.png','街区文化活动场地'],photo:['editorial-photo-v1.png','湖滨影像'],handwork:['editorial-handwork-v1.png','纸艺与手作'],clock:['editorial-clock-v1.png','钟表维修工作台'],pets:['editorial-pets-v1.png','诊所接待区']};
 function picture(file,alt,cls){const img=document.createElement('img');img.className=cls;img.src=asset(file.replace(/\.(png|webp)$/,''));img.alt=alt;img.decoding='async';return img;}
 browserUI=function(...args){
  const template=document.createElement('template');template.innerHTML=previous.apply(this,args);
  const page=template.content.querySelector('#web-content');if(!page||page.querySelector('.safari-error'))return template.innerHTML;
  let u;try{u=new URL(currentURL(),BASE)}catch{return template.innerHTML}
  const id=hosts[u.hostname.replace(/^www\./,'')];if(!id)return template.innerHTML;
  page.dataset.publisher=id;
  const street=page.querySelector('.rw-street-header');
  if(street)street.querySelector('nav')?.before(picture('editorial-street-v1.png','街坊巷弄手绘','publisher-street-art'));
  const parking=page.querySelector('.pk-area-label');
  if(parking){const figure=document.createElement('figure');figure.className='publisher-parking-photo';const caption=document.createElement('figcaption');caption.textContent=parking.textContent;figure.append(picture('editorial-parking-v1.png','榆树路临停服务区',''),caption);parking.replaceWith(figure);}
  const linen=page.querySelector('.linen-site-v2');
  if(linen){linen.style.setProperty('--linen-brand-photo',`url('${asset('editorial-linen-v1')}')`);const hero=linen.querySelector('.linen-brand-hero');if(hero)hero.prepend(picture('editorial-linen-v1.png','布草洗护车间','publisher-linen-photo'));}
  const local=page.querySelector('.fi-site');
  if(local&&covers[id]){const [file,alt]=covers[id];local.querySelector('header')?.append(picture(file,alt,'publisher-local-photo'));}
  // All pages served by the central archive share its document header, instead
  // of accidentally presenting a supplier's clickable masthead as joined text.
  if(id==='records'&&local){local.classList.add('publisher-retained');const small=local.querySelector('header small');if(small)small.textContent='归家资料服务 · '+small.textContent;}
  return template.innerHTML;
 };
})();
