const mysql = require('mysql2')

const jsonUrl = 'http://localhost:1783/books'

fetch(jsonUrl)
.then(response => {
  if (!response.ok)
    console.log("feil")
  return response.json()
})

.catch(error => {
  console.error('Error fetching the JSON data:', error)
})

.then(data => {

  const booksList = document.getElementById('book-text') 

  data.forEach(book => {
      const listItem = document.createElement('li')

      const title = document.createElement('span')
      title.textContent = `Tittel: ${book.Tittel}`
      listItem.appendChild(title)

      const spacebreak = document.createElement('br')
      listItem.appendChild(spacebreak)

      const author = document.createElement('span')
      author.textContent = `Forfatter: ${book.Forfatter}`
      listItem.appendChild(author)

      booksList.appendChild(listItem)

      console.log(data)
  })
})

let database = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.SQLUSER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE
})

register_book_button = document.getElementById('register_book_button').addEventListener("click", register_book)

function register_book() {
  book_title = document.getElementById('book-title-input').value
  book_author = document.getElementById('book-author-input').value
  book_isbn = document.getElementById('book-isbn-input').value
  const query = 'INSERT INTO bøker (Tittel, Forfatter, ISBN) VALUES (?)';

  database.execute(query, [book_title, book_author, book_isbn], function (err, result) {
    if (err) {
      console.error('Feil', err);
      return;
    }
    console.log('Ser ut til å funke:', result);
  });

}