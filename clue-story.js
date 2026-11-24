/* Investigation state. Web pages hold sources; people act in the world.
 * Only authored deliveries and ordinary phone operations advance canonical events. */
function syncClueStory(){
 if(!S.clueStory||S.clueStory.version!==1){S.clueStory={version:1,known:{},events:{},contacts:{},shared:{},rescue:{},solidarity:{families:{}},succession:{memories:[]},files:[],revision:0};if(!S.flags.done){S.pending=(S.pending||[]).filter(m=>!/^cipher-|^return-(source-writeback|private-writeback|evidence-receipt)/.test(m.extra?.horrorEvent||''));if(S.puzzle){S.puzzle.offeredName=false;S.puzzle.knocks=[];S.puzzle.sealSteps=[];S.puzzle.feedCut=false;S.puzzle.off00=false;S.puzzle.off07=false;S.puzzle.privateDoor=false;S.puzzle.doorKeys=[]}if(S.cipher)S.cipher.readyRescue=S.cipher.readySeal=false;}}
 const s=S.clueStory;s.known??={};s.events??={};s.contacts??={};s.shared??={};s.rescue??={};s.solidarity??={families:{}};s.solidarity.families??={};s.succession??={memories:[]};s.succession.memories??=[];s.files??=[];s.returned??={};
 for(const[id,p]of Object.entries(CLUE_PEOPLE)){D.people[id]={...p,clueContact:true};S.history[id]??=[];s.solidarity.families[id]??={}}
 S.devices??={active:'father',phoneRecovered:false,unlocked:false,daughter:{},shared:[]};
 return s;
}
function clueState(){return syncClueStory()}
function clueRead(id,meta={}){const s=clueState();if(!s.known[id]){s.known[id]={at:typeof phoneStamp==='function'?phoneStamp():'',...meta};s.revision++}return s}
function cluePhoneRead(id,meta={}){if(!S.devices?.phoneRecovered)return;clueRead(id,meta);if(meta.shared){clueState().revision++}if(id==='dp-cloud-letter'){S.returnInvestigation.memoryVerified=true;S.returnInvestigation.sourceCorrected=true;}persist()}
function clueEvent(key,id,lines,effect=''){const s=clueState();if(S.flags.done||s.events[key])return false;s.events[key]='queued';lines.forEach((v,i)=>later(id,typeof v==='string'?v:v.text||'',{...(typeof v==='string'?{}:v),clueEvent:key,...(i===lines.length-1?{clueEffect:effect||key}: {})}));return true}
function clueOfferContact(id,source){const s=clueState();if(s.contacts[id])return;s.contacts[id]={status:'pending',greeting:source,source,createdAt:phoneStamp()};s.revision++;persist()}
function clueDelivered(id,m){if(!m.clueEvent)return;const s=clueState();if(m.clueEffect){s.events[m.clueEvent]='delivered';s.revision++;const e=m.clueEffect;
 if(e==='phone-recovered'){S.devices.phoneRecovered=true;S.devices.unlocked=true;s.rescue.phoneRecovered=true;clueEvent('phone-pin','wife',['她那四位密码，用的是头一回跟你去海边的日子。','你相册里那张，抱着鲸鱼站海边的。我记不清几号了，照片信息里有日期。'])}
 if(e==='other-family-offered')clueOfferContact('household_wang','老赵介绍：我是王建国的女儿。想和您聊聊家人回来之后的事。');
 if(e==='rescue-arrived')s.rescue.arrived=true;
 if(e==='rescue-ready')s.rescue.ready=true;
 if(e==='yeming-met'){s.solidarity.met=true;for(const [key,f] of Object.entries(CLUE_FAMILIES))clueOfferContact(key,'叶明介绍：我是'+f.subject+'的家属，家人也还没找到。')}
 if(e.startsWith('family-met:'))s.solidarity.families[e.split(':')[1]].disclosed=true;
 if(e.startsWith('family-published:')){s.solidarity.families[e.split(':')[1]].published=true;clueFamilyProgress()}
 if(e==='visitor-intro'){s.succession.visitorIntroduced=true;clueOfferContact('visitor','许老师介绍：我是小秋的姨妈。林先生，想请教您寻亲登记的事。')}
 if(e==='visitor-helped')s.succession.helped=true;
 if(e==='visitor-truth')s.succession.truthDelivered=true;
 if(e==='visitor-closed'){s.succession.familyClosed=true;clueEvent('job-offer','club',['方姨刚回信说孩子进门了。她把原来的启事撤下了。','你已经知道这份工作要怎么做。沈闻空出的夜班，我留给你。',{type:'link',text:'归家互助 · 夜间回访账号',url:BASE+'/volunteer/onboard'}])}
 if(e==='visitor-warned'){s.succession.warned=true;s.succession.familyClosed=false}
 if(e.startsWith('ending:'))clueFinish(e.split(':')[1]);
 }
}
function clueFamilyProgress(){const s=clueState();if(Object.keys(CLUE_FAMILIES).every(id=>s.solidarity.families[id].published))clueEvent('families-returned','yeming',['六家的信收齐了。我看了新发的启事，用的都是失踪前的照片。','旧院的保管人联系上了。沈闻最后留给孩子那封信，你找着了吗？我想看看，他可能记过房间在哪儿。'])}
function cluePublishedCount(){return Object.keys(CLUE_FAMILIES).filter(id=>clueState().solidarity.families[id].published).length}
function clueTimeJump(minutes){if(!minutes||S.flags.done)return;const d=new Date(phoneDate().getTime()+minutes*60000);S.day=d.getUTCDate();S.storyClock=d.toISOString().slice(11,16);const p=syncPhoneRuntime();p.at=d.getTime();p.base=S.day+'|'+storyBaseTime();if(typeof storyTimeFinish==='function')storyTimeFinish(false);storyTimeCut={owner:S,from:S.day,to:S.day,label:minutes===25?'二十五分钟后':'一个半小时后',dateText:phoneStamp()};queueMicrotask(storyTimePresent)}
function clueFinish(type){if(S.flags.done)return;const s=clueState();if(type==='rescued'&&!s.rescue.ready||type==='sealed'&&!(s.solidarity.operation&&typeof redemptionReady==='function'&&redemptionReady())||type==='converted'&&!s.succession.onboard)return;
 if(type==='sealed'&&typeof redemptionState==='function')redemptionState().completed=true;if(typeof npcCancel==='function')npcCancel();if(typeof dreadCancel==='function')dreadCancel();S.pending=[];clearTimeout(pendingTimer);S.flags.done=type;S.flags.hollowWifeSheltered=false;S.day=25;S.storyClock=type==='converted'?'00:07':'06:11';s.ending=type;s.revision++;
 const after={rescued:{old:['爸，我出来了。周警官在旁边，妈妈把衣服给我披上了。'],wife:['小禾在我怀里，一直哭，问我是不是把鲸鱼扔了。我说没有，家里什么都给她留着。屋里那张脸已经不在了。']},sealed:{old:['爸，我出来了。他们说其他人也找到家里人了。'],wife:['小禾在我身边。六家的亲人和小秋也被接回来了，我先陪她检查。'],guardian:['八个人都平安了。食名母退回了神龛，这次没能再把人留下。'],visitor:['小秋已经获救了，我在医院陪她。是她，一直叫我姨。谢谢你没让我关掉那个账号。'],yeming:['六家都见到亲人了，小秋也在。沈闻没能回来，警官已经去通知他的家人。']},converted:{wife:['原来的账号不再响了。她在屋里学着你的声音，问下一户来了没有。']}}[type]||{};
 if(type==='sealed')Object.assign(after,{
  household_wang:['我爸救出来了，我在医院陪他。真是谢谢你，陪我们找了这么久。'],
  household_zhou:['我妈找到了。我在医院陪着，这回是她。谢谢你。'],
  household_zhao:['明明救出来了！我在医院陪他，谢谢你一直帮我们找。'],
  household_liu:['若宁救出来了，我在医院陪着她。谢谢你，没有劝我就这么算了。'],
  household_sun:['我爸救出来了，人在医院，我陪着。多亏你帮我们往下找。'],
  household_he:['小安救出来了。我在医院陪他。谢谢你，真的。']
 });
 for(const [who,lines] of Object.entries(after))lines.forEach(text=>later(who,text,{clueEvent:'epilogue-'+type+'-'+who,clueEffect:'ending:'+type}));persist();if(typeof dpSwitch==='function'&&S.devices.active==='daughter')dpSwitch('father');browse(BASE+'/ending');
}
function clueAfterRender(){const s=clueState();
 if(S.flags.found&&!S.flags.done&&(S.history.wife||[]).some(m=>m.type==='image'&&m.photo==='returned')){
  // One investigation opens the next. Reopening an old save preserves delivered facts.
  if(s.returned.version!==2){
   for(const key of ['return-voices','return-care','return-other-family'])if(s.events[key]==='queued'&&!S.history[{'return-voices':'old','return-care':'club','return-other-family':'friend'}[key]].some(m=>m.clueEvent===key)){
    S.pending=S.pending.filter(m=>m.extra?.clueEvent!==key);delete s.events[key];
   }
   s.returned.version=2;
  }
  const observed=s.known['return-anomaly']||S.flags.memory||S.puzzle.adminFate;
  if(observed&&!s.events['return-care'])clueEvent('return-care','club',['您说她不记得以前的事，可以在生活回访里写一件具体的。我转给陪伴老师看看。',{type:'link',text:'归家后的生活回访',url:BASE+'/family/care'}]);
  if((s.events['care-outcome-1']==='delivered'||S.flags.memory||s.known['admin-fate'])&&!s.events['return-voices']){
   s.contacts.old={status:'accepted'};
   clueEvent('return-voices','old',['爸，我没回去。我这里还是那扇高窗。','以前手机里的照片，你别删。沈叔叔说，要是他的账号也劝你别找了，就看他以前发的东西。他在网上叫阿闻修字。','屋里这台旧电脑还能打字。没有摄像头。爸，要是一会儿又断了，你等我一下。']);
  }
  if(s.known['dp-cloud-letter']&&!s.events['return-other-family'])clueEvent('return-other-family','friend',['老林，我问到一位家属，她爸也是这平台送回来的。她说不对劲，家里那个人只会重复表上填过的习惯。','她姓王，我跟她说过你家的事了。她愿意聊，微信我推给你。'],'other-family-offered');
 }
 if(typeof dpAfterRender==='function')dpAfterRender();
}

