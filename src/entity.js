window.Systemize = window.Systemize || {};
Systemize.Entity = (function() {
  var Entity = function(components) {
    this.components = {};
    var self = this;
    if(components) {
      components.forEach(function(component) {
        self.components[component.type] = component.component;
      });
    }
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
