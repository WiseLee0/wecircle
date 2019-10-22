module.exports = {
  configureWebpack: {
    resolve: {
      alias: {
        '@views': '@/views',
        '@components': '@/components',
        '@utils': '@/utils'
      }
    }
  },
  devServer: {
    proxy: 'http://localhost:9100'
  },
  publicPath: process.env.NODE_ENV === 'production' ?
    '/wecircle/' :
    '/'
}