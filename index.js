const http2 = require('http2');
const fs = require('fs');
const path = require('path');

const server = http2.createServer((req, res) => {

});

// Lắng nghe khi có kết nối mới
server.on('session', (session) => {
  console.log('🆕 New connection');

  session.on('close', () => {
    console.log('❌ Session closed');
  });
});

// Lắng nghe các stream (yêu cầu mới)
server.on('stream', (stream, headers) => {
  const method = headers[':method'];
  const pathName = headers[':path'];
  console.log(`📥 New ${method} request on ${pathName}`);

  if (method === 'GET' && pathName === '/') {
    returnIndexPage(stream);
  } else if (method === 'GET') {
    handleGetReq(stream);
  } else {
    // Phản hồi cho các phương thức khác
    stream.respond({ ':status': 405 });
    stream.end('❌ Method not allowed');
  }
});

// Giữ kết nối 15 giây nếu không có yêu cầu
// server.setTimeout(15000);

server.listen(8080, () => {
  console.log('HTTP/2 server listening on 8080');
});


function returnIndexPage(stream) {
	// Serve id.html for GET /
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
}

function handleGetReq(stream) {
	// Trả về phản hồi cho GET
    stream.respond({
      'content-type': 'text/plain',
      ':status': 200
    });
    stream.end(`✅ You sent a GET request to ${pathName}`);
}