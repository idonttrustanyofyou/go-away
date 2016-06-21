"use strict";

var enemies = [];
var enemyGroupName = "enemyGroup";
var score = 0;
var start = currentDate();
var spawnCheck = currentDate();

var playerInfo = {
    "id": "player",
    "anim": newGQAnimation("img/ship.png"),
    "leftAnim": newGQAnimation("img/playerLeftfixed.png"),
    "rightAnim": newGQAnimation("img/playerRightFixed.png"),
    "height": 40,
    "width": 40,
    "turnWidth" : 23,
    "speedHeight" : 23,
    "xloc": PLAYGROUND_WIDTH / 2,
    "yloc": PLAYGROUND_HEIGHT / 2,
    "xspeed": 0,
    "yspeed": 0,
    "accel": 0.5,
    "live": true
};

var splashScreenInfo = {
    "id": "splashscreen",
    "anim": newGQAnimation("img/menu.png", 2, PLAYGROUND_WIDTH, 1000, $.gQ.ANIMATION_HORIZONTAL),
    "height": PLAYGROUND_HEIGHT,
    "width": PLAYGROUND_WIDTH,
    "xloc": 0,
    "yloc": 0
};

var laser1Info = {
    "id": "laser0",
    "anim": newGQAnimation("img/LAYSHER.png"),
    "height": 30,
    "width": 10,
    "xloc": -50,
    "yloc": -50,
    "xspeed": 0,
    "yspeed": 0
};

var laser2Info = {
    "id": "laser1",
    "anim": newGQAnimation("img/LAYSHER.png"),
    "height": 30,
    "width": 10,
    "xloc": -50,
    "yloc": -50,
    "xspeed": 0,
    "yspeed": 0
};

var scoreboard = {
    "id": "score",
    "width": 100,
    "height": 20
};

var controls = {
    "id": "controls",
    "width": 280,
    "height": 20,
    "xloc": PLAYGROUND_WIDTH - 280,
    "yloc": 0
};

var backgroundInfo = {
    "id": "background",
    "anim": newGQAnimation("img/background.png"),
    "height": PLAYGROUND_HEIGHT,
    "width": PLAYGROUND_WIDTH,
    "xloc": 0,
    "yloc": 0
};

var gameOverInfo = {
  "id":"gameover",
  "anim": newGQAnimation("img/youDied.png"),
  "height" : PLAYGROUND_HEIGHT,
  "width" : PLAYGROUND_WIDTH,
  "xloc" : - 300000,
  "yloc" : - 300000
};

var setup = function() {
    var backgroundGroup = "background";
    createGroupInPlayground(backgroundGroup);
    var scoreboardGroup = "scoreboard";
    createGroupInPlayground(scoreboardGroup);
    createGroupInPlayground(enemyGroupName);
    var laserGroupName = "laserGroup";
    createGroupInPlayground(laserGroupName);
    var playerGroupName = "playerGroup";
    createGroupInPlayground(playerGroupName);
    var menuGroupName = "menuGroup";
    createGroupInPlayground(menuGroupName);
    createSpriteInGroup(backgroundGroup, backgroundInfo["id"], backgroundInfo["anim"], backgroundInfo["width"], backgroundInfo["height"]);
    createSpriteInGroup(playerGroupName, playerInfo["id"], playerInfo["anim"], playerInfo["width"], playerInfo["height"]);
    createSpriteInGroup(menuGroupName, splashScreenInfo["id"], splashScreenInfo["anim"], splashScreenInfo["width"], splashScreenInfo["height"], splashScreenInfo["xloc"], splashScreenInfo["yloc"]);
    createSpriteInGroup(menuGroupName, gameOverInfo["id"], gameOverInfo["anim"], gameOverInfo["width"], gameOverInfo["height"], gameOverInfo["xloc"], gameOverInfo["yloc"]);
    createSpriteInGroup(laserGroupName, laser1Info["id"], laser1Info["anim"], laser1Info["width"], laser1Info["height"], laser1Info["xloc"], laser1Info["yloc"]);
    createSpriteInGroup(laserGroupName, laser2Info["id"], laser2Info["anim"], laser2Info["width"], laser2Info["height"], laser2Info["xloc"], laser2Info["yloc"]);
    createTextSpriteInGroup(scoreboardGroup, scoreboard["id"], scoreboard["width"], scoreboard["height"]);
    createTextSpriteInGroup(scoreboardGroup, controls["id"], controls["width"], controls["height"], controls["xloc"], controls["yloc"]);
    sprite(controls["id"]).text("Up: w Left: a Right: d Down: s Shoot: f");
};

