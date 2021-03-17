const http = require('http');
const { readFile } = require('fs');

const service = http.createServer((request, response) => {
    const [ path, queryString ] = request.url.split('?')
    switch (path) {
        case '/source':
            getSource(response);
            break;
        default:
            notFound(response);
            break;
    }
});

const getSource = (response) => {
    readFile('./main.js', 'utf8', (err, data) => {
        if (!err) {
            response.write(data);
            response.end();
        } else {
            internalServerError(err, response);
        }
    })
}

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
