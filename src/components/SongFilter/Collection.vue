<template>
  <div>
    <div class="title title-filter">
      <div>歌单</div>
      <div
        class="title-filter-expand"
        v-on:click="show_collection=!show_collection"
      >{{show_collection?'...收起':'展开...'}}</div>
    </div>
    <div class="c-song-collection" v-show="show_collection">
      <div
        class="collection-item"
        v-for="collection in song_collection"
        v-bind:key="collection.name"
        v-on:click="replace_collection(collection.list)"
      >
        <img src="~bootstrap-icons/icons/tag.svg" />
        <div>{{collection.name}}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SongFilterCollection',
  data() {
    return {
      song_collection: window.meumy.song_collection,
      show_collection: false,
    }
  },
  methods: {
    replace_collection(song_collection) {
      this.$parent.$parent.$parent.$refs.player.playlist_replace(song_collection.filter(s => s.have_audio))
    }
  }
}
</script>



<style scoped>
.title {
  margin: 0.5rem;
  font-size: 1.3rem;
}
.title-filter {
  display: flex;
  align-items: flex-end;
}
.title-filter-expand {
  font-size: 0.9rem;
  color: blueviolet;
  margin-left: 1rem;
  user-select: none;
  cursor: pointer;
}

.c-song-collection {
  margin-left: 1rem;
  margin-right: 1rem;
  margin-bottom: 1rem;
  display: flex;
  flex-wrap: wrap;
}
.collection-item {
  padding-top: 0.3rem;
  padding-bottom: 0.3rem;
  padding-left: 0.6rem;
  padding-right: 0.6rem;
  margin-top: 0.2rem;
  margin-bottom: 0.2rem;
  margin-right: 1rem;
  border-bottom: 1px rgb(190, 190, 190) solid;
  color: #2a2d30;
  user-select: none;
  cursor: pointer;
  display: flex;
  align-items: flex-end;
}
@media (any-hover: hover) {
  .collection-item:hover{
    background-color: rgba(0, 0, 0, 0.05);
  }
}
.collection-item:active {
  background-color: rgba(0, 0, 0, 0.1);
}
.collection-item div {
  margin-left: 0.3rem;
}
</style>
