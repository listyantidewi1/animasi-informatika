// Menjalankan beberapa query sebagai satu transaksi: semua berhasil, atau tidak sama sekali.
async function transaksi(kerja) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const hasil = await kerja(client);
    await client.query('COMMIT');
    return hasil;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

