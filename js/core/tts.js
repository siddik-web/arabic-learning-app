import { toast } from './utils.js';

export function speak(txt) {
    if (!window.speechSynthesis) {
        toast('TTS সাপোর্ট নেই');
        return;
    }
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(txt);
    u.lang = 'ar-SA';
    u.rate = 0.75;
    
    // Some browsers populate voices asynchronously
    const vs = window.speechSynthesis.getVoices();
    const v = vs.find(x => x.lang.startsWith('ar'));
    if (v) u.voice = v;
    
    window.speechSynthesis.speak(u);
}

// In app.js we will call:
// window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
