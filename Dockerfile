FROM nginx:alpine as client

EXPOSE 80

COPY entry.sh /entry.sh
ENTRYPOINT ["/entry.sh"]

COPY nginx/default.conf /etc/nginx/conf.d/

COPY app /app

