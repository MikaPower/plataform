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
        this.load.image('speed', 'assets/speed28x28.png');
        this.load.image('heart', 'assets/heart24x22.png');
        this.load.image('lava', 'assets/lava479x30.png');
        this.load.image('terrain', 'assets/terrain400x32.png');
        this.load.image('rock', 'assets/rock400x32.png');
        this.load.image('rock450x32', 'assets/rock450x32.png');
        this.load.image('deformat', 'assets/deformat400x32.png');
        this.load.image('bossterrain', 'assets/bossterrain350x32.png');
        this.load.image('bossterrain280', 'assets/bossterrain280x32.png');
        this.load.image('bossterrain250', 'assets/bossterrain250x32.png');
        this.load.image('bossterrain210', 'assets/bossterrain210x32.png');
        this.load.image('terrainlast', 'assets/terrainlast400x32.png');
        this.load.image('treasure', 'assets/treasure30x30.png');
        this.load.image('door', 'assets/door30x30.png');
        this.load.image('key','assets/key50x30.png');

    }


    create(time) {
        this.onLadder = false;
        this.portalTicket = 0;
        this.heartTicket = 0;
        this.starsNumbers = 0;
        this.speedTicket = 0;
        this.clock = 0;

        this.compoGui();
        this.createPlataforms();
        this.createLava();
        this.createPlayer();
        this.playerAnimations();
        this.createBoss();
        this.addInputs();
        this.createGroups();


        //  The score
        this.addColisions(time);
        this.addEvents(time)

    }

    update(time, delta) {
       // console.log(this.player.x, this.player.y);
        this.player.onLadder = false;
        this.player.body.gravity.y = 0;

console.log(this.gameWon);
        if (this.player.life > 0) {
            if (this.gameWon) {
                this.winGame();
                if (Phaser.Input.Keyboard.JustDown(this.spaceBar)) {
                    this.scene.restart();
                }
            }
            this.addEvents(time);
            this.checkBombPosition();
            this.player.update(this.cursors, this.playerPlataform);
        }
        else {
            this.add.text(150, 200, "Game Over\nRestart?", {
                font: "50px Cambria",
                fill: "#000000"
            });
            this.stopEvents();
            // this.gameSound.stop();
            this.player.x = 275;
            this.player.y = 200;
            this.player.setGravityY(0);
            if (Phaser.Input.Keyboard.JustDown(this.spaceBar)) {
                this.scene.restart();
            }


        }
    }


    addColisions(time) {
        //  Collide the player and the stars with the platforms
        this.physics.add.collider(this.boss, this.platforms);
        this.playerPlataform = this.physics.add.collider(this.player, this.platforms);
        this.physics.add.collider(this.stars, this.platforms);
        this.physics.add.collider(this.portals, this.platforms);
        this.physics.add.collider(this.immortals, this.platforms);
        this.physics.add.collider(this.speedPowerUp, this.platforms);
        this.physics.add.collider(this.boss.bombs, this.platforms);
        this.physics.add.collider(this.chests, this.platforms);
        this.physics.add.collider(this.doors, this.platforms);
        this.physics.add.collider(this.keys, this.platforms);
        //  Checks to see if the player overlaps with any of the stars, if he does call the collectStar function
        this.physics.add.overlap(this.player, this.stars, this.collectStar, null, this);
        this.physics.add.collider(this.player, this.boss.bombs, this.hitBomb, null, this);

        //Player and Portal
        this.physics.add.overlap(this.player, this.portals, this.portalCreateTeleport, null, this);

        //Player and heart
        this.physics.add.overlap(this.player, this.immortals, this.heartCollision, null, this);
        //Player and speed
        this.physics.add.overlap(this.player, this.speedPowerUp, this.speedCollision, null, this);
        //Player and ladder
        this.physics.add.overlap(this.player, this.ladders, this.player.isOnLadder, null, this);
        //Player and Chest
        this.physics.add.overlap(this.player, this.chests, this.playerChestCollision, null, this);
        //Player and Door
        this.physics.add.overlap(this.player, this.doors, this.PlayerDoorCollision, null, this);
        //Player and Key
        this.physics.add.overlap(this.player, this.keys, this.playerKeyCollision, null, this);
        //Bombs and Lava
        this.physics.add.collider(this.boss.bombs, this.lavaPlataform, GameScene.bombLavaCollision, null, this);

        //Player and Lava
        this.physics.add.collider(this.player, this.lavaPlataform, GameScene.playerLavaCollision, null, this);
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
        this.timerPortal = this.time.addEvent({
            delay: 100,
            callback: this.createPortal(time),
            callbackScope: this,
            repeat: 50
        });

        this.timerHeartz = this.time.addEvent({
            delay: 100,
            callback: this.createHeart(time),
            callbackScope: this,
            repeat: 50
        });
        this.timerSpeed = this.time.addEvent({
            delay: 100,
            callback: this.createSpeedUp(time),
            callbackScope: this,
            repeat: 50
        });
        this.timerCheckSpeed = this.time.addEvent({
            delay: 100,
            callback: this.player.checkSpeedTime(time),
            callbackScope: this,
            repeat: 50
        });


        /*    this.timerEnemyRedColor = this.time.addEvent({
                delay: 100,
                callback: this.boss.redCheck(time),
                callbackScope: this,
                repeat: -1
            });*/
        this.timerPlayerRedColor = this.time.addEvent({
            delay: 100,
            callback: this.player.redCheck(time),
            callbackScope: this,
            repeat: -1
        });
        this.timerCheckNoDamage = this.time.addEvent({
            delay: 100,
            callback: this.player.checkImmortalaty(time),
            callbackScope: this,
            repeat: -1
        });




    }

    stopEvents() {

        this.timerFire.destroy();
        this.timerCheckSpeed.destroy();
        this.timerCheckNoDamage.destroy();
        this.timerHeartz.destroy();
        this.timerPlayerRedColor.destroy();
        this.timerPortal.destroy();
        this.timerPositionBomb.destroy();
        this.timerSpeed.destroy();

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
        this.player = new Player(this, 100, 700, 'dude');

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

    addInputs() {
        //  Input Events
        this.cursors = this.input.keyboard.createCursorKeys();
        this.spaceBar = this.input.keyboard.addKey(
            Phaser.Input.Keyboard.KeyCodes.SPACE
        );
    }


    compoGui() {
        //  A simple background for our game
        this.add.image(0, 0, 'sky').setOrigin(0.0);
        //  The platforms group contains the ground and the 2 ledges we can jump on
        this.platforms = this.physics.add.staticGroup();

        this.lavaPlataform = this.physics.add.staticGroup();


        //  Here we create the ground.
        //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
        // this.add.image(0, 0, "background").setOrigin(0, 0);
        this.platforms.create(400, 800, 'ground').setScale(2).refreshBody();
        this.gameWon = false;


        this.labelCoins = this.add.text(160, 20, "Coins: 0", {
            font: "30px Cambria",
            fill: "#000000"
        });
        this.labelLife = this.add.text(290, 20, "Health: 100", {
            font: "30px Cambria",
            fill: "#ffffff"
        });


    }


    collectStar(player, star) {
        star.disableBody(true, true);

        //  Add and update the score
        this.starsNumbers++;
        this.starsNumbers=30;
        if (this.starsNumbers === 30) {
            var chest = this.chests.create(541, 120, 'treasure');
            this.keys.create(758,734,'key');
        }


        //var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
        this.labelCoins.setText("Coins: " + this.starsNumbers);
    }


    createPlataforms() {
        //  Now let's create some ledges
        //BOSS
        this.platforms.create(150, 150, 'bossterrain210');
        this.platforms.create(550, 150, 'bossterrain210');

        //this.platforms.create(300, 150, 'bossground');
        //

        this.platforms.create(250, 400, 'rock450x32');
        //     this.platforms.create(400, 400, 'bossground');
        this.platforms.create(850, 400, 'rock');


        this.platforms.create(200, 500, 'bossground');
        this.platforms.create(700, 500, 'bossground');


        this.platforms.create(250, 600, 'terrain');
        this.platforms.create(800, 600, 'deformat');

        this.platforms.create(400, 700, 'terrain');
        this.platforms.create(900, 700, 'terrain');

        this.platforms.create(50, 250, 'terrainlast');
        this.platforms.create(600, 250, 'terrainlast');

    }

    portalCreateTeleport(player, portal51x42) {

        if (this.portalCreated === 0) {
            var positions = [
                [614, 744],
                [649, 560],
                [222, 459],
                [360, 720],
                [360, 122],
                [754, 459],
                [459, 195],
                [360, 101.3]];


            this.portals.children.iterate(function (child) {
                //  Give each star a slightly different bounce
                child.destroy();

            });
            var indexA = Math.round(Math.random() * (7));
            //  console.log(positions[indexA][0], positions[indexA][1]);
            this.listportal = this.portals.create(positions[indexA][0], positions[indexA][1], 'portal51x42');
            player.x = positions[indexA][0] - 100;
            player.y = positions[indexA][1];
            this.portalCreated = 1;
        }
    }

    createPortal(time) {


        var positions = [
            [614, 744],
            [649, 560],
            [222, 459],
            [360, 720],
            [360, 122],
            [754, 459],
            [459, 195],
            [360, 120.3]];


        if (time > this.portalTicket) {
            this.portalCreated = 0;
            this.portals.children.iterate(function (child) {

                child.destroy();

            });
            var indexA = Math.round(Math.random() * (7));

            //  console.log(positions[indexA][0], positions[indexA][1]);
            var portal = this.portals.create(positions[indexA][0], positions[indexA][1], 'portal51x42');
            this.portalTicket = time + Math.round(Math.random() * (15000 - 10000) + 10000);
        }

    }

    createGroups() {
        //  Some stars to collect, 12 in total, evenly spaced 70 pixels apart along the x axis
        this.stars = this.physics.add.group({
            key: 'star',
            repeat: 11,
            setXY: {x: 200, y: 0, stepX: 70}
        });

        var x = 146;
        for (var i = 0; i < 6; i++) {
            this.stars.create(x, 744, 'star');
            x += 70;
        }
        x = 80;
        for (var i = 0; i < 6; i++) {
            this.stars.create(x, 550, 'star');
            x += 70;
        }
        x = 719;
        for (var i = 0; i < 6; i++) {
            this.stars.create(x, 440, 'star');
            x += 70;
        }


        this.stars.children.iterate(function (child) {
            //  Give each star a slightly different bounce
            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));

        });

        //Portals
        this.portals = this.physics.add.group();

        //Doors
        this.doors = this.physics.add.group();
        //Ladders
        this.ladders = this.physics.add.group();
        //enable all bodies in this group for physics
        this.ladders.enableBody = true;
        //then add out sprite to the group
        var ladder = this.ladders.create(635, 438, 'ladder43x69');
        //make it sure this object doesn't move
        ladder.body.immovable = true;
        ladder.body.moves = false;


        //Immortal

        this.immortals = this.physics.add.group();
        this.speedPowerUp = this.physics.add.group();
        this.chests = this.physics.add.group();
        this.keys = this.physics.add.group();

    }

    createHeart(time) {

        if (time > this.heartTicket) {

            this.immortals.children.iterate(function (child) {
                //  Give each star a slightly different bounce
                child.destroy();
            });


            var positions = [[706, 560], [60, 760], [318, 660], [153, 459], [127, 210], [766, 212]];
            var indexA = Math.round(Math.random() * (5));

            var heart = this.immortals.create(positions[indexA][0], positions[indexA][1], 'heart');
            this.heartTicket = time + 14000;
        }
    }

    createSpeedUp(time) {

        if (time > this.speedTicket) {
            this.speedPowerUp.children.iterate(function (child) {
                //  Give each star a slightly different bounce
                child.destroy();
            });


            var positions = [[604, 210], [460, 359], [590, 660]];
            var indexA = Math.round(Math.random() * (2));

            var speed = this.speedPowerUp.create(positions[indexA][0], positions[indexA][1], 'speed');
            this.speedTicket = time + 20000;
        }
    }


    heartCollision(player, immortalls) {
        this.player.noDamage = 1;
        this.player.damageTicket = this.time.now;
        immortalls.destroy();
        this.player.setTint(0x00ff00);
    }


    speedCollision(player, speedPowerUp) {
        this.player.fastSpeed = 1;
        this.player.fastSpeedTicket = this.time.now;
        speedPowerUp.destroy();
    }

    createLava() {
        this.lavaPlataform.create(1040, 785, 'lava');
    }

    static playerLavaCollision(player, lavaPlataform) {
        player.life = 0;
        player.setTint(0xff0000);


    }

    static bombLavaCollision(bomb, lavaPlataform) {
        bomb.destroy();

    }

    hitBomb(player, bomb) {


        if (player.noDamage === 0) {
            this.player.life -= 20;
            this.labelLife.setText("Health: " + this.player.life);
            // this.physics.pause();
            this.player.setTint(0xff0000);
            player.anims.play('turn');
            this.player.red = 1;
            this.player.redTicket = this.time.now;
            bomb.destroy();
            // this.gameOver = true;
        }
        console.log(player.anims);
        player.anims.play('left');

        bomb.destroy();
    }


    playerChestCollision(player, chests) {


        console.log(this.player.key);
        if(this.player.key===true) {
            chests.destroy();
            //AFter starts collected
            this.platforms.create(1220, 200, 'bossterrain210');
            this.createDoor();
        }
    }

    createDoor() {
        this.doors.create(1212, 165, 'door');
    }

    PlayerDoorCollision() {
        this.gameWon = true;
    }

    playerKeyCollision(player, keys) {
        this.player.key = true;
        keys.destroy();
    }


    // Text to display if won
    winGame() {
        this.add.text(150, 200, "Game Won\nCongratulations!!!!", {
            font: "50px Cambria",
            fill: "#ffeb10"
        });
        this.stopEvents();
        this.physics.pause();
        this.player.x = 275;
        this.player.y = 200;
        this.player.setGravityY(0);
    }
}
