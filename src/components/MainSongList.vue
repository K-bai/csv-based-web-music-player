<template>
  <div class="c-main">
    <song-filter
      ref="song_filter"
      :song_list_filtered.sync="song_list_filtered"
      @update:song_list_filtered="page = 1"
    />
    <div class="c-controller">
      <button
        class="general-button general-button-grey controller-item controller-item-all"
        @click="all_song_to_playlist"
      >
        全部筛选结果加入播放列表
      </button>
    </div>
    <div class="c-song-list">
      <div ref="header" class="song-list-header">
        <div class="header-column all-column all-column-idx" />
        <div class="header-column header-column-op all-column all-column-op">
          操作
        </div>
        <div class="all-column-info">
          <div
            class="header-column header-column-name all-column all-column-name"
          >
            <span class="header-column-name-wide">歌名</span>
            <span class="header-column-name-narrow">歌曲信息</span>
          </div>
          <div
            class="header-column header-column-artist all-column all-column-artist"
          >
            演唱者
          </div>
          <div
            class="header-column header-column-status all-column all-column-status"
          >
            演唱状态
          </div>
          <div
            class="header-column header-column-date all-column all-column-date"
          >
            演唱日期
          </div>
          <div
            class="header-column header-column-duration all-column all-column-duration"
          >
            时长
          </div>
        </div>
        <div
          class="header-column header-column-details all-column all-column-details"
          @click="expend_all"
        >
          展开
        </div>
      </div>
      <div
        v-for="(song, idx) in song_list"
        :key="song.id"
        :class="[
          'song-list-item',
          { 'dark-bg': idx % 2 === 1 },
          { 'light-bg': idx % 2 === 0 },
        ]"
      >
        <div class="song-list-item-main">
          <div class="item-column-idx all-column all-column-idx">
            {{ idx + 1 + (page - 1) * per_page }}
          </div>
          <div class="item-column-op all-column all-column-op">
            <div
              v-show="song.have_audio"
              class="item-op-download item-op-all"
              title="下载歌曲"
            >
              <a :href="song.src.default" download><div /></a>
            </div>
            <div
              v-show="song.have_audio && !in_playlist_list[idx]"
              class="item-op-add item-op-all"
              title="加入播放列表"
              @click.stop="add_song(idx)"
            >
              <div />
            </div>
            <div
              v-show="song.have_audio && in_playlist_list[idx]"
              class="item-op-added item-op-all"
              title="已在播放列表"
              @click.stop="remove_song(idx)"
            >
              <div />
            </div>
            <div
              v-show="song.have_audio"
              class="item-op-star item-op-all"
              title="星标歌曲"
              @click.stop="love_song(idx)"
            >
              <div
                :class="[
                  { 'item-op-star-true': is_loved[idx] },
                  { 'item-op-star-false': !is_loved[idx] },
                ]"
              />
            </div>
            <div v-show="!song.have_audio" class="item-op-none">
              {{
                song.days_before_available > 0
                  ? song.days_before_available + "天后可听"
                  : "暂无音频"
              }}
            </div>
          </div>
          <div
            class="all-column-info item-column-info"
            @click="add_song(idx, true)"
          >
            <div class="song-name all-column all-column-name">
              {{ song.name }}
            </div>
            <div class="song-info-artist">
              <div class="song-artist all-column all-column-artist">
                {{ song.artist }}
              </div>
              <div class="song-status all-column all-column-status">
                {{ song.status }}
              </div>
            </div>
            <div class="song-info-date">
              <div class="song-date all-column all-column-date">
                {{ song.date }}
              </div>
              <div class="song-duration all-column all-column-duration">
                {{ song.duration }}
              </div>
            </div>
          </div>
          <div
            class="item-column-details all-column all-column-details"
            @click.stop="expand_song(idx)"
          >
            {{ is_expanded[idx] ? "...收起" : "详细..." }}
          </div>
        </div>
        <div v-show="is_expanded[idx]" class="song-list-item-details">
          <div v-show="song.language !== ''" class="song-full-details-language">
            语言: {{ song.language }}
          </div>
          <div
            v-show="song.original_artist !== ''"
            class="song-full-details-orginal"
          >
            原唱: {{ song.original_artist }}
          </div>
          <div v-show="song.ref !== false" class="song-full-details-ref">
            参考的路灯man:
            <a
              :href="'https://space.bilibili.com/' + song.ref.uid"
              target="_blank"
              rel="noreferrer noopener"
            >
              @{{ song.ref.name }}
            </a>
          </div>
          <div v-show="song.record !== false" class="song-full-details-record">
            <span>录播：</span>
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
              {{ song.date }} p{{ song.record.p }} {{ song.record.timecode }}
            </a>
          </div>
          <div v-show="song.note !== ''" class="song-full-details-note">
            切歌man的留言: {{ song.note }}
          </div>
          <div
            v-show="song.ref_cut !== false"
            class="song-full-details-ref-cut"
          >
            音频提供:
            <a
              :href="'https://space.bilibili.com/' + song.ref_cut.uid"
              target="_blank"
              rel="noreferrer noopener"
            >
              @{{ song.ref_cut.name }}
            </a>
          </div>
        </div>
      </div>
      <div v-show="song_list.length === 0" class="song-list-no-item">
        无结果...
      </div>
    </div>
    <song-list-pagination
      :page.sync="page"
      :per_page.sync="per_page"
      :total="song_list_filtered.length"
      @update:page="page_change_event"
    />
  </div>
