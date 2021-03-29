#!/bin/sh

sed -i "s|http://shm.local|$SHM_URL|" /etc/nginx/conf.d/default.conf

nginx -g "daemon off;"

