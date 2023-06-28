#!/usr/bin/env node

const color = require('colors-cli/safe')
console.log('**')
console.log(color.blue('春水满四泽，夏云多奇峰。秋月扬明晖，冬岭秀孤松！'))
console.log('**')

let argv = require('yargs')
    .option('ps', {
        alias: 'poem-style',
        demand: false,
        default: 'blue_bt',
        describe: '诗词样式，如--ps=blue_bt',
        type: 'string'
    })

// 它声明了脚本文件的解释程序，脚本文件有很多，我们要运行这个index.js
// 就得告诉系统你是要用什么来执行我们的脚本，这里当然是使用node了。
// 测试一下看可以用不。使用npm link命令，它的作用是把当前文件夹拷贝到node全局包的安装环境下，
// 当拷贝过去以后你就可以把他当成一个全局包使用了，拷贝完后直接使用temp-cli来运行脚本就可以了

const { mkdir } = require('./utils/mkdir')
const path = require('path')
const fs = require('fs')
const process = require('process')

// process.argv
// process.argv 属性返回数组，其中包含启动 Node.js 进程时传入的命令行参数。 第一个元素将是 process.execPath。
// 第二个元素将是正在执行的 JavaScript 文件的路径。 其余元素将是任何其他命令行参数。
const argvList = process.argv
const argvList2 = argvList[2]
const argvList3 = argvList[3]
// argvList[2]获取命令行第一个参数

if (argvList2) {
    // 创建src文件夹
    // __dirname: 代码存放的位置
    // process.execPath: 当前执行的node路径（如：/bin/node）
    // process.cwd() 当前执行程序的路径

    /**
     * -i
     * 创建进入页模版
     * 简化版
     * 例如： temp-cli -i index
     */
    if (argvList2 === '-i') {
        // 创建src目录
        // 判断目录是否存在
        // const srcPath = path.join(process.cwd(), `src`)
        // if (!fs.existsSync(srcPath)) {
        //     mkdir(srcPath)
        // }

        // 目标文件夹路径
        const indexPath = path.join(process.cwd(), `${argvList3}`)
        if (!fs.existsSync(indexPath)) {
            // 创建目标文件夹
            mkdir(indexPath)
            const { writeTSFile, writeLessFile } = require('./utils/writeFIle')
            // 写入文件
            writeTSFile(path.join(process.cwd(), `${argvList3}/index.ts`), argvList3)
            writeLessFile(path.join(process.cwd(), `${argvList3}/index.module.less`), argvList3)
            console.log(color.green_bbt('Success!'))
        } else {
            console.log(color.red_bbt('同名文件夹已存在，请输入其他目录名称！'))
        }
    }
    /**
     * -ia
     * 进入页完整版模版
     * 包含，埋点，数据请求，下拉刷新，表格，统计说明
     * 例如： temp-cli -ia index
     */
    if (argvList2 === '-ia') {
        // 目标文件夹路径
        const indexPath = path.join(process.cwd(), `${argvList3}`)
        // 校验目标文件夹是否存在
        if (!fs.existsSync(indexPath)) {
            // 创建目录
            mkdir(indexPath)
            const {
                writeIAIndexTSFile,
                writeIALessFile,
                writeIASratisticsTSFile,
                writeIAChartTSFile,
                writeIATableTSFile,
                writeIATableTabsTSFile
            } = require('./template/initComplete/index')
            // 写入index文件
            writeIAIndexTSFile(path.join(process.cwd(), `${argvList3}/index.tsx`), argvList3)
            // 写入Less文件
            writeIALessFile(path.join(process.cwd(), `${argvList3}/index.module.less`), argvList3)
            // 写入chart文件
            writeIAChartTSFile(path.join(process.cwd(), `${argvList3}/barChart.tsx`), argvList3)
            // 写入Table文件
            writeIATableTSFile(path.join(process.cwd(), `${argvList3}/groupTable.tsx`), argvList3)
            // 写入tabs Table文件
            writeIATableTabsTSFile(path.join(process.cwd(), `${argvList3}/companyTable.tsx`), argvList3)
            // 写入统计说明文件
            writeIASratisticsTSFile(path.join(process.cwd(), `${argvList3}/StatisticsDescription.tsx`), argvList3)
            console.log(color.green_bbt('Success!'))
        } else {
            console.log(color.red_bbt('同名文件夹已存在，请输入其他目录名称！'))
        }
    }

    /**
     * -icb
     * 图表模版
     * 日周月展示
     * 所选日期展示
     */
    if (argvList2 === '-icb') {
        // 目标文件路径 
        const indexPath = path.join(process.cwd(), `${argvList3 || 'barIndex'}.tsx`)
        // 校验目标文件夹是否存在
        if (!fs.existsSync(indexPath)) {
            const { writeChartTSFile, writeBarIndexTSFile } = require('./template/component/chart')
            // 写入文件
            writeBarIndexTSFile(path.join(indexPath), argvList3 || 'barIndex')
            writeChartTSFile(path.join(process.cwd(), `barChart.tsx`), 'barChart')
            console.log(color.green_bbt('Success!'))
        } else {
            console.log(color.red_bbt('同名文件已存在，请输入其他名称！'))
        }
    }

    /**
     * -c
     * 组件模版
     * 
     */
    if (argvList2 === '-c') {
        const indexPath = path.join(process.cwd(), `${argvList3 || 'component'}.tsx`)
        if (!fs.existsSync(indexPath)) {
            // 创建组件目录
            mkdir(indexPath)
        } else {
            console.log(color.red_bbt('同名文件已存在，请个输入其他名称'))
        }
    }

} else {
    console.log('     ')
    console.log(color.red_bbt('tips: 请输入相关配置参数'))
    console.log(color.red('exp: temp-cli -i index'))
    console.log('     ')
    console.log(color.green_bbt('第一个参数为：模版类型'))
    // 进入页模版
    console.log(color.green('-i  : 进入页模版'))
    console.log(color.green('-ia : 进入页完整版模版'))

    // 进入页组件模版
    console.log(color.red_bbt('tips: 请输入相关配置参数'))
    console.log(color.red('exp: temp-cli -icb chart'))
    console.log(color.green('-icb: 柱状图组件模版，柱状图默认文件夹名称barChart'))

    // 组件模版
    console.log(color.green('-c  : 组件模版'))
    console.log(color.green('-cl : 组件模版带样式文件'))
    console.log(color.green('-cf : 函数组件模版'))
    console.log(color.green('-cfl: 函数组件模版带样式文件'))
    console.log(color.green_bbt('第二个参数为：模版名称（组件模版请首字母大写）'))
}

// console.log(color.black_bbt('by: Ju DanDan')
// 建议使用npm version 1.0.9 这样的命令去修改，因为该命令会顺带把package-lock.json文件中的版本号也改了。
// 运行npm publish 发布