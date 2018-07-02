//document.getElementById("bg").play();
var Engine = Matter.Engine,
  Render = Matter.Render,
  Composite = Matter.Composite,
  Common = Matter.Common,
  Constraint = Matter.Constraint,
  Query = Matter.Query,
  Mouse = Matter.Mouse,
  Events = Matter.Events,
  Vertices = Matter.Vertices,
  Bodies = Matter.Bodies,
  Runner = Matter.Runner,
  MouseConstraint = Matter.MouseConstraint,
  World = Matter.World,
  Bodies = Matter.Bodies,
  Composites = Matter.Composites;

//constant value
var tableHeight = 177.8 * 2,
  tableWidth = 356.9 * 2,
  holeR = 8.5 * 2,
  ballR = 5.2 * 2,
  startLine = 73.7 * 2,
  startR = 29.2 * 2,
  windowsHeight = 800,
  windowsWidth = document.body.clientWidth,
  bondW = (tableWidth - 4 * holeR) / 2,
  bondH = tableHeight - 2 * holeR,
  up = windowsHeight / 2 - tableHeight / 2,
  left = windowsWidth / 2 - tableWidth / 2;

//variable
var score = 0,
  isScore = false,
  stateCanChange = false;
  redballNum = 15,
  yellowBallNum = 1,
  greenBallNum = 1,
  brownBallNum = 1,
  blueBallNum = 1,
  pinkBallNum = 1,
  blackBallNum = 1,
  shootRed = true,
  isWhite = false;
//var turn = 0;
var mp = {x: 0, y: 0};

// create engine
var engine = Engine.create(),
  world = engine.world;
world.gravity.y = 0;

// create renderer
var render = Render.create({
  element: document.body,
  engine: engine,

  options: {
    height: windowsHeight,
    width: windowsWidth,
    //pixelRatio: 1,
    wireframes: false,
    //background: '#111',
    //showVelocity: true,
    //showMousePosition: true
  }
});

Render.run(render);

// create runner
var runner = Runner.create();
Runner.run(runner, engine);

var ballCategory = 0x0001,
  bondCategory = 0x0002,
  stickCategory = 0x0004,
  holeCategory = 0x0008;

function bondCreator(x, y, isHori) {
  var width = isHori ? bondW : holeR;
  var weight = isHori ? holeR : bondW;
  return Bodies.rectangle(x, y, width, weight, {
    isStatic: true,
    render: {
      strokeStyle: '#833E45',
      fillStyle: '#833E45',
      collisionFilter: {
        mask: ballCategory,
        group: bondCategory
      }
    }
  });
}

function holeCreator(x, y, isMid) {
  var r = isMid ? holeR : holeR * 3 / 2;
  return Bodies.circle(x, y, r, {
    isStatic: true,
    isSensor: true,
    render: {
      strokeStyle: '#18181D',
      fillStyle: '#18181D'
    }
  });
}

function ballCreater(color, x, y) {
  return Bodies.circle(x, y, ballR, {
    restitution: 0.9,
    frictionAir: 0.03,
    render: {
      stokeStyle: color,
      fillStyle: color
    }
  });
}

//create table object
var table = Bodies.rectangle(left + tableWidth / 2, up + tableHeight / 2, tableWidth, tableHeight, {
    isStatic: true,
    isSensor: true,
    render: {
      stokeStyle: '#008431',
      fillStyle: '#008431'
    }
  }),
  bondUpl = bondCreator(left + holeR + 1 / 2 * bondW, up - 1 / 2 * holeR, true),
  bondUpr = bondCreator(left + 3 * holeR + 3 / 2 * bondW, up - 1 / 2 * holeR, true),
  bondDownl = bondCreator(left + holeR + 1 / 2 * bondW, up + 5 / 2 * holeR + bondH, true),
  bondDownr = bondCreator(left + 3 * holeR + 3 / 2 * bondW, up + 5 / 2 * holeR + bondH, true),
  bondL = bondCreator(left - 1 / 2 * holeR, up + holeR + 1 / 2 * bondH, false),
  bondR = bondCreator(left + 9 / 2 * holeR + 2 * bondW, up + holeR + 1 / 2 * bondH, false);

