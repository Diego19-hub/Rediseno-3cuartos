# WordPress headless local

Next.js permanece en `http://localhost:3000`; WordPress local estará en `http://localhost:8080`. MariaDB no publica puerto al host y solo se comunica por la red interna `wordpress_internal`.

```bash
cp .env.wordpress.example .env.wordpress
# Sustituir los secretos locales en .env.wordpress
docker compose up -d
docker compose logs -f wordpress mariadb
docker compose stop
```

No usar `docker compose down -v`. Accede a `http://localhost:8080/wp-admin`, completa la instalación inicial y activa **3cuartos Content Model**. Comprueba `http://localhost:8080/wp-json` y, tras activar el plugin, `http://localhost:8080/wp-json/3cuartos/v1/settings`.

Para backup: `docker compose exec -T mariadb mariadb-dump -u wordpress -p wordpress > backup.sql` y `docker compose cp wordpress:/var/www/html/wp-content ./wp-content-backup`. Para restaurar, importar el SQL con `mariadb` dentro del contenedor y copiar el contenido de vuelta con `docker compose cp`. La futura migración al VPS trasladará base de datos, `wp-content`, plugin y variables, sustituyendo URLs locales sin alterar componentes Next.js.
