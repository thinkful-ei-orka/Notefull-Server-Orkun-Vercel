const knex = require('knex')
const app = require('../src/app')
const supertest = require('supertest')
const { expect } = require('chai')

const testFolders = [
    {
        id: 1,
        title: 'Test folder1'
    },
    {
        id: 2,
        title: 'Test folder2'
    },
    {
        id: 3,
        title: 'Test folder3'
    }
]


const testnotes = [
    {
        id: 1,
        title: 'Test note1',
        content: 'lorem ipsum 1',
        folderid: 1
    },
    {
        id: 2,
        title: 'Test note2',
        content: 'lorem ipsum 1',
        folderid: 3
    },
    {
        id: 3,
        title: 'Test note3',
        content: 'lorem ipsum 1',
        folderid: 2
    }
]

describe('/notes endpoints', () => {
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

    
     describe('GET /notes/:noteid',()=>{
         context('getting a specific note',()=>{
            beforeEach('insert notes',()=>{
                console.log(testFolders[0]);
                return db
                   .into('folders')
                   .insert(testFolders[0])
            })
             beforeEach('insert notes',()=>{
                 console.log(testnotes[0]);
                 return db
                    .into('notes')
                    .insert(testnotes[0])
             })
             it('respond with a 200 and specified note',()=>{
                 const noteID = 1;
                 const expectedNote = testnotes[noteID-1];
                 return supertest(app)
                    .get(`/notes/${noteID}`)
                    .expect(200)
                    .expect(res=>{
                        expect(res.body.id).to.eql(expectedNote.id);
                        expect(res.body.title).to.eql(expectedNote.title);
                        expect(res.body.content).to.eql(expectedNote.content)
                    })
                    
             })
         })
     })

     describe('GET /notes',()=>{
        context('getting all notes',()=>{
            let testNotes = [
                {
                    id: 1,
                    title: 'Test note1',
                    content: 'lorem ipsum 1',
                    folderid: 1,
                    modified: new Date()
                }
            ];
            beforeEach('insert notes',()=>{
                console.log(testFolders[0]);
                return db
                   .into('folders')
                   .insert(testFolders)
            })
            beforeEach('insert notes',()=>{
                return db
                   .into('notes')
                   .insert(testNotes)
            })
            it('respond with a 200 and all notes',()=>{
                return supertest(app)
                   .get(`/notes`)
                   .expect(200)
                   .expect(res=>{
                       console.log(res.body);

                        const actual = new Intl.DateTimeFormat('en-US').format(new Date(res.body[0].modified));
                        const expected = new Intl.DateTimeFormat('en-US').format(new Date());
                        console.log(actual);
                        console.log(res.body[0].modified);
                        expect(res.body[0].title).to.eql(testNotes[0].title);
                        expect(res.body[0].content).to.eql(testNotes[0].content);
                        expect(res.body[0].id).to.eql(testNotes[0].id);
                       expect(actual).to.eql(expected)
                   })
                   
            })
        })
    })

    describe.only('DELETE /notes/:noteid',()=>{
        let testNotes = [
            {
                id: 1,
                title: 'Test note1',
                content: 'lorem ipsum 1',
                folderid: 1,
                modified: new Date()
            }
        ];
        beforeEach('insert notes',()=>{
            console.log(testFolders[0]);
            return db
               .into('folders')
               .insert(testFolders)
        })
        beforeEach('insert notes',()=>{
            return db
               .into('notes')
               .insert(testNotes)
        })
        context('',()=>{
            it('responds with 204',()=>{
                const removeID = 1;
                const expectedNote = testNotes.filter(note=>note.id!==removeID); 
                return supertest(app)
                    .delete(`/notes/${removeID}`)
                    .expect(204)
                    .then(res=>{
                        return supertest(app)
                            .get('/notes')
                            .expect(expectedNote)
                    })
            })
        })
    })

     describe('POST /folders',()=>{
        context('Given the folders',()=>{
            it('adds a folder to the database',()=>{

                return supertest(app)
                    .post('/folders')
                    .send(testnotes[0])
                    .expect(201)
                    .expect(res=>{
                        expect(res.body.title).to.eql(testnotes[0].title)
                    })
                    .then(postresponse=>
                            supertest(app)
                                .get(`/folders/${postresponse.body.id}`)
                                .expect(postresponse.body)
                        )
            })
            it(`response with 400`,()=>{
                console.log(testnotes[0]);
                delete testnotes[0].title;
                return supertest(app)
                    .post('/folders')
                    .send(testnotes[0])
                    .expect(400,{
                        error:{message:`Missing 'title' in request body`}
                        
                    })
            })
        })
     } )
})

