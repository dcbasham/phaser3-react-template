import Phaser from 'phaser';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App.js';
// import playGame from './scene';
import Chat from './Chat';
// console.log(App);

export const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  // scene: [main],
  physics: {
    default: 'arcade',
    arcade: {
      // debug: true,
      // gravity: { y: 20 },
      enableBody: true,
    },
  },
};

const game = new Phaser.Game(config);

ReactDOM.render(
  <App />,
  document.getElementById('root') || document.createElement('div')
);
