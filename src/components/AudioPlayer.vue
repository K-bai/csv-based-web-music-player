<template>
  <div id="player">
    <div class="c-player" v-on:mousemove="player_mouse_event">
      <div class=c-info>
        <div class="c-songInfo">
          <div class="c-songName">
            <div class="songName">{{playlist[current_song].name}}</div>
            <div class="singer">{{playlist[current_song].artist}}</div>
          </div>
          <div class="c-songStatus">
            <div class="date">{{playlist[current_song].date}}</div>
            <div class="songStatus">{{playlist[current_song].status}}</div>
          </div>
        </div>
        <div class="c-info-op">
          <div
            class="shareButton otherButtons"
            v-on:click="toggle_share"
          >
            <img src="~bootstrap-icons/icons/share.svg" />
          </div>
          <div
            class="detailsButton otherButtons"
            v-on:click="toggle_details"
          >
            <img src="~bootstrap-icons/icons/three-dots.svg" />
          </div>
        </div>
      </div>
      <div class=c-control>
        <div class=c-controlButtons>
          <div class="c-otherButtons">
            <div
              class="playModeButton otherButtons"
              v-on:click="switch_play_mode"
              v-bind:title="play_mode_text"
            >
              <img v-show="play_mode=='loop'" src="~bootstrap-icons/icons/arrow-repeat.svg" />
              <img v-show="play_mode=='loopOnce'" src="@/assets/ui/arrow-repeat-once.svg" />
              <img v-show="play_mode=='shuffle'" src="~bootstrap-icons/icons/shuffle.svg" />
            </div>
            <div>
              <div
                class="volumeButton otherButtons"
                v-on:click="show_volume_bar=!show_volume_bar"
                title="音量"
              >
                <img src="~bootstrap-icons/icons/volume-up.svg" />
              </div>
              <transition name="fade">
                <div class="c-volumeBar" v-show="show_volume_bar">
                  <div
                    class="c-volumeBarRaw"
                    id="c-volumeBarRaw"
                    v-on:mousedown="volume_bar_mouse_event"
                    v-on:mousemove="volume_bar_mouse_event"
                    v-on:touchmove.prevent="volume_bar_touch_event"
                  >
                    <div class="volumeBar-invert" v-bind:style="volume_height"></div>
                  </div>
                </div>
              </transition>
            </div>
          </div>
          <div class="c-playButtons">
            <div
              class="prevButton playButtons"
              v-on:click="next_song(-1)"
              title="上一曲"
            ><div></div></div>
            <div
              class="playButton playButtons"
              v-on:click="audio_toggle_play"
              title="按下空格播放/暂停"
            >
              <div v-bind:class="[{'playButton-play': !play_status}, {'playButton-pause': play_status}, {'playButton-loading': audio_loading}]"></div>
            </div>
            <div
              class="nextButton playButtons"
              v-on:click="next_song(1)"
              title="下一曲"
            ><div></div></div>
          </div>
          <div class="c-otherButtons">
            <div
              class="loveButton otherButtons"
              v-on:click="toggle_loved"
              title="设为星标歌曲"
            >
              <img v-show="!is_loved" src="~bootstrap-icons/icons/star.svg" />
              <img v-show="is_loved" src="~bootstrap-icons/icons/star-fill.svg" />
            </div>
            <div
              class="playlistButton otherButtons"
              v-on:click="show_playlist = !show_playlist"
              title="播放列表"
            >
              <div class="playlistButton-img"></div>
              <div class="playlistButton-corner">{{playlist_length}}</div>
            </div>
          </div>
        </div>
        <div class="c-progressBarText">
          <div class="currentTime">{{second_to_text(play_progress*duration)}}</div>
          <div class="c-progressBar">
            <div
              class="progressBar-button"
              v-bind:style="progress_bar_button_left"
              v-on:mousedown="progress_bar_button_mouse_event"
              v-on:touchmove.prevent="progress_bar_touch_event"
            ></div>
            <div
              class="c-progressBarRaw"
              id="c-progressBarRaw"
              v-on:mousedown="progress_bar_mouse_event"
              v-on:touchmove.prevent="progress_bar_touch_event"
            >
              <div
                class="progressBar-fill"
                v-bind:style="progress_bar_fill_width"
              ></div>
              <div
                class="progressBar-loading"
                v-bind:style="progress_bar_loading_width"
              ></div>
            </div>
          </div>
          <div class="duration">{{second_to_text(duration)}}</div>
        </div>
      </div>
    </div>
    <transition name="fade" v-on:enter="playlist_scroll">
      <div class="c-playlist" v-show="show_playlist">
        <div class="c-playlist-title">
          <div class="playlist-clearAll">
            <span v-on:click="playlist_clear">清空</span>
          </div>
          <div class="playlist-title">
            播放列表
          </div>
          <div class="playlist-close">
            <span v-on:click="show_playlist = false">收起</span>
          </div>
        </div>
        <div class="c-playlist-songList" ref="playlist">
          <div
            v-for="(song, index) in playlist_without_empty"
            v-bind:class="['c-playlist-song', {'c-playlist-playing': song.id===playlist[current_song].id}]"
            v-bind:key="song.id"
            v-on:click="change_song(index)"
          >
            <div class="playlist-name"><span class="playlist-index">{{index+1}}. </span>{{song.name}}</div>
            <div class="playlist-dash">-</div>
            <div class="playlist-artist">{{song.artist}}</div>
            <div class="playlist-status">{{song.status}}</div>
            <div class="playlist-duration">{{song.duration}}</div>
            <div
              class="playlist-clear"
              v-on:click.stop="playlist_remove_song(index)"
            >
              <div class="playlist-clear-img"></div>
            </div>
          </div>
          <div class="playlist-empty" v-show="playlist[0].id === 'empty_song'">
            播放列表为空
          </div>
        </div>
      </div>
    </transition>
    <pop-up-share
      v-if="show_share"
      v-on:closepopup="show_share=false"
      :song="playlist[current_song]"
    />
    <pop-up-details
      v-if="show_details"
      v-on:closepopup="show_details=false"
      :song="playlist[current_song]"
    />
    <audio id="meumy_player">
      <source id="meumy_player_source" src="" type="audio/mpeg" />
    </audio>
  </div>
