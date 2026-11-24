/* A date cut belongs to an earned story advance, never to loading a save. */
let storyTimeCut = null;
let storyTimeTimer = 0;
let storyTimeQueued = false;
const storyTimeLayer = document.createElement('div');
storyTimeLayer.id = 'story-time-cut';
storyTimeLayer.hidden = true;
storyTimeLayer.setAttribute('role', 'status');
storyTimeLayer.setAttribute('aria-live', 'polite');
document.querySelector('.phone').appendChild(storyTimeLayer);

function syncStoryTransitions() {
  if (S.storyTransitions?.version === 1) return S.storyTransitions;
  // Older saves have already shown the first cut in this two-step exchange.
  const shown = (S.flags.followup || S.flags.matched) && S.day >= 23 ? ['west-shelter'] : [];
  return S.storyTransitions = { version: 1, shown };
}

function storyTimeLabel(days) {
  if (days === 1) return '翌日';
  if (days === 2) return '两天后';
  const digits = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
  const count = days < 10 ? digits[days] : days < 20 ? '十' + (days % 10 ? digits[days % 10] : '') : String(days);
  return count + '天后';
}

function storyTimeState() {
  if (!storyTimeCut || storyTimeCut.owner !== S) return null;
  return { from: storyTimeCut.from, to: storyTimeCut.to, label: storyTimeCut.label || storyTimeLabel(storyTimeCut.to - storyTimeCut.from), visible: !storyTimeLayer.hidden };
}

function storyTimeFinish(restoreFocus = true) {
  clearTimeout(storyTimeTimer);
  const cut = storyTimeCut;
  storyTimeCut = null;
  storyTimeLayer.hidden = true;
  storyTimeLayer.replaceChildren();
  for (const [node, wasInert] of cut?.inert || []) node.inert = wasInert;
  if (restoreFocus && cut?.owner === S && cut.focus?.isConnected) {
    cut.focus.focus({ preventScroll: true });
    if (cut.selection && typeof cut.focus.setSelectionRange === 'function') {
      cut.focus.setSelectionRange(...cut.selection);
    }
  }
}

function storyTimePresent() {
  storyTimeQueued = false;
  const cut = storyTimeCut;
  if (!cut || cut.owner !== S || S.flags.done) return storyTimeFinish(false);
  clearTimeout(storyTimeTimer);
  if (!cut.inert) {
    cut.focus = document.activeElement;
    if (typeof cut.focus?.selectionStart === 'number') cut.selection = [cut.focus.selectionStart, cut.focus.selectionEnd];
    cut.inert = [...storyTimeLayer.parentElement.children].filter(node => node !== storyTimeLayer).map(node => [node, node.inert]);
    for (const [node] of cut.inert) node.inert = true;
  }
  const heading = document.createElement('p');
  heading.className = 'story-time-heading';
  heading.textContent = cut.label || storyTimeLabel(cut.to - cut.from);
  const date = document.createElement('p');
  date.className = 'story-time-date';
  const at = new Date(Date.UTC(2026, 8, cut.to));
  date.textContent = cut.dateText || `${at.getUTCFullYear()}年${at.getUTCMonth() + 1}月${at.getUTCDate()}日`;
  const content = document.createElement('div');
  content.append(heading, date);
  storyTimeLayer.replaceChildren(content);
  storyTimeLayer.hidden = false;
  cut.remaining = 2400;
  storyTimeTimer = setTimeout(storyTimeFinish, cut.remaining);
}

function storyTimeAdvance(ms) {
  if (!storyTimeCut || storyTimeLayer.hidden) return;
  storyTimeCut.remaining -= Math.max(0, ms);
  if (storyTimeCut.remaining <= 0) storyTimeFinish();
}

const storyTimeDayTo = dayTo;
dayTo = function(day, clock, transitionId) {
  const owner = S;
  const current = phoneDate();
  const currentDay = Math.floor((Date.UTC(current.getUTCFullYear(), current.getUTCMonth(), current.getUTCDate()) - Date.UTC(2026, 8, 1)) / 86400000) + 1;
  const from = Math.max(S.day, currentDay);
  const transitions = syncStoryTransitions();
  const repeated = transitionId && transitions.shown.includes(transitionId);
  if (transitionId && !repeated && S.started && !S.flags.done && day > from) transitions.shown.push(transitionId);
  const result = storyTimeDayTo(day, clock);
  if (owner !== S || !S.started || S.day <= from || S.flags.done) return result;
  if (repeated) {
    // Coalesce synchronous steps without restarting an already visible card.
    if (storyTimeCut?.owner === S && storyTimeCut.transitionId === transitionId && storyTimeLayer.hidden) storyTimeCut.to = S.day;
    return result;
  }
  if (storyTimeCut && storyTimeCut.owner !== S) storyTimeFinish(false);
  if (storyTimeCut) storyTimeCut.to = S.day;
  else storyTimeCut = { owner: S, from, to: S.day, transitionId };
  // A single form can advance two milestones synchronously: show one date cut.
  if (!storyTimeQueued) {
    storyTimeQueued = true;
    queueMicrotask(storyTimePresent);
  }
  return result;
};

const storyTimeRender = render;
render = function(...args) {
  syncStoryTransitions();
  if (storyTimeCut && (storyTimeCut.owner !== S || S.flags.done)) storyTimeFinish(false);
  return storyTimeRender(...args);
};
syncStoryTransitions();

// The card is brief and automatic; prevent taps/keys reaching the page underneath.
document.addEventListener('keydown', event => {
  if (!storyTimeLayer.hidden) { event.preventDefault(); event.stopImmediatePropagation(); }
}, true);
for (const name of ['click', 'pointerdown', 'pointerup', 'wheel']) {
  storyTimeLayer.addEventListener(name, event => { event.preventDefault(); event.stopPropagation(); }, { passive: false });
}
