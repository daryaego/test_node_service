function responseString(response, answer, statusCode = 200) {
    response.statusCode = statusCode;
    if (answer) { response.write(answer); }
    response.end();
};

function responseJson(response, json, statusCode = 200) {
    responseString(response, JSON.stringify(json), statusCode);
};

function badRequest (response, error) {
    responseJson(response, error, 400);
};

function forbidden (response) {
    responseString(response, null, 403);
};

function internalServerError (response, error) {
    responseJson(response, error, 500);
};

function notFound (response) {
    responseString(response, `Sorry! I don't understand`, 404);
};

module.exports = {
    responseString,
    responseJson,
    badRequest,
    forbidden,
    internalServerError,
    notFound
}