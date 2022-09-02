import dayjs from "dayjs";

function get_all() {
  window.meumy.song_collection.push(
    ...[
      {
        name: "唱的最多的歌",
        date: dayjs().format("YYYY-MM-DD"),
        maintainer: [{ name: "MeUmy的录音棚", uid: -1 }],
        note: "她俩唱的最多的10首歌",
        color: "#bb50b1",
        list: all_most_10(),
      },
      {
        name: "双人合唱",
        date: dayjs().format("YYYY-MM-DD"),
        maintainer: [{ name: "MeUmy的录音棚", uid: -1 }],
        note: "呜米和咩栗的合唱曲目",
        color: "#bb50b1",
        list: chorus(),
      },
    ]
  );
  window.meumy.filter_options.collection.push(
    ...window.meumy.song_collection.map((c) => c.name)
  );
}

function all_most_10() {
  // 唱的最多的歌
  // 按歌名计数
  let counter = {};
  for (let song of window.meumy.song_list) {
    if (song.name in counter) {
      counter[song.name].list.push(song);
      counter[song.name].n += 1;
    } else {
      counter[song.name] = {
        list: [song],
        n: 1,
      };
    }
  }
  let most_list = Object.keys(counter).map((k) => counter[k]);
  // 排序
  most_list.sort((t1, t2) => t2.n - t1.n);
  most_list = most_list.slice(0, 10);
  // 展开列表
  let final_list = [];
  for (let t of most_list) {
    final_list.push(...t.list);
  }
  return final_list;
}
function chorus() {
  // 双人合唱的曲子
  return window.meumy.song_list.filter((s) => {
    let artists = s.artist.split(",");
    return (
      artists.findIndex((a) => a === "呜米") !== -1 &&
      artists.findIndex((a) => a === "咩栗") !== -1
    );
  });
}

export default {
  get_all,
};
