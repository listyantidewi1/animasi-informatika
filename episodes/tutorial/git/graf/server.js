// Server kecil: membaca keadaan repo Git sungguhan untuk panel graf commit.
const http = require('http'), { execFileSync } = require('child_process'), fs = require('fs'), path = require('path');
const git = (repo, args) => { try { return execFileSync('git', ['-C', repo, ...args], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }); } catch { return ''; } };
function keadaan(repo) {
  if (!fs.existsSync(path.join(repo, '.git'))) return { ada: false, kerja: daftarFolder(repo) };
  const SEP = '\x1f';
  const log = git(repo, ['log', '--all', '--topo-order', `--format=%H${SEP}%h${SEP}%P${SEP}%s${SEP}%an`]).trim().split('\n').filter(Boolean)
    .map(l => { const [H, h, P, s, an] = l.split(SEP); return { H, h, P: P ? P.split(' ') : [], s, an }; });
  const ada = new Set(log.map(c => c.H));
  // commit yang hanya tersisa di reflog (misalnya setelah reset --hard): ditampilkan pudar
  const hantu = [];
  const rl = git(repo, ['log', '-g', '--format=%H' + SEP + '%h' + SEP + '%P' + SEP + '%s' + SEP + '%an', 'HEAD']).trim().split('\n').filter(Boolean);
  const lihat = new Set();
  for (const l of rl) { const [H, h, P, s, an] = l.split(SEP); if (!ada.has(H) && !lihat.has(H)) { lihat.add(H); hantu.push({ H, h, P: P ? P.split(' ') : [], s, an, hantu: true }); } }
  const refs = {};
  for (const l of git(repo, ['for-each-ref', '--format=%(objectname) %(refname:short) %(refname)']).trim().split('\n').filter(Boolean)) {
    const [H, nama, full] = l.split(' '); if (full.startsWith('refs/stash')) continue;
    (refs[H] = refs[H] || []).push({ nama, jenis: full.startsWith('refs/tags') ? 'tag' : full.startsWith('refs/remotes') ? 'remote' : 'branch' });
  }
  const headRef = git(repo, ['symbolic-ref', '-q', '--short', 'HEAD']).trim();
  const headH = git(repo, ['rev-parse', '-q', '--verify', 'HEAD']).trim();
  const st = git(repo, ['status', '--porcelain=v1', '-uall']).split('\n').filter(Boolean);
  const staging = [], kerja = [], konflik = [];
  for (const l of st) {
    const X = l[0], Y = l[1], f = l.slice(3);
    if (X === 'U' || Y === 'U' || (X === 'A' && Y === 'A') || (X === 'D' && Y === 'D')) { konflik.push(f); continue; }
    if (X === '?') { kerja.push({ f, k: 'baru' }); continue; }
    if (X !== ' ') staging.push({ f, k: X === 'A' ? 'baru' : X === 'D' ? 'hapus' : 'ubah' });
    if (Y !== ' ') kerja.push({ f, k: Y === 'D' ? 'hapus' : 'ubah' });
  }
  const tersimpan = headH ? git(repo, ['ls-tree', '-r', '--name-only', 'HEAD']).trim().split('\n').filter(Boolean) : [];
  const merging = fs.existsSync(path.join(repo, '.git', 'MERGE_HEAD'));
  const stash = git(repo, ['stash', 'list']).trim().split('\n').filter(Boolean).length;
  return { ada: true, commits: log.concat(hantu), refs, headRef, headH, staging, kerja, konflik, tersimpan, merging, stash };
}
function daftarFolder(repo) { try { return fs.readdirSync(repo).filter(f => f !== 'node_modules').map(f => ({ f, k: 'luar' })); } catch { return []; } }
http.createServer((q, r) => {
  const u = new URL(q.url, 'http://x');
  if (u.pathname === '/state') { r.setHeader('content-type', 'application/json'); r.end(JSON.stringify(keadaan(u.searchParams.get('repo')))); return; }
  const f = path.join(__dirname, u.pathname === '/' ? 'index.html' : u.pathname);
  fs.readFile(f, (e, d) => { if (e) { r.statusCode = 404; r.end(); } else { r.setHeader('content-type', f.endsWith('.html') ? 'text/html; charset=utf-8' : 'application/javascript'); r.end(d); } });
}).listen(7070, '127.0.0.1');
