export default class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene,x,y,'dude');
        this.scene=scene;
        scene.add.existing(this);
        scene.physics.add.existing(this);
        scene.physics.world.enable(this);
        //  Player physics properties. Give the little guy a slight bounce.
     /*   player.setBounce(0.2);
        player.setCollideWorldBounds(true);*/

        this.onLadder = false;

    }


    update(cursors,anims,playerPlataforms){
        if(this.onLadder) {
            this.physics.world.removeCollider(playerPlataforms);
            if (cursors.up.isDown) {
                this.velocity.y = -this.speed / 2;
            }
            if (cursors.down.isDown) {
                this.velocity.y = this.speed / 2;
            }
            if ((!cursors.up.isDown && !cursors.down.isDown)) {
                this.gravity.y = 0;
                this.velocity.y = 0;
            }
        }
        else
        if (cursors.left.isDown) {
            this.setVelocityX(-160);
          //  this.scene.anims.play('left', true);
        }
        else if (cursors.right.isDown) {
            this.setVelocityX(160);

          //  anims.play('right', true);
        }
        else {
            this.setVelocityX(0);

         //   anims.play('turn');
        }

        if (cursors.up.isDown && this.body.touching.down) {
            this.setVelocityY(-330);
        }

    }


    isOnLadder()
    {
        this. onLadder = true;
        console.log(this.onLadder);
    }





}
