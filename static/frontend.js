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
  const books_container = document.getElementById('books-container')

  data.forEach(book => {
      const book_box = document.createElement('div')
      book_box.id = "books"

      const imageThingy = document.createElement('img')
      imageThingy.id = "book-image"
      imageThingy.src = 'default-CDDkjOW7-medium.jpg'

      const listItem = document.createElement('li')
      listItem.id = "book-text"

      const title = document.createElement('span')
      title.textContent = `${book.Tittel}`
      listItem.appendChild(title)

      const spacebreak = document.createElement('br')
      listItem.appendChild(spacebreak)

      const author = document.createElement('span')
      author.textContent = `${book.Forfatter}`
      listItem.appendChild(author)
      author.classList = "author-text"

      book_box.appendChild(imageThingy)
      book_box.appendChild(listItem)

      books_container.appendChild(book_box)

      console.log(data)
  })
})

const loaning_out_button = document.getElementById('loaning-out-button');
loaning_out_button.addEventListener("click", loaning_out);

function register_book() {
  const book_title = document.getElementById('book-title-input').value;
  const book_author = document.getElementById('book-author-input').value;
  const book_isbn = document.getElementById('book-isbn-input').value;
  const på_lager = document.getElementById('book-stock-input').value
  const beskrivelse = document.getElementById('book-description-input').value

  fetch('/books', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      Tittel: book_title,
      Forfatter: book_author,
      ISBN: book_isbn,
      PåLager: på_lager,
      Beskrivelse: beskrivelse,
    }),
  })
    .then(response => {
      console.log('Raw response:', response);

      if (!response.ok) {
        throw new Error('Feil ved registrering av boken');
      }

      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        return response.json();
      } else {
        throw new Error('Serveren svarte ikke med JSON');
      }
    })
    .then(data => {
      console.log('Bok registrert:', data);
    })
    .catch(error => {
      console.error('Feil ved registrering:', error);
    });
}

const register_book_button = document.getElementById('register_book_button');
register_book_button.addEventListener("click", register_book);


function loaning_out() {
  const book_id = document.getElementById('book-id-input').value;
  const student_id = document.getElementById('student-id-input').value;

  fetch('/utlaan', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      BokID: book_id,
      StudentID: student_id,
    }),
  })
    .then(response => {
      console.log('Raw response:', response);

      if (!response.ok) {
        throw new Error('Feil ved registrering av boken');
      }
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        return response.json();
      } else {
        throw new Error('Serveren svarte ikke med JSON');
      }
    })
    .then(data => {
      console.log('Bok registrert:', data);
    })
    .catch(error => {
      console.error('Feil ved registrering:', error);
    });
}