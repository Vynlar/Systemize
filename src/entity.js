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
    delete this.components[type];
  };

  return Entity;
})();
