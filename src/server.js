const app = require('./app');
const knex = require('knex')
const { DATABASE_URL } = require('./config')


const db = knex({
    client:'pg',
    connection: DATABASE_URL
})
  
const { PORT } = require('./config');


app.listen(PORT, () => console.log(`Server listening on ${PORT}`));

app.set('db', db)