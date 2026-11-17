# ZENVO — sitio web (versión nueva, 16/11/2026)

Catálogo con consulta por WhatsApp. HTML, CSS y JavaScript común: no hay que instalar nada.
El sitio viejo quedó guardado en `_anterior/` (no se publica).

## Verlo en la Mac
1. Abrí la Terminal en esta carpeta.
2. Corré: `python3 -m http.server 8123`
3. Abrí http://localhost:8123

## De dónde salen los equipos
- El sitio lee **una planilla** con una fila por equipo. La copia local es `data/catalogo.csv`
  (la misma está en `herramientas/planilla-web.csv` para importar a Google Sheets).
- Para que se actualice solo: subí esa planilla a Google Sheets, usá **Archivo → Compartir →
  Publicar en la web → CSV**, y pegá el enlace en `assets/js/config.js`, en `planilla: ""`.
- Si la planilla falla, el sitio sigue andando con la copia local.

### Columnas
`id` · `nombre` · `detalle` · `categoria` · `estado` (disponible, pedido, vendido, oculto) ·
`unidades` (0 = pasa a "Entregado") · `precio` (vacío = "Consultá disponibilidad") ·
`precio_antes` (solo con rebaja real) · `condicion` · `etiqueta` · `descripcion` ·
`datos` (Clave: valor; Clave: valor) · `incluye` (separado por ;) · `nota` ·
`fotos` (opcional: enlaces) · `credito_fotos` · `orden`

## Fotos
Copiá las fotos a `assets/img/productos/<id>/` y corré `python3 herramientas/fotos.py`.
Las achica, les saca los datos ocultos y actualiza `data/fotos.json`.

`fotos.py` también saca el color de cada equipo de su primera foto: el sitio lo usa
de fondo en su ficha (por eso cada equipo se ve sobre su propio color).

## Estados de los equipos
La columna `condicion` de la planilla decide el estado que se muestra. El sitio reconoce
cuatro: **Nuevo** (sellado), **Caja abierta** (o "open box"), **Excelente** y **Muy bueno**.
Escribilos así, por ejemplo `Seminuevo · Excelente` o `Nuevo · Caja abierta`, y la ficha
enlaza sola a la explicación de `estados.html`.

## Revisar que nada se pise
Con el sitio levantado, abrí http://localhost:8123/herramientas/auditoria.html.
Recorre todas las páginas en 6 anchos de pantalla y avisa si algún texto se encima
o si algo se sale de la pantalla. Tiene que terminar en "TOTAL DE PROBLEMAS: 0".

## WhatsApp
En `assets/js/config.js`. Si cargás `whatsappNumero` (5959XXXXXXXX), el mensaje llega
ya escrito con el equipo. Sin número, el sitio copia el mensaje para pegarlo en el chat.

## Pendiente
- Pegar el enlace de la planilla de Google.
- Subir a GitHub Pages y completar `sitemap.xml` y `robots.txt` con la dirección final.
- Rehacer la imagen para compartir (`assets/img/og/zenvo-og.jpg`) con la tipografía nueva.
