import { EventEmitter } from "events";
class MeUmyEmitter extends EventEmitter {}

class MeUmyAudioPlayer {
  constructor() {
    // data
    this.status = "pause"; //pause playing loading
    this.playlist = []; //{id: "U00001", src: {default: ""}}
    this.audio_version = "default"
    this.song_ptr = 0;
    this.load_progress = 0;
    this.play_progress = 0;
    this.duration = 0;
    this.web_audio = null;
    // control
    this.auto_play = false;
    this.play_mode = "loop"; //loop, loop once, shuffle
    this.shuffled_list = [];
    // init
    this.ctx = new Audio();
    this.event = new MeUmyEmitter();
    this.init_ctx_events();
  }

  init_ctx_events() {
    this.ctx.crossOrigin = "anonymous";
    this.ctx.addEventListener("loadedmetadata", () => {
      this.duration = this.ctx.duration;
      this.play_progress = 0;
      this.load_progress = 0;
      this.event.emit("load");
      debug(this, "loadedmetadata");
    });
    this.ctx.addEventListener("loadeddata", () => {
      this.duration = this.ctx.duration;
      this.play_progress = 0;
      this.load_progress = 0;
      this.event.emit("load");
      debug(this, "loadeddata");
    });
    this.ctx.addEventListener("canplay", () => {
      // set status
      this.status = "pause";
      this.event.emit("status update", "pause");
      // play
      if (this.auto_play) this.play();
      // reset auto play
      this.auto_play = false;
      debug(this, "canplay");
    });
    this.ctx.addEventListener("progress", () => {
      if (this.ctx.duration > 0 && this.ctx.buffered.length > 0) {
        this.load_progress =
          this.ctx.buffered.end(this.ctx.buffered.length - 1) /
          this.ctx.duration;
      }
      this.event.emit("load update", this.load_progress);
      //debug(this, 'progress')
    });
    this.ctx.addEventListener("waiting", () => {
      this.status = "loading";
      this.event.emit("status update", "loading");
      debug(this, "waiting");
    });
    this.ctx.addEventListener("playing", () => {
      this.status = "playing";
      this.event.emit("status update", "playing");
      debug(this, "playing");
    });
    this.ctx.addEventListener("play", () => {
      this.status = "playing";
      this.event.emit("status update", "playing");
      debug(this, "play");
    });
    this.ctx.addEventListener("pause", () => {
      this.status = "pause";
      this.event.emit("status update", "pause");
      debug(this, "pause");
    });
    this.ctx.addEventListener("timeupdate", () => {
      if (this.ctx.duration)
        this.play_progress = this.ctx.currentTime / this.ctx.duration;
      else this.play_progress = 0;
      this.event.emit("time update", this.play_progress);
      //debug(this, 'timeupdate')
    });
    this.ctx.addEventListener("ended", () => {
      // auto play next song when ended
      this.shift(1, true);
      debug(this, "ended");
    });
  }

  load() {
    // pause
    this.status = "pause";
    this.event.emit("status update", "pause");
    // if empty then return
    if (this.playlist.length === 0) return;
    // set src and load
    const src_list = this.playlist[this.song_ptr].src;
    this.ctx.src = src_list[this.audio_version] ? src_list[this.audio_version] : src_list.default;
    this.ctx.load();
    // events
    this.event.emit("song update", this.playlist[this.song_ptr]);
    this.status = "loading";
    this.event.emit("status update", "loading");
    debug(this, "song update");
  }

  play() {
    // if empty then return
    if (this.playlist.length === 0) return;
    // if status pause
    if (this.status === "pause") {
      this.ctx.play();
      this.status = "playing";
      this.event.emit("status update", "playing");
    }
    debug(this, "status update");
  }

  pause() {
    // if status play
    if (this.status === "playing" || this.status === "loading") {
      this.ctx.pause();
      this.status = "pause";
      this.event.emit("status update", "pause");
    }
    debug(this, "status update");
  }

