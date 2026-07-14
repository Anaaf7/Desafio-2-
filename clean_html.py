import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add id="jobs-destaque-grid" to the grid-3 under vagas-destaque-title
destaque_start = content.find('id="vagas-destaque-title">Oportunidades recentes</h2>')
grid3_start = content.find('<div class="grid-3">', destaque_start)
content = content[:grid3_start] + '<div class="grid-3" id="jobs-destaque-grid">' + content[grid3_start+20:]

# 2. Empty the jobs-destaque-grid
grid3_start = content.find('<div class="grid-3" id="jobs-destaque-grid">')
grid3_end = content.find('</section>', grid3_start)
# we need to find the closing </div> of grid-3. 
# We can just use regex to replace everything between `<div class="grid-3" id="jobs-destaque-grid">` and `</section>` with `</div></section>`
content = re.sub(
    r'(<div class="grid-3" id="jobs-destaque-grid">).*?(</section>)',
    r'\1</div>\n          \2',
    content,
    flags=re.DOTALL
)

# 3. Empty the jobs-grid
content = re.sub(
    r'(<div class="grid-2" id="jobs-grid">).*?(</section>\n      </div>\n\n      <!-- ===== EMPRESAS ===== -->)',
    r'\1</div>\n          \2',
    content,
    flags=re.DOTALL
)

# 4. Remove all modal-vagaX and add modals-container
content = re.sub(
    r'<div class="modal-overlay" id="modal-vaga1".*?(<div class="modal-overlay" id="modal-empresa-cadastro")',
    r'<div id="modals-container"></div>\n\n  \1',
    content,
    flags=re.DOTALL
)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("HTML cleaned")
