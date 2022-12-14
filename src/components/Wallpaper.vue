<template>
  <div class="c-background">
    <div class="wallpaper-content">
      <div class="wallpaper-top">
        <div class="wallpaper-author">
          <div class="wallpaper-author-detail">
            <div class="author-name">@{{details.author_name}}</div>
            <div
              class="c-author-icon"
              v-for="item in available_platform_list"
              :key="item.platform"
            >
              <div class="author-separation">/</div>
              <a
                :href="details['author_'+item.platform]"
                target="_blank"
                rel="noreferrer noopener"
              ><div class="author-icon" :style="item.style"></div></a>
            </div>
          </div>
          <div class="wallpaper-author-url">
            <a
              :href="details.original"
              target="_blank"
              rel="noreferrer noopener">原图链接</a>
          </div>
        </div>
        <div
          class="wallpaper-close"
          title="退出大屏幕模式"
          @click="wallpaper_mode.value = false"
        ><div class="wallpaper-close-img"></div></div>
      </div>
      <div class="wallpaper-visualization">
        <canvas id="audio-canvas"></canvas>
      </div>
    </div>
    <div class="wallpaper-switch">
      <div class="wallpaper-switch-button wallpaper-switch-prev" @click="interrupt_cycle(-1)"></div>
      <div class="wallpaper-switch-button wallpaper-switch-next" @click="interrupt_cycle(1)"></div>
    </div>
    <div class="wallpaper-img" id="wallpaper_back"></div>
    <div class="wallpaper-img" id="wallpaper_front"></div>
    <loading-panel v-if="loading" />
  </div>
</template>

<script>
import load_wallpaper from "@/js/load_wallpaper.js";
import MeUmyAudioPaint from "@/js/MeUmyAudioPaint.js";
import LoopControl from "@/js/LoopControl.js";
// load platform icon
import icon_bilibili from "@/assets/ui/bilibili.svg"
import icon_weibo from "@/assets/ui/sina-weibo.svg"
import icon_twitter from "@/assets/ui/twitter.svg"
import icon_pixiv from "@/assets/ui/pixiv.svg"

const platform_list = [
  {platform: "bilibili", style: {backgroundImage: `url("${icon_bilibili}")`}},
  {platform: "weibo", style: {backgroundImage: `url("${icon_weibo}")`}},
  {platform: "twitter", style: {backgroundImage: `url("${icon_twitter}")`}},
  {platform: "pixiv", style: {backgroundImage: `url("${icon_pixiv}")`}},
]




let front_elem = null;
let back_elem = null;
let loop_control = null;

let audio_vis = new MeUmyAudioPaint();
window.audio_vis = audio_vis;

let draw = () => {
  audio_vis.draw_bar(window.meumy.audio_player.get_freq_data());
  window.requestAnimationFrame(draw);
};

let async_wait = (second) => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, second*1000);
  });
};



import LoadingPanel from "@/components/LoadingPanel.vue";


export default {
  name: "Wallpaper",
  components: {
    LoadingPanel
  },
  data () {
    return {
      loading: true,
      current_bg: 0,
      wallpaper_list_org: window.meumy.wallpaper_list,
      wallpaper_mode: window.meumy.wallpaper_mode,
      orientation: "portrait",
      changing: false
    };
  },
  computed: {
    wallpaper_list () {
      return this.wallpaper_list_org.filter(p => p.orientation === this.orientation)
    },
    details () {
      if (this.wallpaper_list.length > 0)
        return this.wallpaper_list[this.current_bg];
      else 
        return {
          "url": "",
          "original": "",
          "author_name": ""
        }
    },
    available_platform_list () {
      return platform_list.filter(p => (this.details["author_"+p.platform] !== ""));
    }
  },
  methods: {
    set_bg (elem) {
      let url = this.wallpaper_list[this.current_bg].url;
      // 加载图片
      return load_wallpaper.load_image(url).then(() => {
        // 设置图片背景
        elem.style.backgroundImage = `url("${url}")`;
      });
    },
    async change_bg (offset = 1) {
      let animation_duration = 1;
      // 设置后方图片为当前
      await this.set_bg(back_elem);
      // 切换下一张图
      this.current_bg = (this.current_bg + offset) % this.wallpaper_list.length;
      await this.set_bg(front_elem);
      // 设置前景动画
      front_elem.classList.add("wallpaper-ani");
      await async_wait(animation_duration);
      front_elem.classList.remove("wallpaper-ani");
    },
    start_cycle () {
      loop_control = new LoopControl(60, () => {this.change_bg(1)});
      loop_control.start();
    },
    interrupt_cycle (offset) {
      loop_control.stop();
      this.change_bg(offset);
      this.start_cycle();
    }
  },
  mounted () {
    // init wallpaper loading
    front_elem = document.getElementById("wallpaper_front");
    back_elem = document.getElementById("wallpaper_back");

    // set orientation
    let page_box = front_elem.getBoundingClientRect();
    if (page_box.height > page_box.width) this.orientation = "portrait";
    else this.orientation = "landscape";

    // load data
    this.loading = true;
    load_wallpaper.get_wallpaper_list().then(() => {
      return this.set_bg(front_elem);
    }).then(() => {
      this.start_cycle();
      this.loading = false;
    });

    // init audio visualization
    window.meumy.audio_player.init_advanced_ctx();
    // init canvas
    audio_vis.init("audio-canvas", 1, 0.3);
    window.requestAnimationFrame(draw);
  },
  destroyed () {
    loop_control.stop();
  }
};

