const fs = require('node:fs')
const path = require('node:path')
const fileSave = require('file-save')

const navs = Array.from({ length: 26 }, (_, i) => String.fromCharCode(97 + i))

// 为每个视频生成一个路由
const routes = navs.map((v) => {
  return {
    path: `/${v}`,
    name: v.toUpperCase(),
    component: `() => import('@/views/${v}/index.vue')`,
  }
})

function stringify(obj) {
  return JSON.stringify(obj, (key, value) => {
    if (typeof value === 'function' || value === undefined)
      return String(value)

    return value
  }, 2)
}
const routesStr = `export default ${stringify(routes)}  `
fileSave(path.resolve(__dirname, '../src/router/canvas-routes.ts')).write(
  routesStr,
  'utf8',
)

// 生成对应 vue 页面文件
function template(name) {
  return `<template>
   <div class="${name}">
      <h1 class="text-3xl">${name} works !!!</h1>
    </div>
</template>`
}
// 生成对应的 vue 文件
function genateVueFile(name) {
  // 创建文件夹
  const dirPath = path.resolve(__dirname, `../src/views/${name}`)
  if (!fs.existsSync(dirPath))
    fs.mkdirSync(dirPath)

  fs.mkdirSync(path.resolve(__dirname, `../src/views/${name}/components`))

  // 创建文件 并写入内容
  fileSave(path.resolve(__dirname, `../src/views/${name}/index.vue`)).write(
    template(name),
    'utf8',
  )
}
navs.forEach((v) => {
  genateVueFile(v)
})
