window.Systemize = window.Systemize || {};
Systemize.Entity = (function() {
  var Entity = function() {
    this.components = {};
  };

  Entity.prototype.addComponent = function(componentType, component) {
    component.parent = this;
    this.components[componentType] = component;
  };

  Entity.prototype.removeComponent = function(type) {
    this.components.forEach(function(component) {
      if(component instanceof type) {
        throw new Error("removeComponent is not yet implimented");
      }
    });
  };

  return Entity;
})();