</template>











<script>
import utils from '@/js/utils.js'
import PopUpShare from './PopUp/Share.vue'
import PopUpDetails from './PopUp/Details.vue'
let audio = {}
let audio_source = {}
audio.volume = 0.9

// 滑动检测
var is_mouse_down = false
window.addEventListener('mouseup', () => {
  if (is_mouse_down === true) is_mouse_down = false
})

export default {
  name: 'AudioPlayer',
  components: {
    PopUpShare,
    PopUpDetails
  },
  data() {
    return {
      show_playlist: false,
      show_volume_bar: false,
      show_share: false,
      show_details: false,
      play_mode: 'loop',
      play_status: false,
      audio_loading: false,
      auto_play: false,
      volume: 0.9,
      play_progress: 0,
      load_progress: 0,
      duration: 0,
      playlist: window.meumy.playlist,
      love_list: window.meumy.love_list,
      current_song: 0,
    }
  },
  methods: {
    second_to_text: function(second) {
      second = Math.floor(second)
      var second_s = String(second%60)
      if (second_s.length===1) second_s = '0'+second_s
      var minute_s = String(Math.floor(second/60))
      if (minute_s.length===1) minute_s = '0'+minute_s
      return `${minute_s}:${second_s}`
    },
    switch_play_mode() {
      if(this.play_mode === 'loop') this.play_mode = 'loopOnce'
      else if(this.play_mode === 'loopOnce') this.play_mode = 'shuffle'
      else if(this.play_mode === 'shuffle') this.play_mode = 'loop'
      utils.save_settings({play_mode: this.play_mode})
    },
    volume_bar_mouse_event(event) {
      // 判断是否按键
      if (event.buttons !== 0) {
        var target = document.getElementById('c-volumeBarRaw')
        var percent = (event.clientY - target.getBoundingClientRect().top) / target.clientHeight
        this.set_volume(1-percent)
      }
    },
    volume_bar_touch_event(event) {
      var target = document.getElementById('c-volumeBarRaw')
      var percent = (event.targetTouches[0].clientY - target.getBoundingClientRect().top) / target.clientHeight
      this.set_volume(1-percent)
    },
    progress_bar_mouse_event(event) {
      var target = document.getElementById('c-progressBarRaw')
      var percent = (event.clientX - target.getBoundingClientRect().left) / target.clientWidth
      this.set_play_progress(Math.max(Math.min(percent, 1), 0))
    },
    progress_bar_touch_event(event) {
      var target = document.getElementById('c-progressBarRaw')
      var percent = (event.targetTouches[0].clientX - target.getBoundingClientRect().left) / target.clientWidth
      this.set_play_progress(Math.max(Math.min(percent, 1), 0))
    },
    progress_bar_button_mouse_event(event) {
      event.stopPropagation()
      is_mouse_down = true
    },
    toggle_share() {
      if (this.playlist[this.current_song].id !== 'empty_song')
        this.show_share = !this.show_share
    },
    toggle_details() {
      if (this.playlist[this.current_song].id !== 'empty_song')
        this.show_details = !this.show_details
    },
    apply_song() {
      this.audio_loading = false
      if (this.playlist[this.current_song].id === 'empty_song') return false
      // 加载当前歌曲 如果是精选状态且有精选版本就跳精选
      let src = this.playlist[this.current_song].src
      if (window.meumy.use_treated.value){
        let second_src = this.playlist[this.current_song].second_src
        if (second_src !== '')
          src = second_src
      }
      audio_source.src = src
      audio.load()
      // 播放列表跳转
      if (this.show_playlist) this.playlist_scroll()
      // 更改media session信息
      if ('mediaSession' in navigator) {
        navigator.mediaSession.metadata = new window.MediaMetadata({
          title: this.playlist[this.current_song].name,
          artist: this.playlist[this.current_song].artist,
          album: '',
          artwork: [{src: require('../assets/logo.png')}]
        })
      }
      audio.title = this.playlist[this.current_song].name
      // 保存当前歌单
      utils.save_playlist(this.current_song, this.playlist)
    },
    audio_toggle_play() {
      // 播放列表不为空
      if (this.playlist[0].id !== 'empty_song') {
        this.play_status = !audio.paused
        if (this.play_status) audio.pause()
        else audio.play()
      }
    },
    audio_pause() {
      // 正在播放就暂停
      this.play_status = !audio.paused
      if (this.play_status) audio.pause()
    },
    next_song(idx) {
      // 如果列表是空的就return
      if (this.playlist[0].id === 'empty_song') return
      // 如果当前正在播放，就自动播放下一首
      this.auto_play = this.play_status
      // 只有一首歌就回到开头
      if (this.playlist.length===1){
        audio.currentTime = 0
        audio.play()
        return
      }
      if (this.play_mode === 'loop' || this.play_mode === 'loopOnce') {
        // 列表循环和单曲循环就下一首
        this.current_song += idx
        if (this.current_song < 0) this.current_song += this.playlist.length
        this.current_song %= this.playlist.length
      }
      else if (this.play_mode === 'shuffle') {
        // 随机就随机一首歌
        this.current_song = this.random_song()
      }
      // 加载这首歌
      this.apply_song()
    },
    change_song(idx) {
      this.auto_play = true
      this.current_song = idx
      this.apply_song()
    },
    player_mouse_event(event) {
      // 按键才执行
      if (is_mouse_down) {
        this.progress_bar_mouse_event(event)
      }
    },
    set_play_progress(progress) {
      audio.currentTime = Math.max(progress * audio.duration - 0.05, 0)
      this.play_progress = progress
    },
    set_volume(volume) {
      volume = Math.min(1, Math.max(0, volume))
      audio.volume = volume
      this.volume = volume
    },
    random_song() {
      // 随机一个数，如果是当前曲子就重新随机
      var r
      do {
        r = Math.floor(Math.random()*(this.playlist.length))
      } while (r===this.current_song)
      return r
    },
    toggle_loved() {
      if (this.playlist[0].id === 'empty_song') return
      let id = this.playlist[this.current_song].id
      // 切换状态
      if (this.is_loved) {
        // 修改喜爱列表
        let idx = this.love_list.findIndex(i => (id === i))
        this.love_list.splice(idx, 1)
      }
      else {
        // 修改喜爱列表
        this.love_list.push(this.playlist[this.current_song].id)
      }
      // 保存喜爱列表
      utils.save_love_list(this.love_list)
    },
    playlist_clear() {
      this.playlist.splice(0, this.playlist.length)
      this.playlist.push(utils.empty_song)
      this.current_song = 0
      this.play_status = false
      this.play_progress = 0
      audio_source.src = ''
      // 保存当前歌单
      utils.save_playlist(this.current_song, this.playlist)
    },
    playlist_remove_song(idx) {
      // 如果只剩一首歌 就相当于清空列表
      if (this.playlist.length === 1) {
        this.playlist_clear()
        return
      }
      // 如果删除的歌是现在选中的歌（至少剩了一首）
      if (idx === this.current_song) {
        // 把正在播放的切到下一首歌并暂停播放
        this.current_song += 1
        this.current_song %= this.playlist.length
        this.auto_play = false
        this.play_status = false
        this.apply_song()
      }
      // 先获取当前播放的id
      let current_song_id = this.playlist[this.current_song].id
      // 删除选中的歌
      this.playlist.splice(idx, 1)
      // 重新获取当前歌index
      this.current_song = this.playlist.findIndex(song => {return song.id === current_song_id})
      // 保存当前歌单
      utils.save_playlist(this.current_song, this.playlist)
    },
    playlist_remove_song_id(id) {
      // 根据id找到对应的下标删歌
      let idx = this.playlist.findIndex(s => (s.id === id))
      if (idx === -1) return
      this.playlist_remove_song(idx)
    },
    playlist_add_song(song, jump = false, auto_play = false) {
      let set_src = false
      if (this.playlist[0].id === 'empty_song') {
        // 如果播放列表是空的就清空列表
        this.playlist.splice(0, this.playlist.length)
        set_src = true
      }
      // 判断歌曲是否重复
      var idx = this.playlist.findIndex(s => {return s.id === song.id})
      if (idx === -1) {
        // 如果不重复
        this.playlist.push(song)
        // 保存当前歌单
        utils.save_playlist(this.current_song, this.playlist)
        idx = this.playlist.length-1
      }
      // 
      // 原来播放列表是空的 或者 要求跳转 就跳转到歌曲
      if (set_src || jump) {
        // 如果要求跳转就自动播放
        this.auto_play = auto_play
        this.current_song = idx
        this.apply_song()
      }
    },
    playlist_add_many(songs) {
      if (songs.length === 0) return false
      // 如果播放列表是空的
      var should_set_src = false
      if (this.playlist[0].id === 'empty_song') {
        // 清空列表
        this.playlist.splice(0, this.playlist.length)
        should_set_src = true
      }
      // 遍历所有要添加的歌
      let added = false
      for (let song of songs) {
        // 判断歌曲是否重复
        var idx = this.playlist.findIndex(s => {return s.id === song.id})
        if (idx === -1) {
          this.playlist.push(song)
          added = true
        }
      }
      // 原来播放列表是空的且添加过歌就设置src并暂停
      if (should_set_src && added) {
        this.apply_song()
        this.auto_play = false
      }
      // 保存当前歌单
      utils.save_playlist(this.current_song, this.playlist)
      return added
    },
    playlist_replace(playlist, current_song = 0) {
      // 更换歌单后暂停播放
      this.playlist.splice(0, this.playlist.length)
      for (let song of playlist) this.playlist.push(song)
      this.current_song = current_song
      this.auto_play = false
      this.play_status = false
      this.apply_song()
    },
    playlist_share() {
      // 输出歌单中歌曲的id列表
      return this.playlist.map(s => s.id)
    },
    playlist_scroll() {
      // 滚动播放列表到当前歌曲
      this.$refs.playlist.children[this.current_song].scrollIntoView({block: "nearest"})
    }
  },
  computed: {
    playlist_without_empty() {
      return this.playlist.filter(s => {
        return s.id !== 'empty_song'
      })
    },
    volume_height() {
      return {
        height: String((1-this.volume)*100)+"%"
      }
    },
    progress_bar_fill_width() {
      return {
        width: String(this.play_progress*100)+"%"
      }
    },
    progress_bar_loading_width() {
      return {
        width: String(this.load_progress*100)+"%"
      }
    },
    progress_bar_button_left() {
      return {
        left: `calc(${this.play_progress*100}% - 0.75rem)`
      }
    },
    play_mode_text() {
      if (this.play_mode === 'loop') return '列表循环'
      if (this.play_mode === 'loopOnce') return '单曲循环'
      return '随机'
    },
    playlist_length() {
      if (this.playlist[0].id === 'empty_song') return 0
      else return this.playlist.length
    },
    is_loved() {
      // 空列表就返回否
      if (this.playlist[0].id === 'empty_song') return false
      let id = this.playlist[this.current_song].id 
      if (this.love_list.findIndex(i => (id === i)) !==-1 ) return true
      return false
    }
  },
  mounted () {
    audio = document.getElementById('meumy_player')
    audio_source = document.getElementById('meumy_player_source')
    audio.addEventListener('loadedmetadata', ()=>{
      this.duration = audio.duration
      this.play_progress = 0
    })
    audio.addEventListener('loadeddata', ()=>{
      this.duration = audio.duration
      this.play_progress = 0
    })
    audio.addEventListener('canplay', ()=>{
      //console.log('可以播放了')
      if (this.auto_play) audio.play()
    })
    audio.addEventListener('progress', ()=>{
      if (audio.duration > 0 && audio.buffered.length > 0){
        this.load_progress = audio.buffered.end(audio.buffered.length-1) / audio.duration
      }
    })
    audio.addEventListener('waiting', ()=>(this.audio_loading = true))
    audio.addEventListener('playing', ()=>(this.audio_loading = false))
    audio.addEventListener('timeupdate', ()=>{
      if (audio.duration) this.play_progress = audio.currentTime/audio.duration
      else this.play_progress = 0
    })
    audio.addEventListener('play', ()=>{
      this.play_status = true
    })
    audio.addEventListener('pause', ()=>{
      this.play_status = false
    })
    audio.addEventListener('ended', ()=>{
      // 结束后自动播放下一首
      this.auto_play = true
      // 如果只有一首或者是单曲循环就回到开头
      if (this.playlist.length===1 || this.play_mode==='loopOnce'){
        audio.currentTime = 0
        audio.play()
        return
      }
      if (this.play_mode==='loop'){
        // 列表循环
        this.current_song += 1
        this.current_song %= this.playlist.length
      }
      else if (this.play_mode==='shuffle'){
        this.current_song = this.random_song()
      }
      // 加载歌曲
      this.apply_song()
    })
    // media session支持
    if ('mediaSession' in navigator) {
      navigator.mediaSession.setActionHandler('play', () => {
        utils.debug('通过media session播放')
        this.audio_toggle_play()
      })
      navigator.mediaSession.setActionHandler('pause', () => {
        utils.debug('通过media session暂停')
        this.audio_toggle_play()
      })
      navigator.mediaSession.setActionHandler('previoustrack', () => {
        utils.debug('通过media session上一曲')
        this.next_song(-1)
      })
      navigator.mediaSession.setActionHandler('nexttrack', () => {
        utils.debug('通过media session下一曲')
        this.next_song(1)
      })
    }
    // 空格键播放/暂停
    document.addEventListener('keydown', e => {
      if (e.code === 'Space' && !e.isComposing) {
        this.audio_toggle_play()
        e.preventDefault()
      }
    })
    // 自动加载第一首
    this.apply_song()
    window.audio = audio
  }
}
</script>




















