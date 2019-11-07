import Phaser from "phaser";
import Player from "./Player";
import OtherPlayer from "./OtherPlayer";
import Enemy from "./Enemy";
import io from "socket.io-client";

import assets from "./assets/tileset.png";
import mapjson from "./assets/scrollermap.json";
import CharacterSprites from "./assets/AdventurerSprite.png";
import CobraMonsterSprites from "./assets/CobraSprite.png";

const config = {
  type: Phaser.CANVAS,
  parent: "phaser-example",
  width: 800,
  height: 600,
  scene: {
    preload: preload,
    create: create
  },
  physics: {
    default: 'arcade',
        arcade: {
          gravity: {y: 700},
          debug: false
        },
  }
};
var map = {};
var tileSet = {};
var socketId;
const game = new Phaser.Game(config);


function preload() {
  this.load.image('Assets', assets )
  this.load.tilemapTiledJSON('map', mapjson);
  this.load.spritesheet("character",CharacterSprites,{frameWidth: 32,frameHeight: 32});
  this.load.spritesheet("cobra_monster",CobraMonsterSprites,{frameWidth: 32,frameHeight: 32});

}

function create() {

  this.otherPlayersGroup = this.physics.add.group();

  if(!this.socket){
    this.socket = io('https://65.92.227.192:8081');
  }
  this.players = {}
  this.socket.on('currentPlayers', (players) => {
    Object.keys(players).forEach((id) => {
      if (players[id].playerId == this.socket.id) {
        this.players[id] = players[id]
        addPlayer(this, id);
      } else {
        if(!this.players[id]){
          this.players[id] = players[id];
          addOtherPlayer(this, id);
        }
      }
    });
  });
  this.socket.on('newPlayer', (player) => {
    this.players[player.playerId] = player;
    addOtherPlayer(this, player.playerId);
  });
  this.socket.on('playerdisconnect', (id) => {
    this.players[id].destroy();
    delete this.players[id];
  });
  this.socket.on('playerMoved', (playerInfo) => {
    let { x, y, flipX, anim } = playerInfo;
    if(this.players[playerInfo.playerId] &&  playerInfo.playerId !== this.socket.id) {
      this.players[playerInfo.playerId].setPosition(x, y, flipX, anim);
    }
  });
  this.socket.on('playerAttack', (data) => {
    this.players[data.player.playerId].getHit(data.player.life); 
  });
  this.socket.on('playerHit', (data) => {
    this.players[data.player.playerId].getHit(data.player.life); 
  });


  //TILEMAP
  map = this.make.tilemap({ key: 'map'});
  tileSet = map.addTilesetImage('Assets');
  const BackgroundLayer1 = map.createDynamicLayer("BackgroundLayer1", tileSet, 0 , 0);
  const BackgroundLayer2 = map.createDynamicLayer("BackgroundLayer2", tileSet, 0 , 0);
  this.groundLayer = map.createDynamicLayer("GroundLayer", tileSet, 0, 0);

  //COLLISION
  this.groundLayer.setCollisionByExclusion([-1]);
  this.cobra = new Enemy(this, 200 , 200);
  this.physics.add.collider(this.cobra.sprite, this.groundLayer);

  //CAMERA
  this.cameras.main.setBounds(0, 0, this.groundLayer.width * this.groundLayer.scaleX, this.groundLayer.height * this.groundLayer.scaleY);
  this.cameras.main.roundPixels = true;
  
  //UPDATE
  this.events.on('update', function(time, delta){
    Object.keys(this.players).forEach(key => {
      if(this.players[key] instanceof Player || this.players[key] instanceof OtherPlayer) {
        this.players[key].update();
      }
    })
  }, this);

}

function addPlayer(context, id) {
  context.players[id] = new Player(context, context.players[id].x , context.players[id].y, id);
  context.physics.add.collider(context.players[id].sprite, context.groundLayer);
  context.cameras.main.startFollow(context.players[id].sprite);
  context.cameras.main.zoomTo(1.5);
}

function addOtherPlayer(context, id) {
  
  context.players[id] = new OtherPlayer(context, context.players[id].x , context.players[id].y, id);
  context.physics.add.collider(context.players[id].sprite, context.groundLayer);

}
