  const serviceId = Number(req.body.service_id);
  if (!Number.isInteger(serviceId) || serviceId <= 0) {
    return res.status(400).json({ error: 'service_id harus berupa angka' });
  }
  const layanan = await pool.query('SELECT code FROM services WHERE id = $1', [serviceId]);
  if (layanan.rowCount === 0) {
    return res.status(404).json({ error: 'Layanan tidak ditemukan' });
  }

