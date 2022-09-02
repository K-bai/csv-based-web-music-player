<template>
  <div>
    <div class="title title-filter">
      <div>歌单</div>
      <div
        class="title-filter-expand"
        @click="show_collection = !show_collection"
      >
        {{ show_collection ? "...收起" : "展开..." }}
      </div>
    </div>
    <div v-show="show_collection" class="c-song-collection">
      <div
        v-for="collection in song_collection"
        :key="collection.name"
        class="collection-item"
        :style="{ borderColor: collection.color }"
      >
        <div class="collection-item-base">
          <div class="collection-item-title">
            <div class="collection-item-icon">
              <img src="@/assets/ui/tag.svg" />
            </div>
            <div>
              <div class="collection-item-name">
                {{ collection.name }} ({{ collection.list.length }})
              </div>
              <div class="collection-item-note">
                {{ collection.note }}
              </div>
            </div>
          </div>
          <div class="collection-item-info">
            <div class="collection-item-maintainer">
              <div>维护者:</div>
              <div
                v-for="maintainer in collection.maintainer"
                :key="maintainer.name"
                class="collection-item-maintainer-id"
              >
                <a
                  :href="'https://space.bilibili.com/' + maintainer.uid"
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  @{{ maintainer.name }}
                </a>
              </div>
            </div>
            <div class="collection-item-date">
              {{ collection.date }}
            </div>
          </div>
        </div>
        <div class="collection-item-op">
          <div class="songlist-button">
            <button
              class="general-button general-button-grey replace-button"
              @click="replace_collection(collection.list)"
            >
              听！
            </button>
          </div>
          <div class="songlist-button">
            <button
              class="general-button general-button-grey jump-button"
              @click="jump_collection(collection.name)"
            >
              查看
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "SongFilterCollection",
  data() {
    return {
      song_collection: window.meumy.song_collection,
      show_collection: false,
    };
  },
  methods: {
    replace_collection(song_collection) {
      this.$parent.$parent.$parent.$refs.player.playlist_replace(
        song_collection.filter((s) => s.have_audio)
      );
    },
    jump_collection(name) {
      this.$root.$emit("jump_collection", name);
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
  box-sizing: border-box;
  padding-top: 0.3rem;
  padding-bottom: 0.3rem;
  padding-left: 0.3rem;
  padding-right: 1rem;
  margin-top: 0.2rem;
  margin-bottom: 0.2rem;
  color: #2a2d30;
  display: flex;
  justify-content: space-between;
  width: 50%;
  border-left: solid 4px;
}
.collection-item:nth-child(4n + 1) {
  background-color: rgba(0, 0, 0, 0.025);
}
.collection-item:nth-child(4n + 2) {
  background-color: rgba(0, 0, 0, 0.025);
}
.collection-item:nth-child(4n + 3) {
  background-color: rgba(0, 0, 0, 0);
}
.collection-item:nth-child(4n + 4) {
  background-color: rgba(0, 0, 0, 0);
}
.collection-item-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}
.collection-item-base {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex: 1;
}
.collection-item-title {
  display: flex;
  align-items: center;
}
.collection-item-title > div {
  margin-left: 0.5rem;
}
.collection-item-note {
  font-size: 0.8rem;
  color: grey;
}
.collection-item-info {
  display: flex;
  flex-wrap: wrap;
  font-size: 0.6rem;
  color: grey;
  margin-left: 0.5rem;
  margin-right: 0.5rem;
}
.collection-item-maintainer {
  flex-grow: 1;
  flex-shrink: 0;
  display: flex;
  flex-wrap: wrap;
}
.collection-item-maintainer-id {
  margin-right: 0.3rem;
}
.collection-item-maintainer-id a:link {
  color: grey;
}
.collection-item-maintainer-id a:visited {
  color: grey;
}
.collection-item-maintainer-id a:hover {
  color: grey;
}
.collection-item-maintainer-id a:active {
  color: grey;
}

@media (any-hover: hover) {
  .collection-item:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }
}

.collection-item-op {
  display: flex;
  flex-direction: column;
}
.songlist-button {
  flex: 1;
  margin: 0px;
  padding: 0px;
}
.songlist-button > button {
  height: 100%;
  padding-left: 1rem;
  padding-right: 1rem;
}
.replace-button {
  border-top-left-radius: 0.3rem;
  border-top-right-radius: 0.3rem;
  border-bottom-left-radius: 0rem;
  border-bottom-right-radius: 0rem;
  border-bottom: none;
}
.jump-button {
  border-top-left-radius: 0rem;
  border-top-right-radius: 0rem;
  border-bottom-left-radius: 0.3rem;
  border-bottom-right-radius: 0.3rem;
}

@media all and (max-width: 799px) {
  .collection-item {
    width: 100%;
  }
  .collection-item:nth-child(odd) {
    background-color: rgba(0, 0, 0, 0.025);
  }
  .collection-item:nth-child(even) {
    background-color: rgba(0, 0, 0, 0);
  }
}
</style>
