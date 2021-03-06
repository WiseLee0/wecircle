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
    proxy: 'http://localhost:8820'
  },

  publicPath: process.env.NODE_ENV === 'production' ?
    '/wecircle/' :
    '/',

  css: {
    loaderOptions: {
      stylus: {
        'resolve url': true,
        'import': [
          './src/theme'
        ]
      }
    }
  },

  pluginOptions: {
    'cube-ui': {
      postCompile: true,
      theme: true
    }
  }
}
