import { getElement } from '../core/utils.js';
import { updateRings } from './progress.js';
import { initT } from './tracing.js';
import { updFC, setFcdFromAlphabet } from './flashcard.js';
import { showS } from './surahs.js';
import { renderW } from './words.js';
import { renderDU } from './duas.js';

export function showTab(name, btn) {
    document.querySelectorAll('.sec').forEach(s => s.classList.remove('on'));
    document.querySelectorAll('.tb').forEach(b => b.classList.remove('on'));
    
    getElement('s-' + name).classList.add('on');
    if (btn) btn.classList.add('on');
    
    if (name === 'pr') updateRings();
    if (name === 'tr' && !window.ctxElementInitialized) {
        initT();
        window.ctxElementInitialized = true;
    }
    if (name === 'fc') {
        setFcdFromAlphabet();
        updFC();
    }
    if (name === 'su') showS(window.csi || 0);
    if (name === 'wo') renderW();
    if (name === 'du') renderDU();
}
