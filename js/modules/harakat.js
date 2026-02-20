import { getElement } from '../core/utils.js';
import { HAR } from '../data/harakat.js';

export function renderHar() {
    const grid = getElement('hgrid');
    const ext = getElement('hex');
    
    if (grid) {
        grid.innerHTML = HAR.map(h => `
            <div class="hcard" onclick="speak('${h.s}')">
                <div class="hex" style="color:${h.c}">${h.s}</div>
                <div class="hn">${h.n}</div>
                <div class="hd">${h.d} <strong style="color:${h.c}">(${h.so})</strong></div>
            </div>
        `).join('');
    }
    
    if (ext) {
        ext.innerHTML = `
            <div class="qv">
                <div style="font-family:'Amiri',serif;font-size:1.9rem;direction:rtl;color:var(--gl);line-height:2.5">
                    بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                </div>
                <div style="font-size:.78rem;color:var(--td);margin-top:10px;line-height:1.9">
                    <strong style="color:var(--tl)">بِسْمِ</strong> = বা + কাসরা + সিন + সুকুন + মিম + কাসরা<br>
                    <strong style="color:var(--tl)">اللَّهِ</strong> = আলিফ + লাম + লাম (শাদ্দা) + হা + কাসরা<br>
                    <strong style="color:var(--tl)">الرَّحْمَٰنِ</strong> = রা (শাদ্দা) + হা + মিম + আলিফ (মাদ্দ) + নুন + কাসরা
                </div>
            </div>
        `;
    }
}
