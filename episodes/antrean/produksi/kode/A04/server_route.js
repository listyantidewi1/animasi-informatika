app.get('/api/layanan', async (req, res) => {
  const { rows } = await pool.query('SELECT id, code, name, avg_minutes FROM services ORDER BY code');
  res.json(rows);
});

