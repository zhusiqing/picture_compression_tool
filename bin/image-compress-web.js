#!/usr/bin/env node

const { spawn } = require('child_process')
const path = require('path')

const projectPath = path.resolve(process.argv[1], '../../lib/node_modules/node-images-compress-cli')

const pp = spawn('node', [path.resolve(projectPath, './server/index.js'), '-p 5002'], { stdio: 'inherit' })
pp.on('error', err => {
  console.log('error', err)
})
pp.on('close', code => {
  console.log('close')
})
