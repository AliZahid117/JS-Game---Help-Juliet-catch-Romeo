
let score = 0;


const moneyMultiplier = 100;

const speed = 1;


const gameState = {
    numCoordinates: {},
};
let randomCoord;

class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: "GameScene" });
    }

    preload() {
        this.load.image(
            "bob-front",
            "imageedit_12_2831237941.png"
        );
        this.load.image(
            "bob-back",
            "imageedit_12_2831237941.png"
        );
        this.load.image(
            "bob-side",
            "imageedit_12_2831237941.png"
        );
        this.load.image(
            "money",
            "Boy_5.png"
        );
        this.load.image(
            "paper",
            "imageedit_10_8756759135.png"
        );
    }

    create() {

        let scoreText = this.add.text(140, 610, `Points: ${score}`, {
            fontSize: "25px",
            fill: "#fff",
        });


        gameState.player = this.physics.add
            .sprite(240, 500, "bob-front")
            .setScale(0.8);
        this.physics.world.setBounds(0, 0, 480, 600); // Slightly above score
        gameState.player.setCollideWorldBounds(true);
        gameState.player.body.collideWorldBounds = true;

        // Create Romeo sprite
        randomCoord = assignCoords();
        gameState.money = this.physics.add
            .sprite(randomCoord.x, randomCoord.y, "money")
            .setScale(0.5);

        // Create bomb sprite group
        gameState.enemies = this.physics.add.group();

        // Collision detection between romeo and juliet sprite
        this.physics.add.overlap(gameState.player, gameState.money, () => {

            gameState.money.disableBody();

            delete gameState.numCoordinates[
                `x${gameState.money.x}y${gameState.money.y}`
            ];
            randomCoord = assignCoords();

            gameState.money.enableBody(true, randomCoord.x, randomCoord.y);

            score += Math.round(Math.random() * 10) * moneyMultiplier;

            scoreText.setText(`Points: ${score}`);

            randomCoord = assignCoords();
            gameState.enemies
                .create(randomCoord.x, randomCoord.y, "paper")
                .setScale(0.6);
        });

        // Collision detection between romeo and bomb sprite
        this.physics.add.collider(gameState.player, gameState.enemies, () =>
            this.endGame()
        );

        // Helper function to return an object containing evenly spaced x and y coordinates:
        function generateRandomCoords() {
            const randomX = Math.floor(Math.random() * 5) * 75 + 25;
            const randomY = Math.floor(Math.random() * 5) * 75 + 25;
            return { x: randomX, y: randomY };
        }

        // Helper function that returns one set of coordinates not in gameState.numCoordinates
        function assignCoords() {
            let assignedCoord = generateRandomCoords();


            while (
                gameState.numCoordinates[`x${assignedCoord.x}y${assignedCoord.y}`]
            ) {
                assignedCoord = generateRandomCoords();
            }

            gameState.numCoordinates[`x${assignedCoord.x}y${assignedCoord.y}`] = true;

            return assignedCoord;
        }
    }

    update() {
        // code to check if any arrow keys are pressed
        const cursors = this.input.keyboard.createCursorKeys();

        const rightArrow = cursors.right.isDown;
        const leftArrow = cursors.left.isDown;
        const upArrow = cursors.up.isDown;
        const downArrow = cursors.down.isDown;


        if (rightArrow === true) {
            moveBobRight();
        } else if (leftArrow === true) {
            moveBobLeft();
        } else if (upArrow === true) {
            moveBobUp();
        } else if (downArrow === true) {
            moveBobDown();
        }




        const bobXCoord = gameState.player.x;
        const bobYCoord = gameState.player.y;
        if (bobXCoord <= 32 || bobXCoord >= 448) {
            this.endGame();
        }
        if (bobYCoord <= 32 || bobYCoord >= 568) {
            this.endGame();
        }


        function moveBobRight() {
            gameState.player.flipX = false;
            gameState.player.setTexture("bob-side");
            gameState.player.setVelocityX(150 * speed);
            gameState.player.setVelocityY(0);
        }

        function moveBobLeft() {

            gameState.player.flipX = true;
            gameState.player.setTexture("bob-side");
            gameState.player.setVelocityX(-150 * speed);
            gameState.player.setVelocityY(0);
        }

        function moveBobUp() {
            gameState.player.flipX = false;
            gameState.player.setTexture("bob-back");
            gameState.player.setVelocityX(0);
            gameState.player.setVelocityY(-150 * speed);
        }

        function moveBobDown() {
            gameState.player.flipX = false;
            gameState.player.setTexture("bob-front");
            gameState.player.setVelocityX(0);
            gameState.player.setVelocityY(150 * speed);
        }
    }


    endGame() {
        // Stop sprites moving
        this.physics.pause();
        // Transition to end scene w/fade
        this.cameras.main.fade(800, 0, 0, 0, false, function (camera, progress) {
            if (progress > 0.5) {
                this.scene.stop("GameScene");
                this.scene.start("EndScene");
            }
        });
    }
}
