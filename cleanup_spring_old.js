const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'app.js');
let content = fs.readFileSync(filePath, 'utf8');

// Replace pattern 1: tags:['season','season-spring-old','season-summer',
content = content.replace(/tags:\['season','season-spring-old','season-summer',/g, "tags:['season','season-summer',");

// Replace pattern 2: tags:['season','season-spring-old','time',
content = content.replace(/tags:\['season','season-spring-old','time',/g, "tags:['time',");

fs.writeFileSync(filePath, content, 'utf8');
console.log('Cleanup completed successfully!');