var holeUL = holeCreator(left - 1 / 2 * holeR, up - 1 / 2 * holeR, false),
  holeUR = holeCreator(left + 9 / 2 * holeR + 2 * bondW, up - 1 / 2 * holeR, false),
  holeDL = holeCreator(left - 1 / 2 * holeR, up + 5 / 2 * holeR + bondH, false),
  holeDR = holeCreator(left + 9 / 2 * holeR + 2 * bondW, up + 5 / 2 * holeR + bondH, false),
  holeUM = holeCreator(left + 2 * holeR + bondW, up - 1 / 2 * holeR, true),
  holeDM = holeCreator(left + 2 * holeR + bondW, up + 5 / 2 * holeR + bondH, true);
var hole = new Array();
for (var i = 0; i < 6; i++) {
  hole[i] = Composites.stack(left - 2 * holeR, up - 2 * holeR, 3, 2, bondW + holeR, bondH + holeR * 2, function (x, y) {
    return Bodies.circle(x, y, holeR, {
      isStatic: true, isSensor: true, render: {
        strokeStyle: '#18181C',
        fillStyle: '#18181C'
      }
    });
  });
}

//colorful ball
var whiteBallinit = function(){
    return ballCreater('#18181D', 0, 0);
  },
  whiteBall = whiteBallinit(),
  yellowBallinit = function () {
    return ballCreater('#E7F514', left + startLine + holeR, windowsHeight / 2 + startR);
  },
  greenBallinit = function () {
    return ballCreater('#006E10', left + startLine + holeR, windowsHeight / 2 - startR);
  },
  brownBallinit = function () {
    return ballCreater('#B04C00', left + startLine + holeR, windowsHeight / 2);
  },
  blueBallinit = function () {
    return ballCreater('#6A1DE3', windowsWidth / 2, windowsHeight / 2);
  },
  pinkBallinit = function () {
    return ballCreater('#C13797', left + 3 * holeR + 3 / 2 * bondW, windowsHeight / 2);
  },
  blackBallinit = function () {
    return ballCreater('#050308', left + 3 * holeR + 3 / 2 * bondW + 3 * ballR + 1.732 * 5 * ballR, windowsHeight / 2);
  };
//red ball
function redBallinit() {
  var redBallstack = new Array();
  for (var i = 0; i < 5; i++) {
    redBallstack[i] = Composites.stack(left + 3 * holeR + 3 / 2 * bondW + ballR + 1.732 * i * ballR, windowsHeight / 2 - (i + 1) * ballR, 1, i + 1, 0, 0, function (x, y) {
      return ballCreater('#980000', x, y);
    });
  }
  return redBallstack;
}
var redBallstacks = redBallinit(),
whiteBall = whiteBallinit(),
redBallstacks = redBallinit(),
yellowBall = yellowBallinit(),
greenBall = greenBallinit(),
brownBall = brownBallinit(),
blueBall = blueBallinit(),
pinkBall = pinkBallinit(),
blackBall = blackBallinit();
console.log(redBallstacks);
World.add(world, [
  table,
  bondUpl, bondUpr, bondDownl, bondDownr, bondL, bondR,
  hole[0], hole[1], hole[2], hole[3], hole[4], hole[5],
  holeUL, holeUR, holeDL, holeDR, holeUM, holeDM,
  redBallstacks[0].bodies[0],
  redBallstacks[1].bodies[0],  redBallstacks[1].bodies[1],
  redBallstacks[2].bodies[0],  redBallstacks[2].bodies[1],  redBallstacks[2].bodies[2],
  redBallstacks[3].bodies[0],  redBallstacks[3].bodies[1],  redBallstacks[3].bodies[2],  redBallstacks[3].bodies[3],
  redBallstacks[4].bodies[0],  redBallstacks[4].bodies[1],  redBallstacks[4].bodies[2],  redBallstacks[4].bodies[3], redBallstacks[4].bodies[4],
  yellowBall, greenBall, brownBall,
  blueBall, pinkBall, blackBall,
  whiteBall
]);

