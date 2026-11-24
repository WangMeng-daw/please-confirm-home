/* Recognition is a player's explicit conclusion; reading alone never reveals it.
 * SMS belongs to the father's cellular inbox, independently of either WeChat. */
const DAUGHTER_RECOGNITION_SMS='你真的记得我原来的样子吗？';
const DAUGHTER_RECOGNITION_SMS_ID='daughter-original-face-v1';
let recognitionTickOwner=null;
function syncDaughterRecognition(){
 S.daughterRecognition??={version:1,recognizedAt:null,source:null,smsStatus:null};
 const r=S.daughterRecognition;r.version=1;
 S.sms??={version:1,threads:{},pending:null,drafts:{},serial:0};
 const sms=S.sms;sms.version=1;sms.threads??={};sms.drafts??={};sms.serial??=0;
 sms.threads.daughter??={messages:[]};sms.threads.daughter.messages??=[];
 // A loaded completed game must never acquire a new scare. Already delivered
 // texts remain ordinary saved messages, including after a successful rescue.
 const delivered=sms.threads.daughter.messages.find(m=>m.id===DAUGHTER_RECOGNITION_SMS_ID&&m.direction==='in');
 if(delivered){r.smsStatus='delivered';sms.pending=null;}
 else if(S.flags.done&&sms.pending){sms.pending=null;r.smsStatus='suppressed';}
 return r;
}
function recognitionActive(){return Boolean(S.daughterRecognition?.recognizedAt&&S.flags.found&&!['rescued','sealed'].includes(S.flags.done));}
function recognitionReason(id,text){
 if(!['daughter','wife','police','friend','club'].includes(id))return null;
 const t=String(text||'').normalize('NFKC').replace(/[“「『"][^”」』"]*[”」』"]/g,'').replace(/\s/g,'');
 if(!t||/(如果|假如|假设|万一|倘若|要是|比如|举个例子|我没说|我没有说|没觉得|没有觉得|不认为|不觉得|不能说|不能确定|不确定|还没确定|不是说|不是不|不要说|别说|不要怀疑|别怀疑|并非|哪里|哪儿|有什么|有没有|会不会|是不是|能不能|是否)/.test(t)||/(不能|不要|别|不该|不应该|不应)(?:再)?(?:说|觉得|认为|怀疑)|(?:没有|没)(?:证据|理由)(?:说|认为|证明)/.test(t))return null;
 const subject='(?:你|她|这个人|这个孩子|眼前的孩子|眼前的人|家里(?:的)?(?:这个|那个|孩子)|回来的(?:这个|那个|孩子|人|女孩))';
 const identity=new RegExp(subject+'(?:根本就|根本|绝对|明明|肯定|压根|就|真的|也)?(?:不是|并不是|不再是)(?:原来(?:的)?|真正(?:的)?|以前(?:的)?)?(?:林小禾|(?:我的|我们的)?小禾|她|(?:我|我的|我们的)?女儿|我的孩子)');
 const impostor=new RegExp(subject+'(?:根本就|根本|明明|肯定|就|只|不过|真的)?是(?:个|一个)?(?:假(?:的|冒的|扮的)(?:小禾|女儿)?|替身|冒牌货|冒充(?:的)?(?:小禾|女儿))');
 if((identity.test(t)||impostor.test(t))&&!/(?:吗|吧|对吧)[?？。.!！]*$/.test(t))return 'identity';
 if(new RegExp('(?:'+subject+'|小禾|女儿)(?:的(?:脸|笑容|表情|眼睛|样子|动作|习惯))?(?:很|明显|真的|看着|有点|太)?(?:不正常|不对劲)').test(t)&&!/(?:吗|吧)[?？。.!！]*$/.test(t))return 'explicit-anomaly';
 // Comparing a remembered habit requires an actual contrast, not a birthday
 // question, the word "whale", or a request to find an old photograph.
 const familySubject=id==='daughter'||/小禾|女儿|她|回来(?:的|后)/.test(t);
 const habit=/左手|右手|拿勺|拿笔|习惯|兔子|鲸鱼|笑|睡觉|怕黑|生日|蓝线|白线/.test(t);
 const unchanged=/(现在|回来后|今天).{0,5}(也|还是|仍然|依然).{0,6}(不喜欢|不爱|不会|一样|喜欢|怕)/.test(t);
 const contrast=!unchanged&&/(以前|原来|从前|本来|生日那天)/.test(t)&&/(现在|回来|刚才|今天|却|可是|但是|可她|但她)/.test(t)&&(/(不喜欢|不爱|不会|不是|不怕|不一样|对不上|不对劲|变了|反了|明明|不记得|说错)/.test(t)||/左手/.test(t)&&/右手/.test(t));
 if(familySubject&&habit&&contrast&&!/(?:有没有|会不会|记得吗|是什么)/.test(t))return 'private-memory';
 const seen=new Set(S.photoSeen||[]),paired=[['before','returned'],['past_breakfast','home_dinner'],['past_drawing','home_drawing'],['past_rabbit','home_rabbit'],['past_sleep','home_sleep']].some(pair=>pair.every(key=>seen.has(key)));
 const mimic=/(?:你|她)(?:就|只|一直|正在|开始)?(?:在|会)(?:照着照片|照照片|照抄|模仿)|(?:你|她)(?:只|就)?是照着(?:以前的)?照片/.test(t)&&!/不是在|没有在|没在|不在|会不会|能不能/.test(t);
 const wrong=/(不对劲|不对|不一样|不一致|对不上|不像以前|不像原来|变了|反了)/.test(t);
 if(familySubject&&paired&&(mimic||wrong&&/笑|表情|眼睛|眼神|脸|动作|习惯|左手|右手/.test(t)))return 'photo-comparison';
 const r=S.afterReturn,cameraSeen=(r?.captures||[]).some(c=>c.anomaly&&(r.seen||[]).includes(c.id));
 const cameraContrast=wrong&&/预览|抓拍|镜头|倒影|镜子|镜中|拍出来/.test(t)||/(预览|镜头|屏幕).{0,16}笑.{0,16}(照片|抓拍|拍出来).{0,12}(没|不)|(?:照片|自拍).{0,12}(多出|多了).{0,6}(你|她|小禾|脸)|床上.{0,8}(没|空).{0,18}门(?:边|口|框).{0,8}(她|你|脸)/.test(t);
 if(familySubject&&cameraSeen&&cameraContrast)return 'camera-comparison';
 if(id==='daughter'&&S.clueStory?.known?.['dp-cloud-letter']&&/最后一针|尾巴下面|白线|真正的小禾/.test(t)&&/你.{0,12}(不知道|不记得|说错|不会)|你连.{0,15}(都不知道|都不记得)/.test(t))return 'private-memory';
 return null;
}
function recognitionObserve(id,text){
 if(!S.flags.found||S.flags.done||S.daughterRecognition?.recognizedAt||(typeof dpActive==='function'&&dpActive()))return false;
 const reason=recognitionReason(id,text);if(!reason)return false;
 const r=syncDaughterRecognition();r.recognizedAt=phoneTimestamp();r.source=reason;r.smsStatus='pending';
 S.sms.pending={id:DAUGHTER_RECOGNITION_SMS_ID,due:Date.now()+12000};
 persist();
 // Run after the current conversation handler, never from a render/persist hook.
 // Capturing the state makes reset/import invalidate an already queued refresh.
 const owner=S;queueMicrotask(()=>{if(S!==owner)return;render();if(photo&&typeof showPhoto==='function')showPhoto();});
 return true;
}
function smsMessages(){return S.sms?.threads?.daughter?.messages||[];}
function smsUnreadTotal(){return smsMessages().filter(m=>m.direction==='in'&&!m.readAt).length;}
function smsName(){return (typeof nativeContactData==='function'&&nativeContactData('daughter')?.name)||D.people.daughter?.name||'小禾';}
function smsIcon(){return rasterAppIcon('sms');}
function smsStamp(value,short=false){const m=String(value||'').match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}:\d{2})/);return m?(short&&String(value).slice(0,10)===phoneTimestamp().slice(0,10)?m[4]:`${Number(m[2])}月${Number(m[3])}日 ${m[4]}`):'';}
function smsNotification(n,locked=false){return `<button class="${locked?'':'notification-row '}sms-notification" data-a="sms-open" data-id="daughter"><span class="sms-notice-icon">${smsIcon()}</span><span><small>短信${locked?'':' · '+E(smsStamp(n.receivedAt,true))}</small><strong>${E(smsName())}</strong><p>${E(n.text)}</p></span></button>`;}
function smsRead(){if(typeof dpActive==='function'&&dpActive())return;const at=phoneTimestamp();for(const m of smsMessages())if(m.direction==='in'&&!m.readAt)m.readAt=at;S.notifications=S.notifications.filter(n=>n.channel!=='sms');}
function smsListUI(){
 const messages=smsMessages(),last=messages.at(-1),unread=smsUnreadTotal();
 return appHeader('短信',{root:true})+`<div class="scroll sms-list"><h1>短信</h1>${last?`<button class="sms-thread-row" data-a="sms-open" data-id="daughter"><span class="sms-read-dot ${unread?'unread':''}"></span><span class="sms-person">${E(smsName().slice(-1))}</span><span class="sms-thread-preview"><strong>${E(smsName())}</strong><time>${E(smsStamp(last.receivedAt||last.sentAt,true))}</time><p>${E(last.text)}</p></span><span class="sms-chevron">›</span></button>`:'<div class="native-empty">没有短信</div>'}</div>`;
}
function smsThreadUI(){
 smsRead();
 return appHeader(smsName())+`<div class="scroll sms-thread" id="sms-body"><p class="sms-channel-label">短信</p>${smsMessages().map(m=>`<div class="sms-stamp">${E(smsStamp(m.receivedAt||m.sentAt))}</div><div class="sms-message ${m.direction==='out'?'out':'in'}"><p>${E(m.text)}</p></div>`).join('')}</div><form class="sms-composer" data-form="sms-send"><input id="sms-input" name="text" aria-label="短信内容" placeholder="短信" maxlength="800" autocomplete="off" value="${E(S.sms?.drafts?.daughter||'')}"><button type="submit" aria-label="发送短信">↑</button></form>`;
}
function smsOpen(){if(typeof dpActive==='function'&&dpActive())dpSwitch('father');S.started=true;go('smsthread',{id:'daughter'});}
function smsSend(text){
 const t=String(text||'').trim();if(!t||typeof dpActive==='function'&&dpActive())return false;
 if(S.airplane){dialog('短信未发送','请关闭飞行模式后重试。');return false;}
 syncDaughterRecognition();smsMessages().push({id:'sms-out-'+(++S.sms.serial),direction:'out',text:t.slice(0,800),sentAt:phoneTimestamp()});S.sms.drafts.daughter='';persist();render();return true;
}
function recognitionNpcFacts(id){return id==='daughter'&&smsMessages().some(m=>m.id===DAUGHTER_RECOGNITION_SMS_ID&&m.direction==='in')?['你已通过父亲手机的短信发出：“'+DAUGHTER_RECOGNITION_SMS+'”你只知道自己发了这句，不知道他是否读到。未在此微信聊天分享的照片变化、另一部手机的相册和内容都不能读取。']:[];}
function recognitionTick(){
 const r=syncDaughterRecognition(),pending=S.sms.pending,now=Date.now();
 if(recognitionTickOwner!==S){recognitionTickOwner=S;if(pending)pending.due=Math.max(Number(pending.due)||0,now+12000);}
 if(!pending||!r.recognizedAt||S.flags.done||S.airplane||document.hidden||document.body.classList.contains('launch-page')||now<pending.due)return;
 // Finish the player's direct exchange first. A new channel still shares the
 // phone's attention budget, but does not wait behind the entire story queue.
 if(typeof npcJobs!=='undefined'&&[...npcJobs.values()].some(job=>job.state===S)||(S.pending||[]).some(m=>m.extra?.npcResponse)||document.activeElement?.matches('#message-input,#sms-input')&&document.activeElement.value.trim())return;
 const last=S.wechat?.delivery?.last;if(last&&now-last.at<12000)return;
 if(document.querySelector('#notification')?.children.length)return;
 const receivedAt=phoneTimestamp(),open=!(typeof dpActive==='function'&&dpActive())&&R.app==='smsthread'&&R.id==='daughter';
 const message={id:DAUGHTER_RECOGNITION_SMS_ID,direction:'in',text:DAUGHTER_RECOGNITION_SMS,receivedAt,readAt:open?receivedAt:null};
 smsMessages().push(message);S.sms.pending=null;r.smsStatus='delivered';
 S.npcRevision??={};S.npcRevision.daughter=(S.npcRevision.daughter||0)+1;
 const notice={channel:'sms',id:'daughter',threadId:'daughter',messageId:message.id,text:message.text,time:smsStamp(receivedAt,true),receivedAt};
 if(!open){S.notifications.unshift(notice);S.notifications=S.notifications.slice(0,20);}
 // Leave a full reading pause before the next authored WeChat delivery.
 S.wechat??={};S.wechat.delivery??={};S.wechat.delivery.last={id:'sms:daughter',text:message.text,extra:{channel:'sms'},at:now};
 for(const queued of S.pending||[])queued.due=Math.max(queued.due,now+22000);
 persist();if(typeof schedule==='function')schedule();
 if(typeof dpActive==='function'&&dpActive()){dpAfterRender();return;}
 if(['sms','smsthread','home','lock'].includes(R.app))render();
 if(!open){clearTimeout(noticeTimer);const target=document.querySelector('#notification');if(target){target.innerHTML=`<button class="toast sms-toast" data-a="sms-open" data-id="daughter"><span class="sms-notice-icon">${smsIcon()}</span><span><strong>短信 · ${E(smsName())}</strong><p>${E(message.text)}</p></span></button>`;noticeTimer=setTimeout(()=>{if(target.querySelector('.sms-toast'))target.innerHTML='';},6000);}}
}
function recognitionTextState(){return {active:recognitionActive(),recognizedAt:S.daughterRecognition?.recognizedAt||null,source:S.daughterRecognition?.source||null,smsStatus:S.daughterRecognition?.smsStatus||null,smsUnread:smsUnreadTotal(),smsMessages:smsMessages().map(m=>({direction:m.direction,text:m.text,at:m.receivedAt||m.sentAt,read:Boolean(m.readAt)}))};}
function recognitionInstallStyle(){
 if(document.querySelector('#daughter-recognition-style'))return;
 const style=document.createElement('style');style.id='daughter-recognition-style';style.textContent=`
 .sms-app-symbol{display:block;width:100%;height:100%}.sms-notice-icon{display:block;width:42px;height:42px;flex:0 0 42px;border-radius:10px;overflow:hidden}.sms-notification>span:last-child{min-width:0;display:flex;flex-direction:column}.sms-notification small{color:#6e737c;font-size:11px}.sms-list{background:#fff}.sms-list h1{margin:18px 20px 12px;font-size:30px;letter-spacing:-1px}.sms-thread-row{display:flex;align-items:center;gap:10px;width:100%;padding:17px 16px 17px 9px;text-align:left;border-bottom:1px solid #e7e7eb;background:#fff}.sms-read-dot{flex:0 0 7px;width:7px;height:7px;border-radius:50%}.sms-read-dot.unread{background:#0a84ff}.sms-person{display:grid;place-items:center;flex:0 0 44px;height:44px;border-radius:50%;color:white;font-size:23px;background:#aaaeb8}.sms-thread-preview{position:relative;min-width:0;flex:1}.sms-thread-preview strong{font-size:16px}.sms-thread-preview time{float:right;color:#858992;font-size:11px;line-height:23px}.sms-thread-preview p{margin:5px 0 0;color:#777b82;font-size:14px;line-height:1.4;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}.sms-chevron{color:#b7bbc2;font-size:23px}.sms-thread{padding:10px 17px 22px;background:#fff}.sms-channel-label{text-align:center;color:#97999f;font-size:11px;margin:2px 0 16px}.sms-stamp{text-align:center;color:#858990;font-size:11px;margin:14px 0 8px;font-variant-numeric:tabular-nums}.sms-message{display:flex;margin:5px 0 12px}.sms-message p{max-width:85%;margin:0;background:#e9e9eb;color:#171719;padding:11px 14px;border-radius:18px;line-height:1.5;overflow-wrap:anywhere;font-size:16px}.sms-message.out{justify-content:flex-end}.sms-message.out p{background:#35c75a;color:white}.sms-composer{display:flex;align-items:center;gap:8px;flex-shrink:0;padding:10px 14px 16px;border-top:1px solid #eee;background:#fff}.sms-composer input{min-width:0;flex:1;border:1px solid #d5d6dc;border-radius:20px;font-size:16px;padding:9px 13px;background:white;color:#19191c}.sms-composer button{flex:0 0 32px;height:32px;border-radius:50%;background:#32c65a;color:#fff;font:600 23px/32px Arial,sans-serif}.sms-notification p{white-space:normal}.sms-toast p{line-height:1.35}
 .lock-notifications>.sms-notification>.sms-notice-icon,.toast.sms-toast>.sms-notice-icon,.notification-row.sms-notification>.sms-notice-icon{flex:0 0 42px;min-width:42px}.sms-notification>span:last-child{flex:1;text-align:left}
 `;document.head.append(style);
}
syncDaughterRecognition();recognitionInstallStyle();
setInterval(recognitionTick,1000);
