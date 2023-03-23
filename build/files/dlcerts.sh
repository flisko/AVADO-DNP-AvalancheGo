#!/bin/sh
while true; do
    mkdir -p /tmp
    date > /tmp/reload-certs.txt

    echo "Updating SSL certificates"

    md5sumbefore=$(md5sum "/etc/nginx/certs/my.ava.do.crt")
    curl "http://dappmanager.my.ava.do/my.ava.do.crt" --output /etc/nginx/certs/my.ava.do.crt --silent
    curl "http://dappmanager.my.ava.do/my.ava.do.key" --output /etc/nginx/certs/my.ava.do.key --silent
    md5sumafter=$(md5sum "/etc/nginx/certs/my.ava.do.crt")

    echo "Downloaded newest SSL certificates"

    if [ "$md5sumbefore" != "$md5sumafter" ]; then
        echo "Restarting processes after SSL update"        
        supervisorctl restart main
        supervisorctl restart nginx
    else
        echo "No SSL updates"        
    fi
    # Start main program if not running already.
    supervisorctl start main
    supervisorctl start nginx

    echo "SSL updater going to sleep for 24h"

    #sleep one day
    sleep 86400
done
