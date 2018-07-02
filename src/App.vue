
<template>
  <div id="app">
    <el-col :span="20">

      <el-button id="btn" @click="start">开球</el-button>
      <el-input-number id="input" v-model="curDis" :min="-7" :max="7" label="描述文字"></el-input-number>
      <el-button id = "search" :plain = "true" @click="search">匹配对手</el-button>
      <el-input v-model="turnName" readonly ="true" style="width: 90px;text-align:center;"></el-input>
    </el-col>
    <el-col :span="4">
      <el-input class="grid-content" id="homeScore" v-model="homeScore" readonly ="true" style="width: 60px;text-align:center;"></el-input>
      <el-input class="grid-content" readonly="true" value = ":" style="font-size:large; font-weight:bold;width: 40px"></el-input>
      <el-input class="grid-content" id="awayScore" v-model="awayScore" readonly="true" style="width: 60px"></el-input>
    </el-col>
  </div></template>

<script>
  export default {
    data() {
      return {
        isMyTurn: true,
        turnName: '练习模式',
        whiteBallMove: false,
        homeScore: 0,
        awayScore: 0,
        curDis:0,
        mousePosition: {x:0,y:0},
        clientNum: 0,
        turn:0,
        isconnected: false,
        anotherClick: false,
        ballPosition:{
          whiteBall : {x:0,y:0},
          redBallstacks : {
            1:{x:0,y:0},
            2:{x:0,y:0},  3:{x:0,y:0},
            4:{x:0,y:0},  5:{x:0,y:0},  6:{x:0,y:0},
            7:{x:0,y:0},  8:{x:0,y:0},  9:{x:0,y:0},  10:{x:0,y:0},
            11:{x:0,y:0},  12:{x:0,y:0},  13:{x:0,y:0},  14:{x:0,y:0}, 15:{x:0,y:0},
          },
          yellowBall : {x:0,y:0},
          greenBall : {x:0,y:0},
          brownBall : {x:0,y:0},
          blueBall : {x:0,y:0},
          pinkBall : {x:0,y:0},
          blackBall : {x:0,y:0},
          whiteball : {x:0,y:0}
        },
        bodiesPosition:{
          999:{x:0,y:0},
          998:{x:0,y:0}
      }
      };
    },

    watch:{

      isMyTurn : function(val){
        if(this.isconnected)
        {
          console.log("t t"+val);
          console.log("t c"+this.clientNum);
          if(val)
            this.turnName = '你的回合'
          else
            this.turnName = '对手回合'
        }
      },
      // turn : function(val){
      //   if(this.isconnected)
      //   {
      //     console.log("t t"+val);
      //     console.log("t c"+this.clientNum);
      //     if(this.clientNum % 2 == val)
      //       this.turnName = '你的回合'
      //     else
      //       this.turnName = '对手回合'
      //   }
      // },
      isconnected:function(val){
        console.log("i t"+this.turn)
        console.log("i c"+this.clientNum);
        if(!val)
          this.turnName = '练习模式'
        else{
          if(this.clientNum % 2 == this.turn) {
            this.turnName = '你的回合'
            this.isMyTurn = true;
          }
          else {
            this.turnName = '对手回合'
            this.isMyTurn = false;
          }
        }
      },
      homeScore :function (val) {
        if(this.isconnected) {
          //this.$socket.emit('awayGoal', val);
          //this.turn = 1 - this.turn;
          //console.log('vue'+ this.turn)
        }
      },
      awayScore :function (val) {
        if(this.isconnected) {
          //this.turn = 1 - this.turn;
          //console.log('vue'+this.turn)
        }
      },
      curDis:function (val) {
        if(this.isconnected) {
          console.log("post" + val)
          this.$socket.emit('changeCur',val);
        }
      }
    },


    sockets:{
      remove :function(data)
      {
        var ball = Matter.Composite.get(world, data.id, data.type);
        if (ball) {
          //window.vue.$socket.emit("remove",{id:colBall.id, type:colBall.type});
          World.remove(world, ball, [deep = false]);
          score++;
          this.score();

          //document.getElementById("score").click();
          redballNum--;
        }
      },

      changeCur:function(newCur){
        console.log("get"+newCur);
        if(this.curDis != newCur);
        this.curDis = newCur;
      },

      out:function(data){
        whiteOut();
      },

      startClick:function(data){
        start();

    },

      move:function(data){
        this.mousePosition = {x:data.x,y:data.y};

      },
      updateBalls:function(data){
        //console.log(data);
        this.ballPosition = data;
        //this.bodiesPosition = data;
      },

      click: function(data){
       console.log(data);
       console.log("annotherclick");
       //shoot(data.mx,data.my,data.wx,data.wy,data.sx,data.sy)
       shoot(data.x,data.y)
        //this.anotherClick = ture;
     },
      ballMove:function(data){
        //console.log("move",data)
        //console.log("state",stateCanChange)
        if(!data&& this.whiteBallMove &&!isScore && stateCanChange) {
          this.isMyTurn = true;
          stateCanChange = false;
        }
        this.whiteBallMove = data;
      },
      clientId: function(num){
      this.clientNum = num;
    },

      waiting:function(str){
      console.log(str);
      var search = document.getElementById("search");
      if(str == 'waiting')
      {
        //search.getElementsByClassName("span")[0].innerText = "加载中";
        console.log("searching");
        console.log(search.children[0].innerHTML);
        search.children[0].innerHTML = '匹配中';
        search.setAttribute("loading","true");
      }
      else if(str == 'matched'){
        //search.setAttribute("loading","false");
        this.connected();
        //document.getElementById("connected").click();
        refresh();
        search.children[0].innerHTML = '断开连接'
        this.isconnected = true;
        console.log("find!");
      }
      else if(str == 'leave'){
        //document.getElementById("disconnected").click();
        this.disconnected();
        search.children[0].innerHTML = '匹配对手'
        this.isconnected = false;
        console.log("disconnected");
      }
    },

      awayGoal: function (score) {
        console.log(score)
        if(this.awayScore != score)
          this.awayScore = score;
    }

  },

    mounted: function(){
      window.vue = this;
    },

    methods: {
      search(){
        console.log(10)
        //Vue.use(VueSocketio, socketio('http://localhost:3000'));
        if(search.children[0].innerHTML == '匹配对手') {
          this.$socket.emit('search');//触发start
          console.log(11)

        }
        if(search.children[0].innerHTML == '断开连接') {
          console.log(12)
          //document.getElementById("disconnected").click();
          search.children[0].innerHTML = '匹配对手'
          this.isconnected = false;
          console.log("disconnected");
          this.$socket.disconnect();//触发start
          this.$socket.connect();
        }
      },



      start(){
          this.$socket.emit("startClick");
          if(document.getElementById("btn").innerText == "重新开始")
          {
            refresh();
            document.getElementById("btn").innerText = "开球";
            this.$message({
              message: '重新开始！',
              type: 'success'
            });
          }
          else
            start();
      },

      connected() {
        this.$message({
          message: '连接成功！',
          type: 'success'
        });
      },

      disconnected() {
        this.$message({
          message: '连接断开！',
          type: 'warning'
        });
      },

      score() {
        this.$message({
          message: '进球啦！',
          type: 'success'
        });
      },

      notinplay() {
        this.$message({
          message: '白球不在开球区，请重新摆放！',
          type: 'warning'
        });
      },

      startw() {
        this.$message({
          message: '开球成功，点击击球！',
          type: 'success'
        });
      },

      outofrange() {
        this.$message({
          message: '白球出界，请重新开球！',
          type: 'warning'
        });
      },
      win(){
        this.$message({
            message: '你赢了！',
            type: 'success'
        });
        document.getElementById("btn").innerText = "重新开始";
      },
      lose(){
          this.$message({
            message: '你输了！',
            type: 'error'
        });
        document.getElementById("btn").innerText = "重新开始";
      }

    }

  }

</script>

<style lang="scss">
  @import url("//unpkg.com/element-ui@2.3.9/lib/theme-chalk/index.css");
</style>
