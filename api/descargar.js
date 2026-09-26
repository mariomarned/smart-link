export const config = {
  runtime: 'edge',
};

const PLAY_STORE = 'https://play.google.com/store/apps/details?id=com.nedsystem.movil';
const APP_STORE  = 'https://apps.apple.com/app/nedleal/id6760373778';

export default function handler(req) {
  const ua = req.headers.get('user-agent') || '';
  const url = new URL(req.url);

  // URL absoluta para la imagen de vista previa (public/preview.png)
  const previewImage = `${url.origin}/preview.png`;

  // Título y textos para la tarjeta de WhatsApp y redes
  const meta = {
    title: 'Descarga NED Leal | Acumula y redime tus puntos',
    description: 'Descarga la app en Android o iOS, apoya el comercio de tu barrio y disfruta de recompensas exclusivas.',
    url: req.url,
  };

  // Plantilla HTML con etiquetas Open Graph y Twitter Cards
  const renderHtml = () => `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${meta.title}</title>
  
  <!-- Metadatos Open Graph (WhatsApp, Facebook, Telegram, LinkedIn) -->
  <meta property="og:type" content="website">
  <meta property="og:title" content="${meta.title}">
  <meta property="og:description" content="${meta.description}">
  <meta property="og:image" content="${previewImage}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:url" content="${meta.url}">
  <meta property="og:site_name" content="NED Leal">

  <!-- Metadatos Twitter / X -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${meta.title}">
  <meta name="twitter:description" content="${meta.description}">
  <meta name="twitter:image" content="${previewImage}">

  <style>
    * { box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      display: grid;
      place-content: center;
      min-height: 90vh;
      margin: 0;
      background: #f8fafc;
      color: #0f172a;
      text-align: center;
      padding: 20px;
    }
    .card {
      background: #ffffff;
      padding: 2.5rem 2rem;
      border-radius: 16px;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05);
      max-width: 400px;
      width: 100%;
    }
    h1 { font-size: 1.4rem; margin: 0 0 0.5rem; }
    p { color: #64748b; font-size: 0.95rem; margin-bottom: 1.8rem; line-height: 1.4; }
    .btn {
      display: block;
      margin: 10px 0;
      padding: 14px;
      background: #0f172a;
      color: #ffffff;
      text-decoration: none;
      border-radius: 10px;
      font-weight: 600;
      font-size: 0.95rem;
      transition: background 0.2s ease;
    }
    .btn:hover { background: #334155; }
  </style>
</head>
<body>
  <div class="card">
    <h1>Descarga NED Leal</h1>
    <p>Selecciona la tienda correspondiente a tu dispositivo móvil:</p>
    <a class="btn" href="${PLAY_STORE}">Google Play Store (Android)</a>
    <a class="btn" href="${APP_STORE}">Apple App Store (iOS)</a>
  </div>
</body>
</html>`;

  // 1. Detectar si la petición proviene de un rastreador/bot de redes sociales
  const isSocialBot = /whatsapp|facebookexternalhit|facebot|twitterbot|telegrambot|slackbot|linkedinbot|discordbot|google-metatags/i.test(ua);

  if (isSocialBot) {
    // Si es un bot, devolvemos el HTML con los metadatos para generar la tarjeta
    return new Response(renderHtml(), {
      status: 200,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  }

  // 2. Redirección para usuarios reales en Android
  if (/android/i.test(ua)) {
    return Response.redirect(PLAY_STORE, 307);
  }

  // 3. Redirección para usuarios reales en iOS
  if (/iphone|ipad|ipod/i.test(ua)) {
    return Response.redirect(APP_STORE, 307);
  }

  // 4. Si entran desde PC/Mac, mostrar la pantalla de selección con la tarjeta web
  return new Response(renderHtml(), {
    status: 200,
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}