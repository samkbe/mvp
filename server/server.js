const express = require('express');
const path = require('path');
const { createUser, getTrade, postTrade, sellTrade, getLeaders, getAll } = require('../db/db.js');

const app = express();

app.use(express.static(path.join(__dirname, '../client/dist')));

const port = 3000;

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

app.get('/all', (req, res) => {
  getAll()
  .then((results) => res.send(results))
  .catch((err) => {
    console.log(err);
    res.sendStatus(500);
  })
})


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

app.get('/leaderBoard', (req, res) => {
  getLeaders(req)
  .then((results) => {
    res.send(results)
  })
  .catch((err) => {
    console.log(err);
    res.sendStatus(500);
  })
})