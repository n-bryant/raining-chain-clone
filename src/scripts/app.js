(function() {
  var UPDATE_INTERVAL = 40; // 25fps
  var COLLISION_DISTANCE = 30;
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
        if (testCollisionEntity(player, enemyList[key])) {
          if (player.hp > 0) {
            player.hp -= 1;
          } else {
            var timeSurvived = Math.floor(
              (Date.now() - GAME_START_TIME) / 1000
            );
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

    /**
     * Return whether two entities are colliding
     * @param {Object} entity1
     * @param {Object} entity2
     */
    var testCollisionEntity = function(entity1, entity2) {
      var distance = getDistanceBetweenEntity(entity1, entity2);
      return distance < COLLISION_DISTANCE;
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
     * Draws an entity to the canvas
     * @param {Object} entity
     */
    var drawEntity = function(entity) {
      ctx.fillText(entity.name, entity.x, entity.y);
    };
  }
})();
