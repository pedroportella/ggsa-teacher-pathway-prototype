# backend/Dockerfile
FROM wordpress:6.8-php8.3-apache

COPY wp-content/plugins/ggsa-teacher-pathway /usr/src/wordpress/wp-content/plugins/ggsa-teacher-pathway
COPY wp-content/plugins/ggsa-teacher-pathway /usr/src/ggsa-plugins/ggsa-teacher-pathway
COPY docker-entrypoint-ggsa.sh /usr/local/bin/docker-entrypoint-ggsa.sh

RUN chmod +x /usr/local/bin/docker-entrypoint-ggsa.sh \
  && chown -R www-data:www-data \
    /usr/src/wordpress/wp-content/plugins/ggsa-teacher-pathway \
    /usr/src/ggsa-plugins/ggsa-teacher-pathway

ENTRYPOINT ["docker-entrypoint-ggsa.sh"]
CMD ["apache2-foreground"]
