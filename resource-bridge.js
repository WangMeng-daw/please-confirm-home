/* A direct game URL also activates cached images; local-file mode stays self-contained. */
if(!window.HOME_ASSETS&&location.protocol!=='file:'&&window.isSecureContext&&'serviceWorker'in navigator){navigator.serviceWorker.register(new URL('resource-sw.js',location.href),{scope:new URL('./',location.href).pathname,updateViaCache:'none'}).catch(()=>{});}
