export default async function handler(req, res) {
  const targetUrl = `${process.env.VITE_API_URL}${req.url.replace('/api/proxy', '')}`;

  try {
    // Crear headers limpios
    const forwardHeaders = {};
    
    // Solo copiar headers necesarios
    if (req.headers.authorization) {
      forwardHeaders.authorization = req.headers.authorization;
    }
    
    if (req.headers['content-type'] && !req.headers['content-type'].includes('multipart/form-data')) {
      forwardHeaders['content-type'] = req.headers['content-type'];
    }

    // Configurar request
    const fetchOptions = {
      method: req.method,
      headers: forwardHeaders,
    };

    // Añadir body si no es GET
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      if (req.headers['content-type']?.includes('application/json')) {
        fetchOptions.body = JSON.stringify(req.body);
      } else {
        // Para FormData y otros, dejar que Vercel lo maneje
        fetchOptions.body = req;
      }
    }

    const response = await fetch(targetUrl, fetchOptions);
    
    const contentType = response.headers.get('content-type');
    if (contentType) {
      res.setHeader('Content-Type', contentType);
    }
    
    if (contentType?.includes('application/json')) {
      const data = await response.json();
      return res.status(response.status).json(data);
    }
    
    const data = await response.text();
    res.status(response.status).send(data);

  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ 
      error: 'Error de conexión con API',
      message: error.message 
    });
  }
}