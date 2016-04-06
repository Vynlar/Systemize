window.Systemize = window.Systemize || {};
Systemize.EntityManager = (function() {
  //Entity Manager Class
  var EntityManager = function() {
    this.entities = [];
    this.lastTime = new Date().getTime();
    this.systems = [];
  };

  EntityManager.prototype.addEntity = function (entity) {
    this.entities.push(entity);
  };

  EntityManager.prototype.getEntitiesByComponents = function(components) {
    if(this.entities === undefined) {
      return;
    }
    var entities = this.entities.filter(function(entity) {
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
      this.systems.forEach(function(system) {
        system.update(newTime - this.lastTime);
      });
      this.lastTime = newTime;
  };

  EntityManager.prototype.addSystem = function(system) {
    this.systems.push(system);
  };

  return EntityManager;
})();
