/* Search attribution stays text-only; QR is the bridge to the original book. */
const xhsOriginalCatalog=manualDiscoveryCatalog;
manualDiscoveryCatalog=function(){return xhsOriginalCatalog().map(row=>row.id==='book'&&!S.bookCipher?.opened&&!xhsState().scannedBook?{...row,url:null,title:'旧书摊淘到的两册手抄本，终于整理好了',platform:'小红书 · 巷子里的小满',desc:'《归亲会抄经本》的整理记录，含原件照片与字间文献库影录卡。',kind:'account'}:row);};
const xhsRenderOriginal=render;
render=function(){xhsRenderOriginal();if(R.app==='xiaohongshu'&&R.xhView==='post')xhsRestoreCarousel();};
function xhsKeepScreen(){if(R.app!=='xiaohongshu')return;const last={...R,xhScroll:$('.xh-scroll')?.scrollTop||0};xhsState().lastScreen=last;persist();}
const xhsOriginalHome=home;home=function(){xhsKeepScreen();return xhsOriginalHome();};
const xhsOriginalGo=go;go=function(app,data={}){xhsKeepScreen();if(app==='xiaohongshu'&&!Object.keys(data).length){const last=xhsState().lastScreen;if(last)data={...last};}const result=xhsOriginalGo(app,data);if(app==='xiaohongshu'&&$('.xh-scroll'))$('.xh-scroll').scrollTop=R.xhScroll||0;return result;};
const xhsTextOriginal=window.render_game_to_text;
window.render_game_to_text=function(){const data=JSON.parse(xhsTextOriginal());data.xiaohongshu={view:R.xhView||'feed',post:R.xhId||null,image:R.xhImage||0,query:R.xhQuery||'',savedImages:Object.keys(xhsState().savedImages),scannedBook:!!xhsState().scannedBook};data.wechatScan={view:R.scanView||null,url:R.app==='wxweb'?R.wxURL:null};return JSON.stringify(data);};
render();
