const http = require('http');
const { readFile } = require('fs');
const { sayHelloTo } = require('./data-provider.js');

const service = http.createServer((request, response) => {
    const { url, method, headers } = request;
    let [ path, queryString ] = url.split('?');
    if (!queryString) queryString = ''
    switch (path) {
        case '/source':
            if (method === 'GET') {
                getSource(response);
                break;
            }
        case '/hello':
            if (method === 'GET') {
                getHello(parseQueryParams(queryString), response);
                break;
            }
        case '/admin':
            if (method === 'GET') {
                if (headers.authorization === 'test') {
                    getAdmin(headers.authorization, response);
                } else {
                    forbidden(response);
                }
                break;
            }
        case '/sum':
            if (method === 'POST') {
                postSum(parseQueryParams(queryString), response);
                break;
            }
        case '/array':
            if (method === 'POST') {
                postArray(parseQueryParams(queryString), response);
                break;
            }
        default:
            notFound(response);
            break;
    }
});

const postArray = (query, response) => {
    if (!Array.isArray(query.x)) {
        return badRequest(`'x' expected to be an instance of array`, response);
    }
    response.write(JSON.stringify(query.x.sort((a, b) => a - b)));
    response.end();
}

const postSum = (query, response) => {
    if (!Array.isArray(query.x)) {
        return badRequest(`'x' expected to be an instance of array`, response);
    }
    const result = query.x
        .filter(item => typeof item === 'number' && item % 2 === 1)
        .reduce((accumulator, item) => accumulator += item, 0);
    response.write(JSON.stringify(result));
    response.end();
}

const getAdmin = (authorization, response) => {
    response.write(sayHelloTo(authorization));
    response.end();
}

const parseQueryParams = (queryString) => {
    return queryString.split('&').reduce((accumulator, queryParameterString) => {
        const [key, value] = queryParameterString.split('=');
        try {
            accumulator[key] = JSON.parse(value);
        } catch (error) {
            accumulator[key] = value;
        }
        return accumulator;
    }, {})
}

const getHello = (query, response) => {
    if (!query.hasOwnProperty('name')) {
        query.name = 'World';
    }
    response.write(sayHelloTo(query.name));
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

const badRequest = (error, response) => {
    response.statusCode = 400;
    response.write(JSON.stringify(error));
    response.end();
}

const forbidden = (response) => {
    response.statusCode = 403;
    response.end();
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

module.exports = service;
