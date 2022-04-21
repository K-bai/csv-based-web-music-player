let empty_song = {
  name: '--',
  artist: '--',
  status: '--',
  duration: '00:00',
  date: '--',
  id: 'empty_song',
  src: '',
}

function save_love_list(l){
  localStorage.setItem('love_list', JSON.stringify(l))
}

function read_love_list(){
  // 初始化
  if (!localStorage.getItem('love_list')) localStorage.setItem('love_list', '[]')
  let love_list = JSON.parse(localStorage.getItem('love_list'))
  if (love_list.length > 0) {
    if(love_list[0].substring(0, 1) !== 'U') {
      love_list = []
      localStorage.setItem('love_list', '[]')
    }
  }
  return love_list
}






function save_my_collection(){
  localStorage.setItem('my_collection', JSON.stringify(window.meumy.my_song_collection.map(
    collection => ({
      name: collection.name,
      song_id_list: collection.list.map(song => song.id)
    })
  )))
}

function read_my_collection(){
  // 初始化
  if (!localStorage.getItem('my_collection')) localStorage.setItem('my_collection', '[]')
  // 验证一遍歌曲
  let my_collection = JSON.parse(localStorage.getItem('my_collection'))
  let my_collection_verify = []
  for (let collection of my_collection) {
    let song_list = collection.song_id_list.map(i => window.meumy.song_list.find(s => (s.id === i)))
    song_list = song_list.filter(s => s !== undefined)
    if (song_list.length === 0) continue
    my_collection_verify.push({
      name: collection.name,
      list: song_list
    })
  }
  return my_collection_verify
}








function save_playlist(current_song, song_list){
  // 转换歌曲列表 仅保存id
  localStorage.setItem('current_playlist', JSON.stringify({
    current_song,
    song_id_list: song_list.map(s => s.id).filter(i => (i !== 'empty_song'))
  }))
}

function read_playlist(){
  // 初始化
  if (!localStorage.getItem('current_playlist')){
    localStorage.setItem('current_playlist', JSON.stringify({
      current_song: 0,
      song_id_list: []
    }))
  }
  let current_playlist = JSON.parse(localStorage.getItem('current_playlist'))
  let song_list = current_playlist.song_id_list.map(i => window.meumy.song_list.find(s => (s.id === i)))
  song_list = song_list.filter(s => s !== undefined)
  if (song_list.length === 0) song_list.push(empty_song)
  return {
    current_song: Math.min(current_playlist.current_song, song_list.length-1),
    song_list
  }
}






let default_settings = {
  use_treated: false,
  play_mode: 'loop'
}
function save_settings(s){
  let current_settings = Object.assign(read_settings(), s)
  localStorage.setItem('settings', JSON.stringify(current_settings))
}
function read_settings(){
  // 初始化
  if (!localStorage.getItem('settings'))
    localStorage.setItem('settings', JSON.stringify(default_settings))
  let current_settings = JSON.parse(localStorage.getItem('settings'))
  Object.assign(default_settings, current_settings)
  return default_settings
}








let cipher = 'ILovEMeUmyhOc0nWsJzCVau4BYGAtSH2XpZPld1b657F3xNi98wRKDQkTrgjqf'
let code_prefix = 'musong://'
function encode_share(){
  // 将当前播放列表转化为分享代码
  return code_prefix + window.meumy.playlist.map(s => {
    let n = parseInt(s.id.substring(1))
    let l = cipher.length
    let c = ''
    while (n !== 0 || c.length<3){
      c += cipher.substring(n%l, n%l+1)
      n = Math.floor(n / l)
    }
    return c
  }).filter(i => (i !== 'empty_song')).join("")
}
function decode_share(code){
  // 将分享代码转化为歌曲列表
  if (code.substring(0, 9) !== code_prefix) return false
  let pure_code = code.substring(9)
  if (pure_code.length % 3 !== 0 || pure_code.length ===0) return false
  let song_id_list = []
  while (pure_code.length > 0){
    let song_code = pure_code.substring(0, 3).split('').reverse()
    pure_code = pure_code.substring(3)
    let song_id = 0
    while (song_code.length > 0){
      song_id *= cipher.length
      song_id += cipher.search(song_code[0])
      if (song_id === -1) return false
      song_code = song_code.slice(1)
    }
    let song_id_text = song_id.toString()
    while (song_id_text.length < 5)
      song_id_text = '0' + song_id_text
    song_id_list.push('U' + song_id_text)
  }
  let song_list = window.meumy.song_list.filter(s => (song_id_list.findIndex(i => (i === s.id)) !== -1))
  if (song_list.length !== song_id_list.length) return false
  return song_list
}

function if_first_browse(){
  // 初始化
  let lastest = '20220101'
  if (!localStorage.getItem('browse_flag')){
    localStorage.setItem('browse_flag', lastest)
    return true
  }
  else if (localStorage.getItem('browse_flag') !== lastest){
    localStorage.setItem('browse_flag', lastest)
    return true
  }
  return false
}

function str_to_code(str){
  let s = 0
  for (let idx = 0; idx < str.length; idx++)
    s += str.charCodeAt(idx)
  return s
}

function debug(text){
  window.meumy.debug_list.push(text)
}

export default {
  empty_song,
  save_love_list,
  read_love_list,
  save_my_collection,
  read_my_collection,
  save_playlist,
  read_playlist,
  save_settings,
  read_settings,
  encode_share,
  decode_share,
  if_first_browse,
  str_to_code,
  debug
}