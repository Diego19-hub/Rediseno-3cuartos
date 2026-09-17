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

## Contenido de demostración y edición

El plugin añade cajas editoriales nativas para servicios, casos de éxito, testimonios e integrantes; los medios se administran con la imagen destacada nativa. La página **Ajustes → 3cuartos** contiene la configuración global pública. Todas las cajas usan nonce, permisos nativos y sanitización del modelo.

Después de activar el plugin, carga o actualiza el contenido demostrativo local con:

```bash
docker compose run --rm wpcli 3cuartos seed-demo --allow-root
```

El comando no borra contenido y es idempotente por slug. Crea tres servicios, un caso destacado, tres testimonios, un integrante, tres recursos, capacidades y configuración global; todo el contenido generado se identifica como provisional. El servicio `wpcli` no publica puertos y se usa solo bajo demanda.

Para backup: `docker compose exec -T mariadb mariadb-dump -u wordpress -p wordpress > backup.sql` y `docker compose cp wordpress:/var/www/html/wp-content ./wp-content-backup`. Para restaurar, importar el SQL con `mariadb` dentro del contenedor y copiar el contenido de vuelta con `docker compose cp`. La futura migración al VPS trasladará base de datos, `wp-content`, plugin y variables, sustituyendo URLs locales sin alterar componentes Next.js.
