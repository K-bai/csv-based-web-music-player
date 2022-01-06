import { parse } from 'csv-parse/dist/esm/sync.js'
import dayjs from 'dayjs'
import song_list from './song_list.js'

let AVAILABLE_DAYS_LIMIT = 5

function get_song_data(callback){
  fetch('/static/recording database.csv', {
    cache: 'no-cache'
  }).then(res => {
    if (res.ok) {
      return res.text()
    }
    else return Promise.reject('Wrong.')
  }).then(t => {
    recording_csv_to_obj(t)
    fetch('/static/song database.csv', {
      cache: 'no-cache'
    }).then(res => {
      if (res.ok) {
        return res.text()
      }
      else return Promise.reject('Wrong.')
    }).then(t => {
      song_csv_to_obj(t)
      song_list.get_all()
      callback()
    }, console.log)
  }, console.log)
}

function recording_csv_to_obj(t){
  // 将csv解析为内存对象
  let csv = parse(t, {columns: true})
  // 转换为对象
  for (let row of csv)
    window.meumy.recording_list.push(convert_recording(row))
}

function convert_recording(row){
  return {
    date: row['date'],
    bv: row['bv'],
    vup: row['vup']
  }
}

function song_csv_to_obj(t){
  // 将csv解析为内存对象
  let csv = parse(t, {columns: true})
  // 转换为对象
  window.meumy.song_list.splice(0, window.meumy.song_list.length);
  for (let row of csv)
    window.meumy.song_list.push(convert_song(row))
  // 按时间降序
  window.meumy.song_list.sort((s2, s1) => {
    let d1 = dayjs(s1.date, "YYYY-MM-DD")
    let d2 = dayjs(s2.date, "YYYY-MM-DD")
    if (d1.isBefore(d2)) return -1
    else if (d2.isBefore(d1)) return 1
    else {
      if (s2.record.p !== s1.record.p) return s1.record.p - s2.record.p
      else return s1.record_start_ms - s2.record_start_ms
    }
  })
  // 计算各种筛选条件
  // 状态
  window.meumy.filter_options.status.push('--')
  window.meumy.filter_options.status.push(...new Set(window.meumy.song_list.map(i=>i.status)))
  // 语言
  window.meumy.filter_options.language.push('--')
  window.meumy.filter_options.language.push(...new Set(window.meumy.song_list.map(i=>i.language)))
  // 演唱者
  let artist = new Set(['--'])
  for (let song of window.meumy.song_list)
    for (let a of song.artist.split(',')) artist.add(a)
  window.meumy.filter_options.artist.push(...artist)
  // 月份
  window.meumy.filter_options.month.push('--')
  window.meumy.filter_options.month.push(...new Set(window.meumy.song_list.map(i=>i.date.substring(0, 7))))
}


function convert_song(row){
  let song_name = row['歌名']
  let song_name_chs = row['中文歌名']
  let date = row['日期']
  let record_start_ms = time_to_ms(row['起始时间点'])
  let song_id = row['id']
  // 添加录播信息
  let record = parse_record(date, row['录播来源'], parseInt(row['录播片段编号']), record_start_ms)
  // 如果有中文歌名就加上
  if (song_name_chs !== '') song_name = `${song_name}（${song_name_chs}）`
  // 有没有音频
  let have_audio = false
  if (row['有没有音频'] == 'TRUE') have_audio = true
  // 如果没到时间也不可用
  let days_before_available = AVAILABLE_DAYS_LIMIT - dayjs().diff(dayjs(date), 'day')
  if (days_before_available >= 0)
    have_audio = false
  // 计算持续时间 解析不了结束时间戳就不算持续时间了
  let duration = '--:--'
  if (have_audio) {
    let record_end_ms = time_to_ms(row['结束时间点'])
    if (record_end_ms)
      duration = ms_to_duration(record_end_ms - record_start_ms)
  }
  // 返回一首歌
  return {
    date,
    record,
    record_start_ms,
    name: song_name,
    orginal_artist: row['原曲艺术家'],
    artist: row['演唱者'],
    status: row['演唱状态'],
    language: row['语言'],
    note: row['备注'],
    ref: parse_ref(row['参考路灯man']),
    ref_cut: parse_ref(row['谁切的']),
    duration,
    id: song_id,
    src: `/songs/${song_id}.mp3`,
    have_audio,
    days_before_available
  }
}

