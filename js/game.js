var player;
var tails;
var food;
var dead = false;
var replay = false;
var score = 0;
var highscore = 0;
var gameContainer;
function PreGame()
{
  let gameStarted = false;
  gameContainer = document.getElementById("gameContainer");
  var pregameScreen = document.createElement("canvas");
  pregameScreen.width = 1280;
  pregameScreen.height = 770;
  document.body.insertBefore(pregameScreen, document.body.childNodes[0]);
  gameContainer.appendChild(pregameScreen);
  let pregamectx = pregameScreen.getContext("2d");
  pregamectx.font = "60px Monospace";
  pregamectx.fillStyle = "#28A828";
  pregamectx.textAlign = "center";
  pregamectx.fillText("Another Generic Snake Game", pregameScreen.width/2, pregameScreen.height/2 - 100);

  pregamectx.font = "40px Monospace";
  pregamectx.fillStyle = "white";
  pregamectx.textAlign = "center";
  pregamectx.fillText("Use Arrow Keys to Control your Snek", pregameScreen.width/2, pregameScreen.height/2 + 50);
  pregamectx.fillText("Press Spacebar to Start", pregameScreen.width/2, pregameScreen.height/2 + 120);
  document.addEventListener('keydown', function(event) {
    if(event.keyCode == 32 && !gameStarted) {
      gameStarted = true;
      pregameScreen.width = 0;
      pregameScreen.height = 0;
      pregameScreen.style.border = 0;
      StartGame();
    }
});
}
function StartGame()
{
    myGameArea.stop();
    myGameArea.start();
    player = new PlayerComponent(40,"#28A828",600,320);
    tails = [new TailComponent(40,"#006200", player.x - 40, player.y), new TailComponent(40,"#006200", player.x - 80, player.y),new TailComponent(40,"#006200", player.x - 120, player.y)];
    food = new Food();
}

var myGameArea =
{
  canvas : document.createElement("canvas"),
  start : function()
  {
      this.canvas.width = 1280;
      this.canvas.height = 770;
      this.context = this.canvas.getContext("2d");
      document.body.insertBefore(this.canvas, document.body.childNodes[0]);
      gameContainer.appendChild(this.canvas);
      this.interval = setInterval(Update, 150);
      setInterval(GetInput, 1);
      window.addEventListener("keydown", function (e) {
        myGameArea.key = e.keyCode;
      })
      window.addEventListener("keyup", function (e) {
        myGameArea.key = false;
      })
      var c = this.canvas;
      var ctx = c.getContext("2d");
      ctx.strokeStyle = "#d3d3d3";
      ctx.lineWidth = 1;

      for(var i = 0; i <= 1280; i = i + 40)
      {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, 720);
        ctx.stroke();
      }

      for(var i = 0; i <= 720; i = i + 40)
      {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(1280, i);
        ctx.stroke();
      }
      ctx.font = "35px Monospace";
      ctx.fillStyle = "white";
      ctx.textAlign = "center";
      ctx.fillText("Highscore: "+highscore, 210, this.canvas.height - 15);
      ctx.fillText("Score: "+ score,this.canvas.width/2, this.canvas.height - 15);
    },
    clear: function()
    {
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
      var c = myGameArea.canvas;
      var ctx = c.getContext("2d");
      ctx.strokeStyle = "#d3d3d3";
      ctx.lineWidth = 1;
      for(var i = 0; i <= 1280; i = i + 40)
      {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, 720);
        ctx.stroke();
      }

      for(var i = 0; i <= 720; i = i + 40)
      {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(1280, i);
        ctx.stroke();
      }
      ctx.font = "35px Monospace";
      ctx.fillStyle = "white";
      ctx.textAlign = "center";
      ctx.fillText("Highscore: "+highscore, 210, this.canvas.height - 15);
      ctx.fillText("Score: "+ score,this.canvas.width/2, this.canvas.height - 15);
      ctx.fillText("Length: "+tails.length, this.canvas.width - 210, this.canvas.height - 15);
    },
    stop: function()
    {
      clearInterval(this.interval);
    },
    paused: function()
    {
      this.canvas.width = 1280;
      this.canvas.height = 770;
      ctx.font = "100px Monospace";
      ctx.fillStyle = "red";
      ctx.textAlign = "center";
      ctx.fillText("Game Over!", this.canvas.width/2, this.canvas.height/2 - 100);

      ctx.font = "40px Monospace";
      ctx.fillStyle = "white";
      ctx.textAlign = "center";
      ctx.fillText("Your Cute Snek Died at the Score of " + score, this.canvas.width/2, this.canvas.height/2 + 50);
      ctx.fillText("Press Spacebar to Restart", this.canvas.width/2, this.canvas.height/2 + 120);
    }
}

