<template>
  <pop-up-main
    v-on:closepopup="$emit('closepopup')"
    title="分享歌曲"
  >
    <div>
      <div class="c-share-body">
        <div class="c-share-title">
          <div class="share-title">复制链接分享当前歌曲</div>
          <button
            slot="reference"
            class="copy-button"
            v-on:click="copy('https://song.meumy.club/?s='+song.id, song_popper)"
            v-tooltip="song_popper"
          >复制到剪切板</button>
        </div>
        <div><a v-bind:href="'https://song.meumy.club/?s='+song.id">https://song.meumy.club/?s={{song.id}}</a></div>
      </div>
      <hr />
      <div class="c-share-body">
        <div class="c-share-title">
          <div class="share-title">复制代码分享歌单</div>
          <button
            id="share-songlist-button"
            class="copy-button"
            v-on:click="copy(playlist_id, songlist_popper)"
            v-tooltip="songlist_popper"
          >复制到剪切板</button>
        </div>
        <div class="share-list-text">{{playlist_id}}</div>
      </div>
      <hr />
      <div class="c-share-body">
        <div class="c-share-title">
          <div class="share-title">下载当前歌曲</div>
          <a v-bind:href="song.src" download>点击下载</a>
        </div>
        <div class="c-share-title">
          <div class="share-title">下载全部歌曲数据库</div>
          <a href="/static/song database.csv" download>点击下载</a>
        </div>
      </div>
    </div>
  </pop-up-main>
</template>

<script>
import PopUpMain from './Main.vue'
import utils from '@/js/utils.js'

export default {
  name: 'PopUpShare',
  components: {
    PopUpMain
  },
  data() {
    return {
      song_popper: {
        content: '已成功复制到剪切板',
        showTriggers: ['click'],
        hideTriggers: ['hover'],
      },
      songlist_popper: {
        content: '已成功复制到剪切板',
        showTriggers: ['click'],
        hideTriggers: ['hover'],
      },
    }
  },
  props: [
    'song'
  ],
  computed: {
    playlist_id() {
      return utils.encode_share()
    }
  },
  methods: {
    copy(text, popper) {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
          popper.content = '已成功复制到剪切板'
        }, function() {
          popper.content = '无剪切板权限，请手动复制'
        })
      }
      else
        popper.content = '你的浏览器尚不支持，请手动复制'
    }
  }
}
</script>

<style scoped>
.c-share-body {
  margin-top: 1rem;
  margin-bottom: 1rem;
}
.c-share-title {
  display: flex;
  align-items: stretch;
  justify-content: space-between;
  margin-bottom: 1rem;
}
.share-title {
  font-weight: bold;
  flex-grow: 1;
  flex-shrink: 1;
}
.copy-button {
  flex-grow: 0;
  flex-shrink: 0;
  height: 2rem;
  background-color: white;
  text-align: center;
  cursor: pointer;
  border-radius: 0.3rem;
  border: 1px solid #28a745;
  color: #28a745;
}
@media (any-hover: hover) {
  .copy-button:hover{
    background-color: #28a745;
    color: white;
  }
}
.copy-button:active {
  background-color: #208838;
  color: white;
}
.share-list-text {
  max-width: 100%;
  max-height: 5rem;
  overflow-y: scroll;
  word-break: break-all;
  border: 1px solid gray;
  padding: 0.5rem;
}

</style>
