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
      hp: 10
    };

    var enemyList = {};

    /**
     * Callback for the game update interval
     */
    var gameLoop = function() {
      // repaint
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // update enemies
      Object.keys(enemyList).forEach(function(key) {
        updateEntity(enemyList[key]);

        // test for a collision between enemy and player
        if (testRectCollision(player, enemyList[key])) {
          if (player.hp > 0) {
            player.hp -= 1;
          } else {
            var timeSurvived = Math.floor((Date.now() - gameStartTime) / 1000);
            console.log("You survived for " + timeSurvived + " seconds");
            player.hp = 10;
            gameStartTime = Date.now();
          }
        }
      });

      // update players
      drawEntity(player);
      ctx.fillText("HP: " + player.hp, 0, 30);
    };

    /**
     * Creates an enemy object and appends it to the enemy list
     */
    var createEnemy = function() {
      var minPos = 0;
      var minSpeed = -15;
      var maxSpeed = 15;
      var name = "E" + Object.keys(enemyList).length.toString();
      var enemy = {
        width: 30,
        height: 30,
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
     * Returns the distance between two entities
     * @param {Object} entity1
     * @param {Object} entity2
     */
    var getDistanceBetweenEntity = function(entity1, entity2) {
      return Math.sqrt(
        Math.pow(entity2.x - entity1.x, 2) + Math.pow(entity2.y - entity1.y, 2)
      );
    };

    // create the desired number of enemies
    for (var i = 0; i < ENEMY_COUNT; i++) {
      createEnemy();
    }
    // update game state
    setInterval(gameLoop, UPDATE_INTERVAL);

    document.onmousemove = function(mouse) {
      var mouseX = mouse.clientX;
      var mouseY = mouse.clientY;

      player.x = mouseX;
      player.y = mouseY;
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
