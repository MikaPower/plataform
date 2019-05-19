import config from './config.js';
import GameScene from './scenes/GameScene.js';
import FirstScene from "./scenes/FirstScene";


class Game extends Phaser.Game{
    constructor(){
        super(config);
        this.scene.add('GameScene',GameScene);
        this.scene.add('FirstScene',FirstScene);
        this.scene.start('FirstScene');
    }
}
new Game();