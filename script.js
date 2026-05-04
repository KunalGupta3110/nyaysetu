const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, 'pages');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

files.forEach(f => {
  const fp = path.join(dir, f);
  let c = fs.readFileSync(fp, 'utf8');
  c = c.replace(/(<a class="nav-tab" href="students\.html".*?>.*?Students.*?<\/a>)/g, '$1\n      <a class="nav-tab" href="lawyers.html" data-page="lawyers"><span class="nav-icon">⚖️</span> <span data-i18n="nav_lawyers">Lawyers</span></a>');
  fs.writeFileSync(fp, c, 'utf8');
  console.log('Updated ' + f);
});
