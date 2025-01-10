const express = require('express')
const cors = require('cors')
const app = express()
const port = 1783
const mysql = require('mysql2')
const path = require('path')
require("dotenv").config()


app.use(cors())
app.use(express.static(path.join(__dirname, 'static')))

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'static/index.html'))
})

app.get('/registrerbok', (req, res) => {
  res.sendFile(path.join(__dirname, 'static/registerbook.html'))
})

let database = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.SQLUSER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE
})

database.connect((err) => {
  if(err){
    console.log("Feil", err)
  }
  else{
    console.log("Funker ok")
    database.query('SELECT * FROM bøker', (err, results) => {
      if(err) {
        console.log("Feil", err)
      }
      else {
        console.log(results)
      }
    })
  }
})

app.get('/books', (req, res) => {
  database.query('SELECT * FROM bøker', (err, results) => {
    if (err) {
      console.log("Feil ved spørring:", err)
      res.status(500).send("Feil ved henting av bøker.")
    } 
    else {
      res.json(results)
    }
  })
})

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})