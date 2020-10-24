const express = require('express')
const app = express()
const port = 3006

app.get('/', (req, res) => {
  res.send('is this working')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
