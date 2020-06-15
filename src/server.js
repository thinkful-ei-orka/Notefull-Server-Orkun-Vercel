const app = require('./app');
const knex = require('knex')
const { DB_URL } = require('./config')


const db = knex({
    client:'pg',
    connection: DB_URL
})
  
const { PORT } = require('./config');


app.listen(PORT, () => console.log(`Server listening on ${PORT}`));

app.set('db', db)