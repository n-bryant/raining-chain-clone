(function() {
  var UPDATE_INTERVAL = 40; // 25fps
  var COLLISION_DISTANCE = 30;
  var ENEMY_COUNT = 3;
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
      name: "P"
    };

    var enemyList = {};

    /**
     * Creates an enemy object and appends it to the enemy list
     */
    function createEnemy() {
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
    }

    // create the desired number of enemies
    for (var i = 0; i < ENEMY_COUNT; i++) {
      createEnemy();
    }

    /**
     * Returns the distance between two entities
     * @param {Object} entity1
     * @param {Object} entity2
     */
    function getDistanceBetweenEntity(entity1, entity2) {
      return Math.sqrt(
        Math.pow(entity2.x - entity1.x, 2) + Math.pow(entity2.y - entity1.y, 2)
      );
    }

    /**
     * Return whether two entities are colliding
     * @param {Object} entity1
     * @param {Object} entity2
     */
    function testCollisionEntity(entity1, entity2) {
      var distance = getDistanceBetweenEntity(entity1, entity2);
      return distance < COLLISION_DISTANCE;
    }

    // update game state
    setInterval(gameLoop, UPDATE_INTERVAL);

    /**
     * Updates an entity's positioning and reverses its course if it goes out of bounds
     * @param { Object } entity
     */
    function updateEntity(entity) {
      entity.x += entity.spdX;
      entity.y += entity.spdY;
      ctx.fillText(entity.name, entity.x, entity.y);

      if (entity.x < 0 || entity.x > CANVAS_WIDTH) {
        entity.spdX = -entity.spdX;
      }
      if (entity.y < 0 || entity.y > CANVAS_HEIGHT) {
        entity.spdY = -entity.spdY;
      }
    }

    /**
     * Callback for the game update interval
     */
    function gameLoop() {
      // repaint
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // update entities
      Object.keys(enemyList).forEach(function(key) {
        updateEntity(enemyList[key]);

        // test for a collision between enemy and player
        if (testCollisionEntity(player, enemyList[key])) {
          console.log("Collision!");
        }
      });
      updateEntity(player);
    }
  }
})();
