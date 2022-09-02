import "mutationobserver-shim";
import { Buffer } from "buffer";
import Vue from "vue";

import { Select, Input, Option, Popover } from "element-ui";

import "@/js/global.js";

import App from "./App.vue";

window.Buffer = Buffer;
Vue.prototype.$ELEMENT = { size: "medium" };
Vue.use(Select);
Vue.use(Input);
Vue.use(Option);
Vue.use(Popover);

Vue.config.productionTip = false;

const MeUmyPlayer = new Vue({
  render: (h) => h(App),
}).$mount("#app");

window.meumyPlayer = MeUmyPlayer;

// 注册service worker
/*
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
      navigator.serviceWorker.register('/service-worker.js')
  })
}
*/