function refresh() {
  World.clear(world);
  window.vue.homeScore = 0;
  window.vue.awayScore = 0;
  score = 0;
  redballNum = 15;
  yellowBallNum = 1;
  greenBallNum = 1;
  brownBallNum = 1;
  blueBallNum = 1;
  pinkBallNum = 1;
  blackBallNum = 1;
  isWhite = 0;
  whiteBall = whiteBallinit();
  redBallstacks = redBallinit();
  yellowBall = yellowBallinit();
  greenBall = greenBallinit();
  brownBall = brownBallinit();
  blueBall = blueBallinit();
  pinkBall = pinkBallinit();
  blackBall = blackBallinit();

  World.add(world, [
    table,
    bondUpl, bondUpr, bondDownl, bondDownr, bondL, bondR,
    hole[0], hole[1], hole[2], hole[3], hole[4], hole[5],
    holeUL, holeUR, holeDL, holeDR, holeUM, holeDM,
    redBallstacks[0], redBallstacks[1], redBallstacks[2], redBallstacks[3], redBallstacks[4],
    yellowBall, greenBall, brownBall,
    blueBall, pinkBall, blackBall,
    whiteBall
  ]);
}




function start() {
  if ((whiteBall.position.x <= left + startLine + holeR) &&
    ((Math.pow(whiteBall.position.x - (left + startLine + holeR), 2) + Math.pow(whiteBall.position.y - (windowsHeight / 2), 2)) < Math.pow(startR, 2))) {
    isWhite = true;
    whiteBall.frictionAir = 0.01;
    window.vue.startw();
    //document.getElementById("start").click();

  }
  else {
    window.vue.notinplay();
    //document.getElementById("notinplace").click();
  }
}

var startPoint = {x: 0, y: 0};


// k = (my-by)/(mx-bx)=(py-by)/(px-bx)
//
// py=+-r/sqrt(1+1/k2)+by
//
// px=(py-by)/k+bx
var isStop = true;
$('canvas').click(function(){
  console.log(window.vue.whiteBallMove)
  if(!window.vue.whiteBallMove) {
    //我的回合
    if (window.vue.isconnected && window.vue.isMyTurn) {
      var mp = {x: (mouse.position.x - left) / tableWidth, y: (mouse.position.y - up) / tableHeight}
      //var mp = {x: mouse.position.x, y: mouse.position.y};
      window.vue.$socket.emit("click", mp);
    }
    //我的回合
    if (!window.vue.isconnected || (window.vue.isconnected && window.vue.isMyTurn))
    shoot((mouse.position.x - left) / tableWidth, (mouse.position.y - up) / tableHeight);
      //shoot(mouse.position.x,mouse.position.y);
  }
});

function shoot(mx,my) {
  console.log("click");
  mx = mx * tableWidth + left;
  my = my * tableHeight + up;
  //console.log(x,y);

  // console.log(window.vue.clientNum + "other");
  //   console.log(window.vue.mousePosition);
  // console.log(window.vue.clientNum + "my");
  // console.log(mouse.position);
  //console.log(turn)
  //console.log("socket"+socket.clientNum);

  var pk = (my - whiteBall.position.y) / (mx - whiteBall.position.x);
  //console.log($('.el-input__inner')[0]);
  var pky = ballR / (Math.sqrt(1 + 1 / Math.pow(pk, 2)));
  //$message.error('111');
  if (my < whiteBall.position.y)
    pky = -pky;

  var py = pky + whiteBall.position.y;
  var px = pky / pk + whiteBall.position.x;
  //console.log(Math.pow(startPoint.x-whiteBall.position.x,2)+Math.pow(startPoint.y-whiteBall.position.y,2)-Math.pow(ballR,2));
  //console.log({cx:px,y:py},startPoint);
  //console.log(whiteBall.velocity);
  if (isWhite) {
    //console.log(curve(startPoint.x, startPoint.y));
    //window.vue.turn = 1 - window.vue.turn;
    //console.log('js'+window.vue.turn)
    //console.log(whiteBall.position,startPoint);
    isScore = false;
    document.getElementById("hit").play();
    stateCanChange = true;
    Matter.Body.applyForce(whiteBall, startPoint, {
      // x: 0.0001 * (-startPoint.x + px),
      // y: 0.0001 * (-startPoint.y + py)
      x: 0.0001 * (-startPoint.x + whiteBall.position.x),
      y: 0.0001 * (-startPoint.y + whiteBall.position.y)
    });
  }

  else if (!isWhite) {

    Matter.Body.setPosition(whiteBall, {
      x: mx,
      y: my
    });
    whiteBall.render.fillStyle = '#E8EDDE';
    whiteBall.render.stokeStyle = '#E8EDDE';
  }
}

