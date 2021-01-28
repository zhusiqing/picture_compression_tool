import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import ImagesUploading from 'react-images-uploading';
import { Toaster, toast } from 'react-hot-toast';
import './index.css';
import { transformSize } from '../lib/utils';

const App = () => {
  const [images, updateImages] = useState([])
  const [downloads, updateDownloads] = useState([])
  let quality = ''
  // 最大同时上传100个，单个文件最大100mb
  const maxNumber = 100, maxFileSize = 1024 * 1024 * 100
  function onChange(imageList, addUpdateIndex) {
    console.log(imageList, addUpdateIndex);
    updateImages(imageList)
  }
  function onError(err) {
    if (err?.maxNumber) {
      alert('超出最大上传数量限制')
    }
  }
  function onInputChange(e) {
    quality = e.target.value
  }
  function onUploadHandle() {
    if (!Number(quality) && quality) {
      toast.error('请输入正确的压缩图片质量')
      return
    }
    const formData = new FormData()
    formData.append('quality', Number(quality) || 50)
    images.forEach(({file}) => {
      formData.append('files', file)
    })
    toast.promise(
      fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })
        .then(res => res.json())
        .then(res => {
          if (res.success) {
            updateDownloads(res.files)
          } else {
            throw new Error('压缩失败')
          }
        }),
      {
        loading: <strong>上传并压缩中，请稍后...</strong>,
        success: <strong>压缩成功</strong>,
        error: <strong>压缩失败</strong>
      }
    )

  }
  return (
    <div className="container">
       <h1>图片压缩</h1>
       <ImagesUploading
          multiple
          value={images}
          onChange={onChange}
          onError={onError}
          maxNumber={maxNumber}
          maxFileSize={maxFileSize}
          dataURLKey="files"
        >
          {({
            imageList,
            onImageUpload,
            onImageRemoveAll,
            onImageUpdate,
            onImageRemove,
            isDragging,
            dragProps
          }) => (
            <div className="upload-box">
              <div
                className={`upload-btn ${isDragging ? 'drop' : ''}`}
                onClick={onImageUpload}
                {...dragProps}>
                点击或者拖拽图片到这里，支持jpg/png压缩，但是png压缩后会转换成jpg
              </div>
              <ol className="upload-list">
                {imageList.map((image, index) => {
                  console.log(image);
                  return (
                    <li key={index}>
                      <div className="upload-list-item">
                        <img src={image.files} width="50" height="50"/>
                        <div className="name">{image.file.name}</div>
                        <div className="size">{transformSize(image.file.size)}</div>
                        <div className="handle">
                          <button onClick={() => onImageUpdate(index)}>替换</button>
                          <button onClick={() => onImageRemove(index)}>删除</button>
                        </div>
                      </div>
                    </li>
                  )
                })}
              </ol>
              {imageList.length
                ? (
                  <div className="all-upload-handle">
                    <div className="quality-box">
                      <span className="label">压缩图片质量：</span>
                      <input className="quality" type="text" placeholder="默认为50，不写则为50" onChange={onInputChange}/>
                    </div>
                    <button onClick={onUploadHandle}>上传</button>
                    <button onClick={onImageRemoveAll}>全部删除</button>
                  </div>
                )
                : null}
            </div>
          )}
        </ImagesUploading>
        <ol className="download-list-box">
          {downloads.map((file, index) => (
            <li className="download-list">
              <span>{++index}.</span>
              <a target="_blank" key={index} href={file.url}>{file.name}</a>
              <div className="size">{file.size}</div>
            </li>
          ))}
        </ol>
        <Toaster/>
    </div>
  )
}


ReactDOM.render(<App></App>, document.querySelector('#app'))
