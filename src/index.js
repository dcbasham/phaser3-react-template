import Phaser from 'phaser';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App.js';
import playGame from './scenes/playGame';
import Chat from './scenes/Chat';

export const config = {
  type: Phaser.AUTO,
  parent: 'phaser',
  width: 800,
  height: 600,
  scene: playGame,
};

const game = new Phaser.Game(config);

ReactDOM.render(
  <App />,
  document.getElementById('root') || document.createElement('div')
);
