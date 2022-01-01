<template>
  <div class="c-outer card">
    <div class="title">歌单</div>
    <div class="c-song-collection">
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
    <hr />
    <div class="title title-filter">
      <div>筛选</div>
      <div
        class="title-filter-expand"
        v-on:click="show_filter=!show_filter"
      >{{show_filter?'...收起':'展开...'}}</div>
    </div>
    <div class="c-filter" v-show="show_filter">
      <div
        class="filter-item"
        v-for="filter_item in filters"
        v-bind:key="filter_item.name"
      >
        <div class="filter-item-label">{{filter_item.text}}:</div>
        <select
          class="filter-item-input"
          v-model="filter_item.value"
          v-on:change="filter_change_event"
        >
          <option
            v-for="option in filter_item.options"
            v-bind:value="option"
            v-bind:key="option"
          >{{option}}</option>
        </select>
      </div>
      <div class="filter-item filter-song-search">
        <select
          class="filter-item-input filter-song-search-select"
          v-model="search.type"
        >
          <option
            v-for="option in search.options"
            v-bind:value="option"
            v-bind:key="option"
          >{{option}}</option>
        </select>
        <input
          v-model="search.text"
          class="filter-item-input filter-song-search-input"
          v-on:keydown.enter="search_press_enter"
          v-on:keydown.space.stop=""
        />
        <button
          class="filter-song-search-go filter-song-search-button"
          v-on:click="apply_search(false)"
        >搜索!</button>
        <button
          class="filter-song-search-clear filter-song-search-button"
          v-on:click="apply_search(true)"
        >清空</button>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'SongFilter',
  data() {
    return {
      song_list_org: window.meumy.song_list,
      song_collection: window.meumy.song_collection,
      show_filter: false,
      filters: [
        {name: 'artist', text: '演唱者', value: '--', options: window.meumy.filter_options.artist},
        {name: 'status', text: '演唱状态', value: '--', options: window.meumy.filter_options.status},
        {name: 'language', text: '语言', value: '--', options: window.meumy.filter_options.language},
        {name: 'month', text: '月份', value: '--', options: window.meumy.filter_options.month},
        {name: 'collection', text: '歌单', value: '--', options: window.meumy.filter_options.collection},
        {name: 'star', text: '星标', value: '--', options: window.meumy.filter_options.star},
        {name: 'have_audio', text: '是否有音频', value: '--', options: window.meumy.filter_options.have_audio},
        {name: 'order', text: '排序', value: '时间倒序', options: window.meumy.filter_options.order},
      ],
      search: {
        text: '',
        text_for_search: '',
        type: '搜索歌名',
        options: window.meumy.filter_options.search_type
      }
    }
  },
  props: [
    'song_list_filtered'
  ],
  computed: {
    self_song_list_filtered: function() {
      let l = this.song_list_org.slice()
      let filter = {}
      for ( let item of this.filters)
        filter[item.name] = item.value
      // 筛选歌单
      if (filter.collection !== '--')
        l = this.song_collection.find(c => (c.name === filter.collection)).list.slice()
      // 筛选演唱状态
      if (filter.status !== '--')
        l = l.filter(song => (song.status === filter.status))
      // 筛选语言
      if (filter.language !== '--')
        l = l.filter(song => (song.language === filter.language))
      // 筛选演唱者
      if (filter.artist !== '--') {
        l = l.filter(song => {
          let artist_list = song.artist.split(',')
          return artist_list.findIndex(a => (a === filter.artist)) !== -1
        })
      }
      // 筛选月份
      if (filter.month !== '--')
        l = l.filter(song => (song.date.substring(0, 7) === filter.month))
      // 筛选星标
      if (filter.star === '星标')
        l = l.filter(song => (window.meumy.love_list.findIndex(love => (song.id === love)) !== -1))
      else if (filter.star === '非星标')
        l = l.filter(song => (window.meumy.love_list.findIndex(love => (song.id === love)) === -1))
      // 筛选是否有音频
      if (filter.have_audio === '有音频')
        l = l.filter(song => (song.have_audio))
      else if (filter.have_audio === '无音频')
        l = l.filter(song => (!song.have_audio))
      // 筛选搜索
      if (this.search.text_for_search !== ''){
        if (this.search.type === '搜索歌名')
          l = l.filter(song => (song.name.toLowerCase().search(this.search.text_for_search.toLowerCase()) !== -1))
        else{
          l = l.filter(song => {
            let t = this.search.text_for_search.toLowerCase()
            let flag = flag
            flag = flag || (song.name.toLowerCase().search(t) !== -1)
            if (song.note !== '') flag = flag || (song.note.toLowerCase().search(t) !== -1)
            if (song.ref) flag = flag || (song.ref.name.toLowerCase().search(t) !== -1)
            if (song.ref_cut) flag = flag || (song.ref_cut.name.toLowerCase().search(t) !== -1)
            return flag
          })
        }
      }
      // 排序
      if (filter.order === '时间正序') l.reverse()
      return l
    }
  },
  methods: {
    apply_search(clear) {
      if (clear) this.search.text = ''
      this.search.text_for_search = this.search.text.trim()
      this.filter_change_event()
    },
    filter_change_event() {
      this.$emit('update:song_list_filtered', this.self_song_list_filtered)
    },
    replace_collection(song_list) {
      this.$parent.$parent.$refs.player.playlist_replace(song_list.filter(s => s.have_audio))
    },
    search_press_enter(event) {
      this.apply_search(false)
      event.target.blur()
    }
  }
}
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
.filter-item-input {
  flex-grow: 1;
  padding: 0.5rem;
  border: 1px rgb(190, 190, 190) solid;
  border-radius: 0.3rem;
  background-color: white;
}
.filter-song-search {
  flex-grow: 3;
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
  background-color: white;
  border-radius: 0.3rem;
  text-align: center;
  cursor: pointer;
}
.filter-song-search-go {
  border-radius: 0rem;
  border: 1px solid #007bff;
  color: #007bff;
}
@media (any-hover: hover) {
  .filter-song-search-go:hover{
    background-color: #007bff;
    color: white;
  }
}
.filter-song-search-go:active {
  background-color: #0068d6;
  color: white;
}
.filter-song-search-clear {
  border-top-left-radius: 0px;
  border-bottom-left-radius: 0px;
  border: 1px solid #6c757d;
  color: #6c757d;
  border-left: none;
}
@media (any-hover: hover) {
  .filter-song-search-clear:hover{
    background-color: #6c757d;
    color: white;
  }
}
.filter-song-search-clear:active {
  background-color: #545b61;
  color: white;
}
</style>
