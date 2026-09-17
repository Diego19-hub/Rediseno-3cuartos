# Formulario de contacto

El navegador envía el formulario a `POST /api/contact` de Next.js. El Route Handler valida y reenvía server-to-server a `POST /wp-json/3cuartos/v1/contact` usando Application Passwords; las credenciales nunca se incluyen en el bundle ni en respuestas.

## Configuración local

En `.env.local` (archivo ignorado por Git) define:

~~~dotenv
WORDPRESS_URL=http://localhost:8080
WORDPRESS_REST_URL=http://localhost:8080/wp-json
WP_CONTACT_USERNAME=
WP_CONTACT_APP_PASSWORD=
~~~

En WordPress crea un usuario de integración con rol **Editor** (mínimo recomendado para `edit_others_posts`). En `Usuarios → Perfil` genera una Application Password con el nombre `next-contact-local` y copia el valor directamente en `.env.local`; no lo envíes por chat ni lo confirmes en repositorio. Reinicia Next.js con `npm run dev`.

Las solicitudes aparecen en `wp-admin → Solicitudes de contacto`. El identificador técnico final del CPT es `3c_contact_request` (máximo de 20 caracteres requerido por WordPress). El endpoint no tiene GET público, el CPT no se expone en REST y solo almacena los campos permitidos con estado inicial `new`.

## Producción pendiente

Antes de publicar deben definirse rate limiting en el proxy/VPS, CAPTCHA solo si el spam lo requiere, notificaciones, política de retención/eliminación y HTTPS obligatorio. No se envían correos ni se conectan servicios externos en local.
