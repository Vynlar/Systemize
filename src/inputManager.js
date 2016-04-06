window.Systemize = window.Systemize || {};
Systemize.InputManager = (function() {
  var pressed = {};

  document.body.addEventListener("keydown", function(event) {
    pressed[event.keyCode] = true;
  });
  document.body.addEventListener("keyup", function(event) {
    pressed[event.keyCode] = false;
  });

  return {
    isKeyDown: function(key) {
      if(pressed[key]) {
        return true;
      }
      return false;
    }
  };
})();
