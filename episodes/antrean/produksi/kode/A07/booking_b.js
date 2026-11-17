router.post('/booking', async (req, res) => {
  const slotId = Number(req.body.slot_id);
  const nama = String(req.body.name || '').trim();
  const hp = String(req.body.phone || '').replace(/[^0-9+]/g, '');
  if (!slotId || nama.length < 2 || hp.length < 9) {
    return res.status(400).json({ error: 'Nama dan nomor HP wajib diisi dengan benar' });
  }
