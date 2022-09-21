import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from '@/store'
import './assets/scss/main.scss'
import './utils/array'
import './utils/string'

// This imports all the layout components such as <b-container>, <b-row>, <b-col>:

Vue.config.productionTip = false

import VueSweetalert2 from 'vue-sweetalert2';

// If you don't need the styles, do not connect
//import 'sweetalert2/dist/sweetalert2.min.css';

Vue.use(VueSweetalert2);

import VueToast from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-sugar.css';
Vue.use(VueToast);

import VueWait from 'vue-wait'
import { wait } from './utils/vuewait'
Vue.use(VueWait)

import VueObserveVisibility from 'vue-observe-visibility'
Vue.use(VueObserveVisibility)


new Vue({
  router,
  store,
  wait,
  render: h => h(App),
}).$mount('#app')
