<template>
  <div class="c-title card">
    <div class="title-info">
      <h1>MeUmy的录音棚</h1>
      <div class="title-detail">
        <div>来听听草原上小狼和小羊的歌声吧！</div>
        <div>录音棚收录了几乎全部呜米和咩栗直播唱的歌</div>
        <div>
          还没关注
          <a
            href="https://space.bilibili.com/617459493"
            target="_blank"
            rel="noreferrer noopener"
            >@呜米
          </a>
          <a
            href="https://space.bilibili.com/745493"
            target="_blank"
            rel="noreferrer noopener"
            >@咩栗</a
          >
          ？搞快关注！
        </div>
        <div>
          网易云音乐：
          <a
            href="https://music.163.com/#/user/home?id=1306304320"
            target="_blank"
            rel="noreferrer noopener"
            >@呜米嗷嗷嗷
          </a>
          <a
            href="https://music.163.com/#/user/home?id=1356709812"
            target="_blank"
            rel="noreferrer noopener"
            >@咩栗咩咩咩</a
          >
        </div>
      </div>
    </div>
    <img class="logo-img" src="@/assets/logo_dark.png" />
  </div>
</template>

<script>
export default {
  name: "Banner",
};
</script>

<style scoped>
.c-title {
  width: 100%;
  margin-top: 1rem;
  overflow: hidden;
  position: relative;
  flex-grow: 1;
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
  color: rgb(24, 24, 24);
}
.logo-img {
  position: absolute;
  left: 0;
  top: -3rem;
  height: 25rem;
  z-index: 1;
}
.title-info {
  flex-grow: 0;
  padding: 2.5rem;
  z-index: 2;
}
.title-info h1 {
  margin-bottom: 1rem;
  font-size: 3rem;
  text-align: right;
}
.title-detail {
  text-align: right;
}
.title-detail div {
  margin-bottom: 0.2rem;
}

@media all and (max-width: 799px) {
  .title-info {
    padding: 1.5rem;
    width: 100%;
    background-color: rgba(255, 255, 255, 0.562);
  }
  .title-info h1 {
    font-size: 2.5rem;
  }
}
</style>
