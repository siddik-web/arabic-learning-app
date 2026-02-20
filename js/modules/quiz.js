import { getElement } from '../core/utils.js';
import { ALP } from '../data/alphabet.js';
import { WRD } from '../data/words.js';
import * as state from '../core/state.js';
import { addXP, updateRings } from './progress.js';

export let qs = 0;
export let qt = 0;
export let qsk = 0;
export let qans = false;
export let cq = null;
export let qm = 'ln';

function pickAlphabetIndex(preferWeak = false) {
    if (!preferWeak) return Math.floor(Math.random() * ALP.length);

    const weak = state.getWeakLetterOrder();
    const unlearned = ALP
        .map((_, i) => i)
        .filter(i => !state.LL.has(i));

    const pool = [...new Set([...weak, ...unlearned])];
    if (pool.length === 0) return Math.floor(Math.random() * ALP.length);
    return pool[Math.floor(Math.random() * pool.length)];
}

function letterNameOptions(answer) {
    const opts = [answer];
    let attempts = 0;
    while (opts.length < 4 && attempts < 60) {
        const r = ALP[Math.floor(Math.random() * ALP.length)].n;
        if (!opts.includes(r)) opts.push(r);
        attempts++;
    }
    return opts;
}

function letterShapeOptions(answer) {
    const opts = [answer];
    let attempts = 0;
    while (opts.length < 4 && attempts < 60) {
        const r = ALP[Math.floor(Math.random() * ALP.length)].ar;
        if (!opts.includes(r)) opts.push(r);
        attempts++;
    }
    return opts;
}

export function setQM(m, btn) {
    qm = m;
    document.querySelectorAll('.qmb').forEach(b => b.classList.remove('on'));
    btn.classList.add('on');
    initQ();
}

export function initQ() {
    qs = 0;
    qt = 0;
    qsk = 0;
    updQS();
    nextQ();
}

export function nextQ() {
    qans = false;
    getElement('qfb').style.display = 'none';
    getElement('nxtb').style.display = 'none';

    let opts;

    if (qm === 'ln' || qm === 'wr') {
        const i = pickAlphabetIndex(qm === 'wr');
        cq = {
            dsp: ALP[i].ar,
            ans: ALP[i].n,
            hint: qm === 'wr' ? 'দুর্বল হরফ অনুশীলন: এই অক্ষরটির নাম কী?' : 'এই আরবি অক্ষরটির নাম কী?',
            sz: '4.5rem',
            idx: i,
            type: 'alp-name'
        };
        opts = letterNameOptions(cq.ans);
        renderQO(opts, false);
    } else if (qm === 'nl') {
        const i = pickAlphabetIndex(false);
        cq = {
            dsp: ALP[i].n,
            ans: ALP[i].ar,
            hint: 'এই নামের আরবি হরফটি কোনটি?',
            sz: '2rem',
            idx: i,
            type: 'alp-shape'
        };
        opts = letterShapeOptions(cq.ans);
        renderQO(opts, true);
    } else {
        const i = Math.floor(Math.random() * WRD.length);
        cq = { dsp: WRD[i].ar, ans: WRD[i].m, hint: 'এই আরবি শব্দের অর্থ কী?', sz: '3rem', type: 'word' };
        opts = [cq.ans];
        let attempts = 0;
        while (opts.length < 4 && attempts < 50) {
            const r = WRD[Math.floor(Math.random() * WRD.length)].m;
            if (!opts.includes(r)) opts.push(r);
            attempts++;
        }
        renderQO(opts, false);
    }

    getElement('qar').textContent = cq.dsp;
    getElement('qar').style.fontSize = cq.sz;
    getElement('qpr').textContent = cq.hint;
}

function shuffleOptions(opts) {
    return opts.sort(() => Math.random() - 0.5);
}

function renderQO(opts, big) {
    const shuffled = shuffleOptions(opts);
    getElement('qop').innerHTML = shuffled.map(o => `
        <button class="qo" style="${big ? 'font-family:Amiri,serif;font-size:1.9rem;direction:rtl' : ''}" 
                data-v="${o.replace(/"/g, '&quot;')}" onclick="window.ansQ(this)">
            ${o}
        </button>
    `).join('');
}

export function ansQ(btn) {
    if (qans) return;
    qans = true;
    qt++;

    const ans = btn.dataset.v;
    document.querySelectorAll('.qo').forEach(b => {
        b.disabled = true;
        if (b.dataset.v === cq.ans) b.classList.add('ok');
        else if (b.dataset.v === ans && ans !== cq.ans) b.classList.add('no');
    });

    const fb = getElement('qfb');
    const ok = (ans === cq.ans);

    if (ok) {
        qs++;
        qsk++;
        fb.textContent = '✅ সঠিক! ' + (qsk > 2 ? '🔥 ' + qsk + 'টি ধারাবাহিক!' : '');
        fb.className = 'qfb ok';
        addXP(qsk > 2 ? 15 : 10);
        state.incrementQST();
        state.incrementQTT();

        if (cq.type && cq.type.startsWith('alp') && Number.isInteger(cq.idx)) {
            state.easeWeak(cq.idx);
        }
    } else {
        qsk = 0;
        fb.textContent = '❌ ভুল! সঠিক: "' + cq.ans + '"';
        fb.className = 'qfb no';
        state.incrementQTT();

        if (cq.type && cq.type.startsWith('alp') && Number.isInteger(cq.idx)) {
            state.bumpWeak(cq.idx);
        }
    }

    fb.style.display = 'block';
    state.saveState();
    updQS();
    updateRings();

    getElement('nxtb').style.display = 'inline-block';
}

function updQS() {
    getElement('qsc').textContent = qs;
    getElement('qtl').textContent = qt;
    getElement('qsk').textContent = qsk;

    const p = qt > 0 ? Math.round((qs / qt) * 100) : 0;
    const pf = getElement('pf');
    if (pf) pf.style.width = p + '%';
}
