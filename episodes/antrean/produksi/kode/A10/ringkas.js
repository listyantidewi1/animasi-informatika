// Jumlah orang yang menunggu per layanan, untuk layar TV
router.get('/ringkas', async (req, res) => {
  const { rows } = await pool.query(
    `SELECT s.code, s.name, count(t.id)::int AS menunggu
       FROM services s LEFT JOIN tickets t
         ON t.service_id = s.id AND t.service_date = current_date AND t.status = 'waiting'
      GROUP BY s.id ORDER BY s.code`
  );
  res.json(rows);
});

