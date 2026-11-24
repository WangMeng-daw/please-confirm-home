/* Generated bitmap app artwork; controls keep their own native UI glyphs. */
const RASTER_APP_BRANDS={chats:'wechat',douyin:'douyin',xiaohongshu:'xiaohongshu',zhihu:'zhihu'};
const RASTER_ANDROID_APPS=new Set(['photos','browser','files','notes','settings']);
function rasterAppAsset(id,platform='ios'){
 const brand=RASTER_APP_BRANDS[id];
 return brand?'app-brand-'+brand+'-v1':'app-'+(platform==='android'&&RASTER_ANDROID_APPS.has(id)?'android':'ios')+'-'+id+'-v1';
}
function rasterAppIcon(id,platform='ios'){
 return `<img class="app-raster-image" data-icon-app="${E(id)}" data-icon-platform="${platform==='android'?'android':'ios'}" src="${E(asset(rasterAppAsset(id,platform)))}" alt="" aria-hidden="true" width="256" height="256" decoding="async" draggable="false">`;
}
function rasterCalendarCaption(){
 const date=phoneDate(),weekday=['周日','周一','周二','周三','周四','周五','周六'][date.getUTCDay()];
 return `<span class="app-calendar-caption" aria-hidden="true"><span>${weekday}</span><b>${date.getUTCDate()}</b></span>`;
}
function rasterAppArtwork(id,platform='ios'){
 return rasterAppIcon(id,platform)+(id==='calendar'?rasterCalendarCaption():'');
}
function rasterAppRowIcon(id,platform='ios'){
 return `<span class="app-row-art" data-icon-frame="${platform==='android'?'android':'ios'}" aria-hidden="true">${rasterAppArtwork(id,platform)}</span>`;
}
