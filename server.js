// Thank ChatGPT for this code, because I am *that* bad when it comes to Javascript
const http = require('http');

const MAX_REQUEST_SIZE = 512 * 1024; // 512KB in bytes

http.createServer((request, response) => {
  if (request.method === 'POST') {
    let body = '';
    let receivedDataSize = 0;

    request.on('data', chunk => {
      // Check if the size exceeds the limit
      if (receivedDataSize + chunk.length > MAX_REQUEST_SIZE) {
        response.writeHead(413, { 'Content-Type': 'text/plain' }); // 413 Payload Too Large
        response.end('Payload Too Large: Maximum size is 512KB\n');
        request.connection.destroy(); // Close the connection
        return;
      }

      body += chunk;
      receivedDataSize += chunk.length;
    });

    request.on('end', () => {
      try {
        const data = JSON.parse(body);
        console.log(data);

        // Respond to the client
        response.writeHead(200, { 'Content-Type': 'text/plain' });
        response.end('Data received successfully\n');
      } catch (error) {
        console.error('Error parsing JSON:', error);

        // Respond with an error to the client
        response.writeHead(400, { 'Content-Type': 'text/plain' });
        response.end('Bad Request: Invalid JSON\n');
      }
    });
  } else {
    // Respond with a 405 Method Not Allowed for non-POST requests
    response.writeHead(405, { 'Content-Type': 'text/plain' });
    response.end('Method Not Allowed\n');
  }
}).listen(8080);

