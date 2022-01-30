<template>
  <pop-up-main
    v-on:closepopup="$emit('closepopup')"
    title="关于"
    class="popup-credit"
  >
    <div class="content">
      <p>感谢录播评论区的各位路灯man，找歌过程中帮了太多忙（哭泣</p>
      <p>感谢
        <span
          v-for="cutter in cutter_list"
          v-bind:key="cutter.uid"
          class="cutter"
        >
          <a
            v-bind:href="'https://space.bilibili.com/'+cutter.uid"
            target="_blank"
            rel="noreferrer noopener"
          >
          @{{cutter.name}}</a>
          ({{cutter.count}})
        </span>
        切的歌，给录音棚添加了很多存货（鞠躬
      </p>
      <p>有问题？或者想帮忙！（提前感谢）狂戳这个人->
        <a href="https://message.bilibili.com/#/whisper/mid1818479062" target="_blank" rel="noreferrer noopener">@呜米小姐的吃饭小虎牙</a>
        的b站私信！
      </p>
      <p>本项目已开源（
        <a href="https://github.com/K-bai/csv-based-web-music-player" target="_blank" rel="noreferrer noopener">Github</a>
        ）欢迎Star, Fork！感谢
        <a href="https://space.bilibili.com/9420577" target="_blank" rel="noreferrer noopener">@特斯拉309</a>
        的技术支持！
      </p>
    </div>
  </pop-up-main>
</template>

<script>
import PopUpMain from './Main.vue'

export default {
  name: 'PopUpCredit',
  data () {
    return {
      cutter_list: []
    }
  },
  mounted () {
    // 提取切歌人
    let raw_list = window.meumy.song_list.map(i => i.ref_cut)
    raw_list = raw_list.filter(i => (i !== false))
    // 去重计数
    for (let cutter of raw_list) {
      let idx = this.cutter_list.findIndex(u => (u.uid === cutter.uid))
      if (idx === -1)
        this.cutter_list.push({...cutter, count: 1})
      else
        this.cutter_list[idx].count += 1
    }
    // 按数量排序
    this.cutter_list.sort((u1, u2) => (u2.count - u1.count))
  },
  components: {
    PopUpMain
  }
}
</script>

<style scoped>
.popup-credit {
  color: black;
}
.cutter {
  margin-right: 0.5rem;
  margin-left: 0.5rem;
}
</style>
