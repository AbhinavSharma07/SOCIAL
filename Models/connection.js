require('dotenv').config()

var knex = require('knex')({
    client:"mysql",
    connection:{
        user:process.env.DBUSER,
        host:"localhost",
        password:process.env.DBPASSWORD,
        database:process.env.DBNAME
    }
})

module.exports=knex