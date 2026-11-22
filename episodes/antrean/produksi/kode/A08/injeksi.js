// Demo SQL injection: jangan pernah menyambung input ke dalam teks query
const { pool } = require('../src/db');
const username = "' OR '1'='1";

(async () => {
  const bahaya = await pool.query("SELECT username FROM users WHERE username = '" + username + "'");
  console.log('Sambung teks :', bahaya.rows.length ? 'MASUK sebagai ' + bahaya.rows[0].username : 'ditolak');

  const aman = await pool.query('SELECT username FROM users WHERE username = $1', [username]);
  console.log('Parameter $1 :', aman.rows.length ? 'MASUK sebagai ' + aman.rows[0].username : 'ditolak');
  await pool.end();
})();