function parse_ref(ref){
  // 转换用户格式
  let d = ref.match(/^(.+)\(UID:(\d+)\)$/)
  if (d) {
    return {
      name: d[1],
      uid: d[2],
    }
  }
  else {
    return false
  }
}

function parse_record(date, origin, record_index, record_start){
  // 转换录播时间点格式
  let record_p = record_index % 100
  let date_p = Math.floor(record_index / 100) % 100
  // 找bv号
  let recordings = window.meumy.recording_list.filter(r => (
    r.date === date && r.vup === origin
  ))
  // 
  return {
    bv: recordings[date_p].bv,
    p: record_p,
    timecode: ms_to_timecode(record_start)
  }
}

function time_to_ms(d){
  // 将hh:mm:ss.xxx格式的时间转化为毫秒数
  let ms = 0
  let time_list = d.match(/^(\d{2}):(\d{2}):(\d{2}).(\d{3})$/)
  if (time_list) {
    ms += parseInt(time_list[1])*60*60*1000
    ms += parseInt(time_list[2])*60*1000
    ms += parseInt(time_list[3])*1000
    ms += parseInt(time_list[4])
    return ms
  }
  else return false
}

function ms_to_duration(ms){
  // 将毫秒数转化为mm:ss格式的时间
  let total_second = Math.round(ms / 1000)
  let second = total_second % 60
  let second_t = second.toString()
  if (second < 10) second_t = '0' + second.toString()
  return Math.floor(total_second / 60).toString() + ':' + second_t
}

function ms_to_timecode(ms){
  // 将毫秒数转化为hh:mm:ss格式的时间
  let total_second = Math.round(ms / 1000)
  let second = total_second % 60
  let second_t = second.toString()
  if (second < 10) second_t = '0' + second.toString()
  let minute = Math.floor(total_second / 60 % 60).toString()
  let minute_t = minute.toString()
  if (minute < 10) minute_t = '0' + minute.toString()
  let hour = Math.floor(total_second / 3600).toString()
  let hour_t = hour.toString()
  if (hour < 10) hour_t = '0' + hour.toString()
  return hour_t + ':' + minute_t + ':' + second_t
}

function cutter_list() {
  return [
    ['29099073', 'spaceshipppppp'],
    ['14146676', '轩雨roriki'],
    ['9898403', '泓茶'],
    ['102184050', '永远喜欢呜米的铃鹿'],
    ['1847888129', '咩啊栗nya'],
    ['3045020', '泡泡要抱抱举高高'],
    ['355895788', '久秋-蓬'],
    ['173985337', '半步灬青莲'],
    ['85774607', '呜米嗷嗷嗷'],
    ['277710095', '咩栗小姐的萝北'],
    ['4981170', '咸鱼诗人阿兰'],
    ['499813226', 'photoelectricity'],
    ['327389390', '崽崽是我的小太阳啊'],
    ['676673098', '黑夜office'],
    ['19319616', '丶颜艺丶'],
    ['22257026', '星斗Star'],
    ['266752689', '休止-符'],
    ['82399211', '星空有丶蓝'],
    ['434800565', 'CW狂风'],
    ['5024537', 'Umy的天谴之子'],
    ['151439304', '八月中秋月'],
    ['361729677', '史莱姆的频道'],
    ['545133496', '枺芙'],
    ['517852301', '忘崽牛奶嗷呜'],
    ['282545441', 'Me-Suwin'],
    ['862706', 'wizard魔法'],
    ['7391732', '咩栗保护协会-凌月'],
    ['37268234', '毕加索de猫猫'],
    ['150884484', 'うみ呜米'],
    ['182568485', '不想努力的盒子'],
  ]
}

export default {
  get_song_data,
  cutter_list
}