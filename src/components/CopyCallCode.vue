<template>
  <div class="c-copy-code">
    <div
      v-for="(up, idx) in call_list"
      v-bind:key="up.name"
      class="copy-item"
    >
      {{up.code}}
      <a
        v-tooltip="up.popper"
        v-on:click="copy(idx)"
        class="copy-button"
      >复制</a>
    </div>
  </div>
</template>

<script>

export default {
  name: 'CopyCallCode',
  data () {
    return {
      call_list: [
        {
          name: 'umy',
          code: '☀️呜米☀️呜米☀️呜米☀️呜米☀️',
          popper: {
            content: '?',
            showTriggers: ['click'],
            hideTriggers: ['hover'],
          }
        },
        {
          name: 'merry',
          code: '⛈️咩栗⛈️咩栗⛈️咩栗⛈️咩栗⛈️',
          popper: {
            content: '?',
            showTriggers: ['click'],
            hideTriggers: ['hover'],
          }
        },
        {
          name: 'meumy',
          code: '⛅MeUmy⛅MeUmy⛅MeUmy⛅',
          popper: {
            content: '?',
            showTriggers: ['click'],
            hideTriggers: ['hover'],
          }
        },
      ]
    }
  },
  methods: {
    copy (idx) {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(this.call_list[idx].code).then(() => {
          this.call_list[idx].popper.content = '已成功复制到剪切板'
        }, function() {
          this.call_list[idx].popper.content = '无剪切板权限，请手动复制'
        })
      }
      else
        this.call_list[idx].popper.content = '你的浏览器尚不支持，请手动复制'
    }
  }
}
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
