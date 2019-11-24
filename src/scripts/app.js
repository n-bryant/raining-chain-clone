(function() {
  var UPDATE_INTERVAL = 40; // 25fps
  var ENEMY_COUNT = 3;
  var gameStartTime = Date.now();
  var ctxEl = document.getElementById("ctx");
  if (!ctxEl) {
    alert("This game expects an element with an id of 'ctx' to run properly");
  } else {
    runGame();
  }

  var frameCount = 0;
  var score = 0;

  /**
   * Runs the game
   */
  function runGame() {
    var CANVAS_WIDTH = parseInt(ctxEl.getAttribute("width"), 10);
    var CANVAS_HEIGHT = parseInt(ctxEl.getAttribute("height"), 10);

    var ctx = ctxEl.getContext("2d");
    ctx.font = "30px Arial";

    // player
    var player = {
      width: 20,
      height: 20,
      color: "green",
      x: 50,
      spdX: 30,
      y: 40,
      spdY: 5,
      name: "P",
      hp: 10,
      attackSpeed: 1,
      attackCounter: 0,
      pressingUp: false,
      pressingRight: false,
      pressingDown: false,
      pressingLeft: false
    };

    var enemyList = {};
    var upgradeList = {};
    var bulletList = {};

    /**
     * Callback for the game update interval
     */
    var gameLoop = function() {
      // repaint
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      frameCount++;
      score++;

      // generate a new enemy every four seconds
      if (frameCount % 100 === 0) {
        createEnemy();
      }

      // generate a new upgrade every three seconds
      if (frameCount % 75 === 0) {
        createUpgrade();
      }

      // generate a new bullet every second
      player.attackCounter += player.attackSpeed;

      // update enemies
      for (var key in enemyList) {
        updateEntity(enemyList[key]);

        // test for a collision between enemy and player
        if (testRectCollision(player, enemyList[key])) {
          if (player.hp > 0) {
            player.hp -= 1;
          }
        }
      }
      // update upgrades
      for (var key in upgradeList) {
        updateEntity(upgradeList[key]);

        // test for a collision between upgrade and player
        if (testRectCollision(player, upgradeList[key])) {
          if (upgradeList[key].category === "score") {
            score += 1000;
          } else if (upgradeList[key].category === "attackSpeed") {
            player.attackSpeed += 3;
          }
          delete upgradeList[key];
        }
      }
      // update bullets
      for (var key in bulletList) {
        var bullet = bulletList[key];
        updateEntity(bullet);

        var bulletShouldBeRemoved = false;
        bullet.timer++;
        if (bullet.timer > 100) {
          bulletShouldBeRemoved = true;
        }

        for (var enemy in enemyList) {
          if (testRectCollision(bullet, enemyList[enemy])) {
            bulletShouldBeRemoved = true;
            delete enemyList[enemy];
            break;
          }
        }

        if (bulletShouldBeRemoved) {
          delete bulletList[key];
        }
      }

      // test for and handle player death
      if (player.hp <= 0) {
        var timeSurvived = Math.floor((Date.now() - gameStartTime) / 1000);
        console.log("You survived for " + timeSurvived + " seconds");
        startNewGame();
      }

      // update players
      updatePlayerPosition();
      drawEntity(player);
      ctx.fillText("HP: " + player.hp, 0, 30);
      ctx.fillText("Score: " + score, 200, 30);
    };

    /**
     * Resets game state
     */
    var startNewGame = function() {
      player.hp = 10;
      gameStartTime = Date.now();
      frameCount = 0;
      score = 0;
      enemyList = {};
      upgradeList = {};
      bulletList = {};
      for (var i = 0; i < ENEMY_COUNT; i++) {
        createEnemy();
      }
    };

    /**
     * Creates an enemy object and appends it to the enemy list
     */
    var createEnemy = function() {
      var minPos = 0;
      var minSpeed = -15;
      var maxSpeed = 15;
      var minSize = 5;
      var maxSize = 50;
      var name = "E" + Object.keys(enemyList).length.toString();
      var enemy = {
        width: Math.random() * (maxSize - minSize + 1) + minSize,
        height: Math.random() * (maxSize - minSize + 1) + minSize,
        color: "red",
        x: Math.floor(Math.random() * (CANVAS_WIDTH - minPos)) + minPos,
        y: Math.floor(Math.random() * (CANVAS_HEIGHT - minPos)) + minPos,
        spdX: Math.floor(Math.random() * (maxSpeed - minSpeed + 1)) + minSpeed,
        spdY: Math.floor(Math.random() * (maxSpeed - minSpeed + 1)) + minSpeed,
        name
      };
      enemyList[name] = enemy;
    };

    /**
     * Creates an upgrade and appends it to the upgrades list
     */
    var createUpgrade = function() {
      var minPos = 0;
      var categoryFlip = Math.random() < 0.5;
      var name = "U" + Object.keys(upgradeList).length.toString();
      var upgrade = {
        width: 10,
        height: 10,
        color: categoryFlip < 0.5 ? "orange" : "purple",
        x: Math.floor(Math.random() * (CANVAS_WIDTH - minPos)) + minPos,
        y: Math.floor(Math.random() * (CANVAS_HEIGHT - minPos)) + minPos,
        spdX: 0,
        spdY: 0,
        name,
        category: categoryFlip < 0.5 ? "score" : "attackSpeed"
      };
      upgradeList[name] = upgrade;
    };

    /**
     * Creates a bullet and appends it to the bullets list
     */
    var createBullet = function() {
      var angle = ((Math.random() * (360 - 0 + 1)) / 180) * Math.PI;
      var name = "U" + Object.keys(bulletList).length.toString();
      var bullet = {
        width: 10,
        height: 10,
        color: "black",
        x: player.x,
        y: player.y,
        spdX: Math.cos(angle) * 5,
        spdY: Math.sin(angle) * 5,
        name,
        timer: 0
      };
      bulletList[name] = bullet;
    };

    /**
     * Returns the distance between two entities
     * @param {Object} entity1
     * @param {Object} entity2
     */
    var getDistanceBetweenEntity = function(entity1, entity2) {
      return Math.sqrt(
        Math.pow(entity2.x - entity1.x, 2) + Math.pow(entity2.y - entity1.y, 2)
      );
    };

    // start game
    startNewGame();
    // update game state
    setInterval(gameLoop, UPDATE_INTERVAL);

    // mouse move handler
    document.onmousemove = function(mouse) {
      // var mouseX = mouse.clientX - ctxEl.getBoundingClientRect().left;
      // var mouseY = mouse.clientY - ctxEl.getBoundingClientRect().top;
      // var halfPlayerWidth = player.width / 2;
      // var halfPlayerHeight = player.height / 2;
      // if (mouseX < halfPlayerWidth) {
      //   mouseX = halfPlayerWidth;
      // }
      // if (mouseX > CANVAS_WIDTH - halfPlayerWidth) {
      //   mouseX = CANVAS_WIDTH - halfPlayerWidth;
      // }
      // if (mouseY < halfPlayerHeight) {
      //   mouseY = halfPlayerHeight;
      // }
      // if (mouseY > CANVAS_HEIGHT - halfPlayerHeight) {
      //   mouseY = CANVAS_HEIGHT - halfPlayerHeight;
      // }
      // player.x = mouseX;
      // player.y = mouseY;
    };

    // click handler
    document.onclick = function() {
      if (player.attackCounter > 25) {
        createBullet();
        player.attackCounter = 0;
      }
    };

    // key handlers
    document.onkeydown = function(event) {
      if (event.keyCode === 68)
        // d
        player.pressingRight = true;
      else if (event.keyCode === 83)
        // s
        player.pressingDown = true;
      else if (event.keyCode === 65)
        // a
        player.pressingLeft = true;
      else if (event.keyCode === 87)
        // w
        player.pressingUp = true;
    };
    document.onkeyup = function(event) {
      if (event.keyCode === 68)
        // d
        player.pressingRight = false;
      else if (event.keyCode === 83)
        // s
        player.pressingDown = false;
      else if (event.keyCode === 65)
        // a
        player.pressingLeft = false;
      else if (event.keyCode === 87)
        // w
        player.pressingUp = false;
    };

    var updatePlayerPosition = function() {
      if (player.pressingUp) {
        player.y -= 10;
      }
      if (player.pressingRight) {
        player.x += 10;
      }
      if (player.pressingDown) {
        player.y += 10;
      }
      if (player.pressingLeft) {
        player.x -= 10;
      }

      // make sure the player stays within bounds
      var halfPlayerWidth = player.width / 2;
      var halfPlayerHeight = player.height / 2;
      if (player.x < halfPlayerWidth) {
        player.x = halfPlayerWidth;
      }
      if (player.x > CANVAS_WIDTH - halfPlayerWidth) {
        player.x = CANVAS_WIDTH - halfPlayerWidth;
      }
      if (player.y < halfPlayerHeight) {
        player.y = halfPlayerHeight;
      }
      if (player.y > CANVAS_HEIGHT - halfPlayerHeight) {
        player.y = CANVAS_HEIGHT - halfPlayerHeight;
      }
    };

    /**
     * Updates an entity's positioning and reverses its course if it goes out of bounds
     * @param { Object } entity
     */
    var updateEntity = function(entity) {
      updateEntityPosition(entity);
      drawEntity(entity);
    };

    /**
     * Updates an entity's positioning
     * @param {Object} entity
     */
    var updateEntityPosition = function(entity) {
      entity.x += entity.spdX;
      entity.y += entity.spdY;

      if (entity.x < 0 || entity.x > CANVAS_WIDTH) {
        entity.spdX = -entity.spdX;
      }
      if (entity.y < 0 || entity.y > CANVAS_HEIGHT) {
        entity.spdY = -entity.spdY;
      }
    };

    /**
     * Tests whether two rectangles are colliding
     * @param {Object} rect1
     * @param {Object} rect2
     * @returns {Boolean}
     */
    var testRectCollision = function(rect1, rect2) {
      return (
        rect1.x <= rect2.x + rect2.width &&
        rect2.x <= rect1.x + rect1.width &&
        rect1.y <= rect2.y + rect2.height &&
        rect2.y <= rect1.y + rect1.height
      );
    };

    /**
     * Draws an entity to the canvas
     * @param {Object} entity
     */
    var drawEntity = function(entity) {
      ctx.save();
      ctx.fillStyle = entity.color;
      var xPos = entity.x - entity.width / 2;
      var yPos = entity.y - entity.height / 2;
      ctx.fillRect(xPos, yPos, entity.width, entity.height);
      ctx.restore();
    };
  }
})();
