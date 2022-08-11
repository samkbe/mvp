import react, { useState } from 'react';
import Title from './title.jsx'
import Buy from './buy.jsx';
import Trades from './trades.jsx';
import create from 'zustand';
import axios from 'axios';
import { Button } from '@mui/material';


export const useStore = create((set) => ({
  name: '',
  trades: {},
  prices: {},
  setName: (n) => {
    set({name: n})
  },
  setPrices: async () => {
    const btcPrice = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd');
    const ethPrice = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd');
    const ripplePrice = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=ripple&vs_currencies=usd');
    const cardanoPrice = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=cardano&vs_currencies=usd');
    const solonaPrice = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd');
    const polkadotPrice = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=polkadot&vs_currencies=usd');
    const moneroPrice = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=monero&vs_currencies=usd');
    const uniswapPrice = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=uniswap&vs_currencies=usd');

    let newObj = [
      {ticker: 'btc', price: btcPrice.data.bitcoin.usd},
      {ticker: 'eth', price: ethPrice.data.ethereum.usd},
      {ticker: 'xrp', price: ripplePrice.data.ripple.usd},
      {ticker: 'ada', price: cardanoPrice.data.cardano.usd},
      {ticker: 'sol', price: solonaPrice.data.solana.usd},
      {ticker: 'dot', price: polkadotPrice.data.polkadot.usd},
      {ticker: 'xmr', price: moneroPrice.data.monero.usd},
      {ticker: 'uni', price: uniswapPrice.data.uniswap.usd},
    ]
    set({prices: newObj})
  },
  setTrades: async (arr) => {
    set({trades: arr})
  },
}))

function App(props) {
  const [loggedIn, changeLoggedIn] = useState(false);

  const wrapper = {
    border: '1px solid #DCDCDC',
    width: '75%',
    justifyContent: 'center',
    margin: 'auto',
    height: 'max',
    marginTop: '10vh',
    borderRadius: '20px',
    boxShadow: '2px 2px 20px #DCDCDC',
    padding: '10px',
  }
  if (loggedIn) {
    return (
      <div style={wrapper}>
        <Title />
        <Buy />
        <Trades />
      </div>
    )
  } else {
    return (
      <LoginForm loggedIn={loggedIn} changeLoggedIn={changeLoggedIn}/>
    )
  }
}

function LoginForm({ loggedIn, changeLoggedIn }) {

  const setName = useStore((state) => state.setName);
  const setTrades = useStore((state) => state.setTrades);

  const [name, changeName] = useState('');
  const wrapper = {
    fontFamily: 'roboto',
    border: '1px solid #DCDCDC',
    width: '30%',
    justifyContent: 'center',
    margin: 'auto',
    height: 'max',
    marginTop: '10vh',
    borderRadius: '20px',
    boxShadow: '2px 2px 20px #DCDCDC',
    padding: '10px',
    textAlign: 'center',
    padding: '50px 0px'
  }

  const formStyle = {
    width: '100%',
    alignContent: 'center',
    textAlign: 'middle',
    justifyContent: 'center',
    margin: 'auto',
  }

  function createAccount() {
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
  }

  function handleClick() {
    setName(name);
    createAccount();
    changeLoggedIn(true);
  }

  return (
    <div style={wrapper}>
      <form style={formStyle}>
        <h1>Enter Your Username</h1>
        <input onChange={(e) => {changeName(e.target.value)}}></input>
        <Button value="login" onClick={() => { handleClick() }}> Login </Button>
      </form>
    </div>
  )
}

export default App;