<template>
  <pop-up-main
    v-on:closepopup="$emit('closepopup')"
    title="欢迎！"
  >
    <div class="content">
      <p>看到你是首次打开，球球你关注一下在b站的MeUmy切歌man吧！！！</p>
      <p>随便给你推荐几个：
        <a
          v-for="c in cutter"
          v-bind:key="c[0]"
          v-bind:href="'https://space.bilibili.com/'+c[0]"
          target="_blank"
          rel="noreferrer noopener"
        >@{{c[1]}}</a>
      </p>
      <p>快乐听歌鸭！~</p>
    </div>
  </pop-up-main>
</template>

<script>
import PopUpMain from './Main.vue'

export default {
  name: 'PopUpInfo',
  components: {
    PopUpMain
  },
  data() {
    return {
      cutter: window.meumy.cutter_list
    }
  }
}
</script>

<style scoped>
.content >p >a {
  margin-right: 1rem;
}
</style>
