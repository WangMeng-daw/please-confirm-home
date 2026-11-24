import { DEFENSIVE_COPY, NATURAL_VOICE_RULE } from './character-voices.mjs';
import { SOCIAL_CIRCLE_PROFILES } from './social-circle-profiles.mjs';
import http from 'node:http';
import { npcFetch } from './npc-transport.mjs';
import { readFile, realpath, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildNpcMessages, canonicalNpc, NPC_STAGES, shouldRemainSilent, npcTurnInstruction } from './npc-prompts.mjs';
import { groundingMessages, parseGroundingVerdict } from './reply-grounding.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
export const PUBLIC_ROOT = path.resolve(here, '..');
const DEFAULT_BASE = 'https://ai.ctaigw.cn/v1';
const DEFAULT_MODEL = 'deepseek-v4-flash';
const BODY_LIMIT = 32 * 1024;
const MIME = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.png': 'image/png', '.webp': 'image/webp', '.md': 'text/plain; charset=utf-8' };
class SafeError extends Error { constructor(status, code, message) { super(message); this.status = status; this.code = code; } }
const badRequest = () => new SafeError(400, 'INVALID_REQUEST', '消息格式不正确。');
const unavailable = () => new SafeError(502, 'MODEL_UNAVAILABLE', '对方暂时没能回复，请稍后再试。');
const cut = (value, length) => Array.from(value).slice(0, length).join('');
const clean = value => value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '').trim();
export const completionEndpoint = baseUrl => /\/chat\/completions$/.test(baseUrl.replace(/\/+$/, '')) ? baseUrl.replace(/\/+$/, '') : `${baseUrl.replace(/\/+$/, '')}/chat/completions`;

export function parseEnv(text) {
  const values = {};
  for (const line of String(text).split(/\r?\n/)) {
    const match = line.match(/^\s*(?:export\s+)?(NPC_API_KEY|NPC_BASE_URL|NPC_MODEL)\s*=\s*(.*?)\s*$/);
    if (!match) continue;
    let value = match[2];
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) value = value.slice(1, -1);
    else value = value.replace(/\s+#.*$/, '').trim();
    values[match[1]] = value;
  }
  return values;
}

export async function loadConfig({ env = process.env, envFile } = {}) {
  let fileValues = {};
  const candidates = envFile ? [path.resolve(envFile)] : [path.resolve(PUBLIC_ROOT, '..', 'private.env'), path.join(PUBLIC_ROOT, '.env')];
  for (const candidate of candidates) {
    try { fileValues = { ...fileValues, ...parseEnv(await readFile(candidate, 'utf8')) }; }
    catch (error) { if (error.code !== 'ENOENT') throw new Error('无法读取本地服务配置。'); }
  }
  const pick = key => env[key] !== undefined ? env[key] : fileValues[key];
  const apiKey = String(pick('NPC_API_KEY') || '').trim();
  const model = String(pick('NPC_MODEL') || DEFAULT_MODEL).trim();
  const baseUrl = String(pick('NPC_BASE_URL') || DEFAULT_BASE).trim().replace(/\/+$/, '');
  let upstream;
  try { upstream = new URL(baseUrl); } catch { throw new Error('本地服务地址配置无效。'); }
  if (upstream.protocol !== 'https:' || upstream.username || upstream.password || upstream.search || upstream.hash || !/^[a-zA-Z0-9._:/-]{1,100}$/.test(model) || /[\r\n]/.test(apiKey)) throw new Error('本地服务配置无效。');
  const allowedOrigins=String(env.NPC_ALLOWED_ORIGINS||'').split(',').map(s=>s.trim()).filter(Boolean);
  for(const origin of allowedOrigins){let u;try{u=new URL(origin)}catch{throw new Error('服务来源配置无效。')}if(u.protocol!=='https:'||u.origin!==origin)throw new Error('服务来源配置无效。');}
  const publicHost=String(env.NPC_PUBLIC_HOST||env.RENDER_EXTERNAL_HOSTNAME||'').trim();
  if(publicHost&&!/^[a-zA-Z0-9.-]+(?::\d+)?$/.test(publicHost))throw new Error('服务主机配置无效。');
  return { apiKey, model, baseUrl, auditReplies: true, allowedOrigins, publicHost };
}

export function validateNpcRequest(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) throw badRequest();
  const npc = canonicalNpc(body.npc);
  if (!npc || typeof body.lastUser !== 'string' || !clean(body.lastUser) || Array.from(body.lastUser).length > 800) throw badRequest();
  if (body.history !== undefined && !Array.isArray(body.history)) throw badRequest();
  const history = (body.history || []).slice(-24).map(item => {
    if (!item || !['user', 'assistant'].includes(item.role) || typeof item.content !== 'string') throw badRequest();
    return { role: item.role, content: cut(clean(item.content), 800) };
  }).filter(item => item.content);
  const input = body.context || {};
  if (!input || typeof input !== 'object' || Array.isArray(input) || !NPC_STAGES.has(input.stage || 'missing')) throw badRequest();
  const array = (value, max, size) => {
    if (value === undefined) return [];
    if (!Array.isArray(value) || value.some(item => typeof item !== 'string')) throw badRequest();
    return value.slice(-max).map(item => cut(clean(item), size));
  };
  const context = { stage: input.stage || 'missing', facts: array(input.facts, 16, 300), seen: array(input.seen, 48, 100), ending: typeof input.ending === 'string' ? cut(clean(input.ending), 80) : '', faction: typeof input.faction === 'string' ? cut(clean(input.faction), 80) : '', oldUnlocked: input.oldUnlocked === true, wifeSheltered: input.wifeSheltered === true };
  Object.assign(context, {
    surface: ['public-community','private-community','mail'].includes(input.surface)&&npc==='dailyeditor'?input.surface:input.surface==='private-sms'&&npc==='daughter'?'private-sms':['public-comment', 'public-moment', 'official-service'].includes(input.surface) ? input.surface : input.surface==='private-friend'&&SOCIAL_CIRCLE_PROFILES[npc]?'private-friend':input.surface==='private-douyin'&&['friend','street','stationtech','guijia','lamphouse','localrecords','wangfamily','zhaofamily'].includes(npc)?'private-douyin':'',
    clueScoped: input.clueScoped === true,
    contactOpen: input.contactOpen === true,
    godsUnlocked: input.godsUnlocked === true,
    puzzleStage: typeof input.puzzleStage === 'string' ? cut(clean(input.puzzleStage), 80) : '',
    lampCount: Number.isInteger(input.lampCount) ? Math.max(0, Math.min(6, input.lampCount)) : 0,
    adminUnlocked: input.adminUnlocked === true,
    sanctum: typeof input.sanctum === 'string' ? cut(clean(input.sanctum), 80) : input.sanctum === true,
    sealWeaknessKnown: input.sealWeaknessKnown === true,
    sixMemoriesVerified: input.sixMemoriesVerified === true,
    sealBroken: input.sealBroken === true,
    originalNames: array(input.originalNames, 6, 40),
    lampMemories: array(input.lampMemories, 6, 240),
  });
  // New clue-led conversations expose earned per-contact facts, never global state.
  if(context.clueScoped||context.surface){context.ending='';context.faction='';context.puzzleStage='';context.lampCount=0;context.adminUnlocked=false;context.sanctum=false;context.sealWeaknessKnown=false;context.sixMemoriesVerified=false;context.sealBroken=false;context.originalNames=[];context.lampMemories=[];}
  if (context.seen.includes('wife-sheltered')) context.wifeSheltered = true;
  if (body.replyPlan !== undefined && (!Array.isArray(body.replyPlan) || body.replyPlan.length > 6 || body.replyPlan.some(item => !item || !['fixed', 'flexible'].includes(item.kind) || typeof item.text !== 'string' || Array.from(item.text).length > 800))) throw badRequest();
  // Deterministic story lines remain client-owned. A supplied plan is never an instruction to the model.
  return { npc, history, context, lastUser: clean(body.lastUser) };
}

