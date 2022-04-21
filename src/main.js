import '@babel/polyfill'
import 'mutationobserver-shim'
import Vue from 'vue'
import VTooltip from 'v-tooltip'
import 'v-tooltip/dist/v-tooltip.css'

import App from './App.vue'


Vue.use(VTooltip)
Vue.config.productionTip = false

import '@/js/global.js'



new Vue({
  render: h => h(App),
}).$mount('#app')


// 注册service worker
/*
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
      navigator.serviceWorker.register('/service-worker.js')
  })
}
*/

