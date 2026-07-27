const http = require('http');

http.get('http://localhost:5000/api/health', (res) => {
  console.log(`Backend is up. Status: ${res.statusCode}`);
}).on('error', (e) => {
  console.error(`Backend is DOWN. Error: ${e.message}`);
});
