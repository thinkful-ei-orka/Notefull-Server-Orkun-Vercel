const app = require('../src/app');


describe('App module', () => {
    describe('GET /', () => {
        it('should respond 200 and "Hello, world!"', () => {
            return supertest(app)
                .get('/')
                .expect(200, { message: 'Hello, world!' })
        });
    });
});