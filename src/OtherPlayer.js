/**
 * A class that wraps up our top down player logic. It creates, animates and moves a sprite in
 * response to WASD keys. Call its update method from the scene's update and call its destroy
 * method when you're done with the player.
 */
export default class Player {
    constructor(scene, x, y, id) {
      this.id = id
      this.scene = scene;
      this.flipX = false;
      this.life = 10;
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
        hideOnComplete: false
      });
      anims.create({
        key: "player-attack-2",
        frames: anims.generateFrameNumbers("character", { start: 52, end: 60 }),
        frameRate: 12,
        hideOnComplete: false
      });
      anims.create({
        key: "player-hurt",
        frames: anims.generateFrameNumbers("character", { start: 78, end: 81 }),
        frameRate: 12,
        hideOnComplete: false
      });
      anims.create({
        key: "player-dead",
        frames: anims.generateFrameNumbers("character", { start: 91, end: 97 }),
        frameRate: 12,
        hideOnComplete: false,
      });

      this.sprite = this.scene.otherPlayersGroup.create(x, y, "character", 0);
      this.sprite.parent = this;
      this.sprite.body.bounce.y = 0.2;
      this.sprite.body.bounce.x = 0.2;

      this.keys = scene.input.keyboard.createCursorKeys();

      this.attacking = false;

      this.text = this.scene.add.text(0, 0, this.life, {font: "8px Arial"});


    }
  
    freeze() {
      this.sprite.body.moves = false;
    }
  
    update() {
      this.text.x = Math.floor(this.sprite.x - 4);
      this.text.y = Math.floor(this.sprite.y - 16);

      if(this.dead && this.sprite.anims.getCurrentKey() !== 'player-dead'){
        this.sprite.anims.play(`player-dead`, true);
      }
    }

    getBounds(){
      return this.sprite.getBounds();
    }

    setPosition(x, y, flipX, anim) {
        this.sprite.setFlipX(flipX);
        this.sprite.body.reset(x, y);
        this.sprite.anims.play(anim, true);
    }

    setAnim(anim) {
      this.sprite.anims.play(anim, true);
    }
  
    destroy() {
      this.sprite.destroy();
    }

    getHit(newLife) {
      this.life = newLife;
      this.text.setText(this.life);
      if(this.life > 0){
        this.sprite.anims.play('player-hurt');
        setTimeout(() => {
          this.sprite.anims.play('player-idle');
        }, 500)
      } else {
        this.dead = true;
      }
    }
  }