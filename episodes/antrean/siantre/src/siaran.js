// Server-Sent Events: server mengirim kabar ke semua layar yang sedang terbuka.
const pendengar = new Set();

function dengarkan(req, res) {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
    'X-Accel-Buffering': 'no', // supaya Nginx tidak menahan pesan
  });
  res.write('retry: 3000\n\n');
  pendengar.add(res);
  const detak = setInterval(() => res.write(': detak\n\n'), 25000);
  req.on('close', () => { clearInterval(detak); pendengar.delete(res); });
}

function siarkan(jenis, data) {
  const pesan = `event: ${jenis}\ndata: ${JSON.stringify(data)}\n\n`;
  for (const res of pendengar) res.write(pesan);
}

module.exports = { dengarkan, siarkan };
