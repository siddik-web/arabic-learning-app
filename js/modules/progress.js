import { getElement, toast } from '../core/utils.js';
import * as state from '../core/state.js';
import { renderAl } from './alphabet.js';

export function xpLv() {
    if (state.XP < 50) return 'মক্তব শিক্ষার্থী 📖';
    if (state.XP < 150) return 'হরফ শিক্ষার্থী 🔤';
    if (state.XP < 300) return 'কুরআন পাঠক 📖';
    if (state.XP < 500) return 'তাজবিদ বিশারদ 🌟';
    return 'হাফিয 🕌';
}

export function setR(id, pct, col) {
    const el = getElement(id);
    if (!el) return;
    const c = 2 * Math.PI * 30;
    el.style.strokeDashoffset = c - (c * pct / 100);
    el.style.stroke = col;
}

export function renderHmap() {
    let h = '';
    for (let i = 0; i < 28; i++) {
        const lv = i < state.SD ? (i % 3 === 0 ? 'd3' : i % 2 === 0 ? 'd2' : 'd1') : '';
        h += `<div class="hday ${lv}"></div>`;
    }
    const el = getElement('hmap');
    if (el) el.innerHTML = h;
}

export function renderAchievements() {
    const ach = [];
    if (state.LL.size === 28) ach.push('🏅 হরফ সম্রাট');
    if (state.SD >= 7) ach.push('🔥 ৭ দিনের ধারা');
    if (state.QST >= 10) ach.push('🧠 কুইজ মাস্টার');
    if (state.FavLetters.size >= 5) ach.push('★ পছন্দের অক্ষর');
    if (state.XP >= 100) ach.push('⭐ ১০০ XP');
    if (state.XP >= 500) ach.push('💎 ৫০০ XP');
    
    const grid = getElement('achieveGrid');
    if (grid) {
        grid.innerHTML = ach.map(a => `<div class="achieve-item">${a}</div>`).join('') 
            || '<div class="achieve-item locked">কোনো অর্জন নেই</div>';
    }
}

export function checkAchievements() {
    renderAchievements();
}

export function addXP(n) {
    state.updateXP(n);
    updSbar();
    toast('+' + n + ' XP ⭐');
    checkAchievements();
}

export function updSbar() {
    const hstr = getElement('hstr');
    const hlet = getElement('hlet');
    const hxp = getElement('hxp');
    const dailyGoal = getElement('dailyGoalDisplay');
    const goalFill = getElement('goalFill');
    const goalText = getElement('goalText');
    
    if (hstr) hstr.textContent = state.SD;
    if (hlet) hlet.textContent = state.LL.size;
    if (hxp) hxp.textContent = state.XP;
    if (dailyGoal) dailyGoal.innerHTML = `🎯 ${state.dailyXP}/10`;
    if (goalFill) goalFill.style.width = Math.min(100, (state.dailyXP / 10) * 100) + '%';
    if (goalText) goalText.innerHTML = `আজকের লক্ষ্য: ${state.dailyXP}/10 XP`;
}

export function checkNewDay() {
    const today = new Date().toDateString();
    if (state.lastDate !== today) {
        state.updateDailyXP(0);
        state.updateLastDate(today);
    }
    state.saveState();
}

export function chkStreak() {
    const t = new Date().toDateString();
    const y = new Date(Date.now() - 86400000).toDateString();
    if (state.LV === t) return;
    
    state.updateSD(state.LV === y ? state.SD + 1 : 1);
    if (state.SD > state.BS) state.updateBS(state.SD);
    state.updateLastVisit(t);
    state.saveState();
}

export function updateRings() {
    const lp = Math.round((state.LL.size / 28) * 100);
    setR('rL', lp, '#d4a843');
    
    const rLp = getElement('rLp');
    if (rLp) rLp.textContent = lp + '%';
    
    const Ld = getElement('Ld');
    if (Ld) Ld.textContent = state.LL.size + '/২৮ হরফ শেখা হয়েছে';
    
    const qp = state.QTT > 0 ? Math.round((state.QST / state.QTT) * 100) : 0;
    setR('rQ', qp, '#14c4b2');
    
    const rQp = getElement('rQp');
    if (rQp) rQp.textContent = qp + '%';
    
    const Qd = getElement('Qd');
    if (Qd) Qd.textContent = state.QTT > 0 ? state.QST + '/' + state.QTT + ' সঠিক' : 'কোনো পরীক্ষা হয়নি';
    
    const stc = getElement('stc');
    if (stc) stc.textContent = state.SD;
    
    const bst = getElement('bst');
    if (bst) bst.textContent = 'সর্বোচ্চ: ' + state.BS + ' দিন';
    
    const txp = getElement('txp');
    if (txp) txp.textContent = state.XP;
    
    const xlv = getElement('xlv');
    if (xlv) xlv.textContent = xpLv();
    
    renderHmap();
    updSbar();
    renderAchievements();
}

export function shareProgress() {
    const text = `আমার অগ্রগতি: 📖 হরফ ${state.LL.size}/28, 🔥 দিনের ধারা ${state.SD}, ⭐ XP ${state.XP}`;
    if (navigator.share) navigator.share({ title: 'আমার কুরআন শিক্ষা', text: text });
    else alert(text);
}

export function resetP() {
    if (!confirm('সব অগ্রগতি মুছে দেবেন?')) return;
    state.resetState();
    renderAl();
    updateRings();
    toast('রিসেট হয়েছে');
}
