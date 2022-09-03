<template>
  <div id="player">
    <div class="c-player" @mousemove="player_mouse_event">
      <div class="c-info">
        <div class="c-songInfo">
          <div class="c-songName">
            <div class="songName">
              {{ playlist[current_song].name }}
            </div>
            <div class="singer">
              {{ playlist[current_song].artist }}
            </div>
          </div>
          <div class="c-songStatus">
            <div class="date">
              {{ playlist[current_song].date }}
            </div>
            <div class="songStatus">
              {{ playlist[current_song].status }}
            </div>
          </div>
        </div>
        <div class="c-info-op">
          <div class="shareButton otherButtons" @click="toggle_share">
            <img src="@/assets/ui/share.svg" />
          </div>
          <div class="detailsButton otherButtons" @click="toggle_details">
            <img src="@/assets/ui/three-dots.svg" />
          </div>
        </div>
      </div>
      <div class="c-control">
        <div class="c-controlButtons">
          <div class="c-otherButtons">
            <div
              class="playModeButton otherButtons"
              :title="play_mode_text"
              @click="switch_play_mode"
            >
              <img
                v-show="play_mode == 'loop'"
                src="@/assets/ui/arrow-repeat.svg"
              />
              <img
                v-show="play_mode == 'loop once'"
                src="@/assets/ui/arrow-repeat-once.svg"
              />
              <img
                v-show="play_mode == 'shuffle'"
                src="@/assets/ui/shuffle.svg"
              />
            </div>
            <div>
              <div
                class="volumeButton otherButtons"
                title="音量"
                @click="show_volume_bar = !show_volume_bar"
              >
                <img src="@/assets/ui/volume-up.svg" />
              </div>
              <transition name="fade">
                <div v-show="show_volume_bar" class="c-volumeBar">
                  <div
                    id="c-volumeBarRaw"
                    class="c-volumeBarRaw"
                    @mousedown="volume_bar_mouse_event"
                    @mousemove="volume_bar_mouse_event"
                    @touchmove.prevent="volume_bar_touch_event"
                  >
                    <div class="volumeBar-invert" :style="volume_height" />
                  </div>
                </div>
              </transition>
            </div>
          </div>
          <div class="c-playButtons">
            <div
              class="prevButton playButtons"
              title="上一曲"
              @click="next_song(-1)"
            >
              <div />
            </div>
            <div
              class="playButton playButtons"
              title="按下空格播放/暂停"
              @click="audio_toggle_play"
            >
              <div
                :class="[
                  { 'playButton-play': !play_status },
                  { 'playButton-pause': play_status },
                  { 'playButton-loading': audio_loading },
                ]"
              />
            </div>
            <div
              class="nextButton playButtons"
              title="下一曲"
              @click="next_song(1)"
            >
              <div />
            </div>
          </div>
          <div class="c-otherButtons">
            <div
              class="loveButton otherButtons"
              title="设为星标歌曲"
              @click="toggle_loved"
            >
              <img v-show="!is_loved" src="@/assets/ui/star.svg" />
              <img v-show="is_loved" src="@/assets/ui/star-fill.svg" />
            </div>
            <div
              class="playlistButton otherButtons"
              title="播放列表"
              @click="show_playlist = !show_playlist"
            >
              <div class="playlistButton-img" />
              <div class="playlistButton-corner">
                {{ playlist_length }}
              </div>
            </div>
          </div>
        </div>
        <div class="c-progressBarText">
          <div class="currentTime">
            {{ second_to_text(play_progress * duration) }}
          </div>
          <div class="c-progressBar">
            <div
              class="progressBar-button"
              :style="progress_bar_button_left"
              @mousedown="progress_bar_button_mouse_event"
              @touchmove.prevent="progress_bar_touch_event"
            />
            <div
              id="c-progressBarRaw"
              class="c-progressBarRaw"
              @mousedown="progress_bar_mouse_event"
              @touchmove.prevent="progress_bar_touch_event"
            >
              <div class="progressBar-fill" :style="progress_bar_fill_width" />
              <div
                class="progressBar-loading"
                :style="progress_bar_loading_width"
              />
            </div>
          </div>
          <div class="duration">
            {{ second_to_text(duration) }}
          </div>
        </div>
      </div>
    </div>
    <transition name="fade" @enter="playlist_scroll">
      <play-list
        v-show="show_playlist"
        ref="playlist"
        :playlist="playlist"
        :current_song="current_song"
        @close="show_playlist = false"
        @clear="playlist_clear"
        @apply="change_song"
        @remove="playlist_remove_song"
      />
    </transition>
    <pop-up-share
      v-if="show_share"
      :song="playlist[current_song]"
      @closepopup="show_share = false"
    />
    <pop-up-details
      v-if="show_details"
      :song="playlist[current_song]"
      @closepopup="show_details = false"
    />
  </div>