<style scoped>
#player {
  position: fixed;
  bottom: 0;
  right: 0;
  width: calc(100% - 2rem);
  box-shadow: 0rem 0rem 0.2rem 0rem #888;
  background-color: #fff;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  padding-left: 1rem;
  padding-right: 1rem;
  display: flex;
  justify-content: center;
  -webkit-tap-highlight-color: transparent;
  z-index: 10;
}
.c-player {
  flex-grow: 1;
  display: flex;
  flex-wrap: wrap;
  max-width: 1200px;
  min-width: 0;
}
.c-info {
  flex-grow: 2;
  width: 30%;
  align-items: stretch;
  display: flex;
  margin-left: 0.5rem;
  margin-right: 0.5rem;
  min-width: 0;
}

.c-songInfo {
  flex-grow: 1;
  position: relative;
  display: flex;
  align-content: space-around;
  flex-wrap: wrap;
  min-width: 0;
}
.c-songName {
  width: 100%;
  display: flex;
  min-width: 0;
  align-items: center;
}
.songName {
  text-align: left;
  font-size: 1.2rem;
  flex-grow: 1;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
.singer {
  flex-shrink: 0;
}
.c-songStatus {
  width: 100%;
  color: #888;
  display: flex;
  justify-content: space-between;
}
.c-info-op {
  margin-left: 1rem;
  flex-shrink: 1;
  flex-grow: 0;
  flex-basis: 0px;
  align-content: space-between;
  display: flex;
  flex-wrap: wrap;
}
.c-control {
  flex-grow: 5;
  flex-shrink: 0;
  margin-left: 0.5rem;
  margin-right: 0.5rem;
  user-select: none;
}
.c-controlButtons {
  font-size: 1rem;
  margin-bottom: 0.3rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.c-playButtons {
  flex-grow: 1;
  max-width: 12em;
  display: flex;
  align-items: center;
  justify-content: space-around;
}
.playButtons {
  border-radius: 2em;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}
.prevButton {
  width: 2.5em;
  height: 2.5em;
}
.prevButton div {
  width: 1.2em;
  height: 1.2em;
  background-image: url('../assets/ui/prev.svg');
  background-size: contain;
}
.playButton {
  width: 3em;
  height: 3em;
}
.playButton div {
  width: 2.5em;
  height: 2.5em;
  background-size: contain;
}
.playButton-play {
  background-image: url('../assets/ui/play.svg');
}
.playButton-pause {
  background-image: url('../assets/ui/pause.svg');
}
.playButton-loading {
  background-image: url('../assets/ui/loading.svg');
  animation: loading-rotation 1.5s cubic-bezier(.16,.39,.86,.62) 0s infinite;
}
@keyframes loading-rotation {
  0% { transform: rotate(0deg);}
  100% { transform: rotate(360deg);}
}
.nextButton {
  width: 2.5em;
  height: 2.5em;
}
.nextButton div {
  width: 1.2em;
  height: 1.2em;
  background-image: url('../assets/ui/next.svg');
  background-size: contain;
}
@media (any-hover: hover) {
  .playButtons:hover {
    background-color: rgba(0, 0, 0, 0.1);
  }
}
.playButtons:active {
  background-color: rgba(0, 0, 0, 0.35);
}
.c-otherButtons {
  display: flex;
}
.otherButtons{
  border-radius: 2em;
  height: 2.2em;
  width: 2.2em;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}
@media (any-hover: hover) {
  .otherButtons:hover{
    background-color: rgba(0, 0, 0, 0.1);
  }
}
.otherButtons:active{
  background-color: rgba(0, 0, 0, 0.35);
}
.playlistButton {
  position: relative;
}
.playlistButton-img {
  width: 1.3em;
  height: 1.3em;
  background-image: url('~bootstrap-icons/icons/music-note-list.svg');
  background-size: contain;
}
.playlistButton-corner {
  color: rgb(50, 50, 50);
  background-color: rgb(230, 230, 230);
  border-radius: 2px;
  padding-left: 0.2em;
  padding-right: 0.2em;
  font-size: 0.7em;
  text-align: center;
  position: absolute;
  left: 2em;
  top: 0px;
}
.otherButtons img{
  width: 1.3em;
  height: 1.3em;
}
.c-volumeBar {
  position: absolute;
  bottom: 6rem;
  height: 7rem;
  width: 2.2rem;
  padding-top: 0.7rem;
  padding-bottom: 0.7rem;
  background-color: white;
  border-radius: 3px;
  box-shadow: 0px 0px 0.2rem 0px gray;
  z-index: 100;
  display: flex;
  justify-content: center;
}
.c-volumeBarRaw {
  height: 100%;
  width: 0.6rem;
  border-radius: 1rem;
  background-color: darkgray;
  overflow: hidden;
  cursor: pointer;
}
.volumeBar-invert {
  height: 50%;
  width: 100%;
  background-color: rgb(235, 235, 235);
}

.c-progressBarText {
  display: flex;
  align-items: center;
}
.c-progressBar {
  flex-grow: 1;
  margin-left: 1.5rem;
  margin-right: 1.5rem;
  height: 1.5rem;
  position: relative;
}
.progressBar-button {
  background-image: url('../assets/ui/progress_knot.svg');
  background-size: contain;
  width: 1.5rem;
  height: 1.5rem;
  position: absolute;
  z-index: 30;
  cursor: pointer;
  left: calc(10% - 0.75rem);
}
.c-progressBarRaw {
  margin-top: 0.5rem;
  height: 0.5rem;
  background-color: #999;
  border-radius: 1rem;
  box-shadow: inset 0px 0px 4px rgba(0, 0, 0, 0.322);
  overflow: hidden;
  cursor: pointer;
}
.progressBar-loading {
  background-color: #fff;
  opacity: 0.15;
  height: 0.5rem;
  width: 50%;
  position: relative;
  top: -0.5rem;
  z-index: 10;
}
.progressBar-fill {
  background-color: #66ccff;
  box-shadow: inset 0px 0px 4px rgba(0, 0, 0, 0.322);
  height: 0.5rem;
  width: 10%;
  position: relative;
  z-index: 20;
}

.c-playlist {
  position: absolute;
  bottom: 6rem;
  right: 1rem;
  width: 400px;
  background-color: white;
  border-radius: 5px;
  box-shadow: 0px 0px 0.2rem 0px gray;
  z-index: 100;
}
.c-playlist-title {
  padding-left: 0.7rem;
  padding-right: 0.7rem;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  background-color: rgb(230, 230, 230);
  display: flex;
  align-items: center;
}
.playlist-clearAll {
  flex-grow: 1;
  text-align: left;
  font-size: 1rem;
}
.playlist-clearAll span {
  cursor: pointer;
  user-select: none;
  color: rgb(187, 23, 23);
}
@media (any-hover: hover) {
  .playlist-clearAll span:hover {
    color: rgb(185, 83, 83);
  }
}
.playlist-title {
  flex-grow: 1;
  text-align: center;
  font-size: 1.1rem;
}
.playlist-close {
  flex-grow: 1;
  text-align: right;
  font-size: 1rem;
}
.playlist-close span {
  cursor: pointer;
  color: rgb(23, 146, 187);
  user-select: none;
}
.playlist-close span:hover {
  color: rgb(57, 153, 185);
}
.c-playlist-songList {
  max-height: calc(100vh - 15rem);
  min-width: 0;
  overflow-y: scroll;
  overscroll-behavior: contain;
}
.c-playlist-song {
  padding: 0.7rem;
  display: flex;
  align-items: center;
  width: calc(100% - 1.4rem);
  text-align: left;
  cursor: pointer;
}
@media (any-hover: hover) {
  .c-playlist-song:hover {
    background-color: rgb(245, 245, 245);
  }
}
.c-playlist-playing {
  background-color: rgb(243, 243, 243);
}
.playlist-name {
  flex-shrink: 1;
  font-size: 1rem;
}
.playlist-index {
  color: rgb(105, 105, 105);
  font-size: 0.8rem;
}
.playlist-dash {
  flex-shrink: 0;
  color: #333;
  font-size: 1rem;
  margin-left: 0.3rem;
}
.playlist-artist {
  flex-shrink: 0;
  color: #333;
  font-size: 1rem;
  margin-left: 0.3rem;
}
.playlist-status {
  flex-grow: 1;
  flex-shrink: 0;
  color: #888;
  font-size: 0.8rem;
  margin-left: 0.5rem;
}
.playlist-duration {
  flex-shrink: 0;
  color: #333;
  font-size: 0.9rem;
  margin-left: 0.5rem;
}
.playlist-clear {
  flex-shrink: 0;
  margin-left: 0.25rem;
  border-radius: 1rem;
  width: 1.5rem;
  height: 1.5rem;
  text-align: center;
}
@media (any-hover: hover) {
  .playlist-clear:hover {
    background-color: rgba(0, 0, 0, 0.1);
  }
}
.playlist-clear:active {
  background-color: rgba(0, 0, 0, 0.35);
}
.playlist-clear-img {
  width: 1.5rem;
  height: 1.5rem;
  background-image: url("~bootstrap-icons/icons/x.svg");
  background-position: center;
  background-size: contain;
}
.playlist-empty {
  margin-top: 0.7rem;
  margin-bottom: 0.7rem;
}





@media all and (max-width: 799px) {
  .c-info {
    width: 100%;
    margin-bottom: 0.3rem;
  }
  .c-progressBar {
    margin-left: 5%;
    margin-right: 5%;
  }
  .c-controlButtons {
    font-size: 1.2rem;
  }
  .c-volumeBarRaw {
    width: 1.3rem;
    border-radius: 0.3rem;
  }
  .c-playlist {
    bottom: 13rem;
    width: calc(100vw - 2rem);
  }
  .c-playlist-songList {
    max-height: calc(100vh - 23rem);
  }
}
</style>
