//const webpack = require('webpack')
module.exports = {
    pages: {
        index: 'src/main.js',
        unidades: 'src/mainUnidades.js',
        estado: 'src/mainEstado.js',
        sync: 'src/mainSync.js',
        cola: 'src/mainCola.js'
    },
    pluginOptions: {
      electronBuilder: {
        preload: {
          preload: 'src/preload.js',
          preloadUnidades: 'src/views/electron/unidades/preloadUnidades.js',
          preloadEstado: 'src/views/electron/estado/preloadEstado.js',
          preloadSync: 'src/views/electron/sync/preloadSync.js',
          preloadCola: 'src/views/electron/cola/preload.js',
        }
      }
    },
    configureWebpack: {
      plugins: [
      ]
    }
}
