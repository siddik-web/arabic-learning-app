import { getElement, toast } from '../core/utils.js';
import { ALP } from '../data/alphabet.js';
import { WRD } from '../data/words.js';
import { HAR } from '../data/harakat.js';
import { addXP } from './progress.js';
import { speak } from '../core/tts.js';

export let fcm = 'al';
export let fcd = [];
export let fci = 0;
export let fcf = false;

export function setFcdFromAlphabet() {
    if (fcd.length === 0) fcd = [...ALP];
}

export function setFcM(m, btn) {
    fcm = m;
    document.querySelectorAll('.fcmb').forEach(b => b.classList.remove('on'));
    btn.classList.add('on');
    
    fcd = m === 'al' ? [...ALP] : m === 'wo' ? [...WRD] : [...HAR];
    fci = 0;
    updFC();
}

export function updFC() {
    getElement('fc').classList.remove('flip');
    fcf = false;
    getElement('fcc').textContent = `${fci + 1}/${fcd.length}`;
    
    if (fcm === 'al') {
        const l = fcd[fci];
        getElement('ffa').textContent = l.ar;
        getElement('fbb').textContent = l.n;
        getElement('fbr').textContent = l.ro;
        getElement('fbd').textContent = l.d;
    } else if (fcm === 'wo') {
        const w = fcd[fci];
        getElement('ffa').textContent = w.ar;
        getElement('fbb').textContent = w.b;
        getElement('fbr').textContent = '';
        getElement('fbd').textContent = 'অর্থ: ' + w.m;
    } else {
        const h = fcd[fci];
        getElement('ffa').textContent = h.s;
        getElement('fbb').textContent = h.n;
        getElement('fbr').textContent = h.so;
        getElement('fbd').textContent = h.d;
    }
}

export function flip() {
    fcf = !fcf;
    getElement('fc').classList.toggle('flip', fcf);
    if (fcf) addXP(1);
}

export function fcMv(d) {
    fci = (fci + d + fcd.length) % fcd.length;
    updFC();
}

export function shuffleFc() {
    fcd.sort(() => Math.random() - 0.5);
    fci = 0;
    updFC();
    toast('কার্ড এলোমেলো 🔀');
}

export function fcAr() {
    if (fcm === 'al' || fcm === 'wo') return fcd[fci].ar;
    return fcd[fci].s;
}

export function attachSwipeEvents() {
    let touchstartX = 0;
    let touchendX = 0;
    const wrap = getElement('fcwrap');
    if (!wrap) return;

    wrap.addEventListener('touchstart', e => {
        touchstartX = e.changedTouches[0].screenX;
    }, {passive: true});
    
    wrap.addEventListener('touchend', e => {
        touchendX = e.changedTouches[0].screenX;
        if (touchendX < touchstartX - 50) fcMv(1);
        if (touchendX > touchstartX + 50) fcMv(-1);
    }, {passive: true});
}
