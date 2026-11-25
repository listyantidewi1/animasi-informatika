#!/bin/bash
# tambal.sh <bab-NN>: masukkan perubahan yang belum di-commit ke commit bab itu, lalu pasang ulang semua tag.
cd /home/user/acuan-siparkir || exit 1
set -e
T=$(git rev-parse "$1")
git add -A && git commit -q --fixup=$T
GIT_SEQUENCE_EDITOR=true git rebase -q -i --autosquash --root
i=0
for c in $(git rev-list --reverse HEAD); do
  n=$(git log -1 --format=%s $c)
  case "$n" in
    "Proyek Laravel baru") t=bab-01;; "Tabel dan model") t=bab-04;; "Login dan tiga peran") t=bab-05;; "Halaman admin dan log aktivitas") t=bab-06;;
    "Rumus tarif dan test") t=bab-07;; "Kendaraan masuk dan keluar") t=bab-08;; "Tiket dan struk 58 mm") t=bab-09;; "Rekap pendapatan untuk owner") t=bab-10;;
    "Feature test untuk peran dan transaksi") t=bab-11;; "Docker Compose untuk server") t=bab-12;; *) t="";;
  esac
  [ -n "$t" ] && git tag -f $t $c > /dev/null
done
git log --oneline --decorate | head -12
