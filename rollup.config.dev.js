import pluginServe from 'rollup-plugin-serve'
import pluginReplace from '@rollup/plugin-replace'
import rollupConfig from './rollup.config'
process.env.NODE_ENV = 'development'

const config = {
  port: 5000,
  path: 'web'
}
rollupConfig.output.sourcemap = true
rollupConfig.plugins.push(pluginServe({
  port: config.port,
  contentBase: [config.path]
}))
rollupConfig.plugins.push(pluginReplace({
  'process.env.NODE_ENV': JSON.stringify( 'development' )
}))
export default rollupConfig
