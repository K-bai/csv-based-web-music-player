<template>
  <div class="c-main">
    <song-filter
      v-bind:song_list_filtered.sync="song_list_filtered"
      v-on:update:song_list_filtered="page=1"
    />
    <div class="c-controler">
      <button class="general-button controler-item controler-item-all" v-on:click="all_song_to_playlist">全部筛选结果加入播放列表</button>
    </div>
    <div class="c-song-list">
      <div class="song-list-header" ref="header">
        <div class="header-column all-column all-column-idx"></div>
        <div class="header-column header-column-op all-column all-column-op">操作</div>
        <div class="all-column-info">
          <div class="header-column header-column-name all-column all-column-name">
            <span class="header-column-name-wide">歌名</span>
            <span class="header-column-name-narrow">歌曲信息</span>
          </div>
          <div class="header-column header-column-artist all-column all-column-artist">演唱者</div>
          <div class="header-column header-column-status all-column all-column-status">演唱状态</div>
          <div class="header-column header-column-date all-column all-column-date">演唱日期</div>
          <div class="header-column header-column-duration all-column all-column-duration">时长</div>
        </div>
        <div
          class="header-column header-column-details all-column all-column-details"
          v-on:click="expend_all"
        >展开</div>
      </div>
      <div
        v-bind:class="['song-list-item', {'dark-bg': idx%2===1}, {'light-bg': idx%2===0}]"
        v-for="(song, idx) in song_list"
        v-bind:key="song.id"
      >
        <div class="song-list-item-main">
          <div class="item-column-idx all-column all-column-idx">{{idx+1+(page-1)*per_page}}</div>
          <div class="item-column-op all-column all-column-op">
            <div
              class="item-op-download item-op-all"
              title="下载歌曲"
              v-show="song.have_audio"
            ><a v-bind:href="song.src" download><div></div></a></div>
            <div
              class="item-op-add item-op-all"
              title="加入播放列表"
              v-show="song.have_audio"
              v-on:click.stop="add_song(idx)"
            ><div></div></div>
            <div
              class="item-op-star item-op-all"
              title="星标歌曲"
              v-show="song.have_audio"
              v-on:click.stop="love_song(idx)"
            ><div v-bind:class="[{'item-op-star-true': is_loved[idx]}, {'item-op-star-false': !is_loved[idx]}]"></div></div>
            <div
              class="item-op-none"
              v-show="!song.have_audio"
            >{{song.days_before_available>0?song.days_before_available+'天后可听':'暂无音频'}}</div>
          </div>
          <div
            class="all-column-info item-column-info"
            v-on:click="add_song(idx, true)"
          >
            <div class="song-name all-column all-column-name">{{song.name}}</div>
            <div class="song-info-artist">
              <div class="song-artist all-column all-column-artist">{{song.artist}}</div>
              <div class="song-status all-column all-column-status">{{song.status}}</div>
            </div>
            <div class="song-info-date">
              <div class="song-date all-column all-column-date">{{song.date}}</div>
              <div class="song-duration all-column all-column-duration">{{song.duration}}</div>
            </div>
          </div>
          <div
            class="item-column-details all-column all-column-details"
            v-on:click.stop="expand_song(idx)"
          >{{is_expanded[idx]?"...收起":"详细..."}}</div>
        </div>
        <div class="song-list-item-details" v-show="is_expanded[idx]">
          <div class="song-full-details-language">语言: {{song.language}}</div>
          <div class="song-full-details-orginal" v-show="song.orginal_artist!==''">原唱: {{song.orginal_artist}}</div>
          <div class="song-full-details-ref" v-show="song.ref!==false">
            参考的路灯man: 
            <a v-bind:href="'https://space.bilibili.com/'+song.ref.uid" target="blank">
              @{{song.ref.name}}
            </a>
          </div>
          <div class="song-full-details-record">
            <span>录播：</span>
            <a v-bind:href="'https://www.bilibili.com/video/'+song.record.bv+'?p='+song.record.p+'&t='+Math.floor(song.record_start_ms/1000)" target="blank">
              {{song.date}} p{{song.record.p}} {{song.record.timecode}}
            </a>
          </div>
          <div class="song-full-details-note" v-show="song.note!==''">切歌man的留言: {{song.note}}</div>
          <div class="song-full-details-ref-cut" v-show="song.ref_cut!==false">
            音频提供: 
            <a v-bind:href="'https://space.bilibili.com/'+song.ref_cut.uid" target="blank">
              @{{song.ref_cut.name}}
            </a>
          </div>
        </div>
      </div>
      <div v-show="song_list.length === 0" class="song-list-no-item">无结果...</div>
    </div>
    <song-list-pagination
      v-bind:page.sync="page"
      v-bind:per_page.sync="per_page"
      v-bind:total="song_list_filtered.length"
      v-on:update:page="page_change_event"
    ></song-list-pagination>
  </div>
