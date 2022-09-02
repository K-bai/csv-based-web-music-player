<template>
  <div>
    <div class="title title-filter">
      <div>我的歌单</div>
      <div
        class="title-filter-expand"
        v-on:click="show_my_collection = !show_my_collection"
      >
        {{ show_my_collection ? "...收起" : "展开..." }}
      </div>
    </div>
    <div class="c-song-collection" v-show="show_my_collection">
      <div
        v-bind:class="[
          'collection-item',
          { 'collection-item-deleting': is_deleting_collection },
        ]"
        v-for="(collection, index) in my_song_collection"
        v-bind:key="collection.name"
        v-on:click="click_collection(index)"
        v-bind:title="is_deleting_collection ? '删除该歌单' : '替换播放列表'"
      >
        <img
          src="@/assets/ui/bookmark-star.svg"
          v-show="!is_deleting_collection"
        />
        <img src="@/assets/ui/trash-fill.svg" v-show="is_deleting_collection" />
        <div>{{ collection.name }}</div>
      </div>
      <button
        class="general-button general-button-red control-item"
        v-on:click="toggle_delete_collection()"
        v-show="my_song_collection.length !== 0"
      >
        {{ is_deleting_collection ? "取消" : "删除歌单" }}
      </button>
      <div class="c-add-collection control-item">
        <input
          v-model="add_collection_name"
          placeholder="歌单名"
          class="general-input add-collection-input"
          v-on:keydown.enter="add_press_enter"
          v-on:keydown.space.stop=""
        />
        <button
          class="general-button general-button-grey add-collection-button"
          v-on:click="add_collection()"
        >
          添加当前播放列表为歌单
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import utils from "@/js/utils.js";
export default {
  name: "SongFilterMyCollection",
  data() {
    return {
      my_song_collection: window.meumy.my_song_collection,
      add_collection_name: "",
      show_my_collection: false,
      is_deleting_collection: false,
    };
  },
  methods: {
    add_press_enter(event) {
      this.add_collection();
      event.target.blur();
    },
    click_collection(idx) {
      if (this.is_deleting_collection) {
        this.my_song_collection.splice(idx, 1);
        // 写入localstorage
        utils.save_my_collection();
        this.is_deleting_collection = false;
      } else {
        this.replace_collection(this.my_song_collection[idx].list);
      }
    },
    replace_collection(song_collection) {
      this.$parent.$parent.$parent.$refs.player.playlist_replace(
        song_collection.filter((s) => s.have_audio)
      );
    },
    add_collection() {
      // 没写名字就不管
      if (this.add_collection_name === "") return;
      // 歌单是空的就不管
      if (window.meumy.playlist[0].id === "empty_song") return;

      // 查找同名歌单
      let idx = this.my_song_collection
        .map((c) => c.name)
        .findIndex((n) => n === this.add_collection_name);
      if (idx !== -1) {
        // 已有同名就更新
        this.my_song_collection[idx].list = [...window.meumy.playlist];
      } else {
        // 否则新建
        this.my_song_collection.push({
          name: this.add_collection_name,
          list: [...window.meumy.playlist],
        });
      }
      // 写入localstorage
      utils.save_my_collection();
    },
    toggle_delete_collection() {
      this.is_deleting_collection = !this.is_deleting_collection;
    },
  },
};
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
  .collection-item:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }
}
.collection-item:active {
  background-color: rgba(0, 0, 0, 0.1);
}
.collection-item div {
  margin-left: 0.3rem;
}
.collection-item-deleting {
  border-bottom: 2px rgb(200, 0, 0) solid;
}

.control-item {
  margin-right: 1rem;
  margin-top: 0.2rem;
  margin-bottom: 0.2rem;
  min-height: 2rem;
}
.c-add-collection {
  display: flex;
  align-items: stretch;
}
.add-collection-input {
  border-top-right-radius: 0px;
  border-bottom-right-radius: 0px;
  border-right: none;
}
.add-collection-button {
  border-top-left-radius: 0px;
  border-bottom-left-radius: 0px;
}
</style>
