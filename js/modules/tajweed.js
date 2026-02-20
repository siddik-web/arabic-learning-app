import { getElement } from '../core/utils.js';
import { TJ } from '../data/tajweed.js';

export function renderTJ() {
    const grid = getElement('tjgrid');
    if (!grid) return;
    
    grid.innerHTML = TJ.map(r => `
        <div class="tjcard">
            <div class="tjbdg" style="background:${r.c}22;color:${r.c};border:1px solid ${r.c}44">${r.b}</div>
            <h3 style="color:${r.c}">${r.n}</h3>
            <div class="tjex" style="color:${r.c}" onclick="speak('${r.ex}')" title="ক্লিক করুন শুনতে">${r.ex} 🔊</div>
            <p>${r.d}</p>
        </div>
    `).join('');
}
