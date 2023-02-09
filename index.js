/*
 * @Author: Ju Dandan judandan0608@163.com
 * @Date : 2022-12-29 14:18:44
 * @LastEditors: Ju Dandan
 * @LastEditTime: 2023-02-09 10:57:29
 * @Description: index
 * 
 */

const { mkdir } = require('./utils/mkdir')
const { writeTSFile, writeLessFile } = require('./utils/writeFIle')
const path = require('path')
const process = require('process')

// process.argv
// process.argv 属性返回数组，其中包含启动 Node.js 进程时传入的命令行参数。 第一个元素将是 process.execPath。
// 第二个元素将是正在执行的 JavaScript 文件的路径。 其余元素将是任何其他命令行参数。

const argvList = process.argv
const argvList2 = argvList[2]
console.log(argvList)
// argvList[2]获取命令行第一个参数
// 创建src文件夹
mkdir(path.join(__dirname, `src/${argvList2}`))
// 写入文件
writeTSFile(path.join(__dirname, `src/${argvList2}/index.ts`), argvList2)
writeLessFile(path.join(__dirname, `src/${argvList2}/index.module.less`), argvList2)