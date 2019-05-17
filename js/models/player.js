export default class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'dude');
        this.scene = scene;
        scene.add.existing(this);
        scene.physics.add.existing(this);
        scene.physics.world.enable(this);
        //  Player physics properties. Give the little guy a slight bounce.
        /*   player.setBounce(0.2);
           player.setCollideWorldBounds(true);*/

        this.onLadder = false;

        //life and no damage power up
        this.life = 100;
        this.noDamage = 0;
        this.damageTicket = 0;
//red after being hit
        this.red = 0;
        this.redTicket = 0;
        //Fast speed power up
        this.fastSpeed = 0;
        this.fastSpeedTicket = 0;


    }


    update(cursors, anims, playerPlataforms) {
        if (this.onLadder) {
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
        else if (cursors.left.isDown) {
           // console.log(this.fastSpeed);
            if (this.fastSpeed === 1) {
                this.setVelocityX(-350);
                return;
            }
                this.setVelocityX(-160);
            //  this.scene.anims.play('left', true);
        }
        else if (cursors.right.isDown) {
            if (this.fastSpeed === 1) {
                this.setVelocityX(250);
                return;
            }
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


    isOnLadder() {
        this.onLadder = true;
        console.log(this.onLadder);
    }


    //Removes red from getting hit by object
    redCheck(time) {
        if (this.red === 1) {
            if (time - this.redTicket>1500) {
                this.red = 0;
                this.setTint();
                this.redTicket = time + 3000;
            }
        }
    }

    checkImmortalaty(time) {

        if (this.noDamage === 1) {
            if (time - this.damageTicket > 4000) {
                this.setTint();
                this.noDamage = 0;
            }
        }
    }

    checkSpeedTime(time) {
        if (this.fastSpeed === 1) {
            if (time - this.fastSpeedTicket > 4000) {
                this.fastSpeed = 0;
            }
        }
    }


    checkChest(time) {

    }
}
