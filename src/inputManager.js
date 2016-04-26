window.Systemize = window.Systemize || {};
Systemize.InputManager = (function() {
  var pressed = {};
  var keys = {};

  document.body.addEventListener("keydown", function(event) {
    pressed[event.keyCode] = true;
  });
  document.body.addEventListener("keyup", function(event) {
    pressed[event.keyCode] = false;
  });

  return {
    isKeyDown: function(key) {
      if(typeof key === "string") {
        key = keys[key];
      }
      if(pressed[key]) {
        return true;
      }
      return false;
    },
    addKey: function(name, code) {
      keys[name] = code;
    }
  };
})();
