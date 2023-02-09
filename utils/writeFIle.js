
// filehandle.writeFile(data, options)
// 异步地将数据写入文件，如果文件已经存在，则替换该文件。 data 可以是字符串、缓冲区、<AsyncIterable>、或 <Iterable> 对象。 成功时不带参数解决 promise。

const path = require('path')
const fs = require('fs')

const titleCase = function(str) {
	newStr = str.slice(0, 1).toUpperCase() + str.slice(1).toLowerCase();
	return newStr;
}


const getCodeString = function (name) {
	return `import * as React from 'react'
import styles from './index.module.less'

interface I${titleCase(name)}Props {
}
interface I${titleCase(name)}State {
	selectInfo: any;
}

class ${titleCase(name)} extends React.Component<I${titleCase(name)}Props, I${titleCase(name)}State> {
	state: I${titleCase(name)}State = {
		selectInfo: {}
	}

	componentDidMount() { }

	render() {
		return <div className={styles.${titleCase(name)}}>
		
		</div>
	}
}
export default ${titleCase(name)}`
}

/**
 * @description: 创建TS模版文件
 * @param dirpath: 路径
 * @param name: 名称
 * @return {*}
 */
function writeTSFile(dirpath, name) {
	const str = getCodeString(name)
	// 创建JS文件
	fs.writeFile(dirpath, str, function (err) {
		if (err) {
			return console.log('EEXIST!')
			return console.error(err)
		}
		console.log('write file surrcss!')
	})
}

const getLessString = function (name) {
	return `.${titleCase(name)}{

}`
}

/**
 * @description: 创建LESS模版文件
 * @param dirpath: 路径
 * @param name: 名称
 * @return {*}
 */
function writeLessFile(dirpath, name) {
	const str = getLessString(name)
	// 创建JS文件
	fs.writeFile(dirpath, str, function (err) {
		if (err) {
			return console.log('EEXIST!')
			return console.error(err)
		}
		console.log('write file surrcss!')
	})
}


module.exports = { writeTSFile, writeLessFile }