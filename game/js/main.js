$(window).load(function(){
  enchant(); // initialize
  var game = new Game(320, 320);
  game.preload('./res/chara1.png', './res/icon0.png'); // preload image
  game.fps = 20;

  var enemy_create_delay = 30;
  var min_enemy_create_delay = 10;
  var max_enemy_create_delay = 40;

  var enemy_walk_up = 0;
  var max_enemy_walk_up = 200;
  var min_enemy_walk_up = -10;

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

    var game_score = 0;
    var player = new Player();

    // generate enemy
    game.rootScene.tl.then(function() {
      var enemy = new Enemy();
      if(game_score <= 0){

        if(enemy_walk_up > min_enemy_walk_up){
          enemy_walk_up --;
        }

        if(enemy_create_delay <= max_enemy_create_delay){
          enemy_create_delay ++;
        }
      }
      else if(game_score >= 10){

        if(enemy_walk_up <= max_enemy_walk_up){
          enemy_walk_up ++;
        }

        if(enemy_create_delay > min_enemy_create_delay){
          enemy_create_delay --;
        }
      }

    }).delay(enemy_create_delay).loop(); // loop it!

    // add event listener (called when click/touch started)
    game.rootScene.on('touchstart', function(evt){
      player.y = evt.localY;    // set position to touch-y position
      var apple = new Apple();
    });

    // add event listener (called when click/touch moved)
    game.rootScene.on('touchmove', function(evt){
      player.y = evt.localY;    // set position to touch-y position
    });



    // ScoreLabel
    var scoreLabel = new ScoreLabel(100, 10);
    scoreLabel.on("enterframe", function() {
      if (this.age % 30 == 0) {
        this.score = game_score;
      }
    });
    game.rootScene.addChild(scoreLabel);

    game.rootScene.on('enterframe', function(){

      //crash with Enemy
      var hurts = Player.intersect(Enemy);
      if(hurts.length > 0){
        for(var i = 0, len = hurts.length; i < len; i++){
          game.rootScene.removeChild(hurts[i][1]);
          game_score -= 2;
        }
        return;
      }

      //hit it with Apple
      var hits = Apple.intersect(Enemy);
      if(hits.length > 0){
        for(var i = 0, len = hits.length; i < len; i++){
          game.rootScene.removeChild(hits[i][0]);
          game.rootScene.removeChild(hits[i][1]);
          game_score ++;
        }
      }

    });

  };

  game.start(); // start your game!
});
