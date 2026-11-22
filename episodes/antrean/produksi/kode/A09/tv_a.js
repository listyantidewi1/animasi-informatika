// Layar TV: dengarkan kabar panggil dari server
const sumber = new EventSource('/api/siaran');

sumber.addEventListener('panggil', (e) => {
  const data = JSON.parse(e.data);
  document.getElementById('nomor').textContent = data.label;
  document.getElementById('loket').textContent = 'Silakan ke ' + data.loket;
  if (bolehBersuara) ucapkan(data.label, data.loket);
});
