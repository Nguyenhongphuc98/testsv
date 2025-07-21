const http2 = require('http2');
const fs = require('fs');
const path = require('path');

const activeSessions = new Set();

const server = http2.createServer();

server.on('session', (session) => {
  const socket = session.socket;
  const socketId = socket.remoteAddress + ':' + socket.remotePort;

  console.log('New connection', socketId);
  session.on('close', () => {
      activeSessions.delete(session);
      console.log('❌ Session closed:', socketId);
    });
});

server.on('stream', (stream, headers) => {
  const method = headers[':method'];
  const pathName = headers[':path'];
  console.log(`📥 New ${method} request on ${pathName}`);

  if (method === 'GET' && pathName === '/') {
    const filePath = path.join(__dirname, 'main.html');
    fs.readFile(filePath, (err, data) => {
      if (err) {
        stream.respond({ ':status': 500 });
        stream.end('Internal Server Error');
        return;
      }
      stream.respond({
        'content-type': 'text/html',
        ':status': 200
      });
      stream.end(data);
    });
  } else if (method === 'GET') {
    stream.respond({
      'content-type': 'text/plain',
      ':status': 200
    });
    stream.end(`✅ You sent a GET request to ${pathName}`);
  } else {
    stream.respond({ ':status': 405 });
    stream.end('❌ Method not allowed');
  }
});

const port = process.env.PORT || 8080;
server.listen(port, '0.0.0.0', () => {
  console.log('HTTP/2 server (HTTPS) listening on 0.0.0.0:' + port);
});