</script>

<style scoped>
.c-background {
  background-color: white;
  position: fixed;
  top: 0px;
  left: 0px;
  width: 100vw;
  height: 100vh;
  z-index: 5;
}
.wallpaper-content {
  position: fixed;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  z-index: 6;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.wallpaper-img {
  position: fixed;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
}
.wallpaper-ani {
  animation-name: wallpaper_fade_in;
  animation-duration: 1s;
  animation-delay: 0s;
  animation-iteration-count: 1;
  animation-fill-mode: both;
  animation-direction: normal;
}
@keyframes wallpaper_fade_in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.wallpaper-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  text-align: start;
  background: rgb(0,0,0);
  background: linear-gradient(81deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0) 50%);
}
.wallpaper-author {
  color: white;
  text-shadow: 0.1rem 0.1rem 0.1rem rgba(0,0,0,0.5);
  padding: 1rem;
}
.wallpaper-author a {
  color: white;
}
.wallpaper-author a:hover {
  color: white;
}
.wallpaper-author a:active {
  color: white;
}

.wallpaper-author-detail {
  display: flex;
  align-items: center;
}

.c-author-icon {
  display: flex;
  align-items: center;
}
.author-icon {
  width: 1.2em;
  height: 1.2em;
  background-size: contain;
  filter: invert(1) drop-shadow(0.1rem 0.1rem 0.1rem rgba(0,0,0,0.5));
}
.author-separation {
  margin: 0.5rem;
}
.author-bili {
  background-image: url("@/assets/ui/bilibili.svg");
}
.author-weibo {
  background-image: url("@/assets/ui/sina-weibo.svg");
}
.author-twitter {
  background-image: url("@/assets/ui/twitter.svg");
}
.author-pixiv {
  background-image: url("@/assets/ui/pixiv.svg");
}

.wallpaper-close {
  border-radius: 1.5rem;
  width: 3rem;
  height: 3rem;
  margin: 0.6rem;
  text-align: center;
  cursor: pointer;
}
@media (any-hover: hover) {
  .wallpaper-close:hover {
    background-color: rgba(0, 0, 0, 0.1);
  }
}
.wallpaper-close:active {
  background-color: rgba(0, 0, 0, 0.35);
}
.wallpaper-close-img {
  width: 3rem;
  height: 3rem;
  background-image: url("@/assets/ui/x.svg");
  background-position: center;
  background-size: contain;
  filter: invert(1) drop-shadow(0.1rem 0.1rem 0.1rem rgba(0,0,0,0.6));
  opacity: 0.4;
}

.wallpaper-visualization {
  width: 100%;
  display: flex;
  flex-grow: 1;
  align-items: flex-end;
  justify-content: center;
}

.wallpaper-switch {
  position: fixed;
  top: 0px;
  left: 0px;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 7;
  pointer-events: none;
}

.wallpaper-switch-button {
  width: 3rem;
  height: 3rem;
  background-size: contain;
  cursor: pointer;
  pointer-events: all;
  filter: invert(1) drop-shadow(0.1rem 0.1rem 0.1rem rgba(0,0,0,1));
  opacity: 0.3;
}
.wallpaper-switch-prev {
  background-image: url("@/assets/ui/chevron-left.svg");
}
.wallpaper-switch-next {
  background-image: url("@/assets/ui/chevron-right.svg");
}
@media all and (max-width: 380px) {
  .wallpaper-switch-button {
    width: 2rem;
    height: 2rem;
  }
}
@media all and (max-width: 340px) {
  .wallpaper-switch-button {
    width: 1.5rem;
    height: 1.5rem;
  }
}
</style>
