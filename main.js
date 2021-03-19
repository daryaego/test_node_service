const http = require('http');
const { readFile } = require('fs');

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

postArray = (query, response) => {
     response.write(JSON.stringify(query.x.sort((a, b) => a - b)));
     response.end();
}

const postSum = (query, response) => {
    const result = query.x
        .filter(item => typeof item === 'number' && item % 2 === 1)
        .reduce((accumulator, item) => accumulator += item, 0);
    response.write(JSON.stringify(result));
    response.end();
}

const getAdmin = (authorization, response) => {
    response.write(`<h1>Hello, ${authorization}</h1>`);
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
