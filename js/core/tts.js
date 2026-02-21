import { toast } from './utils.js';

let voices = [];

/**
 * Robustly find an Arabic voice across different platforms.
 */
function getArabicVoice() {
    if (voices.length === 0) {
        voices = window.speechSynthesis.getVoices();
    }

    // Expanded priority list for Windows, Android, MacOS/iOS
    const priorityNames = [
        'Google', 'Maged', 'Laila', 'Hoda', 'Naayf', 'Muna', 'Zeina', 'Microsoft', 'Arabic'
    ];

    const arVoices = voices.filter(v => v.lang.toLowerCase().startsWith('ar'));

    // Diagnostic logging for troubleshooting
    if (arVoices.length === 0 && voices.length > 0) {
        console.warn('TTS: No Arabic voices found among', voices.length, 'total voices.');
    }

    if (arVoices.length === 0) return null;

    // Try to find by priority names
    for (const name of priorityNames) {
        const found = arVoices.find(v => v.name.includes(name));
        if (found) return found;
    }

    return arVoices[0];
}

export function initTTS() {
    if (!window.speechSynthesis) return;

    // Pre-load voices
    voices = window.speechSynthesis.getVoices();

    if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = () => {
            voices = window.speechSynthesis.getVoices();
            console.log('TTS: Voices loaded/changed. Count:', voices.length);
        };
    }
}

let ttsTimeout = null;

export function speak(txt) {
    if (!txt) return;
    if (!window.speechSynthesis) {
        toast('TTS সাপোর্ট নেই');
        return;
    }

    // Cancel previous to allow immediate restart
    window.speechSynthesis.cancel();

    // Reduced debounce (10ms) to preserve User Activation context
    if (ttsTimeout) clearTimeout(ttsTimeout);

    ttsTimeout = setTimeout(() => {
        if (voices.length === 0) {
            voices = window.speechSynthesis.getVoices();
        }

        const u = new SpeechSynthesisUtterance(txt);
        u.rate = 0.8;

        const v = getArabicVoice();
        if (v) {
            u.voice = v;
            u.lang = v.lang;
        } else {
            u.lang = 'ar-SA'; // Generic fallback
        }

        u.onerror = (event) => {
            if (event.error !== 'interrupted') {
                console.error('TTS Error:', event.error);
                if (event.error === 'language-unavailable' || event.error === 'voice-unavailable') {
                    toast('আপনার ডিভাইসে আরবি ভয়েস নেই। উইন্ডোজ সেটিং থেকে Arabic Speech Pack ইনস্টল করুন।');
                }
            }
        };

        window.speechSynthesis.speak(u);
    }, 10);
}
