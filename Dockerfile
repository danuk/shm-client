FROM nginx:stable-alpine AS client

EXPOSE 80

COPY entry.sh /entry.sh
ENTRYPOINT ["/entry.sh"]
HEALTHCHECK --interval=5s --timeout=5s --retries=3 CMD curl -f 127.0.0.1/shm/v1/test || exit 1

COPY nginx/default.conf /etc/nginx/conf.d/

COPY app /app

