

export default async function handler(req, res) {
  const targetUrl = `${process.env.VITE_API_URL}${req.url.replace('/api/proxy', '')}`;

  try {
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        ...req.headers,
      },
      body: req.method !== 'GET' ? JSON.stringify(req.body) : undefined,
    });

    const data = await response.text(); // usa .text() para manejar JSON o HTML
    res.status(response.status).send(data);
  } catch (error) {
    res.status(500).json({ error: 'Error al conectar con la API de Somee', detalle: error.message });
  }
}