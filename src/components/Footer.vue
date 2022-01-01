<template>
  <div class="c-footer">
    <p>或许你还不了解
      <a href="https://space.bilibili.com/617459493" target="blank">@呜米</a>
      和
      <a href="https://space.bilibili.com/745493" target="blank">@咩栗</a>？
      搞快去
      <a href="https://live.bilibili.com/22384516" target="blank">呜米的直播间</a>
      和
      <a href="https://live.bilibili.com/8792912" target="blank">咩栗的直播间</a>
      看她们两个！
    </p>
    <p>直播间之外，或许可以去网易云音乐
      <a href="https://music.163.com/#/user/home?id=1306304320" target="blank">@呜米嗷嗷嗷</a>
      和
      <a href="https://music.163.com/#/user/home?id=1356709812" target="blank">@咩栗咩咩咩</a>
      听听她们两个的歌！原创曲我吹爆！！！
    </p>
    <p>
      顺便拜托关注下
      <a href="https://space.bilibili.com/674421433" target="blank">@呜米咩栗的草原日常</a>
      吧！这里也会有歌听的！
    </p>
    <hr />
    <p>感谢录播评论区的各位路灯man，找歌过程中帮了太多忙（哭泣</p>
    <p>感谢
      <a href="https://space.bilibili.com/674421433" target="blank">@原草原组</a>
      切的300多首歌，给录音棚添加了很多存货（鞠躬
    </p>
    <p>使用方法懒得写了，自己玩吧</p>
    <p>试着关注一下这个b站的切歌man？ 
      <a v-bind:href="'https://space.bilibili.com/'+cutter[0]" target="blank">@{{cutter[1]}}</a>
    </p>
    <hr />
    <p class="links">
      友情链接：
      <a href="https://space.bilibili.com/674622242" target="blank">MeUmy录播组</a>
      <a href="https://mht.meumy.club" target="blank">MeUmy的棉花糖</a>
      <a href="https://lamp.meumy.club" target="blank">MeUmy草原自动路灯</a>
      <a href="https://meumy.club" target="blank">MeUmy草原平行时空</a>
    </p>
    <p>有问题？或者想帮忙！（提前感谢）狂戳这个人->
      <a href="https://message.bilibili.com/#/whisper/mid1818479062" target="blank">@呜米小姐的吃饭小虎牙</a>
      的b站私信！
    </p>
    <p>本项目已开源（
      <a href="https://github.com/K-bai/csv-based-web-music-player" target="blank">Github</a>
      ）欢迎Star, Fork！感谢
      <a href="https://space.bilibili.com/9420577" target="blank">@特斯拉309</a>
      的技术支持！
    </p>
  </div>
</template>

<script>

export default {
  name: 'Footer',
  data () {
    return {
      cutter: []
    }
  },
  mounted () {
    let l = window.meumy.cutter_list
    this.cutter = l[Math.floor(Math.random()*l.length)]
  }
}
</script>

<style scoped>
.c-footer {
  color: gray;
  font-size: 0.9rem;
  margin-top: 3rem;
}
hr {
  border: none;
  border-top: 1px rgb(207, 207, 207) solid;
}
.links a {
  margin-right: 1rem;
}
</style>
