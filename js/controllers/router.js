import { state } from '../models/state.js';
import { observeAnimations, updateNavActiveUI } from '../views/layoutView.js';

export function navigate(pageId, pushState = true) {
  const currentEl = document.querySelector('.page.active');
  const nextEl = document.getElementById(`page-${pageId}`);
  
  if (!nextEl || pageId === state.currentPage) return;
  
  if (currentEl) {
    currentEl.classList.remove('active');
    currentEl.style.display = 'none';
  }
  
  nextEl.style.display = 'block';
  nextEl.offsetHeight; // reflow
  nextEl.classList.add('active');
  
  state.currentPage = pageId;
  window.scrollTo({ top: 0, behavior: 'smooth' });
  
  updateNavActiveUI(pageId);
  observeAnimations();

  if (pushState) history.pushState({ page: pageId }, '', '#' + pageId);
}
