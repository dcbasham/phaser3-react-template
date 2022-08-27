import Phaser from 'phaser';
import { io } from 'socket.io-client';

export default class Chat extends Phaser.Scene {
  constructor(name, { store, socket }) {
    super(name);
    // this.store = store,
    this.socket = socket;
    this.players = {};
    this.isClicking = false;
  }

  preload() {
    this.load.spritesheet('jessie', 'sprites/jessie.png', {
      frameWidth: 47,
      frameHeight: 63,
    });
  }

  create() {
    console.log('store', this.store);
    const x = 100;
    const y = 300;
    this.player = this.physics.add.sprite(x, y, 'jessie');
    this.socket.emit('newPlayer', { x, y });

    this.socket.on('playerJoined', (data) => {
      console.log('new player added', data);
      const newPlayer = this.physics.add.sprite(data.x, data.y, 'jessie');
      this.players[data.id] = newPlayer;
    });

    this.socket.on('playerMoved', (data) => {
      if (!this.players[data.id]) return;
      console.log('this.players', this.players[data.id]);
      const playerMoved = this.players[data.id];
      // const distance = Phaser.Math.Distance(playerMoved.x, playerMoved.y, data.x, data.y);
      const distance = Math.sqrt(
        (playerMoved.x - data.x) ^ (2 + (playerMoved.y - data.y)) ^ 2
      );
      this.add
        .tween(playerMoved)
        .to(data, distance * 10)
        .start();
      // this.players[data.id].setPosition(data.x, data.y);
      // this.players[data.id].setRotation(data.rotation);
    });

    // this.socket.on('allplayers', function (data) {
    //   for (var i = 0; i < data.length; i++) {
    //     Game.addNewPlayer(data[i].id, data[i].x, data[i].y);
    //   }
    // });

    // this.socket.on('remove', function (id) {
    //   Game.removePlayer(id);
    // });

    this.player.setCollideWorldBounds(true);
    this.anims.create({
      key: 'turn',
      frames: [{ key: 'jessie', frame: 7 }],
      frameRate: 20,
    });
    this.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNumbers('jessie', { start: 3, end: 5 }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: 'left',
      frames: this.anims.generateFrameNumbers('jessie', { start: 9, end: 11 }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: 'up',
      frames: this.anims.generateFrameNumbers('jessie', { start: 0, end: 2 }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: 'down',
      frames: this.anims.generateFrameNumbers('jessie', { start: 6, end: 8 }),
      frameRate: 10,
      repeat: -1,
    });
  }

  update() {
    // ----CLICK TO TELEPORT --JANKY--------------------------------------------------------
    // NO ANIMATIONS on purpose!! Jessie facing backwards!
    if (!this.input.activePointer.isDown && this.isClicking == true) {
      this.player.setData('newX', this.input.activePointer.x);
      this.player.setData('newY', this.input.activePointer.y);
      this.isClicking = false;
    } else if (this.isClicking == false && this.input.activePointer.isDown) {
      this.isClicking = true;
    }

    if (Math.abs(this.player.y - this.player.getData('newY')) <= 10) {
      this.player.y = this.player.getData('newY');
    } else if (this.player.y < this.player.getData('newY')) {
      this.player.y += 5;
    } else if (this.player.y > this.player.getData('newY')) {
      this.player.y -= 5;
    }

    if (Math.abs(this.player.x - this.player.getData('newX')) <= 10) {
      this.player.x = this.player.getData('newX');
    } else if (this.player.x < this.player.getData('newX')) {
      this.player.x += 5;
    } else if (this.player.x > this.player.getData('newX')) {
      this.player.x -= 5;
    }

    this.socket.emit('playerMovement', {
      x: this.player.x,
      y: this.player.y,
      rotation: this.player.rotation,
    });

    // -----OLD PLAYER MOVEMENT ----------------------------------------------------------------
    //   const cursors = this.input.keyboard.createCursorKeys();
    //   if (cursors.left.isDown) {
    //     this.player.setVelocity(-160, 0);
    //     this.player.anims.play('left', true);
    //   } else if (cursors.right.isDown) {
    //     this.player.setVelocity(160, 0);
    //     this.player.anims.play('right', true);
    //   } else if (cursors.up.isDown) {
    //     this.player.setVelocity(0, -160);
    //     this.player.anims.play('up', true);
    //   } else if (cursors.down.isDown) {
    //     this.player.setVelocity(0, 160);
    //     this.player.anims.play('down', true);
    //   } else {
    //     this.player.setVelocity(0, 0);
    //     this.player.anims.play('turn');
    //   }
    // }
    // ---------------------------------------------------------------------------------------
  }
  // const clientSocket = io(window.location.origin);

  // // clientSocket.on('connect', () => {
  // //   console.log('Socket connected to server');
  // // });
  // // socket connections in scenes- Main.js in client. Open socket connection this.socket= new Socket.io..... create function.
  // /* A new Manager? https://socket.io/docs/v4/client-api/
  //  */

  // clientSocket.on('newplayer',function(data){
  //   Game.addNewPlayer(data.id,data.x,data.y);
  // });

  // clientSocket.sendTest = function(){
  //   console.log("test sent");
  //   clientSocket.socket.emit('test');
  // };

  // clientSocket.askNewPlayer = function(){
  //   clientSocket.socket.emit('newplayer');
  // };

  // clientSocket.sendClick = function(x,y){
  // clientSocket.socket.emit('click',{x:x,y:y});
  // };
}
