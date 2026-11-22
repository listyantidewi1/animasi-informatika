  const perJam = await pool.query(
    `SELECT extract(hour FROM created_at AT TIME ZONE 'Asia/Jakarta')::int AS jam, count(*)::int AS jumlah
       FROM tickets WHERE service_date = coalesce($1::date, current_date)
      GROUP BY jam ORDER BY jam`,
    [tanggal]
  );
  res.json({ layanan: perLayanan.rows, per_jam: perJam.rows });
});
