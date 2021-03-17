const http = require('http');
const { readFile } = require('fs');

const service = http.createServer((request, response) => {
    let [ path, queryString ] = request.url.split('?');
    if (!queryString) queryString = ''
    switch (path) {
        case '/source':
            getSource(response);
            break;
        case '/hello':
            getHello(parseQueryParams(queryString), response);
            break;
        default:
            notFound(response);
            break;
    }
});

const parseQueryParams = (queryString) => {
    return queryString.split('&').reduce((accumulator, queryParameterString) => {
        const [key, value] = queryParameterString.split('=');
        accumulator[key] = value;
        return accumulator;
    }, {})
}

const getHello = (query, response) => {
    if (!query.hasOwnProperty('name')) {
        query.name = 'World';
    }
    response.write(`<h1>Hello, ${query.name}</h1>`);
    response.end();
}

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
