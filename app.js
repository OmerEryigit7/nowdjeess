const express = require('express')
const cors = require('cors')
const app = express()
const port = 1783

app.use(cors())

app.get('/', (req, res) => {
  res.send('Hello World! Hei Ayaz')
})

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})