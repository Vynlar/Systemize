window.Systemize = window.Systemize || {};
Systemize.EntityManager = (function() {
  //Entity Manager Class
  var EntityManager = function(game) {
    this.game = game;
    this.entities = {};
    this.lastTime = new Date().getTime();
    this.systems = [];
  };

  EntityManager.prototype.addEntity = function(entity, sceneId) {
    if(sceneId === undefined) {
      throw new Error("Missing scene id in EntityManager.addEntity");
    }
    this.entities[sceneId] = this.entities[sceneId] || [];
    this.entities[sceneId].push(entity);
  };

  EntityManager.prototype.getEntitiesByComponents = function(components) {
    var sceneId = this.game.currentScene;
    this.entities[sceneId] = this.entities[sceneId] || [];

    var entities = this.entities[sceneId].filter(function(entity) {
      var entityComponents = Object.keys(entity.components);
      //for each required component
      for(var i in components) {
        //if the entity does not contain the component, rule it out
        if(!entityComponents.includes(components[i])) {
          return false;
        }
      }
      return true;
    });
    return entities;
  };

  EntityManager.prototype.update = function () {
      var newTime = new Date().getTime();
      var delta = newTime - this.lastTime;
      this.systems.forEach(function(system) {
        system.update(delta);
      });
      this.lastTime = newTime;
  };

  EntityManager.prototype.addSystem = function(system) {
    this.systems.push(system);
  };

  return EntityManager;
})();
