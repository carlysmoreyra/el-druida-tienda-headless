import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Cargar variables de entorno desde el archivo .env
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

// Endpoint protegido para obtener productos de Tienda Nube
app.get('/api/products', async (req, res) => {
  try {
    const STORE_ID = process.env.TIENDA_NUBE_STORE_ID;
    const ACCESS_TOKEN = process.env.TIENDA_NUBE_ACCESS_TOKEN;

    // Si aún no has puesto tus claves en el archivo .env, avisa al frontend
    if (!STORE_ID || !ACCESS_TOKEN) {
      return res.status(200).json({ 
        warning: 'Faltan credenciales en el .env',
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
    res.status(500).json({ error: 'Error del servidor backend' });
  }
});

// Automatización para obtener el token final fácilmente
app.get('/auth', async (req, res) => {
  const code = req.query.code;
  if (!code) return res.send("Falta el código de autorización.");
  
  try {
    const tokenResponse = await fetch('https://www.tiendanube.com/apps/authorize/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: process.env.TIENDA_NUBE_APP_ID,
        client_secret: process.env.TIENDA_NUBE_CLIENT_SECRET,
        grant_type: 'authorization_code',
        code: code
      })
    });
    
    const data = await tokenResponse.json();
    if (data.access_token) {
      console.log("\n=============================================");
      console.log("🏆 ¡ÉXITO! CÓPIA ESTOS DATOS Y PÉGALOS EN TU .env");
      console.log("TIENDA_NUBE_STORE_ID=" + data.user_id);
      console.log("TIENDA_NUBE_ACCESS_TOKEN=" + data.access_token);
      console.log("=============================================\n");
      res.send(`<h1>¡Conexión del Druida Exitosa! 🌿</h1><p>Vuelve a tu terminal y revisa los códigos que se acaban de generar para copiarlos al archivo .env.</p>`);
    } else {
      res.send(`Error en Tienda Nube: ${JSON.stringify(data)}`);
    }
  } catch (err) {
    res.send("Hubo un error crítico: " + err.message);
  }
});

app.listen(PORT, () => {
  console.log(`🛡️ Backend del Druida corriendo en http://localhost:${PORT}`);
  if (!process.env.TIENDA_NUBE_STORE_ID) {
    console.log(`⚠️ ATENCIÓN: Falta configurar el archivo .env con tus credenciales.`);
  } else {
    console.log(`✅ Conectado al Store ID: ${process.env.TIENDA_NUBE_STORE_ID}`);
  }
});
