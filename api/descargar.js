export const config = {
  runtime: 'edge',
};

const PLAY_STORE = 'https://play.google.com/store/apps/details?id=com.nedsystem.movil';
const APP_STORE  = 'https://apps.apple.com/app/nedleal/id6760373778';

export default function handler(req) {
  const ua = req.headers.get('user-agent') || '';

  // 1. Redirección automática en Android
  if (/android/i.test(ua)) {
    return Response.redirect(PLAY_STORE, 307);
  }

  // 2. Redirección automática en iOS (iPhone / iPad)
  if (/iphone|ipad|ipod/i.test(ua)) {
    return Response.redirect(APP_STORE, 307);
  }

  // 3. Fallback visual para escritorio (PC, Mac, Linux)
  const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Descargar NED Leal</title>
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
      max-width: 380px;
      width: 100%;
    }
    h1 { font-size: 1.5rem; margin: 0 0 0.5rem; }
    p { color: #64748b; font-size: 0.95rem; margin-bottom: 1.8rem; }
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
    <p>Abre la tienda correspondiente a tu dispositivo móvil:</p>
    <a class="btn" href="${PLAY_STORE}">Google Play Store (Android)</a>
    <a class="btn" href="${APP_STORE}">Apple App Store (iOS)</a>
  </div>
</body>
</html>`;

  return new Response(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}