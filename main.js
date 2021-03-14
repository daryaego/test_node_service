const http = require('http')

const service = http.createServer((request, response) => {
    notFound(response);
});

const notFound = (response) => {
    response.statusCode = 404
    response.write(`Sorry! I don't understand`);
    response.end();
};

service.listen(3000);
console.log('Service listening on port 3000');
