<template>
  <pop-up-main v-on:closepopup="$emit('closepopup')" title="经处理的歌">
    <div class="content">
      <p>
        经处理的歌是指将录播片段消除了说话的部分，但是音质可能有部分损失。或者剪掉说话的部分进行简单拼接。仅有少部分歌曲经过处理，其他歌曲仍播放未处理版本。
      </p>
      <p>通常情况下，网站提供的音频是对录播音频进行简单剪辑，不做额外处理。</p>
      <p>
        这个处理过程是由<a
          href="https://space.bilibili.com/545133496"
          target="_blank"
          rel="noreferrer noopener"
          >@枺芙</a
        >、<a
          href="https://space.bilibili.com/320278333"
          target="_blank"
          rel="noreferrer noopener"
          >@咩咩的三叉戟</a
        >和<a
          href="https://space.bilibili.com/1575399407"
          target="_blank"
          rel="noreferrer noopener"
          >@温梦未醒</a
        >完成的。具体哪些歌经过了处理可以看二位的精选歌单。
      </p>
    </div>
  </pop-up-main>
</template>

<script>
import PopUpMain from "./Main.vue";

export default {
  name: "PopUpExplainTreated",
  components: {
    PopUpMain,
  },
};
</script>

<style scoped></style>