function clueNpcAllowed(id){const s=clueState();if(S.devices?.active==='daughter')return false;if(id==='daughter')return !!S.flags.found&&!['rescued','sealed'].includes(S.flags.done);if(id==='old')return !!s.contacts.old&&!s.succession.onboard;if(id==='mother')return !!s.known['mother-page'];if(id==='guardian')return !!s.known['lamp-principle'];if(CLUE_PEOPLE[id])return s.contacts[id]?.status==='accepted';return true}
function clueKnowledgeKey(id){const s=clueState();return JSON.stringify([s.shared[id]||[],s.contacts[id]?.status,S.flags.done||'',S.npcRevision?.[id]||0])}

function clueNpcFacts(id){
 const s=clueState(),facts=[];
 // A role's own experiences are not a broadcast of the father's reading history.
 if(id==='visitor')facts.push('你是方姨，寻找外甥女小秋。对面是经许老师介绍的林先生，尚未成为平台负责人。你只知道本线程里已经说到的登记、照片和回访，不知道他的家庭、旧院内处或神明。');
 if(id==='yeming')facts.push('你是叶明，2019年真实公益站志愿者、守灯旧支资料整理人。你能联系旧院保管人，不是神明。只据对方实际分享的原件和已送达的六家回信行动，未发生的现场结果不能提前说。');
 if(id==='police')facts.push('小禾原来的手机8月13日在校门附近找到，仍由警方封存。这不等于已经找到她后来使用的设备。另一部设备的线索与交接，只按本线程实际收到和发出的消息说明。');
 if(CLUE_FAMILIES[id]){const f=CLUE_FAMILIES[id];facts.push('你是'+f.relative+'，寻找'+f.subject+'，登记'+f.case+'。只知道自己家的经历，不知道其他五家的往事。','你本人遇到的异常：'+f.story+'你犹豫的原因：'+f.fear,'你真实记得的家事：'+f.memory);}
 // Keep each excerpt below the API's 300-character bound, with attribution on
 // every chunk. Reading or Local transfer of a file alone does not share it to a NPC.
 for(const key of s.shared[id]||[]){
  const file=clueFileData(key);if(!file)continue;
  const title=String(file.title||'文件').slice(0,64),body=String(file.body||file.description||'仅有图像，未提供额外解读。');
  const prefix='林砚实际在本段聊天发给你的文件《'+title+'》原文摘录：';
  const chunks=body.split(/\n+/).map(t=>t.trim()).filter(Boolean),size=Math.max(80,260-prefix.length);
  let buffer='';const emit=()=>{if(buffer){facts.push(prefix+buffer);buffer='';}};
  for(const paragraph of chunks){if(buffer&&buffer.length+paragraph.length+1>size)emit();if(paragraph.length>size){emit();for(let i=0;i<paragraph.length;i+=size)facts.push(prefix+paragraph.slice(i,i+size));}else buffer+=(buffer?'\n':'')+paragraph;}emit();
 }
 if(id==='old'){
  const recovered=['rescued','sealed'].includes(S.flags.done)&&(S.history.old||[]).some(m=>m.clueEffect==='ending:'+S.flags.done);
  if(recovered)facts.push('本线程已经实际收到你获救后的消息：你是真正的小禾，已经被接回，目前由医护检查、家人在身旁。仍在院里、依靠旧站文字终端回应是获救以前的处境，已经改变；现在不能再说被关在内处、没有出来或继续求救。只能回应已送达的获救事实，不补诊断或新事件。');
  else facts.push('你是真正的小禾。沈闻8月20日借了你一部无SIM备用机，恢复了旧聊天。9月18日你把它藏进洗衣周转袋，人留在院里。如今断续联系爸爸的是旧站残留文字终端，不是那部已送出的手机。你不知道爸爸是否拿到或读过备用机，除非他在本线程告诉你。');
 }

 if(['mother','guardian'].includes(id)){
  facts.push('代归尊制造替身，食名母把失踪者的名字收进祭册。守灯君因家属坚持寻找而得到力量，但远弱于食名母。每个人留下的线索只能帮助找到他，不能推断另外六人也关在同一处。');
  if(id==='guardian')facts.push('你不能凭一句话救回七人。旧支整理人叶明保留着寻亲原件；只有各家决定不再接受替身、寄信要求继续寻人，叶明才能带着原册进堂救人。没有已送达的材料，你不知道林砚读过哪页，也不知道平台的回访私信。');
 }
 if(S.flags.done&&(S.history[id]||[]).some(m=>m.clueEffect==='ending:'+S.flags.done))facts.push('本线程已经实际收到本轮结果：'+({rescued:'林小禾已接回，六家继续寻找自己的家人',sealed:s.redemption?.completed?'林小禾、原册六位失踪者和小秋共八人已获救，食名母重新被封印；沈闻已经遇害，警方将通知其家人':'林小禾和另外六位失踪者已经获救，食名母重新被封印',converted:'林砚已接管夜班，真正的小禾还没有获救'}[S.flags.done]||''));
 return facts;
}
function clueFileData(id){if(id==='cs-register')return clueState().files.includes(id)?{id,title:'失踪人员原始名册.pdf',body:'2026年9月6日待献祭人员编号原件；2026年9月24日由名册保管人补附的失踪者留言。林小禾 QH-0417；'+Object.values(CLUE_FAMILIES).map(f=>f.subject+' '+f.case).join('；')+'。这七个人还能发来消息，家属未签署终止寻访。后印本把“委托平台寻亲”改成“确认接回的就是失踪亲属”。沈闻旁注：没有找到本人，就不能撤下寻人启事。'}:null;return (S.devices?.shared||[]).find(f=>f.id===id)||null}
function clueSharedHas(id,clue){return (clueState().shared[id]||[]).some(key=>{const f=clueFileData(key);return key===clue||f?.clueId===clue||f?.sourceId===clue})}
function clueOnSent(id,text,type,extra){const s=clueState();if(type==='file'&&clueFileData(extra.file)){s.shared[id]??=[];if(!s.shared[id].includes(extra.file))s.shared[id].push(extra.file);s.revision++;const f=clueFileData(extra.file);clueEvent('share-'+id+'-'+extra.file,id,[id==='yeming'?'收到了。我拿旧册来对着看。':id.startsWith('household_')?'收到。我先看完，再和你说。':'文件我收到了。']);if(id==='yeming'&&clueSharedHas(id,'cs-register')&&cluePublishedCount()===6)clueEvent('yeming-last-letter','yeming',['六家的回信和原册我都收到了。沈闻留在备用机里的最后那封信，还得麻烦你发一下，里面可能有他最后见到孩子的房间。'])}
}
function clueNatural(text){return String(text||'').normalize('NFKC').replace(/\s/g,'')}
function clueAffirm(text,re){const t=clueNatural(text);return re.test(t)&&!/(如果|假如|假设|是不是应该|能不能算|只是问问|不要|别再|不用|不想|不愿|拒绝|不接受|不能)(?:.{0,12})(?:撤|接受|接管|结束|去接|行动|找)/.test(t)}
function clueChoiceUncertain(text){return /如果|假如|假设|要是|万一|比如|会不会|是不是|要不要|该不该|只是问|随口问|不确定|没想好|不知道.{0,6}(?:该|怎么办)|(?:他说|她说|你说|老师说).{0,16}[？?]|[？?]|[吗么][呢呀啊。！!]*$/.test(text)}
function clueKeepSearch(text){
 const t=clueNatural(text);if(clueChoiceUncertain(t)||/(?:不要|别|不用|不必|不再|停止).{0,3}(?:继续找|接着找|找|寻)|(?:不想|不愿).{0,4}(?:继续|接着|找|寻)|(?:别|不要|不用).{0,3}(?:保留|留着)/.test(t))return false;
 return /继续找|继续寻|接着找|还得找|找下去|不能.{0,8}放弃|别放弃|不要撤|别撤|重新.*(寻|启事)|保留.*(名|启事)|(?:寻人|启事|帖子|账号).{0,8}(?:留着|先留|别删|不要删|别关|不要关|不删|不关)|(?:别删|不要删|别关|不要关|不删|不关|留着).{0,8}(?:启事|帖子|账号)|留着.{0,5}别关/.test(t);
}
function clueCloseSearch(text){
 const t=clueNatural(text);if(clueChoiceUncertain(t)||clueKeepSearch(t)||/(?:别|不要|不用|先不|不能|不该|不愿|不想|拒绝).{0,8}(?:删|撤|关|接受|接回来|接进|让.{0,8}进)|(?:没|未|不)(?:有)?(?:删|撤|关)/.test(t))return false;
 return /撤.*启事|结束.*寻|接受.*(她|孩子|门外)|先.*(接回来|让她进|认她)|(?:不用|不要|不必)再找|(?:寻人|启事|帖子).{0,8}(?:删|撤|关)|让.{0,12}(?:孩子|她|门口|门外).{0,8}进来/.test(t);
}
function clueVisitorWarning(text){
 if(clueKeepSearch(text))return true;
 if(clueChoiceUncertain(text)||/(?:不是|不一定|没说|别说|不要说).{0,4}假的|(?:别|不要).{0,4}(?:不信|怀疑)/.test(text))return false;
 return /不是.{0,6}小秋|不要相信|先别接|别让.{0,12}进来|(?:别|不要|先不).{0,4}开门|(?:门口|门外|这个|那个).{0,10}是假的/.test(text);
}
function clueRescueRequest(text,id){
 if(/别去|先不|先别|不用|不想|不愿|只是问|假如|假设|如果|要是|不确定|是不是|(?:不要|别).{0,6}(?:接|救|跑|行动|出发|过去)/.test(text))return false;
 const last=(S.history[id]||[]).filter(m=>!m.me&&m.text).at(-1)?.text||'';
 const confirmation=/现在过去接应吗|现在联系警方一起接人吗/.test(last)&&/^(?:好|行|可以|拜托|麻烦|去吧|请|快)/.test(text);
 return confirmation||/(?:去|过去|过来).{0,5}(?:接|救|查|看)|带人.{0,6}(?:去|来)|(?:请|麻烦|赶紧|尽快|快|拜托).{0,12}(?:接应|救人|行动|出发|跑一趟|去一趟|过去一趟)|(?:赶紧|快|尽快).{0,3}(?:去吧|过去吧)|(?:联系|找).{0,8}(?:警方|警官|警察)|(?:把|帮).{0,12}(?:带出来|接出来|救出来)|(?:开始|准备|采取).{0,3}行动/.test(text);
}
function clueChildWindowRequest(text){
 const questionRequest=/(?:能不能|可不可以|能否|可以|能)(?:先|现在|慢慢)?(?:去|到|靠|往).{0,12}窗(?:边|旁|前)|(?:去|到|靠|往).{0,12}窗(?:边|旁|前).{0,10}(?:好吗|行吗|可以吗)/.test(text);
 if(/如果|假如|要是|是不是|可能|好像|大概|也许|不确定|不知道|窗(?:边|旁|前).{0,3}(?:了吗|了没|没有)|(?:不要|别|先不|不用).{0,4}(?:去|靠|过|出|动)|别信|不可信/.test(text)||!questionRequest&&/[？?]|(?:吗|么)[。！!]*$/.test(text))return false;
 return /(?:去|到|靠|走|往).{0,12}窗(?:边|旁|前)|(?:警官|周叔叔).{0,10}(?:来接你|接你)|(?:警官|周叔叔).{0,10}(?:外面|外头).{0,12}(?:爸爸|爸).{0,5}(?:找|请)/.test(text);
}
function clueChildReadyMessage(text){
 const questionRequest=/(?:能不能|可不可以|能否|可以|能)(?:现在|先|帮忙)?(?:把.{0,5})?(?:接|救|带).{0,8}(?:她|孩子|小禾|出来)|(?:麻烦|拜托).{0,10}(?:接|救|带).{0,8}(?:她|孩子|小禾|出来)/.test(text);
 if(/如果|假如|要是|是不是|可能|好像|大概|也许|不确定|不知道|还没|没到|没有|(?:接到|见到|看到).{0,6}(?:了吗|了没)|(?:不要|别|先不|不用).{0,6}(?:接|救|进|去|过)/.test(text)||!questionRequest&&/[？?]|(?:吗|么)[。！!]*$/.test(text))return false;
 return /(?:她|小禾).{0,10}(?:回我|回了|到了|过去了|已.{0,4}(?:去|到|过|在)|正往|正在)|(?:接|救|带).{0,8}(?:她|孩子|小禾|出来)|(?:麻烦|请|快|赶紧).{0,10}(?:接|救|进去)/.test(text);
}
function clueLocationReady(){const k=clueState().known;return ['dp-cloud-letter','oldyard-numbering','oldyard-access','laundry-route'].every(id=>k[id])}
function clueLocationMessage(id,text){
 const s=clueState();s.locationMessages??={};const location=s.locationMessages[id]??={};let touched=false;
 const normalized=clueNatural(text).replace(/二[〇零]三|二百[〇零]?三|两百[〇零]?三/g,'203').replace(/二一七|二百一十七/g,'217').replace(/([东西南北])(?:边|侧)(?:的|那)?(?:一)?(?:栋)?楼/g,'$1楼').replace(/卸货/g,'装卸');
 for(const clause of normalized.split(/[，,。；;！!]/)){
  if(/如果|假如|假设|可能|好像|大概|是不是|不确定|[?？]/.test(clause))continue;
  const building=clause.match(/([东西南北])楼/),room=/(?:楼|室|房|号)/.test(clause)||/^(?:是)?\d{3}$/.test(clause)?clause.match(/(?<!\d)(\d{3})(?!\d)/):null,entry=clause.match(/([东西南北])(?:侧|边|面)?(?:的)?(?:那|这)?(?:个|扇)?(?:装卸)?(?:的)?门/);
  const deny=/不是|不在|有误|不对/.test(clause);
  if(building){location.building=deny?'':building[1];touched=true}
  if(room){location.room=deny?'':room[1];touched=true}
  if(entry){location.entry=deny?'':entry[1];touched=true}
 }
 return {touched,complete:location.building==='东'&&location.room==='203'&&location.entry==='北',location};
}
function clueConversation(id,text){const s=clueState(),t=clueNatural(text);if(!S.flags.found||S.flags.done)return false;
 if(['wife','daughter'].includes(id)&&/照片|表情|笑|兔子|鲸鱼|不对|奇怪|记得|回访/.test(t))clueRead('return-anomaly');
 if(id==='daughter'&&s.known['dp-cloud-letter']&&/不是|假的|真正|替|沈闻|沈叔叔|白线|里面|回来/.test(t)&&!S.flags.horrorHollowSent){S.flags.inner=true;horrorHollow();return true}
 if(id==='police'&&/XJ.?0918.?06|备用.{0,4}(手机|机)|沈闻.{0,20}(手机|机子)|(?:借给|借的|另一部).{0,12}(手机|机子)/.test(t)){
  if(!s.known['admin-communications']){replyMany(id,['校门口那部在我们这里封着。你说还有一部，是从哪儿看到的？']);return true}
  if(/(?:不要|别|先不|不用|不想).{0,12}(?:送|取|拿|交)/.test(t)){replyMany(id,['好，备用机先放我们这里。你要取时告诉我。']);return true}
  if(!S.devices.phoneRecovered){clueEvent('phone-return','police',['XJ-0918-06查到了，是西郊站清点旧院周转物时收到的备用机。校门口那部另行封存着。','沈闻借给小禾的这部，我们做过只读复制，留了副本。锁屏密码没改，你问问家里人。','我让同事送到你家楼下。拿到后先看里面存的东西，别重置账户。',{text:'同事说交到你手里了。备用机的原始副本我们留着，校门口那部也继续封存。',clueEffect:'phone-recovered'}],'phone-recovered')}else replyMany(id,['是交给你的那部备用机吧？副本我们留好了。校门口那部还在所里。']);return true;
 }
 const policeLocation=id==='police'&&clueLocationReady()?clueLocationMessage(id,t):null;
 if(id==='police'&&(/旧儿童院|东楼|203|装卸|卸货|房号|二[〇零]三/.test(t)||policeLocation?.touched||policeLocation?.complete&&clueRescueRequest(t,id))&&!s.rescue.ready){
  if(!S.devices.phoneRecovered){replyMany(id,['这个地方你从哪儿看到的？把前后情况说一下。我们这边也在走访。']);return true}
  if(!s.known['dp-cloud-letter']||!s.known['oldyard-numbering']||!s.known['oldyard-access']||!s.known['laundry-route']){replyMany(id,['这是旧房号还是现在的？孩子留下的位置、物品交接记录、现在的门牌，得对上。我联系管理人查。']);return true}
  if(!policeLocation?.complete){replyMany(id,['你分几条发都行，我记着。楼号、现在的房间号、能走的入口，三处都要说清。先别用旧门牌。']);return true}
  if(!s.rescue.dispatched&&clueRescueRequest(t,id)){s.rescue.dispatched=true;clueEvent('police-location','police',['东楼203，从北侧装卸门进。我记下了，联系保管人一起过去。','到场先看门牌和窗户，对上再进。你保持电话畅通。',{text:'我到北门了。东楼高窗下有那道裂痕，听见里面有孩子说话。你联系她原来的账号，告诉她我们在外面。',clueMinutes:25}],'rescue-arrived')}else if(s.rescue.arrived)replyMany(id,['我在北侧等着。她还不肯靠近窗边，你先跟她说说。']);else replyMany(id,['东楼203，北侧装卸门。位置记清楚了，需要我们现在过去接应吗？']);return true;
 }
 if(id==='old'&&s.rescue.arrived&&clueChildWindowRequest(t)){
  if(!s.rescue.ready)clueEvent('child-ready','old',['听见了，在窗外。平时那个声音在墙里面，这回不一样。','爸，我去那扇有裂纹的窗。你让他们等我。'],'rescue-ready');return true;
 }
 if(id==='police'&&s.rescue.ready&&/她|小禾|窗|接|听|来了/.test(t)&&!s.solidarity.operation){if(!clueChildReadyMessage(t)){replyMany(id,['我在窗下等。她那边回你了吗？你确认一下，我好接应。']);return true}clueEvent('rescue-out','police',['看见孩子了，就在高窗下。我们接着她。','她说自己叫林小禾，认得你留在手机里的消息。先让医护看看，等她缓一缓再问。','林砚，小禾在我身边。李岚已经见到她，另外六家的搜寻会继续。'],'ending:rescued');return true}
 if(id==='yeming'){
  if(s.solidarity.met&&clueLocationReady()&&clueLocationMessage(id,t).complete)s.solidarity.locationShared=true;
  if(!s.solidarity.met){clueEvent('yeming-intro',id,['2019年，我和沈闻就在这儿做志愿者。那时找到人，得先让家属和本人通话。哪有只看张照片就催人接的。','沈闻那本册子，我以前也留了一份，后来附件锁住了。你找着修改前的那版，发我看看，我好联系各家。','那几家我问过了，愿意跟你聊。有的听得进去，有的还觉得是自己多心。你听他们慢慢说。'],'yeming-met');return true}
  npcReply(id,text,[!clueSharedHas(id,'cs-register')?'先把修改前的名册发给我看看。公开页面上的团圆名单是后来改的。':cluePublishedCount()<6?'我会把各家的旧记录分别发给他们。有人还在犹豫，你可以听听他们最担心什么。':!clueSharedHas(id,'dp-cloud-letter')?'备用机里沈闻最后那封原信还没传来。我要知道他最后见到孩子的地方。':!s.solidarity.locationShared?'信上只有旧房号。你查到现在的房间和能走的入口后，发给我，我好和保管人联系。':'我在联系现场的人，等我消息。']);return true;
 }
 if(CLUE_FAMILIES[id]){const f=CLUE_FAMILIES[id],p=s.solidarity.families[id];
  if(!p.disclosed){clueEvent('family-story-'+id,id,[f.story,f.fear,f.memory],'family-met:'+id);return true}
  if(!p.published&&clueKeepSearch(t)){
   if(!clueSharedHas('yeming','cs-register')){replyMany(id,['你说的那个原册，能请保管它的人联系我吗？我想亲自问问，不能只听平台的。']);return true}
   if(!s.solidarity.met){replyMany(id,['我会继续找。你说的旧册是谁保管的？我想和保管原件的人直接联系。']);return true}
   clueEvent('family-publish-'+id,id,f.publish,'family-published:'+id);return true;
  }
  npcReply(id,text,[p.published?'寻人启事还留着。有进展我会联系你。':f.fear]);return true;
 }
 if(id==='club'&&s.succession.memories.length&&/帮|家属|方|回访|志愿|改善|正常|有效/.test(t)){clueEvent('visitor-intro','club',['方姨正在找外甥女小秋，她刚开始填登记。你经历过，可以和她聊聊。','我征求了她的同意，她会加你。先帮她看懂登记，别急着替她作决定。'],'visitor-intro');return true}
 if(id==='visitor'){
  if(!s.succession.helped){if(/照片|登记|填|帮|说|经历|你好/.test(t))clueEvent('visitor-help',id,['照片填进去了。她以前叫我阿姨，我今天也写了。','刚给我转来张照片，太像她了。可我不敢再急着认，想等等。'],'visitor-helped');return true}
  if(!s.succession.truthDelivered){clueEvent('visitor-original',id,['门外有人喊阿姨。手机也响了，是她原来的账号，说：姨，我还在里面。','表上有个字我写错了，门外那个也跟着说错。原来的账号又发消息了。','他们催我撤启事，那边又说自己没出来。林先生，我到底该信谁？'],'visitor-truth');return true}
  if(clueVisitorWarning(t)){clueEvent('visitor-warning',id,['好，启事留着。我先不开门。','我去找办案的警官，手机里这些话都留着。你也当心。'],'visitor-warned');return true}
  if(clueCloseSearch(t)&&s.known['admin-fate']&&!s.succession.warned){clueEvent('visitor-close',id,['她还说“我还在里面”呢。你也看见了。真就不找了？','你经历过，我听你的。启事我撤了，原来的留言也关了。门外那个，我让她进来了。'],'visitor-closed');return true}
  npcReply(id,text,['门外那个一直叫我，手机里也还有消息。我不知道该听谁的。']);return true;
 }
 if(id==='wife'&&S.devices?.phoneRecovered&&/备用|密码|海边/.test(t)){replyMany(id,['她设的四位密码，是第一次跟你去海边的日子。相册里那张抱鲸鱼的照片，打开信息看看，拍摄日期应该还在。']);return true}
 if(id==='old'&&clueNpcAllowed(id)){npcReply(id,text,['我给你留了字，就在沈叔叔借我的手机里。手机放进洗衣袋了，我还在这里。','这台是沈叔叔后来借我的，不是我上学带的那台。']);return true}
 return false;
}
function clueSearch(q){const s=clueState(),t=clueNatural(q),results=[];const laundry=typeof returnLogisticsSearch==='function'?returnLogisticsSearch(q):null;if(laundry)results.push(laundry);if((s.known['dp-old-wifi']||s.known['dp-cloud-letter'])&&/槐城旧儿童院|旧儿童院|YH-E2-17/.test(t))results.push({title:'槐城建设档案网 · 旧儿童院资料目录',url:'https://archive.huai.example/oldyard',desc:'历史门牌、建筑用途与维修记录公开目录。'});if(S.flags.found&&(/活要见人/.test(t))&&typeof bookCipherSolved==='function'&&bookCipherSolved('old')){results.push({title:'守灯小院 · 留存旧刊',url:'https://shoudeng.example/',desc:'旧刊、来信与资料整理人。'})}if(!results.length)return null;return `<div class="web-search-engine"><form data-form="web-global"><span>搜索</span><input aria-label="搜索网页" value="${E(q)}"><button>${ico('search')}</button></form><nav><b>全部</b><span>网页</span><span>资讯</span></nav><p class="native-label">找到 ${results.length} 条相关内容</p>${results.map(r=>`<button class="engine-result" data-a="url" data-url="${r.url}"><small>${new URL(r.url).hostname}</small><h2>${r.title}</h2><p>${r.desc}</p></button>`).join('')}</div>`}
function clueWeb(u){const logistics=typeof returnLogisticsWeb==='function'?returnLogisticsWeb(u):null;if(logistics!==null)return logistics;const s=clueState();let p;try{p=decodeURIComponent(u.pathname)}catch{return clueUnavailable()}const own=['www.guijia.example','guijia.example'].includes(u.hostname);if(u.hostname==='search.example')return clueSearch(u.searchParams.get('q')||'');if(u.hostname==='archive.huai.example')return clueOldyard(p);if(u.hostname==='shoudeng.example')return clueLampPage(p==='/contact'?'/contact':'/');if(!own)return null;
 if(p==='/ending')return puzzleEndingPage();if(p==='/receipt')return S.flags.done?puzzleEndingPage():clueUnavailable();if(p==='/family/care')return S.flags.found&&!S.flags.done?clueCarePage():clueUnavailable();if(p==='/volunteer/onboard')return clueOnboard();
 if(p==='/manage/messages'||p==='/manage/switchboard'||p==='/manage/voice'||p==='/manage/private-door')return S.flags.found&&S.puzzle.adminFate?clueCommunication():clueUnavailable();
 if(p.startsWith('/ritual/')||p==='/account/convert'||p==='/account/rite-review'||p==='/family/close-request'||p==='/family/pending')return clueUnavailable();
 if(p.startsWith('/account/')){if(!S.flags.found||!S.puzzle.adminFate||!s.known['dp-cloud-letter'])return clueUnavailable();if(p==='/account/mother')return S.inquiry.visited.shrine?clueMotherPage():clueUnavailable();if(p==='/account/cipher')return s.known['mother-page']?clueCipherPage():clueUnavailable();if(p.startsWith('/account/history'))return cultHistoryWeb(u);if(p==='/account/households')return missingPeopleWeb(u);const parts={'/account/export':'archive','/account/protocol':'protocol','/account/status':'status','/account/shrine':'shrine'},part=parts[p];if(part){const prior={protocol:'archive',status:'protocol',shrine:'status'}[part];if(prior&&!S.inquiry.visited[prior])return clueUnavailable();S.inquiry.visited[part]=true;}return innerPage(false,p)}
 return null;
}
function clueAction(a,b){const s=clueState(),id=b?.dataset?.id;
 if(a==='friend-request'&&CLUE_PEOPLE[id]){go('friendrequest',{id});return true}
 if(['pz-port','pz-key','pz-key-reset','pz-knock','pz-knock-reset','pz-seal-step','pz-vow-retract','pz-convert-final','puzzle-ending-rescue','puzzle-ending-seal','cipher-light','cipher-reset-lamps','cipher-turn-ring','cipher-give-fire','cipher-take-fire','cipher-rekindle','cipher-open-gate','cipher-close-gate','cult-peel','family-retain-final','sr-single','sr-join','sr-passage','sr-cross','sr-weave','sr-close-original','sr-desk'].includes(a))return true;
 if(a==='accept-friend'&&CLUE_PEOPLE[id]){if(s.contacts[id]?.status==='pending'){s.contacts[id].status='accepted';s.revision++;go('chat',{id});clueEvent('hello-'+id,id,[id==='yeming'?'你好。我是叶明。你是从哪份旧资料找到我的？':id==='visitor'?'林先生，我是小秋的姨妈。许老师说您可以和我聊聊。':CLUE_FAMILIES[id].story])}return true}
 if(a==='cs-god'||a==='deity-talk'){if(!clueNpcAllowed(id))return true;go('deity',{id});return true}
 if(a==='cs-register-save'){if(S.cultHistory?.negativeUnlocked&&s.six?.unlocked){if(!s.files.includes('cs-register'))s.files.push('cs-register');s.known['history-original']=true;persist();dialog('已存入文件','失踪人员原始名册.pdf')}return true}
 if(a==='document'&&clueFileData(id)||a==='cs-file'){const f=clueFileData(id);if(f){go('clue-file',{id});}return true}
 if(a==='cs-file-share'){const f=clueFileData(R.id);if(f)sheet('发送文件',visiblePeople().map(id=>`<button data-a="cs-file-send" data-id="${E(id)}" data-file="${E(f.id)}">${av(id,false)} ${E(pname(id))}</button>`).join(''));return true}
 if(a==='cs-file-send'){const f=clueFileData(b.dataset.file);if(f&&wechatIsFriend(id)){closeOverlay();sendMessage(id,f.title,'file',{file:f.id});chat(id)}return true}
 return false;
}
function clueSubmit(kind,d){if(typeof returnLogisticsSubmit==='function'&&returnLogisticsSubmit(kind,d))return true;const s=clueState();if(['pz-vow','cipher-paper','cipher-passphrase','cipher-vow','family-confirm'].includes(kind))return true;
 if(kind==='friend-search'){const q=String(d.get('query')||'').trim();if(q==='yeming_jiuzhi'&&s.known['yeming-address']){clueOfferContact('yeming','旧刊整理人叶明：收到你的联系请求，请说明来意。');go('friendrequest',{id:'yeming'});return true}return false}
 if(kind==='cs-care'){if(!S.flags.found||S.flags.done||!requirePhoneNetwork())return true;const memory=String(d.get('memory')||'').trim();if(memory.length<4)return true;if(s.succession.memories.length){s.careDraft=s.succession.memories[0];render();return true}s.succession.memories.push(memory.slice(0,160));s.revision++;clueEvent('care-'+s.succession.memories.length,'daughter',['爸爸，刚才那件事，我会说了。',memory.slice(0,160)]);clueEvent('care-outcome-'+s.succession.memories.length,'wife',['她刚才停了一下，然后突然把那件事说出来了。一字一字的，像在背。']);clueEvent('care-volunteer','club',['这次回访记好了。方姨也在找孩子，刚开始填登记，很多地方拿不准。你要是愿意帮她看看，微信跟我说一声。']);render();return true}
 if(kind==='cs-onboard'){if(!s.succession.familyClosed||!s.succession.truthDelivered||!s.known['admin-fate']||S.flags.done)return true;if(d.get('name')!=='林砚'||!/^[a-zA-Z0-9_]{4,24}$/.test(String(d.get('account')||''))||!d.get('consent')){s.notice='请填写自己的姓名，账号使用4至24位字母、数字或下划线。';render();return true}s.succession.onboard=true;s.succession.account=d.get('account');S.puzzle.feedCut=false;clueEvent('night-onboard','club',['账号开好了。你填了结束寻访，家里这份登记也结了。','方姨说要谢谢沈老师。我告诉她，今晚开始是你。']);clueEvent('night-final','daughter',['爸，原来的声音没有再来了。','下一户来的时候，你也会先让他们发照片吧。'],'ending:converted');render();return true}
 return false;
}
function clueFileUI(){const f=clueFileData(R.id);return appHeader(f?.title||'文件',{action:'cs-file-share',right:ico('share'),label:'共享'})+`<div class="scroll clue-shared-file">${f?`<small>${E(f.sourceLabel||(f.fromDevice==='daughter'?'由小禾备用机通过设备间传送传入':'原始文件 · 2026年9月6日'))}${f.takenAt?' · '+E(f.takenAt):''}</small><h2>${E(f.title)}</h2>${f.asset?`<img src="${asset(f.asset)}" alt="${E(f.title)}">`:''}<p>${E(f.body||f.description||'')}</p>`:'文件不存在。'}</div>`}
const clueOldFileList=fileList;fileList=function(q=''){return [...clueState().files.map(clueFileData),...(S.devices?.shared||[])].filter(f=>f&&(!q||f.title.includes(q))).map(f=>`<button class="file-row" data-a="cs-file" data-id="${E(f.id)}"><img class="document-file-icon" src="${asset('document-file')}" alt=""><span><strong>${E(f.title)}</strong><small>${f.fromDevice==='daughter'?'来自小禾备用机':'原始资料'} · 已存储</small></span></button>`).join('')+clueOldFileList(q)};
const clueOldIsFriend=wechatIsFriend;wechatIsFriend=function(id){if(CLUE_PEOPLE[id])return clueState().contacts[id]?.status==='accepted';if(id==='old'&&S.flags.found)return !!clueState().contacts.old;return clueOldIsFriend(id)};
const clueOldRequests=wechatRequests;wechatRequests=function(){return [...clueOldRequests(),...Object.entries(clueState().contacts).filter(([id,f])=>CLUE_PEOPLE[id]&&['pending','accepted'].includes(f.status)).map(([id,f])=>({id,...f}))]};
visiblePeople=function(){return Object.keys(D.people).filter(id=>id!=='me'&&!D.people[id].official&&!D.people[id].hiddenGod&&wechatIsFriend(id)&&(id!=='old'||S.flags.inner||clueState().contacts.old))};
const clueOldWeb=puzzleWeb;puzzleWeb=function(u){const p=clueWeb(u);return p===null?clueOldWeb(u):p};
puzzleBackPage=clueAdminBack;
puzzleNotice=function(){return clueShell('离岗通知.txt',`<p>我是沈闻，归家互助的管理员。最初的网站是真的。我们不替家属认人，人没回来就不撤启事。</p><p>八月起，奉母派开始改站里的页面。他们把家属上传的照片、叫孩子的小名，都拿去给替身模仿。孩子原来的消息被藏进旧目录。我见过送回去的那几个，眼睛一闭，胸口就不动了。</p><p>我今晚去旧院找他们。如果明天账号还更新，不要以为我还坐在这里。9月6日的完整备份保留了我亲手写的附件。</p><p>—— 2026年9月6日 23:16</p>${clueLink('被恢复的未发布草稿',BASE+'/manage/restored')}`)};
const clueOldConsole=puzzleConsole;puzzleConsole=function(){return clueOldConsole().replaceAll('旧站通信分线箱','消息转发与设备交接').replaceAll('/manage/switchboard','/manage/messages')};
const clueOldInner=innerPage;innerPage=function(file=false,path='/account/export'){let html=clueOldInner(file,path);const t=document.createElement('template');t.innerHTML=html;t.content.querySelector('.cult-peel')?.remove();const idol=t.content.querySelector('.cult-idol');if(idol){idol.dataset.a='photo';idol.dataset.id='cult-idol';idol.setAttribute('aria-label','查看供奉像照片')}html=t.innerHTML.replace('沈闻分开保存了失踪者留言、家庭资料和回访记录。奉母派后来只公开了回访记录。','沈闻分别保存了失踪者的留言与家庭回访。奉母派公开替身的回答，却把求救消息藏进旧目录。');return html};
returnInvestigationAppend=function(file){return ''};
cipherHouseholdWitness=function(){return ''};
cipherEndingReady=function(){return false};cipherFinalGate=function(){return ''};puzzleRitualReady=function(){};puzzleEnding=function(){};archiveFamily=function(){browse(BASE+'/family')};
const clueOldNegative=cultHistoryNegative;cultHistoryNegative=function(){const html=clueOldNegative();if(!cultHistoryState().negativeUnlocked)return html;clueRead('history-original');return html.replace('</main>',sixAttachment()+'</main>')};
const clueOldCipherSubmit=cipherSubmit;cipherSubmit=function(kind,d){if(kind!=='cipher-translate')return ['cipher-paper','cipher-passphrase','cipher-vow'].includes(kind);const result=cipherTranslate(String(d.get('input')||''),Object.fromEntries(d.entries()));if(typeof bookCipherHandleResult==='function')bookCipherHandleResult(result);return clueOldCipherSubmit(kind,d)};
const clueOldAfterRender=puzzleAfterRender;puzzleAfterRender=function(){clueOldAfterRender();clueAfterRender()};
const clueOldPush=push;push=function(id,text,type='text',extra={}){if(extra.clueMinutes)clueTimeJump(extra.clueMinutes);clueOldPush(id,text,type,extra);clueDelivered(id,{text,type,...extra});clueAfterRender();persist()};
D.photos['cult-idol']??={title:'归亲堂供奉像.png',date:'网页图片',time:'',device:'原图未提供设备信息',lens:'',size:'原始附件',unlock:'inner'};
syncClueStory();
