# Systemize
A PIXI.js Entity-Component-System Game Engine created by *[Vynlar](https://github.com/Vynlar)*.

## Getting Started
Create a folder in the folder where your main HTML file is located.
```
mkdir lib
cd lib
```
Next, make sure that [git](https://git-scm.com/) is installed, then run:
```
git clone https://github.com/Vynlar/Systemize.git
```
Include this in your HTML file *before* your game logic but after PIXI.js is loaded. Either place the library inside ```lib/Systemize``` *or* change the path in these script tags.
```html
<script src="lib/Systemize/src/scene.js" charset="utf-8"></script>
<script src="lib/Systemize/src/entityManager.js" charset="utf-8"></script>
<script src="lib/Systemize/src/entity.js" charset="utf-8"></script>
<script src="lib/Systemize/src/inputManager.js" charset="utf-8"></script>
<script src="lib/Systemize/src/game.js" charset="utf-8"></script>
```
Create a new global game object
```javascript
Game = new Systemize.Game(1280, 720); //default: 800x600
```
Add assets to the game
```javascript
Game.addAssets([
    ["pickle", "assets/pickle.png"], // Format: [id, path]
    ["background", "assets/background.png"]
]);
```
Add scenes (more on scene creation below)
```javascript
Game.addScene("GameScene", GameScene);
```
Add systems (more on system creation below)
```javascript
Game.addSystem(PhysicsSystem);
Game.addSystem(CollisionSystem);
```
Start the game!
```javascript
Game.start();
```

## Scenes
### Method 1 (Easier)
There are two ways of creating a scene. The easiest way will be outlined first.
Create a scene using a template
```javascript
Game.addSceneTemplate({
  id: "GameScene", //required and must be unique
  layerCount: 4, //default: 3
  entites: [
    //example entity
    {
      layer: 0, //the layer to put the entity on
      entity: function() {
        //create an entity
        var sprite = new PIXI.Sprite(PIXI.loader.resources.background.texture);
        var background = new Systemize.Entity([
          {type: "SpriteComponent", component: {sprite: sprite}}
        ]);
        //return the entity
        return background;
      }
    }
  ]
});
```
### Method 2
You can create a scene manually as well. Essentially just create a ```Systemize.Scene``` object, add entities to it, and then return it. *Remember the scene is a function, not the actual scene object*
First create a function and then initialize an empty scene
```javascript
var GameScene = function(args) { // name your scene whatever you want
  args.layerCount = 3;
  var scene = new Systemize.Scene(args);
```
Next create entities and add components to them
```javascript
    var background = new Systemize.Entity();
    var sprite = new PIXI.Sprite(PIXI.loader.resources.background.texture);
    background.addComponent("SpriteComponent", {sprite: sprite});
    scene.addEntity(background, 0); //be sure to remember to add them to the scene
```
Then return the created scene
```javascript
  return scene;
};
```
The above example all together + comments
```javascript
var GameScene = function(args) { // name your scene whatever you want
    args.layerCount = 3;
    var scene = new Systemize.Scene(args);

    var background = new Systemize.Entity(); //create an entity
    var sprite = new PIXI.Sprite(PIXI.loader.resources.background.texture); // Create a standard PIXI sprite
                                                                            // The background here is the name you put when loading assets
    background.addComponent("SpriteComponent", {sprite: sprite}); // Add component
                                                          // SpriteComponent is a special component that any drawable entity must include  
    scene.addEntity(background, 0); // Add entity to the scene
                            // First argument: entity, second argument: layer number to put it on
  return scene;
};
```

## Entities & Components
### Method 1
You can pass in an array of components to the entity constructor
```javascript
var dragon = new Systemize.Entity([
  {type: "FlyingComponent", component: {speed: 34, maxHeight: 200}}
]);
```

### Method 2 (Manual way)
Entities are created simply:
```javascript
var dragon = new Systemize.Entity();
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
Systems are the place where all game logic should take place. All systems must have an update function on them. This update function can use the EntityManager to get all the entities with a certain set of components. For example, the system below takes all entities with both a SpriteComponent and a PhysicsComponent.
```javascript
var PhysicsSystem = {
  update: function (delta) {
    //get all entities with both a "SpriteComponent" and a "PhysicsComponent"
    var entities = Game.entityManager.getEntitiesByComponents(["SpriteComponent", "PhysicsComponent"]);
    entities.forEach(function(entity) {
      //perform game logic
      var physics = entity.components.PhysicsComponent;
      var sprite = entity.components.SpriteComponent.sprite;
      physics.velocity.x += physics.acceleration.x;
      physics.velocity.y += physics.acceleration.y;
      sprite.position.x += physics.velocity.x;
      sprite.position.y += physics.velocity.y;
    });
  }
};
```

## Contribution
Pull requests are welcome! Any issues should be submitted here on GitHub under the issues tab. I will likely not be adding features, but I will try my best to fix bugs in the system as I find them.
