import { getElement, toast } from '../core/utils.js';
import { ALP } from '../data/alphabet.js';
import * as state from '../core/state.js';
import { speak } from '../core/tts.js';
import { addXP, updateRings } from './progress.js';

export let curAr = 'ا';
export let curIdx = 0;

const BN_COACH = {
    'ث': { position: 'জিহ্বা দাঁতের ফাঁকে হালকা বের করে বাতাস ছাড়ুন।', compare: 'বাংলার স/থ মাঝামাঝি শোনাবে।', memo: 'তিন ফোঁটা = হালকা থা।' },
    'ح': { position: 'গলার মাঝামাঝি থেকে চাপহীন হা বলুন।', compare: 'বাংলার হ এর চেয়ে গভীর কিন্তু নরম।', memo: 'হা = গলার শ্বাস।' },
    'خ': { position: 'গলার পেছন থেকে ঘর্ষণ করে ধ্বনি বের করুন।', compare: 'বাংলার খ না, বরং গলার খ।', memo: 'খা = কাশি শুরু হওয়ার আগের শব্দ।' },
    'ذ': { position: 'জিহ্বা দাঁতের কাছে এনে নরম ঝ-ধ্বনি দিন।', compare: 'বাংলার য/জ নয়, দাঁতের ঘর্ষণ জরুরি।', memo: 'এক ফোঁটা যাল = দাঁতের ধ্বনি।' },
    'ص': { position: 'মুখ একটু ভারি করে স ধ্বনি দিন।', compare: 'সিন (س) এর চেয়ে মোটা স।', memo: 'সোয়াদ = শক্ত স।' },
    'ض': { position: 'জিহ্বা পাশ ঘেঁষে ভারি দ ধ্বনি দিন।', compare: 'বাংলার দ থেকে ভারি।', memo: 'দোয়াদ = আরবির বিশেষ দ।' },
    'ط': { position: 'জিহ্বা উপর তালুতে লাগিয়ে ভারি ত/ট বলুন।', compare: 'তা (ت) থেকে গভীর।', memo: 'তোয়া = মোটা ত।' },
    'ظ': { position: 'দাঁতের সামনে জিহ্বা এনে ভারি য/য় ধ্বনি দিন।', compare: 'যোয়া = যাল (ذ) এর ভারি রূপ।', memo: 'যোয়া = দাঁতের ভারি ধ্বনি।' },
    'ع': { position: 'গলার গভীর থেকে স্বর টেনে বের করুন।', compare: 'বাংলায় সরাসরি মিল নেই।', memo: 'আইন = গলার ভেতরের স্বর।' },
    'غ': { position: 'গলার পেছনে কম্পন দিয়ে ঘ-ধ্বনি তুলুন।', compare: 'খা (خ) এর সাথে মিল, কিন্তু কম্পনযুক্ত।', memo: 'গাইন = ঘর্ষণ + কম্পন।' },
    'ق': { position: 'জিহ্বার পেছন অংশ উঁচু করে গভীর ক বলুন।', compare: 'কাফ (ك) এর চেয়ে পেছনের ক।', memo: 'ক্বাফ = গলার ক।' }
};

const CONFUSION_GROUPS = [
    ['ث', 'س', 'ص'],
    ['ح', 'ه', 'خ'],
    ['ذ', 'ز', 'ظ'],
    ['ت', 'ط'],
    ['د', 'ض'],
    ['ق', 'ك'],
    ['ع', 'غ']
];

function getConfusionGroup(ar) {
    return CONFUSION_GROUPS.find(group => group.includes(ar)) || [];
}

