const knex = require('knex')
const app = require('../src/app')
const supertest = require('supertest')

const testFolders = [
    {
        id: 1,
        title: 'Test folder1'
    }
]

describe('/folders', () => {
    let db;

    before('setup db', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DB_URL,
          })
          app.set('db', db)
    });

    const cleanDb = () => db.raw(`TRUNCATE folders RESTART IDENTITY CASCADE;`);
    before('clean db', cleanDb);
    afterEach('clean db', cleanDb);
    after('end conn', () => db.destroy());
})

