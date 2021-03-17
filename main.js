const http = require('http')

const service = http.createServer((request, response) => {
    notFound(response);
});

const internalServerError = (error, response) => {
    response.statusCode = 500;
    response.write(JSON.stringify(error));
    response.end();
}

const notFound = (response) => {
    response.statusCode = 404
    response.write(`Sorry! I don't understand`);
    response.end();
};

service.listen(3000);
console.log('Service listening on port 3000');
