/* =========================================================
   ZENVO — lógica del sitio
   Sin dependencias. El catálogo se lee de la planilla de Google
   (assets/js/config.js) y, si no está o falla, de data/catalogo.csv.
   Índice: 1 Ayudas · 2 Íconos · 3 WhatsApp · 4 Catálogo (datos)
   5 Piezas (cada equipo sobre su color) · 6 Marco del sitio
   7 Movimiento y revisión · 8 Inicio (portada, mosaico)
   9 Catálogo · 10 Producto · 11 A pedido · 12 Arranque
   ========================================================= */
(function () {
  "use strict";

  var C = window.ZENVO_CONFIG || {};
  var d = document;
  var raiz = d.documentElement;
  var PAGINA = d.body.getAttribute("data-pagina") || "";
  var QUIETO = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- 1. Ayudas ---------- */
  function $(s, r) { return (r || d).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || d).querySelectorAll(s)); }
  function esc(t) {
    return String(t == null ? "" : t).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function plano(t) { return String(t || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").trim(); }
  function slug(t) { return plano(t).replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, ""); }
  function gs(n) { return "Gs. " + String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, "."); }
  function numero(t) {
    var s = String(t == null ? "" : t).trim().replace(/[.,]\d{1,2}$/, "");
    s = s.replace(/[^\d]/g, "");
    return s ? parseInt(s, 10) : 0;
  }
  function parametro(k) { return new URLSearchParams(location.search).get(k) || ""; }

  /* ---------- 2. Íconos y marca ---------- */
  var ICONO = {
    wa: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>',
    flecha: '<svg class="flecha" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3" aria-hidden="true"><path d="M1 8h13M9 3l5 5-5 5"/></svg>',
    lupa: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3" aria-hidden="true"><circle cx="7" cy="7" r="5"/><path d="M11 11l4 4"/></svg>',
    mono: '<svg class="mono" viewBox="0 0 200 200" fill="currentColor" aria-hidden="true"><path d="M5.07 44H150L0 156v44h136l58.93-44H50L200 44V0H64L5.07 44Z"/></svg>',
    palabra: '<svg class="palabra" viewBox="62 56 598 128" fill="currentColor" role="img" aria-label="ZENVO"><path transform="translate(60,180) scale(.1749,-.1749)" d="M28 0V64L384 564H53V686H609V622L253 123H617V0Z"/><path transform="translate(169.33,180) scale(.1749,-.1749)" d="M76 0V686H624V564H226V411H578V290H226V123H630V0Z"/><path transform="translate(283.91,180) scale(.1749,-.1749)" d="M76 0V686H213L489 316Q498 305 512 284.500Q526 264 532 253H537Q537 270 537 286Q537 302 537 316V686H678V0H541L259 379Q249 393 238 410Q227 427 222 436H217Q217 421 217 406.500Q217 392 217 379V0Z"/><path transform="translate(410.9,180) scale(.1749,-.1749)" d="M260 0 12 686H173L321 248Q327 231 335 206Q343 181 348 164H354Q359 179 366.500 203.500Q374 228 380 247L528 686H683L434 0Z"/><path transform="translate(527.41,180) scale(.1749,-.1749)" d="M396 -12Q232 -12 138.500 75.500Q45 163 45 343Q45 523 138.500 610.500Q232 698 396 698Q561 698 654.500 610.500Q748 523 748 343Q748 163 654.500 75.500Q561 -12 396 -12ZM396 110Q493 110 544 166Q595 222 595 327V358Q595 464 544 520Q493 576 396 576Q300 576 249.500 520Q199 464 199 358V327Q199 222 249.500 166Q300 110 396 110Z"/></svg>'
  };

  /* ---------- 3. WhatsApp ---------- */
  var WA_BASE = C.whatsappEnlace || "https://wa.me/message/NHKRSJO43PKEA1";
  var WA_NUM = String(C.whatsappNumero || "").replace(/\D/g, "");
  var SALUDO = "Hola ZENVO, vengo de la web y quiero hacer una consulta.";

  function waUrl(msj) {
    if (WA_NUM) return "https://wa.me/" + WA_NUM + "?text=" + encodeURIComponent(msj || SALUDO);
    return WA_BASE;
  }
  function conectarWA(r) {
    $$("[data-wa]", r).forEach(function (a) {
      a.href = waUrl(a.getAttribute("data-wa"));
      a.target = "_blank";
      a.rel = "noopener";
    });
  }
  var avisoT;
  function avisar(texto) {
    var a = $(".aviso-copia");
    if (!a) { a = d.createElement("div"); a.className = "aviso-copia"; a.setAttribute("role", "status"); d.body.appendChild(a); }
    a.textContent = texto;
    a.classList.add("is-visible");
    clearTimeout(avisoT);
    avisoT = setTimeout(function () { a.classList.remove("is-visible"); }, 4200);
  }
  /* Sin número cargado, el enlace corto no puede llevar el texto: se copia para pegarlo en el chat. */
  d.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest("[data-wa]");
    if (!a || WA_NUM) return;
    var msj = a.getAttribute("data-wa");
    if (!msj || !navigator.clipboard) return;
    navigator.clipboard.writeText(msj).then(function () {
      avisar("Copiamos tu consulta: pegala en el chat de WhatsApp.");
    }).catch(function () {});
  });

  function mensaje(p) {
    var n = p.nombre + (p.detalle ? " (" + p.detalle + ")" : "");
    if (p.estado === "pedido") return "Hola ZENVO, quiero pedir el " + n + " que vi en la web. ¿Me pasan precio final y plazo?";
    if (p.estado === "vendido") return "Hola ZENVO, vi en la web el " + n + " que ya entregaron. ¿Pueden conseguir uno igual?";
    return "Hola ZENVO, me interesa el " + n + " que vi en la web. ¿Sigue disponible?";
  }

  /* ---------- 4. Catálogo: datos ---------- */
  var CATEGORIAS = {
    celulares: "Celulares", tablets: "Tablets", computadoras: "Computadoras",
    wearables: "Relojes y pulseras", accesorios: "Accesorios", otros: "Otros"
  };
  var ESTADOS = { disponible: "Disponible hoy", pedido: "A pedido", vendido: "Entregado" };
  var ALIAS = {
    producto: "nombre", equipo: "nombre", variante: "detalle", tipo: "categoria", stock: "unidades",
    disp: "unidades", cantidad: "unidades", precio_oferta: "precio", precio_anterior: "precio_antes",
    antes: "precio_antes", foto: "fotos", credito: "credito_fotos", aviso: "nota", estado_del_equipo: "condicion"
  };

  function leerCSV(texto) {
    texto = String(texto || "").replace(/^﻿/, "");
    var primera = texto.split(/\r?\n/, 1)[0] || "";
    var sep = (primera.split(";").length > primera.split(",").length) ? ";" : ",";
    var filas = [], fila = [], celda = "", comillas = false, i, c;
    for (i = 0; i < texto.length; i++) {
      c = texto[i];
      if (comillas) {
        if (c === '"') { if (texto[i + 1] === '"') { celda += '"'; i++; } else comillas = false; }
        else celda += c;
      } else if (c === '"') comillas = true;
      else if (c === sep) { fila.push(celda); celda = ""; }
      else if (c === "\n") { fila.push(celda); filas.push(fila); fila = []; celda = ""; }
      else if (c !== "\r") celda += c;
    }
    if (celda !== "" || fila.length) { fila.push(celda); filas.push(fila); }
    return filas;
  }

  function categoriaDe(t) {
    t = plano(t);
    if (!t) return "otros";
    if (/cel|telef|phone|movil/.test(t)) return "celulares";
    if (/tab|ipad/.test(t)) return "tablets";
    if (/comp|note|laptop|mac|pc/.test(t)) return "computadoras";
    if (/wear|reloj|puls|watch|band/.test(t)) return "wearables";
    if (/acces/.test(t)) return "accesorios";
    return "otros";
  }
  function estadoDe(t, unidades) {
    t = plano(t);
    if (/ocult|borrador|pausa|no publicar|^no$/.test(t)) return "oculto";
    if (/pedido|encargo|import/.test(t)) return "pedido";
    if (/vend|entreg|agot/.test(t)) return "vendido";
    if (unidades === 0) return "vendido";
    return "disponible";
  }
  function lista(t) {
    return String(t || "").split(/[;\n|]+/).map(function (x) { return x.trim(); }).filter(Boolean);
  }
  function fotoRemota(u) {
    var m = u.match(/drive\.google\.com\/file\/d\/([^/?#]+)/) || u.match(/drive\.google\.com\/.*[?&]id=([^&#]+)/);
    return m ? "https://lh3.googleusercontent.com/d/" + m[1] + "=w1600" : u;
  }

  function armarCatalogo(texto, fotos) {
    var filas = leerCSV(texto), cab = -1, cols = [], out = [], vistos = {};
    for (var i = 0; i < Math.min(filas.length, 15); i++) {
      var n = filas[i].map(function (x) { var k = plano(x).replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, ""); return ALIAS[k] || k; });
      if (n.indexOf("id") > -1 && n.indexOf("nombre") > -1) { cab = i; cols = n; break; }
    }
    if (cab < 0) return [];
    filas.slice(cab + 1).forEach(function (f, pos) {
      var o = {};
      cols.forEach(function (k, j) { if (k) o[k] = (f[j] || "").trim(); });
      if (!o.nombre) return;
      var id = slug(o.id || o.nombre);
      if (!id || vistos[id]) return;
      var uni = (o.unidades === "" || o.unidades == null) ? null : numero(o.unidades);
      var estado = estadoDe(o.estado, uni);
      if (estado === "oculto") return;
      vistos[id] = 1;
      var p = {
        id: id, nombre: o.nombre, detalle: o.detalle || "", categoria: categoriaDe(o.categoria),
        estado: estado, unidades: uni,
        precio: estado === "vendido" ? 0 : numero(o.precio),
        precioAntes: estado === "vendido" ? 0 : numero(o.precio_antes),
        condicion: o.condicion || "", etiqueta: o.etiqueta || "", descripcion: o.descripcion || "",
        datos: lista(o.datos).map(function (x) { var k = x.indexOf(":"); return k > 0 ? [x.slice(0, k).trim(), x.slice(k + 1).trim()] : ["", x]; }),
        incluye: lista(o.incluye), nota: o.nota || "", credito: o.credito_fotos || "",
        orden: o.orden === "" || o.orden == null ? 1000 + pos : numero(o.orden), fotos: []
      };
      if (p.precioAntes <= p.precio) p.precioAntes = 0;
      var propias = String(o.fotos || "").split(/[\n;|]+|,\s*|\s+(?=https?:)/).map(function (x) { return x.trim(); }).filter(Boolean);
      if (propias.length) {
        p.fotos = propias.map(function (u) {
          var url = /^https?:/i.test(u) ? fotoRemota(u) : "assets/img/productos/" + id + "/" + u;
          return { g: url, m: url };
        });
      } else if (fotos && fotos[id]) {
        p.fotos = fotos[id].map(function (x) {
          var base = "assets/img/productos/" + id + "/";
          return { g: base + x.f, m: base + x.f.replace(/\.jpg$/, "-m.jpg"), w: x.w, h: x.h, blanco: !!x.blanco, campo: x.campo, tinta: x.tinta };
        });
      }
      out.push(p);
    });
    var peso = { disponible: 0, pedido: 1, vendido: 2 };
    out.sort(function (a, b) { return (peso[a.estado] - peso[b.estado]) || (a.orden - b.orden); });
    return out;
  }

  function urlPlanilla(u) {
    u = String(u || "").trim();
    if (!u) return "";
    if (/output=csv|out:csv|format=csv/.test(u)) return u;
    if (/\/spreadsheets\/d\/e\//.test(u)) return u.replace(/\/pubhtml.*$/, "/pub?output=csv");
    var m = u.match(/\/spreadsheets\/d\/([\w-]+)/);
    if (!m) return u;
    var g = u.match(/[#?&]gid=(\d+)/);
    return "https://docs.google.com/spreadsheets/d/" + m[1] + "/gviz/tq?tqx=out:csv&gid=" + (g ? g[1] : "0");
  }
  function traer(url, ms, modo) {
    var ctl = window.AbortController ? new AbortController() : null;
    var t = setTimeout(function () { if (ctl) ctl.abort(); }, ms);
    return fetch(url, { cache: modo || "no-cache", signal: ctl ? ctl.signal : undefined }).then(function (r) {
      clearTimeout(t);
      if (!r.ok) throw new Error("HTTP " + r.status);
      return r.text();
    });
  }

  var CLAVE = "zenvo:planilla";
  var oyentes = [], actual = null;
  var Catalogo = {
    fuente: "",
    listo: function (fn) { oyentes.push(fn); if (actual) fn(actual); },
    buscar: function (id) { return (actual || []).filter(function (p) { return p.id === id; })[0]; }
  };
  function publicar(listaNueva, fuente) {
    actual = listaNueva;
    Catalogo.fuente = fuente;
    raiz.setAttribute("data-catalogo", fuente);
    oyentes.forEach(function (fn) { try { fn(actual); } catch (e) { if (window.console) console.error(e); } });
  }
  function iniciarCatalogo() {
    var fotosP = traer("data/fotos.json", 8000).then(JSON.parse).catch(function () { return {}; });
    var localP = traer("data/catalogo.csv", 8000);
    var url = urlPlanilla(C.planilla);

    function conLocal(fotos) {
      return localP.then(function (t) { publicar(armarCatalogo(t, fotos), "copia local"); })
        .catch(function () { publicar([], "sin datos"); });
    }
    fotosP.then(function (fotos) {
      if (!url) return conLocal(fotos);
      var guardado = null, pintado = "";
      try { guardado = JSON.parse(localStorage.getItem(CLAVE) || "null"); } catch (e) {}
      if (guardado && guardado.url === url && guardado.txt) {
        var previa = armarCatalogo(guardado.txt, fotos);
        if (previa.length) { pintado = guardado.txt; publicar(previa, "planilla"); }
      }
      traer(url, 9000, "no-store").then(function (t) {
        var nueva = armarCatalogo(t, fotos);
        if (!nueva.length) throw new Error("La planilla no tiene las columnas id y nombre");
        try { localStorage.setItem(CLAVE, JSON.stringify({ url: url, txt: t })); } catch (e) {}
        if (t !== pintado) publicar(nueva, "planilla");
      }).catch(function (err) {
        if (window.console) console.warn("ZENVO: no se pudo leer la planilla, se usa la copia.", err);
        if (!pintado) conLocal(fotos);
      });
    });
  }

  /* ---------- 5. Piezas ---------- */
  var AREAS = ["Identificación", "Pantalla", "Batería", "Cámaras", "Conectividad", "Estado físico"];
  /* Los cuatro estados, del más nuevo al de mejor precio. El id es el ancla en estados.html. */
  var NIVELES = [["nuevo", "Nuevo"], ["caja-abierta", "Caja abierta"], ["excelente", "Excelente"], ["muy-bueno", "Muy bueno"]];
  function nivelDe(cond) {
    var c = plano(cond);
    if (!c) return -1;
    if (/caja abierta|open ?box/.test(c)) return 1;
    if (/excelente/.test(c)) return 2;
    if (/muy bueno|bueno/.test(c)) return 3;
    if (/sellad|nuev/.test(c)) return 0;
    return -1;
  }
  function dos(n) { return (n < 10 ? "0" : "") + n; }
  function estilo(p, extra) {
    var f = p.fotos[0], s = (f && f.campo ? "--campo:" + f.campo + ";--tinta:" + f.tinta + ";" : "") + (extra || "");
    return s ? ' style="' + s + '"' : "";
  }
  function precioPieza(p) {
    if (p.estado === "vendido") return "";
    if (p.precio > 0) {
      return '<p class="pieza__precio"><small>Desde</small> ' + gs(p.precio) + (p.precioAntes ? ' <s>' + gs(p.precioAntes) + '</s>' : '') + '</p>';
    }
    return '<p class="pieza__consulta">' + (p.estado === "pedido" ? "Consultá precio y plazo" : "Consultá disponibilidad") + ICONO.flecha + '</p>';
  }
  function fotoPieza(p) {
    var f = p.fotos[0];
    if (!f) return '<div class="pieza__foto"><div class="pieza__sinfoto">' + ICONO.mono + '<span>Fotos por WhatsApp</span></div></div>';
    return '<div class="pieza__foto' + (f.blanco ? " is-blanco" : "") + '"><img src="' + esc(f.m) + '" alt="' +
      esc(p.nombre + (p.detalle ? " " + p.detalle : "")) + '" loading="lazy" decoding="async"></div>';
  }
  /* opciones: n (número de ficha), col (columnas en el mosaico), ancha, par, baja */
  function pieza(p, o) {
    o = o || {};
    var clases = "pieza pieza--" + p.estado + (o.ancha ? " pieza--ancha" : "") + (o.par ? " pieza--par" : "") + (o.baja ? " pieza--baja" : "");
    var izq = p.etiqueta && p.estado !== "vendido" ? '<span class="pieza__etiqueta">' + esc(p.etiqueta) + '</span>'
      : '<span>' + (o.n ? "N.º " + dos(o.n) : "ZENVO") + '</span>';
    return '<a class="' + clases + '" href="producto.html?id=' + encodeURIComponent(p.id) + '" data-cursor="Ver" data-aparece' +
      estilo(p, o.col ? "--col:" + o.col + ";" : "") + '>' +
      '<div class="pieza__arriba">' + izq + '<span class="estado estado--' + p.estado + '"><span>' + ESTADOS[p.estado] + '</span></span></div>' +
      fotoPieza(p) +
      '<div class="pieza__pie"><h3 class="pieza__nombre">' + esc(p.nombre) + '</h3>' +
      (p.detalle ? '<p class="pieza__detalle">' + esc(p.detalle) + '</p>' : '') + precioPieza(p) +
      '<span class="enlace pieza__ver">Ver la ficha ' + ICONO.flecha + '</span></div>' +
      '<span class="pieza__scan" aria-hidden="true"></span></a>';
  }
  function piezaTexto(col) {
    return '<a class="pieza pieza--texto' + (col !== 4 ? " pieza--par" : "") + '" href="a-pedido.html" data-aparece style="--col:' + col + '">' +
      '<div class="pieza__arriba"><span>A pedido</span><span>' + esc(C.pedidoPlazo || "8 a 15 días") + '</span></div>' +
      '<h3>¿No está lo que buscás? <em>Lo traemos.</em></h3>' +
      '<span class="enlace">Cómo funciona un pedido ' + ICONO.flecha + '</span></a>';
  }
  function esqueletos(n) {
    var h = "";
    for (var i = 0; i < n; i++) h += '<div class="pieza esqueleto" aria-hidden="true"></div>';
    return h;
  }
  function vacio(titulo, texto, msj) {
    return '<div class="vacio"><h3 class="subtitulo">' + titulo + '</h3><p class="texto">' + texto + '</p>' +
      '<a class="btn" data-wa="' + esc(msj || SALUDO) + '" href="' + esc(WA_BASE) + '">' + ICONO.wa + 'Escribinos por WhatsApp</a></div>';
  }
  function sello(centro) {
    return '<svg class="sello" viewBox="0 0 120 120" aria-hidden="true"><defs><path id="sello-c" d="M60 60m-46 0a46 46 0 1 1 92 0a46 46 0 1 1-92 0"/></defs>' +
      '<circle cx="60" cy="60" r="57" fill="none" stroke="currentColor" stroke-width="1"/><circle cx="60" cy="60" r="33" fill="none" stroke="currentColor" stroke-width="1"/>' +
      '<g class="sello__giro"><text><textPath href="#sello-c">ZENVO · Revisado · 22 puntos · 45 días · </textPath></text></g>' +
      '<text class="centro" x="60" y="68" text-anchor="middle">' + centro + '</text></svg>';
  }

  /* Si una foto no carga (enlace roto en la planilla), se saca en vez de mostrar el ícono roto. */
  d.addEventListener("error", function (e) {
    var img = e.target;
    if (!img || img.tagName !== "IMG") return;
    var marco = img.closest(".pieza__foto, .escena__marco, .entregado__foto, .mini, .galeria__pista figure");
    if (!marco) return;
    if (marco.matches(".mini, .galeria__pista figure")) { marco.remove(); return; }
    img.remove();
    if (marco.classList.contains("pieza__foto")) {
      marco.innerHTML = '<div class="pieza__sinfoto">' + ICONO.mono + '<span>Fotos por WhatsApp</span></div>';
    }
  }, true);

  /* ---------- 6. Marco del sitio ---------- */
  var NAV = [
    ["catalogo.html", "Catálogo", "catalogo"],
    ["estados.html", "Estados", "estados"],
    ["a-pedido.html", "A pedido", "a-pedido"],
    ["como-comprar.html", "Cómo comprar", "como-comprar"],
    ["preguntas.html", "Preguntas", "preguntas"]
  ];
  function muelle(chico, grande, msj) {
    var m = $(".muelle");
    if (!m) return;
    m.innerHTML = '<p class="muelle__txt"><small>' + esc(chico) + '</small>' + esc(grande) + '</p>' +
      '<a class="btn" data-wa="' + esc(msj || "") + '" href="' + esc(WA_BASE) + '">' + ICONO.wa + 'Consultar</a>';
    conectarWA(m);
  }
  function marco() {
    var activa = PAGINA === "producto" ? "catalogo" : PAGINA;
    var enlaces = NAV.map(function (n) {
      return '<a href="' + n[0] + '"' + (n[2] === activa ? ' aria-current="page"' : '') + '>' + n[1] + '</a>';
    }).join("");
    var cab = d.createElement("header");
    cab.className = "cab";
    cab.innerHTML = '<div class="contenedor cab__fila">' +
      '<a class="cab__marca" href="index.html" aria-label="ZENVO, inicio">' + ICONO.mono + ICONO.palabra + '</a>' +
      '<nav class="cab__nav" aria-label="Principal">' + enlaces + '</nav>' +
      '<div class="cab__lado">' +
      '<a class="cab__wa" data-wa="" href="' + esc(WA_BASE) + '" aria-label="Escribinos por WhatsApp">' + ICONO.wa + '<span>Escribinos</span></a>' +
      '<button class="cab__menu" type="button" aria-label="Abrir el menú" aria-expanded="false" aria-controls="menu"><i></i></button>' +
      '</div></div>';
    d.body.insertBefore(cab, d.body.firstChild);

    var menu = d.createElement("div");
    menu.className = "menu"; menu.id = "menu";
    menu.setAttribute("role", "dialog"); menu.setAttribute("aria-modal", "true"); menu.setAttribute("aria-label", "Menú");
    menu.innerHTML = '<div class="menu__arriba">' + ICONO.palabra + '<button class="menu__cerrar" type="button">Cerrar</button></div>' +
      '<nav class="menu__nav" aria-label="Menú">' +
      [["index.html", "Inicio", "inicio"]].concat(NAV).map(function (n, i) {
        return '<a href="' + n[0] + '"><small>0' + (i + 1) + '</small><span>' + n[1] + '</span></a>';
      }).join("") + '</nav>' +
      '<div class="menu__pie"><a class="btn btn--claro" data-wa="" href="' + esc(WA_BASE) + '">' + ICONO.wa + 'Escribinos por WhatsApp</a>' +
      '<p>Ciudad del Este · Envíos a todo Paraguay</p></div>';
    d.body.appendChild(menu);

    var boton = $(".cab__menu", cab);
    function abrir(si) {
      menu.classList.toggle("is-abierto", si);
      boton.setAttribute("aria-expanded", si ? "true" : "false");
      d.body.style.overflow = si ? "hidden" : "";
      if (si) $(".menu__cerrar", menu).focus(); else boton.focus();
    }
    boton.addEventListener("click", function () { abrir(true); });
    $(".menu__cerrar", menu).addEventListener("click", function () { abrir(false); });
    d.addEventListener("keydown", function (e) { if (e.key === "Escape" && menu.classList.contains("is-abierto")) abrir(false); });

    var letra = 0;
    var pie = d.createElement("footer");
    pie.className = "pie oscuro";
    pie.innerHTML = '<div class="contenedor">' +
      '<div class="pie__grilla">' +
      '<div class="pie__marca"><p>Tecnología seminueva verificada. Elegimos equipo por equipo, te decimos lo que tiene cada unidad y respondemos por lo que vendemos.</p>' +
      '<span class="pie__hora" id="hora">Ciudad del Este</span></div>' +
      '<div><h2>Sitio</h2><ul>' + NAV.concat([["verificacion.html", "Cómo revisamos"]]).map(function (n) { return '<li><a href="' + n[0] + '">' + n[1] + '</a></li>'; }).join("") + '</ul></div>' +
      '<div><h2>Contacto</h2><ul>' +
      '<li><a data-wa="" href="' + esc(WA_BASE) + '">WhatsApp</a></li>' +
      (C.instagram ? '<li><a href="' + esc(C.instagram) + '" target="_blank" rel="noopener">Instagram ' + esc(C.instagramUsuario || "") + '</a></li>' : '') +
      '<li class="suave">Ciudad del Este, Paraguay</li></ul></div>' +
      '<div><h2>Cómo trabajamos</h2><ul>' +
      '<li class="suave">Nuevos, caja abierta y seminuevos</li><li class="suave">45 días de garantía</li>' +
      '<li class="suave">Entrega en la puerta</li><li class="suave">Envíos a todo el país</li>' +
      '<li class="suave">Efectivo o transferencia</li></ul></div>' +
      '</div>' +
      '<div class="pie__base"><span>© ' + new Date().getFullYear() + ' ZENVO · Tecnología elegida con criterio</span><a href="' + esc(waUrl(SALUDO)) + '" target="_blank" rel="noopener">WhatsApp 0984 404 412</a></div>' +
      /* la palabra gigante del pie: cada letra en su grupo, para que suban de a una */
      ICONO.palabra.replace('class="palabra"', 'class="pie__gigante" data-aparece-pie').replace('role="img" aria-label="ZENVO"', 'aria-hidden="true"')
        .replace(/<path /g, function () { return '<g style="--k:' + (letra++) + '"><path '; }).replace(/\/>/g, "/></g>") +
      '</div>';
    d.body.appendChild(pie);

    /* la hora de Ciudad del Este, en vivo */
    var hora = $("#hora");
    function reloj() {
      try {
        hora.textContent = "Ciudad del Este · " + new Intl.DateTimeFormat("es-PY", { timeZone: "America/Asuncion", hour: "2-digit", minute: "2-digit", hour12: false }).format(new Date()) + " h";
      } catch (e) {}
    }
    reloj(); setInterval(reloj, 20000);

    var m = d.createElement("div");
    m.className = "muelle";
    d.body.appendChild(m);
    muelle("ZENVO · Consultas", "¿Hablamos?", "");

    var ultimo = window.scrollY || 0, tic = false, calma;
    var cintas = $$(".cinta");
    function alScroll() {
      var y = window.scrollY || 0, dy = y - ultimo;
      cab.classList.toggle("is-baja", y > 8);
      if (!QUIETO && cintas.length) {
        var s = Math.max(-9, Math.min(9, dy * 0.35));
        cintas.forEach(function (c) { c.style.setProperty("--sesgo", (-s).toFixed(2) + "deg"); });
        clearTimeout(calma);
        calma = setTimeout(function () { cintas.forEach(function (c) { c.style.setProperty("--sesgo", "0deg"); }); }, 140);
      }
      ultimo = y; tic = false;
    }
    window.addEventListener("scroll", function () { if (!tic) { tic = true; requestAnimationFrame(alScroll); } }, { passive: true });
    alScroll();
  }

  /* ---------- 7. Movimiento ---------- */
  function partir(el) {
    if (el.getAttribute("data-partido")) return;
    el.setAttribute("data-partido", "1");
    el.setAttribute("aria-label", el.textContent.replace(/\s+/g, " ").trim());
    var i = 0;
    (function andar(nodo) {
      Array.prototype.slice.call(nodo.childNodes).forEach(function (h) {
        if (h.nodeType === 3) {
          var frag = d.createDocumentFragment();
          h.textContent.split(/(\s+)/).forEach(function (tr) {
            if (!tr) return;
            if (/^\s+$/.test(tr)) { frag.appendChild(d.createTextNode(" ")); return; }
            var o = d.createElement("span"); o.className = "pal"; o.setAttribute("aria-hidden", "true");
            var s = d.createElement("span"); s.textContent = tr; s.style.setProperty("--i", i++);
            o.appendChild(s); frag.appendChild(o);
          });
          nodo.replaceChild(frag, h);
        } else if (h.nodeType === 1 && h.tagName !== "BR") andar(h);
      });
    })(el);
  }
  var ojo = null, telonHasta = 0;
  function mirar(r) {
    var falta = telonHasta - Date.now();
    if (falta > 0) { setTimeout(function () { mirar(r); }, falta + 20); return; }
    $$("[data-titulo]", r).forEach(partir);
    $$("[data-escalera]", r).forEach(function (c) {
      Array.prototype.forEach.call(c.children, function (h, i) { h.style.setProperty("--d", (i % 6) * 0.08 + "s"); });
    });
    var sel = "[data-aparece],[data-titulo],[data-cuenta],[data-aparece-pie],[data-odo]";
    var nodos = $$(sel, r);
    if (r && r.matches && r.matches(sel)) nodos.push(r);
    function ver(n) {
      n.classList.add("is-visto");
      if (n.hasAttribute("data-cuenta")) { if (QUIETO) n.textContent = n.getAttribute("data-cuenta"); else contar(n); }
      if (n.hasAttribute("data-odo")) {
        $$(".odo-r", n).forEach(function (c) { c.style.transform = "translateY(" + (-1.12 * c.getAttribute("data-d")) + "em)"; });
        /* cuando termina de girar, vuelve a ser texto común (con su espaciado natural) */
        setTimeout(function () {
          var lector = n.previousElementSibling;
          if (lector && lector.classList.contains("solo-lector")) { n.replaceWith(d.createTextNode(lector.textContent)); lector.remove(); }
        }, QUIETO ? 0 : 2400);
      }
    }
    if (QUIETO || !("IntersectionObserver" in window)) { nodos.forEach(ver); return; }
    if (!ojo) {
      ojo = new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (e.isIntersecting) { ver(e.target); ojo.unobserve(e.target); } });
      }, { rootMargin: "0px 0px -8% 0px", threshold: 0.06 });
    }
    nodos.forEach(function (n) { if (!n.classList.contains("is-visto")) ojo.observe(n); });
    /* Red de seguridad: si el observador no avisó, lo que ya está en pantalla se muestra igual
       (a los 1,6 y 4 segundos, y cada vez que la persona hace scroll). */
    function revisar() {
      var alto = window.innerHeight;
      nodos = nodos.filter(function (n) {
        if (n.classList.contains("is-visto") || !n.isConnected) return false;
        var c = n.getBoundingClientRect();
        if (c.top < alto * 0.95 && c.bottom > 0) { ver(n); ojo.unobserve(n); return false; }
        return true;
      });
      if (!nodos.length) window.removeEventListener("scroll", alScroll);
    }
    var espera = 0;
    function alScroll() { if (!espera) espera = setTimeout(function () { espera = 0; revisar(); }, 150); }
    window.addEventListener("scroll", alScroll, { passive: true });
    [1600, 4000].forEach(function (ms) { setTimeout(revisar, ms); });
  }
  function contar(el) {
    var fin = parseInt(el.getAttribute("data-cuenta"), 10) || 0, t0 = null, dur = 1400;
    function paso(t) {
      if (!t0) t0 = t;
      var k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 4);
      el.textContent = Math.round(fin * e);
      if (k < 1) requestAnimationFrame(paso);
    }
    requestAnimationFrame(paso);
  }
  function acordeones(r) {
    $$(".pregunta__q", r).forEach(function (b) {
      b.setAttribute("aria-expanded", "false");
      b.addEventListener("click", function () {
        var p = b.parentNode, abre = !p.classList.contains("is-abierta");
        p.classList.toggle("is-abierta", abre);
        b.setAttribute("aria-expanded", abre ? "true" : "false");
      });
    });
  }
  function arrastre(riel) {
    var baja = false, x0 = 0, s0 = 0, movio = false;
    riel.addEventListener("mousedown", function (e) { baja = true; movio = false; x0 = e.pageX; s0 = riel.scrollLeft; });
    window.addEventListener("mousemove", function (e) {
      if (!baja) return;
      var dx = e.pageX - x0;
      if (Math.abs(dx) > 5) { movio = true; riel.classList.add("is-arrastrando"); }
      if (movio) riel.scrollLeft = s0 - dx;
    });
    window.addEventListener("mouseup", function () { baja = false; setTimeout(function () { riel.classList.remove("is-arrastrando"); }, 0); });
    riel.addEventListener("dragstart", function (e) { e.preventDefault(); });
  }
  function cursor() {
    if (QUIETO || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    var c = d.createElement("div"); c.className = "cursor"; c.setAttribute("aria-hidden", "true");
    d.body.appendChild(c);
    d.addEventListener("mousemove", function (e) {
      c.style.setProperty("--x", e.clientX + "px"); c.style.setProperty("--y", e.clientY + "px");
      var t = e.target.closest ? e.target.closest("[data-cursor]") : null;
      var sobreFoto = t && e.target.closest(".pieza__foto, .entregado__foto, .escena__marco");
      if (sobreFoto) c.textContent = t.getAttribute("data-cursor");
      c.classList.toggle("is-activo", !!sobreFoto);
    }, { passive: true });
    d.addEventListener("mouseleave", function () { c.classList.remove("is-activo"); });
    window.addEventListener("scroll", function () { c.classList.remove("is-activo"); }, { passive: true });
  }

  /* La revisión: los 22 puntos se recorren con el scroll. */
  function revision() {
    var sec = $("#revision");
    if (!sec || QUIETO) return;
    var lis = $$(".revision__lista li", sec), ticks = $$(".revision__regla i", sec);
    var num = $("#rev-n"), area = $("#rev-area"), listaEl = $(".revision__lista", sec), vent = $(".revision__ventana", sec);
    if (!lis.length || !vent) return;
    sec.classList.add("is-recorrido");
    var ult = -1, tic = false;
    function poner(k) {
      if (k === ult) return;
      ult = k;
      lis.forEach(function (li, j) { li.classList.toggle("is-hecho", j < k); li.classList.toggle("is-activo", j === k); });
      ticks.forEach(function (t, j) { t.classList.toggle("is-hecho", j < k); t.classList.toggle("is-activo", j === k); });
      num.textContent = dos(k + 1);
      area.textContent = lis[k].getAttribute("data-area");
      var y = vent.clientHeight / 2 - (lis[k].offsetTop + lis[k].offsetHeight / 2);
      listaEl.style.transform = "translate3d(0," + Math.round(y) + "px,0)";
    }
    function medir() {
      var r = sec.getBoundingClientRect(), total = sec.offsetHeight - window.innerHeight;
      var p = total > 0 ? Math.max(0, Math.min(1, -r.top / total)) : 0;
      poner(Math.min(lis.length - 1, Math.floor(p * lis.length)));
      tic = false;
    }
    window.addEventListener("scroll", function () { if (!tic) { tic = true; requestAnimationFrame(medir); } }, { passive: true });
    window.addEventListener("resize", function () { ult = -1; medir(); });
    medir();
  }

  /* Deslizar con el dedo (o arrastrar con el mouse) hacia un lado u otro.
     Mientras se arrastra, el elemento sigue al dedo un poco; al soltar, si se movió
     lo suficiente, avanza o retrocede. Un arrastre nunca cuenta como clic. */
  function deslizar(zona, mover, onAnt, onSig) {
    var x0 = 0, y0 = 0, dx = 0, activo = false, horizontal = null, recien = false;
    zona.style.touchAction = "pan-y";
    zona.addEventListener("pointerdown", function (e) {
      if (e.button > 0) return;
      activo = true; horizontal = null; dx = 0; x0 = e.clientX; y0 = e.clientY;
    });
    zona.addEventListener("pointermove", function (e) {
      if (!activo) return;
      var mx = e.clientX - x0, my = e.clientY - y0;
      if (horizontal === null && (Math.abs(mx) > 8 || Math.abs(my) > 8)) {
        horizontal = Math.abs(mx) > Math.abs(my);
        if (horizontal) { try { zona.setPointerCapture(e.pointerId); } catch (er) {} zona.classList.add("is-arrastrando"); }
      }
      if (horizontal) { dx = mx; if (mover) mover.style.transform = "translateX(" + (dx * 0.35).toFixed(1) + "px)"; }
    });
    function soltar() {
      if (!activo) return;
      activo = false;
      zona.classList.remove("is-arrastrando");
      if (mover) mover.style.transform = "";
      if (horizontal && Math.abs(dx) > 45) {
        recien = true; setTimeout(function () { recien = false; }, 350);
        if (dx < 0) onSig(); else onAnt();
      }
    }
    zona.addEventListener("pointerup", soltar);
    zona.addEventListener("pointercancel", soltar);
    zona.addEventListener("click", function (e) { if (recien) { e.preventDefault(); e.stopPropagation(); } }, true);
    zona.addEventListener("dragstart", function (e) { e.preventDefault(); });
  }

  /* Estados del equipo: nuevo, caja abierta, excelente, muy bueno.
     Pasa sola de uno a otro mientras se ve. La persona también puede elegir uno
     (pestaña, punto de la escala, arrastrando la escala o deslizando el dibujo):
     se queda ahí 10 segundos y después sigue pasando sola. */
  function estados() {
    $$("[data-estados]").forEach(function (sec) {
      var tabs = $$(".estado-tab", sec), panels = $$(".estado-panel", sec), pie = $(".estados__pie", sec);
      var puntos = $$(".escala__punto", sec), linea = $(".escala__linea", sec), marco = $(".estados__marco", sec);
      var k = -1, auto = !QUIETO, fijo = QUIETO, visible = false, t;
      function poner(i, usuario) {
        if (usuario) {
          auto = false; clearTimeout(t); sec.classList.remove("is-auto");
          if (!fijo) t = setTimeout(function () { auto = true; sec.classList.add("is-auto"); agendar(); }, 10000);
        }
        if (i === k) return;
        k = i;
        sec.setAttribute("data-nivel", i);
        sec.style.setProperty("--nivel", i);
        tabs.forEach(function (b, j) { b.setAttribute("aria-selected", String(j === i)); b.tabIndex = j === i ? 0 : -1; });
        puntos.forEach(function (b, j) { b.setAttribute("aria-pressed", String(j === i)); });
        panels.forEach(function (p, j) { p.classList.toggle("is-activo", j === i); });
        if (pie) { pie.textContent = tabs[i].getAttribute("data-pie"); pie.classList.remove("is-cambio"); void pie.offsetWidth; pie.classList.add("is-cambio"); }
        if (auto) {
          /* reinicia la línea de avance de la pestaña activa */
          sec.classList.remove("is-auto"); void sec.offsetWidth; sec.classList.add("is-auto");
          agendar();
        }
      }
      function agendar() {
        clearTimeout(t);
        if (!auto) return;
        t = setTimeout(function () { if (visible && !d.hidden) poner((k + 1) % tabs.length); else agendar(); }, 4200);
      }
      tabs.forEach(function (b, i) {
        b.addEventListener("click", function () { poner(i, true); });
        b.addEventListener("keydown", function (e) {
          var n = e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : e.key === "ArrowLeft" || e.key === "ArrowUp" ? -1 : 0;
          if (!n) return;
          e.preventDefault();
          var j = (i + n + tabs.length) % tabs.length;
          poner(j, true); tabs[j].focus();
        });
      });
      /* la escala: tocar un punto, o arrastrar a lo largo de la línea */
      puntos.forEach(function (b, i) { b.addEventListener("click", function () { poner(i, true); }); });
      if (linea) {
        var arrastrando = false;
        var desdeX = function (e) {
          var r = linea.getBoundingClientRect();
          return Math.max(0, Math.min(puntos.length - 1, Math.floor((e.clientX - r.left) / r.width * puntos.length)));
        };
        linea.style.touchAction = "none";
        linea.addEventListener("pointerdown", function (e) {
          arrastrando = true; sec.classList.add("is-escala");
          try { linea.setPointerCapture(e.pointerId); } catch (er) {}
          poner(desdeX(e), true);
        });
        linea.addEventListener("pointermove", function (e) { if (arrastrando) poner(desdeX(e), true); });
        ["pointerup", "pointercancel"].forEach(function (ev) { linea.addEventListener(ev, function () { arrastrando = false; sec.classList.remove("is-escala"); }); });
      }
      /* el dibujo: deslizar a la izquierda para el siguiente, a la derecha para el anterior */
      if (marco) deslizar(marco, $(".ilu", marco), function () { poner((k - 1 + tabs.length) % tabs.length, true); }, function () { poner((k + 1) % tabs.length, true); });

      var ancla = location.hash.slice(1), desde = 0;
      NIVELES.forEach(function (nv, j) { if (nv[0] === ancla) desde = j; });
      if (ancla && desde) { auto = false; fijo = true; }
      poner(desde, !auto);
      if ("IntersectionObserver" in window) {
        new IntersectionObserver(function (es) { visible = es[0].isIntersecting; }, { threshold: 0.35 }).observe(sec);
      } else visible = true;
    });
  }

  /* Las piezas se inclinan apenas hacia el cursor (solo con mouse). */
  function inclinar() {
    if (QUIETO || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    d.addEventListener("mousemove", function (e) {
      var p = e.target.closest && e.target.closest(".pieza:not(.pieza--texto):not(.esqueleto)");
      $$(".pieza.is-inclina").forEach(function (o) { if (o !== p) o.classList.remove("is-inclina"); });
      if (!p) return;
      var r = p.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
      p.style.setProperty("--ry", (x * 5).toFixed(2) + "deg");
      p.style.setProperty("--rx", (-y * 5).toFixed(2) + "deg");
      p.style.setProperty("--tx", (-x * 10).toFixed(1) + "px");
      p.style.setProperty("--ty", (-y * 10).toFixed(1) + "px");
      p.classList.add("is-inclina");
    }, { passive: true });
    d.addEventListener("mouseleave", function () { $$(".pieza.is-inclina").forEach(function (o) { o.classList.remove("is-inclina"); }); });
  }

  /* Botones con imán: se corren unos pixeles hacia el cursor. */
  function imanes() {
    if (QUIETO || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    d.addEventListener("mousemove", function (e) {
      var b = e.target.closest && e.target.closest(".btn, .cab__wa");
      $$(".iman").forEach(function (o) { if (o !== b) { o.style.transform = ""; o.classList.remove("iman"); } });
      if (!b) return;
      var r = b.getBoundingClientRect();
      var x = (e.clientX - r.left - r.width / 2) / r.width, y = (e.clientY - r.top - r.height / 2) / r.height;
      b.classList.add("iman");
      b.style.transform = "translate(" + (x * 10).toFixed(1) + "px," + (y * 8).toFixed(1) + "px)";
    }, { passive: true });
  }

  /* Barra fina bajo la cabecera que muestra cuánto falta de la página. */
  function progreso() {
    var b = d.createElement("div");
    b.className = "progreso"; b.setAttribute("aria-hidden", "true");
    d.body.appendChild(b);
    var tic = false;
    function medir() {
      var total = d.documentElement.scrollHeight - window.innerHeight;
      b.style.setProperty("--p", total > 0 ? Math.min(1, window.scrollY / total).toFixed(4) : 0);
      tic = false;
    }
    window.addEventListener("scroll", function () { if (!tic) { tic = true; requestAnimationFrame(medir); } }, { passive: true });
    medir();
  }

  /* Precio que gira como un contador: cada dígito sube hasta su número. */
  function odometro(texto) {
    var k = 0, h = '<span class="solo-lector">' + esc(texto) + '</span><span class="odo" data-odo aria-hidden="true">';
    String(texto).split("").forEach(function (ch) {
      if (/\d/.test(ch)) {
        h += '<span class="odo-c"><span class="odo-r" data-d="' + ch + '" style="--k:' + (k++) + '">' +
          "0123456789".split("").map(function (n) { return "<span>" + n + "</span>"; }).join("") + '</span></span>';
      } else h += "<span>" + (ch === " " ? "&nbsp;" : esc(ch)) + "</span>";
    });
    return h + "</span>";
  }

  /* ---------- 8. Inicio ---------- */
  var giroT = null;
  function palabraDe(p) {
    return p.nombre.replace(/^(Google|Apple|Samsung|Xiaomi|Motorola|Sony|Amazon)\s+/i, "").split(/\s+/)[0];
  }
  function portada(disp) {
    var sec = $("#portada"), indice = $("#indice"), escena = $("#escena"), palabra = $("#palabra");
    if (!sec || !indice || !escena) return;
    clearTimeout(giroT);
    var items = disp.filter(function (p) { return p.fotos.length; }).slice(0, 5);
    if (!items.length) { sec.classList.add("portada--vacia"); return; }
    sec.classList.remove("portada--vacia");

    indice.innerHTML = items.map(function (p, i) {
      return '<a class="indice__fila" href="producto.html?id=' + encodeURIComponent(p.id) + '" data-i="' + i + '">' +
        '<span class="n">' + dos(i + 1) + '</span>' +
        '<span class="nom">' + esc(p.nombre) + (p.detalle ? '<small>' + esc(p.detalle) + '</small>' : '') + '</span>' +
        '<span class="pre">' + (p.precio ? '<small>Desde</small>' + gs(p.precio) : '<small>Precio</small>Consultá') + '</span>' +
        ICONO.flecha + '</a>';
    }).join("");
    /* Arriba de la foto: la escala de estado (nuevo → muy bueno), nunca encima del equipo. */
    escena.innerHTML = '<div class="escena__arriba"><span class="escena__pager">' +
      '<button class="escena__flecha escena__flecha--ant" type="button" aria-label="Equipo anterior">' + ICONO.flecha + '</button>' +
      '<span class="escena__num" aria-live="polite"></span>' +
      '<button class="escena__flecha" type="button" aria-label="Equipo siguiente">' + ICONO.flecha + '</button></span>' +
      '<a class="control" href="estados.html" title="Qué significa cada estado">' +
      '<span class="control__escala" aria-hidden="true"><i></i><i></i><i></i><i></i><span class="control__marca"></span></span>' +
      '<span class="control__txt"></span></a></div>' +
      '<a class="escena__marco" href="#" data-cursor="Ver">' +
      items.map(function (p, i) {
        var f = p.fotos[0];
        return '<img src="' + esc(f.g) + '" alt="' + esc(p.nombre + " " + p.detalle) + '"' + (f.w > f.h * 1.05 ? ' class="es-ancha"' : '') +
          (i ? ' fetchpriority="low"' : ' fetchpriority="high"') + ' decoding="async">';
      }).join("") +
      '<span class="escena__scan" aria-hidden="true"></span></a>' +
      /* barras como en las historias: muestran cuál se ve y cuánto falta; se pueden tocar */
      (items.length > 1 ? '<div class="escena__barras" role="group" aria-label="Elegí un equipo">' + items.map(function (p, i) {
        return '<button type="button" aria-label="' + esc(p.nombre) + '" data-i="' + i + '"><i></i></button>';
      }).join("") + '</div>' : '');

    var filas = $$(".indice__fila", indice), imgs = $$(".escena__marco img", escena), barras = $$(".escena__barras button", escena);
    var marcoEl = $(".escena__marco", escena), numEl = $(".escena__num", escena), actual = -1;
    function reiniciar(el, clase) { el.classList.remove(clase); void el.offsetWidth; el.classList.add(clase); }
    function activar(i) {
      if (i === actual) return;
      var p = items[i], f = p.fotos[0], antes = actual;
      actual = i;
      imgs.forEach(function (im, j) { im.classList.toggle("is-activa", j === i); im.classList.toggle("is-sale", j === antes); });
      if (antes > -1) setTimeout(function () { if (actual !== antes) imgs[antes].classList.remove("is-sale"); }, 1150);
      filas.forEach(function (fl, j) { fl.classList.toggle("is-activa", j === i); });
      barras.forEach(function (b, j) { b.classList.toggle("is-hecha", j < i); b.classList.remove("is-activa"); b.setAttribute("aria-pressed", String(j === i)); });
      if (barras[i]) { void barras[i].offsetWidth; barras[i].classList.add("is-activa"); }
      sec.style.setProperty("--campo", f.campo || "#E2DBCB");
      sec.style.setProperty("--tinta", f.tinta || "#24332F");
      marcoEl.href = "producto.html?id=" + encodeURIComponent(p.id);
      marcoEl.setAttribute("aria-label", p.nombre + ", ver la ficha");
      numEl.textContent = "N.º " + dos(i + 1) + " / " + dos(items.length);
      var nv = nivelDe(p.condicion), ctl = $(".control", escena), txt = $(".control__txt", escena);
      ctl.hidden = nv < 0;
      if (nv > -1) {
        ctl.style.setProperty("--nivel", nv);
        ctl.href = "estados.html#" + NIVELES[nv][0];
        txt.textContent = NIVELES[nv][1];
        reiniciar(txt, "is-cambio");
      }
      if (palabra) {
        var pal = palabraDe(p);
        palabra.style.setProperty("--letras", Math.max(4, pal.length));
        palabra.innerHTML = "<span>" + esc(pal) + "</span>";
        reiniciar(palabra, "is-cambio");
      }
      reiniciar(escena, "is-escaneo");
    }
    function agendar() {
      clearTimeout(giroT);
      if (QUIETO || items.length < 2) return;
      giroT = setTimeout(function () {
        var r = sec.getBoundingClientRect();
        if (!d.hidden && r.bottom > 120 && !sec.classList.contains("is-pausa") && Date.now() > pausaHasta) activar((actual + 1) % items.length);
        agendar();
      }, 5200);
    }
    /* Elegir a mano (flechas, barras o deslizando): se queda ese equipo 10 segundos
       y después sigue pasando solo. */
    var pausaHasta = 0;
    function elegir(i) {
      activar((i + items.length) % items.length);
      pausaHasta = Date.now() + 10000;
      sec.classList.add("is-manual");
      clearTimeout(elegir.t);
      elegir.t = setTimeout(function () { sec.classList.remove("is-manual"); }, 10000);
      agendar();
    }
    $(".escena__flecha--ant", escena).addEventListener("click", function () { elegir(actual - 1); });
    $(".escena__flecha:not(.escena__flecha--ant)", escena).addEventListener("click", function () { elegir(actual + 1); });
    barras.forEach(function (b, i) { b.addEventListener("click", function () { elegir(i); }); });
    if (items.length > 1) deslizar(marcoEl, marcoEl, function () { elegir(actual - 1); }, function () { elegir(actual + 1); });
    var fino = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    filas.forEach(function (fl, i) {
      if (fino) fl.addEventListener("mouseenter", function () { activar(i); });
      fl.addEventListener("focus", function () { activar(i); });
    });
    [indice, escena].forEach(function (z) {
      z.addEventListener("mouseenter", function () { sec.classList.add("is-pausa"); });
      z.addEventListener("mouseleave", function () { sec.classList.remove("is-pausa"); agendar(); });
    });
    activar(0);
    agendar();
  }

  function inicio(todo) {
    var disp = todo.filter(function (p) { return p.estado === "disponible"; });
    var ped = todo.filter(function (p) { return p.estado === "pedido"; });
    var ven = todo.filter(function (p) { return p.estado === "vendido" && p.fotos.length; });

    $$("[data-n-disponible]").forEach(function (n) {
      n.textContent = disp.length === 1 ? "1 equipo en stock" : disp.length + " equipos en stock";
    });
    $$("[data-chat-equipo]").forEach(function (n) { if (disp[0]) n.textContent = disp[0].nombre; });
    portada(disp);

    var g = $("#mosaico");
    if (g) {
      if (!disp.length) {
        g.innerHTML = vacio("Hoy no tenemos equipos en stock.", "Tomamos pedidos: decinos qué equipo buscás y te pasamos precio y plazo.", "Hola ZENVO, quiero pedir un equipo.");
      } else {
        var patron = [[7, 5], [4, 4, 4], [5, 7], [4, 4, 4]], h = "", i = 0, f = 0, resto = 0;
        while (i < disp.length) {
          var fila = patron[f % patron.length];
          resto = 0;
          fila.forEach(function (col) {
            if (i < disp.length) { h += pieza(disp[i], { n: i + 1, col: col, ancha: col === 7, par: col === 5 }); i++; }
            else resto += col;
          });
          f++;
        }
        if (resto) h += piezaTexto(resto);
        g.innerHTML = h;
      }
      mirar(g);
    }
    var r = $("#riel-pedido");
    if (r) {
      var sec = r.closest("[data-bloque]");
      if (!ped.length) { if (sec) sec.hidden = true; }
      else { if (sec) sec.hidden = false; r.innerHTML = ped.map(function (p, k) { return pieza(p, { n: k + 1 }); }).join(""); mirar(r); }
    }
    var e = $("#entregados");
    if (e) {
      var secE = e.closest("section");
      if (ven.length < 3) { secE.hidden = true; }
      else {
        secE.hidden = false;
        var grupo = '<div class="entregados__grupo">' + ven.map(function (p) {
          return '<a class="entregado" href="producto.html?id=' + encodeURIComponent(p.id) + '" data-cursor="Ver"><div class="entregado__foto"><img src="' + esc(p.fotos[0].m) +
            '" alt="' + esc(p.nombre) + '" loading="lazy" decoding="async"></div><p><small>Entregado</small>' + esc(p.nombre) + '</p></a>';
        }).join("") + '</div>';
        var veces = Math.max(2, Math.ceil(12 / ven.length));
        veces += veces % 2;
        e.innerHTML = '<div class="entregados__riel">' + new Array(veces + 1).join(grupo) + '</div>';
      }
    }
    conectarWA();
  }

  /* ---------- 9. Catálogo ---------- */
  var filtro = { estado: "todo", cat: "todas", q: "" };
  function catalogo(todo) {
    var cont = $("#catalogo"), barra = $("#filtros");
    if (!cont) return;
    var vivos = todo.filter(function (p) { return p.estado !== "vendido"; });
    var nDisp = vivos.filter(function (p) { return p.estado === "disponible"; }).length;
    var nPed = vivos.length - nDisp;
    $$("[data-n-catalogo]").forEach(function (n) { n.innerHTML = "<b>" + nDisp + "</b> en stock · <b>" + nPed + "</b> a pedido"; });

    var cats = Object.keys(CATEGORIAS).filter(function (c) { return vivos.some(function (p) { return p.categoria === c; }); });
    if (cats.indexOf(filtro.cat) < 0) filtro.cat = "todas";
    function boton(grupo, valor, texto, n) {
      return '<button class="filtro" type="button" data-grupo="' + grupo + '" data-valor="' + valor + '" aria-pressed="' +
        (filtro[grupo] === valor) + '">' + texto + (n != null ? "<sup>" + n + "</sup>" : "") + '</button>';
    }
    barra.innerHTML = '<div class="contenedor filtros__fila"><div class="filtros__grupo" role="group" aria-label="Filtrar el catálogo">' +
      boton("estado", "todo", "Todo", vivos.length) +
      boton("estado", "disponible", "Disponible hoy", nDisp) +
      boton("estado", "pedido", "A pedido", nPed) +
      '<span class="filtros__sep" aria-hidden="true"></span>' +
      boton("cat", "todas", "Todas las categorías") +
      cats.map(function (c) { return boton("cat", c, CATEGORIAS[c]); }).join("") +
      '</div><label class="buscar">' + ICONO.lupa + '<span class="solo-lector">Buscar</span><input type="search" id="buscar" placeholder="Buscar modelo" autocomplete="off" value="' + esc(filtro.q) + '"></label></div>';

    function pintar() {
      var q = plano(filtro.q);
      function pasa(p) {
        if (filtro.cat !== "todas" && p.categoria !== filtro.cat) return false;
        if (q && plano(p.nombre + " " + p.detalle + " " + CATEGORIAS[p.categoria]).indexOf(q) < 0) return false;
        return true;
      }
      var a = todo.filter(function (p) { return p.estado === "disponible" && pasa(p); });
      var b = todo.filter(function (p) { return p.estado === "pedido" && pasa(p); });
      var v = todo.filter(function (p) { return p.estado === "vendido" && pasa(p); });
      var h = "";
      function bloque(id, titulo, texto, items, clase, baja) {
        return '<section class="bloque" id="' + id + '"><div class="bloque__cabeza"><h2 class="subtitulo">' + titulo +
          '</h2><p>' + texto + '</p></div><div class="grilla ' + (clase || "") + '" data-escalera>' +
          items.map(function (p, k) { return pieza(p, { n: baja ? 0 : k + 1, baja: baja }); }).join("") + '</div></section>';
      }
      if (filtro.estado !== "pedido" && a.length) h += bloque("disponible", "Disponible hoy", "Están acá, revisados y listos. Se entregan apenas coordinemos.", a);
      if (filtro.estado !== "disponible" && b.length) h += bloque("pedido", "A pedido", "Los traemos por encargo en " + esc(C.pedidoPlazo || "8 a 15 días") + ", con seña del " + esc(C.pedidoSena || "50 %") + ". Pasan por la misma revisión.", b);
      if (!h) {
        h = vacio("No encontramos equipos con ese filtro.", "Si buscás un modelo que no está acá, lo traemos a pedido. Decinos marca, modelo y capacidad.",
          "Hola ZENVO, busco un equipo que no está en el catálogo" + (filtro.q ? ": " + filtro.q : "") + ".");
      }
      if (filtro.estado === "todo" && v.length) h += bloque("entregados", "Ya entregados", "Equipos que pasaron por ZENVO. Si te interesa uno igual, lo buscamos.", v, "grilla--4", true);
      cont.innerHTML = h;
      mirar(cont);
      conectarWA(cont);
      $$(".filtro", barra).forEach(function (bt) { bt.setAttribute("aria-pressed", String(filtro[bt.getAttribute("data-grupo")] === bt.getAttribute("data-valor"))); });
      var ps = new URLSearchParams();
      if (filtro.estado !== "todo") ps.set("estado", filtro.estado);
      if (filtro.cat !== "todas") ps.set("cat", filtro.cat);
      if (filtro.q) ps.set("q", filtro.q);
      var s = ps.toString();
      history.replaceState(null, "", location.pathname + (s ? "?" + s : ""));
    }
    barra.onclick = function (e) {
      var bt = e.target.closest(".filtro");
      if (!bt) return;
      filtro[bt.getAttribute("data-grupo")] = bt.getAttribute("data-valor");
      pintar();
      var tope = barra.getBoundingClientRect().top + window.scrollY - 64;
      if (window.scrollY > tope) window.scrollTo({ top: tope, behavior: QUIETO ? "auto" : "smooth" });
    };
    var espera;
    $("#buscar").addEventListener("input", function (e) {
      clearTimeout(espera);
      var v = e.target.value;
      espera = setTimeout(function () { filtro.q = v.trim(); pintar(); }, 160);
    });
    pintar();
  }

  /* ---------- 10. Producto ---------- */
  function meta(sel, attr, valor) { var m = $(sel); if (m) m.setAttribute(attr, valor); }
  function producto(todo) {
    var cont = $("#producto");
    if (!cont) return;
    var p = Catalogo.buscar(slug(parametro("id")));
    if (!p) {
      d.title = "Equipo no encontrado — ZENVO";
      cont.innerHTML = '<div class="contenedor seccion">' + vacio("No encontramos ese equipo.", "Puede que ya se haya entregado o que el enlace esté incompleto. Mirá lo que hay hoy o escribinos.", "") +
        '<p style="margin-top:2rem"><a class="enlace" href="catalogo.html">Ver el catálogo ' + ICONO.flecha + '</a></p></div>';
      conectarWA(cont);
      return;
    }
    var nombreLargo = p.nombre + (p.detalle ? " · " + p.detalle : "");
    d.title = p.nombre + (p.estado === "vendido" ? " (entregado)" : /semi/i.test(p.condicion) ? " seminuevo" : "") + " — ZENVO Paraguay";
    var desc = nombreLargo + ". " + (p.estado === "pedido" ? "A pedido en " + (C.pedidoPlazo || "8 a 15 días") + ". " : p.estado === "disponible" ? "Disponible hoy en Ciudad del Este. " : "") +
      "22 puntos de control y 45 días de garantía. Consultá por WhatsApp.";
    meta('meta[name="description"]', "content", desc);
    meta('meta[property="og:title"]', "content", d.title);
    meta('meta[property="og:description"]', "content", desc);
    if (p.fotos[0]) meta('meta[property="og:image"]', "content", new URL(p.fotos[0].g, location.href).href);

    var msj = mensaje(p), n = p.fotos.length, gal;
    if (n) {
      gal = '<div class="galeria"><div class="galeria__marco"><div class="galeria__pista">' + p.fotos.map(function (f, i) {
        return '<figure class="' + (f.blanco ? "is-blanco" : "") + '"><img src="' + esc(f.g) + '"' + (f.m !== f.g ? ' srcset="' + esc(f.m) + ' 800w, ' + esc(f.g) + ' 1600w" sizes="(max-width: 860px) 100vw, 55vw"' : '') +
          ' alt="' + esc(p.nombre + " " + p.detalle + ", foto " + (i + 1)) + '"' + (i ? ' loading="lazy"' : ' fetchpriority="high"') + ' decoding="async" data-i="' + i + '"></figure>';
      }).join("") + '</div>' +
        (n > 1 ? '<button class="galeria__nav galeria__nav--ant" type="button" aria-label="Foto anterior">' + ICONO.flecha + '</button><button class="galeria__nav galeria__nav--sig" type="button" aria-label="Foto siguiente">' + ICONO.flecha + '</button>' : '') +
        '</div><div class="galeria__abajo">' +
        (n > 1 ? '<div class="galeria__minis" role="tablist" aria-label="Fotos">' + p.fotos.map(function (f, i) {
          return '<button class="mini" type="button" role="tab" aria-label="Foto ' + (i + 1) + '" aria-current="' + (i === 0) + '" data-i="' + i + '"><img src="' + esc(f.m) + '" alt="" loading="lazy"></button>';
        }).join("") + '</div>' : '<span></span>') +
        '<p class="galeria__credito">' + esc(p.credito || (p.estado === "disponible" ? "Fotos reales de esta unidad" : "")) + '</p></div></div>';
    } else {
      gal = '<div class="galeria"><div class="galeria__marco"><div class="pieza__sinfoto">' + ICONO.mono + '<span>Te pasamos las fotos por WhatsApp</span></div></div></div>';
    }

    var precio;
    if (p.estado === "vendido") {
      precio = '<div class="precio"><small>Estado</small><p class="precio__valor">Ya lo entregamos</p><p class="precio__nota">Queda como registro de lo que pasó por ZENVO. Si buscás uno igual, lo traemos a pedido.</p></div>';
    } else if (p.precio) {
      precio = '<div class="precio"><small>Desde</small><p class="precio__valor">' + odometro(gs(p.precio)) + (p.precioAntes ? ' <s>' + gs(p.precioAntes) + '</s>' : '') + '</p>' +
        '<p class="precio__nota">Es el punto de partida. Te pasamos el valor final por WhatsApp, con el estado exacto de la unidad.</p></div>';
    } else {
      precio = '<div class="precio"><small>Precio</small><p class="precio__valor">' + (p.estado === "pedido" ? "Consultá precio y plazo" : "Consultá disponibilidad") + '</p>' +
        '<p class="precio__nota">Escribinos y te pasamos el valor y el estado exacto de la unidad.</p></div>';
    }
    var cta = p.estado === "pedido" ? "Pedilo por WhatsApp" : p.estado === "vendido" ? "Pedí uno igual" : "Consultar por WhatsApp";
    var respaldo = p.estado === "pedido"
      ? [["Entrega", C.pedidoPlazo || "8 a 15 días", "Desde que confirmás el pedido"], ["Seña", C.pedidoSena || "50 %", "Al confirmar el pedido"], ["Revisión", "22 puntos", "Antes de entregártelo"], ["Garantía", "45 días", "Con comprobante"]]
      : [["Revisión", "22 puntos", "En 6 áreas, antes de entrar al stock"], ["Garantía", "45 días", "Con comprobante de venta"], ["Entrega", "En la puerta", "Ciudad del Este y envíos a todo el país"], ["Pago", "De contado", "Efectivo o transferencia"]];

    var filasFicha = [["Equipo", p.nombre]];
    if (p.condicion) filasFicha.push(["Condición", p.condicion]);
    p.datos.forEach(function (x) { filasFicha.push([x[0] || "Dato", x[1]]); });
    var ficha = '<div class="comprobante comprobante--ficha" data-aparece><div class="comprobante__papel">' +
      '<p class="comprobante__cab">' + ICONO.palabra + '<span>' + (p.estado === "pedido" ? "Ficha del pedido" : "Ficha de la unidad") + '</span></p>' +
      '<dl>' + filasFicha.map(function (x) { return '<div><dt>' + esc(x[0]) + '</dt><dd>' + esc(x[1]) + '</dd></div>'; }).join("") + '</dl>' +
      (p.incluye.length ? '<p class="comprobante__sub">Incluye</p><ul class="comprobante__lista" style="border-top:0;padding-top:.4rem;margin-top:0">' + p.incluye.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join("") + '</ul>' : '') +
      '<p class="comprobante__total"><span>Revisión</span><b>' + (p.estado === "pedido" ? "Al llegar" : "22 / 22") + '</b></p>' +
      '<p class="comprobante__nota">' + (p.estado === "vendido" ? "Equipo entregado con comprobante y 45 días de garantía."
        : "Salud de batería, ciclos y estado físico: te los pasamos por WhatsApp antes de que decidas.") + '</p>' +
      '</div>' + (p.estado === "pedido" ? "" : sello("22")) + '</div>';

    cont.innerHTML = '<section class="pcampo"' + estilo(p) + '><div class="contenedor">' +
      '<nav class="migas" aria-label="Estás en" style="padding-top:1.5rem"><a href="index.html">Inicio</a><span aria-hidden="true">/</span><a href="catalogo.html">Catálogo</a><span aria-hidden="true">/</span><a href="catalogo.html?cat=' + p.categoria + '">' + CATEGORIAS[p.categoria] + '</a></nav>' +
      '<article class="producto">' + gal +
      '<div class="info">' +
      '<div class="info__arriba" data-aparece>' +
      '<div class="info__fila"><span class="estado estado--' + p.estado + '">' + ESTADOS[p.estado] + '</span>' +
      (p.etiqueta && p.estado !== "vendido" ? '<span class="chip chip--lleno">' + esc(p.etiqueta) + '</span>' : '') +
      (p.condicion ? (nivelDe(p.condicion) > -1
        ? '<a class="chip chip--enlace" href="estados.html#' + NIVELES[nivelDe(p.condicion)][0] + '" title="Qué significa este estado">' + esc(p.condicion) + ' ↗</a>'
        : '<span class="chip">' + esc(p.condicion) + '</span>') : '') + '</div>' +
      '<h1 class="info__titulo">' + esc(p.nombre) + '</h1>' +
      (p.detalle ? '<p class="info__detalle">' + esc(p.detalle) + '</p>' : '') +
      '</div>' +
      '<div data-aparece style="--d:.08s">' + precio + '</div>' +
      '<div class="info__cta" id="cta" data-aparece style="--d:.14s">' +
      '<a class="btn btn--ancho" data-wa="' + esc(msj) + '" href="' + esc(WA_BASE) + '">' + ICONO.wa + cta + '</a>' +
      '<p class="mini-nota">' + (p.estado === "pedido" ? "Te confirmamos precio, plazo y seña antes de que decidas." : "Te respondemos con la salud de batería, los ciclos y el estado físico de esta unidad.") + '</p>' +
      '<button class="enlace compartir" type="button" id="compartir">Compartir este equipo ' + ICONO.flecha + '</button>' +
      '</div></div></article></div></section>' +
      '<section class="seccion"><div class="contenedor dos dos--pareja" style="align-items:start">' + ficha +
      '<div class="pila">' +
      (p.descripcion ? '<div data-aparece><h2 class="h-mono">Sobre ' + (p.estado === "pedido" ? "este equipo" : "esta unidad") + '</h2><p class="bajada" style="color:var(--ink)">' + esc(p.descripcion) + '</p></div>' : '') +
      (p.nota ? '<p class="aviso" data-aparece>' + esc(p.nota) + '</p>' : '') +
      '<div data-aparece><h2 class="h-mono">Respaldo</h2><ul class="garantias">' + respaldo.map(function (x) { return '<li><b>' + esc(x[1]) + '</b><span>' + esc(x[0]) + ' · ' + esc(x[2]) + '</span></li>'; }).join("") + '</ul></div>' +
      '<p data-aparece><a class="enlace" href="verificacion.html">Ver los 22 puntos ' + ICONO.flecha + '</a></p>' +
      '</div></div></section>';

    var otros = todo.filter(function (o) { return o.id !== p.id && o.estado === (p.estado === "pedido" ? "pedido" : "disponible"); }).slice(0, 3);
    if (otros.length) {
      cont.insertAdjacentHTML("beforeend", '<section class="seccion arena"><div class="contenedor"><div class="cabeza"><div class="cabeza__texto"><span class="rotulo rotulo--linea">' +
        (p.estado === "pedido" ? "También a pedido" : "También disponible") + '</span><h2 class="titulo" data-titulo>Seguí mirando</h2></div><a class="enlace" href="catalogo.html">Ver todo el catálogo ' + ICONO.flecha + '</a></div><div class="grilla" data-escalera>' +
        otros.map(function (o, k) { return pieza(o, { n: k + 1 }); }).join("") + '</div></div></section>');
    }
    muelle(p.precio ? "Desde" : ESTADOS[p.estado], p.precio ? gs(p.precio) : "Consultá", msj);

    /* Galería */
    var pista = $(".galeria__pista", cont);
    if (pista && n > 1) {
      var minis = $$(".mini", cont), ahora = 0;
      var ir = function (i) { i = Math.max(0, Math.min(n - 1, i)); pista.scrollTo({ left: i * pista.clientWidth, behavior: QUIETO ? "auto" : "smooth" }); };
      pista.addEventListener("scroll", function () {
        var i = Math.round(pista.scrollLeft / Math.max(1, pista.clientWidth));
        if (i === ahora) return;
        ahora = i;
        minis.forEach(function (m, j) { m.setAttribute("aria-current", String(j === i)); });
      }, { passive: true });
      minis.forEach(function (m) { m.addEventListener("click", function () { ir(+m.getAttribute("data-i")); }); });
      $(".galeria__nav--ant", cont).addEventListener("click", function () { ir(ahora - 1); });
      $(".galeria__nav--sig", cont).addEventListener("click", function () { ir(ahora + 1); });
    }
    if (pista) {
      var visor = $(".visor");
      if (!visor) {
        visor = d.createElement("div"); visor.className = "visor"; visor.setAttribute("role", "dialog"); visor.setAttribute("aria-label", "Foto ampliada");
        visor.innerHTML = '<button type="button">Cerrar</button><img alt="">';
        d.body.appendChild(visor);
        visor.addEventListener("click", function () { visor.classList.remove("is-abierto"); });
        d.addEventListener("keydown", function (e) { if (e.key === "Escape") visor.classList.remove("is-abierto"); });
      }
      pista.addEventListener("click", function (e) {
        if (e.target.tagName !== "IMG") return;
        $("img", visor).src = p.fotos[+e.target.getAttribute("data-i")].g;
        $("img", visor).alt = e.target.alt;
        visor.classList.add("is-abierto");
      });
    }

    $("#compartir", cont).addEventListener("click", function () {
      var datos = { title: p.nombre + " — ZENVO", text: nombreLargo + " en ZENVO", url: location.href };
      if (navigator.share) navigator.share(datos).catch(function () {});
      else if (navigator.clipboard) navigator.clipboard.writeText(location.href).then(function () { avisar("Enlace copiado."); });
    });

    var ld = $("#ld-producto"); if (ld) ld.remove();
    if (p.estado !== "vendido") {
      var j = { "@context": "https://schema.org", "@type": "Product", name: nombreLargo, description: p.descripcion || desc,
        image: p.fotos.map(function (f) { return new URL(f.g, location.href).href; }),
        brand: { "@type": "Brand", name: p.nombre.split(" ")[0] }, itemCondition: /nuev/i.test(p.condicion) && !/semi/i.test(p.condicion) ? "https://schema.org/NewCondition" : "https://schema.org/RefurbishedCondition" };
      if (p.precio) j.offers = { "@type": "Offer", priceCurrency: "PYG", price: p.precio, url: location.href,
        availability: p.estado === "disponible" ? "https://schema.org/InStock" : "https://schema.org/PreOrder", seller: { "@type": "Organization", name: "ZENVO" } };
      var s = d.createElement("script"); s.type = "application/ld+json"; s.id = "ld-producto"; s.textContent = JSON.stringify(j);
      d.head.appendChild(s);
    }
    mirar(cont);
    conectarWA();
  }

  /* ---------- 11. A pedido ---------- */
  function aPedido(todo) {
    var g = $("#grilla-pedido");
    if (!g) return;
    var ped = todo.filter(function (p) { return p.estado === "pedido"; });
    var sec = g.closest("section");
    if (!ped.length) { sec.hidden = true; return; }
    sec.hidden = false;
    g.innerHTML = ped.map(function (p, k) { return pieza(p, { n: k + 1 }); }).join("");
    mirar(g);
  }
  function formularioPedido() {
    var f = $("#form-pedido");
    if (!f) return;
    f.addEventListener("submit", function (e) {
      e.preventDefault();
      var v = function (n) { return (f.elements[n] && f.elements[n].value || "").trim(); };
      var partes = [v("equipo"), v("capacidad"), v("color")].filter(Boolean).join(", ");
      var msj = "Hola ZENVO, quiero pedir un equipo: " + (partes || "todavía no definí el modelo") + "." +
        (v("uso") ? " Lo voy a usar para: " + v("uso") + "." : "") + " ¿Me pasan precio y plazo?";
      if (!WA_NUM && navigator.clipboard) {
        navigator.clipboard.writeText(msj).then(function () { avisar("Copiamos tu pedido: pegalo en el chat de WhatsApp."); }).catch(function () {});
      }
      window.open(waUrl(msj), "_blank", "noopener");
    });
  }

  /* ---------- 12. Arranque ---------- */
  function analitica() {
    if (!C.cloudflare || /^(localhost|127\.|\[::1\])/.test(location.hostname)) return;
    var s = d.createElement("script");
    s.defer = true; s.src = "https://static.cloudflareinsights.com/beacon.min.js";
    s.setAttribute("data-cf-beacon", JSON.stringify({ token: C.cloudflare }));
    d.head.appendChild(s);
  }

  function arrancar() {
    marco();
    conectarWA();
    acordeones();
    $$(".riel").forEach(arrastre);
    formularioPedido();
    cursor();
    revision();
    estados();
    inclinar();
    imanes();
    progreso();

    if (raiz.classList.contains("con-telon") && !QUIETO) telonHasta = Date.now() + 900;

    var g = $("#mosaico"); if (g && !g.children.length) g.innerHTML = '<div class="pieza pieza--ancha esqueleto" style="--col:7"></div><div class="pieza pieza--par esqueleto" style="--col:5"></div>';
    var c = $("#catalogo"); if (c && !c.children.length) c.innerHTML = '<div class="grilla" style="padding-top:2rem">' + esqueletos(6) + '</div>';

    if (PAGINA === "catalogo") {
      var e = parametro("estado"), cat = parametro("cat");
      if (e === "disponible" || e === "pedido") filtro.estado = e;
      if (CATEGORIAS[cat]) filtro.cat = cat;
      filtro.q = parametro("q");
    }
    Catalogo.listo(function (todo) {
      if (PAGINA === "inicio") inicio(todo);
      if (PAGINA === "catalogo") catalogo(todo);
      if (PAGINA === "producto") producto(todo);
      if (PAGINA === "a-pedido") aPedido(todo);
    });
    iniciarCatalogo();

    mirar(d);   /* con el telón de entrada, espera sola a que se levante */
    setTimeout(function () { raiz.classList.remove("con-telon"); }, 2300);
    analitica();
    window.ZENVO = Catalogo;
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", arrancar); else arrancar();
})();
