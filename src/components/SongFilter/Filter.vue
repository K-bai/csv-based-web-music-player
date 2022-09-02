<template>
  <div class="c-outer card">
    <song-filter-collection />
    <hr />
    <song-filter-my-collection />
    <hr />
    <div class="title title-filter">
      <div>筛选</div>
      <div class="title-filter-expand" @click="show_filter = !show_filter">
        {{ show_filter ? "...收起" : "展开..." }}
      </div>
    </div>
    <div v-show="show_filter" class="c-filter">
      <div
        v-for="filter_item in filters"
        :key="filter_item.name"
        class="filter-item"
      >
        <div class="filter-item-label">{{ filter_item.text }}:</div>
        <el-select
          v-model="filter_item.value"
          :multiple="filter_item.multiple"
          clearable
          collapse-tags
          @change="filter_change_event"
        >
          <el-option
            v-for="option in filter_item.options"
            :key="option"
            :value="option"
            :label="option"
          />
        </el-select>
        <!--
        <select
          class="general-input"
          v-model="filter_item.value"
          v-on:change="filter_change_event"
        >
          <option
            v-for="option in filter_item.options"
            v-bind:value="option"
            v-bind:key="option"
          >{{option}}</option>
        </select>
        -->
      </div>
      <div class="filter-item">
        <input
          id="filter-checkbox-treated"
          v-model="use_treated.value"
          class="general-checkbox"
          type="checkbox"
          @change="change_use_treated"
        />
        <label
          for="filter-checkbox-treated"
          class="filter-item-label filter-item-treated"
          >听经过处理的歌</label
        >
        <div class="filter-item-question" @click="show_explain = true" />
      </div>
    </div>
    <div class="filter-song-search">
      <select
        v-model="search.type"
        class="general-input filter-song-search-select"
      >
        <option v-for="option in search.options" :key="option" :value="option">
          {{ option }}
        </option>
      </select>
      <input
        v-model="search.text"
        class="general-input filter-song-search-input"
        @keydown.enter="search_press_enter"
        @keydown.space.stop=""
      />
      <button
        class="general-button general-button-blue filter-song-search-go filter-song-search-button"
        @click="apply_search(false)"
      >
        搜索!
      </button>
      <button
        class="general-button general-button-grey filter-song-search-clear filter-song-search-button"
        @click="apply_search(true)"
      >
        清空
      </button>
    </div>
    <pop-up-explain-treated
      v-if="show_explain"
      @closepopup="show_explain = false"
    />
  </div>
</template>

<script>
import PopUpExplainTreated from "@/components/PopUp/ExplainTreated.vue";
import SongFilterCollection from "./Collection.vue";
import SongFilterMyCollection from "./MyCollection.vue";
import utils from "@/js/utils.js";