</template>











<script>
import SongFilter from './SongFilter.vue'
import SongListPagination from './SongListPagination.vue'
import utils from '@/js/utils.js'

export default {
  name: 'MainSongList',
  components: {
    SongListPagination,
    SongFilter
  },
  data() {
    return {
      love_list: window.meumy.love_list,
      expand_list: [],
      page: 1,
      per_page: 10,
      song_list_filtered: window.meumy.song_list
    }
  },
  computed: {
    song_list: function() {
      // 从筛选过后的列表中选出当前页的歌
      return this.song_list_filtered.slice(
        (this.page - 1) * this.per_page,
        this.page * this.per_page
      )
    },
    is_loved: function() {
      return this.song_list.map(song => (
        this.love_list.findIndex(love => (song.id === love)) !== -1
      ))
    },
    is_expanded: function() {
      return this.song_list.map(song => (
        this.expand_list.findIndex(expend => (song.id === expend)) !== -1
      ))
    },
  },
  methods: {
    add_song(idx, should_play = false) {
      if (this.song_list[idx].have_audio === false) return
      // 这里怎么定位到播放器组件 我完全哇嘎那一
      this.$parent.$refs.player.playlist_add_song(this.song_list[idx], should_play, should_play)
    },
    love_song(idx){
      let song = this.song_list[idx]
      // 修改喜爱列表
      if (this.is_loved[idx]) {
        let idx_del = this.love_list.findIndex(i => (song.id === i))
        this.love_list.splice(idx_del, 1)
      }
      else this.love_list.push(song.id)
      // 保存喜爱列表
      utils.save_love_list(this.love_list)
    },
    expand_song(idx){
      let song = this.song_list[idx]
      // 修改展开列表
      if (this.is_expanded[idx]) {
        let idx_del = this.expand_list.findIndex(i => (song.id === i))
        this.expand_list.splice(idx_del, 1)
      }
      else this.expand_list.push(song.id)
    },
    all_song_to_playlist(){
      // 当前筛选的全部歌曲，加入歌单
      if (this.song_list_filtered.length > 0)
        this.$parent.$refs.player.playlist_add_many(this.song_list_filtered.filter(song => song.have_audio))
    },
    expend_all(){
      // 展开全部 如果没有全部展开就展开 否则收起
      if (this.expand_list.length !== this.song_list.length)
        this.expand_list = this.song_list.map(song=>song.id)
      else
        this.expand_list = []
    },
    page_change_event() {
      // 清空展开和选中
      this.check_list = []
      this.expand_list = []
      // 判断是不是在页面内并滚动到顶部
      let header = this.$refs.header
      if (header.getBoundingClientRect().bottom < 0)
        header.scrollIntoView()
    }
  }
}
</script>














<style scoped>
.dark-bg {
  background-color: rgb(250, 250, 250);
}
.light-bg {
  background-color: white;
}

.c-main {
  width: 100%;
  text-align: left;
  background-color: rgb(252, 252, 252);
}

.c-controler {
  overflow: hidden;
  margin-bottom: 1rem;
  display: flex;
  flex-direction: row-reverse;
}
.controler-item {
  color: #6c757d;
  border: 1px solid #6c757d;
  flex-grow: 1;
  flex-basis: 1rem;
  text-align: center;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
}
@media (any-hover: hover) {
  .controler-item:hover{
    background-color: #6c757d;
    color: white;
  }
}
.controler-item:active {
  background-color: #545b61;
  color: white;
}
.controler-item-all {
  max-width: 25%;
}

.c-song-list {
  border: 1px solid rgb(224, 224, 224);
}
.song-list-header {
  display: flex;
  width: 100%;
  background-color: rgb(245, 245, 245);
}
.header-column {
  font-size: 1.05rem;
  height: 2.4rem;
  line-height: 2.4rem;
  border-bottom: 1px solid rgb(224, 224, 224);
  border-left: 1px solid rgb(224, 224, 224);
}
.header-column-details {
  font-size: 0.9rem;
  cursor: pointer;
  user-select: none;
  color: blueviolet;
}
.song-list-item {
  width: 100%;
  cursor: default;
}
.song-list-item-main{
  width: 100%;
  display: flex;
  min-height: 2.2rem;
  align-items: center;
}
@media (any-hover: hover) {
  .song-list-item:hover{
    background-color: rgba(0, 0, 0, 0.1);
  }
}


