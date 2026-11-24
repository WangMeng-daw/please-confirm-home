/* Fictional iPhone-style still camera. Uses authored PNGs, never device media. */
(()=>{
 const originalPreview=returnedPreviewFile,originalShot=returnedShotFile,originalCapture=returnedCapture,originalSync=syncAfterReturn,originalRender=render;
 const frames=new WeakMap(),observed=new Set();let focusTimer=null,lastRoute=R.app,lastState=S;
 const clamp=(n,min,max,fallback)=>Number.isFinite(Number(n))?Math.max(min,Math.min(max,Number(n))):fallback;
 const zoomText=n=>Number(n.toFixed(1)).toString();
 window.IPHONE_CAMERA_ASSETS={frontIdle:'iphone-selfie-preview',frontPreview:'iphone-selfie-preview',frontCapture:'iphone-selfie-capture',...window.IPHONE_CAMERA_ASSETS};
 for(const [id,description]of Object.entries({
  'iphone-selfie-preview':'林砚独自在书房，前置镜头拍到他的脸和身后的房间。',
  'iphone-selfie-capture':'林砚的自拍照片中，短发的小禾贴近他的肩后，直视镜头。'
 }))CAMERA_DESCRIPTIONS[id]??=description;
 function state(){
  const r=afterReturnData();r.camera??={};const c=r.camera;c.lens=c.lens==='front'?'front':'rear';c.zoom??={rear:.5,front:.5};
  for(const lens of ['front','rear'])c.zoom[lens]=clamp(c.zoom[lens],.5,5,.5);
  c.exposure=clamp(c.exposure,-2,2,0);c.flash=Boolean(c.flash);c.grid=Boolean(c.grid);return c;
 }
 function settings(){const c=state();return {version:1,lens:c.lens,zoom:c.zoom[c.lens],exposure:c.exposure,flash:c.flash,aspect:3/4}}
 // The full authored frame is the widest 0.5× field of view; all later views use the same crop.
 const crop=c=>Math.max(1,Number(c.zoom||1)*2),brightness=c=>Math.pow(2,Number(c.exposure||0)*.5);
 function cancel(){clearTimeout(focusTimer);if(returnedCaptureJob){returnedCaptureJob.key='iphone-camera-cancelled';returnedCaptureJob=null}}
 returnedPreviewFile=function(){if(state().lens!=='front')return originalPreview();return returnedCameraActive()?window.IPHONE_CAMERA_ASSETS.frontPreview:window.IPHONE_CAMERA_ASSETS.frontIdle};
 returnedShotFile=function(){if(state().lens!=='front')return originalShot();return returnedCameraActive()?window.IPHONE_CAMERA_ASSETS.frontCapture:window.IPHONE_CAMERA_ASSETS.frontIdle};
 syncAfterReturn=function(){
  originalSync();const job=returnedCaptureJob;
  for(const shot of afterReturnData().captures){
   if(!shot.camera&&job?.iphoneCamera&&job.state===S&&Number(shot.id.split('_')[1])>job.iphoneSerial)shot.camera={...job.iphoneCamera};
   if(shot.camera&&D.photos[shot.id]){const c=shot.camera;D.photos[shot.id].camera={...c};D.photos[shot.id].description=returnedCaptureDescription(shot);D.photos[shot.id].device='相机 · '+(c.lens==='front'?'前置镜头':'后置镜头');D.photos[shot.id].lens=`${c.lens==='front'?'前置':'后置'} · ${zoomText(Number(c.zoom)||1)}× · 曝光 ${Number(c.exposure)>0?'+':''}${Number(c.exposure)||0} EV`;}
  }
 };
 returnedCapture=async function(){
  if(returnedCaptureJob)return;const shotSettings=settings(),serial=afterReturnData().serial,owner=S;
  const pending=originalCapture();if(returnedCaptureJob&&returnedCaptureJob.state===owner){returnedCaptureJob.iphoneCamera=shotSettings;returnedCaptureJob.iphoneSerial=serial;document.querySelector('.iphone-shutter')?.setAttribute('aria-busy','true')}
  await pending;if(!returnedCaptureJob)document.querySelector('.iphone-shutter')?.removeAttribute('aria-busy');decorate();
 };
 render=function(){if(lastRoute==='homecamera'&&R.app!=='homecamera'||S!==lastState||returnedCaptureJob&&returnedCaptureJob.key!==npcStateKey())cancel();lastRoute=R.app;lastState=S;return originalRender()};
 window.homeCameraUI=function(){
  const r=afterReturnData(),c=state(),z=c.zoom[c.lens],latest=[...r.captures].reverse().find(p=>!S.photoTrash.includes(p.id));
  return `<div class="iphone-camera" aria-label="相机"><div class="iphone-camera-top"><button data-a="iphone-camera-flash" aria-label="${c.flash?'关闭':'开启'}闪光灯" aria-pressed="${c.flash}" class="iphone-flash ${c.flash?'selected':''}"><span>ϟ</span>${c.flash?'':'<i></i>'}</button><button data-a="iphone-camera-tools" aria-label="曝光与构图设置" aria-expanded="${!!R.cameraTools}" class="iphone-chevron ${R.cameraTools?'open':''}"><i></i></button><button data-a="iphone-camera-grid" aria-label="${c.grid?'关闭':'开启'}网格" aria-pressed="${c.grid}" class="iphone-grid-button ${c.grid?'selected':''}"><i></i></button></div><div class="iphone-camera-space"></div><div class="iphone-viewfinder ${c.grid?'show-grid':''}" data-lens="${c.lens}"><img id="homecam-preview" src="${asset(returnedPreviewFile())}" alt="${c.lens==='front'?'前置自拍':'后置镜头'}取景画面" style="transform:scale(${crop(settings())});filter:brightness(${brightness(c)})"><div class="iphone-grid" aria-hidden="true"></div><button class="iphone-focus-surface" data-a="iphone-camera-focus" aria-label="轻点画面对焦"></button><div class="iphone-focus-mark" hidden><span>☀</span></div><div class="homecam-shutter-flash" hidden></div><div class="iphone-zoom-presets" aria-label="镜头变焦">${[.5,1,2].map(n=>`<button data-a="iphone-camera-zoom" data-zoom="${n}" aria-label="${n}倍变焦" aria-pressed="${Math.abs(z-n)<.01}" class="${Math.abs(z-n)<.01?'selected':''}">${n===.5?'.5':n}<small>×</small></button>`).join('')}</div></div><div class="iphone-camera-bottom"><div class="iphone-zoom-continuous"><span>.5</span><input type="range" min=".5" max="5" step=".1" value="${z}" aria-label="连续变焦" data-iphone-range="zoom"><output data-iphone-zoom>${zoomText(z)}×</output></div><div class="iphone-exposure ${R.cameraTools?'visible':''}"><label><span>☀</span><input type="range" min="-2" max="2" step=".1" value="${c.exposure}" aria-label="曝光补偿" data-iphone-range="exposure"><output data-iphone-exposure>${c.exposure>0?'+':''}${c.exposure.toFixed(1)}</output></label></div><div class="iphone-camera-mode"><span>照片</span></div><div class="iphone-camera-controls"><button class="iphone-camera-album" data-a="returned-camera-album" ${latest?`data-id="${latest.id}"`:''} aria-label="查看最近照片">${latest?`<img src="${asset(latest.id)}" alt="最近拍摄的照片">`:'<span class="iphone-empty-album"></span>'}</button><button class="iphone-shutter" data-a="returned-camera-shoot" aria-label="拍照" ><span></span></button><button class="iphone-camera-switch" data-a="iphone-camera-switch" aria-label="切换到${c.lens==='rear'?'前置':'后置'}镜头"><span class="iphone-switch-arrows">↻</span><i></i></button></div></div></div>`;
 };
 function refresh(){
  const c=state(),z=c.zoom[c.lens],im=document.querySelector('#homecam-preview');if(im){im.style.transform=`scale(${crop(settings())})`;im.style.filter=`brightness(${brightness(c)})`}
  const out=document.querySelector('[data-iphone-zoom]');if(out)out.textContent=zoomText(z)+'×';const range=document.querySelector('[data-iphone-range="zoom"]');if(range)range.value=z;
  const exp=document.querySelector('[data-iphone-exposure]');if(exp)exp.textContent=(c.exposure>0?'+':'')+c.exposure.toFixed(1);
  document.querySelectorAll('[data-a="iphone-camera-zoom"]').forEach(b=>{const selected=Math.abs(Number(b.dataset.zoom)-z)<.01;b.classList.toggle('selected',selected);b.setAttribute('aria-pressed',selected)});
 }
 document.addEventListener('input',e=>{const kind=e.target.dataset.iphoneRange;if(!kind||R.app!=='homecamera')return;const c=state();if(kind==='zoom')c.zoom[c.lens]=clamp(e.target.value,.5,5,1);else c.exposure=clamp(e.target.value,-2,2,0);refresh();persist()},true);
 document.addEventListener('click',e=>{
  const b=e.target.closest('[data-a^="iphone-camera-"]');if(!b||R.app!=='homecamera')return;e.preventDefault();e.stopImmediatePropagation();const c=state(),a=b.dataset.a;
  if(a==='iphone-camera-switch'){cancel();c.lens=c.lens==='rear'?'front':'rear';render()}
  else if(a==='iphone-camera-zoom'){c.zoom[c.lens]=Number(b.dataset.zoom);refresh();persist()}
  else if(a==='iphone-camera-flash'){c.flash=!c.flash;render()}
  else if(a==='iphone-camera-grid'){c.grid=!c.grid;render()}
  else if(a==='iphone-camera-tools'){R.cameraTools=!R.cameraTools;render()}
  else if(a==='iphone-camera-focus'){
   const box=b.getBoundingClientRect(),mark=document.querySelector('.iphone-focus-mark');if(!mark)return;
   mark.style.left=clamp(e.clientX?e.clientX-box.left:box.width/2,34,box.width-34,box.width/2)+'px';mark.style.top=clamp(e.clientY?e.clientY-box.top:box.height/2,34,box.height-72,box.height/2)+'px';mark.hidden=false;clearTimeout(focusTimer);focusTimer=setTimeout(()=>{if(mark.isConnected)mark.hidden=true},1600);
  }
 },true);
 document.addEventListener('visibilitychange',()=>{if(document.hidden)cancel()});window.addEventListener('pagehide',cancel);
 function photoId(img){
  const native=img.closest('.native-photo');if(native)return native.dataset.photo;
  const control=img.closest('[data-id]');if(control&&/^homecam_\d+$/.test(control.dataset.id))return control.dataset.id;
  const chosen=img.closest('.dy-editor-photos>div')?.querySelector('[data-a="dy-remove-photo"]');if(chosen)return chosen.dataset.id;
  const post=img.closest('[data-post]');if(post&&typeof dyPost==='function'){const p=dyPost(post.dataset.post),ix=post.classList.contains('dy-full-image')?Number(R.index)||0:Number(post.dataset.index)||0;return p?.photos[ix]}
  return img.closest('[data-photo]')?.dataset.photo;
 }
 function layout(frame){
  const info=frames.get(frame);if(!info||!info.img.naturalWidth)return;const {img,meta,contain}=info;
  let w=frame.clientWidth,h=frame.clientHeight;if(!w||!h)return;
  // A saved photo has the same 3:4 image bounds at every presentation size.
  const ratio=clamp(meta.aspect,.5,2,3/4),fit=contain?Math.min(w/ratio,h):Math.max(w/ratio,h),pw=fit*ratio,ph=fit;
  const scale=Math.max(pw/img.naturalWidth,ph/img.naturalHeight)*crop(meta),iw=img.naturalWidth*scale,ih=img.naturalHeight*scale;
  Object.assign(img.style,{width:iw+'px',height:ih+'px',left:(w-iw)/2+'px',top:(h-ih)/2+'px',filter:`brightness(${brightness(meta)})`,clipPath:contain?`inset(${Math.max(0,(ih-ph)/2)}px ${Math.max(0,(iw-pw)/2)}px)`:'none'});
 }
 const resize=new ResizeObserver(items=>items.forEach(x=>layout(x.target)));
 function decorate(){
  for(const frame of observed)if(!frame.isConnected){resize.unobserve(frame);observed.delete(frame)}
  for(const img of document.querySelectorAll('img:not(.iphone-saved-image):not(#homecam-preview)')){
   const id=photoId(img),meta=D.photos[id]?.camera;if(!meta)continue;
   const contain=!!img.closest('.photo-stage,.dy-full-image'),frame=document.createElement('span');frame.className='iphone-saved-frame';frame.dataset.photo=id;frame.style.setProperty('--camera-aspect',meta.aspect||.75);
   img.classList.add('iphone-saved-image');img.before(frame);frame.append(img);frames.set(frame,{img,meta,contain});observed.add(frame);resize.observe(frame);img.addEventListener('load',()=>layout(frame),{once:true});layout(frame);
  }
 }
 new MutationObserver(decorate).observe(document.body,{childList:true,subtree:true});syncAfterReturn();decorate();
 window.iphoneCameraState=()=>({app:R.app,...settings(),saving:!!returnedCaptureJob});
})();
