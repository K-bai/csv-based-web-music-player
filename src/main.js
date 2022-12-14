import "mutationobserver-shim";
import Vue from "vue";

import "@/js/global.js";

Vue.prototype.$ELEMENT = { size: "medium" };

Vue.config.productionTip = false;




import App from "./App.vue";

const app = new Vue({
  el: "#app",
  render (h) {
    return h(App);
  }
});



// 注册service worker
/*
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
      navigator.serviceWorker.register('/service-worker.js')
  })
}
*/
