/* Keep authored family records consistent without rewriting the player's words. */
function canonicalDaughterName(value){
 const text=String(value??'').trim();
 return S.childNameLegacy&&text==='\u9648小禾'?'林小禾':text;
}
function syncDaughterName(){
 if(S.daughterNameVersion===1)return;
 const old='\u9648小禾';let legacy=false;
 const rename=value=>{if(typeof value!=='string'||!value.includes(old))return value;legacy=true;return value.replaceAll(old,'林小禾')};
 const fields=(item,keys=['text','title'])=>{if(item)for(const key of keys)if(typeof item[key]==='string')item[key]=rename(item[key])};
 [S.registration,S.registerDraft,S.formDrafts?.['web-register'],S.formDrafts?.['cipher-vow'],S.cipher?.drafts].forEach(item=>fields(item,['name']));
 for(const messages of Object.values(S.history||{}))for(const m of messages){if(!m.me)fields(m);else if(m.text?.includes(old))legacy=true;}
 for(const m of S.pending||[]){fields(m);fields(m.extra)}
 for(const n of S.notifications||[])fields(n);
 for(const m of S.moments||[]){if(m.person!=='me')fields(m);for(const c of m.comments||[])if(c.person!=='me'&&c.name!==S.profile?.name)fields(c)}
 for(const f of S.favorites||[])if(!f.me)fields(f);
 for(const messages of Object.values(S.douyin?.messages||{}))for(const m of messages)if(!m.me)fields(m);
 for(const m of S.douyin?.outbox||[]){fields(m);fields(m.message)}
 const comments=list=>{for(const c of list||[]){if(c.creator!=='me')fields(c);comments(c.replies)}};
 for(const list of Object.values(S.douyin?.comments||{}))comments(list);
 for(const p of S.douyin?.posts||[])if(p.creator!=='me'){fields(p);comments(p.comments)}
 for(const job of S.socialReactions?.jobs||[])if(job.actor!=='me')fields(job);
 S.childNameLegacy=Boolean(S.childNameLegacy||legacy);
 S.daughterNameVersion=1;
}
syncDaughterName();
