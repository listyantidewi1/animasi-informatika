#!/bin/bash
# Hidupkan layanan setelah container mulai ulang: MySQL, Xvfb :99 (code-server dinyalakan reset_vs.sh)
mkdir -p /tmp/claude-0 /var/run/mysqld && chown mysql:mysql /var/run/mysqld
pgrep -x mysqld >/dev/null || { rm -f /var/run/mysqld/*.lock /var/run/mysqld/*.sock; (nohup mysqld_safe > /tmp/claude-0/mysqld.log 2>&1 &); }
pgrep -f "Xvfb :99" >/dev/null || (nohup Xvfb :99 -screen 0 2560x1440x24 -nolisten tcp > /tmp/claude-0/xvfb.log 2>&1 &)
for i in $(seq 30); do mysqladmin ping >/dev/null 2>&1 && break; sleep 1; done
mysqladmin ping
