FROM postgres:9.5

MAINTAINER Anthony Najjar Simon

ENV PGDATA /var/lib/postgresql/data/pgdata

COPY postgres.conf /configs/

VOLUME ["/var/log/postgresql", "/var/lib/postgresql/data/pgdata"]

CMD ["postgres", "-c", "config_file=/configs/postgres.conf"]