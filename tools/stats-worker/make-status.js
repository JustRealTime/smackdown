// Makes the public status page site/status.html (served as typebite.io/status) from page.html: same design, no key,
// data from the stats worker's /public endpoint (no hosts, versions or mails). Run after every change of page.html: node tools/stats-worker/make-status.js
const fs = require('fs'), path = require('path');
const API = 'https://typebite-stats.alikesan2004.workers.dev/public';
let s = fs.readFileSync(path.join(__dirname, 'page.html'), 'utf8');
s = s.replace('__INIT__', 'null').replace('__PUBLIC__', 'true').replace('__API__', JSON.stringify(API));
fs.writeFileSync(path.join(__dirname, '..', '..', 'site', 'status.html'), s);
console.log('site/status.html written');