// function placeWhite(mx,my){
//   if (!isWhite) {
//     mx = mx * tableWidth + left;
//     my = my * tableHeight + up;
//     Matter.Body.setPosition(whiteBall, {
//       x: mx,
//       y: my
//     });
//     whiteBall.render.fillStyle = '#E8EDDE';
//     whiteBall.render.stokeStyle = '#E8EDDE';
//   }
//   if(isWhite)
//   {
//     whiteBallMove = true;
//   }
// }

var stickLength = 91.0 * 2;
var d = 1;


function curve(x, y) {
  var nk = (y - whiteBall.position.y) / (x - whiteBall.position.x);
  var dy = 1 / Math.sqrt(1 + Math.pow(nk, 2));
  var dx = 1 / Math.sqrt(1 + Math.pow(1 / nk, 2));
  return {x: dx, y: dy};
}
function whiteOut(){
  window.vue.outofrange();
  //document.getElementById("outofrange").click();
  if(stateCanChange)
  {
    //isMyTurn = !isMyTurn;
    //stateCanChange = false;
  }
  isWhite = false;
  whiteBall.frictionAir = 1;
}

// (x'-x)2+(y'-y)2=d2
// (x'-x)(mx-bx)=-(y'-y)(my-by)
// (x'-x)/(y'-y) = -(my-by)/(mx-bx)=-k
// y'=+-d2/(1+k2)+y
var bodies = Composite.allBodies(engine.world);

function updatee() {

  var mouse = mouseConstraint.mouse;
  if(!window.vue.isconnected || (window.vue.isconnected && window.vue.isMyTurn))
  {
    var xp = {x: (mouse.position.x - left) / tableWidth, y: (mouse.position.y - up) / tableHeight}
    window.vue.$socket.emit('move',xp);
    mp = {x:mouse.position.x,y:mouse.position.y};
  }
  else if(!window.vue.isMyTurn)
  {
    mp = {x:window.vue.mousePosition.x * tableWidth + left,
      y:window.vue.mousePosition.y * tableHeight + up};
    //console.log(mp);
  }
  //console.log(mp);
  //console.log(whiteBall.frictionAir);
  //console.log(isWhite);
  //d = document.getElementsByClassName("el-input__inner")[0].getAttribute("aria-valuenow");
  d = window.vue.curDis;


  var context = render.context;
  var rate = (mp.y - whiteBall.position.y) / (mp.x - whiteBall.position.x);
  var k = Math.pow(rate, 2);
  var kx = stickLength / (2 * Math.sqrt(1 + k));
  var ky = stickLength / (2 * Math.sqrt(1 + 1 / k));
  if (mp.x < whiteBall.position.x) {
    kx = -kx;
  }
  if (mp.y < whiteBall.position.y) {
    ky = -ky;
  }


  startPoint = {
    x: mp.x - kx,
    y: mp.y - ky
  };


  var endPoint = {
    x: mp.x + kx,
    y: mp.y + ky
    //x: (mp.x+whiteBall.position.x)/2,
    //y: (mp.y+whiteBall.position.y)/2
  };


  var pk = (mp.y - whiteBall.position.y) / (mp.x - whiteBall.position.x);

  var pky = (ballR + 3) / (Math.sqrt(1 + 1 / Math.pow(pk, 2)));
  var eky = pky / (ballR + 3) * (ballR + 3 + stickLength);
  if (mp.y < whiteBall.position.y) {
    pky = -pky;
    eky = -eky;
  }
  var py = pky + whiteBall.position.y;
  var px = pky / pk + whiteBall.position.x;
  var ey = eky + whiteBall.position.y;
  var ex = eky / pk + whiteBall.position.x;
  if ((startPoint.x - whiteBall.position.x) * (endPoint.x - whiteBall.position.x) <= 0) {
    startPoint = {x: px, y: py};
    endPoint = {x: ex, y: ey};
  }

  startPoint = {
    x: startPoint.x + curve(startPoint.x, startPoint.y).x * d,
    y: startPoint.y + curve(startPoint.x, startPoint.y).y * d
  };

  endPoint = {
    x: endPoint.x + curve(endPoint.x, endPoint.y).x * d,
    y: endPoint.y + curve(endPoint.x, endPoint.y).y * d
  };


  //console.log(startPoint,endPoint,mp);
  var collisions = Query.ray(bodies, startPoint, endPoint);
  Render.startViewTransform(render);
  context.beginPath();
  context.moveTo(startPoint.x, startPoint.y);
  context.lineTo(endPoint.x, endPoint.y);
  context.strokeStyle = '#3e2f08';

  //context.texture = 'src/assets/cue.png'

  context.lineWidth = 5;
  context.stroke();
  //console.log(context)
  //console.log(render);
  Render.endViewTransform(render);

}

