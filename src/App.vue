<template>
  <div id="app">
    <div class="c-outer">
      <banner />
      <input v-show="develop" type="checkbox" v-model="if_debug" />
      <div v-show="if_debug">
        <div
          v-for="(d, idx) in debug_list"
          v-bind:key="d+idx"
        >{{d}}</div>
      </div>
      <main-song-list ref="main" />
      <audio-player ref="player" />
      <countdown />
      <copy-call-code />
      <import-song-list />
      <v-footer />
      <pop-up-info v-if="show_info" v-on:closepopup="show_info=false" />
    </div>
  </div>
</template>

<script>
import MainSongList from './components/MainSongList.vue'
import AudioPlayer from './components/AudioPlayer.vue'
import Banner from './components/Banner.vue'
import ImportSongList from './components/ImportSongList.vue'
import Footer from './components/Footer.vue'
import Countdown from './components/Countdown.vue'
import CopyCallCode from './components/CopyCallCode.vue'
import PopUpInfo from './components/PopUp/Info.vue'
import song_data from './js/data.js'
import utils from './js/utils.js'

export default {
  name: 'App',
  components: {
    MainSongList,
    AudioPlayer,
    Banner,
    ImportSongList,
    'v-footer': Footer,
    Countdown,
    CopyCallCode,
    PopUpInfo
  },
  data() {
    return {
      develop: false,
      if_debug: false,
      show_info: false,
      debug_list: window.meumy.debug_list
    }
  },
  methods: {
    share() {
      console.log(this.$refs.player.playlist_share())
    },
    init() {
      // 看看是不是开了后门
      const parsedUrl = new URL(window.location.href)
      let backdoor_query = parsedUrl.searchParams.get('backdoor')
      if (backdoor_query === 'ILOVEMEUMY')
        window.meumy.backdoor = true
      // 获取歌曲
      song_data.get_song_data().then(() => {
        // 加入保存的播放列表
        let c_playlist = utils.read_playlist()
        this.$refs.player.playlist_replace(c_playlist.song_list, c_playlist.current_song)
        this.$refs.player.play_mode = utils.read_settings().play_mode
        // 如果有查询参数就把这首歌加入播放列表
        const parsedUrl = new URL(window.location.href)
        let query = parsedUrl.searchParams.get('s')
        if (query !== null && query !== ''){
          let song_idx = window.meumy.song_list.findIndex(s => (s.have_audio && (s.id === query)))
          if (song_idx !== -1)
            this.$refs.player.playlist_add_song(window.meumy.song_list[song_idx], true)
          // 清空地址栏的查询参数
          window.history.replaceState({}, '', window.location.pathname);
        }
        // 看看是不是首次打开
        if (utils.if_first_browse()){
          // 首次打开就播放推荐曲
          this.show_info = true
          // 光 逆光 我的偶像宣言 Fansa
          let recommand_song_list = ['U00044', 'U01506', 'U00113', 'U01500']
          let song_list = recommand_song_list.map(i => window.meumy.song_list.find(s => (s.id === i)))
          console.log(song_list)
          this.$refs.player.playlist_add_many(song_list)
        }
      }).catch(e => console.log(e))
    }
  },
  mounted () {
    this.init()
  }
}
</script>

<style>
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


.card {
  border-radius: 0.3rem;
  border:1px solid rgba(0, 0, 0, 0.096);
  box-shadow: 0 0 1px 0 rgba(0, 0, 0, 0.719);
  background-color: white;
}
.card hr {
  border: none;
  border-top: 1px rgb(207, 207, 207) solid;
}
.general-input {
  flex-grow: 1;
  padding: 0.5rem;
  border: 1px rgb(190, 190, 190) solid;
  border-radius: 0.3rem;
  background-color: white;
}
.general-button {
  background-color: white;
  border-radius: 0.3rem;
  text-align: center;
  cursor: pointer;
}
.general-checkbox {
  width: 1.1rem;
  height: 1.1rem;
  border-radius: 0.25rem;
  background-color: #fff;
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
  border: 1px solid rgba(0,0,0,.25);
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
}
.general-checkbox:checked {
  background-image: url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='%23fff' viewBox='0 0 16 16'><path d='M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z'/></svg>");
  background-size: 1.2rem;
  background-position: center;
  background-color: #0d6efd;
  border-color: #0d6efd;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.1s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}

@media all and (max-width: 799px) {
  .c-outer {
    padding-left: 0.5rem;
    padding-right: 0.5rem;
  }
}

.popper {
  border-radius: 0.2rem;
  border: 1px solid rgba(0, 0, 0, 0.274);
  box-shadow: 0 0 1px 0 rgba(0, 0, 0, 0.164);
  background-color: white;
  padding: 0.5rem;
}
.popper[x-placement^="top"] {
  border: 1px solid rgba(0, 0, 0, 0.274);
}
</style>
