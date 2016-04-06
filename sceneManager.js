define([
        "bower_components/pixi/bin/pixi.min.js",
        "./entityManager.js"
  ], function(PIXI, EntityManager) {
  //create renderer
  var renderer = PIXI.autoDetectRenderer(1280, 720);

  //assets
  var assetPaths = [];

  //scenes
  var scenes = {};
  var currentScene;

  //use nearest neighbor scaling
  PIXI.SCALE_MODES.DEFAULT = PIXI.SCALE_MODES.NEAREST;

  return {
    create: function(width, height) {
      renderer = PIXI.autoDetectRenderer(width, height);
    },
    addAssets: function(assets) {
      assetPaths = assetPaths.concat(assets);
    },
    addScene: function(name, scene) {
      scenes[name] = scene;
    },
    addSystem: function(system) {
      EntityManager.addSystem(system);
    },
    gameLoop: function() {
      requestAnimationFrame(this.gameLoop.bind(this));

      //update entities
      EntityManager.update();

      //render the current scene
      renderer.render(scenes[currentScene].root);
    },
    start: function() {
      //load assets
      assetPaths.forEach(function(asset) {
        PIXI.loader.add(asset[0], asset[1]);
      });
      PIXI.loader.once("error", function(error) {
        console.log("Error loading assets:");
        console.log(error);
      });
      PIXI.loader.once("complete", function() {
        console.log("Assets loaded.");
        this.setup();

        //start the game
        document.getElementById("game").appendChild(renderer.view);
        console.log("Starting game.");
        requestAnimationFrame(this.gameLoop.bind(this));
      }.bind(this));
      PIXI.loader.load();
    },
    setup: function() {
      //construct and store each scene
      Object.keys(scenes).forEach(function(scene, index) {
        scenes[scene] = scenes[scene]();

        //if it's the first scene, set it as the current
        if(index === 0) {
          currentScene = scene;
        }
      });
    },
    setCurrentScene: function(scene) {
      currentScene = scene;
    }
  };
});
