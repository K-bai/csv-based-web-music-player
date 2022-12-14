class MeUmyAudioPaint {
  constructor() {
    this.elem = null;
    this.ctx = null;
    this.h = 0;
    this.w = 0;
    this.data_queue = new Array();
  }

  init(id, width, height) {
    // get canvas dom
    this.elem = document.getElementById(id);
    // get parent dom
    let parentBox = this.elem.parentNode.getBoundingClientRect();
    this.elem.height = parentBox.height * height;
    this.elem.width = parentBox.width * width;
    this.ctx = this.elem.getContext("2d");
    this.h = this.elem.height;
    this.w = this.elem.width;
  }

  moving_avg(dataArray, n) {
    this.data_queue.push(new Uint32Array(dataArray));
    if (this.data_queue.length > n) this.data_queue.shift();
    return this.data_queue.reduce((a, b) => {
      return a.map((v, i) => v + b[i]);
    }).map(v => v / this.data_queue.length);
  }

  draw_string(dataArray) {
    let data = this.moving_avg(dataArray, 5);
    // init
    this.ctx.save();
    this.ctx.scale(1, -1);
    this.ctx.translate(0, -this.h);
    this.ctx.clearRect(0, 0, this.w, this.h);
    this.ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
    this.ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
    this.ctx.lineWidth = 4;
    this.ctx.lineCap = "round";
    this.ctx.lineJoin = "round";

    this.ctx.beginPath();
    this.ctx.moveTo(0, data[0]/256.0*this.h);

    let len = data.length;
    data.forEach((data, index) => {
      this.ctx.lineTo(this.w/len*(index+1), data/256.0*this.h);
    });
    this.ctx.stroke();
    // restore
    this.ctx.restore();
  }

  draw_bar(dataArray) {
    let data = dataArray.slice(0, 52);
    // init
    this.ctx.save();
    this.ctx.scale(this.w, -this.h);
    this.ctx.translate(0, -1);
    this.ctx.clearRect(0, 0, 1, 1);
    this.ctx.fillStyle = "rgba(255, 255, 255, 0.3)";


    let len = 1.0 / data.length;
    data.forEach((d, index) => {
      this.ctx.fillRect(len * (index + 0.25), 0, len * 0.5, d/256.0);
    });
    // restore
    this.ctx.restore();
  }

}


export default MeUmyAudioPaint;