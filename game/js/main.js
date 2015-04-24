$(window).load(function(){
  enchant(); // initialize
  var game = new Game(320, 320);
  game.preload('./res/chara1.png', './res/icon0.png'); // preload image
  game.fps = 20;

  var enemy_create_delay = 30;
  var enemy_walk_up = 0;

  game.onload = function(){
    // make new class for player
    var Player = enchant.Class.create(enchant.Sprite, {
      initialize: function(){
        enchant.Sprite.call(this, 32, 32);
        this.image = game.assets['./res/chara1.png'];
        this.frame = 5;                   // set image data
        game.rootScene.addChild(this);     // add to canvas
      }
    });

    // make new class for apple
    var Apple = enchant.Class.create(enchant.Sprite, {
      initialize: function(){
        enchant.Sprite.call(this, 16, 16);
        this.image = game.assets['./res/icon0.png']; // set image
        this.moveTo(16, player.y + 8);       // move to the position
        this.tl.moveBy(320, 0, 30);        // set movement
        this.frame = 15;                   // set image data
        game.rootScene.addChild(this);     // add to canvas
      }
    });

    // make new class for enemy
    var Enemy = enchant.Class.create(enchant.Sprite, {
      initialize: function(){
        enchant.Sprite.call(this, 32, 32);
        this.image = game.assets['./res/chara1.png']; // set image
        this.moveTo(320, Math.floor(Math.random() * 320)); // set position
        this.scaleX = -1;
        this.tl.moveBy(-360 - enemy_walk_up, 0, 160);      // set movement
        game.rootScene.addChild(this);     // canvas
      }
    });

    var player = new Player();

    // generate enemy every 60 frames
    game.rootScene.tl.then(function() {
      var enemy = new Enemy();
    }).delay(enemy_create_delay).loop();                    // wait 60 frames and loop it!

    // add event listener (called when click/touch started)
    game.rootScene.on('touchstart', function(evt){
      player.y = evt.localY;    // set position to touch-y position
      var apple = new Apple();
    });

    // add event listener (called when click/touch moved)
    game.rootScene.on('touchmove', function(evt){
      player.y = evt.localY;    // set position to touch-y position
    });

    var game_score = 0;

    // ScoreLabel
    var scoreLabel = new ScoreLabel(100, 10);
    scoreLabel.on("enterframe", function() {
      if (this.age % 30 == 0) {
        this.score = game_score;
      }
    });
    game.rootScene.addChild(scoreLabel);

    game.rootScene.on('enterframe', function(){
      var hits = Apple.intersect(Enemy);
      for(var i = 0, len = hits.length; i < len; i++){
        game.rootScene.removeChild(hits[i][0]);
        game.rootScene.removeChild(hits[i][1]);
        game_score ++;
      }

      var hurts = Player.intersect(Enemy);
      for(var i = 0, len = hurts.length; i < len; i++){
        game.rootScene.removeChild(hurts[i][1]);
        game_score -= 2;
      }

    });

  };

  game.start(); // start your game!
});
