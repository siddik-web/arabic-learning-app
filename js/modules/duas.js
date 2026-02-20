import { getElement, toast } from '../core/utils.js';
import { DUA } from '../data/duas.js';
import * as state from '../core/state.js';

export function renderDU() {
    const grid = getElement('duagrid');
    if (!grid) return;

    grid.innerHTML = DUA.map((d, idx) => `
        <div class="duacard${state.FavDuas.has(idx) ? ' fav' : ''}" id="dua${idx}">
            <div class="duat">
                <span>${d.t}</span>
                <button class="duasp" onclick="speak('${d.ar}')">🔊 শুনুন</button>
            </div>
            <div class="duaar">${d.ar}</div>
            <div class="duabn">${d.b}</div>
            <div class="duasc">📚 ${d.s}</div>
            <button class="fbtn" style="position:absolute;bottom:8px;left:8px;padding:3px 10px;" 
                onclick="window.toggleFavDua(${idx})">
                ${state.FavDuas.has(idx) ? '★ পছন্দের' : '☆ পছন্দ'}
            </button>
        </div>
    `).join('');
}

export function toggleFavDua(idx) {
    if (state.FavDuas.has(idx)) {
        state.FavDuas.delete(idx);
        toast('পছন্দ থেকে সরানো হয়েছে');
    } else {
        state.FavDuas.add(idx);
        toast('★ পছন্দের তালিকায় যুক্ত হয়েছে');
    }
    state.saveState();
    renderDU();
}
