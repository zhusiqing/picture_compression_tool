// 文件大小显示
function transformSize(b) {
  const kb = 1024
  const mb = kb * 1024
  const gb = mb * 1024
  let size = 0, unit = 'B'
  if (b / kb < 1) {
    size = b
    unit = 'B'
  }
  else if (b / mb < 1) {
    size = b / kb
    unit = 'KB'
  }
  else if (b / gb < 1) {
    size = b / mb
    unit = 'MB'
  }
  else {
    size = b / gb
    unit = 'GB'
  }
  return size.toFixed(2) + unit
}
// 判断类型
function judgmentType(type) {
  const str = Object.prototype.toString.call(type)
  return str.match(/\[object (\S*)\]/)[1]
}

// 简化版模板语法  ${}
function templateHandle(template = '', data = {}) {
  const templateReg = new RegExp(/(\$\{.*?\})/g)
  const matchList = template.match(templateReg) || []
  const strReg = new RegExp(/\$\{(\S*)\}/)
  matchList.forEach(el => {
    const key = el.match(strReg)[1]
    const value = data[key] || ''
    let tempStr = ''
    if (judgmentType(value) === 'Array') {
      tempStr = value.join('\n')
    } else {
      tempStr = value
    }
    template = template.replace(el, tempStr)
  })
  return template
}

module.exports = {
  transformSize,
  judgmentType,
  templateHandle
}
