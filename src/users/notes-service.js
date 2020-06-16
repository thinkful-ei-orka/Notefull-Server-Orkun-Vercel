const NotesService = {
    getAllNotes(knex) {
      return knex.select('*').from('notes')
    },
    
  // getNoteInFolders(knex, folderId) {
  //   return knex
  //     .select('notes.id', 'notes.title', 'notes.modified', 'notes.content', 'notes.folderId')
  //     .from('notes')
  //     .join('notes.folderId, folder.id')
  //     .where('folder.id', folderId)
  // },
  
    insertNotes(knex, newNote) {
      return knex
        .insert(newNote)
        .into('notes')
        .returning('*')
        .then(rows => {
          return rows[0]
        })
    },
  
    getById(knex, id) {
      return knex
        .from('notes')
        .select('*')
        .where('id', id)
        .first()
    },
  
    deleteNote(knex, id) {
      return knex('notes')
        .where({ id })
        .delete()
    },
  
    updateNote(knex, id, newNoteFields) {
      return knex('notes')
        .where({ id })
        .update(newNoteFields)
    },
  }
  
  module.exports = NotesService