var begin = function() {
    if (getKeyState(13)) {
        splashScreenInfo["xloc"] = -9999;
        spriteSetX(splashScreenInfo["id"], splashScreenInfo["xloc"]);
        newEnemy();
    };
};

var playerMove = function() {
    if (getKeyState(65)) { //a left
        playerInfo["xspeed"] = playerInfo["xspeed"] - playerInfo["accel"];
        spriteSetAnimation(playerInfo["id"], playerInfo["leftAnim"]);
        spriteSetWidthHeight(playerInfo["id"], playerInfo["turnWidth"], playerInfo["height"]);
    } else if (getKeyState(68)) { //d
        playerInfo["xspeed"] = playerInfo["xspeed"] + playerInfo["accel"];
        spriteSetAnimation(playerInfo["id"], playerInfo["rightAnim"]);
        spriteSetWidthHeight(playerInfo["id"], playerInfo["turnWidth"], playerInfo["height"]);
    } else {
        spriteSetAnimation(playerInfo["id"], playerInfo["anim"]);
        spriteSetWidthHeight(playerInfo["id"], playerInfo["width"], playerInfo["height"]);
    };
    if (playerInfo["xloc"] > PLAYGROUND_WIDTH) {
        playerInfo["xloc"] = 0 - playerInfo["width"];
    };
    if (playerInfo["xloc"] < 0 - playerInfo["width"]) {
        playerInfo["xloc"] = PLAYGROUND_WIDTH;
    };
    if (getKeyState(87)) { //w
        playerInfo["yspeed"] = playerInfo["yspeed"] - playerInfo["accel"];
    } else if (getKeyState(83)) { //s
        playerInfo["yspeed"] = playerInfo["yspeed"] + playerInfo["accel"];
    };
    if (playerInfo["yloc"] > PLAYGROUND_HEIGHT) {
        playerInfo["yloc"] = 0 - playerInfo["height"];
    };
    if (playerInfo["yloc"] < 0 - playerInfo["height"]) {
        playerInfo["yloc"] = PLAYGROUND_HEIGHT;
    };
    playerInfo["xloc"] = playerInfo["xloc"] + playerInfo["xspeed"];
    playerInfo["yloc"] = playerInfo["yloc"] + playerInfo["yspeed"];
    spriteSetXY(playerInfo["id"], playerInfo["xloc"], playerInfo["yloc"]);
};

var shoot = function() {
    var count = currentDate();
    var run = count - start;
    if (getKeyState(70)) { //x
        if (laser1Info["yloc"] < 0 && run > 750) {
            laser1Info["xloc"] = playerInfo["xloc"] + playerInfo["width"] / 2 - laser1Info["width"] / 2;
            laser1Info["yloc"] = playerInfo["yloc"] + playerInfo["height"] / 2 - laser1Info["width"] / 2;
            laser1Info["yspeed"] = -10;
            laser1Info["xspeed"] = playerInfo["xspeed"];
            start = currentDate();
        } else if (laser2Info["yloc"] < 0 && laser1Info["yloc"] > 0 && run > 750) {
            laser2Info["xloc"] = playerInfo["xloc"] + playerInfo["width"] / 2 - laser2Info["width"] / 2;
            laser2Info["yloc"] = playerInfo["yloc"] + playerInfo["height"] / 2 - laser2Info["width"] / 2;
            laser2Info["yspeed"] = -10;
            laser2Info["xspeed"] = playerInfo["xspeed"];
            start = currentDate();
        }
    }
};

var move = function(laser) {
    laser["xloc"] = laser["xloc"] + laser["xspeed"];
    laser["yloc"] = laser["yloc"] + laser["yspeed"];
    spriteSetXY(laser["id"], laser["xloc"], laser["yloc"]);
};

