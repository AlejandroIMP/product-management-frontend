import { pipeline } from 'stream/promises';
import { Readable } from 'stream';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  const targetUrl = `${process.env.VITE_API_URL}${req.url.replace('/api/proxy', '')}`;

  try {
   
    // Preparar headers
    const headers = {};
    
    // Copiar solo headers necesarios
    const allowedHeaders = [
      'content-type',
      'content-length',
      'authorization',
      'accept',
      'user-agent'
    ];

    allowedHeaders.forEach(header => {
      if (req.headers[header]) {
        headers[header] = req.headers[header];
      }
    });

    let body;

    if (req.method !== 'GET' && req.method !== 'HEAD') {
      
      
      // Convertir request a buffer de manera segura
      const bodyBuffer = await new Promise((resolve, reject) => {
        const chunks = [];
        
        req.on('data', chunk => chunks.push(chunk));
        req.on('end', () => resolve(Buffer.concat(chunks)));
        req.on('error', reject);
      });
      
      body = bodyBuffer;
      
    }

    const response = await fetch(targetUrl, {
      method: req.method,
      headers,
      ...(body && { body })
    });

    

    // Forward response
    res.status(response.status);

    // Copy response headers
    response.headers.forEach((value, key) => {
      res.setHeader(key, value);
    });

    // Stream response body
    if (response.body) {
      const reader = response.body.getReader();
      
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          res.write(Buffer.from(value));
        }
        res.end();
      } finally {
        reader.releaseLock();
      }
    } else {
      res.end();
    }

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}