const fs = require('fs');
const file = 'c:/Users/kunal/Desktop/nyaysetu/pages/dashboard.html';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/\$\{profile\?\.role === 'student' \? '<a class="nav-tab" href="students\.html".*?<\/a>\n\s*' : ''\}\n\s*<a class="nav-tab" href="lawyers\.html".*?<\/a>' : ''\}/g,
  "${profile?.role === 'student' ? '<a class=\"nav-tab\" href=\"students.html\" data-page=\"students\" data-i18n=\"nav_students\">🎓 Students</a>' : ''}\n    <a class=\"nav-tab\" href=\"lawyers.html\" data-page=\"lawyers\"><span class=\"nav-icon\">⚖️</span> <span data-i18n=\"nav_lawyers\">Lawyers</span></a>"
);

fs.writeFileSync(file, content, 'utf8');
