import Bomb from "./bomb";

export default class Boss extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'boss');

        scene.add.existing(this);
        scene.physics.add.existing(this);
        scene.physics.world.enable(this);
        //  Player physics properties. Give the little guy a slight bounce.
        /*   player.setBounce(0.2);
           player.setCollideWorldBounds(true);*/

        this.bombTicket=0;
        this.bombs = this.scene.physics.add.group({});

        this.bombSpecialTicket=0;
        this.bombsSpecial = this.scene.physics.add.group({});

        this.hasShot=0;
        this.hasShotTicket=0;



    }


    fireBomb(time) {
        if (time > this.bombTicket) {
            //X is where X
            var bomb = this.bombs.create(this.x, 16, 'bomb');
            bomb.setBounce(0.9);
            bomb.setCollideWorldBounds(true);
            bomb.setVelocity(Phaser.Math.Between(-200, 200), Phaser.Math.Between(200, 400));
            bomb.outOfBondsKill = true;
           // bomb.angle(90);
            bomb.allowGravity = false;
            this.bombTicket = time + 3000;
           this.anims.play('bossBomb', true);
            this.hasShot=1;
            this.hasShotTicket=time;
        }
    }


    checkShot(time) {
        if (this.hasShot === 1) {
            if (time - this.hasShotTicket > 500) {
                this.hasShot = 0;
                this.anims.play('bossStop', true);
            }
        }
    }


    fireSpecial(time) {
        if (time > this.bombSpecialTicket) {
            //X is where X
            var bomb = this.bombsSpecial.create(this.x, this.y, 'pokeball');
            bomb.setVelocity(Phaser.Math.Between(-200, 400), Phaser.Math.Between(20, 50));
            bomb.outOfBondsKill = true;
            // bomb.angle(90);
            bomb.allowGravity = false;
            this.bombSpecialTicket = time + 10000;
            this.anims.play('bossSpecial', true);
            this.hasShot=1;
            this.hasShotTicket=time;
        }
    }




}