const fs = require('fs');

try {
  let html = fs.readFileSync('index.html', 'utf8');

  // წაშლის admin-panel სექციას HTML-იდან
  const cleanHtml = html.replace(/<div id="admin-panel"[\s\S]*?<\/div>\s*<\/div>/gi, '');

  fs.writeFileSync('index.html', cleanHtml, 'utf8');
  console.log('Admin panel completely removed from index.html!');
} catch (err) {
  console.error('Error:', err);
}