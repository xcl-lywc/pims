module.exports = {
  lintOnSave: false,
  outputDir: "dist",
  assetsDir: "assets",
  devServer: {
    proxy: {
      '/pics': {
        target: 'http://192.168.31.9:10002',
        secure: false
      },
      '/api': {
        target: 'http://192.168.31.9:18081',
        ws:true, // 为true表示可以给webscoket使用
        pathRewrite: {'^/api' : ''}, //重定向
        secure: false
      },
    }
  }
}