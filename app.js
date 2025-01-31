const express = require('express')
const cors = require('cors')
const app = express()
const port = 1783
const mysql = require('mysql2')
const bcrypt = require('bcrypt');
const path = require('path')
require("dotenv").config()

app.use(cors())
app.use(express.static(path.join(__dirname, 'static')))
app.use(express.json())

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'static/index.html'))
})

app.get('/administrator', authenticateToken, checkRole, (req, res) => {
  res.sendFile(path.join(__dirname, 'static/admin.html'))
})

app.get('/administrator/registrer_bok', authenticateToken, checkRole, (req, res) => {
  res.sendFile(path.join(__dirname, 'static/register_book.html'))
})

app.get('/boker', (req, res) => {
  res.sendFile(path.join(__dirname, 'static/boker.html'))
})

app.get('/administrator/opprett_bruker', authenticateToken, checkRole, (req, res) => {
  res.sendFile(path.join(__dirname, 'static/register_user.html'))
})

app.get('/logg_in', (req, res) => {
  res.sendFile(path.join(__dirname, 'static/login.html'))
})

app.get('/administrator/bok_utlaan', authenticateToken, checkRole, (req, res) => {
  res.sendFile(path.join(__dirname, 'static/loan_out_book.html'))
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
    const createBøker = `
      CREATE TABLE IF NOT EXISTS bøker (
        BokID int not null auto_increment primary key,
        Tittel varchar(100) not null,
        Forfatter varchar(100) not null,
        ISBN int not null,
        PaaLager int not null default 1,
        Beskrivelse varchar(50)
      )`
    database.query(createBøker)

        const createStudent = `
          CREATE TABLE IF NOT EXISTS student (
            StudentID int not null auto_increment primary key,
            Fornavn varchar(100) not null,
            Etternavn varchar(30) not null,
            Klassetrinn int not null,
            Epost varchar(200) not null unique,
            HashedPassord varchar(250),
            Rolle enum('admin', 'student') not null default 'student'
          )`
    database.query(createStudent)
        
        const createUtlån = `
        CREATE TABLE IF NOT EXISTS utlån (
          StudentID int  not null,
          BokID int not null,
          foreign key (StudentID) REFERENCES student(StudentID),
          foreign key (BokID) REFERENCES bøker(BokID),
          Utlånsdato datetime default current_timestamp
        )`
    database.query(createUtlån)
        
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

app.post('/books', (req, res) => {
  const { Tittel, Forfatter, ISBN, PaaLager, Beskrivelse } = req.body;

  const query = 'INSERT INTO bøker (Tittel, Forfatter, ISBN, PaaLager, Beskrivelse) VALUES (?, ?, ?, ?, ?)';
  database.execute(query, [Tittel, Forfatter, ISBN, PaaLager, Beskrivelse], (err, result) => {
    if (err) {
      console.error('Feil:', err);
      res.status(500).json({ error: 'Kunne ikke registrere boken',  details: err.message});
      return;
    }
    res.status(201).json({ message: 'Bok registrert', result });
  });

  console.log(req.body)
});

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

app.get('/student', (req, res) => {
  database.query('SELECT * FROM student', (err, results) => {
    if (err) {
      console.log("Feil ved spørring:", err)
      res.status(500).send("Feil ved henting av bøker.")
    } 
    else {
      res.json(results)
    }
  })
})

app.post('/student', async (req, res) => {
  var { Fornavn, Etternavn, Klassetrinn, Epost, HashedPassord } = req.body
  const salt = await bcrypt.genSalt()
  HashedPassord = await bcrypt.hash(HashedPassord, salt)
  Klassetrinn = parseInt(Klassetrinn)

  const query = 'INSERT INTO student (Fornavn, Etternavn, Klassetrinn, Epost, HashedPassord, Rolle) VALUES (?, ?, ?, ?, ?, ?)';
  database.execute(query, [Fornavn, Etternavn, Klassetrinn, Epost, HashedPassord, 'student'], (err, result) => {
    if (err) {
      console.error('Database Error:', err);
      return res.status(500).json({ error: 'Database error', details: err.message });
    }
    res.status(201).json({ message: 'Student registrert', result });
  });
})

const jwt = require('jsonwebtoken');

app.post('/login', (req, res) => {
  const { Epost, Passord } = req.body;

  const query = 'SELECT * FROM student WHERE Epost = ?';
  database.execute(query, [Epost], async (err, results) => {

    if (results.length === 0) {
      return res.status(401).json({ error: 'Ugyldig epost eller passord' });
    }

    const student = results[0];
    const isMatch = await bcrypt.compare(Passord, student.HashedPassord);

    if (!isMatch) {
      return res.status(401).json({ error: 'Ugyldig epost eller passord' });
    }

    const token = jwt.sign(
      { id: student.StudentID, epost: student.Epost, rolle: student.Rolle }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1h' } // Token expires in 1 hour
    );

    res.json({ 
      message: 'Innlogging vellykket', 
      token 
    });
  });
});

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  if (token == null) return res.sendStatus(401)

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    console.log(err)
    if (err) return res.sendStatus(403)
    req.user = user
    next()
  })
}

function checkRole() {
  return (req, res, next) => {
    if (req.user.Rolle === 'admin') {
      return next()
    } else {
      return res.sendStatus(403)
    }
  }
}

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})