import React, { useEffect } from 'react';
import axios from 'axios';
import { Button } from '@mui/material';
import { useStore, leaderBoard } from './app.jsx';


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
    overflowY: 'hidden',
    width: '100%',
  }

  const rightBar = {
    gridColumnStart: '3fr',
    textAlign: 'center',
    borderRadius: '5px',
    boxShadow: '1px 1px 5px #DCDCDC',
    border: '1px solid #DCDCDC',
    height: '300px',
    marginLeft: '10px',
    overflowY: 'auto',
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
  const leaders = leaderBoard((state) => state.leaders);
  const setLeaders = leaderBoard((state) => state.setLeaders);

  const leaderStyle = {
    display: 'flex',
    border: '1px solid #DCDCDC',
    overflowY: 'auto',
  }

  useEffect(() => {
    setLeaders();
  }, [])

  if (!leaders.length) {
    return (
      <div>
        <p>Loading....</p>
      </div>
    )
  } else {
    const sorted = leaders.filter((item) => !!item.profit).sort((a, b) => b.profit - a.profit);
    return (
      <div style={{fontFamily: 'roboto'}}>
        <h4>LEADERBOARD</h4>
        {sorted.map((item, i) => {
          return (
            <div key={item.name} style={leaderStyle}>
              <p style={{paddingRight: '5px'}}><b>Name:</b> {item.name}</p>
              {(!!item.profit) ? <p><b>Performance:</b>{item.profit.toFixed(2)}%</p> : <p><b>Performance:</b>Not Enough Trade Data...</p>}
            </div>
          )
        })}
      </div>
    )
  }

}

function Trade({ ticker, purchasePrice, id, profit, completed}) {

  const name = useStore((state) => state.name);
  const prices = useStore((state) => state.prices);
  const setTrades = useStore((state) => state.setTrades);

  const tradeWrapper = {
    fontFamily: 'roboto',
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
    fontFamily: 'roboto',
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
    backgroundColor: profit >= 0 ? "#90EE90" : "#ffcccb",
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

  function percentChecker(buy, profit) {
    return (profit / (parseFloat(buy)) * 100).toFixed(2);
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
    }).then(() => {
        axios({
          method: 'post',
          url: '/purchase',
          params: { 'name': name }
        })
        .then((res) => {
          if (typeof res.data === 'object') {
            setTrades(res.data[0].trades);
          }
        })
        .catch((err) => console.log(err))
    })
  }
  if (completed) {
    return (
      <div style={completedWrapper}>
        <h4>Purchased: {ticker.toUpperCase()}</h4>
        {profit >= 0 ? <h4>You took a {percentChecker(purchasePrice, profit)}% W</h4> : <h4>You took a {percentChecker(purchasePrice, profit)}% L</h4>}
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
    overflowY: 'auto',
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