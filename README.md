# CSV Based Web Music Player
以csv文件作为数据库的纯前端音乐播放器，使用vue-cli进行构建

# CHANGE LOG
* 2022-01-30
    * 增加可以听处理过的版本选项
    * 可以在筛选歌曲的列表里操作播放列表了
    * 同一天里，不同bv号的歌会分开排序了
    * 支持了预定义歌单
    * 能够保存播放列表循环方式了
    * 添加了打call复制
    * 更新了叔叔录播跳转链接格式`t=second`=>`start_progress=millisecond`
    * bugfix: 合集录播无法跳转
* 2022-01-18
    * 增加跳转首页尾页按钮
    * 现在分享歌曲的链接会校验这首歌有没有音频了
    * 增加一个奇怪的后门
* 2022-01-06
    * 增加定时关闭功能
    * 歌曲搜索不再折叠
    * 5天内更新的歌曲暂不可播放
    * 宽屏幕增加下载按钮
    * 获取分享歌曲后删掉地址栏的查询参数
* 2022-01-05
    * Issue #2
* 2022-01-01
    * Issue #1

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
