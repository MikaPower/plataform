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



    }


    fireBomb(time) {
        if (time > this.bombTicket) {
            //X is where X
            var bomb = this.bombs.create(this.x, 16, 'bomb');
            bomb.setBounce(0.9);
            bomb.setCollideWorldBounds(true);
            bomb.setVelocity(Phaser.Math.Between(-200, 200), 50);
            bomb.outOfBondsKill = true;
            bomb.allowGravity = false;
            this.bombTicket = time + 5000;
        }
    }




}