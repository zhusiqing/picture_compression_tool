## 1.2.0 (2021.02.01)

- 更换压缩库，支持.png压缩，将压缩库从`images`更换至`imagemin`

#### 命令行

- 抽离压缩功能

#### web服务（可视化）

- 增加图片预览功能，使用`react-awesome-lightbox`

## 1.1.0 (2021.01.28)

- 增加web服务，用于可视化页面压缩操作，基于`react`开发，`rollup`构建
- 图片上传使用`react-images-uploading`

## 1.0.0 (2021.01.26)

- 命令行图片压缩功能，采用`koa`
- 基于`commander`命令行操作，`chalk`和`consola`美化命令行操作
