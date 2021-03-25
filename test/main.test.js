const request = require('supertest');
const app = require('../main');

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