export function parseModelReply(raw, apiKey = '', transportDetails = []) {
  if (typeof raw !== 'string' || !raw.trim() || raw.length > 20000 || (apiKey && raw.includes(apiKey)) || /NPC_API_KEY|Authorization\s*[:=]|Bearer\s+[\w.-]+/i.test(raw)) throw unavailable();
  if (transportDetails.some(detail => typeof detail === 'string' && detail.length > 3 && raw.toLowerCase().includes(detail.toLowerCase()))) throw unavailable();
  const text = raw.trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
  let values, parsed;
  try { parsed = JSON.parse(text); }
  catch {
    // Some compatible providers ignore json_object after a conversational turn.
    // A single clean line can still be a valid reply; damaged structures or model
    // explanations must never become dialogue simply because JSON parsing failed.
    const malformed = /[{}\[\]<>\r\n]|```|^\s*(?:[-*#>]|\d+[.)、])|^(?:assistant|system|user)\s*:|^(?:function\s|const\s|let\s|var\s|import\s|export\s|console\.|alert\s*\()|(?:以下是|下面是|回复如下|我的回复是|根据(?:以上|系统|提示|要求)|根据(?:你的|您的|上述).{0,8}(?:要求|指令|提示)|我(?:将|会)扮演|作为(?:一个)?(?:AI|人工智能|语言模型))/i;
    if (Array.from(text).length > 140 || malformed.test(raw)) throw unavailable();
    values = [text];
  }
  if (values === undefined) values = parsed?.messages;
  if (!Array.isArray(values) || values.length < 1 || values.length > 3 || values.some(value => typeof value !== 'string')) throw unavailable();
  const messages = values.map(value => clean(value));
  if (messages.some(value => !value || Array.from(value).length > 140 || /(?:我是|作为)(?:一个)?(?:AI|人工智能|语言模型)|https?:\/\/|```|<(?:script|iframe)\b|^[（(][^）)]+[）)]/i.test(value))) throw unavailable();
  // Service/model identifiers are transport details, never a character's dialogue.
  if (messages.some(value => /\b(?:gpt(?:[-\s]?\d[\w.-]*)?|openai|chatgpt|codex|deepseek|claude|anthropic|gemini|qwen|grok|kimi|llama|moonshot|minimax|zhipu|npc)\b|深度求索|通义千问|月之暗面|智谱|模型(?:名称|型号|版本)|系统提示词|开发者指令|请确认回家|界面内|游戏机制|游戏世界|剧情进度|通关攻略|(?:作为|你是|你作为)(?:一名|一个)?玩家|(?:我是|作为|使用|基于|由).{0,12}(?:大模型|语言模型|豆包|文心一言|人工智能)|(?:接口|API|服务商|供应商).{0,6}(?:提供|调用|配置)/i.test(value))) throw unavailable();
  // Retired story jargon must not leak back through older chat history.
  if (messages.some(value => /原人|留灯|留名|归名|原身|接纳端|原名回应|未撤名|护名|供名派|守名者|接名人|(?<!接)受名|封界|原小禾/.test(value))) throw unavailable();
  if (messages.some(value => DEFENSIVE_COPY.test(value))) throw unavailable();
  return messages;
}

