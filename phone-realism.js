/* Small presentation helpers. Story progression and message content stay unchanged. */
function realismStoryDate(){if(typeof phoneDate==='function')return phoneDate();
 const day=Number.isInteger(Number(S.day))?Number(S.day):18;
 const match=String(time()).match(/^(\d{1,2}):(\d{2})/);
 const hour=match?Math.min(23,Number(match[1])):20;
 const minute=match?Math.min(59,Number(match[2])):36;
 return new Date(Date.UTC(2026,8,day,hour,minute));
}

function realismWeatherPage(){
 const now=realismStoryDate(),hour=now.getUTCHours();
 const weekdays=['星期日','星期一','星期二','星期三','星期四','星期五','星期六'];
 const hours=Array.from({length:5},(_,i)=>{
  const futureHour=(hour+i)%24;
  const label=i===0?'现在':`${futureHour}时`;
  const degree=i===0?17:futureHour<7?15:futureHour<18?17:16;
  return `<span>${label}${ico('cloud')}<b>${degree}°</b></span>`;
 }).join('');
 const forecast=Array.from({length:4},(_,i)=>{
  const date=new Date(now.getTime()+i*86400000);
  const weekday=weekdays[date.getUTCDay()];
  const label=i===0?'今天':weekday;
  return `<div aria-label="${date.getUTCMonth()+1}月${date.getUTCDate()}日 ${weekday}">${label}${ico(i<2?'cloud':'sun')}<span>${[14,14,15,15][i]}° — ${[19,20,20,21][i]}°</span></div>`;
 }).join('');
 return `<div class="scroll weather-real"><h1>槐城</h1><strong>17°</strong><p>阴</p><p>最高 19°　最低 14°</p><div class="weather-hours" aria-label="每小时天气">${hours}</div><div class="weather-card"><p>未来几小时有小雨，随后逐渐停止。</p>${forecast}</div><div class="weather-metrics"><div>湿度<strong>84%</strong></div><div>体感温度<strong>16°</strong></div><div>风速<strong>8 km/h</strong></div><div>能见度<strong>9 km</strong></div></div></div>`;
}

/* Parse the simulated phone's dates, never the computer's current calendar date. */
function realismMessageDate(value,base=realismStoryDate().getTime()){
 if(typeof value==='number'&&Number.isFinite(value)&&value>1000000000)return value<100000000000?value*1000:value;
 if(typeof value!=='string'||!value.trim())return null;
 const input=value.trim(),anchor=new Date(base);
 let year=anchor.getUTCFullYear(),month=anchor.getUTCMonth()+1,day=anchor.getUTCDate();
 let hour=0,minute=0,dateFound=false;
 let match=input.match(/(?:(\d{4})年)?(\d{1,2})月(\d{1,2})日/);
 if(match){year=Number(match[1]||year);month=Number(match[2]);day=Number(match[3]);dateFound=true}
 else{
  match=input.match(/^(?:(\d{4})[-/])?(\d{1,2})[-/](\d{1,2})(?:\b|T|\s)/);
  if(match){year=Number(match[1]||year);month=Number(match[2]);day=Number(match[3]);dateFound=true}
  else if(/今天|昨天|前天/.test(input)){
   const offset=/前天/.test(input)?2:/昨天/.test(input)?1:0;
   const relative=new Date(base-offset*86400000);
   year=relative.getUTCFullYear();month=relative.getUTCMonth()+1;day=relative.getUTCDate();dateFound=true;
  }
 }
 const clock=input.match(/(?:^|T|\s)(\d{1,2}):(\d{2})(?::\d{2})?/);
 if(clock){hour=Number(clock[1]);minute=Number(clock[2])}
 if(!dateFound&&!clock)return null;
 if(month<1||month>12||day<1||day>31||hour>23||minute>59)return null;
 const stamp=Date.UTC(year,month-1,day,hour,minute);
 const checked=new Date(stamp);
 if(checked.getUTCMonth()!==month-1||checked.getUTCDate()!==day)return null;
 return stamp;
}

function realismLastChatTime(id){
 const messages=Array.isArray(S.history?.[id])?S.history[id]:[];
 let sectionTime=null,lastTime=null;
 for(const message of messages){
  if(!message||typeof message!=='object')continue;
  if(message.date){
   sectionTime=realismMessageDate(message.date,sectionTime||realismStoryDate().getTime())??sectionTime;
   continue;
  }
  let stamp=null;
  if(message.storyDay!=null){
   const day=Number(message.storyDay);
   if(Number.isInteger(day)&&day>0&&day<32){
    const fallback=sectionTime==null?'00:00':`${String(new Date(sectionTime).getUTCHours()).padStart(2,'0')}:${String(new Date(sectionTime).getUTCMinutes()).padStart(2,'0')}`;
    stamp=realismMessageDate(`9月${day}日 ${message.storyClock||fallback}`);
   }
  }
  if(stamp==null&&message.sentAt!=null)stamp=realismMessageDate(message.sentAt,sectionTime||realismStoryDate().getTime());
  if(stamp==null&&message.timestamp!=null)stamp=realismMessageDate(message.timestamp,sectionTime||realismStoryDate().getTime());
  if(stamp==null&&message.storyClock)stamp=realismMessageDate(message.storyClock,sectionTime||realismStoryDate().getTime());
  lastTime=stamp??sectionTime??lastTime;
 }
 return lastTime??0;
}

function realismChatOrder(a,b){
 const pinned=Array.isArray(S.pinned)?S.pinned:[];
 const pinOrder=Number(pinned.includes(b))-Number(pinned.includes(a));
 return pinOrder||realismLastChatTime(b)-realismLastChatTime(a)||(S.chatActivity?.[b]||0)-(S.chatActivity?.[a]||0);
}

