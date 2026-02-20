import { getElement, toast } from '../core/utils.js';
import { ALP } from '../data/alphabet.js';
import { addXP } from './progress.js';

let ti = 0;
let ctx = null;
let drw = false;
let strks = [];
let cstk = [];
let tc = '#d4a843';
let canvasObserver = null;

export function initT() {
    const c = getElement('tc');
    if (!c) return;
    
    // Add resize observer to re-calculate bounds when window resizes
    if (!canvasObserver) {
        canvasObserver = new ResizeObserver(() => {
            // Re-evaluating size or simply relying on responsive CSS + re-getting rect dynamically in `setEvents`
            // But we can redraw to be safe, though native canvas scaling is destructive without redraws usually.
            // We just ensure we clear logic if resizing ruins standard bounds.
            clrC();
        });
        canvasObserver.observe(c);
    }
    
    const w = Math.min(380, window.innerWidth - 48);
    c.width = w;
    c.height = 220;
    ctx = c.getContext('2d');
    
    const cols = ['#d4a843', '#14c4b2', '#818cf8', '#f87171', '#34d399'];
    getElement('cdots').innerHTML = cols.map((x, i) => 
        `<div class="cdot${i === 0 ? ' on' : ''}" style="background:${x}" onclick="setTC('${x}', this)"></div>`
    ).join('');
    
    setEvents(c);
    updTG();
    drawGuidelines();
}

function drawGuidelines() {
    if (!ctx) return;
    const c = getElement('tc');
    ctx.save();
    ctx.strokeStyle = 'rgba(255,255,255,0.1)';
    ctx.setLineDash([5, 5]);
    ctx.lineWidth = 1;
    const h = c.height;
    for (let y = h / 3; y < h; y += h / 3) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(c.width, y);
        ctx.stroke();
    }
    ctx.restore();
}

export function setTC(x, el) {
    tc = x;
    document.querySelectorAll('.cdot').forEach(d => d.classList.remove('on'));
    el.classList.add('on');
}

function setEvents(c) {
    const p = e => {
        const r = c.getBoundingClientRect();
        // Scaling coordinate logic for canvas sizing relative to CSS size
        const scaleX = c.width / r.width;
        const scaleY = c.height / r.height;
        const s = e.touches ? e.touches[0] : e;
        return { 
            x: (s.clientX - r.left) * scaleX, 
            y: (s.clientY - r.top) * scaleY 
        };
    };
    
    c.addEventListener('mousedown', e => { 
        drw = true; 
        cstk = [p(e)]; 
    });
    c.addEventListener('mousemove', e => { 
        if (!drw) return; 
        cstk.push(p(e)); 
        rdraw(); 
    });
    c.addEventListener('mouseup', () => { 
        if (drw) { 
            strks.push({ pts: [...cstk], c: tc }); 
            cstk = []; 
            drw = false; 
        } 
    });
    
    c.addEventListener('touchstart', e => { 
        e.preventDefault(); 
        drw = true; 
        cstk = [p(e)]; 
    }, { passive: false });
    
    c.addEventListener('touchmove', e => { 
        e.preventDefault(); 
        if (!drw) return; 
        cstk.push(p(e)); 
        rdraw(); 
    }, { passive: false });
    
    c.addEventListener('touchend', e => { 
        e.preventDefault(); 
        if (drw) { 
            strks.push({ pts: [...cstk], c: tc }); 
            cstk = []; 
            drw = false; 
        } 
    }, { passive: false });
}

function rdraw() {
    if (!ctx) return;
    const c = getElement('tc');
    ctx.clearRect(0, 0, c.width, c.height);
    drawGuidelines();
    
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.lineWidth = 5;
    
    for (const s of strks) {
        if (s.pts.length < 2) continue;
        ctx.strokeStyle = s.c;
        ctx.beginPath();
        ctx.moveTo(s.pts[0].x, s.pts[0].y);
        s.pts.slice(1).forEach(pt => ctx.lineTo(pt.x, pt.y));
        ctx.stroke();
    }
    
    if (cstk.length > 1) {
        ctx.strokeStyle = tc;
        ctx.beginPath();
        ctx.moveTo(cstk[0].x, cstk[0].y);
        cstk.slice(1).forEach(pt => ctx.lineTo(pt.x, pt.y));
        ctx.stroke();
    }
}

export function clrC() {
    strks = [];
    cstk = [];
    if (ctx) {
        const c = getElement('tc');
        ctx.clearRect(0, 0, c.width, c.height);
        drawGuidelines();
    }
}

export function undo() {
    strks.pop();
    rdraw();
}

export function tNav(d) {
    ti = (ti + d + ALP.length) % ALP.length;
    updTG();
    clrC();
}

function updTG() {
    const l = ALP[ti];
    const tg = getElement('tg');
    const tlbl = getElement('tlbl');
    if (tg) tg.textContent = l.ar;
    if (tlbl) tlbl.textContent = `${l.n} (${l.ro})`;
}

export function tDone() {
    if (!strks.length) {
        toast('আগে অক্ষরটি আঁকুন!');
        return;
    }
    addXP(5);
    toast('চমৎকার! 🎉');
    clrC();
    tNav(1);
}
