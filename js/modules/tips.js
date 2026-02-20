import { getElement } from '../core/utils.js';
import { TIPS } from '../data/tips.js';

export function renderTips() {
    const grid = getElement('tipgrid');
    if (!grid) return;
    grid.innerHTML = TIPS.map(t => `
        <div class="tipcard">
            <h3>${t.t}</h3>
            <p>${t.d}</p>
        </div>
    `).join('');
}
