/* Cursed photographs retain their original identities, dates and evidence.
 * Only the rendered image changes; saved posts/files continue to reference
 * the same photograph on both phones, including portable embedded assets. */
const RECOGNITION_PHOTO_KEYS = [
 'before','past_beach','past_breakfast','past_drawing','past_rabbit','past_sleep',
 'returned','door','home_shoes','home_dinner','home_drawing','home_rabbit','home_sleep',
 'reflection','hollow','returned-backturn','bus-shelter','camera-preview','camera-capture',
 'iphone-selfie-capture','iphone-mirror-preview','iphone-bed-preview','iphone-bed-capture'
];
const RECOGNITION_ALBUM_NUMBERS = new Set([
 ...Array.from({length:12},(_,i)=>i+1),...Array.from({length:13},(_,i)=>i+25),
 39,40,42,43,45,46,47,61,62,63,64,65,68,69,70,71,72,73,74,75,77,78,79,81,83,84,85,87,88,89,90,91,93,94,95,96
]);
const RECOGNITION_PHOTO_SET = new Set(RECOGNITION_PHOTO_KEYS);
function recognitionPhotoKey(id){return recognitionActive()&&RECOGNITION_PHOTO_SET.has(id)?'ghost-'+id:id;}
function recognitionAlbumSheet(id,sheet){return recognitionActive()&&RECOGNITION_ALBUM_NUMBERS.has(Number(id.replace('album_','')))?'ghost-'+sheet:sheet;}
function recognitionURLSource(url){
 const value=String(url||'');
 const album=value.match(/#album=(album_\d+)$/);if(album)return album[1];
 let key;try{key=assetURLKeys.get(new URL(value,document.baseURI).href)}catch{}
 if(!key)key=value.match(/(?:^|\/)assets\/([^/?#]+)\.(?:png|webp)(?:[?#].*)?$/)?.[1];
 if(key?.startsWith('ghost-')&&RECOGNITION_PHOTO_SET.has(key.slice(6)))return key.slice(6);
 return RECOGNITION_PHOTO_SET.has(key)?key:null;
}
function recognitionVisualSync(){
 const root=document.documentElement,wallpaper=`url('${asset('before')}')`;
 if(root.style.getPropertyValue('--recognition-lock-photo')!==wallpaper)root.style.setProperty('--recognition-lock-photo',wallpaper);
 // Covers open lightboxes, share previews and background artwork which are not
 // necessarily reconstructed by the normal application render function.
 for(const image of document.querySelectorAll('.phone img')){
  const id=recognitionURLSource(image.getAttribute('src'));if(!id)continue;
  const next=asset(id);if(image.getAttribute('src')!==next)image.setAttribute('src',next);
 }
 for(const el of document.querySelectorAll('.phone[style],.phone [style]')){
  const before=el.getAttribute('style');
  const after=before.replace(/url\((['"]?)([^)'"\s]+)\1\)/g,(whole,quote,url)=>{const id=recognitionURLSource(url);return id?`url('${asset(id)}')`:whole;});
  if(after!==before)el.setAttribute('style',after);
 }
}
let recognitionVisualScheduled=false;
const recognitionVisualObserver=new MutationObserver(()=>{
 if(recognitionVisualScheduled)return;recognitionVisualScheduled=true;
 queueMicrotask(()=>{recognitionVisualScheduled=false;recognitionVisualSync();});
});
recognitionVisualObserver.observe(document.querySelector('.phone'),{childList:true,subtree:true,attributes:true,attributeFilter:['src','style']});
recognitionVisualSync();
