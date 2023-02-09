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

function mkdir(dirpath) {
    // 创建文件夹
    fs.mkdir(dirpath, function(err){
        if(err){
            return console.log('EEXIST!')
            return console.error(err)
        }
        console.log('dir surrcss!')
    })
}

module.exports = { mkdir }