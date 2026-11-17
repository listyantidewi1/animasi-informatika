    // Grafik batang sederhana di canvas, tanpa pustaka
    function gambar(perJam) {
      const c = $('grafik').getContext('2d'), W = 1600, H = 520, kiri = 70, bawah = 60;
      c.clearRect(0, 0, W, H);
      const jam = []; for (let j = 7; j <= 17; j++) jam.push(j);
      const nilai = jam.map((j) => (perJam.find((p) => p.jam === j) || { jumlah: 0 }).jumlah);
      const maks = Math.max(1, ...nilai), lebar = (W - kiri - 20) / jam.length;
      c.font = '600 26px Inter, sans-serif'; c.textAlign = 'center';
      nilai.forEach((n, i) => {
        const h = (H - bawah - 70) * n / maks, x = kiri + i * lebar + 10;
        c.fillStyle = n === maks ? '#c2410c' : '#1d4ed8';
        c.beginPath(); c.roundRect(x, H - bawah - h, lebar - 20, h, 8); c.fill();
        c.fillStyle = '#0f172a'; if (n) c.fillText(n, x + (lebar - 20) / 2, H - bawah - h - 14);
        c.fillStyle = '#64748b'; c.fillText(`${jam[i]}.00`, x + (lebar - 20) / 2, H - 20);
      });
    }
