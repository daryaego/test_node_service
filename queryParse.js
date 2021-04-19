const tryParse = (value) => {
    try {
        return JSON.parse(value);
    } catch (error) {
        const array = value.split(',');
        if (array.length > 1) value = array;
        return value;
    }
}

const parseQueryParams = (queryString) => {
    return queryString.split('&').reduce((accumulator, queryParameterString) => {
        let [key, value] = queryParameterString.split('=');
        if (key === '') return accumulator
        value = tryParse(value)
        if (Object.hasOwnProperty.call(accumulator, key)) {
            if (Array.isArray(accumulator[key])) {
                accumulator[key].push(value)
            } else {
                accumulator[key] = [accumulator[key], value]
            }
        } else {
            accumulator[key] = value
        }
        return accumulator;
    }, {})
}

module.exports = { parseQueryParams }