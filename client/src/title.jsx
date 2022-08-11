import React, { useState, useEffect } from 'react';
import { useStore, leaderBoard } from './app.jsx';

function Title(props) {

  const name = useStore((state) => state.name);

  const titleStyle = {
    fontFamily: 'roboto',
    margin: 'auto',
    textAlign: 'center',
  }

  return (
    <div style={titleStyle}>
      <h4 style={{fontSize: '40px'}}>WELCOME TO TRADE TRACKER, {name.toUpperCase()}</h4>
      <Metrics />
    </div>
  )
}

function Metrics(props) {

  const leaders = leaderBoard((state) => state.leaders);
  const name = useStore((state) => state.name);

  const tradeWrapper = {
    borderRadius: '5px',
    boxShadow: '1px 1px 5px #DCDCDC',
  }

  if (!leaders.length || !name) {
    return (
      <></>
    )
  } else {

    function findMetrics() {
      for (let i = 0; i < leaders.length; i++) {
        if (name === leaders[i].name) {
          return leaders[i].profit;
        }
      }
    }
    const performance = findMetrics();

    const styled = {
      backgroundColor: (performance >= 0) ? "#90EE90" : "#ffcccb",
      padding: '5px',
    }

    return (
      <div style={styled}>
        <h2>Overall performance: </h2>
        {performance >= 0 ? <p>You are up {performance.toFixed(2)}% </p> : <p>You are down {performance.toFixed(2)}% </p>}
      </div>
    )
  }

}

export default Title;