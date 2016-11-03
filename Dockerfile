FROM nginx

COPY nginx.conf /etc/nginx/nginx.conf

COPY ./app/static /www/static

EXPOSE 80

CMD ["nginx"]