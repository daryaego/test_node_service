const { readFile, readdir } = require('fs');

function sayHelloTo(user) {
    return `<h1>Hello, ${user}</h1>`
}

function sortArray(array) {
    return array.sort((a, b) => a - b);
}

function getOddNumbersSum(array) {
    return array.filter(item => typeof item === 'number' && item % 2 === 1)
        .reduce((accumulator, item) => accumulator += item, 0);
}

function getSourceFiles(path) {
    return new Promise((resolve, reject) => {
        return readdir(path, (error, result) => {
            if (error) {
                reject(error);
            }
            result = result.filter(name => name.split('.').pop() === 'js')
            resolve(result);
        })
    })
}

function getFileText(file) {
    return new Promise((resolve, reject) => {
        readFile(file, 'utf8', (error, data) => {
            if (!error) {
                resolve(`${file}:\n${data}`);
            } else {
                reject(error);
            }
        })
    })
}

async function getSourceText() {
    path = './'
    const files = await getSourceFiles(path)
    return (await Promise.all(files.map(file => {
        return getFileText(`${path}/${file}`);
    }))).join('');
}

module.exports = { sayHelloTo, sortArray, getOddNumbersSum, getSourceText };