/* The collective rescue requires individual trails, not a global read checklist.
 * NPCs receive immutable exported notes through the normal file-sharing channel. */
function redemptionState(){const s=clueState();s.redemption??={version:1,exports:{}};s.redemption.exports??={};return s.redemption}
function redemptionXiaoqiuSourceReady(){return Boolean(clueState().known['xiaoqiu-notice']&&clueState().succession.warned)}
function redemptionNotebookButton(){return familyInvestigationConclusions().length||bookCipherSolved('xiaoqiu')?'<button class="bc-open" data-a="redemption-notes">导出查阅笔记</button>':''}
function redemptionExport(){
 const rows=familyInvestigationConclusions(),xiaoqiu=bookCipherSolved('xiaoqiu'),shen=Boolean(clueState().known['admin-fate']);
 const signature=rows.map(x=>x.id.replace('household_','')).sort().join('-')+(xiaoqiu?'-qiu':'')+(shen?'-shen':'');if(!signature)return;
 const id='reading-notes-'+signature,r=redemptionState();
 if(!r.exports[id])r.exports[id]={id,title:'查阅笔记 · '+phoneStamp()+'.txt',sourceLabel:'林砚整理 · '+phoneStamp(),covers:rows.map(x=>x.id),xiaoqiu,shen,body:rows.map(x=>x.name+' / '+x.case+'\n原件：'+x.source+'\n本人留言：'+x.statement+'\n附单索引：'+x.code+'。查抄经本后转写为：'+x.location+'。').join('\n\n')+(xiaoqiu?'\n\n方姨收到的小秋接领通知：南城服务楼。房间记作下·陆正·宇，查抄本转写为二楼三号室。她保留着小秋原账号的求救消息。':'')+(shen?'\n\n沈闻：管理员回收站里恢复的草稿和9月7日人员记录表明，他已被奉母派献祭。请保留原件交由警方查明经过，通知他的家人。':'')};
 if(!clueState().files.includes(id))clueState().files.push(id);persist();go('clue-file',{id});
}
function redemptionSharedDossierReady(){return (clueState().shared.yeming||[]).some(id=>{const f=redemptionState().exports[id];return f&&f.xiaoqiu&&f.shen&&Object.keys(CLUE_FAMILIES).every(k=>f.covers.includes(k))})}
function redemptionReady(){
 const s=clueState();return Boolean(!s.succession.familyClosed&&s.succession.warned&&s.known['admin-fate']&&familyInvestigationAllComplete()&&['old','new','sacrifice','six','xiaoqiu'].every(bookCipherSolved)&&cluePublishedCount()===6&&clueSharedHas('yeming','cs-register')&&clueSharedHas('yeming','dp-cloud-letter')&&s.solidarity.locationShared&&redemptionSharedDossierReady());
}
function redemptionHint(){
 const s=clueState();if(!clueSharedHas('yeming','cs-register'))return '修改前那本名册，你还留着吗？发我看看。后来公开的名单改过了。';
 if(!redemptionSharedDossierReady())return '六家那些东西是从哪儿来的，人又留下过什么话，得一件件理清。你把查阅笔记和小秋的通知一起发我，我要知道各人在哪儿。';
 if(!['old','new','sacrifice','six'].every(bookCipherSolved))return '旧刊、新祷文和座前文书都用了抄本索引。它们改了什么、为什么找这六人，我还没理清。字间那份影录应该能接上。';
 if(cluePublishedCount()<6)return '有几家还没回信。他们怕认错人，光劝也难。等找到亲人留下的话，再聊聊。';
 if(!s.succession.warned||!bookCipherSolved('xiaoqiu'))return '还有方姨的小秋。许老师给过她接领通知，那边也得顾上。';
 if(!clueSharedHas('yeming','dp-cloud-letter'))return '沈闻留在备用机里的最后那封原信，请也发我一份。';
 if(!s.solidarity.locationShared)return '小禾那边现在是哪栋楼、哪个房间，能从哪儿进？把你查到的门牌和入口发我。';
 return '东西都收到了。需要我现在联系警方一起接人吗？';
}
const redemptionOldFileData=clueFileData;
clueFileData=function(id){
 if(redemptionState().exports[id])return redemptionState().exports[id];
 const f=familyInvestigationFileData(id);if(f)return f;
 if(id==='xiaoqiu-notice'&&clueState().events['xiaoqiu-notice-sent']==='delivered')return {id,title:'小秋接领通知.txt',sourceLabel:'方姨转来的通知 · '+phoneStamp(),body:'归家互助 / 接领通知\n接领人：方女士\n孩子：小秋\n地点：南城服务楼\n值房记号：下·陆正·宇\n\n内部联系单沿用《归亲会抄经本》的值房索引。外页不写门号，到场请联系回访员。\n\n方姨附言：这是今天下午发来的。门口明明站着一个，原账号却还说自己没出来。我先把这张存下来了。'};
 return redemptionOldFileData(id);
};
const redemptionOldFileUI=clueFileUI;
clueFileUI=function(){if(R.id==='xiaoqiu-notice'&&clueFileData(R.id))clueRead('xiaoqiu-notice');return redemptionOldFileUI()+(R.id==='xiaoqiu-notice'?'<div class="bc-reading-tools">'+bookCipherLink()+redemptionNotebookButton()+'</div>':'')};
const redemptionOldWeb=clueWeb;
clueWeb=function(u){for(const f of [bookCipherWeb,familyInvestigationWeb]){const html=f(u);if(html!==null)return html}return redemptionOldWeb(u)};
const redemptionOldAction=clueAction;
clueAction=function(a,b){if(bookCipherAction(a,b)||familyInvestigationAction(a,b))return true;if(a==='redemption-notes'){redemptionExport();return true}return redemptionOldAction(a,b)};
const redemptionOldSubmit=clueSubmit;
clueSubmit=function(kind,d){if(bookCipherSubmit(kind,d)||familyInvestigationSubmit(kind,d))return true;return redemptionOldSubmit(kind,d)};
window.bookCipherOnResult=function(result){clueRead('cipher-'+result.id);clueState().revision++};
function redemptionFamilyID(person){return Object.keys(CLUE_FAMILIES).find(id=>CLUE_FAMILIES[id].case===person?.id)}
const redemptionOldNotice=missingPeopleRecord;
missingPeopleRecord=function(u){const p=missingPerson(u.searchParams.get('id')),id=redemptionFamilyID(p);if(id)clueRead('fi-notice:'+id);return redemptionOldNotice(u).replace('</article>',(id?familyInvestigationEntry(id):'')+'</article>')};
const redemptionOldHousehold=missingPeoplePrivateRecord;
missingPeoplePrivateRecord=function(p){const id=redemptionFamilyID(p);if(id)clueRead('fi-return:'+id);return redemptionOldHousehold(p).replace('</article>',(id?familyInvestigationEntry(id):'')+'</article>')};
const redemptionOldDelivered=clueDelivered;
clueDelivered=function(id,m){redemptionOldDelivered(id,m);if(m.clueEffect==='visitor-warned')clueEvent('xiaoqiu-notice-sent','visitor',['下午那张接领通知也给你。地方写着呢，房间怎么是一串记号，我看不懂。',{type:'file',file:'xiaoqiu-notice',text:'小秋接领通知.txt'}],'xiaoqiu-notice-sent')};
const redemptionOldConversation=clueConversation;
clueConversation=function(id,text){
 const s=clueState(),t=clueNatural(text);if(!S.flags.found||S.flags.done)return redemptionOldConversation(id,text);
 if(CLUE_FAMILIES[id]&&s.solidarity.families[id].disclosed&&!s.solidarity.families[id].published&&clueKeepSearch(t)&&!familyInvestigationComplete(id)){
  const f=FAMILY_INVESTIGATIONS[id];replyMany(id,[f.intro,{type:'link',text:f.name+'的寻人登记',url:BASE+'/record?id='+f.case}]);return true;
 }
 if(id==='club'&&s.solidarity.met&&/方姨|小秋/.test(t)&&!s.succession.visitorIntroduced){clueEvent('visitor-intro','club',['方姨还在找小秋。我问过她，她愿意和你聊聊。'],'visitor-intro');return true}
 if(id==='yeming'&&s.solidarity.met){
  if(clueLocationReady()&&clueLocationMessage(id,t).complete)s.solidarity.locationShared=true;
  if(!s.events['yeming-new-child'])clueEvent('yeming-new-child','yeming',['原册六家以外，方姨也在找外甥女小秋。许老师能联系上她。我担心他们又催她撤启事。']);
  if(!s.solidarity.operation&&redemptionReady()&&clueRescueRequest(t,id)){
   s.solidarity.operation=true;
   clueEvent('group-operation','yeming',['六个人的位置、小秋的通知，都转给周警官了。我带原册去旧堂，六家在外面等。','旧祷文写的是见到本人，新印本才改成认下替身。六家都不肯撤启事，那页改过的祷文就不算数了。',{text:'已经进堂。六家轮流喊亲人的名字，神龛后面一直有声音学他们喊。我把原册翻开，守灯君的像终于亮了。',clueMinutes:90},'那声音停了。像前的裂缝合上了，警官那边刚传来消息。']);
   clueEvent('group-result','police',['小禾接到了。旧堂六处的人也都找到了。另一组在南城服务楼二楼三号室接到了小秋。','八个人都交给医护了，家属在陪着。沈闻遇害的事已经确认，记录已立案保存。我们会通知他的家人。'],'ending:sealed');return true;
  }
  if(!s.solidarity.operation){if(redemptionReady())replyMany(id,[redemptionHint()]);else npcReply(id,text,[redemptionHint()]);return true}
 }
 return redemptionOldConversation(id,text);
};
// Unfinished legacy saves must not carry a queued old shortcut into the new rescue.
function redemptionMigrate(){const r=redemptionState();if(r.migrated||S.flags.done)return;r.migrated=true;const s=clueState();const sent=new Set(Object.values(s.shared).flat());for(const copy of S.devices?.shared||[]){if(copy.fromDevice!=='daughter'||sent.has(copy.id))continue;const source=copy.sourceId==='cloud-letter'?DAUGHTER_CONTENT.cloud:DAUGHTER_CONTENT.files.find(f=>f.id===copy.sourceId);if(source)copy.body=source.body;}if(s.solidarity.operation&&!redemptionReady()){s.solidarity.operation=false;S.pending=(S.pending||[]).filter(m=>!['group-operation','group-result'].includes(m.extra?.clueEvent));delete s.events['group-operation'];delete s.events['group-result']}persist()}
redemptionMigrate();

const redemptionPreviousFacts=clueNpcFacts;clueNpcFacts=function(id){const facts=redemptionPreviousFacts(id);for(const key of clueState().shared[id]||[]){const f=redemptionState().exports[key];if(!f)continue;facts.push('你实际收到的查阅笔记所列位置：'+f.covers.map(k=>FAMILY_INVESTIGATIONS[k].name+'在'+FAMILY_INVESTIGATIONS[k].place).join('；')+(f.xiaoqiu?'；小秋在南城服务楼二楼三号室':'')+'。这些是原件线索，尚不能说人已获救。');}if(S.flags.done==='sealed'&&(S.history[id]||[]).some(m=>m.clueEffect==='ending:sealed'))facts.push('本线程已经实际收到本轮结果：'+(clueState().redemption?.completed?'小禾、六名失踪者和小秋共八人已经获救。沈闻已遇害，警方通知其家属。':'小禾与另外六名失踪者已获救。'));return facts};