export default {
  name: "SongFilter",
  components: {
    SongFilterMyCollection,
    SongFilterCollection,
    PopUpExplainTreated,
  },
  props: ["song_list_filtered"],
  data() {
    return {
      show_filter: false,
      filters: [
        {
          name: "artist",
          text: "演唱者",
          multiple: true,
          value: [],
          options: window.meumy.filter_options.artist,
        },
        {
          name: "status",
          text: "演唱状态",
          multiple: true,
          value: [],
          options: window.meumy.filter_options.status,
        },
        {
          name: "language",
          text: "语言",
          multiple: true,
          value: [],
          options: window.meumy.filter_options.language,
        },
        {
          name: "month",
          text: "月份",
          multiple: true,
          value: [],
          options: window.meumy.filter_options.month,
        },
        {
          name: "collection",
          text: "歌单",
          multiple: true,
          value: [],
          options: window.meumy.filter_options.collection,
        },
        {
          name: "star",
          text: "星标",
          multiple: false,
          value: "",
          options: window.meumy.filter_options.star,
        },
        {
          name: "have_audio",
          text: "是否有音频",
          multiple: false,
          value: "",
          options: window.meumy.filter_options.have_audio,
        },
        {
          name: "order",
          text: "排序",
          multiple: false,
          value: "时间倒序",
          options: window.meumy.filter_options.order,
        },
      ],
      search_type: "搜索歌名",
      search: {
        text: "",
        text_for_search: "",
        type: "搜索歌名",
        options: window.meumy.filter_options.search_type,
      },
      use_treated: window.meumy.use_treated,
      show_explain: false,
    };
  },
  computed: {
    self_song_list_filtered: function () {
      let l = window.meumy.song_list.slice();
      let filter = {};
      for (let item of this.filters) filter[item.name] = item.value;
      // 筛选歌单
      if (filter.collection.length !== 0)
        l = window.meumy.song_collection
          .find((c) => filter.collection.findIndex((i) => i === c.name) !== -1)
          .list.slice();
      // 筛选演唱状态
      if (filter.status.length !== 0)
        l = l.filter((song) => filter.status.includes(song.status));
      // 筛选语言
      if (filter.language.length !== 0)
        l = l.filter(
          (song) => filter.language.findIndex((i) => i === song.language) !== -1
        );
      // 筛选演唱者
      if (filter.artist.length !== 0) {
        l = l.filter((song) => {
          let artist_list = song.artist.split(",");
          return (
            artist_list.findIndex(
              (a) => filter.artist.findIndex((i) => i === a) !== -1
            ) !== -1
          );
        });
      }
      // 筛选月份
      if (filter.month.length !== 0)
        l = l.filter(
          (song) =>
            filter.month.findIndex((i) => i === song.date.substring(0, 7)) !==
            -1
        );
      // 筛选星标
      if (filter.star === "星标")
        l = l.filter(
          (song) =>
            window.meumy.love_list.findIndex((love) => song.id === love) !== -1
        );
      else if (filter.star === "非星标")
        l = l.filter(
          (song) =>
            window.meumy.love_list.findIndex((love) => song.id === love) === -1
        );
      // 筛选是否有音频
      if (filter.have_audio === "有音频")
        l = l.filter((song) => song.have_audio);
      else if (filter.have_audio === "无音频")
        l = l.filter((song) => !song.have_audio);
      // 筛选搜索
      if (this.search.text_for_search !== "") {
        if (this.search.type === "搜索歌名")
          l = l.filter(
            (song) =>
              song.name
                .toLowerCase()
                .search(this.search.text_for_search.toLowerCase()) !== -1
          );
        else {
          l = l.filter((song) => {
            let t = this.search.text_for_search.toLowerCase();
            let flag = flag;
            flag = flag || song.name.toLowerCase().search(t) !== -1;
            if (song.note !== "")
              flag = flag || song.note.toLowerCase().search(t) !== -1;
            if (song.ref)
              flag = flag || song.ref.name.toLowerCase().search(t) !== -1;
            if (song.ref_cut)
              flag = flag || song.ref_cut.name.toLowerCase().search(t) !== -1;
            return flag;
          });
        }
      }
      // 排序
      if (filter.order === "时间正序") l.reverse();
      return l;
    },
  },
  mounted() {
    this.$root.$on("data_loaded", this.filter_change_event);
    this.$root.$on("jump_collection", (name) => {
      // 跳转到特定歌单
      // 展开筛选
      this.show_filter = true;
      // 清空所有筛选
      this.clear_all_filter();
      this.filters.find((f) => f.name === "collection").value = [name];
      this.filter_change_event();
    });
  },
  methods: {
    apply_search(clear) {
      if (clear) this.search.text = "";
      this.search.text_for_search = this.search.text.trim();
      this.filter_change_event();
    },
    filter_change_event() {
      this.$emit("update:song_list_filtered", this.self_song_list_filtered);
    },
    replace_collection(song_collection) {
      this.$parent.$parent.$refs.player.playlist_replace(
        song_collection.filter((s) => s.have_audio)
      );
    },
    search_press_enter(event) {
      this.apply_search(false);
      event.target.blur();
    },
    change_use_treated() {
      utils.save_settings({
        use_treated: this.use_treated.value,
      });
    },
    clear_all_filter() {
      this.filters.find((f) => f.name === "artist").value = [];
      this.filters.find((f) => f.name === "status").value = [];
      this.filters.find((f) => f.name === "language").value = [];
      this.filters.find((f) => f.name === "month").value = [];
      this.filters.find((f) => f.name === "collection").value = [];
      this.filters.find((f) => f.name === "star").value = "";
      this.filters.find((f) => f.name === "have_audio").value = "";
      this.filters.find((f) => f.name === "order").value = "时间倒序";
      this.apply_search(true);
    },
  },
};
</script>

<style scoped>
.c-outer {
  padding: 0.5rem;
  width: calc(100% - 1rem);
  margin-top: 1rem;
  margin-bottom: 1rem;
}
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
.c-filter {
  display: flex;
  flex-wrap: wrap;
}
.filter-item {
  flex-grow: 1;
  margin: 0.5rem;
  margin-right: 1rem;
  display: flex;
  align-items: center;
}
.filter-item-label {
  margin-right: 0.5rem;
}
#filter-checkbox-treated {
  margin-right: 0.5rem;
}
.filter-item-treated {
  margin-right: 0rem;
}
.filter-item-question {
  background-image: url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='%23333' viewBox='0 0 16 16'><path d='M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z'/><path d='M5.255 5.786a.237.237 0 0 0 .241.247h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286zm1.557 5.763c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94z'/></svg>");
  background-position: center;
  background-size: contain;
  height: 0.9rem;
  width: 0.9rem;
  margin-top: 0.1rem;
  margin-left: 0.1rem;
  cursor: pointer;
}

.filter-song-search {
  display: flex;
  align-items: stretch;
}
.filter-song-search-select {
  flex-grow: 0;
  flex-shrink: 1;
  border-top-right-radius: 0px;
  border-bottom-right-radius: 0px;
  border-right: none;
}
.filter-song-search-input {
  flex-shrink: 1;
  width: 0rem;
  min-width: 3rem;
  border-radius: 0rem;
  border-right: none;
}
.filter-song-search-button {
  flex-grow: 0;
  flex-shrink: 0;
}
.filter-song-search-go {
  border-radius: 0rem;
}
.filter-song-search-clear {
  border-top-left-radius: 0px;
  border-bottom-left-radius: 0px;
  border-left: none;
}
</style>
