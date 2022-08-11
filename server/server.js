const express = require('express');
const path = require('path');
const { createUser, getTrade, postTrade, sellTrade } = require('../db/db.js');

const app = express();

app.use(express.static(path.join(__dirname, '../client/dist')));

const port = 3000;

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

app.post('/purchase', (req, res) => {
  createUser(req, res);
});

app.post('/newPurchase', (req, res) => {
  postTrade(req)
  .then(() => {
    res.sendStatus(201);
  })
  .catch((err) => {
    console.log(err);
    res.sendStatus(500);
  })
})

app.put('/sell', (req, res) => {
  console.log(req.query)
  sellTrade(req)
  .then((results) => {
    console.log(results);
    res.sendStatus(201)
  })
  .catch((err) => {
    console.log(err)
    res.sendStatus(500);
  })
})

app.get('/purchase', getTrade);