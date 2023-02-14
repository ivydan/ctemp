/*
 * @Author: Ju Dandan judandan0608@163.com
 * @Date : 2022-12-29 14:20:17
 * @LastEditors: Ju Dandan judandan0608@163.com
 * @LastEditTime: 2022-12-29 17:24:05
 * @Description: 创建文件夹
 */

/**
 * @description: 
 * @param dirpath: 路径
 * @return {*}
 */
const path = require('path')
const fs = require('fs')
const color = require('colors-cli/safe')

function mkdir(dirpath) {
    // 创建文件夹
    fs.mkdirSync(dirpath, function(err){
        // 判断目录是否存在
        if(fs.existsSync(dirpath)){
            return console.log(color.red.bold('ERROR: directory is exist!'));
        }
        if(err){
            return console.log(color.red.bold(err));
        }
        // console.log('dir surrcss!')
    })
}

module.exports = { mkdir }