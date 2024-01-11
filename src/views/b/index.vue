<script setup lang="ts">
const { canvasRef, context, width, height } = useCanvas({ animate })
const codeLines: string[] = [
  '                 _oo0oo_',
  '                o8888888o',
  '               88" .  "88',
  '               (|  -_-  |)',
  '               0\    =   /0',
  '              ___/`---\'\___',
  '            .\' \\|      |// \'.',
  '            / \\\\|||  :  |||// \\',
  '          / _||||| -:- |||||- \\',
  '          |   | \\\\\\  - /// |   |',
  '          | \\_|  \'\'\\---/\'\'  |_/ |',
  '        \  .-\\__  \'-\'  ___/-. /',
  '        ___\'. .\'  /--.--\\  `. .\'___',
  '    ."" \'<  `.___\\_<|>_/___.\' >\' "".',
  '   | | :  `- \\`.;`\\ _ /`;.`/ - ` : | |',
  '   \\  \\ `_.   \\_ __\\ /__ _/   .-` /  /',
  '=====`.____`.___ \\_____/___.-`___.-\'=====',
  '                   `=---=\'',
  '  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
  '        佛祖保佑     永不宕机     永无BUG',
  '       佛曰:  ',
  '         写字楼里写字间，写字间里程序员；        ',
  '         程序人员写程序，又拿程序换酒钱。        ',
  '         酒醒只在网上坐，酒醉还来网下眠；        ',
  '         酒醉酒醒日复日，网上网下年复年。        ',
  '         但愿老死电脑间，不愿鞠躬老板前；        ',
  '         奔驰宝马贵者趣，公交自行程序员。        ',
  '         别人笑我忒疯癫，我笑自己命太贱；        ',
  '         不见满街漂亮妹，哪个归得程序员？',
]

let row = 0
let col = 1

// 初始化画布

// 绘制代码
function animate() {
  if (context.value) {
    context.value.clearRect(0, 0, width.value, height.value)
    resume()
  }
}
// 执行代码
function resume() {
  context.value!.shadowColor = 'hsla(120,100%,50%,0.5)'
  context.value!.shadowBlur = 2
  context.value!.fillStyle = 'hsla(120,100%,20%,1)'
  const initx = width.value / 2 - 200
  const inity = 200
  context.value!.globalCompositeOperation = 'lighter'
  // 如果当前行是正在输入的那一行，只绘制到当前输入位置（col 列）。否则，绘制整行代码
  for (let i = 0; i <= row; i++) {
    let line = codeLines[i] || ''
    if (i === row)
      line = line.substring(0, col++)

    // 字体大小
    context.value!.font = '16px monospace'
    context.value!.fillText(line, initx, inity + i * 16)
  }

  // 绘制光标
  context.value!.fillStyle = 'hsla(120,100%,50%,1)'
  if (codeLines[row]) {
    const x = initx + context.value!.measureText(codeLines[row]?.substring(0, col)).width
    const y = inity + row * 16 - 14
    context.value!.fillRect(x, y, 10, 14)
  }
  if (col >= codeLines[row]?.length) { // 换行
    row++
    col = 0
  }

  if (row * 16 > window.innerHeight - 200)
    context.value!.translate(0, -0.5) // 滚动
}
</script>

<template>
  <canvas ref="canvasRef" class="backdrop-blur" />
</template>
