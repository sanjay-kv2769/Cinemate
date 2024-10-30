const http = require('http');
const fs = require('fs');

const html = fs.readFileSync('./Template/index.html', 'utf-8');

const server = http.createServer((request, response) => {
  const path = request.url;
  if (path === '/') {
    response.writeHead(200, {
      //   'Content-Type': 'application/json',

      'Content-Type': 'text/html',
      'my-header': 'hello worldddddd!',
    });
    response.end(html.replace('%CONTENT%', 'to home pageeeee!'));
  } else if (path === '/about') {
    response.writeHead(200, {
      'Content-Type': 'text/html',
      'my-header': 'hello worldddddd!',
    });
    response.end(html.replace('%CONTENT%', 'to about pageeeee!'));
  } else {
    response.writeHead(404, {
      'Content-Type': 'text/html',
      'my-header': 'hello worldddddd!',
    });
    response.end('Error 404: Page Not Found');
  }
});

server.listen(8080, () => {
  console.log('Server is running on port: http://localhost:8080');
});
