<template>
  <pop-up-main title="歌曲详情" @closepopup="$emit('closepopup')">
    <div class="content">
      <p><span>歌名：</span>{{ song.name }}</p>
      <p v-if="song.artist !== ''"><span>演唱者：</span>{{ song.artist }}</p>
      <p v-if="song.status !== ''"><span>演唱状态：</span>{{ song.status }}</p>
      <p v-if="song.original_artist !== ''">
        <span>原唱：</span>{{ song.original_artist }}
      </p>
      <p v-if="song.language !== ''"><span>语言：</span>{{ song.language }}</p>
      <p v-if="song.note !== ''"><span>切歌man的留言：</span>{{ song.note }}</p>
      <p v-if="song.record !== false">
        <span>对应录播：</span>
        <a
          :href="
            'https://www.bilibili.com/video/' +
            song.record.bv +
            '?p=' +
            song.record.p +
            '&t=' +
            (song.record_start_ms / 1000).toFixed(1)
          "
          target="_blank"
          rel="noreferrer noopener"
        >
          {{ song.date }} p{{ song.record.p }}
        </a>
        <span>时间点：</span>{{ song.record.timecode }}
      </p>
      <p v-if="song.ref !== false">
        <span>参考的路灯man：</span>
        <a
          :href="'https://space.bilibili.com/' + song.ref.uid"
          target="_blank"
          rel="noreferrer noopener"
        >
          @{{ song.ref.name }}
        </a>
      </p>
      <p v-if="song.ref_cut !== false">
        感谢
        <a
          :href="'https://space.bilibili.com/' + song.ref_cut.uid"
          target="_blank"
          rel="noreferrer noopener"
        >
          @{{ song.ref_cut.name }}
        </a>
        提供的音频！
      </p>
    </div>
  </pop-up-main>
</template>

<script>
import PopUpMain from "./Main.vue";

export default {
  name: "PopUpDetails",
  components: {
    PopUpMain,
  },
  props: ["song"],
  data() {
    return {};
  },
};
</script>

<style scoped>
.content > p > span {
  font-weight: bold;
}
</style>
