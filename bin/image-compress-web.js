#!/usr/bin/env node

const { spawn } = require('child_process')

const p = spawn('./node_modules/.bin/rollup', ['-c'], { stdio: 'inherit' })
p.on('close', () => {
  const pp = spawn('node', ['server/index.js', '-p 5002'], { stdio: 'inherit' })
  pp.on('error', err => {
    console.log('error', err)
  })
  pp.on('close', code => {
    console.log('close')
  })
})
