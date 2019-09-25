// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import ElementUI from 'element-ui';
import fullCalendar from 'vue-fullcalendar';
import VueParticles from 'vue-particles';

import 'element-ui/lib/theme-chalk/index.css';
import '@/assets/iconfont/iconfont.css';
import '@/assets/styles/main.scss';

import {http_Get,http_Post,http_PostUp} from './api/Api.js'
import global from './global.js'

import axios from 'axios';
import Qs from 'Qs';

Vue.config.productionTip = true;
Vue.use(ElementUI);
Vue.use(VueParticles);
Vue.component('full-calendar', fullCalendar);

axios.defaults.baseURL = 'http://127.0.0.1:8000/';
Vue.prototype.$ajax = axios;
Vue.prototype.qs = Qs;

Vue.prototype.Global=global;

//axios封装
Vue.prototype.$httpGet=http_Get;
Vue.prototype.$httpPost=http_Post;
Vue.prototype.$httpPostUp=http_PostUp;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
});
