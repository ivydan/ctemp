#!/usr/bin/env node
// 它声明了脚本文件的解释程序，脚本文件有很多，我们要运行这个index.js
// 就得告诉系统你是要用什么来执行我们的脚本，这里当然是使用node了。
// 测试一下看可以用不。使用npm link命令，它的作用是把当前文件夹拷贝到node全局包的安装环境下，
// 当拷贝过去以后你就可以把他当成一个全局包使用了，拷贝完后直接使用c-temp来运行脚本就可以了

console.log('春水满四泽，夏云多奇峰。秋月扬明晖，冬岭秀孤松！')
const { mkdir } = require('./utils/mkdir')
const { writeTSFile, writeLessFile } = require('./utils/writeFIle')
const path = require('path')
const process = require('process')

// process.argv
// process.argv 属性返回数组，其中包含启动 Node.js 进程时传入的命令行参数。 第一个元素将是 process.execPath。
// 第二个元素将是正在执行的 JavaScript 文件的路径。 其余元素将是任何其他命令行参数。

const argvList = process.argv
const argvList2 = argvList[2]
// argvList[2]获取命令行第一个参数
// 创建src文件夹
mkdir(path.join(__dirname, `src/${argvList2}`))
// 写入文件
writeTSFile(path.join(__dirname, `src/${argvList2}/index.ts`), argvList2)
writeLessFile(path.join(__dirname, `src/${argvList2}/index.module.less`), argvList2)