const express = require('express')
const cors = require('cors')
const app = express()
const port = 1783
const mysql = require('mysql2')
const path = require('path')
require("dotenv").config()


app.use(cors())
app.use(express.static(path.join(__dirname, 'static')))
app.use(express.json())

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

app.get('/utlaan', (req, res) => {
  database.query('SELECT * FROM utlån', (err, results) => {
    if (err) {
      console.log("Feil ved spørring:", err)
      res.status(500).send("Feil ved henting av bøker.")
    } 
    else {
      res.json(results)
    }
  })
})

app.post('/utlaan', (req, res) => {
  const { BokID, StudentID} = req.body;

  const query = 'INSERT INTO utlån (BokID, StudentID) VALUES (?, ?)';
  database.execute(query, [BokID, StudentID], (err, result) => {
    if (err) {
      console.error('Feil:', err);
      res.status(500).json({ error: 'Kunne ikke registrere utlån',  details: err.message});
      return;
    }
    res.status(201).json({ message: 'Utlån registrert', result });
  });
});

app.post('/books', (req, res) => {
  const { Tittel, Forfatter, ISBN, PåLager, Beskrivelse } = req.body;

  const query = 'INSERT INTO bøker (Tittel, Forfatter, ISBN, PåLager, beskrivelse) VALUES (?, ?, ?, ?, ?)';
  database.execute(query, [Tittel, Forfatter, ISBN, PåLager, Beskrivelse], (err, result) => {
    if (err) {
      console.error('Feil:', err);
      res.status(500).json({ error: 'Kunne ikke registrere boken',  details: err.message});
      return;
    }
    res.status(201).json({ message: 'Bok registrert', result });
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})