function PlayerComponent(size,color,x,y)
{
  this.lastMoveX = 1;
  this.lastMoveY = 0;
  this.directionX = 1;
  this.directionY = 0;
  this.width = size;
  this.height = size;
  this.x = x;
  this.y = y;
  this.update = function()
  {
    ctx = myGameArea.context;
    ctx.strokeStyle = "#d3d3d3";
    ctx.lineWidth = 2;
    ctx.fillStyle = color;
    ctx.strokeRect(this.x, this.y, this.width, this.height);
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
  this.newPos = function()
  {
    this.x += this.directionX * 40;
    this.y += this.directionY * 40;
    this.lastMoveX = this.directionX;
    this.lastMoveY = this.directionY;
  }
}

function TailComponent(size, color, x, y)
{
  this.width = size;
  this.height = size;
  this.x = x;
  this.y = y;
  this.update = function()
  {
    ctx = myGameArea.context;
    ctx.strokeStyle = "#d3d3d3";
    ctx.lineWidth = 2;
    ctx.fillStyle = color;
    ctx.strokeRect(this.x, this.y, this.width, this.height);
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}

function Food()
{
  var tailStrike = false;
  var headStrike = false;
  this.width = 40;
  this.height = 40;
  do{
    tailStrike = false;
    headStrike = false;
    this.x = Math.floor(Math.random() * (1280 / 40)) * 40;
    this.y = Math.floor(Math.random() * (720 / 40)) * 40;
    for(var i = 0; i < tails.length; i++)
    {
      if(this.x == tails[i].x && this.y == tails[i].y){
        tailStrike = true;
      }
    }
    if(this.x == player.x && this.y == player.y)
    {
      headStrike = true;
    }
  } while(tailStrike || headStrike);

  this.update = function()
  {
    ctx = myGameArea.context;
    ctx.strokeStyle = "#d3d3d3";
    ctx.lineWidth = 2;
    ctx.fillStyle = "red";
    ctx.strokeRect(this.x, this.y, this.width, this.height);
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}

function Update()
{
  if(!dead)
  {
    myGameArea.clear();
    for(var i = tails.length - 1; i >= 0; i--)
    {
      switch(i)
      {
        case 0:
          tails[i].x = player.x;
          tails[i].y = player.y;
          break;
        default:
          tails[i].x = tails[i-1].x;
          tails[i].y = tails[i-1].y;
          break;
      }
      tails[i].update();
    }
    food.update();
    player.newPos();
    player.update();
    CollisionCheck();
    FoodCheck();
  }else if(replay)
  {
    score = 0;
    dead = false;
    replay = false;

    StartGame();
  }
}
function GetInput()
{
  if(myGameArea.key)
  {
    switch(myGameArea.key)
    {
      case 32:
        if(dead)
        {
          replay = true;
        }
        break;
      case 37:
        if(player.lastMoveX != 1)
        {
          player.directionX = -1;
          player.directionY = 0;
        }
        break;
      case 39:
        if(player.lastMoveX != -1)
        {
          player.directionX = 1;
          player.directionY = 0;
        }
        break;
      case 38:
        if(player.lastMoveY != 1)
        {
          player.directionX = 0;
          player.directionY = -1;
        }
        break;
      case 40:
        if(player.lastMoveY != -1)
        {
          player.directionX = 0;
          player.directionY = 1;
        }
        break;
    }
  }
}

function CollisionCheck()
{
  if (player.x >= 1280 || player.x < 0 || player.y >= 720 || player.y < 0)
  {
    Die();
  }
  for(tail of tails)
  {
    if(tail.x == player.x && tail.y == player.y)
    {
      Die();
    }
  }
}

function FoodCheck()
{
  if (player.x == food.x && player.y == food.y)
  {
    score += 50;
    if(score > highscore)
    {
      highscore = score;
    }
    food = new Food();
    tails.push(new TailComponent(40,"#006200", player.x - 40, player.y));
  }
}

function Die()
{
  dead = true;
  myGameArea.paused();
}
