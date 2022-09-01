<template>
  <div id="app">
    <div v-bind:class="['c-outer', { 'blur-filter': loading }]">
      <banner />
      <input v-show="develop" type="checkbox" v-model="if_debug" />
      <div v-show="if_debug">
        <div v-for="(d, idx) in debug_list" v-bind:key="d + idx">{{ d }}</div>
      </div>
      <main-song-list ref="main" />
      <audio-player ref="player" />
      <countdown />
      <copy-call-code />
      <import-song-list />
      <v-footer />
      <pop-up-info v-if="show_info" v-on:closepopup="show_info = false" />
      <pop-up-receive
        v-if="show_share"
        v-on:closepopup="show_share = false"
        v-bind:song="share_song"
      />
    </div>
    <loading-panel v-if="loading" />
  </div>
</template>

<script>
import MainSongList from "./components/MainSongList.vue";
import AudioPlayer from "./components/AudioPlayer.vue";
import Banner from "./components/Banner.vue";
import ImportSongList from "./components/ImportSongList.vue";
import Footer from "./components/Footer.vue";
import Countdown from "./components/Countdown.vue";
import CopyCallCode from "./components/CopyCallCode.vue";
import PopUpInfo from "./components/PopUp/Info.vue";
import PopUpReceive from "./components/PopUp/Receive.vue";
import LoadingPanel from "./components/LoadingPanel.vue";
import song_data from "./js/data.js";
import utils from "./js/utils.js";

export default {
  name: "App",
  components: {
    MainSongList,
    AudioPlayer,
    Banner,
    ImportSongList,
    "v-footer": Footer,
    Countdown,
    CopyCallCode,
    PopUpInfo,
    PopUpReceive,
    LoadingPanel,
  },
  data() {
    return {
      develop: false,
      if_debug: false,
      show_info: false,
      show_share: false,
      loading: true,
      share_song: {},
      debug_list: window.meumy.debug_list,
    };
  },
  methods: {
    share() {
      console.log(this.$refs.player.playlist_share());
    },
    init() {
      // 看看是不是开了后门
      const parsedUrl = new URL(window.location.href);
      let backdoor_query = parsedUrl.searchParams.get("backdoor");
      if (backdoor_query === "ILOVEMEUMY") window.meumy.backdoor = true;
      // 获取歌曲
      song_data
        .get_song_data()
        .then(() => {
          // 取消loading
          this.loading = false;
          this.$root.$emit("data_loaded");
          // 加入保存的播放列表
          let c_playlist = utils.read_playlist();
          this.$refs.player.playlist_replace(
            c_playlist.song_list,
            c_playlist.current_song
          );
          this.$refs.player.play_mode = utils.read_settings().play_mode;
          window.meumy.audio_player.play_mode = utils.read_settings().play_mode;
          // 如果有查询参数就把这首歌加入播放列表
          const parsedUrl = new URL(window.location.href);
          let query = parsedUrl.searchParams.get("s");
          if (query !== null && query !== "") {
            let song_idx = window.meumy.song_list.findIndex(
              (s) => s.have_audio && s.id === query
            );
            if (song_idx !== -1) {
              // 播放列表添加歌
              this.$refs.player.playlist_add_song(
                window.meumy.song_list[song_idx],
                true
              );
              // 弹出收歌弹窗
              this.share_song = window.meumy.song_list[song_idx];
              this.show_share = true;
            }
            // 清空地址栏的查询参数
            window.history.replaceState({}, "", window.location.pathname);
          }
          // 看看是不是首次打开
          if (utils.if_first_browse()) {
            // 首次打开就播放推荐曲
            this.show_info = true;
            // 光 逆光 我的偶像宣言 Fansa
            let recommend_song_list = ["U00044", "U01506", "U00113", "U01500"];
            let song_list = recommend_song_list.map((i) =>
              window.meumy.song_list.find((s) => s.id === i)
            );
            this.$refs.player.playlist_add_many(song_list);
          }
        })
        .catch((e) => console.log(e));
    },
  },
  mounted() {
    this.init();
  },
};
</script>

<style>
@import "./styles/general.css";

@media all and (max-width: 380px) {
  html {
    font-size: 90%;
  }
}
@media all and (max-width: 340px) {
  html {
    font-size: 80%;
  }
}
html {
  scroll-behavior: smooth;
}
body {
  margin: 0px;
}
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  margin-top: 0px;
  padding-bottom: 20rem;
  background-image: url("assets/ui/banner_bg_dark.png");
  background-color: rgb(252, 252, 252);
  width: 100%;
  display: flex;
  justify-content: center;
}
.c-outer {
  max-width: 1200px;
  padding-left: 2rem;
  padding-right: 2rem;
  flex-grow: 1;
}

.blur-filter {
  filter: blur(5px);
}

@media all and (max-width: 799px) {
  .c-outer {
    padding-left: 0.5rem;
    padding-right: 0.5rem;
  }
}
</style>
