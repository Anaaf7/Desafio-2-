import { navigate } from './controllers/router.js';
import * as A11y from './services/a11yService.js';
import { speakText, stopTTS } from './services/ttsService.js';
import { observeCounters, observeAnimations, toggleMobileNav } from './views/layoutView.js';
import { openModal, closeModal, closeAllModals, showToast, renderJobsCards } from './views/componentsView.js';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initializations
  A11y.loadA11yPrefs();
  renderJobsCards();
  observeAnimations();
  observeCounters();

  // 2. Initial Route
  const hash = window.location.hash.replace('#', '');
  if (hash && document.getElementById(`page-${hash}`)) {
    navigate(hash, false);
  } else {
    navigate('home', false);
  }

  // 3. Setup window event for back/forward
  window.addEventListener('popstate', e => navigate(e.state?.page || 'home', false));

  // 4. Global Event Delegation (Replaces inline onclicks)
  document.body.addEventListener('click', (e) => {
    // Nav Links
    const navBtn = e.target.closest('[data-nav]');
    if (navBtn) {
      navigate(navBtn.dataset.nav);
      // close mobile nav if inside it
      if (navBtn.closest('#mobile-nav')) {
        toggleMobileNav();
      }
    }

    // Buttons routing explicitly
    if (e.target.closest('.btn-nav-outline') || (e.target.tagName === 'BUTTON' && e.target.textContent.includes('Buscar Vagas')) || e.target.closest('.btn-primary.btn-lg') || e.target.closest('.btn-outline.btn-lg')) {
      const text = e.target.textContent || e.target.closest('button').textContent;
      if (text.includes('Ver Vagas') || text.includes('Buscar Vagas') || text.includes('Ver Todas')) navigate('vagas');
      if (text.includes('Como Funciona')) navigate('sobre');
    }

    // Hamburger
    if (e.target.closest('#hamburger')) toggleMobileNav();

    // A11y Panel Toggles
    if (e.target.closest('.a11y-nav-btn')) A11y.openA11yPanel();
    if (e.target.closest('.a11y-close')) A11y.closeA11yPanel();
    if (e.target.closest('#a11y-overlay')) A11y.closeA11yPanel();
    
    const toggleBtn = e.target.closest('.a11y-toggle');
    if (toggleBtn) {
      if (toggleBtn.id === 'btn-contrast') A11y.toggleContrast();
      if (toggleBtn.id === 'btn-dark') A11y.toggleTheme();
      if (toggleBtn.id === 'btn-colorblind') A11y.toggleColorblind();
      if (toggleBtn.id === 'btn-dyslexia') A11y.toggleDyslexia();
      if (toggleBtn.id === 'btn-tts') A11y.toggleGlobalTTS();
      if (toggleBtn.id === 'btn-motion') A11y.toggleMotion();
      if (toggleBtn.id === 'btn-links') A11y.toggleLinks();
      if (toggleBtn.id === 'btn-cursor') A11y.toggleCursor();
      if (toggleBtn.id === 'btn-vlibras') A11y.openVLibras();
    }

    const fontBtn = e.target.closest('.font-btn');
    if (fontBtn) A11y.setFontSize(fontBtn.dataset.size);

    if (e.target.closest('.a11y-reset')) A11y.resetA11y();

    // Modals
    const btnCadastrar = e.target.closest('.btn-nav-primary') || (e.target.closest('.btn-primary') && e.target.textContent.includes('Cadastrar Gratuitamente'));
    if (btnCadastrar) openModal('cadastro');

    if (e.target.closest('.modal-close')) {
      const modal = e.target.closest('.modal-overlay');
      if (modal) modal.classList.remove('open');
      document.body.style.overflow = '';
    }
    
    if (e.target.classList.contains('modal-overlay')) {
      e.target.classList.remove('open');
      document.body.style.overflow = '';
    }

    const jobCard = e.target.closest('.job-card');
    if (jobCard) {
      const jobId = jobCard.dataset.jobId;
      if (jobId) openModal(jobId);
    }

    // TTS Speak Buttons
    const speakBtn = e.target.closest('.speak-btn');
    if (speakBtn) {
      e.stopPropagation();
      const wrap = speakBtn.closest('.tts-wrap');
      // Encontra p ou texto e fala
      const pElement = wrap ? wrap.querySelector('p, h1, h2, h3, span') : null;
      if (pElement) {
        if (speakBtn.classList.contains('speaking')) {
          stopTTS();
        } else {
          speakText(pElement.textContent, speakBtn);
        }
      }
    }

    // Filters and Form Actions
    const filterChip = e.target.closest('.filter-chip');
    if (filterChip) {
      document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
      filterChip.classList.add('active');
      filterJobs();
    }

    if (e.target.tagName === 'BUTTON' && e.target.textContent.includes('Enviar Mensagem')) {
      e.preventDefault();
      const form = e.target.closest('form');
      if (form) {
        const nome = form.querySelector('#contato-nome')?.value.trim();
        const email = form.querySelector('#contato-email')?.value.trim();
        if (!nome || !email) { showToast('❌ Preencha os campos obrigatórios', 'error'); return; }
        showToast('✅ Mensagem enviada! Responderemos em breve.', 'success');
      }
    }
  });

  document.getElementById('search-jobs')?.addEventListener('input', filterJobs);

  function filterJobs() {
    const query = (document.getElementById('search-jobs')?.value || '').toLowerCase();
    const activeFilter = document.querySelector('.filter-chip.active')?.dataset.filter || 'all';
    const cards = document.querySelectorAll('.job-card[data-categories]');
    let shown = 0;
    cards.forEach(card => {
      const text = card.textContent.toLowerCase();
      const cats = card.dataset.categories || '';
      const show = (!query || text.includes(query)) && (activeFilter === 'all' || cats.includes(activeFilter));
      card.style.display = show ? '' : 'none';
      if (show) shown++;
    });
    const count = document.getElementById('jobs-count');
    if (count) count.textContent = shown + ' vaga' + (shown !== 1 ? 's' : '') + ' encontrada' + (shown !== 1 ? 's' : '');
  }

  // Keyboard
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      A11y.closeA11yPanel();
      closeAllModals();
      stopTTS();
    }
  });
});
