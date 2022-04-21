<template>
  <div
    v-bind:class="[
      'c-playlist-song',
      { 'c-playlist-playing': index === current_song },
    ]"
    v-on:click="$parent.$parent.$emit('apply', index)"
  >
    <div class="playlist-name">
      <span class="playlist-index">{{ index + 1 }}. </span>{{ source.name }}
    </div>
    <div class="playlist-dash">-</div>
    <div class="playlist-artist">{{ source.artist }}</div>
    <div class="playlist-status">{{ source.status }}</div>
    <div class="playlist-duration">{{ source.duration }}</div>
    <div
      class="playlist-clear"
      v-on:click.stop="$parent.$parent.$emit('remove', index)"
    >
      <div class="playlist-clear-img"></div>
    </div>
  </div>
</template>











<script>
export default {
  name: "PlayListItem",
  data() {
    return {};
  },
  props: [
    'index',
    'source',
    'current_song'
  ]
};
</script>




















<style scoped>
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
</style>
