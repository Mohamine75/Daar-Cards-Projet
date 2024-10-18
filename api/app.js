const express = require('express')
const app = express()
const port = 3000

// table de correspondance ex : collectionId 0 => base-1 | et créer une interface pour créer ces correspondances?

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

// TODO base1, base2 et base3

app.get('/:collectionId/:cardId', (req, res) => {
  const collectionId = req.params.collectionId;
  const cardId = req.params.cardId;
  

  
  // Send a response back to the client
  res.send(`You passed ${collectionId} and ${cardId} as variables.`);
});