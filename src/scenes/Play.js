class Play extends Phaser.Scene {
    constructor() {
        super("play");
    }

    preload() {
        this.load.image('smallbubble', './assets/smallbubble.png');
        this.load.image('bigbubble', './assets/bigbubble.png');
        this.load.image('waterbackground', './assets/waterbackground.png');
        this.load.image('dart', './assets/dart.png');
        this.load.spritesheet('smallbubblepop', './assets/smallbubblepop.png', {frameWidth: 64, frameHeight: 64, startFrame: 0, endFrame: 5});
        this.load.spritesheet('bigbubblepop', './assets/bigbubblepop.png', {frameWidth: 64, frameHeight: 64, startFrame: 0, endFrame: 5})
        this.load.audio('dartthrow', './assets/dartthrowing.wav');
        this.load.audio('bubblespop', './assets/bubblespop.mp3');
        this.load.audio('bubble_pop', './assets/bubblepop.mp3');
    }

    create() {
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

        this.bg = this.add.tileSprite(0,0, game.config.width, game.config.height, 'waterbackground').setOrigin(0, 0);
        this.add.rectangle(0, 0, game.config.width, borderUISize, 0xffffff).setOrigin(0, 0);
        this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize, 0xffffff).setOrigin(0,0);
        this.add.rectangle(0, 0, borderUISize, game.config.height, 0xffffff).setOrigin(0.0);
        this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.width, 0xffffff).setOrigin(0,0);
        
        this.p1Rocket = new Dart(this, game.config.width/2, 10, 'dart').setOrigin(0.5, 0);
        this.p1Rocket.reset();

        this.ship01 = new SmallBubble(this, game.config.width + borderUISize*6, borderUISize*4, 'smallbubble', 0, 50).setOrigin(0, 0);
        this.ship02 = new Bubble(this, game.config.width + borderUISize*3, borderUISize*5 + borderPadding*2, 'bigbubble', 0, 20).setOrigin(0,0);
        this.ship03 = new Bubble(this, game.config.width, borderUISize*6 + borderPadding*4, 'bigbubble', 0, 10).setOrigin(0,0);

        this.anims.create({
            key: 'bigbubblepop',
            frames: this.anims.generateFrameNumbers('bigbubblepop', {start: 0, end: 5, first: 0}),
            frameRate: 30
        });

        this.anims.create({
            key: 'smallbubblepop',
            frames: this.anims.generateFrameNumbers('smallbubblepop', {start: 0, end: 5, first: 0}),
            frameRate: 30
        });

        this.p1Score = 0;
        this.scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#57e1ff',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100
        }
        this.scoreLeft = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding * 2, this.p1Score, this.scoreConfig);
        this.gameOver = false;
        this.scoreConfig.fixedWidth = 0;
        this.time = 10000;
        this.timeRight = this.add.text(game.config.width - (borderUISize*5 + borderPadding*2), borderUISize + borderPadding * 2,"time: " + Math.floor(this.time / 1000), this.scoreConfig)
    }
    update(time, delta) {
        if (this.time > 0) {
            this.timeRight.text = "time: " + Math.floor(this.time / 1000);
            this.time -= delta;
        }
        else {
            this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', this.scoreConfig).setOrigin(0.5);
            this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press (R) to Restart or ← for Menu', this.scoreConfig).setOrigin(0.5);
            this.gameOver = true;
        }
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyR)) {
            this.scene.restart();
        }
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.scene.start("menu");
        }
        this.bg.tilePositionX += 4;
        if (!this.gameOver) {
            this.p1Rocket.update();
            this.ship01.update();            // update spaceships (x3)
            this.ship02.update();
            this.ship03.update();
        }
        if (this.checkCollision(this.p1Rocket, this.ship03)) {
            this.p1Rocket.reset();
            this.bigBubblePop(this.ship03);
        }
        if (this.checkCollision(this.p1Rocket, this.ship02)) {
            this.p1Rocket.reset();
            this.bigBubblePop(this.ship02);
        }
        if (this.checkCollision(this.p1Rocket, this.ship01)) {
            this.p1Rocket.reset();
            this.smallBubblePop(this.ship01);
        }
    }
    
    checkCollision(rocket, ship) {
        if (rocket.x < ship.x + ship.width &&
            rocket.x + rocket.width > ship.x &&
            rocket.y < ship.y + ship.height &&
            rocket.height + rocket.y > ship.y) {
                return true;
            }
        else {
            return false;
        }
    }

    bigBubblePop(ship) {
        ship.alpha = 0;
        let boom = this.add.sprite(ship.x, ship.y, 'bigbubblepop').setOrigin(0, 0);
        boom.anims.play('bigbubblepop');
        boom.on('animationcomplete', () => {
            ship.reset();
            ship.alpha = 1;
            boom.destroy();
        });
        this.p1Score += ship.points;
        this.scoreLeft.text = this.p1Score;
        this.sound.play('bubble_pop');
        this.time += 1000;
    }

    smallBubblePop(ship) {
        ship.alpha = 0;
        let boom = this.add.sprite(ship.x, ship.y, 'smallbubblepop').setOrigin(0, 0);
        boom.anims.play('smallbubblepop');
        boom.on('animationcomplete', () => {
            ship.reset();
            ship.alpha = 1;
            boom.destroy();
        });
        this.p1Score += ship.points;
        this.scoreLeft.text = this.p1Score;
        this.sound.play('bubble_pop');
        this.time += 1000;
    }

    decreaseTime() {
        this.time -= 1;
    }
}