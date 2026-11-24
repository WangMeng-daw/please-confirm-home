/* Ending awards are collected only after an authored ending has completed. */
(() => {
 const key=KEY+'-ending-awards';
 const cards={
  rescued:{label:'寻回者',kind:'生还结局',title:'她走过那道缝',line:'你找回了真正的小禾。另外六家的亲人，还在等人来接。',coda:'（恭喜你，林砚。这一次，回家的真的是她。）',bg:'ending-rescued-bg',art:'ending-rescued-title'},
  sealed:{label:'守望者',kind:'救赎结局',title:'请确认，天亮了',line:'你找到了每个人留下的线索。小禾、六位失踪者和小秋都被救回，食名母重新被封印。',coda:'（恭喜你，林砚。这一次，所有还在等候的人都回来了。）',bg:'ending-sealed-bg',art:'ending-sealed-title'},
  converted:{label:'接班人',kind:'皈依结局',title:'下一户，请进',line:'你知道家里的小禾是假的，却接下了归家会的夜班。真正的女儿还没回来，你已经开始劝别人停止寻找。',coda:'（恭喜你，林砚。下一位许老师，就是你。）',bg:'ending-converted-bg',art:'ending-converted-title'}
 };
 function read(){try{const value=JSON.parse(localStorage.getItem(key));return Array.isArray(value)?value.filter(id=>Object.hasOwn(cards,id)):[]}catch{return []}}
 function awards(){
  const list=[...new Set([...read(),...(Array.isArray(S.endingAwards)?S.endingAwards:[]),...(Object.hasOwn(cards,S.flags.done)?[S.flags.done]:[])])].filter(id=>Object.hasOwn(cards,id));
  S.endingAwards=list;
  try{localStorage.setItem(key,JSON.stringify(list))}catch{}
  return list;
 }
 const oldInitial=initial;
 initial=function(){return {...oldInitial(),endingAwards:read()}};
 const oldPage=puzzleEndingPage;
 puzzleEndingPage=function(){
  const id=S.flags.done,m=cards[id]?{...cards[id]}:null;if(!m)return oldPage();if(id==='sealed'&&!S.clueStory?.redemption?.completed){m.line='你帮助六家人继续寻找亲人，让食名母重新被封印。小禾和另外六人都走出了旧院。';m.coda='（恭喜你，林砚。这一次，七家都等到了天亮。）'}
  const collected=awards();persist();
  return `<div class="pz-ending pz-end-${E(id)} ec-ending" data-ending="${E(id)}" style="--end-art:url('${asset(m.bg)}')">
   <div class="ec-layout">
    <section class="ec-card" aria-label="${E(m.label)}结局卡片">
     <div class="ec-card-top"><span>达 成 结 局</span><time>2026.09.25　${id==='converted'?'00:07':'06:11'}</time></div>
     <div class="ec-card-body">
      <h1 class="ec-award-title">${E(m.label)}</h1><span class="ec-kind">${E(m.kind)}</span>
      <div class="ec-rule"></div>
      <h2 class="ec-story-title"><span>${E(m.title)}</span><img src="${asset(m.art)}" alt="" aria-hidden="true" draggable="false"></h2>
      <p class="ec-summary">${E(m.line)}</p>
      <div class="ec-stamp" aria-label="已获得${E(m.label)}标签">${E(m.label)}</div>
      <p class="ec-coda">${E(m.coda)}</p>
     </div>
    </section>
    <section class="ec-collection" aria-label="结局收集"><p>结局收集 <span>${collected.length} / 3</span></p><div>${Object.entries(cards).map(([value,card])=>`<span class="${collected.includes(value)?'earned':''}" ${collected.includes(value)?`data-earned="${value}"`:''}>${collected.includes(value)?E(card.label):'未解锁'}</span>`).join('')}</div></section>
    <div class="pz-ending-actions">${puzzleButton('回到手机','home')}${id==='sealed'||id==='rescued'?puzzleButton('看看发来的消息','nav','data-app="chats"'):''}</div>
    <p class="ec-footer">谢谢你，陪林砚等到这一刻。</p>
   </div>
  </div>`;
 };
 window.endingCardState=()=>({current:S.flags.done||null,awards:[...awards()]});
 awards();
})();
