<template>
  <div class="c-import card">
    <div class="import-info">
      <div>粘贴代码导入歌单：</div>
      <el-popover ref="pop1" trigger="click" :content="import_popper" />
      <button
        v-popover:pop1
        class="general-button general-button-blue import-button"
        @click="import_code"
      >
        导入！
      </button>
    </div>
    <textarea v-model="code" class="import-code" @keydown.space.stop="" />
  </div>
</template>

<script>
import utils from "@/js/utils.js";
export default {
  name: "ImportSongList",
  data() {
    return {
      code: "",
      import_popper: "?",
    };
  },
  methods: {
    import_code() {
      if (this.code.trim().length === 0) {
        this.import_popper = "?你没粘贴东西";
        return;
      }
      let song_list = utils.decode_share(this.code.trim());
      if (song_list) {
        this.$parent.$refs.player.playlist_replace(song_list);
        this.import_popper = "导入成功!";
      } else this.import_popper = "歌单代码错误，请重新复制一下试试~";
      this.code = "";
    },
  },
};
</script>

<style scoped>
.c-import {
  margin-top: 4rem;
  margin-bottom: 1rem;
  padding: 1rem;
}
.import-info {
  display: flex;
  align-items: stretch;
  justify-content: space-between;
}
.import-button {
  height: 2rem;
}
.import-code {
  margin-top: 1rem;
  width: 100%;
  overflow-y: scroll;
  height: 3.6rem;
  resize: none;
}
</style>
