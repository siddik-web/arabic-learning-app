import { getElement } from '../core/utils.js';
import { SUR } from '../data/surahs.js';
import { speak } from '../core/tts.js';
import { addXP } from './progress.js';

window.csi = 0;

export function showS(i, btn) {
    window.csi = i;
    
    document.querySelectorAll('.stab').forEach(b => b.classList.remove('on'));
    if (btn) btn.classList.add('on');
    
    const s = SUR[i];
    const dsp = getElement('sdsp');
    if (!dsp) return;
    
    dsp.innerHTML = `
        <div class="shdr">
            <div class="snar">${s.na}</div>
            <div class="snbn">${s.n} — ${s.info}</div>
        </div>
        ${s.vs.map((v, j) => `
            <div class="sv">
                <div class="svar"><span class="vnum">${j + 1}</span>${v.a}</div>
                <div class="svtr">${v.t}</div>
                <div class="svbn">${v.b}</div>
            </div>
        `).join('')}
    `;
}

export function spkS() {
    const t = SUR[window.csi].vs.map(v => v.a).join(' ');
    speak(t);
    addXP(5);
}
