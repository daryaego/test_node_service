const { readFile, readdir } = require('fs');

function sayHelloTo(user) {
    return `<h1>Hello, ${user}</h1>`
}

function sortArray(array) {
    return array.map(item => parseFloat(item)).filter(item => !isNaN(item)).sort((a, b) => a - b);
}

function getOddNumbersSum(array) {
    return array.map(item => parseFloat(item)).filter(item => !isNaN(item) && item % 2 === 1)
        .reduce((accumulator, item) => accumulator += item, 0);
}

function getSourceFiles(path) {
    return new Promise((resolve, reject) => {
        return readdir(path, (error, result) => {
            if (error) {
                reject(error);
            }
            result = result.filter(name => {
                const extension = name.split('.').pop()
                return extension === 'js' || extension === 'json' && name !== `package-lock.json`
            }).map(name => `${path}${name}`)
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
    const files = (await getSourceFiles('./')).concat(await getSourceFiles('./src/'))
    return (await Promise.all(files.map(file => {
        return getFileText(file);
    }))).join('\n');
}

module.exports = { sayHelloTo, sortArray, getOddNumbersSum, getSourceText };