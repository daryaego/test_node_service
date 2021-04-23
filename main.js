const http = require('http');
const { sayHelloTo, sortArray, getOddNumbersSum, getSourceText } = require('./data-provider.js');
const { responseString, responseJson, badRequest, forbidden, internalServerError, notFound } = require('./response.js');
const { parseQueryParams } = require('./queryParse')
const port = process.env.PORT || 3000;

const service = http.createServer((request, response) => {
    const { url, method, headers } = request;
    console.log(url)
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
    responseJson(response, { result: sortArray(query.x) })
}

const postSum = (query, response) => {
    if (!Array.isArray(query.x)) {
        return badRequest(response, `'x' expected to be an instance of array`);
    }
    responseJson(response, { result: getOddNumbersSum(query.x) });
}

const getAdmin = (authorization, response) => {
    responseString(response, sayHelloTo(authorization));
}

const getHello = (query, response) => {
    if (!Object.prototype.hasOwnProperty.call(query, 'name')) {
        query.name = 'World';
    }
    responseString(response, sayHelloTo(query.name));
}

const getSource = (response) => {
    getSourceText().then(source => {
        responseString(response, source);
    }).catch(error => {
        internalServerError(response, error);
    });
}

service.listen(port);
console.log(`Service listening on port ${port}`);

module.exports = service;
