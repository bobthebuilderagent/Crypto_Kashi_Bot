const db = require('better-sqlite3')('./src/data/crypto_kashi_bot.db');
const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name").all();
console.log('Tables:', tables.map(t => t.name).join('\n'));
console.log('\nRow counts:');
tables.forEach(t => {
  const count = db.prepare('SELECT COUNT(*) as c FROM ' + t.name).get().c;
  console.log('  ' + t.name + ': ' + count);
});
db.close();