.all-column {
  padding-left: 0.3rem;
  padding-right: 0.3rem;
}
.all-column-idx {
  width: 2rem;
  flex-grow: 0;
  flex-shrink: 0;
  text-align: center;
}
.all-column-check input {
  display: inline-block;
  width: 1rem;
  height: 1rem;
}
.all-column-op {
  width: 5rem;
  flex-grow: 0;
  flex-shrink: 0;
}
.all-column-info {
  flex-grow: 1;
  flex-shrink: 1;
  display: flex;
  flex-wrap: wrap;
}
.all-column-name {
  flex-grow: 1;
  flex-shrink: 1;
  flex-basis: 1rem;
}
.all-column-artist {
  width: 5.5rem;
  flex-grow: 0;
}
.all-column-status {
  width: 5.5rem;
  flex-grow: 0;
}
.all-column-duration {
  width: 4rem;
  flex-grow: 0;
}
.all-column-date {
  width: 6rem;
  flex-grow: 0;
}
.all-column-details {
  width: 3rem;
  flex-grow: 0;
  flex-shrink: 0;
}
.header-column-name-wide {
  display: inline;
}
.header-column-name-narrow {
  display: none;
}
.item-column-idx {
  font-size: 0.8rem;
  color: gray;
  line-height: 1rem;
  order: 0;
}
.item-column-op {
  display: flex;
  justify-content: space-around;
  order: 20;
  -webkit-tap-highlight-color: transparent;
}
.item-op-all {
  height: 1.5rem;
  width: 1.5rem;
  border-radius: 2rem;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  display: flex;
  justify-content: center;
  align-items: center;
}
@media (any-hover: hover) {
  .item-op-all:hover {
    background-color: rgba(0, 0, 0, 0.1);
  }
}
.item-op-all:active {
  background-color: rgba(0, 0, 0, 0.35);
}
.item-op-all div {
  background-size: contain;
}
.item-op-download div {
  height: 1.0rem;
  width: 1.0rem;
  background-image: url("~bootstrap-icons/icons/download.svg");
}
.item-op-add div {
  height: 1.1rem;
  width: 1.1rem;
  background-image: url("~bootstrap-icons/icons/plus-circle.svg");
}
.item-op-star div {
  height: 1.1rem;
  width: 1.1rem;
}
.item-op-star-false {
  background-image: url("~bootstrap-icons/icons/star.svg");
}
.item-op-star-true {
  background-image: url("~bootstrap-icons/icons/star-fill.svg");
}
.item-op-none {
  font-size: 0.7rem;
  color: gray;
  font-style: italic;
}
.item-column-info {
  order: 30;
  cursor: pointer;
}
.song-name {
  margin-top: 0.2rem;
  margin-bottom: 0.2rem;
}
.song-info-artist {
  display: flex;
  align-items: center;
}
.song-info-date {
  display: flex;
  align-items: center;
}
.item-column-details {
  font-size: 0.8rem;
  color: blueviolet;
  cursor: pointer;
  user-select: none;
  order: 40;
}
.song-list-item-details {
  width: 100%;
  font-size: 0.8rem;
  color: grey;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
}
.song-list-item-details div {
  margin: 0.2rem;
}
.song-list-no-item {
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  text-align: center;
  color: gray;
  font-style: italic;
}



@media all and (max-width: 799px) {
  .controler-item-all {
    max-width: 100%;
  }
  .all-column {
    padding-left: 0.3rem;
    padding-right: 0.3rem;
  }
  .all-column-idx {
    width: 1.5rem;
  }
  .header-column-name-wide {
    display: none;
  }
  .header-column-name-narrow {
    display: inline;
  }
  .header-column-artist {
    display: none;
  }
  .header-column-status {
    display: none;
  }
  .header-column-duration {
    display: none;
  }
  .header-column-date {
    display: none;
  }
  .header-column-details {
    font-size: 0.8rem;
  }
  .song-list-item-main {
    padding-top: 0.2rem;
    padding-bottom: 0.2rem;
  }
  .song-name {
    flex-basis: 100%;
  }
  .song-artist {
    width: auto;
    font-size: 0.8rem;
    color: rgb(121, 121, 121);
  }
  .song-status {
    width: auto;
    font-size: 0.8rem;
    color: rgb(121, 121, 121);
  }
  .song-duration {
    width: auto;
    font-size: 0.8rem;
    color: rgb(151, 151, 151);
  }
  .song-date {
    width: auto;
    font-size: 0.8rem;
    color: rgb(151, 151, 151);
  }
  .all-column-op {
    width: 2.5rem;
    order: 50;
    font-size: 0.8rem;
  }
  .item-column-op {
    align-self: stretch;
    display: flex;
    flex-wrap: wrap;
    align-content: space-around;
  }
  .item-column-details {
    font-size: 0.8rem;
  }
  .item-op-download {
    display: none;
  }
  .song-list-item-details {
    width: calc(100% - 2rem);
    padding-left: 1rem;
    padding-right: 1rem;
    justify-content: flex-start;
    text-align: justify;
  }
}
</style>
