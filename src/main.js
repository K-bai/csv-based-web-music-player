import '@babel/polyfill'
import 'mutationobserver-shim'
import Vue from 'vue'
import VTooltip from 'v-tooltip'
import 'v-tooltip/dist/v-tooltip.css'

import App from './App.vue'
import utils from '@/js/utils.js'
import data from '@/js/data.js'

Vue.use(VTooltip)

// 读取喜爱列表
let love_list = utils.read_love_list()
if (love_list.length > 0) {
  if(love_list[0].substring(0, 1) !== 'U') {
    love_list = []
    localStorage.setItem('love_list', '[]')
  }
}

// 全局变量
window.meumy = {
  song_list: [],
  song_collection: [],
  recording_list: [],
  playlist: [utils.empty_song],
  love_list,
  cutter_list: data.cutter_list(),
  filter_options: {
    star: ['--', '星标', '非星标'],
    have_audio: ['--', '有音频', '无音频'],
    order: ['时间倒序', '时间正序'],
    search_type: ['搜索歌名', '搜索全部信息'],
    status: [],
    language: [],
    artist: [],
    month: [],
    collection: []
  },
  backdoor: false,
  debug_list: []
}


Vue.config.productionTip = false

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

