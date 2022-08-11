import React, { useState, useEffect } from 'react';
import { useStore } from './app.jsx';

function Title(props) {

  const name = useStore((state) => state.name);
  // const [time, changeTime] = useState(10);
  // let num = 10;
  // function timer() {
  //   console.log(time);
  //   if (time <= 0) {
  //     changeTime(10);
  //     num = 10;
  //   }
  //     num--;
  //     changeTime(num);
  // }

  // useEffect(() => {
  //   setInterval(() => {
  //     timer();
  //   }, 1000);
  // }, [])

  const titleStyle = {
    fontFamily: 'roboto',
    margin: 'auto',
    textAlign: 'center',
  }

  return (
    <div style={titleStyle}>
      <h4 style={{fontSize: '40px'}}>WELCOME TO TRADE TRACKER, {name.toUpperCase()}</h4>
      {/* <h4>{time} seconds until refresh</h4> */}
      <Metrics />
    </div>
  )
}

function Metrics(props) {

  const trades = useStore((state) => state.trades)
  console.log('trades', trades);




  const tradeWrapper = {
    borderRadius: '5px',
    boxShadow: '1px 1px 5px #DCDCDC',
  }

  if (trades) {
    return (
      <div style={tradeWrapper}>

      </div>
    )
  } else {
    return (
      <div style={tradeWrapper}>

      </div>
    )
  }

}

export default Title;