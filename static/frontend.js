const jsonUrl = 'http://localhost:1783/books'

fetch(jsonUrl)
.then(response => {
  if (!response.ok)
    console.log("feil")
  return response.json()
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
  })
})

.catch(error => {
  console.error('Error fetching the JSON data:', error)
})