#!/usr/bin/env python3
"""
ZENVO · Preparar fotos para la web
==================================

Qué hace:
  1. Recorre assets/img/productos/<id-del-equipo>/
  2. Toda foto que NO se llame 01.jpg, 02.jpg, ... la convierte:
     la endereza, le saca los datos ocultos (ubicación, celular),
     la achica a un tamaño cómodo para la web y la renombra con
     el número que sigue. Borra el original de esa carpeta.
  3. Escribe data/fotos.json, que es la lista que lee el sitio.

Cómo usarlo (desde la carpeta Web ZENVO):
    python3 herramientas/fotos.py

Para agregar fotos a un equipo: copiá las fotos (como salgan del
celular) a assets/img/productos/<id>/ y corré este archivo.
El <id> es el mismo que está en la columna "id" de la planilla.
El orden final es el alfabético de los nombres originales.
"""
import colorsys
import json
import os
import re
import subprocess
import sys
import tempfile

try:
    from PIL import Image, ImageOps
except ImportError:
    sys.exit("Falta Pillow. Instalalo con:  python3 -m pip install --user Pillow")

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PRODUCTOS = os.path.join(RAIZ, "assets", "img", "productos")
MANIFIESTO = os.path.join(RAIZ, "data", "fotos.json")

GRANDE = 1600   # lado más largo de la foto grande
MEDIANA = 800   # lado más largo de la foto para las grillas
LISTA = re.compile(r"^(\d\d)\.jpg$")
LISTA_M = re.compile(r"^(\d\d)-m\.jpg$")
FORMATOS = (".jpg", ".jpeg", ".png", ".webp", ".heic", ".heif", ".avif", ".tif", ".tiff")


def abrir(ruta):
    """Abre una imagen. Si es HEIC (foto de iPhone), la pasa por sips, que viene con la Mac."""
    ext = os.path.splitext(ruta)[1].lower()
    if ext in (".heic", ".heif"):
        tmp = tempfile.NamedTemporaryFile(suffix=".jpg", delete=False).name
        subprocess.run(["sips", "-s", "format", "jpeg", ruta, "--out", tmp],
                       check=True, capture_output=True)
        im = Image.open(tmp)
        im.load()
        os.unlink(tmp)
        return im
    return Image.open(ruta)


def guardar(im, ruta, lado, calidad):
    copia = im.copy()
    copia.thumbnail((lado, lado), Image.LANCZOS)
    copia.save(ruta, "JPEG", quality=calidad, optimize=True, progressive=True)
    return copia.size


def fondo_blanco(im):
    """True si las cuatro esquinas son casi blancas (foto de estudio sobre fondo blanco)."""
    rgb = im.convert("RGB")
    w, h = rgb.size
    puntos = [(3, 3), (w - 4, 3), (3, h - 4), (w - 4, h - 4)]
    return all(min(rgb.getpixel(p)) >= 244 for p in puntos)


def recortar_blanco(im, margen=0.06):
    """En fotos de estudio, saca el blanco que sobra para que el equipo se vea del mismo tamaño en todas."""
    from PIL import ImageChops
    rgb = im.convert("RGB")
    caja = ImageChops.difference(rgb, Image.new("RGB", rgb.size, (255, 255, 255))).convert("L").point(lambda v: 255 if v > 14 else 0).getbbox()
    if not caja:
        return im
    x0, y0, x1, y1 = caja
    m = int(max(x1 - x0, y1 - y0) * margen)
    w, h = rgb.size
    caja = (max(0, x0 - m), max(0, y0 - m), min(w, x1 + m), min(h, y1 + m))
    if (caja[2] - caja[0]) * (caja[3] - caja[1]) > 0.9 * w * h:
        return im     # ya está justo
    return rgb.crop(caja)


def _hex(h, l, s):
    r, g, b = colorsys.hls_to_rgb(h, l, s)
    return "#%02X%02X%02X" % (round(r * 255), round(g * 255), round(b * 255))


