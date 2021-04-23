const request = require('supertest');
const app = require('../src/main');

describe('GET /hello', function() {
    it(`returns 'Hello, World'`, function() {
      return request(app)
        .get('/hello')
        .expect(200)
        .expect('<h1>Hello, World</h1>')
        // .expect('Content-Type',/json/)
        // .expect('{"text":"some json"}')
    })

    it(`returns 'Hello, username'`, function() {
      const username = 'test'
      return request(app)
        .get('/hello')
        .query({name: username})
        .expect(200)
        .expect(`<h1>Hello, ${username}</h1>`)
        // .expect('Content-Type',/json/)
        // .expect('{"text":"some json"}')
    })
  })

describe('GET /admin', () => {
  it(`return 403 when Authorization is omitted`, () => {
    return request(app)
      .get('/admin')
      .expect(403);
  });

  it(`return greetings when Authorization=test`, () => {
    return request(app)
      .get('/admin')
      .set('Authorization', 'test')
      .expect(200)
      .expect('<h1>Hello, test</h1>');
  })
})

describe('GET /source', () => {
  it('returns string', () => {
    return request(app)
    .get('/source')
    .expect(200)
    .expect(res => {
      if (typeof res === String) {
        done()
      }
    })
  });

  it('returns 200 with random query params', () => {
    return request(app)
    .get('/source?sm_7th=6')
    .expect(200)
  })
});

const array = [1, 2, 3, 9, 8, 7, 6, 5, 'test']
describe('POST /sum', () => {
  it('returns 200 and odd numbers sum', () => {
    return request(app)
    .post(`/sum?x=${array.join(',')}`)
    .expect(200)
    .expect(JSON.stringify({ result: array.filter(value => value%2).reduce((acc, value) => acc + value, 0) }))
  })

  it('returns 400 when x is not valid', () => {
    return request(app)
    .post(`/sum?x=kdjfghk`)
    .expect(400)
  })
});

describe('POST /sort', () => {
  it('returns 200 when x is valid', () => {
    array.pop()
    return request(app)
    .post(`/sort?x=${array}`)
    .expect(200)
    .expect(JSON.stringify({ result: array.sort((a, b) => a - b) }))
  })

  it('returns 400 when x is not valid', () => {
    return request(app)
    .post(`/sort?x=kdjfghk`)
    .expect(400)
  })
});
