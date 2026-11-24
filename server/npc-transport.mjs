import https from 'node:https';

// Use Node's HTTPS transport for the configured upstream. Some Windows networks
// accept this connection while the built-in fetch connection pool times out.
// Keep TLS verification, cancellation and response limits enabled.
export function npcFetch(url, { method='POST', headers={}, body, signal }={}) {
 return new Promise((resolve,reject)=>{
  let req;
  try {
   const target=new URL(url);
   if(target.protocol!=='https:')throw new Error('HTTPS required');
   if(signal?.aborted)throw signal.reason||new Error('Aborted');
   req=https.request(target,{method,headers,signal},res=>{
    const chunks=[];let size=0;
    res.on('data',chunk=>{
     size+=chunk.length;
     if(size>65536){res.destroy(new Error('Response too large'));return}
     chunks.push(chunk);
    });
    res.on('error',reject);
    res.on('end',()=>{
     const responseHeaders=new Headers();
     for(const [key,value] of Object.entries(res.headers))if(value!==undefined)responseHeaders.set(key,Array.isArray(value)?value.join(', '):value);
     const status=res.statusCode||502;
     resolve(new Response([204,205,304].includes(status)?null:Buffer.concat(chunks),{status,headers:responseHeaders}));
    });
   });
   req.on('error',reject);
   req.end(body);
  }catch(error){req?.destroy();reject(error)}
 });
}