</template>

<script>
import utils from "@/js/utils.js";
import PlayList from "./PlayList.vue";
import PopUpShare from "./PopUp/Share.vue";
import PopUpDetails from "./PopUp/Details.vue";
import default_cover from "@/assets/logo.png";
const audio_player = window.meumy.audio_player;

// 滑动检测
var is_mouse_down = false;
window.addEventListener("mouseup", () => {
  if (is_mouse_down === true) is_mouse_down = false;
});

const AudioPlayer = {
  name: "AudioPlayer",
  components: {
    PlayList,
    PopUpShare,
    PopUpDetails,
  },
  data() {
    return {
      show_playlist: false,
      show_volume_bar: false,
      show_share: false,
      show_details: false,
      play_mode: "loop",
      play_status: false,
      audio_loading: false,
      volume: 0.9,
      play_progress: 0,
      load_progress: 0,
      duration: 0,
      playlist: window.meumy.playlist,
      love_list: window.meumy.love_list,
      current_song: 0,
    };
  },
  methods: {
    second_to_text: function (second) {
      second = Math.floor(second);
      var second_s = String(second % 60);
      if (second_s.length === 1) second_s = "0" + second_s;
      var minute_s = String(Math.floor(second / 60));
      if (minute_s.length === 1) minute_s = "0" + minute_s;
      return `${minute_s}:${second_s}`;
    },
    switch_play_mode() {
      if (this.play_mode === "loop") {
        audio_player.play_mode = "loop once";
        this.play_mode = "loop once";
      } else if (this.play_mode === "loop once") {
        audio_player.play_mode = "shuffle";
        this.play_mode = "shuffle";
      } else if (this.play_mode === "shuffle") {
        audio_player.play_mode = "loop";
        this.play_mode = "loop";
      }
      utils.save_settings({ play_mode: audio_player.play_mode });
    },
    volume_bar_mouse_event(event) {
      // 判断是否按键
      if (event.buttons !== 0) {
        var target = document.getElementById("c-volumeBarRaw");
        var percent =
          (event.clientY - target.getBoundingClientRect().top) /
          target.clientHeight;
        this.set_volume(1 - percent);
      }
    },
    volume_bar_touch_event(event) {
      var target = document.getElementById("c-volumeBarRaw");
      var percent =
        (event.targetTouches[0].clientY - target.getBoundingClientRect().top) /
        target.clientHeight;
      this.set_volume(1 - percent);
    },
    progress_bar_mouse_event(event) {
      var target = document.getElementById("c-progressBarRaw");
      var percent =
        (event.clientX - target.getBoundingClientRect().left) /
        target.clientWidth;
      this.set_play_progress(Math.max(Math.min(percent, 1), 0));
    },
    progress_bar_touch_event(event) {
      var target = document.getElementById("c-progressBarRaw");
      var percent =
        (event.targetTouches[0].clientX - target.getBoundingClientRect().left) /
        target.clientWidth;
      this.set_play_progress(Math.max(Math.min(percent, 1), 0));
    },
    progress_bar_button_mouse_event(event) {
      event.stopPropagation();
      is_mouse_down = true;
    },
    toggle_share() {
      if (this.playlist[this.current_song].id !== "empty_song")
        this.show_share = !this.show_share;
    },
    toggle_details() {
      if (this.playlist[this.current_song].id !== "empty_song")
        this.show_details = !this.show_details;
    },
    audio_toggle_play() {
      if (audio_player.status === "pause") audio_player.play();
      else if (audio_player.status === "playing") audio_player.pause();
    },
    next_song(offset) {
      audio_player.shift(offset);
    },
    change_song(idx) {
      audio_player.auto_play = true;
      audio_player.jump(idx);
    },
    player_mouse_event(event) {
      // 按键才执行
      if (is_mouse_down) {
        this.progress_bar_mouse_event(event);
      }
    },
    set_play_progress(progress) {
      audio_player.ctx.currentTime = Math.max(
        progress * this.duration - 0.05,
        0
      );
      this.play_progress = progress;
    },
    set_volume(volume) {
      volume = Math.min(1, Math.max(0, volume));
      audio_player.ctx.volume = volume;
      this.volume = volume;
    },
    toggle_loved() {
      if (this.playlist[0].id === "empty_song") return;
      let id = this.playlist[this.current_song].id;
      // 切换状态
      if (this.is_loved) {
        // 修改喜爱列表
        let idx = this.love_list.findIndex((i) => id === i);
        this.love_list.splice(idx, 1);
      } else {
        // 修改喜爱列表
        this.love_list.push(this.playlist[this.current_song].id);
      }
      // 保存喜爱列表
      utils.save_love_list(this.love_list);
    },
    playlist_sync_player() {
      // 同步播放器的歌单
      let new_list = [];
      if (audio_player.playlist.length === 0) {
        new_list.push(utils.empty_song);
      } else {
        audio_player.playlist.forEach((song) => {
          new_list.push(
            window.meumy.song_list.find((org_song) => org_song.id === song.id)
          );
        });
      }
      this.playlist.splice(0, this.playlist.length);
      this.playlist.push(...new_list);
      this.current_song = audio_player.song_ptr;
    },
    playlist_clear() {
      audio_player.clear_playlist();
      this.playlist_sync_player();
      // 保存当前歌单
      utils.save_playlist(this.current_song, this.playlist);
    },
    playlist_remove_song(idx) {
      // 修改播放器歌单
      audio_player.edit_playlist_delete(idx);
      // 根据播放器歌单重建ui歌单
      this.playlist_sync_player();
      // 保存当前歌单
      utils.save_playlist(this.current_song, this.playlist);
    },
    playlist_remove_song_id(id) {
      // 根据id找到对应的下标删歌
      let idx = this.playlist.findIndex((s) => s.id === id);
      if (idx === -1) return;
      this.playlist_remove_song(idx);
    },
    playlist_add_song(song, jump = false, auto_play = false) {
      // 修改播放器歌单
      audio_player.edit_playlist_add([song]);

      let load_song = false;
      if (this.playlist[0].id === "empty_song") {
        // 如果播放列表是空的就要加载歌曲
        load_song = true;
      }
      // 根据播放器歌单重建ui歌单
      this.playlist_sync_player();
      // 原来播放列表是空的 或者 要求跳转 就跳转到歌曲
      if (load_song || jump) {
        // 如果要求跳转就自动播放
        audio_player.auto_play = auto_play;
        audio_player.song_ptr = audio_player.playlist.findIndex((s) => s.id === song.id)
        audio_player.load();
      }
      // 保存当前歌单
      utils.save_playlist(this.current_song, this.playlist);
    },
    playlist_add_many(songs) {
      // 修改播放器歌单
      audio_player.edit_playlist_add(songs);
      // 如果播放列表是空的
      let if_old_empty = this.playlist[0].id === "empty_song";
      // 根据播放器歌单重建ui歌单
      this.playlist_sync_player();
      // 新列表是否有歌
      let if_new_not_empty = this.playlist[0].id !== "empty_song";
      // 原来播放列表是空的且现在有歌就设置src并暂停
      if (if_old_empty && if_new_not_empty) {
        audio_player.auto_play = false;
        audio_player.load();
      }
      // 保存当前歌单
      utils.save_playlist(this.current_song, this.playlist);
    },
    playlist_replace(playlist, current_song = 0) {
      // 修改播放器歌单
      audio_player.clear_playlist();
      audio_player.edit_playlist_add(playlist);
      // 根据播放器歌单重建ui歌单
      this.playlist_sync_player();
      // 更换歌单后暂停播放
      audio_player.song_ptr = current_song;
      audio_player.auto_play = false;
      audio_player.load();
    },
    playlist_share() {
      // 输出歌单中歌曲的id列表
      return this.playlist.map((s) => s.id);
    },
    playlist_scroll() {
      // 滚动播放列表到当前歌曲
      this.$refs.playlist.playlist_scroll();
    },
  },
  computed: {
    volume_height() {
      return {
        height: String((1 - this.volume) * 100) + "%",
      };
    },
    progress_bar_fill_width() {
      return {
        width: String(this.play_progress * 100) + "%",
      };
    },
    progress_bar_loading_width() {
      return {
        width: String(this.load_progress * 100) + "%",
      };
    },
    progress_bar_button_left() {
      return {
        left: `calc(${this.play_progress * 100}% - 0.75rem)`,
      };
    },
    play_mode_text() {
      if (this.play_mode === "loop") return "列表循环";
      if (this.play_mode === "loop once") return "单曲循环";
      return "随机";
    },
    playlist_length() {
      if (this.playlist[0].id === "empty_song") return 0;
      else return this.playlist.length;
    },
    is_loved() {
      // 空列表就返回否
      if (this.playlist[0].id === "empty_song") return false;
      let id = this.playlist[this.current_song].id;
      if (this.love_list.findIndex((i) => id === i) !== -1) return true;
      return false;
    },
  },
  mounted() {
    // 播放器事件注册
    audio_player.event.on("load", () => {
      this.duration = audio_player.duration;
      this.play_progress = audio_player.play_progress;
      this.load_progress = audio_player.load_progress;
    });
    audio_player.event.on("load update", (progress) => {
      this.load_progress = progress;
    });
    audio_player.event.on("time update", (time) => {
      this.play_progress = time;
    });
    audio_player.event.on("status update", (status) => {
      if (status === "playing") {
        this.play_status = true;
        this.audio_loading = false;
      } else if (status === "pause") {
        this.play_status = false;
        this.audio_loading = false;
      } else if (status === "loading") {
        this.play_status = false;
        this.audio_loading = true;
      }
    });
    audio_player.event.on("song update", (song) => {
      // update current song
      this.current_song = this.playlist.findIndex((s) => song.id === s.id);
      // 更改media session信息
      if ("mediaSession" in navigator) {
        navigator.mediaSession.metadata = new window.MediaMetadata({
          title: this.playlist[this.current_song].name,
          artist: this.playlist[this.current_song].artist,
          album: "",
          artwork: [{ src: default_cover }],
        });
      }
      audio_player.ctx.title = this.playlist[this.current_song].name;
      // 保存当前歌单
      utils.save_playlist(this.current_song, this.playlist);
    });

    // media session支持
    if ("mediaSession" in navigator) {
      navigator.mediaSession.setActionHandler("play", () => {
        utils.debug("通过media session播放");
        this.audio_toggle_play();
      });
      navigator.mediaSession.setActionHandler("pause", () => {
        utils.debug("通过media session暂停");
        this.audio_toggle_play();
      });
      navigator.mediaSession.setActionHandler("previoustrack", () => {
        utils.debug("通过media session上一曲");
        this.next_song(-1);
      });
      navigator.mediaSession.setActionHandler("nexttrack", () => {
        utils.debug("通过media session下一曲");
        this.next_song(1);
      });
    }
    // 空格键播放/暂停
    document.addEventListener("keydown", (e) => {
      if (e.code === "Space" && !e.isComposing) {
        this.audio_toggle_play();
        e.preventDefault();
      }
    });
  },
};

export default AudioPlayer;
</script>

<style scoped>
@import "../styles/audio_player.css";
</style>
