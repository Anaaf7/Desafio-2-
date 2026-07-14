import { jobs } from '../models/jobsModel.js';

export function showToast(message, type = 'info', duration = 3500) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const icons = { success: '✅', error: '❌', info: 'ℹ️' };
  const toast = document.createElement('div');
  
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span>${icons[type] || 'ℹ️'}</span><span>${message}</span>`;
  toast.setAttribute('role', 'alert');
  
  container.appendChild(toast);
  
  setTimeout(() => {
    toast.style.animation = 'toastIn 0.3s ease reverse forwards';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

export function openModal(id) {
  const m = document.getElementById(`modal-${id}`);
  if (m) {
    m.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}

export function closeModal(id) {
  const m = document.getElementById(`modal-${id}`);
  if (m) {
    m.classList.remove('open');
    document.body.style.overflow = '';
  }
}

export function closeAllModals() {
  document.querySelectorAll('.modal-overlay.open').forEach(m => {
    m.classList.remove('open');
    document.body.style.overflow = '';
  });
}

// ---- DYNAMIC RENDERING ----
export function renderJobsCards() {
  const destaqueContainer = document.getElementById('jobs-destaque-grid');
  const allJobsContainer = document.getElementById('jobs-grid');
  const modalsContainer = document.getElementById('modals-container'); // Need a place to inject modals

  if (destaqueContainer) destaqueContainer.innerHTML = '';
  if (allJobsContainer) allJobsContainer.innerHTML = '';

  jobs.forEach(job => {
    const isDestaque = job.featured;
    
    // Build tags HTML
    const tagsHtml = job.tags.map(tag => `<span class="badge badge-${tag.color}">${tag.text}</span>`).join('');
    // Build meta HTML
    const metaHtml = job.meta.map(m => `<span>${m}</span>`).join('');

    const cardHtml = `
      <article class="job-card animate-in" data-categories="${job.categories}" data-job-id="${job.id}" aria-labelledby="${job.id}h" tabindex="0">
        <div class="job-card-header">
          <div class="job-card-logo" aria-hidden="true">${job.logo}</div>
          <div style="flex:1;">
            <div class="job-card-name" id="${job.id}h">${job.title}</div>
            <div class="job-card-company">${job.company}</div>
          </div>
          ${!isDestaque ? '<span class="badge badge-green">🟢 Ativa</span>' : ''}
        </div>
        <div class="job-card-meta">${metaHtml}</div>
        <div class="tts-wrap">
          <p class="job-card-desc" id="${job.id}-desc">${job.shortDesc}</p>
          <button class="speak-btn" aria-label="Ouvir">🔊 Ouvir</button>
        </div>
        <div class="job-card-footer">
          <div class="flex gap-1 flex-wrap">${tagsHtml}</div>
          ${isDestaque ? `<span class="text-muted" style="font-size:0.8rem;">${job.time}</span>` : `<button class="btn btn-primary" style="padding:0.4rem 1rem;font-size:0.85rem;">Candidatar</button>`}
        </div>
      </article>
    `;

    if (isDestaque && destaqueContainer) destaqueContainer.insertAdjacentHTML('beforeend', cardHtml);
    if (allJobsContainer) allJobsContainer.insertAdjacentHTML('beforeend', cardHtml);

    // Build Modal
    const modalHtml = `
      <div class="modal-overlay" id="modal-${job.id}" role="dialog" aria-modal="true" aria-labelledby="m${job.id}-title">
        <div class="modal">
          <div class="modal-header"><h2 class="modal-title" id="m${job.id}-title">${job.title}</h2><button class="modal-close" aria-label="Fechar">✕</button></div>
          <div class="flex gap-1 flex-wrap mb-2">${tagsHtml}</div>
          <p style="font-weight:700;margin-bottom:0.25rem;">${job.company} · ${job.meta.find(m => m.includes('R$')) || ''}</p>
          <hr class="divider" />
          <h3 style="font-weight:700;margin-bottom:0.5rem;">Sobre a vaga</h3>
          <div class="tts-wrap"><p class="text-muted" style="line-height:1.7;" id="m${job.id}-desc">${job.fullDesc}</p><button class="speak-btn" aria-label="Ouvir">🔊 Ouvir</button></div>
          <h3 style="font-weight:700;margin-bottom:0.5rem;margin-top:1rem;">Adaptações / Ambiente</h3>
          <ul style="list-style:none;display:flex;flex-direction:column;gap:0.4rem;margin-bottom:1rem;">
            ${job.benefits.map(b => `<li>${b}</li>`).join('')}
          </ul>
          <button class="btn btn-primary" style="width:100%;">Candidatar-me a esta vaga</button>
        </div>
      </div>
    `;

    if (modalsContainer && !document.getElementById(`modal-${job.id}`)) {
      modalsContainer.insertAdjacentHTML('beforeend', modalHtml);
    }
  });
}
