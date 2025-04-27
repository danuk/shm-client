FROM nginx:stable-alpine AS client

EXPOSE 80

COPY entry.sh /entry.sh
ENTRYPOINT ["/entry.sh"]
HEALTHCHECK --interval=10s --timeout=5s --retries=3 CMD curl -f 127.0.0.1/shm/healthcheck.cgi || exit 1

COPY nginx/default.conf /etc/nginx/conf.d/

COPY app /app

