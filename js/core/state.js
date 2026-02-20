export let LL = new Set(JSON.parse(localStorage.getItem('ll') || '[]'));
export let FavLetters = new Set(JSON.parse(localStorage.getItem('favLetters') || '[]'));
export let FavWords = new Set(JSON.parse(localStorage.getItem('favWords') || '[]'));
export let FavDuas = new Set(JSON.parse(localStorage.getItem('favDuas') || '[]'));
export let XP = parseInt(localStorage.getItem('xp') || '0');
export let SD = parseInt(localStorage.getItem('sd') || '0');
export let BS = parseInt(localStorage.getItem('bs') || '0');
export let QST = parseInt(localStorage.getItem('qst') || '0');
export let QTT = parseInt(localStorage.getItem('qtt') || '0');
export let LV = localStorage.getItem('lv') || '';
export let dailyXP = parseInt(localStorage.getItem('dailyXP') || '0');
export let lastDate = localStorage.getItem('lastDate') || '';
export let weakLetters = JSON.parse(localStorage.getItem('weakLetters') || '{}');

export function saveState() {
    localStorage.setItem('ll', JSON.stringify([...LL]));
    localStorage.setItem('favLetters', JSON.stringify([...FavLetters]));
    localStorage.setItem('favWords', JSON.stringify([...FavWords]));
    localStorage.setItem('favDuas', JSON.stringify([...FavDuas]));
    localStorage.setItem('xp', XP);
    localStorage.setItem('sd', SD);
    localStorage.setItem('bs', BS);
    localStorage.setItem('qst', QST);
    localStorage.setItem('qtt', QTT);
    localStorage.setItem('lv', new Date().toDateString());
    localStorage.setItem('dailyXP', dailyXP);
    localStorage.setItem('lastDate', new Date().toDateString());
    localStorage.setItem('weakLetters', JSON.stringify(weakLetters));
}

export function updateXP(n) {
    XP += n;
    dailyXP += n;
    saveState();
}

export function updateSD(newSD) {
    SD = newSD;
}

export function updateBS(newBS) {
    BS = newBS;
}

export function updateLastVisit(newLV) {
    LV = newLV;
}

export function updateDailyXP(newDailyXP) {
    dailyXP = newDailyXP;
}

export function updateLastDate(newLastDate) {
    lastDate = newLastDate;
}

export function incrementQST() {
    QST++;
}

export function incrementQTT() {
    QTT++;
}

export function bumpWeak(index) {
    const k = String(index);
    weakLetters[k] = (weakLetters[k] || 0) + 1;
}

export function easeWeak(index) {
    const k = String(index);
    if (!weakLetters[k]) return;
    weakLetters[k] = Math.max(0, weakLetters[k] - 1);
    if (weakLetters[k] === 0) delete weakLetters[k];
}

export function weakScore(index) {
    return weakLetters[String(index)] || 0;
}

export function getWeakLetterOrder() {
    return Object.entries(weakLetters)
        .sort((a, b) => b[1] - a[1])
        .map(([idx]) => parseInt(idx, 10))
        .filter(Number.isInteger);
}

export function resetState() {
    LL.clear();
    FavLetters.clear();
    FavWords.clear();
    FavDuas.clear();
    XP = 0;
    SD = 0;
    BS = 0;
    QST = 0;
    QTT = 0;
    dailyXP = 0;
    weakLetters = {};
    localStorage.clear();
}
