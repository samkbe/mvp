import React, { useEffect } from 'react';
import axios from 'axios';
import { Button } from '@mui/material';
import { useStore } from './app.jsx';


function Trades(props) {

  const tradeWrapper = {
    display: 'grid',
    gridTemplateColumns: '3fr 1fr',
    height: 'max-content',
    padding: '5px',
  }

  const leftBar = {
    gridColumnStart: '1fr',
    textAlign: 'center',
    borderRadius: '5px',
    boxShadow: '1px 1px 5px #DCDCDC',
    border: '1px solid #DCDCDC',
    height: '300px',
    marginRight: '10px',
  }

  const rightBar = {
    gridColumnStart: '3fr',
    textAlign: 'center',
    borderRadius: '5px',
    boxShadow: '1px 1px 5px #DCDCDC',
    border: '1px solid #DCDCDC',
    height: '300px',
    marginLeft: '10px',
  }

  return (
    <div style={tradeWrapper}>
      <div style={leftBar}>
        <TradeList />
      </div>
      <div style={rightBar}>
        <Metrics />
      </div>
    </div>
  )
}

function Metrics(props) {

  return (
    <div>
      <p>LeaderBoard</p>
    </div>
  )
}

function Trade({ ticker, purchasePrice, id, profit, completed}) {

  const name = useStore((state) => state.name);
  const prices = useStore((state) => state.prices);
  console.log(ticker, profit);
  const tradeWrapper = {
    textAlign: 'center',
    paddingRight: '5px',
    height: 'max',
    margin: '10px',
    borderRadius: '5px',
    boxShadow: '1px 1px 5px #DCDCDC',
    border: '1px solid #DCDCDC',
    verticalAlign: 'center',
    overflowX: '200px',
    width: '100%',
  }

  const completedWrapper = {
    fontFamily: 'roboto-light',
    fontWeight: '100',
    textAlign: 'center',
    paddingRight: '5px',
    height: 'max',
    margin: '10px',
    borderRadius: '5px',
    boxShadow: '1px 1px 5px #DCDCDC',
    border: '1px solid #DCDCDC',
    verticalAlign: 'center',
    width: '100%',
    overflowX: '200px',
    backgroundColor: profit >= 0 ? "green" : "red",
    onHover: {
      height: '90%',
      width: '90%',
    },
  }
  function getPrice(tick) {
    for (let i = 0; i < prices.length; i++) {
      if (prices[i].ticker === tick) {
        return prices[i].price;
      }
    }
  }

  function sendSellToServer() {
    axios({
      method: 'put',
      url: '/sell',
      params: {
        name: name,
        ticker: ticker,
        purchasePrice: purchasePrice,
        sellPrice: getPrice(ticker),
        _id: id,
      }
    })
  }
  if (completed) {
    return (
      <div style={completedWrapper}>
        <h4>Purchased: {ticker.toUpperCase()}</h4>
        {profit >= 0 ? <h4>You took a {profit} dollar W</h4> : <h4>You took a {profit} dollar L</h4>}
      </div>
    )
  } else {
    return (
      <div style={tradeWrapper}>
        <h4>Purchased {ticker.toUpperCase()}</h4>
        <p>at ${purchasePrice}</p>
        <Button onClick={() => { sendSellToServer() }}>Sell</Button>
      </div>
    )
  }
}

function TradeList(props) {

  const trades = useStore((state) => state.trades);

  const listWrapper = {
    borderRadius: '20px',
    boxShadow: '1px 1px 5px #DCDCDC',
    border: '1px solid #DCDCDC',
    height: '90%',
    padding: '5px',
    margin: '5px',
    display: 'inline-flex',
    overflow: 'scroll',
    overflowX: '10px',
    width: '100%',
  }

  if (!trades.length) {
    return (
      <div style={listWrapper}>
        <h4>Previous Trades</h4>
      </div>
    )
  } else {
    return (
      <div style={listWrapper}>
        <h4>Previous Trades</h4>
        {trades.map((trade) => {
          return <Trade key={trade._id} ticker={trade.ticker} purchasePrice={trade.purchasePrice} id={trade._id} completed={trade.completed} profit={trade.profit}/>
        })}
      </div>
    )
  }
}


export default Trades;