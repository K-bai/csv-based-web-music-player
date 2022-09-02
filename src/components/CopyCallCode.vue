<template>
  <div class="c-copy-code">
    <div v-for="(up, idx) in call_list" :key="up.name" class="copy-item">
      {{ up.code }}
      <el-popover trigger="click" :content="popper">
        <a slot="reference" class="copy-button" @click="copy(idx)">复制</a>
      </el-popover>
    </div>
  </div>
</template>

<script>
export default {
  name: "CopyCallCode",
  data() {
    return {
      popper: "?",
      call_list: [
        {
          name: "umy",
          code: "☀️呜米☀️呜米☀️呜米☀️呜米☀️",
        },
        {
          name: "merry",
          code: "⛈️咩栗⛈️咩栗⛈️咩栗⛈️咩栗⛈️",
        },
        {
          name: "meumy",
          code: "⛅MeUmy⛅MeUmy⛅MeUmy⛅",
        },
      ],
    };
  },
  methods: {
    copy(idx) {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(this.call_list[idx].code).then(
          () => {
            this.popper = "已成功复制到剪切板";
          },
          function () {
            this.popper = "无剪切板权限，请手动复制";
          }
        );
      } else this.popper = "你的浏览器尚不支持，请手动复制";
    },
  },
};
</script>

<style scoped>
.c-copy-code {
  margin-top: 1rem;
}

.copy-item {
  margin-bottom: 0.5rem;
}
.copy-button {
  text-decoration: underline;
  cursor: pointer;
  color: blue;
  font-size: 0.9rem;
}
</style>
