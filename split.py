import sys

def split_file():
    with open('analisar.html', 'r', encoding='utf-8') as f:
        content = f.read()

    # Extract CSS
    style_start = content.find('<style>') + 7
    style_end = content.find('</style>')
    css_content = content[style_start:style_end]

    # Extract JS
    script_start = content.find('<script>') + 8
    script_end = content.find('</script>', script_start)
    
    # Update HTML
    # We replace the inline <style> block with <link rel="stylesheet" href="css/style.css">\n<link rel="stylesheet" href="css/components.css">
    new_html = content[:style_start-7] + '<link rel="stylesheet" href="css/style.css">\n  <link rel="stylesheet" href="css/components.css">\n' + content[style_end+8:script_start-8]
    
    # Remove the first large <script> block and insert type="module" src="js/app.js"
    new_html += '<script type="module" src="js/app.js"></script>\n' + content[script_end+9:]

    # Remove all inline onclick="" properties because we are using event delegation
    import re
    new_html = re.sub(r'\s+onclick="[^"]+"', '', new_html)

    # Save CSS
    import os
    os.makedirs('css', exist_ok=True)
    with open('css/style.css', 'w', encoding='utf-8') as f:
        f.write(css_content)

    # Save HTML as index.html
    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(new_html)

    print("Splitting complete!")

split_file()
