import { state } from '../models/state.js';

export function speakText(text, btnElement = null) {
  if (!text || !text.trim()) return;
  stopTTS();

  const utt = new SpeechSynthesisUtterance(text.trim().substring(0, 500));
  utt.lang = 'pt-BR'; 
  utt.rate = 0.9; 
  utt.pitch = 1; 
  utt.volume = 1;

  const voices = speechSynthesis.getVoices();
  const ptVoice = voices.find(v => v.lang.startsWith('pt'));
  if (ptVoice) utt.voice = ptVoice;

  utt.onend = () => resetTTSButton();

  if (btnElement) {
    state.activeSpeakBtn = btnElement;
    state.activeSpeakBtn.classList.add('speaking');
    state.activeSpeakBtn.textContent = '⏹ Parar';
  }

  speechSynthesis.speak(utt);
}

export function stopTTS() {
  speechSynthesis.cancel();
  resetTTSButton();
}

export function resetTTSButton() {
  if (state.activeSpeakBtn) {
    state.activeSpeakBtn.classList.remove('speaking');
    state.activeSpeakBtn.textContent = '🔊 Ouvir';
    state.activeSpeakBtn = null;
  }
}
