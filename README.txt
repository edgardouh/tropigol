TROPIGOL — Tienda web (Paso 1: página pública)
================================================

CÓMO VERLA
----------
Descomprime esta carpeta y abre "index.html" con doble clic (Chrome, Edge, etc.).
Todo funciona en local: fuente, íconos, carrito y filtros. No necesitas servidor.

ESTRUCTURA
----------
index.html            La página (estructura + sprite de íconos).
css/styles.css        Todos los estilos y colores.
js/app.js             Catálogo de prueba, filtros y carrito → WhatsApp.
assets/
  fonts/              Tu fuente Victory Striker Sans (formato web .woff2).
  img/hero.jpg        Foto de fondo del hero (REEMPLÁZALA por la tuya).
  img/separador.png   Borde rasgado bajo el hero.
  patches/            Tus parches (Player, Fan, Retro, -20%).
  icons/              Todos tus SVG originales, ordenados.

CAMBIAR LA FOTO DEL HERO
------------------------
1) Guarda tu foto como  assets/img/hero.jpg  (reemplaza la que está), o
2) En css/styles.css busca  --hero-img  y cambia la ruta por la de tu foto.

CAMBIAR EL NÚMERO DE WHATSAPP
-----------------------------
En js/app.js, primera línea:  const WA_NUMBER = "573045567994";

DATOS DE PRUEBA
---------------
Los 14 productos y las fotos de producto son de ejemplo. En el paso 2 los
reemplazamos por productos reales desde el panel de administración (Supabase).

NOTA SOBRE LA FUENTE
--------------------
La versión Demo de Victory Striker Sans no trae tildes ni ñ, por eso los
títulos van sin tilde (estilo deportivo). Los textos normales (Poppins) sí
llevan tildes con normalidad.
