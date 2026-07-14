import { state } from '../models/state.js';
import * as Storage from './storageService.js';
import { showToast } from '../views/componentsView.js';
import { stopTTS, speakText } from './ttsService.js';

export function announceToSR(message) {
  const srEl = document.getElementById('sr-announce');
  if (!srEl) return;
  srEl.textContent = '';
  setTimeout(() => (srEl.textContent = message), 50);
}

export function loadA11yPrefs() {
  const prefs = Storage.get('pevi-a11y');
  if (prefs) {
    Object.assign(state.a11y, prefs);
    applyA11yDOM();
  }
}

export function saveA11yPrefs() {
  Storage.set('pevi-a11y', state.a11y);
}

export function applyA11yDOM() {
  const root = document.documentElement;
  state.a11y.theme === 'dark' ? root.setAttribute('data-theme', 'dark') : root.removeAttribute('data-theme');
  state.a11y.contrast === 'high' ? root.setAttribute('data-contrast', 'high') : root.removeAttribute('data-contrast');
  state.a11y.dyslexia ? root.setAttribute('data-dyslexia', 'on') : root.removeAttribute('data-dyslexia');
  state.a11y.colorblind ? root.setAttribute('data-colorblind', 'on') : root.removeAttribute('data-colorblind');
  state.a11y.motion ? root.setAttribute('data-motion', 'reduced') : root.removeAttribute('data-motion');
  state.a11y.links ? root.setAttribute('data-links', 'underline') : root.removeAttribute('data-links');
  root.setAttribute('data-font-size', state.a11y.fontSize || 'normal');
  
  if (state.a11y.cursor) {
    document.body.style.cursor = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'%3E%3Cpath d='M0 0 L0 28 L8 20 L14 32 L18 30 L12 18 L24 18 Z' fill='%232563EB' stroke='white' stroke-width='2'/%3E%3C/svg%3E") 0 0, auto`;
  } else {
    document.body.style.cursor = '';
  }

  // Sync Buttons
  syncToggle('btn-contrast', state.a11y.contrast === 'high');
  syncToggle('btn-dark', state.a11y.theme === 'dark');
  syncToggle('btn-colorblind', state.a11y.colorblind);
  syncToggle('btn-dyslexia', state.a11y.dyslexia);
  syncToggle('btn-motion', state.a11y.motion);
  syncToggle('btn-links', state.a11y.links);
  syncToggle('btn-cursor', state.a11y.cursor);
  syncToggle('btn-tts', state.a11y.tts);

  document.querySelectorAll('.font-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.size === (state.a11y.fontSize || 'normal'));
  });
}

function syncToggle(id, active) {
  const btn = document.getElementById(id);
  if (!btn) return;
  btn.classList.toggle('active', active);
  btn.setAttribute('aria-pressed', active);
  const ts = btn.querySelector('.toggle-state');
  if (ts) ts.textContent = active ? 'ON' : 'OFF';
}

// Handlers for individual settings
export function toggleTheme() {
  state.a11y.theme = state.a11y.theme === 'dark' ? 'light' : 'dark';
  applyA11yDOM();
  saveA11yPrefs();
  announceToSR(state.a11y.theme === 'dark' ? 'Modo escuro ativado' : 'Modo claro ativado');
}

export function toggleContrast() {
  state.a11y.contrast = state.a11y.contrast === 'high' ? 'normal' : 'high';
  applyA11yDOM();
  saveA11yPrefs();
  announceToSR(state.a11y.contrast === 'high' ? 'Alto contraste ativado' : 'Contraste normal ativado');
}

export function toggleColorblind() {
  state.a11y.colorblind = !state.a11y.colorblind;
  applyA11yDOM();
  saveA11yPrefs();
  announceToSR(state.a11y.colorblind ? 'Modo daltonismo ativado' : 'Modo daltonismo desativado');
}

export function toggleDyslexia() {
  state.a11y.dyslexia = !state.a11y.dyslexia;
  applyA11yDOM();
  saveA11yPrefs();
  announceToSR(state.a11y.dyslexia ? 'Fonte para dislexia ativada' : 'Fonte para dislexia desativada');
}

export function toggleMotion() {
  state.a11y.motion = !state.a11y.motion;
  applyA11yDOM();
  saveA11yPrefs();
  announceToSR(state.a11y.motion ? 'Movimento reduzido ativado' : 'Movimento reduzido desativado');
}

export function toggleLinks() {
  state.a11y.links = !state.a11y.links;
  applyA11yDOM();
  saveA11yPrefs();
  announceToSR(state.a11y.links ? 'Sublinhado de links ativado' : 'Sublinhado de links desativado');
}

export function toggleCursor() {
  state.a11y.cursor = !state.a11y.cursor;
  applyA11yDOM();
  saveA11yPrefs();
  announceToSR(state.a11y.cursor ? 'Cursor grande ativado' : 'Cursor normal restaurado');
}

export function setFontSize(size) {
  state.a11y.fontSize = size;
  applyA11yDOM();
  saveA11yPrefs();
  announceToSR('Tamanho de fonte: ' + size);
}

// Hover TTS
let ttsHoverHandler = null;
export function toggleGlobalTTS() {
  state.a11y.tts = !state.a11y.tts;
  applyA11yDOM();
  saveA11yPrefs();
  
  if (state.a11y.tts) {
    showToast('🔊 TTS ativado — passe o mouse sobre textos', 'info');
    ttsHoverHandler = e => {
      const el = e.target.closest('p,h1,h2,h3,li,blockquote');
      if (el) { stopTTS(); speakText(el.textContent); }
    };
    document.addEventListener('mouseover', ttsHoverHandler);
  } else {
    stopTTS();
    if (ttsHoverHandler) { document.removeEventListener('mouseover', ttsHoverHandler); ttsHoverHandler = null; }
    showToast('🔇 TTS desativado', 'info');
  }
  announceToSR(state.a11y.tts ? 'Leitura por hover ativada' : 'Leitura por hover desativada');
}

export function openVLibras() {
  const vlibrasButton = document.querySelector('[vw-access-button]');
  if (vlibrasButton) {
    vlibrasButton.click();
    showToast('🤟 Tradutor Libras ativado.', 'info');
    announceToSR('Tradutor VLibras ativado.');
  } else {
    showToast('⚠️ O VLibras já está disponível.', 'info');
  }
}

export function resetA11y() {
  state.a11y = { contrast:'normal', theme:'light', fontSize:'normal', dyslexia:false, motion:false, tts:false, links:false, cursor:false, colorblind:false };
  Storage.remove('pevi-a11y');
  applyA11yDOM();
  stopTTS();
  if (ttsHoverHandler) { document.removeEventListener('mouseover', ttsHoverHandler); ttsHoverHandler = null; }
  showToast('✅ Configurações redefinidas', 'success');
  announceToSR('Configurações redefinidas');
}

// A11y Panel UI Logic
export function openA11yPanel() {
  document.getElementById('a11y-panel')?.classList.add('open');
  document.getElementById('a11y-overlay')?.classList.add('open');
  document.body.style.overflow = 'hidden';
  announceToSR('Painel de acessibilidade aberto');
}

export function closeA11yPanel() {
  document.getElementById('a11y-panel')?.classList.remove('open');
  document.getElementById('a11y-overlay')?.classList.remove('open');
  document.body.style.overflow = '';
}
