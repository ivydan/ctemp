#!/usr/bin/env node

const color = require('colors-cli/safe')
console.log('**')
console.log(color.blue_bbt('春水满四泽，夏云多奇峰。秋月扬明晖，冬岭秀孤松！'))
console.log('**')

// 它声明了脚本文件的解释程序，脚本文件有很多，我们要运行这个index.js
// 就得告诉系统你是要用什么来执行我们的脚本，这里当然是使用node了。
// 测试一下看可以用不。使用npm link命令，它的作用是把当前文件夹拷贝到node全局包的安装环境下，
// 当拷贝过去以后你就可以把他当成一个全局包使用了，拷贝完后直接使用temp-cli来运行脚本就可以了

const { mkdir } = require('./utils/mkdir')
const { writeTSFile, writeLessFile } = require('./utils/writeFIle')
const path = require('path')
const fs = require('fs')
const process = require('process')

// process.argv
// process.argv 属性返回数组，其中包含启动 Node.js 进程时传入的命令行参数。 第一个元素将是 process.execPath。
// 第二个元素将是正在执行的 JavaScript 文件的路径。 其余元素将是任何其他命令行参数。
const argvList = process.argv
const argvList2 = argvList[2]
// argvList[2]获取命令行第一个参数

if (argvList2) {
    // 创建src文件夹
    // __dirname: 代码存放的位置
    // process.execPath: 当前执行的node路径（如：/bin/node）
    // process.cwd() 当前执行程序的路径

    // 创建src目录
    // 判断目录是否存在
    const srcPath = path.join(process.cwd(), `src`)
    if (!fs.existsSync(srcPath)) {
        mkdir(srcPath)
    }

    const indexPath = path.join(process.cwd(), `src/${argvList2}`)
    if (!fs.existsSync(indexPath)) {
        // 创建目录
        mkdir(indexPath)
        // 写入文件
        writeTSFile(path.join(process.cwd(), `src/${argvList2}/index.ts`), argvList2)
        writeLessFile(path.join(process.cwd(), `src/${argvList2}/index.module.less`), argvList2)
    }


} else {
    console.log('     ')
    console.log(color.red_bbt('tips : 请输入需要定义的文件名称！'))
}

// console.log(color.black_bbt('by: Ju DanDan'))

// 建议使用npm version 1.0.8 这样的命令去修改，因为该命令会顺带把package-lock.json文件中的版本号也改了。
// 运行npm publish 发布