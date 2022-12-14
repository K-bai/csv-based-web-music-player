class LoopControl {
  constructor(interval, fn) {
    this.interval = interval;
    this.fn = fn;
    this.timer = this.interval;
    this.status = "run";
  }

  async setTimeout_promise(ms) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve();
      }, ms);
    });
  }

  async wait(sec) {
    this.timer = sec;
    while (this.timer > 0) {
      await this.setTimeout_promise(1000);
      this.timer = this.timer - 1;
    }
  }

  async start() {
    if (this.status === "stop") throw "loop can't be started again!";
    await this.wait(this.interval);
    while (this.status === "run") {
      await this.fn();
      await this.wait(this.interval);
    }
  }

  stop() {
    this.timer = 0;
    this.status = "stop";
  }
}

export default LoopControl;