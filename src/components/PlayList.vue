<template>
  <div class="c-playlist">
    <div class="c-playlist-title">
      <div class="playlist-clearAll">
        <span @click="$emit('clear')">清空</span>
      </div>
      <div class="playlist-title">播放列表</div>
      <div class="playlist-close">
        <span @click="$emit('close')">收起</span>
      </div>
    </div>
    <div class="c-playlist-songList">
      <virtual-list
        ref="virtual_playlist"
        class="c-playlist-virtual-list"
        :data-key="'id'"
        :data-sources="playlist_without_empty"
        :extra-props="{ current_song }"
        :data-component="SongItem"
        :keeps="50"
        @apply="$emit('apply', $event)"
        @remove="$emit('remove', $event)"
      />
      <!--
      <play-list-item
        v-for="(song, index) in playlist_without_empty"
        v-bind:key="song.id"
        v-bind:source="{current_song, song}"
        v-bind:index="index"
        v-on:apply="$emit('apply', $event)"
        v-on:remove="$emit('remove', $event)"
      />
      -->
      <div v-show="playlist[0].id === 'empty_song'" class="playlist-empty">
        播放列表为空
      </div>
    </div>
  </div>
</template>

<script>
import PlayListItem from "./PlayListItem.vue";
import VirtualList from "vue-virtual-scroll-list";
export default {
  name: "PlayList",
  components: {
    VirtualList,
  },
  props: ["playlist", "current_song"],
  data() {
    return {
      SongItem: PlayListItem,
    };
  },
  computed: {
    playlist_without_empty() {
      return this.playlist.filter((s) => {
        return s.id !== "empty_song";
      });
    },
  },
  methods: {
    playlist_scroll() {
      // 滚动播放列表到当前歌曲
      this.$refs.virtual_playlist.scrollToIndex(this.current_song);
      //this.$refs.playlist.children[this.current_song].scrollIntoView({
      //  block: "nearest",
      //});
    },
  },
};
</script>

<style scoped>
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
  min-width: 0;
  overflow-y: auto;
  overscroll-behavior: contain;
}
.c-playlist-virtual-list {
  max-height: calc(100vh - 15rem);
  overflow-y: auto;
}
.playlist-empty {
  margin-top: 0.7rem;
  margin-bottom: 0.7rem;
}

@media all and (max-width: 799px) {
  .c-playlist {
    bottom: 13rem;
    width: calc(100vw - 2rem);
  }
  .c-playlist-virtual-list {
    max-height: calc(100vh - 23rem);
  }
}
</style>
