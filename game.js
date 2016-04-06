window.Systemize = window.Systemize || {};
Systemize.Game = (function() {
  var Game = function(width, height) {
    this.entityManager = new Systemize.EntityManager();
    //create renderer
    width = width || 800;
    height = height || 600;
    this.renderer = PIXI.autoDetectRenderer(width, height);

    //assets
    this.assetPaths = [];

    //scenes
    this.scenes = {};
    this.currentScene = "";

    //use nearest neighbor scaling
    PIXI.SCALE_MODES.DEFAULT = PIXI.SCALE_MODES.NEAREST;
  };

  Game.prototype.addAssets = function(assets) {
    this.assetPaths = this.assetPaths.concat(assets);
  };

  Game.prototype.addScene = function(name, scene) {
    this.scenes[name] = scene;
  };

  Game.prototype.addSystem = function(system) {
    this.entityManager.addSystem(system);
  };

  Game.prototype.gameLoop = function() {
    requestAnimationFrame(this.gameLoop.bind(this));

    //update entities
    this.entityManager.update();

    //render the current scene
    this.renderer.render(this.scenes[this.currentScene].root);
  };

  Game.prototype.start = function() {
    //load assets
    this.assetPaths.forEach(function(asset) {
      PIXI.loader.add(asset[0], asset[1]);
    });
    PIXI.loader.once("error", function(error) {
      console.log("Systemize: Error loading assets:");
      console.log(error);
    });
    PIXI.loader.once("complete", function() {
      console.log("Systemize: Assets finished loading");
      this.setup();

      //start the game
      document.getElementById("game").appendChild(this.renderer.view);
      console.log("Systemize: Starting game loop");
      requestAnimationFrame(this.gameLoop.bind(this));
    }.bind(this));
    PIXI.loader.load();
  };

  Game.prototype.setup = function() {
    var self = this;
    //construct and store each scene
    Object.keys(this.scenes).forEach(function(scene, index) {
      self.scenes[scene] = self.scenes[scene](self);

      //if it's the first scene, set it as the current
      if(index === 0) {
        self.currentScene = scene;
      }
    });
  };

  Game.prototype.setCurrentScene = function(scene) {
    this.currentScene = scene;
  };
  return Game;
})();