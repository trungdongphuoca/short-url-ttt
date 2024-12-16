const db = require('../config/database');
const shortid = require('shortid');

class Url {
  static async create(originalUrl, customCode = null) {
    const shortCode = customCode || shortid.generate();
    
    return new Promise((resolve, reject) => {
      db.run(
        'INSERT INTO urls (original_url, short_code) VALUES (?, ?)',
        [originalUrl, shortCode],
        function(err) {
          if (err) reject(err);
          resolve({ id: this.lastID, shortCode });
        }
      );
    });
  }

  static async findByCode(code) {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM urls WHERE short_code = ?', [code], (err, row) => {
        if (err) reject(err);
        resolve(row);
      });
    });
  }

  static async incrementClicks(code) {
    return new Promise((resolve, reject) => {
      db.run(
        'UPDATE urls SET clicks = clicks + 1 WHERE short_code = ?',
        [code],
        (err) => {
          if (err) reject(err);
          resolve();
        }
      );
    });
  }

  static async getHistory() {
    return new Promise((resolve, reject) => {
      db.all(
        'SELECT * FROM urls ORDER BY created_at DESC LIMIT 10',
        [],
        (err, rows) => {
          if (err) reject(err);
          resolve(rows);
        }
      );
    });
  }
}

module.exports = Url; 