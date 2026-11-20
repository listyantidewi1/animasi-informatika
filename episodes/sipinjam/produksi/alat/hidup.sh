#!/bin/bash
# Hidupkan layanan setelah container mulai ulang: MySQL, Xvfb :99
mkdir -p /var/run/mysqld && chown mysql:mysql /var/run/mysqld
pgrep -x mysqld >/dev/null || (nohup mysqld_safe > /tmp/claude-0/mysqld.log 2>&1 &)
pgrep -f "Xvfb :99" >/dev/null || (nohup Xvfb :99 -screen 0 2560x1440x24 -nolisten tcp > /tmp/claude-0/xvfb.log 2>&1 &)
for i in $(seq 30); do mysqladmin ping >/dev/null 2>&1 && break; sleep 1; done
mysqladmin ping
