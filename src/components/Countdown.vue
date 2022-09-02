<template>
  <div class="c-countdown-outer">
    <div class="c-countdown">
      <div class="countdown-text"><div>定时停止：</div></div>
      <div class="general-input countdown-timer" v-show="is_counting_down">
        {{ countdown_display }}
      </div>
      <select
        class="general-input countdown-select"
        v-model="time_option"
        v-show="!is_counting_down"
      >
        <option
          v-for="option in time_options"
          v-bind:key="option.text"
          v-bind:value="option.value"
        >
          {{ option.text }}
        </option>
      </select>
      <input
        class="general-input countdown-input"
        v-show="time_option === 'custom' && !is_counting_down"
        v-model="time_input_value"
        type="number"
        min="0"
        placeholder="多少分钟后停止"
      />
      <button
        class="general-button general-button-grey countdown-button"
        v-on:click="toggle_start"
      >
        {{ is_counting_down ? "清除" : "开始" }}
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "Countdown",
  data() {
    return {
      time_options: [
        { text: "15分钟", value: 15 },
        { text: "30分钟", value: 30 },
        { text: "60分钟", value: 60 },
        { text: "120分钟", value: 120 },
        { text: "自定义", value: "custom" },
      ],
      time_option: 15,
      time_input_value: "",
      is_counting_down: false,
      countdown_time: 0,
      interval_obj: null,
    };
  },
  methods: {
    toggle_start() {
      if (this.is_counting_down) {
        // 停止计时
        clearInterval(this.interval_obj);
      } else {
        // 开始计时
        if (this.time_option === "custom")
          this.countdown_time = parseInt(this.time_input_value) * 60;
        else this.countdown_time = this.time_option * 60;
        this.interval_obj = setInterval(() => {
          this.countdown_time -= 1;
          if (this.countdown_time <= 0) {
            clearInterval(this.interval_obj);
            this.is_counting_down = false;
            this.$emit("stop_playing");
            this.$parent.$refs.player.audio_pause();
          }
        }, 1000);
      }
      this.is_counting_down = !this.is_counting_down;
    },
  },
  computed: {
    countdown_display() {
      let sec = (this.countdown_time % 60).toString();
      let min = Math.floor(this.countdown_time / 60).toString();
      if (sec.length === 1) sec = "0" + sec;
      if (min.length === 1) min = "0" + min;
      return min + ":" + sec;
    },
  },
};
</script>

<style scoped>
.c-countdown-outer {
  margin-top: 1rem;
  display: flex;
  flex-direction: row-reverse;
}
.c-countdown {
  flex-grow: 1;
  display: flex;
  align-items: stretch;
  justify-content: flex-end;
  max-width: 50%;
}
.countdown-text {
  flex-grow: 0;
  flex-shrink: 0;
  display: flex;
  align-items: center;
}
.countdown-timer {
  flex-grow: 0;
  padding-top: 0.4rem;
  padding-bottom: 0.4rem;
  padding-left: 0.6rem;
  padding-right: 0.6rem;
  border-top-right-radius: 0rem;
  border-bottom-right-radius: 0rem;
  border-right: none;
}

.countdown-select {
  flex-grow: 0;
  flex-shrink: 0;
  border-top-right-radius: 0rem;
  border-bottom-right-radius: 0rem;
  border-right: none;
}
.countdown-input {
  flex-grow: 1;
  flex-shrink: 1;
  border-radius: 0rem;
  width: 0rem;
  min-width: 3rem;
  border-right: none;
}
.countdown-button {
  flex-grow: 0;
  flex-shrink: 0;
  border-top-left-radius: 0rem;
  border-bottom-left-radius: 0rem;
}

@media all and (max-width: 799px) {
  .c-countdown {
    max-width: 100%;
  }
}
</style>
