/* =========================================================
   ZENVO · Configuración del sitio
   Es el único archivo que hace falta tocar para conectar la
   planilla o cambiar los datos de contacto.
   ========================================================= */
window.ZENVO_CONFIG = {

  /* 1. LA PLANILLA
     Pegá acá el enlace de tu planilla de Google (entre las comillas).
     Sirve el enlace de "Publicar en la web → CSV" o el enlace común
     de la planilla si está compartida como "cualquiera con el enlace".
     Mientras esté vacío, el sitio usa la copia local: data/catalogo.csv */
  planilla: "",

  /* 2. WHATSAPP
     El enlace corto abre el chat. Si además cargás el número
     (con código de país, sin + ni espacios: 5959XXXXXXXX), el mensaje
     llega ya escrito con el equipo que la persona estaba mirando. */
  whatsappEnlace: "https://wa.me/message/NHKRSJO43PKEA1",
  whatsappNumero: "595984404412",   // 0984 404 412

  /* 3. REDES */
  instagram: "https://instagram.com/zenvo.py",
  instagramUsuario: "@zenvo.py",

  /* 4. CONDICIONES DE LOS PEDIDOS (se muestran en las fichas "A pedido") */
  pedidoPlazo: "8 a 15 días",
  pedidoSena: "50 %",

  /* 5. ANALÍTICA (opcional). Token de Cloudflare Web Analytics. Vacío = apagada. */
  cloudflare: ""
};
