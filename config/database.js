const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database(
  path.join(__dirname, '../database.sqlite'),
  (err) => {
    if (err) {
      console.error('Không thể kết nối đến database:', err);
    } else {
      console.log('Đã kết nối đến SQLite database');
      createTable();
    }
  }
);

function createTable() {
  const sql = `
    CREATE TABLE IF NOT EXISTS urls (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      original_url TEXT NOT NULL,
      short_code TEXT NOT NULL UNIQUE,
      clicks INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `;
  
  db.run(sql);
}

module.exports = db; 