/* Return a text label; callers must escape it in their own markup. */
function realismLinkBrand(value){
 let host;
 try{host=new URL(String(value),typeof BASE==='string'?BASE:'https://www.guijia.example').hostname.toLowerCase()}
 catch{return '网页'}
 const brands={
  'www.guijia.example':'归家寻亲',
  'guijia.example':'归家寻亲',
  'records.guijia.example':'归家资料服务',
  'news.huai.example':'槐城日报',
  'service.huai.example':'槐城社区服务',
  'street.huai.example':'槐城街坊',
  'parents.example':'家长之间',
  'search.example':'网页搜索'
 };
 return brands[host]||host||'网页';
}

/* The device address book is independent of WeChat friendship and remarks. */
const PHONE_CONTACT_RELATIONS={wife:'妻子',daughter:'女儿',friend:'朋友',teacher:'小禾的老师',police:'周警官',cousin:'表姐',colleague:'同事',manager:'工作联系人',neighbor:'邻居',bookfriend:'大学同学',runner:'骑友',parentfriend:'小满妈妈',repairfriend:'修车师傅'};
function nativeContactData(id){
 const own=S.phoneAddressBook?.[id],known=Object.hasOwn(PHONE_CONTACT_RELATIONS,id)&&D.people[id];
 if(!known&&!own?.custom)return null;
 return {id,name:String(own?.name||known?.name||''),relation:known?PHONE_CONTACT_RELATIONS[id]:'',phone:String(own?.phone||''),note:String(own?.note||''),known:Boolean(known),custom:Boolean(own?.custom)};
}
function nativeContactIDs(){return [...new Set([...Object.keys(PHONE_CONTACT_RELATIONS).filter(id=>D.people[id]),...Object.keys(S.phoneAddressBook||{}).filter(id=>S.phoneAddressBook[id]?.custom)])].filter(id=>nativeContactData(id)).sort((a,b)=>nativeContactData(a).name.localeCompare(nativeContactData(b).name,'zh'))}
function nativeContactAvatar(id){return nativeContactData(id)?.known?av(id,false):'<span class="native-contact-monogram" aria-hidden="true">'+E(nativeContactData(id)?.name.slice(0,1)||'')+'</span>'}
function nativeContactsUI(){
 const list=nativeContactIDs().filter(id=>{const p=nativeContactData(id);return !R.q||(p.name+p.phone+p.note).includes(R.q)});
 return appHeader('通讯录',{root:true,action:'phone-contact-new',right:ico('plus'),label:'新建联系人'})+`<div class="scroll native-contacts"><h1>通讯录</h1>${searchbar('contact-search')}${list.map(id=>`<button class="contact-row" data-a="phone-contact" data-id="${E(id)}"><span>${E(nativeContactData(id).name)}</span></button>`).join('')||'<div class="native-empty">无联系人</div>'}<p class="native-contact-count">${list.length} 位联系人</p></div>`;
}
function nativeContactUI(id){
 const p=nativeContactData(id);if(!p)return appHeader('联系人')+'<div class="native-empty">联系人不存在</div>';
 return appHeader('',{action:'phone-contact-edit',id,right:'编辑',label:'编辑联系人'})+`<div class="scroll native-contact-detail"><div class="native-contact-heading">${nativeContactAvatar(id)}<h1>${E(p.name)}</h1>${p.relation?`<p>${E(p.relation)}</p>`:''}</div><div class="native-contact-fields">${p.phone?`<div><span>电话</span><strong>${E(p.phone)}</strong></div>`:''}${p.note?`<div><span>备注</span><p>${E(p.note).replace(/\n/g,'<br>')}</p></div>`:''}${p.known?`<button data-a="chat" data-id="${E(id)}">在微信中发消息</button>`:''}</div></div>`;
}
function nativeContactEditor(id=''){
 const p=id?nativeContactData(id):null;if(id&&!p)return;
 dialog(id?'编辑联系人':'新建联系人',`<form data-form="phone-contact" data-id="${E(id)}" class="native-contact-form"><label>姓名<input name="name" aria-label="联系人姓名" value="${E(p?.name||'')}" maxlength="40" required autocomplete="off"></label><label>电话<input name="phone" aria-label="联系人电话" type="tel" value="${E(p?.phone||'')}" maxlength="40" autocomplete="off"></label><label>备注<textarea name="note" aria-label="联系人备注" maxlength="300">${E(p?.note||'')}</textarea></label><button class="native-submit">完成</button></form>`,`<button data-a="close">取消</button>`);
}
function nativeContactSubmit(d,f){
 const id=f.dataset.id||'local-'+crypto.randomUUID(),previous=nativeContactData(id),name=String(d.get('name')||'').trim();if(!name)return;
 S.phoneAddressBook??={};S.phoneAddressBook[id]={name:name.slice(0,40),phone:String(d.get('phone')||'').trim().slice(0,40),note:String(d.get('note')||'').trim().slice(0,300),custom:previous?previous.custom:true};closeOverlay();
 if(R.app==='phonecontact')render();else go('phonecontact',{id});
}
function realismCompactDate(value){
 const stamp=realismMessageDate(value);if(stamp==null)return '';
 const date=new Date(stamp),now=realismStoryDate();
 return date.toISOString().slice(0,10)===now.toISOString().slice(0,10)?date.toISOString().slice(11,16):`${date.getUTCMonth()+1}月${date.getUTCDate()}日`;
}
