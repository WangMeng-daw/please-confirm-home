/* Private recollections are conversations, never a verification form. */
function returnInvestigationData(){S.returnInvestigation??={};const r=S.returnInvestigation;for(const [k,v] of Object.entries({sourceCorrected:false,privateStatementReceived:false,physicalRequested:false,physicalObserved:false,wifeTopicTurns:0,memoryVerified:false,events:{}}))if(r[k]===undefined)r[k]=v;return r}
function syncReturnInvestigation(){const r=returnInvestigationData();if((S.history.old||[]).some(m=>!m.me&&/小鲸鱼.*最后一针/.test(m.text||'')))r.privateStatementReceived=true;if((S.history.wife||[]).some(m=>m.returnEvidence==='physical-stitch'))r.physicalObserved=true}
function returnInvestigationActive(){return Boolean(S.flags.found&&!S.flags.done)}
function returnInvestigationMessages(key,entries){const r=returnInvestigationData();if(!returnInvestigationActive()||r.events[key])return false;r.events[key]=true;for(const e of entries)later(e.id||'daughter',e.text,{horrorEvent:'return-'+key,...(e.extra||{})});return true}
function returnInvestigationChat(id,text){
 if(!returnInvestigationActive()||!S.flags.inner||S.flags.hollowWifeSheltered)return false;
 const r=returnInvestigationData();
 const priorWhaleTopic=id==='wife'&&r.wifeTopicTurns>0;
 if(id==='wife')r.wifeTopicTurns=/鲸/.test(text)?2:Math.max(0,r.wifeTopicTurns-1);
 const observationRequest=/(?:翻|检查|查看|看一看|看一下|看看|摸|拆|找出|拿出|取出|掀)/.test(text)&&!/(?:不要|别|不用|不必|先不|暂时不)(?:再|去|帮我)?(?:翻|看|检查|摸|拆|找|拿|取|掀)/.test(text);
 if(id==='wife'&&(/鲸/.test(text)||priorWhaleTopic)&&observationRequest){
  if(!r.physicalRequested){
   r.physicalRequested=true;r.physicalQuestion=text.slice(0,200);
   returnInvestigationMessages('physical-check',[
    {id:'wife',text:'等一下，我去把鲸鱼拿来看看。'},
    {id:'wife',text:'尾巴翻开看了。外面是蓝线，压在尾巴下面的最后一针是白的。',extra:{returnEvidence:'physical-stitch'}},
    {id:'wife',text:'从正面看不见。我想起来了，你那天说蓝线不够，叫我别告诉她。'},
    {id:'wife',text:'她站在我旁边，问我为什么要把它翻过来。'}
   ]);
  }else replyMany('wife',[r.physicalObserved?'我翻开看过了，最后一针确实是白的。':'还没找到，等我一下。']);
  return true;
 }
 return false;
}

function returnInvestigationSent(){return false}
function returnInvestigationWeb(){return null}
function returnInvestigationSubmit(){return false}
function returnInvestigationHandle(){return false}
function returnInvestigationAppend(){return ''}
syncReturnInvestigation();
