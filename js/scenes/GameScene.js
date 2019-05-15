import '../phaser'
import Player from "../models/player";
import Boss from "../models/boss";


export default class GameScene extends Phaser.Scene {
    constructor(key) {
        super(key);
    }

    preload() {
        this.load.image('sky', 'assets/ambiente.png');
        this.load.image('ground', 'assets/platform.png');
        this.load.image('star', 'assets/star.png');
        this.load.image('bomb', 'assets/bomb.png');
        this.load.image('bossground', 'assets/plataformboss.png');
        this.load.image('boss', 'assets/boss.png');
        this.load.spritesheet('dude', 'assets/dude.png', {frameWidth: 32, frameHeight: 48});
        this.load.image('ladder43x69', 'assets/ladder43x100.png');
        this.load.image('portal51x42', 'assets/portal51x42');

    }


    create(time) {
        this.onLadder = false;

        this.compoGui();
        this.createPlataforms();
        this.createPlayer();
        this.playerAnimations();
        this.createBoss();


        //  Input Events
        this.cursors = this.input.keyboard.createCursorKeys();

        //  Some stars to collect, 12 in total, evenly spaced 70 pixels apart along the x axis
        this.stars = this.physics.add.group({
            key: 'star',
            repeat: 11,
            setXY: {x: 12, y: 0, stepX: 70}
        });

        this.stars.children.iterate(function (child) {
            //  Give each star a slightly different bounce
            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));

        });


        this.portals = this.physics.add.group();

        var portal = this.portals.create(150, 540, 'portal51x42');


        this.ladders = this.physics.add.group();
        //enable all bodies in this group for physics
        this.ladders.enableBody = true;
        //then add out sprite to the group
        var ladder = this.ladders.create(635, 450, 'ladder43x69');
        //make it sure this object doesn't move
        ladder.body.immovable = true;
        ladder.body.moves = false;


        //  The score
        this.addColisions();
        this.addEvents(time)

    }

    update(time, delta) {

        console.log(this.player.x + " " + this.player.y);
        this.player.onLadder = false;
        this.player.body.gravity.y = 0;

        if (this.gameOver) {
            return;
        }
        this.checkBombPosition();
        this.player.update(this.cursors, this.anims, this.playerPlataform);

    }


    addColisions() {
        //  Collide the player and the stars with the platforms
        this.physics.add.collider(this.boss, this.platforms);
        this.playerPlataform = this.physics.add.collider(this.player, this.platforms);
        this.physics.add.collider(this.stars, this.platforms);
        this.physics.add.collider(this.portals, this.platforms);
        this.physics.add.collider(this.boss.bombs, this.platforms);

        //  Checks to see if the player overlaps with any of the stars, if he does call the collectStar function
        this.physics.add.overlap(this.player, this.stars, this.collectStar, null, this);
        this.physics.add.collider(this.player, this.boss.bombs, this.hitBomb, null, this);

        //Player and Portal
        this.physics.add.overlap(this.player, this.portals, this.portalCreateTeleport, null, this);
        //Player and ladder
        this.physics.add.overlap(this.player, this.ladders, this.player.isOnLadder, null, this);
    }

    addEvents(time) {

        //Enemy shoots
        this.timerFire = this.time.addEvent({
            delay: 100,
            callback: this.boss.fireBomb(time),
            callbackScope: this,
            repeat: 50
        });
        this.timerPositionBomb = this.time.addEvent({
            delay: 100,
            callback: this.checkBombPosition(time),
            callbackScope: this,
            repeat: 50
        });

    }


    checkBombPosition() {
        //  A new batch of stars to collect
        this.boss.bombs.children.iterate(function (child) {

            var y = Math.round(child.y);

            if (y === 793) {
                child.destroy();
            }


        });
    }


    createPlayer() {
        // The player and its settings
        // player = this.physics.add.sprite(100, 450, 'dude');
        this.player = new Player(this, 200, 500, 'dude');

        //  Player physics properties. Give the little guy a slight bounce.
        this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);
    }

    createBoss() {
        //Boss and its settings
        this.boss = new Boss(this, 100, 100);

        //  Boss physics properties. Give the little guy a slight bounce.
        this.boss.setCollideWorldBounds(true);

    }


    playerAnimations() {
        //  Our player animations, turning, walking left and walking right.
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('dude', {start: 0, end: 3}),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'turn',
            frames: [{key: 'dude', frame: 4}],
            frameRate: 20
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('dude', {start: 5, end: 8}),
            frameRate: 10,
            repeat: -1
        });
    }


    compoGui() {
        //  A simple background for our game
        this.add.image(0, 0, 'sky').setOrigin(0.0);
        //  The platforms group contains the ground and the 2 ledges we can jump on
        this.platforms = this.physics.add.staticGroup();

        //  Here we create the ground.
        //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
        // this.add.image(0, 0, "background").setOrigin(0, 0);
        this.platforms.create(400, 800, 'ground').setScale(2).refreshBody();
        this.scoreText = this.add.text(16, 16, 'score: 0', {fontSize: '32px', fill: '#000'});
        this.gameOver = false;
        this.score = 0;


    }


    collectStar(player, star) {
        star.disableBody(true, true);

        //  Add and update the score
        this.score += 10;
        this.scoreText.setText('Score: ' + this.score);

        if (this.stars.countActive(true) === 0) {
            //  A new batch of stars to collect
            this.stars.children.iterate(function (child) {

                child.enableBody(true, child.x, 0, true, true);

            });

            var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

            /* var bomb = this.bombs.create(x, 16, 'bomb');
             bomb.setBounce(1);
             bomb.setCollideWorldBounds(true);
             bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
             bomb.allowGravity = false;*/

        }
    }

    hitBomb(player, bomb) {
        this.physics.pause();

        player.setTint(0xff0000);

        player.anims.play('turn');

        this.gameOver = true;
    }


    createPlataforms() {
        //  Now let's create some ledges
        //BOSS
        this.platforms.create(150, 150, 'bossground');
        this.platforms.create(300, 150, 'bossground');
        //

        this.platforms.create(250, 400, 'ground');
        this.platforms.create(400, 400, 'bossground');


        this.platforms.create(800, 400, 'ground');


        this.platforms.create(200, 500, 'bossground');
        this.platforms.create(700, 500, 'bossground');


        this.platforms.create(250, 600, 'ground');
        this.platforms.create(800, 600, 'ground');

        this.platforms.create(400, 700, 'ground');
        this.platforms.create(900, 700, 'ground');

        this.platforms.create(50, 250, 'ground');
        this.platforms.create(600, 250, 'ground');

    }

    portalCreateTeleport(player, portal51x42) {

        var positions = [
            [560, 775],
            [360, 787],
            [360, 122],
            [210, 770],
            [459, 195],
            [360, 101.3]];


        var indexA = Math.round(Math.random() * (5));
        var portal = this.portals.create(positions[indexA][0], positions[indexA][1], 'portal51x42');
        console.log("X" + positions[indexA]);
        player.x = positions[indexA][0]-100;
        player.y = positions[indexA][1];
    }
}
