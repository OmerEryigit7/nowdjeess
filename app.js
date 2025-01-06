const express = require('express')
const cors = require('cors')
const app = express()
const port = 1783
const mysql = require('mysql2')

app.use(cors())

app.get('/', (req, res) => {
  res.send('Hello World! Hei Ayaz')
})

let database = mysql.createConnection({
  host: "localhost",
  user: "ansatt",
  password: "passord",
  database: "bibliotek"
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
      console.log("Feil ved spørring:", err);
      res.status(500).send("Feil ved henting av bøker.");
    } else {
      res.json(results); // Send the results to the client as JSON
    }
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})