import { readFileSync } from 'fs'
import babel from '@rollup/plugin-babel'
import del from 'rollup-plugin-delete'
import pluginNodeResolve from '@rollup/plugin-node-resolve'
import pluginCommonjs from '@rollup/plugin-commonjs'
import pluginReplace from '@rollup/plugin-replace'
import pluginImportCss from 'rollup-plugin-import-css'
import pluginHtml from '@rollup/plugin-html'
const { templateHandle } = require('./lib/utils')

import pkg from './package.json'

process.env.NODE_ENV = 'production'
const template = readFileSync('./index.html').toString()
export default {
  input: pkg.source,
  output: {
    file: pkg.output,
    format: 'esm',
    sourcemap: false
  },
  plugins: [
    del({
      targets: ['web/*'],
      runOnce: true
    }),
    babel({
      include: 'src/**',
      babelHelpers: 'runtime'
    }),
    pluginCommonjs(),
    pluginNodeResolve(),
    pluginReplace({
      'process.env.NODE_ENV': JSON.stringify( 'production' )
    }),
    pluginImportCss(),
    pluginHtml({
      title: 'images-compress',
      template({ title }) {
        return templateHandle(template, { title })
      }
    })
  ],
  watch: {
    include: 'src/**'
  }
}
