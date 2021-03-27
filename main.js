const http = require('http');
const { readFile } = require('fs');
const { sayHelloTo } = require('./data-provider.js');
const { responseString, responseJson, badRequest, forbidden, internalServerError, notFound } = require('./response.js')

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
        case '/sort':
            if (method === 'POST') {
                postSort(parseQueryParams(queryString), response);
                break;
            }
        default:
            notFound(response);
            break;
    }
});

const postSort = (query, response) => {
    if (!Array.isArray(query.x)) {
        return badRequest(response, `'x' expected to be an instance of array`);
    }
    responseJson(response, query.x.sort((a, b) => a - b))
}

const postSum = (query, response) => {
    if (!Array.isArray(query.x)) {
        return badRequest(response, `'x' expected to be an instance of array`);
    }
    const result = query.x
        .filter(item => typeof item === 'number' && item % 2 === 1)
        .reduce((accumulator, item) => accumulator += item, 0);
    responseJson(response, result);
}

const getAdmin = (authorization, response) => {
    responseString(response, sayHelloTo(authorization));
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
    responseString(response, sayHelloTo(query.name));
}

const getSource = (response) => {
    readFile('./main.js', 'utf8', (err, data) => {
        if (!err) {
            responseString(response, data);
        } else {
            internalServerError(response, err);
        }
    })
}

service.listen(3000);
console.log('Service listening on port 3000');

module.exports = service;
