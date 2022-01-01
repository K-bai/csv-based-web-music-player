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
  return JSON.parse(localStorage.getItem('love_list'))
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
  if (song_list.length === 0) song_list.push(empty_song)
  return {
    current_song: current_playlist.current_song,
    song_list
  }
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

function get_query()
// 获取url参数
{
  let query = window.location.search.substring(1).split("&")
  let rst = {}
  for (let i of query){
    let pair = i.split("=")
    rst[pair[0]] = pair[1]
  }
  return rst
}

function if_first_browse(){
  // 初始化
  if (!localStorage.getItem('browse_flag'))
    return true
  else if (localStorage.getItem('browse_flag') !== '20220101'){
    localStorage.setItem('browse_flag', '20220101')
    return true
  }
  return false
}

function debug(text){
  window.meumy.debug_list.push(text)
}

export default {
  empty_song,
  save_love_list,
  read_love_list,
  save_playlist,
  read_playlist,
  encode_share,
  decode_share,
  get_query,
  if_first_browse,
  debug
}