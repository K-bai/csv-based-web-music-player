<template>
  <div class="c-footer">
    <p>
      或许你还不了解
      <a
        href="https://space.bilibili.com/617459493"
        target="_blank"
        rel="noreferrer noopener"
        >@呜米</a
      >
      和
      <a
        href="https://space.bilibili.com/745493"
        target="_blank"
        rel="noreferrer noopener"
        >@咩栗</a
      >？ 搞快去
      <a
        href="https://live.bilibili.com/22384516"
        target="_blank"
        rel="noreferrer noopener"
        >呜米的直播间</a
      >
      和
      <a
        href="https://live.bilibili.com/8792912"
        target="_blank"
        rel="noreferrer noopener"
        >咩栗的直播间</a
      >
      看她们两个！
    </p>
    <p>
      直播间之外，或许可以去网易云音乐
      <a
        href="https://music.163.com/#/user/home?id=1306304320"
        target="_blank"
        rel="noreferrer noopener"
        >@呜米嗷嗷嗷</a
      >
      和
      <a
        href="https://music.163.com/#/user/home?id=1356709812"
        target="_blank"
        rel="noreferrer noopener"
        >@咩栗咩咩咩</a
      >
      听听她们两个的歌！原创曲我吹爆！！！
    </p>
    <p>
      顺便拜托关注下
      <a
        href="https://space.bilibili.com/674421433"
        target="_blank"
        rel="noreferrer noopener"
        >@呜米咩栗的草原日常</a
      >
      吧！这里也会有歌听的！
    </p>
    <hr />
    <p>使用方法懒得写了，自己玩吧</p>
    <p>
      好多小棉花和小米星帮忙切了超级多的歌，戳这里看看->
      <a v-on:click="show_credit = true" class="credit">关于本站</a>
    </p>
    <p>
      试着关注一下这个b站的切歌man？
      <a
        v-bind:href="'https://space.bilibili.com/' + cutter[0]"
        target="_blank"
        rel="noreferrer noopener"
        >@{{ cutter[1] }}</a
      >
    </p>
    <hr />
    <p class="links">
      友情链接：
      <a
        href="https://space.bilibili.com/674622242"
        target="_blank"
        rel="noreferrer noopener"
        >MeUmy录播组</a
      >
      <a href="https://mht.meumy.club" target="_blank" rel="noreferrer noopener"
        >MeUmy的棉花糖</a
      >
      <a
        href="https://lamp.meumy.club"
        target="_blank"
        rel="noreferrer noopener"
        >MeUmy草原自动路灯</a
      >
      <a href="https://meumy.club" target="_blank" rel="noreferrer noopener"
        >MeUmy草原平行时空</a
      >
    </p>
    <p>
      <a href="https://beian.miit.gov.cn/" class="record"
        >京ICP备18037723号-3</a
      >
    </p>
    <pop-up-credit v-if="show_credit" v-on:closepopup="show_credit = false" />
  </div>
</template>

<script>
import PopUpCredit from "./PopUp/Credit.vue";
export default {
  name: "Footer",
  components: {
    PopUpCredit,
  },
  data() {
    return {
      cutter: [],
      show_credit: false,
    };
  },
  mounted() {
    let l = window.meumy.cutter_list;
    this.cutter = l[Math.floor(Math.random() * l.length)];
  },
};
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
.credit {
  text-decoration: underline;
  cursor: pointer;
  color: blue;
}
.record {
  font-size: 0.7rem;
  text-decoration: none;
}
.record:link {
  color: gray;
}
.record:active {
  color: gray;
}
.record:hover {
  color: gray;
}
.record:visited {
  color: gray;
}
</style>
