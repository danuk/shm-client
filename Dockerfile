FROM nginx:stable-alpine AS client

EXPOSE 80

COPY entry.sh /entry.sh
ENTRYPOINT ["/entry.sh"]

COPY nginx/default.conf /etc/nginx/conf.d/

COPY app /app