var enemyMove = function(laser) {
    if (laser["live"] == true) {
        if (laser["xloc"] > PLAYGROUND_WIDTH - laser["widthCorrect"]) {
            laser["xspeed"] = -1 * laser["xspeed"];
            laser["xloc"] = PLAYGROUND_WIDTH - laser["widthCorrect"];
        }
        if (laser["xloc"] < 0) {
            laser["xspeed"] = -1 * laser["xspeed"];
            laser["xloc"] = 0;
        }
        if (laser["yloc"] > PLAYGROUND_HEIGHT - laser["height"]) {
            laser["yspeed"] = -1 * laser["yspeed"];
            laser["yloc"] = PLAYGROUND_HEIGHT - laser["height"];
        }
        if (laser["yloc"] < 0) {
            laser["yspeed"] = -1 * laser["yspeed"];
            laser["yloc"] = 0;
        }
    }
    laser["xloc"] = laser["xloc"] + laser["xspeed"];
    laser["yloc"] = laser["yloc"] + laser["yspeed"];
    spriteSetXY(laser["id"], laser["xloc"], laser["yloc"]);
};

var newEnemy = function() {
    var index = enemies.length;
    enemies[index] = {
        "id": index,
        "anim": newGQAnimation("img/greenGuy.png"),
        "width": 30,
        "height": 30,
        "xloc": Math.random() * PLAYGROUND_WIDTH,
        "yloc": Math.random() * PLAYGROUND_HEIGHT,
        "xspeed": Math.random() * 10 - 5,
        "yspeed": Math.random() * 10 - 5,
        "widthCorrect": 50,
        "live": true
    };
    createSpriteInGroup(enemyGroupName, enemies[index]["id"], enemies[index]["anim"], enemies[index]["width"], enemies[index]["height"], enemies[index]["xloc"], enemies[index]["yloc"]);
    spawnCheck = currentDate();
};

var enemyHit = function() {
    if (currentDate() - spawnCheck > 500) {
        spriteSetXY(gameOverInfo["id"], 0, 0);
        playerInfo["live"] = false;
    }
};

var scoreKeep = function() {
    sprite(scoreboard["id"]).text("Score: " + score);
};

var draw = function() {
    if (playerInfo["live"] == true) {
        playerMove();
        begin();
        shoot();
        move(laser1Info);
        move(laser2Info);
        var numOfEnemies = 0;
        scoreKeep();
        var enemyCount = enemies.length;
        while (numOfEnemies < enemyCount) {
            var laserHit = function(collIndex, hitSprite) {
                var enemyId = spriteId(hitSprite);
                var enemyDictionary = enemies[enemyId];
                enemyDictionary["yloc"] = PLAYGROUND_HEIGHT + 1000;
                enemyDictionary["yspeed"] = 0;
                enemyDictionary["xspeed"] = 0;
                enemyDictionary["live"] = false;
                newEnemy();
                newEnemy();
                score = score + 250;
            };
            enemyMove(enemies[numOfEnemies]);
            numOfEnemies = numOfEnemies + 1;
        }
        forEachSpriteGroupCollisionDo(laser1Info["id"], enemyGroupName, laserHit);
        forEachSpriteGroupCollisionDo(laser2Info["id"], enemyGroupName, laserHit);
        forEachSpriteGroupCollisionDo(playerInfo["id"], enemyGroupName, enemyHit);
    } else if (playerInfo["live"] == false) {
        if (getKeyState(82)) { //r
            splashScreenInfo["xloc"] = 0;
            spriteSetX(splashScreenInfo["id"], splashScreenInfo["xloc"]);
            numOfEnemies = 0;
            enemyCount = enemies.length;
            while (numOfEnemies < enemyCount) {
                var enemyDictionary = enemies[numOfEnemies];
                enemyDictionary["yloc"] = PLAYGROUND_HEIGHT + 1000;
                enemyDictionary["yspeed"] = 0;
                enemyDictionary["xspeed"] = 0;
                enemyDictionary["live"] = false;
                enemyMove(enemies[numOfEnemies]);
                numOfEnemies = numOfEnemies + 1;
            }
            playerInfo["xloc"] = PLAYGROUND_WIDTH / 2;
            playerInfo["yloc"] = PLAYGROUND_HEIGHT / 2;
            playerInfo["xspeed"] = 0;
            playerInfo["yspeed"] = 0;
            score = 0;
            playerInfo["live"] = true;
            laser1Info["xloc"] = - 20;
            laser2Info["xloc"] = - 20;
            spriteSetXY(gameOverInfo["id"], gameOverInfo["xloc"], gameOverInfo["yloc"]);
        }
    }
};
