#!/bin/sh

[ -z "$SHM_URL" ] || sed -i "s|http://shm.local|$SHM_URL|" /etc/nginx/conf.d/default.conf
[ -z "$SHM_HOST" ] || sed -i "s|http://shm.local|$SHM_HOST|" /etc/nginx/conf.d/default.conf

if [ ! -z "$SHM_BASE_PATH" ] && [ "$SHM_BASE_PATH" != "/" ]; then
    sed -i "s|location / {|location $SHM_BASE_PATH {|" /etc/nginx/conf.d/default.conf
    sed -i "s|#proxy_cookie_path;|proxy_cookie_path / $SHM_BASE_PATH;|" /etc/nginx/conf.d/default.conf
    sed -i "s|location /shm {|location $SHM_BASE_PATH/shm/ {|" /etc/nginx/conf.d/default.conf
fi

nginx -g "daemon off;"
