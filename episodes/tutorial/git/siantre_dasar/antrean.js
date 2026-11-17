// Logika nomor antrean SiAntre (versi kecil untuk seri Git)
let nomorTerakhir = 0;

function formatNomor(n) {
  return 'A' + n;
}

function ambilNomor() {
  nomorTerakhir = nomorTerakhir + 1;
  return formatNomor(nomorTerakhir);
}

module.exports = { formatNomor, ambilNomor };