function setBallPosition(ball,position){
  if(!ball || !position || ( position.x < holeUL.position.x || position.x > holeUR.position.x || position.y < holeUL.position.y || position.y > holeDL.position.y))
    return;
    Matter.Body.setPosition(ball, {
    x: position.x,
    y: position.y
  });
}

Events.on(engine, 'afterUpdate', function(){
  //function update() {
  bodies = Composite.allBodies(engine.world);

  if (isWhite && (whiteBall.position.x < holeUL.position.x || whiteBall.position.x > holeUR.position.x || whiteBall.position.y < holeUL.position.y || whiteBall.position.y > holeDL.position.y)) {
    //console.log(document.getElementById("alert").style.display);
    window.vue.$socket.emit('out');
    whiteOut();
    //console.log(1);
  }
  if (window.vue.isMyTurn) {

    if (Math.abs(whiteBall.velocity.x) < 0.05 && Math.abs(whiteBall.velocity.y < 0.05)) {
      if (!isScore && window.vue.whiteBallMove && stateCanChange){
        window.vue.isMyTurn = false;
        stateCanChange = false;
        }
      // else(isScore && window.vue.whiteBallMove)
      //   isScore = false;
      window.vue.whiteBallMove = false;

    }
    else
        window.vue.whiteBallMove = true;

    window.vue.$socket.emit("ballMove",window.vue.whiteBallMove);
  }

  if(!window.vue.whiteBallMove && isWhite)
    updatee();
  if(window.vue.isconnected) {
    //我的回合，发送每个球位置信息
    if (window.vue.whiteBallMove && window.vue.isMyTurn || !window.vue.whiteBallMove && !window.vue.isMyTurn) {
      var data = {
        whiteBall : whiteBall.position,
      redBallstacks : {
        // 1:redBallstacks[0].bodies[0].position ,
        // 2:redBallstacks[1].bodies[0].position,  3:redBallstacks[1].bodies[1].position,
        // 4:redBallstacks[2].bodies[0].position,  5:redBallstacks[2].bodies[1].position,  6:redBallstacks[2].bodies[2].position,
        // 7:redBallstacks[3].bodies[0].position,  8:redBallstacks[3].bodies[1].position,  9:redBallstacks[3].bodies[2].position,  10:redBallstacks[3].bodies[3].position,
        // 11:redBallstacks[4].bodies[0].position,  12:redBallstacks[4].bodies[1].position,  13:redBallstacks[4].bodies[2].position,  14:redBallstacks[4].bodies[3].position, 15:redBallstacks[4].bodies[4].position,
       },
      yellowBall : yellowBall.position,
      greenBall : greenBall.position,
      brownBall : brownBall.position,
      blueBall : blueBall.position,
      pinkBall : pinkBall.position,
      blackBall : blackBall.position,
      whiteball : whiteBall.position
      }
      for(var i = 0; i < 5; i++)
      {
        for(var j = 0; j <= i; j++)
        {
          var k = 0;
          if(i == 0)
            k = 1;
          else if (i == 1)
            k = 2;
          else if(i == 2)
            k = 4;
          else if(i == 3)
            k = 7;
          else if(i == 4)
            k = 11;
          if(redBallstacks[i].bodies[j] == null)
            continue;
          data.redBallstacks[k+j] = redBallstacks[i].bodies[j].position;
        }
      }
      //console.log(data.blue);
      window.vue.ballPosition = data;
      // var data = window.vue.bodiesPosition;
      // for(var i = 0; i < bodies.length; i++)
      // {
      //   if(bodies[i].label == "Circle Body")
      //   {
      //     //console.log(bodies[i].id,bodies[i].position)
      //     data[bodies[i].id] = bodies[i].position;
      //   }
      // }
      //window.vue.bodiesPosition = data;
      window.vue.$socket.emit("updateBalls",data)
    }
    //对方回合，更新球位置信息
    else if (window.vue.whiteBallMove && !window.vue.isMyTurn || !window.vue.whiteBallMove && window.vue.isMyTurn){
      //console.log(window.vue.ballPosition)
      setBallPosition(whiteBall,window.vue.ballPosition.whiteBall);
      setBallPosition(yellowBall,window.vue.ballPosition.yellowBall);
      setBallPosition(greenBall,window.vue.ballPosition.greenBall);
      setBallPosition(brownBall,window.vue.ballPosition.brownBall);
      setBallPosition(blueBall,window.vue.ballPosition.blueBall);
      setBallPosition(pinkBall,window.vue.ballPosition.pinkBall);
      setBallPosition(blackBall,window.vue.ballPosition.blackBall);
      setBallPosition(whiteBall,window.vue.ballPosition.whiteBall);
      // for(var i = 1; i < 16;i++)
      // {
      //   var redBallOut = false;
      //   //if( window.vue.ballPosition.redBallstacks[i].x < holeUL.position.x || window.vue.ballPosition.redBallstacks[i].x > holeUR.position.x || window.vue.ballPosition.redBallstacks[i].y < holeUL.position.y || window.vue.ballPosition.redBallstacks[i].y > holeDL.position.y)
      //     //redBallOut = true;
      //   //if(!redBallOut)
      // }
      setBallPosition(redBallstacks[0].bodies[0],window.vue.ballPosition.redBallstacks[1]);
      setBallPosition(redBallstacks[1].bodies[0],window.vue.ballPosition.redBallstacks[2]);      setBallPosition(redBallstacks[1].bodies[1],window.vue.ballPosition.redBallstacks[3]);
      setBallPosition(redBallstacks[2].bodies[0],window.vue.ballPosition.redBallstacks[4]);      setBallPosition(redBallstacks[2].bodies[1],window.vue.ballPosition.redBallstacks[5]);setBallPosition(redBallstacks[2].bodies[2],window.vue.ballPosition.redBallstacks[6]);
      setBallPosition(redBallstacks[3].bodies[0],window.vue.ballPosition.redBallstacks[7]);      setBallPosition(redBallstacks[3].bodies[1],window.vue.ballPosition.redBallstacks[8]);setBallPosition(redBallstacks[3].bodies[2],window.vue.ballPosition.redBallstacks[9]);setBallPosition(redBallstacks[3].bodies[3],window.vue.ballPosition.redBallstacks[10]);
      setBallPosition(redBallstacks[4].bodies[0],window.vue.ballPosition.redBallstacks[11]);      setBallPosition(redBallstacks[4].bodies[1],window.vue.ballPosition.redBallstacks[12]);setBallPosition(redBallstacks[4].bodies[2],window.vue.ballPosition.redBallstacks[13]);setBallPosition(redBallstacks[4].bodies[3],window.vue.ballPosition.redBallstacks[14]);setBallPosition(redBallstacks[4].bodies[4],window.vue.ballPosition.redBallstacks[15]);
      // for(var i = 0; i < bodies.length; i++)
      // {
      //   if(bodies[i].label == "Circle Body")
      //   {
      //     setBallPosition(bodies[i].position,window.vue.bodiesPosition[bodies[i].id]);
      //   }
      // }

    }
  }
});


