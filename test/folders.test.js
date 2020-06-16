const knex = require('knex')
const app = require('../src/app')
const supertest = require('supertest')
const { expect } = require('chai')

const testFolders = [
    {
        id: 1,
        title: 'Test folder1'
    }
]

describe('/folders endpoints', () => {
    let db;

    before('setup db', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DATABASE_URL,
          })
          app.set('db', db)
    });


    //h
    const cleanDb = () => db.raw(`TRUNCATE folders RESTART IDENTITY CASCADE;`);
    before('clean db', cleanDb);
    afterEach('clean db', cleanDb);
    after('end conn', () => db.destroy());

    
     describe('GET /folders/:folderid',()=>{
         context('getting a specific folder',()=>{
             beforeEach('insert folder',()=>{
                 return db
                    .into('folders')
                    .insert(testFolders[0])
             })
             it('respond with a 200 and specified folder',()=>{
                 const folderID = 1;
                 const expectedFolder = testFolders[folderID -1];
                 return supertest(app)
                    .get(`/folders/${folderID}`)
                    .expect(200,expectedFolder)
                    
             })
         })
     })

     describe('GET /folders',()=>{
        context('getting all folder',()=>{
            beforeEach('insert folder',()=>{
                return db
                   .into('folders')
                   .insert(testFolders[0])
            })
            it('respond with a 200 and all folders',()=>{
                return supertest(app)
                   .get(`/folders`)
                   .expect(200,testFolders)
                   
            })
        })
    })

     describe('POST /folders',()=>{
        context('Given the folders',()=>{
            it('adds a folder to the database',()=>{

                return supertest(app)
                    .post('/folders')
                    .send(testFolders[0])
                    .expect(201)
                    .expect(res=>{
                        expect(res.body.title).to.eql(testFolders[0].title)
                    })
                    .then(postresponse=>
                            supertest(app)
                                .get(`/folders/${postresponse.body.id}`)
                                .expect(postresponse.body)
                        )
            })
            it(`response with 400`,()=>{
                delete testFolders[0].title;
                return supertest(app)
                    .post('/folders')
                    .send(testFolders[0])
                    .expect(400,{
                        error:{message:`Missing 'title' in request body`}
                        
                    })
            })
        })
     } )
})

