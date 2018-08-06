// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import './assets/scss/style.scss'
import './assets/scss/main.scss'
import Vue from 'vue'
import Box from './components/Box.vue'
import router from './router'

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  components: { Box }
})
