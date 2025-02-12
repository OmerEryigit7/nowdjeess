const jsonUrl = 'http://localhost:1783/books'
const response_to_user = document.getElementById('response')

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
      PaaLager: på_lager,
      Beskrivelse: beskrivelse,
    }),
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Feil ved registrering av studenten');
      }
      return response.json();
    })
    .then(responseData => {
      if (responseData.message) {
        response_to_user.innerText = responseData.message;
      }
      console.log('Bok registrert:', responseData);
    })
    .catch(error => {
      console.error('Registrering av bok misslyktes:', error);
    });
}

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
    if (!response.ok) {
      throw new Error('Feil ved utlån');
    }
    return response.json();
  })
  .then(responseData => {
    if (responseData.message) {
      response_to_user.innerText = responseData.message;
    }
    console.log('Utlån vellykket:', responseData);
  })
  .catch(error => {
    console.error('Feil ved utlån:', error);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const register_book_button = document.getElementById('register_book_button');
  if (register_book_button) {
    register_book_button.addEventListener("click", register_book);
  }

  const loaning_out_button = document.getElementById('loaning-out-button');
  if (loaning_out_button) {
    loaning_out_button.addEventListener("click", loaning_out);
  }

  const registerStudentButton = document.getElementById('register_student_button');
  if (registerStudentButton) {
    registerStudentButton.addEventListener("click", addStudent);
  }

  const loginButton = document.getElementById('login-button')
  if (loginButton) {
    loginButton.addEventListener('click', login)
  }
});

function addStudent() {
  const student_fornavn = document.getElementById('student-fornavn-input').value;
  const student_etternavn = document.getElementById('student-etternavn-input').value;
  const student_klassetrinn = document.getElementById('student-klassetrinn-input').value;
  const student_epost = document.getElementById('student-epost-input').value;
  const student_unhashed = document.getElementById('student-passord-input').value;

  fetch('/student', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      Fornavn: student_fornavn,
      Etternavn: student_etternavn,
      Klassetrinn: student_klassetrinn,
      Epost: student_epost,
      HashedPassord: student_unhashed,
    }),
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Feil ved registrering av studenten');
    }
    return response.json();
  })
  .then(responseData => {
    if (responseData.message) {
      response_to_user.innerText = responseData.message;
    }
    console.log('Student registrert:', responseData);
  })
  .catch(error => {
    console.error('Feil ved registrering:', error);
  });
}

function login() {
  const epostInput = document.getElementById('brukernavn-login-input').value;
  const passwordInput = document.getElementById('passord-login-input').value;

  fetch('/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      Epost: epostInput,
      Passord: passwordInput,
    })
  })
  .then(response => response.json())
  .then(responseData => {
    console.log("Parsed responseData:", responseData);
  
    if (responseData.message === 'Innlogging vellykket') {
      alert('Innlogging vellykket!');
      window.location.replace('/administrator');
    } else {
      alert('Feil ved innlogging: ' + (responseData.error || 'Ukjent feil'));
    }
  })
  .catch(error => {
    console.error(error);
    alert(error.message);
  });
}
fetch('/administrator', {
  credentials: 'include'
})
.catch(error => {
  console.error(error);
});

const fetch_student_books = document.getElementById('search-student')
if (fetch_student_books) {
  fetch_student_books.addEventListener('click', search_student)
}

function search_student() {
  const student_fornavn = document.getElementById('student-fornavn-input').value;

  var url = student_fornavn 
  if (student_fornavn) {
    url = `/student/search?student_fornavn=${encodeURIComponent(student_fornavn)}`;
  } else {
    url = '/student/search';
  }
  
  fetch(url, {
    method: 'GET',
  })
  .then(response => response.json()) 
  .then(data => {
    if (data && data.length > 0) {
      console.log(data);
      
      data.forEach(student => {
        const student_info_book_info_display = document.getElementById('student-info')

        const student_info = document.createElement('div')
        const student_info_text = document.createElement('p')
        const student_select = document.createElement('button')

        student_info_text.innerHTML = `${student.Fornavn} ${student.Etternavn} ${student.Epost} - ${student.Klassetrinn}`
        student_select.innerHTML = "Velg student"
        student_select.addEventListener('click', () => display_student_books(student));


        student_info.appendChild(student_info_text)
        student_info.appendChild(student_select)
        student_info_book_info_display.appendChild(student_info)
    })

    } else {
      console.log('No students found');
    }
  })
  .catch(error => {
    console.error('Error fetching student data:', error);
  });
}

function display_student_books(student) {
  console.log(`Fetching books for student: ${student.Fornavn} ${student.Etternavn}`);
  
  fetch(`/utlaan/search?StudentID=${student.StudentID}`, { method: 'GET' })
    .then(response => response.json())
    .then(loans => {
      const book_info_display = document.getElementById('student-info');
      book_info_display.innerHTML = '';

      if (loans.length > 0) {
        loans.forEach(loan => {
          const book_entry = document.createElement('p');
          console.log(loan)
          book_entry.innerHTML = `${loan.Tittel} by ${loan.Forfatter}`;
          book_info_display.appendChild(book_entry);
          const return_book_button = document.createElement('button');
          return_book_button.innerText = "Marker bok som levert";
          return_book_button.setAttribute('student-id', student.StudentID);
          return_book_button.setAttribute('bok-id', loan.BokID )
          return_book_button.addEventListener('click', return_book);
          book_info_display.appendChild(return_book_button)

        });
      } else {
        book_info_display.innerHTML = '';
      }
    })
    .catch(error => {
      console.error('Error fetching books:', error);
    });
}

function return_book(EventListener) {
  const button = EventListener.target;
  const bokID = button.getAttribute('bok-id')
  const studentID = button.getAttribute('student-id')

  fetch('/utlaan/return', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ studentID, bokID }),
  })
    .then(response => response.text())
    .then(message => {
      alert(message);
      button.parentElement.remove(); // Fjern bokelementet fra listen etter retur
    })
    .catch(error => {
      console.error('Feil ved retur av bok:', error);
    });
}

