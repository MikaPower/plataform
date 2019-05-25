import Ship from '../models/bomb.js';
import Boss from '../models/boss.js';
import Player from '../models/player';

export default class FirstScene extends Phaser.Scene {
    constructor() {
        super({key: 'FirstScene'});
    }

    preload() {
        this.load.image('sky', 'assets/background.png');
        this.load.image('ground', 'assets/platform.png');
        this.load.image('star', 'assets/star.png');
        this.load.image('bomb', 'assets/bomb.png');
        this.load.image('bossground', 'assets/plataformboss.png');
        this.load.spritesheet('boss', 'assets/bossAni.png',{frameWidth: 30, frameHeight: 30});
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
        this.load.image('key', 'assets/key50x30.png');
         this.load.audio("titleTheme", "assets/piratesFirstScene.mp3");


    }

    create() {
        this.add.image(0, 0, 'sky').setOrigin(0.0);
        this.add.text(200, 100, "Planet  X", {
            font: "50px Cambria",
            fill: "#ffeb10"
        });

        this.add.text(700, 280, "Collect all starts, after that, the chest will appear.", {
            font: "25px Arial",
            fill: "#0fff84"
        });
        this.add.text(700, 310, "Put the stars on the chest.", {
            font: "25px Arial",
            fill: "#0fff84"
        });
        this.add.text(700, 340, "The chest only open with a key", {
            font: "25px Arial",
            fill: "#0fff84"
        });
        this.add.text(700, 370, "Find the exit door to win the game", {
            font: "25px Arial",
            fill: "#0fff84"
        });







        this.stars = this.physics.add.group();
        var star = this.stars.create(210, 200, 'star');
        star.body.immovable = true;
        star.body.moves = false;
        this.add.text(240, 188, "Starts to Collect", {
            font: "25px Arial",
            fill: "#FFFFFF"
        });

        this.portals = this.physics.add.group();
        var portal = this.portals.create(210, 245, 'portal51x42');
        portal.body.immovable = true;
        portal.body.moves = false;
        this.add.text(240, 240, "Teleports to random place", {
            font: "25px Arial",
            fill: "#FFFFFF"
        });

        this.doors = this.physics.add.group();
        var door = this.doors.create(210, 300, 'door');
        door.body.immovable = true;
        door.body.moves = false;
        this.add.text(240, 290, "Exit door", {
            font: "25px Arial",
            fill: "#FFFFFF"
        });

/*
        this.ladders = this.physics.add.group();
        var ladder = this.ladders.create(635, 438, 'ladder43x69');
        ladder.body.immovable = true;
        ladder.body.moves = false;*/


        this.immortals = this.physics.add.group();
        var immortal = this.immortals.create(210, 350, 'heart');
        immortal.body.immovable = true;
        immortal.body.moves = false;
        this.add.text(240, 340, "Immortal", {
            font: "25px Arial",
            fill: "#FFFFFF"
        });

        this.speedPowerUp = this.physics.add.group();
        var speed = this.speedPowerUp.create(210, 395, 'speed');
        speed.body.immovable = true;
        speed.body.moves = false;
        this.add.text(240, 380, "Speed", {
            font: "25px Arial",
            fill: "#FFFFFF"
        });
        this.chests = this.physics.add.group();
        var chest = this.chests.create(210, 445, 'treasure');
        chest.body.immovable = true;
        chest.body.moves = false;
        this.add.text(240, 430, "Treasure", {
            font: "25px Arial",
            fill: "#FFFFFF"
        });

        this.keys = this.physics.add.group();
        var key = this.keys.create(210, 480, 'key');
        key.body.immovable = true;
        key.body.moves = false;
        this.add.text(240, 470, "Key", {
            font: "25px Arial",
            fill: "#FFFFFF"
        });
        this.bombs = this.physics.add.group();
        var bomb = this.keys.create(210, 520, 'bomb');
        bomb.body.immovable = true;
        bomb.body.moves = false;
        this.add.text(240, 505, "Bomb", {
            font: "25px Arial",
            fill: "#FFFFFF"
        });








        /*  this.ship = new Ship(this, 100, 245);
          this.ship.setGravityY(0);*/
        this.titleSound = this.sound.add('titleTheme');
        this.titleSound.play();
        this.spaceBar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.spaceBar.on('down', function (event) {
            this.titleSound.stop();
            this.scene.stop();
            this.scene.start('GameScene');
        }.bind(this));
    }
}