</template>

<script>
import SongFilter from "./SongFilter/Filter.vue";
import SongListPagination from "./SongListPagination.vue";
import utils from "@/js/utils.js";

export default {
  name: "MainSongList",
  components: {
    SongListPagination,
    SongFilter,
  },
  data() {
    return {
      love_list: window.meumy.love_list,
      expand_list: [],
      page: 1,
      per_page: 10,
      song_list_filtered: [],
      playlist: window.meumy.playlist,
    };
  },
  computed: {
    song_list: function () {
      // 从筛选过后的列表中选出当前页的歌
      return this.song_list_filtered.slice(
        (this.page - 1) * this.per_page,
        this.page * this.per_page
      );
    },
    in_playlist_list: function () {
      return this.song_list.map(
        (s) => this.playlist.findIndex((song) => song.id === s.id) !== -1
      );
    },
    is_loved: function () {
      return this.song_list.map(
        (song) => this.love_list.findIndex((love) => song.id === love) !== -1
      );
    },
    is_expanded: function () {
      return this.song_list.map(
        (song) =>
          this.expand_list.findIndex((expend) => song.id === expend) !== -1
      );
    },
  },
  mounted() {
    this.$root.$on("jump_collection", () => {
      // 滚动到顶部
      let header = this.$refs.header;
      header.scrollIntoView();
    });
  },
  methods: {
    add_song(idx, should_play = false) {
      if (this.song_list[idx].have_audio === false) return;
      // 这里怎么定位到播放器组件 我完全哇嘎那一
      this.$parent.$refs.player.playlist_add_song(
        this.song_list[idx],
        should_play,
        should_play
      );
    },
    remove_song(idx) {
      // 这里怎么定位到播放器组件 我完全哇嘎那一
      this.$parent.$refs.player.playlist_remove_song_id(this.song_list[idx].id);
    },
    love_song(idx) {
      let song = this.song_list[idx];
      // 修改喜爱列表
      if (this.is_loved[idx]) {
        let idx_del = this.love_list.findIndex((i) => song.id === i);
        this.love_list.splice(idx_del, 1);
      } else this.love_list.push(song.id);
      // 保存喜爱列表
      utils.save_love_list(this.love_list);
    },
    expand_song(idx) {
      let song = this.song_list[idx];
      // 修改展开列表
      if (this.is_expanded[idx]) {
        let idx_del = this.expand_list.findIndex((i) => song.id === i);
        this.expand_list.splice(idx_del, 1);
      } else this.expand_list.push(song.id);
    },
    all_song_to_playlist() {
      // 当前筛选的全部歌曲，加入歌单
      if (this.song_list_filtered.length > 0)
        this.$parent.$refs.player.playlist_add_many(
          this.song_list_filtered.filter((song) => song.have_audio)
        );
    },
    expend_all() {
      // 展开全部 如果没有全部展开就展开 否则收起
      if (this.expand_list.length !== this.song_list.length)
        this.expand_list = this.song_list.map((song) => song.id);
      else this.expand_list = [];
    },
    page_change_event() {
      // 清空展开和选中
      this.check_list = [];
      this.expand_list = [];
      // 判断是不是在页面内并滚动到顶部
      let header = this.$refs.header;
      if (header.getBoundingClientRect().bottom < 0) header.scrollIntoView();
    },
  },
};
</script>

<style scoped>
@import "../styles/main_song_list.css";
</style>
