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
      <play-list
        ref="playlist"
        v-show="show_playlist"
        v-bind:playlist="playlist"
        v-bind:current_song="current_song"
        v-on:close="show_playlist=false"
        v-on:clear="playlist_clear"
        v-on:apply="change_song"
        v-on:remove="playlist_remove_song"
      />
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
import PlayList from './PlayList.vue'
import PopUpShare from './PopUp/Share.vue'
import PopUpDetails from './PopUp/Details.vue'
let audio = {}
let audio_source = {}

// 滑动检测
var is_mouse_down = false
window.addEventListener('mouseup', () => {
  if (is_mouse_down === true) is_mouse_down = false
})

export default {
  name: 'AudioPlayer',
  components: {
    PlayList,
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
      //if (this.show_playlist) this.playlist_scroll()
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
      this.audio_pause()
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
      this.$refs.playlist.playlist_scroll()
    }
  },
  computed: {
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
    audio.volume = 0.9
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
@import '../styles/audio_player.css';
</style>
