  // Nomor dihitung per layanan, per hari
  const { rows } = await pool.query(
    `SELECT coalesce(max(number), 0) + 1 AS nomor
       FROM tickets WHERE service_id = $1 AND service_date = current_date`,
    [serviceId]
  );
  const nomor = rows[0].nomor;
  const label = `${layanan.rows[0].code}-${String(nomor).padStart(3, '0')}`;
