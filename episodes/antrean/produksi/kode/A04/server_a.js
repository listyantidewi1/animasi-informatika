// SiAntre: server utama
const express = require('express');

const app = express();

app.get('/halo', (req, res) => {
  res.send('Halo dari SiAntre!');
});

app.listen(3000);
