#!/bin/bash
while :
do
    echo "Downloading certificates"
    wget -O /etc/nginx/certs/my.ava.do.crt.temp http://iso.ava.do/my.ava.do.crt
    wget -O /etc/nginx/certs/my.ava.do.key.temp  http://iso.ava.do/my.ava.do.key    
    supervisorctl stop main
    supervisorctl stop nginx
    mv -f /etc/nginx/certs/my.ava.do.crt.temp /etc/nginx/certs/my.ava.do.crt
    mv -f /etc/nginx/certs/my.ava.do.key.temp /etc/nginx/certs/my.ava.do.key
    supervisorctl start nginx
    supervisorctl start main
    # 5 days
    sleep 432000
done
