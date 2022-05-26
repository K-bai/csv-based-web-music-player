<template>
  <div class="c-loading">
    <div class="line-scale">
      <div></div><div></div><div></div><div></div><div></div>
    </div>
  </div>
</template>

<script>
import 'loaders.css/loaders.min.css'

export default {
  name: 'LoadingPanel'
}
</script>

<style scoped>
.c-loading {
  background-color: rgba(0, 0, 0, 0.05);
  position: fixed;
  top: 0px;
  left: 0px;
  width: 100vw;
  height: 100vh;
  z-index: 101;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: left;
}

.c-loading>.line-scale {
  transform: scale(2.5);
}
.c-loading>.line-scale>:nth-child(1) {
  background-color: #cd2335;
}
.c-loading>.line-scale>:nth-child(2) {
  background-color: #d32a76;
}
.c-loading>.line-scale>:nth-child(3) {
  background-color: #bb50b1;
}
.c-loading>.line-scale>:nth-child(4) {
  background-color: #8574db;
}
.c-loading>.line-scale>:nth-child(5) {
  background-color: #128feb;
}
</style>
