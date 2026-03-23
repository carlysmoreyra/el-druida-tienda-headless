export default async function handler(req, res) {
  // Habilitar CORS para asegurarnos de que el frontend pueda leer los datos
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const STORE_ID = process.env.TIENDA_NUBE_STORE_ID;
    const ACCESS_TOKEN = process.env.TIENDA_NUBE_ACCESS_TOKEN;

    if (!STORE_ID || !ACCESS_TOKEN) {
      return res.status(200).json({ 
        warning: 'Faltan credenciales en Vercel (Environment Variables)',
        mockRequired: true 
      });
    }

    const TIENDA_NUBE_API = `https://api.tiendanube.com/v1/${STORE_ID}`;

    const response = await fetch(`${TIENDA_NUBE_API}/products`, {
      method: 'GET',
      headers: {
        'Authentication': `bearer ${ACCESS_TOKEN}`,
        'User-Agent': 'ElDruidaStoreHeadless (tudominio@ejemplo.com)'
      }
    });

    if (!response.ok) {
      throw new Error(`Error de Tienda Nube: ${response.statusText}`);
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error al conectar con Tienda Nube:', error);
    res.status(500).json({ error: 'Error del servidor Vercel' });
  }
}
