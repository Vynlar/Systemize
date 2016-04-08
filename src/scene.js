window.Systemize = window.Systemize || {};
Systemize.Scene = (function() {
  var Scene = function(args) {
    this.id = args.id;
    this.game = args.game;
    this.root = new PIXI.Container();

    //layers
    this.layers = [];
    var layerCount = args.layerCount || 3;
    for(var i = 0; i < layerCount; i++) {
      this.layers[i] = new PIXI.Container();
      this.root.addChild(this.layers[i]);
    }

    this.entities = [];
    for(i = 0; i < 4; i++) {
      this.entities[i] = [];
    }
  };

  Scene.prototype.addEntity = function (entity, layer) {
    entity.scene = entity.scene || this;
    if(entity.components.SpriteComponent) {
      this.layers[layer].addChild(entity.components.SpriteComponent.sprite);
    }
    this.entities.push(entity);
    this.game.entityManager.addEntity(entity, this.id);
  };

  Scene.prototype.getEntities = function (layer) {
    if(!layer)
      return this.entities.reduce(function(result, layer) {
        result = result.concat(layer);
      }, []);
    else {
      return this.entities[layer];
    }
  };

  Scene.prototype.removeEntity = function (entity) {
    this.entities.splice(this.entities.indexOf(entity), 1);
  };

  return Scene;
})();
