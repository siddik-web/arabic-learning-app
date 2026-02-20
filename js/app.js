import { speak } from './core/tts.js';
import { getElement } from './core/utils.js';
import { ALP } from './data/alphabet.js';

import { showTab } from './modules/ui.js';
import { renderAl, showDet, markL, toggleFavLetter, curAr } from './modules/alphabet.js';
import { setFcM, flip, fcMv, shuffleFc, fcAr, attachSwipeEvents } from './modules/flashcard.js';
import { setTC, clrC, undo, tNav, tDone } from './modules/tracing.js';
import { renderHar } from './modules/harakat.js';
import { renderW, fw, toggleFavWord } from './modules/words.js';
import { setQM, nextQ, initQ, ansQ } from './modules/quiz.js';
import { renderTJ } from './modules/tajweed.js';
import { renderDU, toggleFavDua } from './modules/duas.js';
import { showS, spkS } from './modules/surahs.js';
import { renderTips } from './modules/tips.js';
import { chkStreak, checkNewDay, updSbar, resetP, shareProgress } from './modules/progress.js';

window.showTab = showTab;
window.speak = speak;
window.showDet = showDet;
window.markL = markL;
window.toggleFavLetter = toggleFavLetter;
window.setFcM = setFcM;
window.flip = flip;
window.fcMv = fcMv;
window.shuffle = shuffleFc;
window.fcAr = fcAr;
window.setTC = setTC;
window.clrC = clrC;
window.undo = undo;
window.tNav = tNav;
window.tDone = tDone;
window.fw = fw;
window.toggleFavWord = toggleFavWord;
window.setQM = setQM;
window.nextQ = nextQ;
window.initQ = initQ;
window.ansQ = ansQ;
window.toggleFavDua = toggleFavDua;
window.showS = showS;
window.spkS = spkS;
window.resetP = resetP;
window.shareProgress = shareProgress;

function ensureAdaptiveQuizMode() {
    const qms = document.querySelector('.qms');
    if (!qms || getElement('weakModeBtn')) return;

    const btn = document.createElement('button');
    btn.className = 'qmb';
    btn.id = 'weakModeBtn';
    btn.dataset.qm = 'wr';
    btn.textContent = '🎯 দুর্বল হরফ';
    qms.appendChild(btn);
}

function bootstrap() {
    chkStreak();
    checkNewDay();

    renderAl();
    renderHar();
    renderW();
    renderTJ();
    renderDU();
    renderTips();

    ensureAdaptiveQuizMode();
    initQ();
    showS(0);

    updSbar();
    attachSwipeEvents();

    window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
}

document.addEventListener('click', (e) => {
    const target = e.target.closest('button, [data-a], [data-coach-letter], #dlet, #tc, #fc');
    if (!target) return;

    if (target.dataset.tab) {
        showTab(target.dataset.tab, target);
        return;
    }

    if (target.id === 'dlet' || target.id === 'sbtn' || target.id === 'coachSpeak') speak(curAr);
    if (target.id === 'lbtn') markL();
    if (target.id === 'fbtn') toggleFavLetter();
    if (target.dataset.coachLetter) {
        const i = ALP.findIndex(x => x.ar === target.dataset.coachLetter);
        if (i >= 0) showDet(i);
        speak(target.dataset.coachLetter);
    }

    if (target.dataset.fcm) setFcM(target.dataset.fcm, target);
    if (target.id === 'fc') flip();
    if (target.dataset.fcn) fcMv(parseInt(target.dataset.fcn, 10));
    if (target.id === 'fcspeak') speak(fcAr());
    if (target.id === 'fcshuffle') shuffleFc();

    if (target.dataset.tnav) tNav(parseInt(target.dataset.tnav, 10));
    if (target.id === 'tclr') clrC();
    if (target.id === 'tundo') undo();
    if (target.id === 'tdone') tDone();

    if (target.dataset.wfil) fw(target.dataset.wfil, target);
    if (target.dataset.a && !target.classList.contains('wsp') && !target.classList.contains('duasp')) speak(target.dataset.a);

    if (target.dataset.qm) setQM(target.dataset.qm, target);
    if (target.id === 'nxtb') nextQ();
    if (target.id === 'newqb') initQ();

    if (target.dataset.ss) showS(parseInt(target.dataset.ss, 10), target);
    if (target.id === 'sspk') spkS();

    if (target.classList.contains('duasp')) speak(target.dataset.a);
});

bootstrap();
