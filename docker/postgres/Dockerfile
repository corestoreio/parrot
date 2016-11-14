FROM postgres:9.4

MAINTAINER Anthony Najjar Simon

ENV PGDATA /var/lib/postgresql/data/pgdata

COPY postgres.conf /configs/

CMD ["postgres", "-c", "config_file=/configs/postgres.conf"]