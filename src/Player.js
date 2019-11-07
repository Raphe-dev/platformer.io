/**
 * A class that wraps up our top down player logic. It creates, animates and moves a sprite in
 * response to WASD keys. Call its update method from the scene's update and call its destroy
 * method when you're done with the player.
 */
export default class Player {
    constructor(scene, x, y, id) {
      this.text;
      this.id = id;
      this.scene = scene;
      this.flipX = false;
      this.oldPosition = {};
      this.life = 10;
      this.attacking = false;
      this.hit = false;
      this.hitTimeout = true;
      this.dead = false;
  
      const anims = scene.anims;
      anims.create({
        key: "player-idle",
        frames: anims.generateFrameNumbers("character", { start: 0, end: 12 }),
        frameRate: 6,
        repeat: -1,
      });
      anims.create({
        key: "player-walk",
        frames: anims.generateFrameNumbers("character", { start: 15, end: 20 }),
        frameRate: 12,
        repeat: -1
      });
      anims.create({
        key: "player-jump",
        frames: anims.generateFrameNumbers("character", { start: 65, end: 70 }),
        frameRate: 12,
        hideOnComplete: false
      });
      anims.create({
        key: "player-attack-1",
        frames: anims.generateFrameNumbers("character", { start: 26, end: 33 }),
        frameRate: 12,
      });
      anims.create({
        key: "player-attack-2",
        frames: anims.generateFrameNumbers("character", { start: 52, end: 60 }),
        frameRate: 12,
      });
      anims.create({
        key: "player-hurt",
        frames: anims.generateFrameNumbers("character", { start: 78, end: 81 }),
        frameRate: 12,
        hideOnComplete: false,
        repeat: 0
      });
      anims.create({
        key: "player-dead",
        frames: anims.generateFrameNumbers("character", { start: 91, end: 97 }),
        frameRate: 12,
        hideOnComplete: false,
        repeat: 0

      });
  
      this.sprite = this.scene.physics.add.sprite(x, y, "character", 0);
      this.sprite.body.bounce.y = 0.2;
      this.sprite.body.bounce.x = 0.2;

      this.keys = scene.input.keyboard.createCursorKeys();

      this.keyboard_x = this.scene.input.keyboard.addKey('X');
      this.keyboard_z = this.scene.input.keyboard.addKey('Z');


      this.scene.physics.add.overlap(this.sprite, this.scene.otherPlayersGroup, this.onMeetEnemy, false, this)

      this.text = this.scene.add.text(0, 0, this.life, {font: "8px Arial"});

    }
  
    freeze() {
      this.sprite.body.moves = false;
    }
  
    update() {
      this.text.x = Math.floor(this.sprite.x - 4);
      this.text.y = Math.floor(this.sprite.y - 16);


      const keys = this.keys;
      const sprite = this.sprite;
      const speed = 200;


      // Movement
      if(!this.dead){
        if (keys.left.isDown) {
          sprite.body.setVelocityX(-speed);
          sprite.setFlipX(true);
          this.flipX = true
          if(sprite.body.onFloor() && !this.attacking){
            sprite.anims.play(`player-walk`, true);
          }
        } else if (keys.right.isDown) {
          sprite.body.setVelocityX(speed);
          sprite.setFlipX(false);
          this.flipX = false
          if(sprite.body.onFloor() && !this.attacking){
            sprite.anims.play(`player-walk`, true);
          }
        }else if (sprite.body.velocityX !== 0) {
          sprite.body.setVelocityX(0);
          if(sprite.body.onFloor() && !this.attacking && !this.hit){
            sprite.anims.play(`player-idle`, true);
          }
        }
        //Jump
        if (keys.space.isDown && sprite.body.onFloor()) {
            sprite.body.setVelocityY(-300);
            sprite.anims.play(`player-jump`, true);        
        }
  
        if(this.keyboard_x.isDown && !this.attacking) {
          sprite.anims.play(`player-attack-1`, true);
          this.handleAttack();        
        }
        if(this.keyboard_z.isDown && !this.attacking) {
          sprite.anims.play(`player-attack-2`, true);
          this.handleAttack();
        }
      }

      var x = this.sprite.x;
      var y = this.sprite.y;
      var flipX = this.flipX;

  
      var anim;
      if(this.hit){
        sprite.anims.play(`player-hurt`, true);
      }
      if(this.dead && sprite.anims.getCurrentKey() !== 'player-dead'){
        sprite.anims.play(`player-dead`, true);
      }
      if(sprite.anims.isPlaying){
        anim = sprite.anims.getCurrentKey()
      }
      if (this.oldPosition && (x !== this.oldPosition.x || Math.round(y) != Math.round(this.oldPosition.y) || flipX !== this.oldPosition.flipX)) {
        this.scene.socket.emit('playerMovement', { x: x, y: y, flipX: flipX, anim: anim });
      }
      this.oldPosition = {
        x: x,
        y: y,
        flipX: flipX
      };

      console.log(sprite.anims.getCurrentKey());
    }

    getBounds(){
      return this.sprite.getBounds();
    }

    onMeetEnemy(player, enemy) {
      if(this.attacking && this.hitTimeout) {
        this.scene.socket.emit('playerAttack', {player : this.id, target: enemy.parent.id});
        this.hitTimeout = false;
        setTimeout(() => {
          this.hitTimeout = true
        },500)
      }
    }

    handleAttack(){
      this.attacking = true;
      var x = this.sprite.x;
      var y = this.sprite.y;
      var flipX = this.flipX;
      var anim;
      if(this.sprite.anims.isPlaying){
        anim = this.sprite.anims.getCurrentKey()
      }
      this.scene.socket.emit('playerMovement', { x: x, y: y, flipX: flipX, anim: anim });

      setTimeout(() => {
        this.attacking = false
      },500)
    }

    getHit(newlife) {
      if(this.life > 0){
        this.hit = true
        setTimeout(() => {
          this.hit = false
        },350)
        this.scene.socket.emit('playerHit', {playerId : this.id});
        this.life = newlife;
        this.text.setText(this.life);
        if (this.life < 1) {
          this.dead = true;
          this.scene.socket.emit('playerDead', {playerId : this.id});
        }
      } 
    }
  
    destroy() {
      this.sprite.destroy();
    }
  }