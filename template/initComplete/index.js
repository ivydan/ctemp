const path = require('path')
const fs = require('fs')
const color = require('colors-cli/safe')

const titleCase = function(str) {
	newStr = str.slice(0, 1).toUpperCase() + str.slice(1).toLowerCase();
	return newStr;
}

const getCodeString = function (name) {
	return `import * as React from 'react'
    import { Button, Spin } from 'antd'
    import { PullToRefresh, Selector, Tabs } from 'antd-mobile'
    import { QuestionCircleFill } from 'antd-mobile-icons'
    import { DownOutlined, UpOutlined } from '@ant-design/icons'
    import { get, post } from 'remotes'
    import ReqAddress from 'remotes/ReqAddress'
    import { landingQuery } from 'scripts/utils/query'
    import { getApiErrorMessageDialog } from 'scripts/components/commons/InitMessageDisplay'
    import { buriedPointMenu } from 'scripts/utils/BuriedPoint'
    import RouterOrgDrawer from 'scripts/components/RouterOrgDrawer'
    import RouterHubDrawer from 'scripts/components/RouterHubDrawer'
    import StatisticsInfoBtn from 'scripts/components/StatisticsInfoBtn'
    import StatisticsDescription from './StatisticsDescription'
    import VehicleOnTime from './vehicleOnTime'
    import ArriveRateDetail from './arriveRateDetail'
    import styles from './index.module.less'
    
    interface I${titleCase(name)}Props {
    }
    interface I${titleCase(name)}State {
        dateType: string                // 当前日期类型
        selectDate: string | number     // 所选日期
    
        srcCompanyIdList: any           // 始发分公司集合
        srcHubCodeList: any             // 始发分拨集合
        destHubCodeList: any            // 目的分拨集合
    
        chartData: any                  // 趋势数据存储
        chartLoading: boolean           // 数据加载
        shiftType: any                  // 时效
    
        hasIntraProvince: any           // 吨票类型
        arriveRateData: any             // 达成率数据存储
    
        hubList: any[]
        hubHubList: any[]
    
        // 页面控制
        fold: boolean
        srcDestType: string             // tab类型
        currOrgType: string             // 获取用户组织
    }
    
    const defaultSrcHubCodeList = landingQuery.srcHubCodeList?.split(',')
    class ${titleCase(name)} extends React.Component<I${titleCase(name)}Props, I${titleCase(name)}State> {
        state: I${titleCase(name)}State = {
            dateType: landingQuery.dateType || 'DAY',
            srcDestType: 'SRC_COMPANY',
            selectDate: landingQuery.selectDate || '',
            chartData: null,
            chartLoading: false,
            fold: false,
            shiftType: landingQuery.shiftType ? [landingQuery.shiftType] : ['AGING'],
            srcCompanyIdList: [],
            srcHubCodeList: defaultSrcHubCodeList || [],
            destHubCodeList: [],
            hasIntraProvince: landingQuery.hasIntraProvince ? [landingQuery.hasIntraProvince] : ['PROVINCE_OUT'],
            arriveRateData: null,
            currOrgType: '',
            hubList: [],
            hubHubList: []
        }
    
        statisticsDescription: any
    
        componentDidMount() {
            // 请从首页菜单item接口，获取埋点ID
            buriedPointMenu(0)
    
            // 获取组织类型
            this.getOrgType()
    
            // 初始化分拨选项
            this.initHubList()
        }
    
        initHubList() {
            const {
                srcHubCodeList,
                srcHubNameList,
                srcDestType
            } = landingQuery
            const srcHubCodes = srcHubCodeList ? srcHubCodeList.split(',') : []
            const srcHubNames = srcHubNameList ? srcHubNameList.split(',') : []
            let tempList = srcHubCodes.map((code, index) => {
                const obj: any = {}
                obj.hubCode = code
                obj.hubName = srcHubNames[index]
                obj.title = srcHubNames[index]
                obj.key = code
                return obj
            })
            if (srcDestType === 'SRC_HUB') {
                this.setState({
                    hubList: tempList
                })
            } else if (srcDestType === 'HUB_TO_HUB') {
                this.setState({
                    hubHubList: tempList
                })
            }
        }
    
        // 更新固定查询区域高度
        setFixedHeight = () => {
            const { fold } = this.state
            const wzsFlodTop = document.getElementById('wzsFlodTop')
            const wzsCommonFlod = document.getElementById('wzsCommonFlod')
            if (fold) {
                wzsCommonFlod.style.height = ‘80px’
            } else {
                wzsCommonFlod.style.height = wzsFlodTop.offsetHeight + 'px'
            }
        }
    
        // 获取用户组织类型
        getOrgType = async () => {
            let error: any;
            let res = await get(ReqAddress.loadAndUnload.currentOrgType, {}).catch(e => {
                error = e;
                return null;
            });
    
            if (res) {
                if (res.success) {
                    const currOrgType = res.vo.currOrgType
                    const { srcDestType } = this.state
                    this.setState({
                        currOrgType: res.vo.currOrgType,
                        srcDestType: landingQuery.srcDestType || (currOrgType !== 'BEST' ? 'SRC_HUB' : srcDestType)
                    }, this.getAllFetchData);
                } else {
                    error = res;
                }
            }
        }
    
        getAllFetchData() {
            const { dateType } = this.state
            const dateTypes = ['DAY', 'WEEK', 'MONTH']
            let defaultDateType = 'DAY'
            let otherDateTypes = ['WEEK', 'MONTH']
            if (dateType && dateTypes.includes(dateType)) {
                defaultDateType = dateType
                otherDateTypes = dateTypes.filter((v: string) => v !== defaultDateType)
            }
            this.getFetchData(defaultDateType, true)
            setTimeout(() => {
                otherDateTypes.forEach((dateType) => {
                    this.getFetchData(dateType)
                })
            }, 3000)
        }
    
        getParams(params: any) {
            const { dateType, hasIntraProvince, srcDestType, shiftType, srcCompanyIdList, srcHubCodeList, destHubCodeList } = this.state
    
            let newParams = {
                dateType,
                srcDestType,
                hasIntraProvince: hasIntraProvince[0],
                shiftType: shiftType[0],
                ...params,
            }
    
            if (srcDestType === 'SRC_COMPANY') {
                newParams.srcCompanyIdList = srcCompanyIdList
            }
            if (srcDestType === 'SRC_HUB') {
                newParams.srcHubCodeList = srcHubCodeList
            }
            if (srcDestType === 'HUB_TO_HUB') {
                newParams.srcHubCodeList = srcHubCodeList
                newParams.destHubCodeList = destHubCodeList
            }
    
            return newParams
        }
    
        // 获取图表数据
        getFetchData = async (dateType: string, isDefault?: boolean) => {
            let error: any
            if (isDefault) this.setState({ chartLoading: true, dateType, chartData: null })
    
            const getParams = this.getParams({ dateType })
    
            let res = await post(ReqAddress.wholeAging.trend, {
                ...getParams
            }).catch(e => {
                error = e
                return null
            })
    
            if (error && isDefault) {
                getApiErrorMessageDialog(error)
                this.setState({
                    chartLoading: false,
                    chartData: null,
                    arriveRateData: null
                }, this.setFixedHeight)
                return false
            }
    
            const { voList } = res || {}
            const { chartData, chartLoading, selectDate } = this.state
    
            let stateData: any = {
                chartLoading: isDefault ? false : chartLoading,
                chartData: {
                    ...chartData,
                    [dateType]: voList
                }
            }
    
            // 赋值默认所选时间
            if (!selectDate && isDefault) {
                stateData.selectDate = voList[voList.length - 2]?.date
            }
    
            this.setState(stateData, () => {
                if (isDefault) {
                    this.getDetailFetchData()
                    this.setFixedHeight()
                }
            })
        }
    
        // 获取详情数据
        getDetailFetchData = async () => {
            let error: any
            const { selectDate } = this.state
            if (!selectDate) {
                return false
            }
            this.setState({
                chartLoading: true,
                arriveRateData: null
            })
            const getParams = this.getParams({ date: selectDate })
            let res = await post(ReqAddress.wholeAging.detail, {
                ...getParams
            }).catch(e => {
                error = e
                return null
            })
    
            if (error) {
                getApiErrorMessageDialog(error)
                this.setState({
                    chartLoading: false,
                    arriveRateData: null
                }, this.setFixedHeight)
                return false
            }
    
            const { voList } = res || {}
            //aaaa回头去掉
            voList.map(list=>{
                return list.children = null
            })
            this.setState({
                chartLoading: false,
                arriveRateData: voList
            })
        }
    
        _renderSelector() {
            const { state } = this
            const { currOrgType, srcDestType, hubList, hubHubList, fold, hasIntraProvince, shiftType } = state
            const foldStyle = !fold
                ? { top: 0 }
                : { top: 82 - document.getElementById('wzsFlodTop').offsetHeight }
            return <div className='wzsCommonFlod' id='wzsCommonFlod' style={{ height: 221 }}>
                <div className='wzsFlodTop' id='wzsFlodTop' style={foldStyle}>
                    <Tabs className="wzsTabs" activeKey={srcDestType} onChange={(v: string) => {
                        // 禁止点击当前tab页
                        if (v === srcDestType) {
                            return false
                        }
                        let newStata: any = {
                            srcDestType: v,
                            dateType: "DAY",
                            selectDate: null,
                            srcCompanyIdList: [],
                            srcHubCodeList: [],
                            hubList: [],
                            hubHubList: [],
                            destHubCodeList: []
                        }
    
                        if (v === 'HUB_TO_HUB') {
                            newStata.chartData = null
                            newStata.arriveRateData = null
                        }
                        this.setState(newStata, () => {
                            setTimeout(() => {
                                this.setFixedHeight()
                            }, 10)
                            if (v === 'SRC_HUB' || v === 'SRC_COMPANY') {
                                this.getAllFetchData()
                            }
                        })
                    }}>
                        {currOrgType === 'BEST' ? <Tabs.TabPane key="SRC_COMPANY" title={'始发分公司'}>
                            <RouterOrgDrawer
                                onSearch={(start: any) => {
                                    const srcCompanyIdList = start
                                        .map((item: any) => item.companyId)
                                        .filter((v: string) => v)
                                    this.setState({
                                        srcCompanyIdList
                                    }, this.getAllFetchData)
                                }}
                            />
                        </Tabs.TabPane> : null}
                        <Tabs.TabPane key="SRC_HUB" title={'始发分拨'}>
                            <RouterHubDrawer
                                key='SRC_HUB_TAB'
                                hideEnd={true}
                                initList={hubList}
                                needStart={false}
                                onSearch={(start: any) => {
                                    const srcHubCodeList = start
                                        .map((item: any) => item.hubCode)
                                        .filter((v: string) => v)
                                    this.setState({
                                        srcHubCodeList
                                    }, this.getAllFetchData)
                                }}
                            />
                        </Tabs.TabPane>
                        <Tabs.TabPane key="HUB_TO_HUB" title={'发车-目的'}>
                            <RouterHubDrawer
                                key='HUB_TO_HUB_TAB'
                                needStart={true}
                                startText='发'
                                endText='到'
                                initList={hubHubList}
                                onSearch={(start: any, end: any) => {
                                    const srcHubCodeList = start
                                        .map((item: any) => item.hubCode)
                                        .filter((v: string) => v)
                                    const destHubCodeList = end
                                        .map((item: any) => item.hubCode)
                                        .filter((v: string) => v)
                                    this.setState({
                                        srcHubCodeList,
                                        destHubCodeList
                                    }, this.getAllFetchData)
                                }}
                            />
                        </Tabs.TabPane>
                    </Tabs>
                    <div className={styles.selectFlex}>
                        <div className='wzsSelectorBlock'>
                            <Selector
                                value={hasIntraProvince}
                                defaultValue={hasIntraProvince}
                                options={[
                                    { value: 'PROVINCE_OUT', label: '省际' },
                                    { value: 'PROVINCE_IN', label: '省内' },
                                    { value: 'ALL', label: '全部' },
                                ]}
                                onChange={(v) => this.setState({ hasIntraProvince: v }, this.getAllFetchData)}
                            />
                        </div>
                        <div className='wzsSelectorBlock'>
                            <Selector
                                value={shiftType}
                                defaultValue={shiftType}
                                options={[
                                    { value: 'AGING', label: '时效' },
                                    { value: 'JAMES', label: 'James' },
                                    { value: 'ALL', label: '全部' },
                                ]}
                                onChange={(v) => this.setState({ shiftType: v }, this.getAllFetchData)}
                            />
                        </div>
                    </div>
    
                    <div className='wzsFlodBottom'>
                        <span></span>
                        <Button
                            shape="round"
                            className='wzsFlodButton'
                            onClick={() => this.setState({ fold: !fold }, this.setFixedHeight)}
                            type="primary"
                            size="small"
                            icon={fold ? <DownOutlined /> : <UpOutlined />}
                        >
                            {fold ? '展开' : '收起'}
                        </Button>
                    </div>
                </div>
            </div>
        }
    
        render() {
            const { dateType, chartData, selectDate, chartLoading, arriveRateData, srcDestType } = this.state
            return <div className={styles.${titleCase(name)}}>
                {/* 下拉刷新 */}
                <PullToRefresh
                    onRefresh={this.getAllFetchData}
                >
                    <Spin spinning={chartLoading}>
                        {/* 顶部固定 */}
                        {this._renderSelector()}
    
                        {/* 时效达成货量 */}
                        <div className={styles.vehicleOnTime}>
                            <div className='wzsFlagFlex'>班车准点率
                                <span className='wzsFlagIcon' onClick={() => this.statisticsDescription.show('vehicleOnTime')}>
                                    <QuestionCircleFill color='#006AFF' fontSize={18} />
                                </span>
                            </div>
                            {
                                chartData ? <VehicleOnTime
                                    chartData={chartData}
                                    dateType={dateType}
                                    selectDate={selectDate}
                                    changeDate={(type, data: any) => this.setState({ dateType: type, selectDate: data.date }, this.getDetailFetchData)}
                                /> : <div className='wzsNoData'>暂无数据</div>
                            }
                        </div>
    
                        {/* 达成率明细 */}
                        <div className={styles.arriveRateDetail}>
                            <div className='wzsFlagFlex'>
                                达成率明细
                                <span className='wzsFlagIcon' onClick={() => this.statisticsDescription.show('arriveRateDetail')}>
                                    <QuestionCircleFill color='#006AFF' fontSize={18} />
                                </span>
                            </div>
                            {
                                arriveRateData ? <ArriveRateDetail srcDestType={srcDestType} dataSource={arriveRateData} /> : <div className='wzsNoData'>暂无数据</div>
                            }
                        </div>
                    </Spin>
                </PullToRefresh>
                {/* 统计说明 */}
                <div style={{ margin: '20px auto' }}>
                    <StatisticsInfoBtn onClick={() => this.statisticsDescription.show()} />
                    <StatisticsDescription ref={ref => (this.statisticsDescription = ref)} />
                </div>
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
function writeIAIndexTSFile(dirpath, name) {
	const str = getCodeString(name)
	// 创建JS文件
	fs.writeFile(dirpath, str, function (err) {
		if (err) {
			return console.error(err)
		}
		console.log(color.green('JS: write file surrcss!'))
	})
}

const getLessString = function (name) {
	return `.${titleCase(name)}{
        padding: 0;
        .agingVolume{
            padding: 20px;
        }
        .arriveRateDetail {
            padding: 20px;
    
            .selectFlex {
                display: flex;
                justify-content: space-between;
                align-items: center;
                .switchContent {
                    line-height: 30px;
                }
            }
    
            
        }
}`
}

/**
 * @description: 创建LESS模版文件
 * @param dirpath: 路径
 * @param name: 名称
 * @return {*}
 */
function writeIALessFile(dirpath, name) {
	const str = getLessString(name)
	// 创建JS文件
	fs.writeFile(dirpath, str, function (err) {
		if (err) {
			return console.error(err)
		}
		console.log(color.green('LESS: write file surrcss!'))
	})
}


const getStaString = function (name) {
	return `import * as React from 'react'
    import CustomerDialog from 'scripts/components/CustomerDialog'
    
    interface IStatisticsDescriptionProps {
        onOperate?: (key: string) => void;
    }
    interface IStatisticsDescriptionState {
        show: boolean;
        type: string;
        title: string;
    }
    class StatisticsDescription extends React.Component<IStatisticsDescriptionProps, IStatisticsDescriptionState>{
        state: IStatisticsDescriptionState = {
            show: false,
            type: '',
            title: '统计说明'
        }
        render() {
            const { show, title } = this.state
            return (
                <div >
                    <CustomerDialog
                        onClose={() => this.setState({ show: false })}
                        customerTitle={title}
                        visible={show}
                        actions={[]}
                        content={this.renderContent()}
                    />
                </div>
            )
        }
        renderContent = () => {
            const { type } = this.state
            if (type === 'agingVolume') {
                return <div className='wzsPerWrap'>
                    <div className='boldStyle'>数据范围</div>
                    <div className='defaultStyle'>
                        {}
                    </div>
                    <div className='boldStyle'>字段逻辑</div>
                    <div className='defaultStyle'>
                        {}
                    </div>
                </div>
            }
            if (type === 'arriveRateDetail') {
                return <div className='wzsPerWrap'>
                    <div className='boldStyle'>数据范围</div>
                    <div className='defaultStyle'>
                        {}
                    </div>
                    <div className='boldStyle'>字段逻辑</div>
                    <div className='defaultStyle'>
                        {}
                    </div>
                </div>
            }
            return (
                <div className='wzsPerWrap'>
                    <div className='boldStyle'>数据范围</div>
                    <div className='defaultStyle'>
                        {}
                    </div>
                    <div className='boldStyle'>字段逻辑</div>
                    <div className='defaultStyle'>
                        {}
                    </div>
                </div>
            )
        }
        show = (type: string = '') => {
            let title = '统计说明'
            switch (type) {
                case 'agingVolume':
                    title = '时效达成货量'
                    break;
                case 'arriveRateDetail':
                    title = '达成率明细'
                    break;
                default:
                    break;
            }
    
            this.setState({ show: true, type, title })
        }
    }
    export default StatisticsDescription`
}

/**
 * @description: 创建TS模版文件
 * @param dirpath: 路径
 * @param name: 名称
 * @return {*}
 */
function writeIASratisticsTSFile(dirpath, name) {
	const str = getStaString(name)
	// 创建JS文件
	fs.writeFile(dirpath, str, function (err) {
		if (err) {
			return console.error(err)
		}
		console.log(color.green('JS: write file surrcss!'))
	})
}




module.exports = { writeIAIndexTSFile, writeIALessFile, writeIASratisticsTSFile }