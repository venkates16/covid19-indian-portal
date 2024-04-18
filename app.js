let express = require('express')
let app = express()
app.use(express.json())

let path = require('path')
let sqlite3 = require('sqlite3')
let {open} = require('sqlite')
let bcrypt = require('bcrypt')
let jwt = require('jsonwebtoken')

let db_path = path.join(__dirname, 'covid19IndiaPortal.db')

let dataBase = null

let initaize_db_server = async () => {
  try {
    dataBase = await open({
      filename: db_path,
      driver: sqlite3.Database,
    })
    app.listen(3000, () => {
      console.log('Server running on port 3000')
    })
  } catch (error) {
    console.log(error.meassage)
    process.exit(1)
  }
}
initaize_db_server()

app.post('/user/', async (request, response) => {
  let {username, password, name, gender, location} = request.body
  let query = `
  
  SELECT
  *
  FROM 
  USER
    WHERE 
    username='${username}'
  `

  let db_response = await dataBase.get(query)
  let hashedPassword = await bcrypt.hash(password, 10)
  if (db_response === undefined) {
    //console.log('hii')

    let post_query = `
    insert into  user(username, name, password, gender, location)
    values('${username}','${name}','${hashedPassword}','${gender}','${location}')
    `
    db_run = await dataBase.run(post_query)
    response.send('Successfully user created')
  } else {
    response.status('401')
    response.send('User already exits')
  }
})
