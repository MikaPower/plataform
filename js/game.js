import config from './config.js';
import GameScene from './scenes/GameScene.js';

class Game extends Phaser.Game{
    constructor(){
        super(config);
        this.scene.add('FirstScene',GameScene);
        this.scene.start('FirstScene');
    }
}
new Game();