  shift(offset, auto_play = false) {
    // if empty then return
    if (this.playlist.length === 0) return;
    // only one song in list or loop once, then return to start to avoid load again
    if (this.playlist.length === 1 || this.play_mode === "loop once") {
      this.ctx.currentTime = 0;
      this.play();
      return;
    }
    // loop
    if (this.play_mode === "loop") {
      this.song_ptr += offset;
      this.song_ptr += this.playlist.length;
      this.song_ptr %= this.playlist.length;
    }
    // shuffle
    else if (this.play_mode === "shuffle") {
      let shuffled_ptr = this.shuffled_list.findIndex(
        (idx) => idx === this.song_ptr
      );
      shuffled_ptr += offset;
      shuffled_ptr += this.shuffled_list.length;
      shuffled_ptr %= this.shuffled_list.length;
      this.song_ptr = this.shuffled_list[shuffled_ptr];
    }
    this.auto_play = auto_play || this.status === "playing";
    this.load();
    debug(this, "shift");
  }

  jump(ptr) {
    // if empty then return
    if (this.playlist.length === 0) return;
    this.song_ptr = ptr;
    this.load();
    debug(this, "jump");
  }

  clear_playlist() {
    this.pause();
    this.playlist = [];
    this.shuffled_list = [];
    this.song_ptr = 0;
    this.ctx.src = "";
    debug(this, "clear playlist");
  }

  edit_playlist_delete(ptr) {
    // if only one or zero song in list
    if (this.playlist.length <= 1) {
      this.clear_playlist();
      return;
    }
    // if target song is playing, switch to next song
    if (this.song_ptr === ptr) {
      this.song_ptr += 1;
      this.song_ptr %= this.playlist.length;
      this.auto_play = false;
      this.load();
    }
    // get current song id
    let id = this.playlist[this.song_ptr].id;
    // delete song
    this.playlist.splice(ptr, 1);
    // get current song ptr
    this.song_ptr = this.playlist.findIndex((song) => song.id === id);

    this.shuffle_playlist();
    debug(this, "edit playlist delete");
  }

  edit_playlist_add(new_song_list) {
    new_song_list.forEach((new_song) => {
      if (this.playlist.findIndex((song) => song.id === new_song.id) === -1) {
        this.playlist.push({ id: new_song.id, src: new_song.src });
      }
    });
    this.shuffle_playlist();
    debug(this, "edit playlist add");
  }

  shuffle_playlist() {
    const length = this.playlist.length;
    if (length === 0) {
      this.shuffled_list = [];
      return;
    }
    // new array
    const result = new Array(length);
    for (let i = 0; i < length; i++) {
      result[i] = i;
    }
    // shuffle, copy from lodash/shuffle.js 2017
    let index = -1;
    const lastIndex = length - 1;
    while (++index < length) {
      const rand = index + Math.floor(Math.random() * (lastIndex - index + 1));
      const value = result[rand];
      result[rand] = result[index];
      result[index] = value;
    }
    this.shuffled_list = result;
  }

  init_advanced_ctx() {
    if (this.web_audio !== null) return;
    // create Web Audio API Context
    this.web_audio = {};
    this.web_audio.ctx = new window.AudioContext();
    // get source
    this.web_audio.source = this.web_audio.ctx.createMediaElementSource(this.ctx);
    // connect to analyser
    // https://developer.mozilla.org/zh-CN/docs/Web/API/AnalyserNode
    this.web_audio.analyser = this.web_audio.ctx.createAnalyser();
    this.web_audio.analyser.fftSize = 128;    
    this.web_audio.source.connect(this.web_audio.analyser);
    // connect to destination
    this.web_audio.source.connect(this.web_audio.ctx.destination);    
  }

  get_time_domain_data() {
    let data_array = new Uint8Array(this.web_audio.analyser.frequencyBinCount);
    this.web_audio.analyser.getByteTimeDomainData(data_array);
    return data_array;
  }

  get_freq_data() {
    let data_array = new Uint8Array(this.web_audio.analyser.frequencyBinCount);
    this.web_audio.analyser.getByteFrequencyData(data_array);
    return data_array;
  }
}

let DEBUG_FLAG = false;
function debug(o, t) {
  if (DEBUG_FLAG) {
    console.log([new Date(), t, o]);
  }
}

export default MeUmyAudioPlayer;
