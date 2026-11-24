/* Ordinary decisions remain reversible until an explicit final submission. */
function personPortrait(id){
 const slot={me:0,wife:1,police:2,teacher:3,friend:4,club:5,old:8}[id];
 return slot===undefined?'':`<span class="person-photo" role="img" aria-label="${E(pname(id))}的头像" style="background-image:url('${asset('people-real')}');background-position:${slot%3*50}% ${Math.floor(slot/3)*50}%"></span>`;
}
function flowReviewWeb(){return null}
function flowReviewChat(id,text){
 if(!S.flags.done)return false;
 const ending=S.flags.done;
 if(['rescued','sealed'].includes(ending)&&id==='daughter')return true;
 const lines=ending==='rescued'?{wife:'小禾在我身边。她还抓着鲸鱼的尾巴。',old:'爸，我出来了。我想回家睡。',police:'小禾已被找到，另外六户还在找。后续我会联系你。',club:'你只从门里拿走了一个名字。'}:ending==='sealed'?{wife:'我们都在楼下。你下来吧，天亮了。',old:'爸，今天不用留门了。',police:'七个人均已交给医护人员。旧院已经封锁。',club:'网页还在。只是里面不再有回应。'}:ending==='converted'?{wife:'她终于肯睡了。你为什么还站在门口？',daughter:'爸爸，下一户什么时候来？',old:'',club:'你接替沈闻了。今晚开始由你迎接家属。'}:{wife:'我等周警官的消息。',old:'原来的名字还在。',daughter:'那我今晚，应该叫你什么？',police:'旧登记会继续保留。'};
 npcReply(id,text,[lines[id]||'我看到了。我们之后再说。']);return true;
}