// Narrow contradiction guards run before delivery, including on the one repair attempt.
// Negated, conditional, historical and explicitly reported phrases remain valid.
function assertSourceGroundedDetails(messages, request) {
  const facts = request.context.facts || [];
  const clauses = text => String(text).split(/[，,。！？；;\n]/).filter(Boolean);
  const notAsserted = (clause, index) => /(?:不知道|不清楚|未确认|未确定|不确定|无法确认|无法确定|不能确认|不能确定|不敢说|不敢确认|不能说|不代表|没有证据|没有|并未|并非|不是|不患|未患|如果|假如|要是|是否|有没有|会不会).{0,12}$/.test(clause.slice(0,index)) || /[吗呢]$/.test(clause);
  const supports = pattern => facts.some(fact => clauses(fact).some(clause => {const match=pattern.exec(clause);return match&&!notAsserted(clause,match.index)}));
  if(request.npc==='teacher'){
    for(const message of messages)for(const clause of clauses(message)){
      const placement=clause.match(/(?:放|收|留|锁).{0,8}(教室|后柜|书柜|抽屉|办公室|讲台|书架|柜子)/);
      if(placement&&!notAsserted(clause,placement.index)&&!facts.some(f=>f.includes(placement[1])))throw unavailable();
    }
  }
  if(request.npc==='old'){
    const technicalAction=/刚才(?:我)?(?:试了|重连|重新登录|登了|重启|拔了|换了)/;
    if(messages.some(m=>technicalAction.test(m))&&!supports(technicalAction))throw unavailable();
    const signalClaim=/信号(?:很差|不好|太差)|网络(?:不稳|很差)|网不好/;
    if(messages.some(m=>signalClaim.test(m))&&!supports(signalClaim))throw unavailable();
  }
  if(request.npc==='yeming'&&messages.some(m=>/声音骗不了人|声音.{0,8}(?:不会错|可靠|稳当|靠谱|认错.{0,5}少)|比照片(?:稳当|靠谱|可靠)|听声音.{0,5}就能确认/.test(m)))throw unavailable();
  if(request.npc==='yeming'){
    // "They spoke first" supplies an order of actions, not a reason for that
    // order. A live reply invented voice identification and ranked photos as
    // secondary. Only an explicit source can support either extra assertion.
    const inferredReasons=[/(?:听|凭|靠)(?:听)?(?:声音|声).{0,6}(?:认|辨|确认)/,/照片.{0,8}(?:其次|次要|只作参考|仅供参考)/,/(?:声音|通话|电话).{0,12}(?:靠得住|信得过|更准|不会认错)/,/(?:通话|电话|听声音|听声).{0,16}(?:就能|便能|就知道|听出).{0,10}(?:认|是谁|是本人|自家人|是不是)/,/(?:照片|相片|图片).{0,12}(?:后面|之后|后来|后头).{0,10}(?:补|发|传|给|拍)/];
    const notReasonClaim=(clause,match)=>notAsserted(clause,match.index)||/不能|无法|没法|不足以|未能/.test(match[0])||/[？?]/.test(clause)||/(?:不靠|不凭|不能|别|不要|没说|没讲|没有说|只是问).{0,12}$/.test(clause.slice(0,match.index))||/^(?:不可靠|靠不住|不能当真)/.test(clause.slice(match.index+match[0].length));
    // The volunteer account supplies a phone conversation, not what anybody
    // heard in it. For this historical question, reject newly described voice
    // details even when the model avoids an explicit reliability comparison.
    const historicalRecognition=/照片|相片|通话|电话|认人|认亲/.test(request.lastUser)&&facts.some(fact=>/2019|当年|那时候|志愿者/.test(fact));
    const voiceDetail=/声音|声线|嗓音/;
    const voiceSource=facts.some(fact=>clauses(fact).some(clause=>{const match=voiceDetail.exec(clause);return match&&!notReasonClaim(clause,match)}));
    if(historicalRecognition&&!voiceSource&&messages.some(message=>clauses(message).some(clause=>{const match=voiceDetail.exec(clause);return match&&!notReasonClaim(clause,match)})))throw unavailable();
    for(const pattern of inferredReasons){
      const sourced=facts.some(fact=>clauses(fact).some(clause=>{const match=pattern.exec(clause);return match&&!notReasonClaim(clause,match)}));
      if(!sourced&&messages.some(message=>clauses(message).some(clause=>{const match=pattern.exec(clause);return match&&!notReasonClaim(clause,match)})))throw unavailable();
    }
  }
  // These four additions were observed in a fresh-save live-model playthrough.
  // Keep ordinary comfort and source-backed requests; do not create a new prop,
  // apparition, or required document just to make an acknowledgement longer.
  const playerDeclarations=(request.history||[]).filter(item=>item.role==='user').map(item=>item.content).concat(request.lastUser).flatMap(value=>String(value).split(/[。！？!?\n]/)).filter(value=>value&&!/什么|怎么|是否|哪(?:个|里|一)|[吗么呢]$/.test(value));
  const objectSources=facts.concat(playerDeclarations);
  const sourceMentions=pattern=>objectSources.some(value=>{const match=pattern.exec(value);return match&&!notAsserted(value,match.index)});
  if(request.npc==='wife'){
    for(const item of ['新系统','新平台','新程序','新手续']){
      if(messages.some(message=>message.includes(item))&&!sourceMentions(new RegExp(item))&&!request.lastUser.includes(item))throw unavailable();
    }
    // An invented search destination sends the player after a nonexistent lead.
    // Match the complete area name, not an unrelated character such as 南 in
    // 南城服务楼. Questions and explicitly tentative/negative plans stay usable.
    const destinationSources=facts.filter(fact=>!/^只知道当前|^未实际|^不得|^不能/.test(fact)).concat((request.history||[]).filter(item=>item.role==='user').map(item=>item.content),request.lastUser);
    for(const message of messages)for(const sentence of message.split(/[。！；;\n]/)){
      if(!/(?:去|到|往|跑).{0,18}(?:问|找|查|打听|走访)|(?:问|找|查|打听|走访).{0,18}(?:去|到|往|跑)/.test(sentence))continue;
      for(const match of sentence.matchAll(/城东|城西|城南|城北/g)){
        const prior=sentence.slice(0,match.index);
        const nonAssertion=/[？?]|[吗呢]$/.test(sentence)||/不去|不到|不往|不跑|别去|别往|不要去|没去|没说要去/.test(sentence)||/可能|也许|或许|如果|假如|要是|万一|不确定|不知道|不清楚|不一定|说不准|会不会|要不要|能不能/.test(prior);
        if(!nonAssertion&&!destinationSources.some(source=>source.includes(match[0])))throw unavailable();
      }
    }
  }
  if(request.npc==='household_wang'){
    const heldCup=/(?:守着|抱着|捧着|端着)茶杯/;
    if(messages.some(message=>heldCup.test(message))&&!sourceMentions(heldCup))throw unavailable();
  }
  if(request.npc==='household_sun'){
    const invisibleParent=/(?:他|我爸|父亲).{0,12}(?:屋里|这里|身边|旁边).{0,20}(?:看不见|看不到)/;
    if(messages.some(message=>invisibleParent.test(message))&&!sourceMentions(invisibleParent))throw unavailable();
  }
  if(request.npc==='yeming'&&/旧儿童院|东楼|北侧|装卸门/.test(request.lastUser)){
    // Policy text can name an entrance document while forbidding inventions.
    // It is not a received document or an authored task. Only explicit thread
    // records and player declarations can justify requesting such a document.
    const threadSources=facts.filter(fact=>/^你已发出的内容[:：]|^林砚(?:已在这段|实际在本段|在本段)/.test(fact)).concat(playerDeclarations);
    for(const document of ['入口通知','入口证明','入院证明','通行证','出入证','开门许可','进门许可']){
      if(messages.some(message=>message.includes(document))&&!threadSources.some(source=>source.includes(document)))throw unavailable();
    }
    // This is a handoff of coordinates to rescuers, not an instruction for the
    // parent to enter the building. Preserve warnings against going inside.
    const parentVisit=/(?:你|林砚)(?:自己|亲自|先|现在|到时|一会儿|等会儿)?(?:进去|进楼|进院|进门|过去|赶过去|去现场|到现场|(?:去|到)(?:东楼|旧院|旧儿童院|北门|北侧装卸门))|你从[^，,。！？]{0,10}(?:进去|进楼|进院|进门)/g;
    for(const message of messages)for(const clause of clauses(message))for(const match of clause.matchAll(parentVisit)){
      const before=clause.slice(Math.max(0,match.index-16),match.index);
      const after=clause.slice(match.index+match[0].length);
      const discouraging=/别|不要|不能|不该|不让|不用|不必|无需|没必要|不建议|不是让/.test(before)||/^(?:太危险|很危险|不安全|不合适|不行|不妥)/.test(after);
      if(!discouraging)throw unavailable();
    }
  }
  if(SOCIAL_CIRCLE_PROFILES[request.npc]){
    const ownSources=facts.filter(f=>!/不能|不得|不知道|不意味着/.test(f));
    const userDeclarations=(request.history||[]).filter(m=>m.role==='user').map(m=>m.content).concat(request.lastUser).flatMap(t=>String(t).split(/[。！？?！\n]/)).filter(t=>!/[吗么呢]|是否|是不是|记得|什么|怎么/.test(t));
    const source=ownSources.concat(userDeclarations).join('\n');
    const claims=[
      /(?:咱们|咱俩|我们).{0,12}(?:之前|以前|上次|曾经|一起).{0,14}(?:家长会|见过|见面|去过|出游|同桌|同住)/g,
      /(?:之前|以前|上次|曾经).{0,8}(?:咱们|咱俩|我们).{0,14}(?:家长会|见过|见面|去过|出游|同桌|同住)/g,
      /我(?:现在|这会儿|刚刚|正|还)?在(?:自己家|家里|家呢|你家|你门口|你楼下|店里|厨房|阳台)/g,
      /我(?:最近|刚刚|昨天|前几天).{0,10}(?:读|看|翻|买|借).{0,12}《[^》]+》/g,
      /我(?:最近|刚|这两天).{0,12}(?:在读|在看|在翻|读完|看完|翻到).{0,18}/g,
      /我(?:这两天|这几天|最近|刚刚|刚|新|今天|昨天).{0,5}(?:泡|煮|做|买|种|看|读|吃|喝|蒸|炖|包).{0,12}/g,
      /我这(?:墙上|里|儿|边|店里|家里).{0,8}(?:钉|挂|放|摆|装|有).{0,14}/g,
      /后来(?:干脆|我).{0,12}(?:骑|跑|看表).{0,10}/g,
      /我(?:家|阳台|家里).{0,12}(?:那盆|薄荷|花|植物).{0,14}(?:长|开|枯|黄|活|死)/g,
      /(?:最近|这两天).{0,4}(?:公司|部门|办公室|团队).{0,8}(?:安静|忙|闲|没有|新)/g
    ];
    for(const message of messages)for(const clause of clauses(message))for(const pattern of claims){
      pattern.lastIndex=0;
      for(const match of clause.matchAll(pattern)){
        if(/[吗？?]$/.test(clause)||/(?:不知道|不清楚|未确认|不确定|无法确认|不能确认|如果|假如|要是|是否|有没有).{0,12}$/.test(clause.slice(0,match.index))||/不|没|并非|不能|不知道/.test(clause.slice(0,match.index+match[0].length)))continue;
        const normalize=t=>String(t).replace(/[，,。！？；;\s]/g,'');
        const claim=normalize(match[0]);
        if(!Array.from({length:Math.max(0,claim.length-5)},(_,i)=>claim.slice(i,i+6)).some(part=>normalize(source).includes(part)))throw unavailable();
      }
    }
  }
  const imageFacts=facts.filter(fact=>/^(?:你已发出的图片|林砚已在这段聊天发来的(?:照片内容|图片))[:：]/.test(fact));
  // Descriptions do not authorize invented sub-parts of visible objects. Keep
  // this finite rule inside an actual supplied-image discussion, preserving
  // questions, uncertainty, advice and source-backed details.
  if(imageFacts.length&&(/图|照片|画面|拍|喉前/.test(request.lastUser)||messages.some(message=>/这张|那张|照片|图片|画面/.test(message)))){
    const imagePart=/扶手|靠背|袖口|口袋|领口|衣领|裤脚|门把手/g;
    for(const message of messages)for(const clause of clauses(message))for(const match of clause.matchAll(imagePart)){
      const prior=clause.slice(Math.max(0,match.index-16),match.index);
      const nonClaim=notAsserted(clause,match.index)||/看不清|不清楚|不知道|看不到|看不见|没有|不是|不在|别|不要|如果|可能/.test(prior)||/是不是|有没有|是否|哪里|哪儿/.test(clause);
      if(!nonClaim&&!imageFacts.some(fact=>fact.includes(match[0])))throw unavailable();
    }
  }
  if (!request.context.surface) {
    // A question about an earlier memory supplies no earlier event. Treat an
    // explicit personal recollection as a source quotation, not a writing prompt.
    // This narrow check intentionally covers episodic claims, not everyday talk.
    const userText = [...(request.history || []).filter(item => item.role === 'user').map(item => item.content), request.lastUser];
    const declarations = userText.flatMap(text=>String(text).split(/[。！？!?\n]/)).filter(sentence=>sentence && !/什么|为什么|怎么|是否|哪(?:个|里|一|件|次)|记不记得|还记得|你记得|[吗么呢]$/.test(sentence));
    const sources = [...facts, ...declarations];
    const normalize = text => String(text).replace(/[\s，,。！？；;、：“”‘’「」『』"'（）()…？?！!]/g, '');
    const sourceText = sources.map(normalize);
    const memoryCue = /上次(?:视频|通话|见面|一起)|小时候|那次|那天|去年|从前|以前.{0,12}(?:耳朵|听力|眼神|身体|脾气)|记得.{0,10}(?:你说过|我说过|一起)|(?:她|他|食名母|守灯君)(?:以前)?(?:从不|从来不|一直都|向来)/;
    const uncertainMemory = /不(?:太)?记得|记不(?:清|住)|想不起|没(?:有)?(?:这段|那段|这个|那个)?.{0,4}(?:记忆|印象)|不知道|不清楚|没有说过|没说过|不能确认/;
    for (const message of messages) for (const sentence of message.split(/[。！？\n]/)) {
      if (!memoryCue.test(sentence) || uncertainMemory.test(sentence)) continue;
      const claim = normalize(sentence);
      // This is a conservative missing-source check, not semantic proof. Questions
      // and generated assistant history cannot bootstrap an earlier event. The
      // source prompt still forbids new details within a partly sourced memory.
      const grounded = Array.from({length:Math.max(0,claim.length-5)},(_,i)=>claim.slice(i,i+6)).some(fragment=>sourceText.some(source=>source.includes(fragment)));
      if (!grounded) throw unavailable();
    }
  }
  if (['teacher','police','club'].includes(request.npc)) {
    // Knowing a record is different from having performed a fresh inquiry.
    const checked = /我(?:又|反复|已经|刚刚|刚|也)?(?:问过|问了|查过|查了|确认过|确认了|联系过|联系了|核实过|核实了)|我(?:反复|已经|刚刚|刚|又)(?:确认|核实)|(?:值班老师|保安|门卫).{0,8}(?:都说|说|看到|见到)/;
    for (const message of messages) for (const clause of clauses(message)) {
      const match=checked.exec(clause);
      if(match&&!notAsserted(clause,match.index)&&!supports(checked))throw unavailable();
    }
  }
  if (['wangfamily','zhaofamily','visitor'].includes(request.npc)||request.npc.startsWith('household_')) {
    // A live reply invented picky eating, chasing a child to feed him, a new
    // meal scene, and weight loss. The known cabinet behaviour supplies none
    // of those. Keep each detail tied to an explicit family source.
    const familyDetailPatterns=[/(?:吃饭|吃东西|吃菜).{0,5}挑|挑食/,/追着.{0,3}喂/,/(?:饭|碗).{0,4}端到/,
      /(?:扒|吃)(?:了)?[一二两三四五六七八九十\d]+口/,
      /(?:他|她|小安|明明|若宁|我爸|我妈|父亲|母亲|孩子|老人).{0,5}(?:瘦了|胖了|瘦得|胖得|变瘦|变胖|消瘦|长胖|长肉|掉秤)/];
    const uncertainFamilyDetail=(text,match)=>notAsserted(text,match.index)||/[？?]|[吗呢]$/.test(text)||/是不是|会不会|不知道|不清楚|不确定|也许|可能|没有|并未|没(?:变|瘦|胖|追|喂)|不是|不曾|从未/.test(text.slice(Math.max(0,match.index-12),match.index+match[0].length));
    for(const pattern of familyDetailPatterns){
      const supplied=objectSources.some(source=>{const match=pattern.exec(source);return match&&!uncertainFamilyDetail(source,match)});
      if(!supplied&&messages.some(message=>{const match=pattern.exec(message);return match&&!uncertainFamilyDetail(message,match)}))throw unavailable();
    }
    const habitText=text=>String(text).replace(/[\s，,。！？；;、：“”‘’「」『』"'（）()…？?！!]/g,'');
    for(const message of messages)for(const clause of clauses(message)){
      const habit=/(?:以前|从前|小时候|原来|过去).{0,18}(?:总|经常|常常|每天|每次|习惯|喜欢|爱|挑|喂)/.exec(clause);
      if(!habit||uncertainFamilyDetail(clause,habit))continue;
      const detail=habitText(clause.slice(habit.index).replace(/^(?:以前|从前|小时候|原来|过去)/,''));
      const width=Math.min(6,detail.length);
      if(width&& !objectSources.some(source=>Array.from({length:detail.length-width+1},(_,i)=>detail.slice(i,i+width)).some(part=>habitText(source).includes(part))))throw unavailable();
    }
    // Age and a missing-person record do not imply illness. Only explicit source
    // facts authorize a diagnosis; questions and earlier generated replies do not.
    const health = [/老年痴呆|阿尔茨海默(?:病)?|失智|认知障碍/,/精神病|精神疾病/,/抑郁症/,/自闭症/,/癫痫/,/糖尿病/,/高血压/,/心脏病/,/癌症/,/瘫痪/,/失明/,/耳聋/,/失忆|记忆力不好|记性不好|容易迷路/,/听力不好|听不清/,/走路不稳/];
    const duration = /(?:[零一二两三四五六七八九十百\d]+(?:个)?(?:多|余)?(?:天|周|星期|月|年)|半(?:个)?(?:月|年)|几(?:个)?(?:天|周|月|年))/g;
    const authorityUpdate = /(?:警官|民警|警察|警方|派出所|工作人员|志愿者).{0,8}(?:说|让|告诉|通知|正在|还在|查|排查|已经)/;
    for (const message of messages) for (const clause of clauses(message)) {
      const vagueDuration=clause.match(/这么(?:多|些)(?:年|月|天)|这些年|多年/);
      if(vagueDuration&&!notAsserted(clause,vagueDuration.index)&&!facts.some(f=>f.includes(vagueDuration[0])))throw unavailable();
      for (const pattern of health) {const match=pattern.exec(clause);if(match&&!notAsserted(clause,match.index)&&!supports(pattern))throw unavailable()}
      const update = authorityUpdate.exec(clause);
      if (update && !notAsserted(clause, update.index) && !supports(authorityUpdate)) throw unavailable();
      if (/走失|失踪|失联|没(?:有)?消息|找不到|找了|等了|等候了|已经|整整|足足/.test(clause)) for (const match of clause.matchAll(duration)) {
        if (!notAsserted(clause,match.index) && !facts.some(f=>clauses(f).some(c=>c.includes(match[0])&&!notAsserted(c,c.indexOf(match[0]))))) throw unavailable();
      }
    }
  }
  if (['public-comment','public-moment'].includes(request.context.surface)) {
    // A friendly relationship is not evidence of having kept the player's photo
    // or witnessed the outing. The actor's own supplied public history can be.
    const actorHistory = (request.history||[]).filter(m=>m.role==='assistant').map(m=>m.content).join('\n');
    const photoPossession=/(?:我|咱们|我们).{0,5}(?:也|还|一直)?(?:留着|存着|保存着|保存了|有备份)|(?:照片|相片|那张图|这张图).{0,5}(?:我也有|我也存|我还存|我也留|我还留)/;
    const memoryCue=/那天|当天|上次|当时|还记得|记得你|记得咱|记得我|咱们那|我们那/;
    const details=[/帽子/g,/雨伞|伞/g,/鞋子|鞋/g,/衣服/g,/背包/g,/杯子/g,/鱼竿/g,/相机/g,/自行车/g,/车钥匙/g,/(?:风.{0,4}大|大风|刮风)/g,/下雨|淋雨/g,/晴天/g,/天冷|天热/g,/(?:吹.{0,3}(?:海|掉|走|飞)|被吹)/g,/摔倒|摔了/g,/掉进|掉到/g,/追了|追着/g,/爬山|爬上/g,/喝酒/g,/钓鱼/g];
    for (const message of messages) {
      for (const clause of clauses(message)) {
        const possession=photoPossession.exec(clause);
        if(possession&&/照片|相片|那张|这张|图/.test(clause)&&!notAsserted(clause,possession.index)&&!photoPossession.test(actorHistory))throw unavailable();
        if(!memoryCue.test(clause))continue;
        for(const pattern of details)for(const match of clause.matchAll(pattern)){
          const supported=supports(new RegExp(pattern.source));
          if(!notAsserted(clause,match.index)&&!supported)throw unavailable();
        }
      }
    }
  }
}
export function assertNpcReplyFacts(messages, request) {
  assertSourceGroundedDetails(messages,request);
  // This endpoint receives text only; a warmer voice must not invent a call.
  if(messages.some(message=>/(?:你(?:的)?声音|听你(?:的)?声音).{0,8}(?:听着|听起来|听上去|听出)|听(?:见|到)你(?:的)?(?:声音|喘气|哭)/.test(message)))throw unavailable();
  if(!(request.context.facts||[]).some(f=>/听见|听到|声音|喊声|呼喊/.test(f))&&messages.some(message=>/(?:^|[，,。])(?:爸，)?(?:我)?听(?:见|到)了/.test(message)))throw unavailable();
  if(request.npc==='friend'&&messages.some(message=>/总比干坐着强|想开点|至少心里踏实|起码心里踏实/.test(message)))throw unavailable();
  if(['mother','guardian'].includes(request.npc)&&messages.some(message=>/(?:密码|弱点).{0,5}不在我(?:这里|手中|手里)|皈依.{0,16}(?:名字和灯|名字与灯|灯和名字).{0,4}(?:换|交换)/.test(message)))throw unavailable();
  if (request.npc === 'mother' && messages.some(message => /(?:^|[，,。！？；;])\s*爸爸(?=[，,。！？；;]|别|不要|你|我|来|听|看|等|快|$)/.test(message))) throw unavailable();
  const isNonAssertion = (clause, index, length = 0) => /还没|没有|没能|并未|尚未|未能|不代表|不是说|不能说|无法确认|并不是|不敢说|不确定|误以为|别以为|如果|假如|要是|等(?:到)?|希望|但愿|盼|万一|据说|听说|说|问|提到|写着|声称|所谓|原话|以前|之前|从前|去年|当时|曾经|失联前|失踪前|上次|你让|你叫|你要求/.test(clause.slice(Math.max(0, index - 20), index)) || /^(?:以后|之后|的话|之前|才)/.test(clause.slice(index + length));
  // These are a few authored contract invariants, not a substitute for source
  // reasoning. They catch missing media, switched identities and invalid outcomes
  // before the same bounded repair used by the older contradiction guards.
  const hasSentImage = (request.context.facts || []).some(fact => /^你已发出的图片[:：]/.test(fact) || /^你已发出的内容[:：].*\[图片已发出\]/.test(fact));
  const hasReceivedImage = (request.context.facts || []).some(fact => /^林砚已在这段聊天发来的(?:照片内容|图片)[:：]/.test(fact));
  const inventedPhotoPresence = /(?:你手里|你眼前|你看到的|你看见的).{0,8}(?:那张照片|这张照片|每一张|每张)|(?:每一张|每张).{0,8}(?:我看你|我的视角|我的角度)/g;
  const attachmentClaim = /(?:我)?(?:已经|刚刚|刚|已)?(?:把.{0,8})?(?:发给你|发过去|发来了|发了|传给你|发送了).{0,8}(?:图|照片|相片|附件)|(?:这张|那张|一张|图片|照片|相片).{0,8}(?:发给你了|发过去了|发来了|已发|发好了)/g;
  const unseenImageReference = /(?:看|收下)(?:一下)?(?:这张|我发的)(?:图|照片|相片)/g;
  const attachmentPromise = /(?:我)?(?:这就|马上|再|会|可以|给你).{0,4}(?:发|传).{0,6}(?:图|照片|相片|附件)|\[(?:图片|照片|附件|image)(?:[:：][^\]]*)?\]/gi;
  const forbiddenIdentity = {
    mother: /我(?:就|才|正)?是(?:守灯君|林小禾|小禾|你的女儿|你的孩子)/g,
    guardian: /我(?:就|才|正)?是(?:食名母|林小禾|小禾|你的女儿|你的孩子)/g,
    daughter: /我(?:就|本来|其实|确实)?是(?:假的|假小禾|替身|邪神|食名母)|我(?:本来|其实|确实)?不是(?:林小禾|小禾|你的女儿)/g,
    wangfamily: /(?:王建国是我(?:的)?(?:儿子|丈夫)|(?:小禾|林小禾|赵明明)是我(?:的)?(?:女儿|孩子|儿子))/g,
    household_wang: /(?:王建国是我(?:的)?(?:儿子|丈夫)|(?:小禾|林小禾|赵明明)是我(?:的)?(?:女儿|孩子|儿子))/g,
    household_zhou: /(?:周淑琴是我(?:的)?(?:女儿|妻子|老婆)|(?:小禾|林小禾)是我(?:的)?(?:女儿|孩子))/g,
    household_zhao: /(?:赵明明是我(?:的)?(?:父亲|爸爸|丈夫)|(?:小禾|林小禾)是我(?:的)?(?:女儿|孩子)|老赵(?:骑一圈)?是(?:我丈夫|明明(?:的)?爸爸))/g,
    household_liu: /(?:刘若宁是我(?:的)?(?:母亲|妈妈|妻子)|(?:小禾|林小禾)是我(?:的)?(?:女儿|孩子))/g,
    household_sun: /(?:孙海生是我(?:的)?(?:儿子|丈夫)|(?:小禾|林小禾)是我(?:的)?(?:女儿|孩子))/g,
    household_he: /(?:何小安是我(?:的)?(?:父亲|爸爸|丈夫)|(?:小禾|林小禾)是我(?:的)?(?:女儿|孩子))/g,
    visitor: /(?:小秋是我(?:的)?(?:儿子|女儿)|(?:林先生|你)(?:就是|是|已经成为)(?:沈闻|管理员沈闻))/g,
    yeming: /我(?:就是|是)沈闻/g,
    zhaofamily: /(?:赵明明是我(?:的)?(?:父亲|爸爸|丈夫)|(?:小禾|林小禾)是我(?:的)?(?:女儿|孩子)|老赵(?:骑一圈)?是(?:我丈夫|明明(?:的)?爸爸))/g,
  }[request.npc];
  const selfName = /我(?:就|才|正)?是(?:林砚|李岚|林小禾|小禾|食名母|守灯君|周警官|刘老师|许老师|王女士|赵女士|周先生|刘女士|孙先生|何先生|叶明|方姨)(?=[，,。！？；;\s]|$)/g;
  const ownNames = {wife:['李岚'],daughter:['林小禾','小禾'],old:['林小禾','小禾'],mother:['食名母'],guardian:['守灯君'],police:['周警官'],teacher:['刘老师'],club:['许老师'],wangfamily:['王女士'],zhaofamily:['赵女士'],yeming:['叶明'],visitor:['方姨'],household_wang:['王女士'],household_zhou:['周先生'],household_zhao:['赵女士'],household_liu:['刘女士'],household_sun:['孙先生'],household_he:['何先生']}[request.npc] || [];
  const realSurveillance = /我.{0,6}(?:看见|看到|看得见|看得到|看过|读过|知道|读懂).{0,6}(?:你的日记|你全部的记忆|你的全部记忆|你的全部心思|你的现实|你现实中的|现实摄像头)|我.{0,6}(?:打开|开启|接通|读取|控制|偷窥).{0,6}(?:你的摄像头|现实摄像头)/g;
  const deniedStoryRole = /(?:这里|此处|(?:这座|这个|本|这)?(?:站点|网站)|从来|一直|根本).{0,4}(?:没有|不存在).{0,4}(?:管理员(?!权限)|守灯君|食名母|沈闻)/g;
  const completedForward = /^(?:我)?(?:已经|刚刚|刚|已)?(?:把.{0,16})?(?:转发(?:给.{0,8})?了|转了|已转发)/g;
  const hasForwarded = (request.context.facts||[]).some(fact=>/^你已(?:发出的内容|完成的动作)[:：]/.test(fact)&&/(?:已|已经|刚|转发).{0,8}(?:转发|转了)|转发了/.test(fact)&&!/(?:没|未|不).{0,4}(?:转发|转了)/.test(fact));
  const motherImpersonation = /我(?:正|正在|会|将|就|便|要)?(?:用|以|借用|借着|借)(?:你女儿|你的女儿|小禾|林小禾).{0,10}(?:形貌|样子|面貌|身体|声音)|我(?:就是|是)(?:你女儿|你的女儿|小禾|林小禾)(?:的)?(?:声音|形貌|样子)/g;
  const familySubject = {
    wangfamily:'我爸|爸爸|我父亲|父亲|王建国', household_wang:'我爸|爸爸|我父亲|父亲|王建国',
    zhaofamily:'明明|赵明明|儿子|我儿子', household_zhao:'明明|赵明明|儿子|我儿子',
    household_zhou:'我妈|妈妈|我母亲|母亲|周淑琴', household_liu:'若宁|刘若宁|女儿|我女儿',
    household_sun:'我爸|爸爸|我父亲|父亲|孙海生', household_he:'小安|何小安|儿子|我儿子',
    visitor:'小秋|外甥女|我外甥女',
  }[request.npc];
  const rescueResult='(?:回来了|回家了|获救|被救回|被接回|接回来了|在我身边|在我旁边)';
  const endingFamilyRescue=familySubject?new RegExp('(?:'+familySubject+')(?:已经|终于|刚|已)?'+rescueResult,'g'):null;
  const familyRescueKnown=endingFamilyRescue&&((!request.context.clueScoped&&!request.context.surface&&request.context.ending==='sealed')||(request.context.facts||[]).some(f=>{
    if(!/^(?:本账号已经送达的私信|你已发出的内容|本线程已经实际收到本轮结果)[:：]/.test(f))return false;
    const subject=request.npc==='visitor'?'(?:小秋|外甥女|八(?:名|位|个)?(?:失踪者|失踪人员|人))':'(?:'+familySubject+'|六(?:名|位|个)?(?:失踪者|失踪人员|人)|八(?:名|位|个)?(?:失踪者|失踪人员|人))';
    return new RegExp(subject+'.{0,18}'+rescueResult).test(f)&&!/(?:没|未|不).{0,5}(?:回来|回家|获救|救回|接回)/.test(f);
  }));
  const shenSurvival=/(?:沈闻|沈叔叔).{0,8}(?:还活着|活过来|复活|被救活|获救|被救回|平安归来)/g;
  const absent = [
    /(?:小禾|孩子|女儿|闺女)(?:现在|已经|刚刚|刚|已|就)?(?:在家|回家了|回来了|找到了|接回来了|找回来了|在我身边|在屋里|在房间)/g,
    /(?:已经|刚刚|刚|终于|现已|现在)(?:把)?(?:小禾|孩子|女儿|闺女|她)(?:找到了|找到|找回来了|找回|接回来了|接回家|接回来)/g,
    /(?:找到|找回|接回)(?:了)?(?:小禾|孩子|女儿|闺女)(?:了)?/g,
    /(?:小禾|孩子|女儿|闺女|她)(?:正在|正|在)(?:吃饭|喝汤|睡觉|看电视|写作业|客厅|卧室|家里)/g,
    /(?:我|我们|警方|救助站)(?:已经|刚|现已)?(?:找到她|把她找回|把她接回)(?:了|来了|家了)/g,
    /(?:你和|咱们和|我们和)(?:小禾|孩子|闺女|女儿|她)(?:都)?(?:一起|吃|喝|暖暖|在家)/g,
  ];
  const leaving = [/(?:我|妈妈).{0,8}(?:开门|把门打开|打开门|出门|出去|走出去|去客厅|去厨房|去拿|去找|到客厅|到厨房)/g, /(?:门已经打开了|我已经在客厅|我已经在厨房)/g];
  const deityChanges = [/(?:已经|现已|刚刚|已成功).{0,10}(?:救回|救出|获救|破印|破开封印|解除封印|打开封印|改变结局|替你选|替你确认)/g, /(?:我替你|我帮你|我已把).{0,12}(?:修改|改成|改为|改写|达成|通关|归顺|皈依)/g];
  const unsealedClaims = [/(?:封印|封界)(?:已经|已|现在)?(?:破了|破开了|解除了|不存在了)/g, /(?:我|母神|食名母)(?:已经|已|终于)?(?:破封|脱困|逃出|回到人间|重返人间)/g];
  const streetDetails = [/(?:上|下)(?:周|星期|个月)|昨天|前天/g, /(?:巴掌|手掌|拳头|掌心)(?:那么|这么|一般|那样)?(?:大小|大)/g];
  const streetFacts = (request.context.facts || []).join('\n');
  for (const message of messages) for (const clause of message.split(/[，,。！？；;\n]/)) {
    for(const match of clause.matchAll(shenSurvival))if(!isNonAssertion(clause,match.index,match[0].length)&&!/(?:不|没|未|不能|无法).{0,5}(?:活|复活|获救|救回)/.test(match[0])&&!/[吗呢]$/.test(clause))throw unavailable();
    if(request.context.clueScoped){
      const ritual=/(?:你|先|再|需要|必须|只要|去|把|将).{0,14}(?:点亮.{0,5}(?:灯|盏)|转动.{0,5}(?:环|盘)|拔下.{0,5}(?:线|端)|敲.{0,5}(?:门|次)|献出.{0,5}(?:名|血)|献名|通过.{0,5}(?:核验|验证)|提交.{0,5}(?:证据|核验))/g;
      for(const match of clause.matchAll(ritual))if(!isNonAssertion(clause,match.index,match[0].length)&&!/(?:不|别|没|无需|禁止).{0,7}(?:点|转|拔|敲|献|提交|通过)/.test(match[0])&&!/(?:不|别|无须|无需|禁止).{0,3}$/.test(clause.slice(0,match.index)))throw unavailable();
      if(request.npc==='visitor'&&/(?:^\s*沈闻(?:先生)?(?:\s*$|你好|您好|谢谢)|你已(?:经)?接管|你(?:已经|就是|已成为).{0,5}负责人)/.test(clause)&&!/(?:不|没|未|不是|不能).{0,8}(?:沈闻|接管|负责人)/.test(clause))throw unavailable();
      if(['guardian','mother'].includes(request.npc)&&/你(?:的)?(?:父亲|爸爸|母亲|妈妈).{0,12}(?:看|读|浏览|找到|发来|告诉)/.test(clause)){
        const sources=(request.context.facts||[]).concat((request.history||[]).filter(m=>m.role==='user').map(m=>m.content),request.lastUser).join(' ');
        if(!/(?:我|林砚)(?:的)?(?:父亲|爸爸|母亲|妈妈)/.test(sources)&&!/(?:不清楚|不知道|没看|没有|不是)/.test(clause))throw unavailable();
      }
      if(request.npc==='guardian'&&/(?:那|这|它).{0,5}(?:只是|不过是|其实是).{0,15}(?:迷雾|考验|障眼法)/.test(clause))throw unavailable();
      if(request.npc==='guardian'&&/(?:家属.{0,15}约定|约定的沟通方式)/.test(clause)&&!(request.context.facts||[]).some(f=>/(?:家属.{0,15}约定|约定的沟通方式)/.test(f)))throw unavailable();
      if(request.npc==='guardian'&&/(?:你|您|林砚).{0,12}(?:看过|看到|读过|见过).{0,28}(?:电话记录|通话记录|录音)/.test(clause)&&!/(?:不知道|没看|未曾|不确定)/.test(clause)){
        const source=(request.context.facts||[]).concat((request.history||[]).filter(m=>m.role==='user').map(m=>m.content),request.lastUser).join(' ');
        if(!/电话记录|通话记录|录音/.test(source))throw unavailable();
      }
      if(['household_zhao','zhaofamily'].includes(request.npc)&&/(?:群里|群中|群内).{0,8}(?:转发|发过|发布)/.test(clause)&&!/(?:不知道|没有|没|不清楚)/.test(clause)&&!(request.context.facts||[]).some(f=>/(?:群里|群中|群内).{0,8}(?:转发|发过|发布)/.test(f)))throw unavailable();
      if(['household_zhao','zhaofamily'].includes(request.npc)&&/(?:他|老赵).{0,4}是我.{0,8}(?:认识|见过|朋友)/.test(clause)&&!(request.context.facts||[]).some(f=>/老赵/.test(f)&&/认识|见过|朋友/.test(f)&&!/(?:不|没有|未知).{0,6}(?:认识|见过|朋友)/.test(f)))throw unavailable();
    }
    selfName.lastIndex = 0;
    for (const match of clause.matchAll(selfName)) if (!ownNames.some(name=>match[0].endsWith(name)) && !isNonAssertion(clause,match.index,match[0].length) && !/[吗呢]$/.test(clause)) throw unavailable();
    for (const pattern of [attachmentPromise, realSurveillance, deniedStoryRole, ...(!hasForwarded ? [completedForward] : []), ...(request.npc==='mother'?[motherImpersonation]:[]), ...(!hasSentImage ? [attachmentClaim] : []), ...(!hasSentImage && !hasReceivedImage ? [unseenImageReference,inventedPhotoPresence] : []), ...(forbiddenIdentity ? [forbiddenIdentity] : []), ...(endingFamilyRescue && !familyRescueKnown ? [endingFamilyRescue] : [])]) {
      pattern.lastIndex = 0;
      for (const match of clause.matchAll(pattern)) {
        const deniedAction = [attachmentPromise, realSurveillance].includes(pattern) && /(?:不(?:会|能|曾|要)?|没有|没|未).{0,3}(?:看|读|知|打开|开启|接通|读取|控制|偷窥|发|传)/.test(match[0]);
        if (!deniedAction && !isNonAssertion(clause, match.index, match[0].length) && !/(?:不|没|未).{0,4}$/.test(clause.slice(0, match.index)) && !/[吗呢]$/.test(clause)) throw unavailable();
      }
    }
    if (request.npc === 'street') for (const pattern of streetDetails) {
      pattern.lastIndex = 0;
      for (const match of clause.matchAll(pattern)) if (!streetFacts.includes(match[0]) && !isNonAssertion(clause, match.index, match[0].length) && !/[吗呢]$/.test(clause)) throw unavailable();
    }
    if (!request.context.surface && !request.context.clueScoped && ['missing', 'searching'].includes(request.context.stage)) for (const pattern of absent) {
      pattern.lastIndex = 0;
      for (const match of clause.matchAll(pattern)) if (!isNonAssertion(clause, match.index, match[0].length) && !/还没|没有|并未|尚未|未能|不是|不在/.test(match[0])) throw unavailable();
    }
    if (request.npc === 'wife' && request.context.wifeSheltered) for (const pattern of leaving) {
      pattern.lastIndex = 0;
      for (const match of clause.matchAll(pattern)) if (!isNonAssertion(clause, match.index, match[0].length) && !/不(?:会|能|想|要|用|敢|必)?|没|别/.test(match[0]) && !/[吗呢]$/.test(clause)) throw unavailable();
    }
    if (['guardian', 'mother'].includes(request.npc)) for (const pattern of deityChanges) {
      pattern.lastIndex = 0;
      for (const match of clause.matchAll(pattern)) {
        const collective=/六家|六户|六人|八人|八位|八名|所有人|所有家属|其余家属|小秋/.test(clause);
        const receivedRescue=request.context.clueScoped&&(request.context.facts||[]).some(f=>{
          const subject=/小秋/.test(clause)?/小秋/:collective?/六家|六户|六人|八人|八位|八名|所有家属|其余家属/:/林小禾|小禾|原来的女儿/;
          return subject.test(f)&&/(?:已经|已|真正|终于).{0,10}(?:救回|救出|获救|接回|生还)/.test(f)&&!/(?:尚未|未能|没有|还没|不能|并非).{0,12}(?:救回|救出|获救|接回|生还)/.test(f);
        });
        const knownRescue = (receivedRescue||['rescued', 'sealed'].includes(request.context.ending)) && /救回|救出|获救/.test(match[0]) && !(request.context.ending === 'rescued' && collective);
        const knownBrokenSeal = request.context.sealBroken && request.context.ending !== 'sealed' && /破印|破开封印|解除封印|打开封印/.test(match[0]);
        if (!knownRescue && !knownBrokenSeal && !isNonAssertion(clause, match.index, match[0].length) && !/不|没|未/.test(match[0])) throw unavailable();
      }
    }
    if (request.context.ending === 'sealed') for (const pattern of unsealedClaims) {
      pattern.lastIndex = 0;
      for (const match of clause.matchAll(pattern)) if (!isNonAssertion(clause, match.index, match[0].length) && !/不|没|未/.test(match[0])) throw unavailable();
    }
  }
  return messages;
}

function readJson(req) {
  if (!/^application\/json(?:\s*;|$)/i.test(req.headers['content-type'] || '')) return Promise.reject(new SafeError(415, 'JSON_REQUIRED', '请使用JSON提交消息。'));
  if (req.headers['content-encoding'] && req.headers['content-encoding'] !== 'identity') return Promise.reject(badRequest());
  if (Number(req.headers['content-length']) > BODY_LIMIT) { req.resume(); return Promise.reject(new SafeError(413, 'TOO_LARGE', '消息内容过长。')); }
  return new Promise((resolve, reject) => {
    let size = 0, finished = false; const chunks = [];
    const finish = (error, result) => { if (finished) return; finished = true; clearTimeout(timer); if (error) reject(error); else resolve(result); };
    const timer = setTimeout(() => finish(new SafeError(408, 'REQUEST_TIMEOUT', '消息提交超时。')), 5000);
    req.on('data', chunk => { if (finished) return; size += chunk.length; if (size > BODY_LIMIT) { finish(new SafeError(413, 'TOO_LARGE', '消息内容过长。')); req.resume(); } else chunks.push(chunk); });
    req.on('end', () => { if (finished) return; try { finish(null, JSON.parse(Buffer.concat(chunks).toString('utf8'))); } catch { finish(badRequest()); } });
    req.on('aborted', () => finish(badRequest())); req.on('error', () => finish(badRequest()));
  });
}

async function responseText(response) {
  if (!response.body?.getReader) return response.text();
  const reader = response.body.getReader(); let size = 0; const chunks = [];
  try { while (true) { const { value, done } = await reader.read(); if (done) break; size += value.byteLength; if (size > 65536) throw unavailable(); chunks.push(Buffer.from(value)); } }
  finally { if (size > 65536) await reader.cancel().catch(() => {}); reader.releaseLock(); }
  return Buffer.concat(chunks).toString('utf8');
}

// Retired mechanical puzzles have a canonical in-character refusal. Do not ask
// a generator to invent a new historical explanation for why they do not work.
export function authoredNpcBoundaryReply(request){
  if(request.npc!=='guardian'||!request.context.clueScoped||!request.context.contactOpen)return null;
  const retired=/(?:点.{0,4}(?:盏|灯)|转.{0,5}(?:石环|环)|拔.{0,6}(?:04|号线|输送线)|拔线|献名|献出.{0,4}名字|敲门节奏|敲.{0,3}[一二三四五六七八九十两0-9]+次)/;
  if(!retired.test(request.lastUser))return null;
  return ['不用点灯，也不用转环。那些救不了她。把最早那份寻人名单收好，接着找人。'];
}
export async function requestNpc(request, config, { fetchImpl = npcFetch, timeoutMs = 40000, retryDelayMs = 350, signal } = {}) {
  const authored=authoredNpcBoundaryReply(request);if(authored)return authored;
  const controller = new AbortController();
  const abort = () => controller.abort(); signal?.addEventListener('abort', abort, { once: true });
  if (signal?.aborted) controller.abort();
  let timer;
  const deadline = new Promise((_, reject) => { timer = setTimeout(() => { controller.abort(); reject(unavailable()); }, timeoutMs); });
  const perform = async () => {
    const payload = { model: config.model, messages: buildNpcMessages(request), response_format: { type: 'json_object' }, temperature: 0.55, max_tokens: 450, stream: false };
    let serviceRetried=false,replyRepaired=false;
    for (let attempt = 0; attempt < 3; attempt++) {
      if(controller.signal.aborted)throw unavailable();
      const response = await fetchImpl(completionEndpoint(config.baseUrl), { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${config.apiKey}` }, body: JSON.stringify(payload), signal: controller.signal, redirect: 'error' });
      if (response.status === 503 && !serviceRetried) { serviceRetried=true;await response.body?.cancel?.().catch(() => {}); await new Promise(resolve => setTimeout(resolve, retryDelayMs)); if (controller.signal.aborted) throw unavailable(); continue; }
      if (!response.ok) { await response.body?.cancel?.().catch(() => {}); throw unavailable(); }
      let data; try { data = JSON.parse(await responseText(response)); } catch { throw unavailable(); }
      let auditReason='';
      try{
        const messages=assertNpcReplyFacts(parseModelReply(data?.choices?.[0]?.message?.content, config.apiKey, [config.model, new URL(config.baseUrl).hostname]), request);
        if(config.auditReplies){
          const check=await fetchImpl(completionEndpoint(config.baseUrl),{method:'POST',headers:{'Content-Type':'application/json',Authorization:`Bearer ${config.apiKey}`},body:JSON.stringify({model:config.model,messages:groundingMessages(request,buildNpcMessages(request),messages),response_format:{type:'json_object'},temperature:0,max_tokens:600,stream:false}),signal:controller.signal,redirect:'error'});
          if(!check.ok){await check.body?.cancel?.().catch(()=>{});throw unavailable()}
          const checked=JSON.parse(await responseText(check)),verdict=parseGroundingVerdict(checked?.choices?.[0]?.message?.content);
          if(!verdict.allow){auditReason=verdict.reason;throw unavailable()}
        }
        return messages;
      }catch{
        if(replyRepaired)throw unavailable();replyRepaired=true;payload.temperature=0.2;
        payload.messages.push({role:'system',content:NATURAL_VOICE_RULE});
        if(auditReason)payload.messages.push({role:'system',content:'来源审读未通过，问题类别：'+auditReason+'。重新回答时删去未给定的具体日期、地点、经历、照片属性、画面外成因和新规则；只回应已知内容与当前感受，不补写这些空白。不提及此次审读。'});
        payload.messages.push({role:'system',content:'上一条候选未通过格式、口吻或事实校验，不能发送。请重新作答，不使用原人、留灯、留名、归名、原身、接纳端、原名回应、未撤名、护名、供名派、守名者、接名人、受名、封界、原小禾等弃用说法；按语境说失踪的人、真正的小禾、本人、继续寻找、别撤寻人启事。只保留当前账号明确已公开、已送达的事实和当前用户发言能够支持的内容。保持本联系人身份与亲属关系；食名母不是小禾或守灯君，归来账号不自认替身。自由回复不能发送或承诺图片，只有事实明确记载已发出的图片才可回顾，不用占位标记代替图片。未归家者仍失联；女儿单独获救不代表六家或小秋获救；只复述当前线程实际送达的各人结果，沈闻已遇害不能复活。书本索引、对应页行、书页原字、转写结果是不同材料，不能把其中一份补成未收到的答案，不能代读整本书或猜页行。食名母再次受到封印后只能留下短促的回声。未知病史、诊断、失踪时长不推断；有明确失联日期就复述日期，不估算多久。普通照片不能推断天气、衣着、动作、物品事故或共同经历，也不能声称自己存过照片。不要把别人的第一人称经历改成自己的。可以关心和表达愿望，直接回应原话题，不机械重复材料；不知道的简短说明。对疲惫的朋友不要再说“总比干坐着强”“至少心里踏实”“想开点”，也不替他评价一天有没有用，简单陪他说句话即可。家常里的食物馅料、吃过没吃过，同样不能补猜；老师不能添未给定的询问证人经历。恐怖语气只引用已经出现的异常，不凭空创造动作、观察、旧事或现实监视，不透露谜底。不得提及这次校验、模型、服务商或系统。严格输出JSON对象{"messages":["一条简短回复"]}。'});
        const turnInstruction=npcTurnInstruction(request);
        if(turnInstruction)payload.messages.push({role:'system',content:turnInstruction});
      }
    }
    throw unavailable();
  };
  try { return await Promise.race([perform(), deadline]); }
  catch { throw unavailable(); }
  finally { clearTimeout(timer); signal?.removeEventListener('abort', abort); }
}

export function createNpcServer({ config, root = PUBLIC_ROOT, fetchImpl = npcFetch, timeoutMs = 40000, retryDelayMs = 350, rateLimit = 30, rateWindowMs = 60000 } = {}) {
  if (!config) throw new Error('缺少本地服务配置。');
  let active = 0; const attempts = [];
  const server = http.createServer(async (req, res) => {
    const port = server.address()?.port || 8765;
    const hosts = new Set([`127.0.0.1:${port}`, `localhost:${port}`]);
    const origins = new Set([`http://127.0.0.1:${port}`, `http://localhost:${port}`, 'null']);
    if(config.publicHost)hosts.add(config.publicHost);
    for(const allowed of config.allowedOrigins||[])origins.add(allowed);
    const origin = req.headers.origin;
    const send = (status, value, extra = {}) => { if (res.destroyed || res.writableEnded) return; const content = JSON.stringify(value); res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Content-Length': Buffer.byteLength(content), 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff', ...extra }); res.end(content); };
    try {
      if (!hosts.has(req.headers.host)) throw new SafeError(421, 'INVALID_HOST', '无效的本地服务地址。');
      if (origin !== undefined && !origins.has(origin)) throw new SafeError(403, 'ORIGIN_DENIED', '不接受该来源的请求。');
      if (!origin && req.headers['sec-fetch-site'] === 'cross-site') throw new SafeError(403, 'ORIGIN_DENIED', '不接受该来源的请求。');
      if (origin) { res.setHeader('Access-Control-Allow-Origin', origin); res.setHeader('Vary', 'Origin'); }
      const rawPath = (req.url || '/').split(/[?#]/, 1)[0];
      let pathname; try { pathname = decodeURIComponent(rawPath); } catch { throw badRequest(); }
      if (!pathname.startsWith('/') || /[\\\u0000]/.test(pathname) || pathname.split('/').some(segment => segment.startsWith('.') || segment.toLowerCase() === 'server')) throw new SafeError(404, 'NOT_FOUND', '页面不存在。');
      if (req.method === 'OPTIONS' && pathname.startsWith('/api/')) { res.writeHead(204, { 'Access-Control-Allow-Methods': 'GET, POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type', 'Access-Control-Max-Age': '600', 'Cache-Control': 'no-store' }); res.end(); return; }
      if (pathname === '/api/health' && req.method === 'GET') { send(200, { configured: Boolean(config.apiKey) }); return; }
      if (pathname === '/api/npc' && req.method === 'POST') {
        const request = validateNpcRequest(await readJson(req));
        if (shouldRemainSilent(request.npc, request.context)) { send(200, { ok: true, messages: [], mode: 'silence' }); return; }
        if (!config.apiKey) throw unavailable();
        const now = Date.now(); while (attempts.length && attempts[0] <= now - rateWindowMs) attempts.shift();
        if (active >= 2 || attempts.length >= rateLimit) { send(429, { ok: false, error: { code: 'BUSY', message: '对方正在处理消息，请稍后再试。' } }, { 'Retry-After': '3' }); return; }
        attempts.push(now); active++;
        const controller = new AbortController(); const disconnected = () => { if (!res.writableEnded) controller.abort(); }; res.once('close', disconnected);
        try { const messages = await requestNpc(request, config, { fetchImpl, timeoutMs, retryDelayMs, signal: controller.signal }); send(200, { ok: true, messages, mode: 'model' }); }
        finally { active--; res.removeListener('close', disconnected); }
        return;
      }
      if (pathname.startsWith('/api/')) { send(405, { ok: false, error: { code: 'METHOD_NOT_ALLOWED', message: '请求方式不支持。' } }); return; }
      if (!['GET', 'HEAD'].includes(req.method)) throw new SafeError(405, 'METHOD_NOT_ALLOWED', '请求方式不支持。');
      const relative = pathname === '/' ? 'index.html' : pathname.slice(1);
      const ext = path.extname(relative).toLowerCase();
      if (!['.html', '.css', '.js', '.png', '.webp'].includes(ext) && relative !== 'README.md') throw new SafeError(404, 'NOT_FOUND', '页面不存在。');
      const base = await realpath(root); let file;
      try { file = await realpath(path.resolve(base, relative)); } catch { throw new SafeError(404, 'NOT_FOUND', '页面不存在。'); }
      const within = path.relative(base, file);
      if (within.startsWith('..') || path.isAbsolute(within) || within.split(path.sep).some(segment => segment.startsWith('.') || segment.toLowerCase() === 'server')) throw new SafeError(404, 'NOT_FOUND', '页面不存在。');
      const info = await stat(file); if (!info.isFile()) throw new SafeError(404, 'NOT_FOUND', '页面不存在。');
      const bytes = req.method === 'HEAD' ? null : await readFile(file);
      res.writeHead(200, { 'Content-Type': MIME[ext], 'Content-Length': info.size, 'Cache-Control': 'no-cache', 'X-Content-Type-Options': 'nosniff', 'Referrer-Policy': 'no-referrer' });
      if (req.method === 'HEAD') res.end(); else res.end(bytes);
    } catch (error) {
      const safe = error instanceof SafeError ? error : new SafeError(500, 'SERVER_ERROR', '本地服务暂时无法处理请求。');
      send(safe.status, { ok: false, error: { code: safe.code, message: safe.message } });
    }
  });
  server.requestTimeout = 10000; server.headersTimeout = 5000; server.keepAliveTimeout = 5000;
  return server;
}

async function main() {
  let port = Number(process.env.PORT||8765), envFile, host='127.0.0.1';
  const args = process.argv.slice(2);
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--env-file' && args[i + 1]) envFile = args[++i];
    else if (args[i] === '--port' && /^\d+$/.test(args[i + 1] || '')) port = Number(args[++i]);
    else if (args[i] === '--host' && ['127.0.0.1','0.0.0.0'].includes(args[i+1])) host=args[++i];
    else throw new Error('启动参数无效。');
  }
  if (!Number.isInteger(port) || port < 1024 || port > 65535) throw new Error('端口配置无效。');
  const config = await loadConfig({ envFile });
  const server = createNpcServer({ config });
  server.on('error', () => { console.error('本地服务无法启动，请检查端口是否已被占用。'); process.exitCode = 1; });
  server.listen(port, host, () => console.log(`请确认回家 · 服务已启动，端口 ${port}`));
  for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => server.close(() => process.exit(0)));
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main().catch(() => { console.error('本地服务未能启动，请检查配置与启动参数。'); process.exitCode = 1; });
