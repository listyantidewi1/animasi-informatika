# Seri "Membangun Sistem Antrean dari Nol" (@iTeachSWE)

Satu video penuh ±2 jam 10 menit, 13 bab (A00–A12). Rencana dan naskah ada di Claude Doc (lihat memori proyek).

- `siantre/` aplikasi versi jadi (Node.js + Express 5 + PostgreSQL 16, HTML/CSS/JS murni, SSE).
  Jalankan: `npm i`, `psql -f db/schema.sql -f db/seed.sql`, `node db/pengguna.js`, `node src/server.js`.
  Akun contoh: pakrahmat (admin), dina (Loket 1), yoga (Loket 2), sandi `rahasia123`.
- Perekaman memakai VS Code sungguhan (code-server 4.105.1, Node 22) di Chromium mode `--app`.

## Memasang code-server di lingkungan cloud
1. `apt-get install -y libkrb5-dev`
2. Taruh ripgrep di cache (API GitHub diblokir, unduhan langsung boleh):
   `mkdir -p /tmp/vscode-ripgrep-cache-1.15.14 && curl -L -o /tmp/vscode-ripgrep-cache-1.15.14/ripgrep-v13.0.0-13-x86_64-unknown-linux-musl.tar.gz https://github.com/microsoft/ripgrep-prebuilt/releases/download/v13.0.0-13/ripgrep-v13.0.0-13-x86_64-unknown-linux-musl.tar.gz`
3. `npm i --unsafe-perm code-server@4.105.1` (versi 4.106 ke atas butuh Node 24)
4. Salin `vscode_settings.json` ke `~/.local/share/code-server/User/settings.json`; terminal memakai `terminal.rc`.
5. `code-server --auth none --bind-addr 127.0.0.1:8080 <folder>`, buka di Chromium `--app=` agar tanpa bilah browser.
6. PostgreSQL 16 bawaan: `initdb` di /home/user/pg/data sebagai user postgres, `ALTER DATABASE antrean SET timezone='Asia/Jakarta'`.
