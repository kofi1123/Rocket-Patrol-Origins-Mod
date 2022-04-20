/*
    Name: Kofi Quansah
    Project Title: Bubble Pop!
    Date: 4/20/2021
    TTF: 11 hrs

    Point Breakdown:
    Redesign the game's artwork, UI, and sound to change its theme/aesthetic (to something other than sci-fi) (60)
    Create a new spaceship type (w/ new artwork) that's smaller, moves faster, and is worth more points (20)
    Implement a new timing/scoring mechanism that adds time to the clock for successful hits (20)
*/
let config = {
    type: Phaser.CANVAS,
    width: 640,
    height: 480,
    scene: [Menu, Play],
};

let keyF, keyR, keyLEFT, keyRIGHT

let borderUISize = config.height / 15;
let borderPadding = borderUISize / 3
let game = new Phaser.Game(config);