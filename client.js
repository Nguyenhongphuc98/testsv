const http2 = require('http2');
// const client = http2.connect('http://localhost:8080');
const client = http2.connect('http://0.0.0.0:8080/');
for (let i = 0; i < 10; i++) {
	setTimeout(() => {
		
		console.log('req', i);
		const req = client.request({ ':path': '/hehe' });
		req.on('response', (headers) => {
			req.on('data', chunk => process.stdout.write(chunk));
			req.on('end', () => console.log('\n---'));
		});
		req.end();
	}, 1000 * i);
}

setInterval(() => {
	// do nothing
}, 1000);