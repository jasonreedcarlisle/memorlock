#!/usr/bin/env node

/**
 * Memorlock - Daily Memory Challenge Game
 * Simple HTTP server to serve the game
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3001;
const NODE_ENV = process.env.NODE_ENV || 'development';

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.wav': 'audio/wav',
  '.mp4': 'video/mp4',
  '.woff': 'application/font-woff',
  '.ttf': 'application/font-ttf',
  '.eot': 'application/vnd.ms-fontobject',
  '.otf': 'application/font-otf',
  '.wasm': 'application/wasm'
};

const server = http.createServer((req, res) => {
  console.log(`${req.method} ${req.url}`);

  // Parse URL - serve from the directory where this script is located
  const scriptDir = __dirname;
  let filePath = req.url;
  
  // Handle root path
  if (filePath === '/' || filePath === '') {
    filePath = 'index.html';
  } else {
    // Remove leading slash
    filePath = filePath.startsWith('/') ? filePath.substring(1) : filePath;
  }
  
  // Join with script directory
  filePath = path.join(scriptDir, filePath);
  
  // Normalize the path to prevent directory traversal
  filePath = path.normalize(filePath);
  
  // Security check: ensure the resolved path is within scriptDir
  if (!filePath.startsWith(scriptDir)) {
    res.writeHead(403, { 'Content-Type': 'text/html' });
    res.end('<h1>403 - Forbidden</h1>', 'utf-8');
    return;
  }

  const extname = String(path.extname(filePath)).toLowerCase();
  const contentType = mimeTypes[extname] || 'application/octet-stream';

  // Security headers
  const securityHeaders = {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin'
  };

  // Add HSTS header in production
  if (NODE_ENV === 'production') {
    securityHeaders['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains';
  }

  // Content Security Policy
  securityHeaders['Content-Security-Policy'] = "default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://www.google-analytics.com;";

  fs.readFile(filePath, (error, content) => {
    if (error) {
      console.error(`Error reading file: ${filePath}`, error);
      if (error.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/html', ...securityHeaders });
        res.end(`<h1>404 - File Not Found</h1><p>Requested: ${req.url}</p><p>Resolved to: ${filePath}</p>`, 'utf-8');
      } else {
        res.writeHead(500, { 'Content-Type': 'text/html', ...securityHeaders });
        res.end(`Server Error: ${error.code}`, 'utf-8');
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType, ...securityHeaders });
      res.end(content, 'utf-8');
    }
  });
});

server.listen(PORT, () => {
  console.log(`\n🎮 Memorlock - Daily Memory Challenge`);
  console.log(`📡 Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${NODE_ENV}`);
  if (NODE_ENV === 'development') {
    console.log(`\nOpen your browser and navigate to http://localhost:${PORT} to play!\n`);
  } else {
    console.log(`\nServer is ready to serve requests!\n`);
  }
});
