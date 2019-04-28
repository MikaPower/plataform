export default class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene,x,y,'dude');

        scene.add.existing(this);
        scene.physics.add.existing(this);
        scene.physics.world.enable(this);
        //  Player physics properties. Give the little guy a slight bounce.
        player.setBounce(0.2);
        player.setCollideWorldBounds(true);
    }

}
