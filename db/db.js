const { MongoClient, ObjectID } = require('mongodb');

//Mongo Connection
const uri = "mongodb://localhost:27017/";
const dbName = 'mvp';
const coll = 'trades';
let dbConnect;

MongoClient.connect(uri, (err, client) => {
  if (err) {
    console.log('ERROR in Mongo Connection: ', err);
    return;
  }
  dbConnect = client.db(dbName).collection(coll);
  console.log('You are successfully connected to mongoDB!');
});


async function createUser(request, response) {
  console.log(request.query.name);
  const bool = await dbConnect.countDocuments({username: request.query.name}, {limit: 1});

  const doc = {
    username: request.query.name,
    trades: []
  }
  if (!bool) {
    dbConnect.insertOne(doc)
    .catch((err) => {
      console.log('There was an error posting to the DB, ', err)
      res.sendStatus(500);
    })
    response.sendStatus(201);
  }
  if (bool) {
    const res = await dbConnect.find({username: request.query.name}).limit(1).toArray();
    response.send(res);
  }
}

async function getTrade(req) {
  const query = { username: req.query.name };
  const options = {

  }
  return await dbConnect.find(query).toArray();
}

async function getAll(req) {
  return await dbConnect.find().toArray();
}


async function postTrade(request) {
  const filter = { username: request.query.name }
  const updatedoc = {
    $push: {
      trades : {
        _id: new ObjectID(),
        ticker: request.query.ticker,
        purchasePrice: request.query.price,
        completed: false,
        profit: '',
        sellPrice: 0,
      }
    }
  }
  return await dbConnect.updateOne(filter, updatedoc);
};

async function sellTrade(request) {

  function calculateProfit(purchase, sold) {
    return ((parseFloat(sold) - parseFloat(purchase)));
  }

  const filter = { 'trades._id': ObjectID(request.query._id) }
  const updatedoc = {
    $set: {
      "trades.$.sellPrice": request.query.sellPrice,
      "trades.$.profit": calculateProfit(request.query.purchasePrice, request.query.sellPrice),
      "trades.$.completed": true,
    }
  }
  return await dbConnect.updateOne(filter, updatedoc);
}

async function getLeaders(request) {
  return await dbConnect.find().sort({'trades.profit': 1})
}


module.exports = {
  postTrade: postTrade,
  getTrade: getTrade,
  createUser: createUser,
  sellTrade: sellTrade,
  getLeaders: getLeaders,
  getAll: getAll,
}