import { getElement, toast } from '../core/utils.js';
import { WRD } from '../data/words.js';
import * as state from '../core/state.js';

export let wf = 'all';

export function renderW() {
    const grid = getElement('wgrid');
    if (!grid) return;
    
    const fl = wf === 'all' 
        ? WRD 
        : wf === 'প্রিয়' 
            ? WRD.filter((_, i) => state.FavWords.has(i)) 
            : WRD.filter(w => w.c === wf);
            
    grid.innerHTML = fl.map((w, idx) => {
        // Optimized mapping logic to find indices using original WRD array mapped closely
        const globalIdx = WRD.findIndex(x => x.id === w.id); // Fixed O(N^2) matching by b/ar text, relying on new 'id'
        
        return `
            <div class="wcard${state.FavWords.has(globalIdx) ? ' fav' : ''}" onclick="speak('${w.ar}')">
                <span class="wfq">${w.f}</span>
                <span class="war">${w.ar}</span>
                <span class="wbn">${w.b}</span>
                <span class="wmn">অর্থ: ${w.m}</span>
                <span class="wct">${w.c}</span>
                <button class="wsp" onclick="event.stopPropagation(); window.toggleFavWord(${globalIdx});">
                    ${state.FavWords.has(globalIdx) ? '★' : '☆'}
                </button>
            </div>
        `;
    }).join('');
}

export function toggleFavWord(idx) {
    if (state.FavWords.has(idx)) {
        state.FavWords.delete(idx);
        toast('পছন্দ থেকে সরানো হয়েছে');
    } else {
        state.FavWords.add(idx);
        toast('★ পছন্দের তালিকায় যুক্ত হয়েছে');
    }
    state.saveState();
    renderW();
}

export function fw(cat, btn) {
    wf = cat;
    document.querySelectorAll('.wb').forEach(b => b.classList.remove('on'));
    btn.classList.add('on');
    renderW();
}
