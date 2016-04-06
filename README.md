# Systemize
A PIXI.js Entity-Component-System Library

## Basic Usage
```javascript
//define the width and height of the window
SceneManager.create(800, 600);
//define assets to load
SceneManager.addAssets([
  ["pickle", "assets/pickle.png"], //[name, file_path]
  ["background", "assets/background.png"]
]);
//add a scene + name it
SceneManager.addScene("GameScene", GameScene); // Scene creation detailed below
//add systems
SceneManager.addSystem(new PhysicsSystem(this)); // System creation detailed below
SceneManager.addSystem(new CollisionSystem(this));
//start the game
SceneManager.start();
```

## Scenes
```javascript
var GameScene = function() { // name your scene whatever you want
  var scene = new BaseScene(3);
  //background
  var background = new Entity(); //create an entity
  var sprite = new PIXI.Sprite(PIXI.loader.resources.background.texture); // Create a standard PIXI sprite
                                                                          // The background here is the name you put when loading assets
  background.addComponent("SpriteComponent", {sprite: sprite}); // Add component
                                                                // SpriteComponent is a special component that any drawable entity must include  
  scene.addEntity(background, 0); // Add entity to the scene
                                  // First argument: entity, second argument: layer number to put it on

  return scene;
};
return GameScene; //make sure that this is the same name as above
```

## Entities & Components
Entities are created simply:
```javascript
var dragon = new Entity();
```
Components are normal javascript objects
They *SHOULD NOT* contain methods! Game logic should strictly be done in systems.
```javascript
var FlyingComponent = {
  speed: 34,
  maxHeight: 200
}
```
They are added to entities:
```javascript
dragon.addComponent("FlyingComponent", FlyingComponent);
```

## Systems
```javascript
//example system
var PhysicsSystem = function() {
  //initialization logic goes here if you have any
};

//called every frame
PhysicsSystem.prototype.update = function (delta) {
  //gets all entities that have BOTH a 'SpriteComponent' AND a 'PhysicsComponent'
  var entities = EntityManager.getEntitiesByComponents(["SpriteComponent", "PhysicsComponent"]);
  //loop though the entities and perform game logic
  entities.forEach(function(entity) {
    var physics = entity.components.PhysicsComponent;
    var sprite = entity.components.SpriteComponent.sprite;
    physics.velocity.x += physics.acceleration.x;
    physics.velocity.y += physics.acceleration.y;
    sprite.position.x += physics.velocity.x;
    sprite.position.y += physics.velocity.y;
  });
};

return PhysicsSystem;
```