def color_del_equipo(im):
    """El color sale del equipo: mira el centro de la foto (donde está el equipo) y arma
    dos tonos para el sitio: 'campo' (fondo claro) y 'tinta' (el mismo color, oscuro)."""
    chico = im.convert("RGB").resize((60, 60))
    px = [chico.getpixel((x, y)) for y in range(17, 43) for x in range(17, 43)]
    px = [c for c in px if min(c) < 236] or px          # sin el blanco de estudio
    r, g, b = [sorted(canal)[len(canal) // 2] for canal in zip(*px)]
    h, l, s = colorsys.rgb_to_hls(r / 255, g / 255, b / 255)
    if s < 0.09:                                         # neutros: nunca gris, van a la paleta
        h, s = (0.47, 0.13) if l < 0.55 else (0.115, 0.20)
    s = max(0.13, min(s, 0.36))
    return _hex(h, 0.865, s * 0.95), _hex(h, 0.19, min(0.42, s * 1.25))


def procesar_carpeta(carpeta):
    nombres = sorted(n for n in os.listdir(carpeta) if not n.startswith("."))
    hechas = sorted(n for n in nombres if LISTA.match(n))
    nuevas = [n for n in nombres
              if not LISTA.match(n) and not LISTA_M.match(n)
              and n.lower().endswith(FORMATOS)]
    siguiente = (int(LISTA.match(hechas[-1]).group(1)) + 1) if hechas else 1

    for nombre in nuevas:
        origen = os.path.join(carpeta, nombre)
        try:
            im = ImageOps.exif_transpose(abrir(origen))
            if im.mode in ("RGBA", "LA", "P"):
                fondo = Image.new("RGB", im.size, (243, 240, 232))  # marfil
                im = im.convert("RGBA")
                fondo.paste(im, mask=im.split()[-1])
                im = fondo
            else:
                im = im.convert("RGB")
        except Exception as e:  # una foto rota no frena al resto
            print(f"   ⚠️  No pude leer {nombre}: {e}")
            continue
        if fondo_blanco(im):
            im = recortar_blanco(im)
        base = f"{siguiente:02d}"
        guardar(im, os.path.join(carpeta, base + ".jpg"), GRANDE, 84)
        guardar(im, os.path.join(carpeta, base + "-m.jpg"), MEDIANA, 80)
        os.remove(origen)
        print(f"   {nombre}  →  {base}.jpg")
        siguiente += 1

    fotos = []
    for n in sorted(os.listdir(carpeta)):
        if not LISTA.match(n):
            continue
        ruta = os.path.join(carpeta, n)
        mediana = os.path.join(carpeta, n[:2] + "-m.jpg")
        with Image.open(ruta) as im:
            if not os.path.exists(mediana):
                guardar(im.convert("RGB"), mediana, MEDIANA, 80)
            dato = {"f": n, "w": im.width, "h": im.height}
            if fondo_blanco(im):
                dato["blanco"] = 1   # foto de estudio: el sitio la funde con el fondo
            dato["campo"], dato["tinta"] = color_del_equipo(im)
            fotos.append(dato)
    return fotos


def main():
    if not os.path.isdir(PRODUCTOS):
        sys.exit("No encuentro assets/img/productos/")
    manifiesto = {}
    for ident in sorted(os.listdir(PRODUCTOS)):
        carpeta = os.path.join(PRODUCTOS, ident)
        if not os.path.isdir(carpeta) or ident.startswith((".", "_")):
            continue
        print(f"· {ident}")
        fotos = procesar_carpeta(carpeta)
        if fotos:
            manifiesto[ident] = fotos
    os.makedirs(os.path.dirname(MANIFIESTO), exist_ok=True)
    with open(MANIFIESTO, "w", encoding="utf-8") as f:
        json.dump(manifiesto, f, ensure_ascii=False, indent=1)
    total = sum(len(v) for v in manifiesto.values())
    print(f"\nListo: {total} fotos de {len(manifiesto)} equipos. Lista guardada en data/fotos.json")


if __name__ == "__main__":
    main()
