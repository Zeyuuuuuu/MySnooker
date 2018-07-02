var app = require('http').createServer();
var io = require('socket.io')(app);

var PORT = 3000;
var game;
app.listen(PORT);

var turn;


// //客户端的计数
var clientId = 0;
var clientCount = 0;
//用来存储客户端的socket
var socketMap = {};

var bindListener = function(socket, event) {
  socket.on(event, function(data) {
    if (socket.clientNum % 2 == 0) {
      //有两个人了
      if (socketMap[socket.clientNum - 1]) {
        socketMap[socket.clientNum - 1].emit(event, data);
      }
    } else {
      if(socketMap[socket.clientNum + 1]){
        socketMap[socket.clientNum + 1].emit(event, data);
      }

    }
  })
}

io.on('connection', function(socket) {
  socket.on('search',function(){
    clientCount = clientCount + 1;
    clientId = clientId + 1;
    console.log(clientId);

    // 把clientId 存储在socket中
    socket.clientNum = clientId;
    socketMap[clientId] = socket;
    //console.log(socketMap);
    if (clientId % 2 == 1) {
      socket.emit('waiting', 'waiting');
      socket.emit('clientId',socket.clientNum);
    } else {
      //配对的socket
      if(socketMap[(clientId - 1)]){
        socket.emit('clientId',socket.clientNum);
        socketMap[clientId-1].emit('waiting', 'matched');
        socket.emit('waiting', 'matched');
        socket.emit('start');
        socketMap[(clientId - 1)].emit('start');
        console.log('size '+clientCount);

        //console.log(length(socketMap));

      }else{
        socket.emit('leave');
      }
    }
  });

  //
  // bindListener(socket, 'init');
  // bindListener(socket, 'next');
  // bindListener(socket, 'rotate');
  // bindListener(socket, 'right');
  // bindListener(socket, 'down');
  // bindListener(socket, 'left');
  // bindListener(socket, 'fall');
   bindListener(socket, 'awayGoal');
   bindListener(socket, 'startClick');
   bindListener(socket, 'move');
   bindListener(socket, 'out');
   bindListener(socket, 'click');
   bindListener(socket, 'changeCur');
   bindListener(socket, 'changeTurn');
  bindListener(socket, 'updateBalls');
  bindListener(socket, 'ballMove');
  bindListener(socket, 'remove');



  socket.on('start', function() {
    console.log('start')
      //game = new Game();


  });


  // socket.on('out', function() {
  //   if (socket.clientNum % 2 == 0) {
  //     //有两个人了
  //     if(socketMap[socket.clientNum - 1])
  //       socketMap[socket.clientNum - 1].emit('outed');
  //   } else {
  //     if(socketMap[socket.clientNum + 1])
  //       socketMap[socket.clientNum + 1].emit('outed');
  //   }
  // });

  // socket.on('startClick', function() {
  //   console.log("started");
  //   if (socket.clientNum % 2 == 0) {
  //     //有两个人了
  //     if(socketMap[socket.clientNum - 1])
  //       socketMap[socket.clientNum - 1].emit('started');
  //   } else {
  //     if(socketMap[socket.clientNum + 1])
  //       socketMap[socket.clientNum + 1].emit('started');
  //   }
  // });

  // socket.on('move', function(data) {
  //   if (socket.clientNum % 2 == 0) {
  //     //有两个人了
  //     if(socketMap[socket.clientNum - 1])
  //       socketMap[socket.clientNum - 1].emit('moved',data);
  //   } else {
  //     if(socketMap[socket.clientNum + 1])
  //       socketMap[socket.clientNum + 1].emit('moved',data);
  //   }
  // });


  // socket.on('add', function (score) {
  //   if (socket.clientNum % 2 == 0) {
  //     //是先开房人吗
  //     if (socketMap[socket.clientNum - 1]) {
  //       socketMap[socket.clientNum - 1].emit('score',score);
  //     }
  //   } else {
  //     if(socketMap[socket.clientNum + 1]){
  //       socketMap[socket.clientNum + 1].emit('score',score);
  //     }
  //   }
  // });

  socket.on('disconnect', function() {
    var num = socket.clientNum;

    if (num % 2 == 0) {
      //是先开房人吗
      if (socketMap[num - 1]) {

          leave(num - 1);
      }
    } else {
      if(socketMap[num + 1]){
          leave(num + 1);
      }

    }
    if(socketMap[num])
      leave(num);
    console.log('size '+clientCount);
    if(clientId % 2 != 0)
    {
      clientId++;
    }
  });

})
function leave(clientNum) {
    socketMap[clientNum].emit('waiting','leave');
  console.log(clientNum);

  clientCount = clientCount - 1;
  delete(socketMap[clientNum]);
}


console.log('websocket listening on port' + PORT);

