/**
 * A class that wraps up our top down player logic. It creates, animates and moves a sprite in
 * response to WASD keys. Call its update method from the scene's update and call its destroy
 * method when you're done with the player.
 */
export default class Player {
    constructor(scene, x, y) {
      this.scene = scene;
      this.flipX = false;
  
      const anims = scene.anims;
      anims.create({
        key: "enemy-idle",
        frames: anims.generateFrameNumbers("cobra_monster", { start: 0, end: 7 }),
        frameRate: 6,
        repeat: -1,
      });
      anims.create({
        key: "enemy-walk",
        frames: anims.generateFrameNumbers("cobra_monster", { start: 8, end: 15 }),
        frameRate: 12,
        repeat: -1
      });
      anims.create({
        key: "enemy-hurt",
        frames: anims.generateFrameNumbers("cobra_monster", { start: 24, end: 27 }),
        frameRate: 12,
        hideOnComplete: false
      });
      anims.create({
        key: "enemy-attack",
        frames: anims.generateFrameNumbers("cobra_monster", { start: 16, end: 21 }),
        frameRate: 12,
        hideOnComplete: false
      });
      anims.create({
        key: "enemy-dead",
        frames: anims.generateFrameNumbers("cobra_monster", { start: 32, end: 37 }),
        frameRate: 12,
        hideOnComplete: false
      });
  
  
      this.sprite = this.scene.physics.add.sprite(x, y, "cobra_monster", 0);
      this.sprite.body.bounce.y = 0.2;
      this.sprite.body.setSize(12,20);
      this.sprite.body.setOffset(8,11);
      this.attacking = false;

      this.sprite.anims.play('enemy-idle');

    }
  
    freeze() {
      this.sprite.body.moves = false;
    }
  
    update() {
    }

    getBounds(){
      return this.sprite.getBounds();
    }
  
    destroy() {
      this.sprite.destroy();
    }
  }