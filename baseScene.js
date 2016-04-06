define(["bower_components/pixi/bin/pixi.min.js", "lib/systemize/entityManager.js"], function(PIXI, EntityManager) {
  var Scene = function(layerCount) {
    this.root = new PIXI.Container();

    //layers
    this.layers = [];
    for(var i = 0; i < layerCount; i++) {
      this.layers[i] = new PIXI.Container();
      this.root.addChild(this.layers[i]);
    }

    this.entities = [];
    for(i = 0; i < 4; i++) {
      this.entities[i] = [];
    }
  };

  /*
  Entities
  */
  Scene.prototype.addEntity = function (entity, layer) {
    if(entity.components.SpriteComponent) {
      this.layers[layer].addChild(entity.components.SpriteComponent.sprite);
    }
    this.entities[layer].push(entity);
    EntityManager.addEntity(entity);
  };

  Scene.prototype.getAllEntities = function () {
    var result = [];
    this.entities.forEach(function(array) {
      result = result.concat(array);
    });
    return result;
  };

  Scene.prototype.removeEntity = function (entity) {
    this.entities.splice(this.entities.indexOf(entity), 1);
  };

  return Scene;
});
