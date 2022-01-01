<template>
  <pop-up-main
    v-on:closepopup="$emit('closepopup')"
    title="歌曲详情"
  >
    <div class="content">
      <p><span>歌名：</span>{{song.name}}</p>
      <p><span>演唱者：</span>{{song.artist}}</p>
      <p><span>演唱状态：</span>{{song.status}}</p>
      <p v-if="song.orginal_artist!==''"><span>原唱：</span>{{song.orginal_artist}}</p>
      <p><span>语言：</span>{{song.language}}</p>
      <p><span>切歌man的留言：</span>{{song.note}}</p>
      <p>
        <span>对应录播：</span>
        <a v-bind:href="'https://www.bilibili.com/video/'+song.record.bv+'?p='+song.record.p+'&t='+Math.floor(song.record_start_ms/1000)" target="blank">
          {{song.date}} p{{song.record.p}}
        </a> 
        <span>时间点：</span>{{song.record.timecode}}
      </p>
      <p v-if="song.ref!==false">
        <span>参考的路灯man：</span>
        <a v-bind:href="'https://space.bilibili.com/'+song.ref.uid" target="blank">
          @{{song.ref.name}}
        </a>
      </p>
      <p v-if="song.ref_cut!==false">
        感谢
        <a v-bind:href="'https://space.bilibili.com/'+song.ref_cut.uid" target="blank">
          @{{song.ref_cut.name}}
        </a>
        提供的音频！
      </p>
    </div>
  </pop-up-main>
</template>

<script>
import PopUpMain from './Main.vue'

export default {
  name: 'PopUpDetails',
  components: {
    PopUpMain
  },
  data() {
    return {
    }
  },
  props: [
    'song'
  ]
}
</script>

<style scoped>
.content >p >span {
  font-weight: bold;
}
</style>
