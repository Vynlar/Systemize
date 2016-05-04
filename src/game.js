window.Systemize = window.Systemize || {};
Systemize.Game = (function() {
  var Game = function(width, height) {
    this.entityManager = new Systemize.EntityManager(this);
    //create renderer
    width = width || 800;
    height = height || 600;
    this.renderer = PIXI.autoDetectRenderer(width, height);

    //assets
    this.assetPaths = [];

    //scenes
    this.scenes = {};
    this.sceneConstructors = {};
    this.sceneTemplates = [];
    this.currentScene = "";

    //use nearest neighbor scaling
    PIXI.SCALE_MODES.DEFAULT = PIXI.SCALE_MODES.NEAREST;
  };

  Game.prototype.addAssets = function(assets) {
    this.assetPaths = this.assetPaths.concat(assets);
  };

  Game.prototype.addScene = function(name, scene) {
    this.sceneConstructors[name] = scene;
  };

  Game.prototype.getScene = function (id) {
    return this.scenes[id];
  };

  /*
   *  template is an object with: layerCount, an id, and an entities array
   *  layerCount is an integer of how many layers the scene should have
   *  id is a unique string
   *  entities array is formatted as such: [{layer: 2, entity: entity}, ...]
   */
  Game.prototype.addSceneTemplate = function (template) {
    this.sceneTemplates.push(template);
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

  Game.prototype.reloadScene = function (sceneId) {
    this.entityManager.clearScene(sceneId);
    this.scenes[sceneId] = this.sceneConstructors[sceneId]({game: this, id: sceneId});
  };

  Game.prototype.setup = function() {
    var self = this;
    //construct and store each scene
    Object.keys(this.sceneConstructors).forEach(function(scene, index) {
      self.scenes[scene] = self.sceneConstructors[scene]({game: self, id: scene});

      //if it's the first scene, set it as the current
      if(index === 0 && self.currentScene === "") {
        self.currentScene = scene;
      }
    });
    //add template scenes
    this.sceneTemplates.forEach(function(template, index) {
      var args = {
        id: template.id,
        game: self,
        layerCount: template.layerCount
      };
      var scene = new Systemize.Scene(args);
      if(index === 0 && self.currentScene === "") {
        self.currentScene = template.id;
      }
      template.entities.forEach(function(entity) {
        //might be a single entity
        var entities = entity.entity();
        if(!Array.isArray(entities)) {
          scene.addEntity(entities, entity.layer);
        } else {
          entities.forEach(function(e) {
            scene.addEntity(e, entity.layer);
          });
        }
      });
      self.scenes[template.id] = scene;
    });

  };

  Game.prototype.setScene = function(sceneId) {
    this.currentScene = sceneId;
  };
  return Game;
})();
