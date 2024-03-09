class EndScene extends Phaser.Scene {
    constructor() {
        super({ key: 'EndScene' })
    }

    preload() {
        this.load.image('end', 'Game_over_screen.png');
    }

    create() {
        screen = this.add.image(0, 0, 'end').setOrigin(0);

       
        score = 0

        
        gameState.numCoordinates = {};

        this.input.keyboard.on('keydown', () => {
            this.scene.stop('EndScene');
            this.scene.start('GameScene');
        });
    }
}



