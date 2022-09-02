import utils from "@/js/utils.js";
import data from "@/js/data.js";
import MeUmyAudioPlayer from "@/js/audio_player.js";

// 全局变量
window.meumy = {
  song_list: [],
  song_collection: [],
  my_song_collection: [],
  recording_list: [],
  playlist: [utils.empty_song],
  love_list: utils.read_love_list(),
  cutter_list: data.cutter_list,
  filter_options: {
    star: ["星标", "非星标"],
    have_audio: ["有音频", "无音频"],
    order: ["时间倒序", "时间正序"],
    search_type: ["搜索歌名", "搜索全部信息"],
    status: [],
    language: [],
    artist: [],
    month: [],
    collection: [],
  },
  backdoor: false,
  use_treated: { value: false },
  debug_list: [],
  audio_player: new MeUmyAudioPlayer(),
};
