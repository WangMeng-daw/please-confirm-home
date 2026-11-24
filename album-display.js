/* Display a single photograph from a generated raster sheet; original pixels stay intact. */
const albumFrames=new WeakMap(),albumObserved=new Set();
function albumLayout(frame){
 const entry=albumFrames.get(frame);if(!entry||!entry.img.naturalWidth)return;
 const {img,meta,fit}=entry,w=frame.clientWidth,h=frame.clientHeight;if(!w||!h)return;
 const cw=img.naturalWidth/meta.columns,ch=img.naturalHeight/meta.rows;
 // One pixel of inset excludes any generated hairline between adjacent frames.
 const inset=1,scale=(fit==='contain'?Math.min:Math.max)(w/(cw-2*inset),h/(ch-2*inset));
 Object.assign(img.style,{width:img.naturalWidth*scale+'px',height:img.naturalHeight*scale+'px',left:((w-(cw-2*inset)*scale)/2-(meta.column*cw+inset)*scale)+'px',top:((h-(ch-2*inset)*scale)/2-(meta.row*ch+inset)*scale)+'px',clipPath:`inset(${(meta.row*ch+inset)/img.naturalHeight*100}% ${(img.naturalWidth-(meta.column+1)*cw+inset)/img.naturalWidth*100}% ${(img.naturalHeight-(meta.row+1)*ch+inset)/img.naturalHeight*100}% ${(meta.column*cw+inset)/img.naturalWidth*100}%)`});
}
const albumResize=new ResizeObserver(items=>items.forEach(item=>albumLayout(item.target)));
function albumDecorate(){
 for(const frame of albumObserved)if(!frame.isConnected){albumResize.unobserve(frame);albumObserved.delete(frame)}
 for(const img of document.querySelectorAll('img[src*="#album="]:not(.album-sheet-image)')){
  const id=img.getAttribute('src').split('#album=')[1],meta=window.ALBUM_PHOTOS?.[id];if(!meta)continue;
  const style=getComputedStyle(img),fit=style.objectFit==='contain'?'contain':'cover';
  const frame=document.createElement('span');frame.className='album-frame';frame.dataset.photo=id;
  img.classList.add('album-sheet-image');img.before(frame);frame.append(img);
  albumFrames.set(frame,{img,meta,fit});albumObserved.add(frame);albumResize.observe(frame);
  img.addEventListener('load',()=>albumLayout(frame),{once:true});albumLayout(frame);
 }
}
new MutationObserver(albumDecorate).observe(document.body,{childList:true,subtree:true});
albumDecorate();
