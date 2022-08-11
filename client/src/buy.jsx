import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useStore } from './app.jsx';
import { Button } from '@mui/material';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';

function Buy(props) {
  const [ref, refresh] = useState(false);
  const prices = useStore((state) => state.prices);
  const name = useStore((state) => state.name);
  const setPrices = useStore((state) => state.setPrices);

  console.log('prices in buy: ', prices);
  useEffect(() => {
    setPrices();

    setInterval(() => {
      setPrices();
    }, 10000);
  }, [])

  const wrapper = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr 1fr',
    width: '100%',
    margin: 'auto',
    height: '15%',
    marginBottom: '20px',
  };

  const loading = [1, 1, 1, 1, 1, 1, 1, 1]

  const coinWrapper = {
    textAlign: 'center',
    paddingRight: '5px',
    height: 'max',
    margin: '20px',
    borderRadius: '5px',
    boxShadow: '1px 1px 5px #DCDCDC',
    border: '1px solid #DCDCDC',
    display: 'flex-box',
    verticalAlign: 'center',
    height: '155px',
  }

  if((!prices.length)) {
    return (
      <div style={wrapper}>
        {
          loading.map(() => {
            return (
              <div style={coinWrapper}>
                <Box sx={{ width: '100%', height: '100%'}}>
                  <Skeleton sx={{height: '30%'}} animation="wave"/>
                  <Skeleton sx={{height: '30%'}} animation="wave" />
                  <Skeleton sx={{height: '30%'}} animation="wave" />
                </Box>
              </div>
            )
          })
        }
      </div>
    )
  } else {
    return (
      <div style={wrapper}>
        {prices.map((price) => {
          return <Coin key={price.ticker} price={price.price} ticker={price.ticker}/>
        })}
      </div>
    )
  }
}

function Coin({ price, ticker }) {

  const name = useStore((state) => state.name);

  const coinWrapper = {
    fontFamily: 'roboto',
    textAlign: 'center',
    paddingRight: '5px',
    height: '155px',
    margin: '20px',
    borderRadius: '5px',
    boxShadow: '1px 1px 5px #DCDCDC',
    border: '1px solid #DCDCDC',
    display: 'flex-box',
    verticalAlign: 'center',
  }

  function sendTradeToServer() {
    axios({
      method: 'post',
      url: '/newPurchase',
      params: {
        name: name,
        ticker: ticker,
        price: price,
      }
    })
  }

  return (
    <div style={coinWrapper}>
      <h4>BUY {ticker.toUpperCase()}</h4>
      <p>Current price: ${price}</p>
      <Button onClick={() => sendTradeToServer() }>Purchase</Button>
  </div>
  )
}

export default Buy;