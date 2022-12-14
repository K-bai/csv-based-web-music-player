import data from "./data.js";
import { parse } from "csv-parse/browser/esm/sync";

async function get_wallpaper_list() {
  if (window.meumy.wallpaper_list.length === 0) {
    // 获取壁纸数据
    let csv_data = await data.fetch_csv('/static/wallpapers.csv');
    const result = parse(csv_data, { columns: true });
    window.meumy.wallpaper_list.push(...result);
  }

  // shuffle
  shuffle(window.meumy.wallpaper_list);
}

function shuffle(array) {
  // shuffle, copy from lodash/shuffle.js 2017
  let length = array.length;
  let index = -1;
  const lastIndex = length - 1;
  while (++index < length) {
    const rand = index + Math.floor(Math.random() * (lastIndex - index + 1));
    const value = array[rand];
    array[rand] = array[index];
    array[index] = value;
  }
}

function load_image(url) {
  let img = new Image();
  return new Promise((resolve, reject) => {
    img.onload = () => {
      img = null;
      resolve("loaded");
    }
    img.onerror = () => {
      img = null;
      reject("error");
    }
    img.src = url;
  });
}

export default {
  get_wallpaper_list,
  load_image,
};
