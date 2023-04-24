const path = require('path')
const fs = require('fs')
const color = require('colors-cli/safe')
const { titleCase } = require('../../utils/index')

const getCodeString = function (name) {
    return `/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import * as React from 'react'
import moment from 'moment'
import * as echarts from 'echarts'
import { landingQuery } from 'scripts/utils/query'
import EChartsComponent5 from 'scripts/components/commons/components/ECharts5'
import bgBottom from 'images/chart-select-bg-bottom.png'
import _ from 'lodash'
import styles from './index.module.less'

interface I${titleCase(name)}Props {
	barData: any;
	dateType: string;
	onSearchRouterDetail: (type: string, date: string) => void;
	selectDate?: string | number
}
interface I${titleCase(name)}State {
	selectInfo: any;
	selectDate: any;
	options: any;
	zoom: number;
}

const pingFangFontFamily =
	'PingFang SC,PingFangSC-Regular, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif'

const selectTextStyle = {
	color: '#fff',
	backgroundColor: '#006AFF',
	borderRadius: 3
}

class ${titleCase(name)} extends React.Component<I${titleCase(name)}Props, I${titleCase(name)}State> {
	state: I${titleCase(name)}State = {
		selectInfo: {},
		selectDate: this.props.selectDate || null,
		options: null,
		zoom: 0
	}

	echartsRef: any

	componentDidMount() {
		this.setState({
			options: this.getOptions()
		})
	}

	handleChartColumnsSelect = (index: number, echartsCurrent: any) => {
		if (!echartsCurrent) return false

		// 更新当前所选日期
		const { barData, dateType } = this.props
		let formatStr = this.getFormatStr()

		let xAxisData: any[] = []
		barData.forEach((element: any, elementIndex: number) => {
			xAxisData.push({
				value: dateType === 'WEEK' ? element.date : moment(element.date).format(formatStr),
				textStyle: index === elementIndex ? selectTextStyle : {}
			})
		})
		if (index >= 0) {
			echartsCurrent.dispatchAction({
				type: 'select',
				seriesIndex: [0, 1],
				dataIndex: index,
				__byTrendCharts__: true
			})

			this.echartsRef.echarts.setOption({ xAxis: { data: xAxisData } })
		}
	}

	renderChart() {
		const { options } = this.state

		if (!options) return <div className='wzsNoData'>暂无数据</div>

		let chartProps: any = {}

		chartProps.ref = (ref: any) => {
			return (this.echartsRef = ref)
		}
		chartProps.onZRClick = (e: any) => {
			// 获取echart对象
			const echartsCurrent = this.echartsRef.echarts
			// 获取偏移量
			const pointInPixel = [e.offsetX, e.offsetY]
			// 使用 convertFromPixel方法 转换像素坐标值到逻辑坐标系上的点。获取点击位置对应的x轴数据的索引		 值，借助于索引值的获取到其它的信息
			const pointInGrid = echartsCurrent.convertFromPixel(
				{ seriesIndex: 0 },
				pointInPixel
			)
			// 获取点击事假对应数据坐标
			const index = pointInGrid[0]
			const { dateType, barData } = this.props
			// 点击表格头和尾的位置 不做处理，防止增加错误数据导致增加空坐标柱的bug
			if (index > barData.length - 1 || index < 0) {
				return false
			}
			// 更新x轴日子所选中UI样式
			this.handleChartColumnsSelect(index, echartsCurrent)
			// 更新数据
			this.props.onSearchRouterDetail(dateType, barData[index])
		}
		chartProps.onUnSelect = (e: any) => {
			if (e.__byTrendCharts__) {
				console.log('ignore')
				return
			}
			const echartsCurrent = this.echartsRef.echarts
			echartsCurrent.dispatchAction({
				type: 'select',
				seriesIndex: [0, 1],
				dataIndex: e.dataIndexInside,
				__byTrendCharts__: true
			})
		}

		return (
			<>
				<div style={{ width: '100%', overflow: 'hidden', height: 266 }}>
					<div
						style={{
							width: document.body.clientWidth,
							position: 'absolute',
							left: '50%',
							transform: 'translate(-50%, 0)'
						}}
					>
						<EChartsComponent5 height={250} option={options} {...chartProps} />
					</div>
				</div>
			</>
		)
	}

	getFormatStr() {
		const { dateType } = this.props
		let formatStr = ''
		switch (dateType) {
			case 'DAY':
				formatStr = 'MM-DD'
				break
			case 'WEEK':
				formatStr = 'YYYY-WW'
				break
			case 'MONTH':
				formatStr = 'YYYY-MM'
				break
			default:
				break
		}
		return formatStr
	}

	getOptions() {
		const { barData, dateType } = this.props
		const { selectDate } = this.state
		if (!barData) return null

		let xAxisData: any[] = []
		let unsentTasks: number[] = [] 		// 未发任务数
		let unsentTaskRate: number[] = [] 	// 未发任务占比
		let onTimeDep: number[] = [] 		// 始发准点率
		let loadingRate: number[] = [] 		// 装载率

		let formatStr = this.getFormatStr()

		barData.forEach((element: any) => {
			xAxisData.push({
				value: dateType === 'WEEK' ? element.date : moment(element.date).format(formatStr),
				textStyle: (selectDate && selectDate === element.date) ? selectTextStyle : {}
			})
			unsentTasks.push(element.unsentTasks || 0)
			onTimeDep.push(element.onTimeDepRate ? element.onTimeDepRate * 100 : 0)
			loadingRate.push(element.loadingRate ? element.loadingRate * 100 : 0)
		})

		let splitNumber = 8

		if (dateType === 'WEEK') {
			splitNumber = 5
		}

		if (dateType === 'MONTH') {
			splitNumber = 4
		}

		const startIndex = barData.length - splitNumber
		let start = startIndex < 0 ? 0 : startIndex
		const endIndex = barData.length - 1
		let end = endIndex < 0 ? 0 : endIndex

		return {
			backgroundColor: '#fff',
			grid: {
				top: '15%',
				left: '5%',
				bottom: '24%',
				right: '5%',
				containLabel: true
			},
			tooltip: {
				trigger: 'axis',
				axisPointer: {
					type: 'shadow'
				},
				textStyle: {
					fontSize: 11
				},
				formatter: (params: any, index:number) => {
					let result = ''
					params.forEach((item: any) => {
						let dataStr = item.data?.toFixed(item.seriesName === '始发准点率' || item.seriesName === '装载率' ? 1 : 0)
						dataStr = parseFloat(dataStr)
						dataStr = dataStr.toLocaleString()
						const { dataIndex, seriesName } = item
						if(seriesName === '未发任务数'){
							const unsentTaskRate = barData[dataIndex].unsentTaskRate || 0
							dataStr = \`\${dataStr}(\${(unsentTaskRate * 100).toFixed(1)}%)\`
						}
						result += \`<div style="width:160px;overflow:hidden"><div style="float:left">\${item.marker}\${item.seriesName}</div><div style="float:right;font-weight:bold">\${dataStr}\${item.seriesName === '始发准点率' || item.seriesName === '装载率' ? '%' : ''}</div></div>\`
					})
					return params[0].axisValue + result
				}
			},
			// legend: {
			// 	bottom: '20%',
			// 	itemWidth: 8,
			// 	itemHeight: 8,
			// 	selectedMode: false
			// },
			xAxis: [
				{
					type: 'category',
					data: xAxisData,
					axisTick: {
						alignWithLabel: true,
						show: false
					},
					axisLine: {
						show: false
					},
					axisLabel: {
						color: '#999999',
						fontSize: 11,
						interval: 'auto',
						formatter: dateType === 'WEEK' ? '{value}W' : '{value}'
					}
				}
			],
			yAxis: [
				{
					type: 'value',
					// name: 'T',
					min: 0,
					splitLine: {
						show: true,
						lineStyle: {
							opacity: 0.3,
							color: '#D8D8D8'
						}
					},
					axisLine: {
						show: false
					},
					axisTick: {
						show: false
					},
					splitArea: {
						show: false
					},
					axisLabel: {
						fontSize: 12,
						color: '#999999',
						// formatter: '{value}T'
					}
				}, {
					type: 'value',
					show: false,
					name: '%',
					min: 0,
					max: 100,
					axisLabel: {
						fontSize: 12,
						color: '#999999'
					}
				}
			],
			dataZoom: [
				{
					show: false,
					realtime: true,
					startValue: start,
					endValue: end
				},
				{
					type: 'inside',
					realtime: true,
					startValue: start,
					endValue: end
				},
				{
					type: 'slider',
					xAxisIndex: 0,
					filterMode: 'none'
				}
			],
			series: [
				{
					name: '未发任务数',
					type: 'bar',
					stack: 'Line',
					emphasis: {
						focus: 'series'
					},
					barWidth: '40%',
					itemStyle: {
						color: '#ff0e0e'
					},
					label: {
						show: true,
						fontFamliy: pingFangFontFamily,
						fontSize: 10
					},
					data: unsentTasks
				},
				{
					name: '始发准点率',
					type: 'line',
					yAxisIndex: 1,
					lineStyle: {
						color: '#5087ec',
					},
					itemStyle: {
						color: '#5087ec'
					},
					label: {
						show: true,
						backgroundColor: {
							image: bgBottom
						},
						color: '#474747',
						fontFamliy: pingFangFontFamily,
						fontSize: 10,
						formatter(params: { data: number }) {
							const data = params.data
							return \`\${data.toFixed(1)}%\`
						},
					},
					data: onTimeDep
				}, {
					name: '装载率',
					type: 'line',
					yAxisIndex: 1,
					lineStyle: {
						color: '#68bbc4',
					},
					itemStyle: {
						color: '#68bbc4'
					},
					label: {
						show: true,
						backgroundColor: {
							image: bgBottom
						},
						color: '#474747',
						fontFamliy: pingFangFontFamily,
						fontSize: 10,
						formatter(params: { data: number }) {
							const data = params.data
							return \`\${data.toFixed(1)}%\`
						},
					},
					data: loadingRate
				}
			]
		}
	}

	render() {
		return <div className={styles.${titleCase(name)}}>{this.renderChart()}</div>
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
function writeChartTSFile(dirpath, name) {
    const str = getCodeString(name)
    // 创建JS文件
    fs.writeFile(dirpath, str, function (err) {
        if (err) {
            return console.error(err)
        }
        console.log(color.green('JS: write file surrcss!'))
    })
}

const getCodeIndexString = function (name) {
    return `import * as React from 'react'
import _ from 'lodash'
import moment from 'moment'
import { formatWeekDay } from 'scripts/utils'
import BarChart from './barChart'
import { Tabs } from 'antd-mobile'
interface I${titleCase(name)}Props {
	chartData: any
	selectDate?: string | number
	dateType?: string
	routerData?: any // 柱状图数据
	pageType?: string
	dataCreatedTime?: string
	changeDate?: (type: string, date: string) => void
}
interface I${titleCase(name)}State {
	selectTab: string // 所选tab
	selectDate: string | number
}

class ${titleCase(name)} extends React.Component<I${titleCase(name)}Props, I${titleCase(name)}State> {
	state: I${titleCase(name)}State = {
		selectTab: this.props.dateType,
		selectDate: this.props.selectDate,
	}

	componentDidMount() { }

	// 查询详情数据
	_getSerachRouterDetail = (type: string, data: any) => {
		const { changeDate } = this.props
		this.setState({
			selectDate: data.date
		})
		changeDate && changeDate(type, data)
	}

	render() {
		const { selectDate, dateType, chartData, dataCreatedTime } = this.props
		const { selectTab } = this.state
		const currentData = chartData[selectTab]
		const isCurrentData = currentData && currentData.length > 0
		return <div>
			<Tabs
				activeKey={selectTab}
				className="wzsCommonSmallTabs"
				onChange={(key) => {
					this.setState({ selectTab: key })
				}}
			>
				<Tabs.TabPane key="DAY" title={'日趋势'}></Tabs.TabPane>
				<Tabs.TabPane key="WEEK" title={'周趋势'}></Tabs.TabPane>
				<Tabs.TabPane key="MONTH" title={'月趋势'}></Tabs.TabPane>
			</Tabs>
			{
				isCurrentData ? <BarChart
					key={selectTab}
					dateType={selectTab}
					barData={chartData[selectTab]}
					selectDate={selectDate}
					onSearchRouterDetail={this._getSerachRouterDetail}
				/> : <div className='wzsNoData'>暂无数据</div>
			}

			{/* 所选时间 */}
			{
				isCurrentData ? < div className='wzsSelectDate'>
					{dateType === 'DAY' && selectDate ? (
						<div>
							{moment(selectDate).format('YYYY-MM-DD')}
							<span className='selectWeek'>
								({formatWeekDay(selectDate)})
							</span>
						</div>
					) : null}
					{dateType === 'WEEK' && selectDate ? (
						<div>
							{\`\${selectDate}W\`}
							<span className='selectWeek'>{\`(\${moment(selectDate.replace(/-/, 'W')).format('MM.DD')} ~ \${moment(
								(selectDate + '7').replace(/-/, 'W')
							).format('MM.DD')})\`}</span>
						</div>
					) : null}
					{dateType === 'MONTH'
						? selectDate && moment(selectDate).format('YYYY-MM')
						: null}
				</div> : null
			}

			{/* 系统更新时间 */}
			{
				isCurrentData && dataCreatedTime ? <div className='wzsUpdateTime' style={{ marginTop: 10 }}>
					更新时间：{dataCreatedTime}
				</div> : null
			}
		</div >
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
 function writeBarIndexTSFile(dirpath, name) {
    const str = getCodeIndexString(name)
    // 创建JS文件
    fs.writeFile(dirpath, str, function (err) {
        if (err) {
            return console.error(err)
        }
        console.log(color.green('JS: write file surrcss!'))
    })
}

module.exports = { writeChartTSFile, writeBarIndexTSFile }