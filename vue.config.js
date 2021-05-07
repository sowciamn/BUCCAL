const isProd = process.env.NODE_ENV === 'production'

module.exports = {
  transpileDependencies: [
    'vuetify'
  ],
  publicPath: isProd ? '/BUCCAL' : '/',
  outputDir: 'docs',
  filenameHashing: false,
  productionSourceMap: false
}