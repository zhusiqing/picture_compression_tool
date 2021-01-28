<h1 align="center">image compression</h1>

<div align="center">
  <strong>
    a image compression tool
  </strong>
</div>

<br>

<div align="center">
  <a href="https://nodejs.org/en/">
    <img src="https://img.shields.io/badge/node-%3E%3D%2012.0.0-green.svg" alt="Node Version">
  </a>
</div>

## 先决条件

说明用户在安装和使用前，需要准备的一些先决条件，譬如：您需要安装或升级 [Node.js](https://nodejs.org/en/)（> = `12.* `，Npm 版本 >= `6.13.0 `，[Yarn](https://www.jeffjade.com/2017/12/30/135-npm-vs-yarn-detial-memo/) 作为首选）。

## 安装

```bash
npm i node-images-compress-cli
# or
npm i -g node-images-compress-cli

```

## 基本使用

```bash
images-compress <file|dir> [...file|dir]
# eg: images-compress ./test .bg.jpg
```

## 基本web服务使用

```bash
images-compress-web
```

## 参数

```
image-compress [options] <path...>

a picture compression tool

Options:
  -V, --version                                  output the version number
  -q, --quality  <number>   set picture quality (default: "50")
  -o, --output  <path>      set picture output path
  -h, --help                                     display help for command
```

## 本地执行

1. 依赖安装

```bash
npm i
## or
yarn
```

2. 执行

```bash
node index <file|dir> [...file|dir]
```

## 本地可视化版本

1. 一键启动

```bash
yarn start
```

2. 页面构建

```bash
yarn build
```

3. 页面开发

```bash
yarn dev
```

4. 服务开发

```bash
yarn serve
```

## TODO

- [x] 增加本地web版可视化页面工具
- [ ] 目前的压缩后统一转换成.jpg格式，后续支持png压缩
- [ ] 优化可视化页面
- [ ] 支持压缩svg格式

## 执照

[MIT](http://opensource.org/licenses/MIT)

版权所有 (c) 2021-至今，[zhusiqing](https://github.com/zhusiqing)。
