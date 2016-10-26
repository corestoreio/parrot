FROM nginx

COPY nginx.conf /etc/nginx/nginx.conf

COPY ./static /data/www/static

EXPOSE 80

CMD ["nginx"]