//setInterval("update()",1);
function scoreCal(colBall) {
  //console.log(alert);
  //alert[0].innerText="进球啦";
  if (colBall.render.fillStyle == '#980000') {
    var ball = Matter.Composite.get(world, colBall.id, colBall.type);
    if (ball) {
      window.vue.$socket.emit("remove",{id:colBall.id, type:colBall.type});
      World.remove(world, ball, [deep = false]);
      score++;
      window.vue.score();

      //document.getElementById("score").click();
      redballNum--;
    }
  }
  else {
    var ball = Matter.Composite.get(world, colBall.id, colBall.type);
    if (ball) {
      if (colBall.render.fillStyle != '#E8EDDE') {
        World.remove(world, ball, [deep = false]);
        window.vue.score();
        //document.getElementById("score").click();
        switch (colBall.render.fillStyle) {
          case '#E7F514':
            score = 2;
            break;
          case '#006E10':
            score = 3;
            break;
          case '#B04C00':
            score = 4;
            break;
          case '#6A1DE3':
            score = 5;
            break;
          case '#C13797':
            score = 6;
            break;
          case '#050308':
            score = 7;
            break;

          default:
            break;
        }

        if (redballNum > 0) {
          switch (colBall.render.fillStyle) {
            case '#E7F514':
              World.add(world, yellowBallinit());
              break;
            case '#006E10':
              World.add(world, greenBallinit());
              break;
            case '#B04C00':
              World.add(world, brownBallinit());
              break;
            case '#6A1DE3':
              World.add(world, blueBallinit());
              break;
            case '#C13797':
              World.add(world, pinkBallinit());
              break;
            case '#050308':
              World.add(world, blackBallinit());
              break;
            default:
              break;
          }
        }
        else if(redballNum == 0 && colBall.render.fillStyle == '#E7F514'){
          yellowBallNum = 0;
        }
        else if(redballNum == 0 && colBall.render.fillStyle == '#006E10'){
          if(yellowBallNum == 0)
            greenBallNumBallNum = 0;
          else
            World.add(world, greenBallinit());
        }
        else if(redballNum == 0 && colBall.render.fillStyle == '#B04C00'){
          if(greenBallNum == 0)
            brownBallNumBallNum = 0;
          else
            World.add(world, brownBallinit());
        }
        else if(redballNum == 0 && colBall.render.fillStyle == '#6A1DE3'){
          if(brownBallNum == 0)
            blueBallNumBallNum = 0;
          else
            World.add(world, blueBallinit());
        }
        else if(redballNum == 0 && colBall.render.fillStyle == '#C13797'){
          if(blueBallNum == 0)
            pinkBallNumBallNum = 0;
          else
            World.add(world, pinkBallinit());
        }
        else if(redballNum == 0 && colBall.render.fillStyle == '#050308'){
          if(pinkkBallNum == 0)
            blackBallNumBallNum = 0;
          else
            World.add(world, blackBallinit());
        }



      }
    }
  }
  //document.getElementById("homeScore").value = score;
  console.log("isc" + window.vue.isconnected)
  console.log("window.vue.clientNum"+window.vue.clientNum)
  console.log("window.vue.turn"+window.vue.turn)
  if((window.vue.isconnected && window.vue.isMyTurn && window.vue.whiteBallMove)
    ||(window.vue.isconnected && !window.vue.isMyTurn && !window.vue.whiteBallMove)
    || (!window.vue.isconnected)) {
    window.vue.homeScore += score;
    isScore = true;
  }
  else if((window.vue.isconnected && !window.vue.isMyTurn && window.vue.whiteBallMove)
    ||(window.vue.isconnected && window.vue.isMyTurn && !window.vue.whiteBallMove)) {
    window.vue.awayScore += score;
    isScore = true;
  }
  score = 0;
  if(blackBallNum == 0)
  {
    if(homeScore > awayScore)
      window.vue.win();
    else if(homeScore < awayScore)
      window.vue.lose();
  }
  //console.log(score);
}

function collict(event) {
  var pairs = event.pairs;
  if(window.vue.whiteBallMove)
    document.getElementById("hit2").play();

  for (var i = 0, j = pairs.length; i != j; ++i) {
    var pair = pairs[i];
    //console.log(pair.bodyB);

    if ((pair.bodyA.render.fillStyle == '#18181C') && (pair.bodyB.label = "Circle Body")) {
      scoreCal(pair.bodyB);
    } else if ((pair.bodyB.render.fillStyle == '#18181C') && (pair.bodyA.label = "Circle Body")) {
      scoreCal(pair.bodyA);
    }

  }
}

Events.on(engine, 'collisionStart', collict);

// add mouse control
var mouse = Mouse.create(render.canvas),
  mouseConstraint = MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: {
      stiffness: 0.2,
      render: {
        visible: true
      }
    }
  });

World.add(world, mouseConstraint);

// keep the mouse in sync with rendering
render.mouse = mouse;

// fit the render viewport to the scene
Render.lookAt(render, {
  min: {x: 0, y: 0},
  max: {x: windowsWidth, y: windowsHeight}
});





