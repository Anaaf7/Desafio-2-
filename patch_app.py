with open('js/app.js', 'r') as f:
    content = f.read()

content = content.replace("import { openModal, closeModal, closeAllModals, showToast } from './views/componentsView.js';", "import { openModal, closeModal, closeAllModals, showToast, renderJobsCards } from './views/componentsView.js';")

init_block = """  // 1. Initializations
  A11y.loadA11yPrefs();
  renderJobsCards();
  observeAnimations();
  observeCounters();"""
content = content.replace("  // 1. Initializations\n  A11y.loadA11yPrefs();\n  observeAnimations();\n  observeCounters();", init_block)

click_handler = """    const jobCard = e.target.closest('.job-card');
    if (jobCard) {
      const jobId = jobCard.dataset.jobId;
      if (jobId) openModal(jobId);
    }"""
content = content.replace("""    const jobCard = e.target.closest('.job-card');
    if (jobCard) {
      if (jobCard.getAttribute('aria-labelledby') === 'vaga1h') openModal('vaga1');
      if (jobCard.getAttribute('aria-labelledby') === 'vaga2h') openModal('vaga2');
      if (jobCard.getAttribute('aria-labelledby') === 'vaga3h') openModal('vaga3');
    }""", click_handler)

with open('js/app.js', 'w') as f:
    f.write(content)
