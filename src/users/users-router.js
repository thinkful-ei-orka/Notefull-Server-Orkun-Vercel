const path = require('path')
const express = require('express')
const FoldersService = require('./folders-service')
const NotesService = require('./notes-service')
const usersRouter = express.Router()
const jsonParser = express.json()




usersRouter
    .route('/folders')
    .get((req, res, next) => {

      FoldersService.getAllFolders(req.app.get('db'))
            .then(folders => {
                res.json(folders);
            })
            .catch(next)

    })
    .post(jsonParser, (req, res, next) => {
        const { title } = req.body
        const newFolder = { title }
        if (!title) {
            return res.status(400).json({
                error: {message: `Missing 'title' in request body`}
            })
        }

        FoldersService.insertFolder(
            req.app.get('db'),
            newFolder
        )
            .then(folder => {
                res
                    .status(201)
                    .location(`/folders/${folder.id}`)
                    .json(folder)
            })
            .catch(next)

   
    })

usersRouter
    .route('/folders/:folder_id')
    .all((req, res, next) => {
        const { folder_id } = req.params
        FoldersService.getById(
            req.app.get('db'),
            folder_id
        )
            .then(folder => {
                if (!folder) {
                    logger.error(`Folder with id ${folder_id} not found`)
                    return res.status(404).json({
                        error: { message: `Folder Not Found` }
                      })
                }
                res.folder = folder
                next()
        })
        .catch(next)
    })

    // .get((req, res) => {
    //     const { folderId } = req.params
    //     NotesService.getNoteInFolders(
    //         req.app.get('db'),
    //         folderId
    //     )
    //     .then()
    // })


    .get((req, res) => {
        res.json({
            id: res.folder.id,
            title: res.folder.title,
        })
    })



    .delete((req, res, next) => {
        const {folder_id} = req.params
        FoldersService.deleteFolder(
            req.app.get('db'),
            folder_id
        )
            .then(() => {
                res.status(204).end()
            })
            .catch(next)
    })

    .patch((req, res, next) => {
        const { title } = req.body
        const folderToUpdate = { title }

        FoldersService.updateFolder(
            req.app.get('db'),
            req.params.folder_id,
            folderToUpdate
        )
            .then(folder => {
            res.status(204).end()
        })
        .catch(next)
    })






    usersRouter
    .route('/notes')
    .get((req, res, next) => {

      NotesService.getAllNotes(req.app.get('db'))
            .then(notes => {
                res.json(notes);
            })
            .catch(next)

    })
    .post(jsonParser, (req, res, next) => {
        const { title, folderid, content } = req.body
        const newNote = { title, folderid, content }
        if (!title) {
            return res.status(400).json({
                error: {message: `Missing 'title' in request body`}
            })
        }
        
        if (!folderid) {
          return res.status(400).json({
              error: {message: `Missing 'folderId' in request body`}
          })
      }

      if (!content) {
        return res.status(400).json({
            error: {message: `Missing 'content' in request body`}
          })
      }

    

        NotesService.insertNotes(
            req.app.get('db'),
            newNote
        )
            .then(note => {
                res
                    .status(201)
                    .location(`/notes/${note.id}`)
                    .json(note)
                    .send(`${note} has been added`)
            })
            .catch(next)

   
    })

usersRouter
    .route('/notes/:note_id')
    .all((req, res, next) => {
        const { note_id } = req.params
        NotesService.getById(
            req.app.get('db'),
            note_id
        )
            .then(note => {
                if (!note) {
                    logger.error(`Note with id ${note_id} not found`)
                    return res.status(404).json({
                        error: { message: `Note Not Found` }
                      })
                }
                res.note = note
                next()
        })
        .catch(next)
    })


    .get((req, res) => {
        res.json({
            id: res.note.id,
            title: res.note.title,
            folderId: res.note.folderId,
            content: res.note.content
        })
    })



    .delete((req, res, next) => {
        const {note_id} = req.params
        NotesService.deleteNote(
            req.app.get('db'),
            note_id
        )
            .then(() => {
                res.status(204).end()
            })
            .catch(next)
    })

    .patch((req, res, next) => {
        const { title, folderId, content } = req.body
        const noteToUpdate = { title, folderId, content }

        NotesService.updateNote(
            req.app.get('db'),
            req.params.note_id,
            noteToUpdate
        )
            .then(note => {
            res.status(204).end()
        })
        .catch(next)
    })    

    // usersRouter
    // .route('/')
    // .get((req, res, next)=>{
    //     FoldersService.getAllFolders(req.app.get('db'))
    //         .then(folders => {
    //             res.json(folders);
    //         })
    //         .catch(next)
    // })

module.exports = usersRouter