function renderCoach(i) {
    const l = ALP[i];
    const tip = BN_COACH[l.ar] || {
        position: 'প্রথমে ধীরে উচ্চারণ করুন, তারপর দ্রুত বলুন।',
        compare: `বাংলার কাছাকাছি ধ্বনি ধরে ${l.ro} বারবার শুনুন।`,
        memo: `${l.n} মনে রাখুন শব্দ-জোড়া অনুশীলনে।`
    };

    const weak = state.weakScore(i);
    const confusing = getConfusionGroup(l.ar)
        .filter(ar => ar !== l.ar)
        .map(ar => {
            const item = ALP.find(x => x.ar === ar);
            if (!item) return '';
            return `<button class="coach-letter-btn" data-coach-letter="${item.ar}">${item.ar} (${item.n})</button>`;
        })
        .join('');

    let box = getElement('bnCoach');
    if (!box) {
        box = document.createElement('div');
        box.id = 'bnCoach';
        box.className = 'bn-coach';
        const forms = getElement('dforms');
        if (forms && forms.parentElement) forms.parentElement.appendChild(box);
    }

    box.innerHTML = `
        <h3>🇧🇩 বাংলা স্পিকার কোচ</h3>
        <div class="coach-grid">
            <div class="coach-chip"><b>মুখের অবস্থান:</b> ${tip.position}</div>
            <div class="coach-chip"><b>বাংলার সাথে তুলনা:</b> ${tip.compare}</div>
            <div class="coach-chip"><b>মনে রাখুন:</b> ${tip.memo}</div>
        </div>
        <div class="coach-actions">
            <button class="fcn" id="coachSpeak">🔊 আবার শুনুন</button>
            <span class="coach-weak">ভুলের স্কোর: ${weak}</span>
        </div>
        ${confusing ? `<div class="coach-confuse"><span>সহজে গুলিয়ে যায়:</span>${confusing}</div>` : ''}
    `;
}

export function renderAl() {
    const agrid = getElement('agrid');
    if (!agrid) return;
    agrid.innerHTML = ALP.map((l, i) => `
        <div class="lcard${state.LL.has(i) ? ' lrn' : ''}${state.FavLetters.has(i) ? ' fav' : ''}" id="lc${i}" onclick="showDet(${i})">
            <span class="lar">${l.ar}</span>
            <span class="lnar">${l.na}</span>
            <span class="lbn">${l.n}</span>
            <span class="lrom">${l.ro}</span>
        </div>
    `).join('');
}

export function showDet(i) {
    curIdx = i;
    const l = ALP[i];
    curAr = l.ar;

    getElement('dlet').textContent = l.ar;
    getElement('dname').textContent = `${l.n} (${l.na}) — ${l.ro}`;
    getElement('ddesc').textContent = l.d;

    getElement('dforms').innerHTML = `
        <div class="fcard"><div class="ar">${l.i}</div><div class="lbl">বিচ্ছিন্ন</div></div>
        <div class="fcard"><div class="ar">${l.ini}</div><div class="lbl">শুরুতে</div></div>
        <div class="fcard"><div class="ar">${l.m}</div><div class="lbl">মাঝে</div></div>
        <div class="fcard"><div class="ar">${l.f}</div><div class="lbl">শেষে</div></div>
    `;

    const b = getElement('lbtn');
    b.textContent = state.LL.has(i) ? '✅ শেখা হয়েছে' : '✅ শিখেছি';
    b.style.opacity = state.LL.has(i) ? '.5' : '1';

    getElement('fbtn').textContent = state.FavLetters.has(i) ? '★ পছন্দের তালিকা থেকে সরান' : '★ পছন্দের তালিকায় যুক্ত করুন';

    getElement('dpanel').classList.add('on');
    getElement('backdrop').classList.add('on');
    document.body.classList.add('modal-open');

    renderCoach(i);

    document.querySelectorAll('.lcard').forEach((c, j) => c.classList.toggle('sel', j === i));

    speak(l.ar);
}

export function hideDet() {
    getElement('dpanel').classList.remove('on');
    getElement('backdrop').classList.remove('on');
    document.body.classList.remove('modal-open');
}

export function markL() {
    if (state.LL.has(curIdx)) return;
    state.LL.add(curIdx);
    state.saveState();

    getElement('lc' + curIdx).classList.add('lrn');
    getElement('lbtn').textContent = '✅ শেখা হয়েছে';
    getElement('lbtn').style.opacity = '.5';

    addXP(10);
    updateRings();
    renderAl();
}

export function toggleFavLetter() {
    if (state.FavLetters.has(curIdx)) {
        state.FavLetters.delete(curIdx);
        toast('পছন্দ থেকে সরানো হয়েছে');
    } else {
        state.FavLetters.add(curIdx);
        toast('★ পছন্দের তালিকায় যুক্ত হয়েছে');
    }
    state.saveState();
    renderAl();
    showDet(curIdx);
}
