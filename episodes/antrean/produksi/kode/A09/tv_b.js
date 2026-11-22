
// "A-012" dibaca "A, dua belas", bukan "A nol satu dua"
function ucapkan(label, loket) {
  const [huruf, angka] = label.split('-');
  const kalimat = new SpeechSynthesisUtterance(`Nomor ${huruf}, ${Number(angka)}. Silakan ke ${loket}.`);
  kalimat.lang = 'id-ID';
  speechSynthesis.speak(kalimat);
}

// Browser baru mengizinkan suara setelah pengguna mengklik sesuatu
let bolehBersuara = false;
document.getElementById('suara').onclick = (e) => {
  bolehBersuara = true;
  e.target.remove();
};
