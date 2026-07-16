const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'dist', 'index.html');
if (fs.existsSync(filePath)) {
  let html = fs.readFileSync(filePath, 'utf-8');
  // Remove type="module" crossorigin to allow local file:// execution in Chrome
  html = html.replace(/<script type="module" crossorigin>/g, '<script>');
  fs.writeFileSync(filePath, html);
  console.log('Processed dist/index.html to support local file:// opening');
}
