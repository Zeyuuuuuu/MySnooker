import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App.vue';
import VueSocketio from 'vue-socket.io';
import socketio from 'socket.io-client';

Vue.use(VueSocketio, socketio('http://localhost:3000'));

Vue.use(ElementUI);

var app = new Vue({
  el: '#app',
  render: h => h(App)

});

