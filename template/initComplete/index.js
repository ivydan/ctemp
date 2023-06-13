const path = require('path')
const fs = require('fs')
const color = require('colors-cli/safe')
const { titleCase } = require('../../utils/index')


const getIndexCodeString = function (name) {
    return `import * as React from "react";
import { Button, Spin } from "antd";
import { Selector } from "antd-mobile";
import _ from "lodash";
import { DownOutlined, UpOutlined } from "@ant-design/icons";
import { QuestionCircleFill } from "antd-mobile-icons";
import { post } from "remotes";
import ReqAddress from "remotes/ReqAddress";
import { landingQuery } from "scripts/utils/query";
import { getApiErrorMessageDialog } from "scripts/components/commons/InitMessageDisplay";
import { renderFormatChartDate } from "scripts/components/commons/commonFun";
import { buriedPointMenu } from "scripts/utils/BuriedPoint";
import StatisticsInfoBtn from "scripts/components/StatisticsInfoBtn";
import StatisticsDescription from "./StatisticsDescription";
import RouterHub from "../routerHub";
import BarChart from "./barChart";
import GroupTable from "./groupTable";
import CompanyTable from "./companyTable";
import styles from "./index.module.less";

interface I${titleCase(name)}Props {}
interface I${titleCase(name)}State {
    selectDate: string | number; // 所选日期

    srcCompanyIdList: any; // 始发分公司集合
    srcHubCodeList: any; // 始发分拨集合
    destHubCodeList: any; // 目的分拨集合

    chartData: any; // 趋势数据存储
    chartLoading: boolean; // 数据加载

    manageType: any; // 网点经营类型
    groupData: any; // 汇总统计
    companyData: any; // 门店明细
    companyLoading: boolean;

    // 页面控制
    fold: boolean;
}

const defaultSrcHubCodeList = landingQuery.srcHubCodeList?.split(",");
class ${titleCase(name)} extends React.Component<I${titleCase(name)}Props, I${titleCase(name)}State> {
    state: I${titleCase(name)}State = {
    selectDate: null,
    chartData: null,
    chartLoading: false,
    fold: false,
    srcCompanyIdList: [],
    srcHubCodeList: defaultSrcHubCodeList || [],
    destHubCodeList: [],
    manageType: [""],
    groupData: null,
    companyData: null,
    companyLoading: false,
    };

    statisticsDescription: any;

    componentDidMount() {
    // 请从首页菜单item接口，获取埋点ID
    buriedPointMenu(0);

    // 获取组织类型
    this.getFetchData();
    }

    // 更新固定查询区域高度
    setFixedHeight = () => {
    const { fold } = this.state;
    const wzsFlodTop = document.getElementById("wzsFlodTop");
    const wzsCommonFlod = document.getElementById("wzsCommonFlod");
    if (fold) {
        wzsCommonFlod.style.height = "52px";
    } else {
        wzsCommonFlod.style.height = wzsFlodTop.offsetHeight + "px";
    }
    };

    getParams(getParams: any = {}) {
    const { manageType, srcCompanyIdList, srcHubCodeList, destHubCodeList } =
        this.state;

    let newParams = {
        areaIdList: srcHubCodeList,
        manageType: manageType[0],
        ...getParams,
    };

    return newParams;
    }

    // 获取图表数据
    getFetchData = async () => {
    let error: any;
    this.setState({ chartLoading: true, chartData: null });

    const getParams = this.getParams();

    let res = await post(ReqAddress.wholeAging.trend, {
        ...getParams,
    }).catch((e) => {
        error = e;
        return null;
    });

    if (error) {
        getApiErrorMessageDialog(error);
        this.setState(
        {
            chartLoading: false,
            chartData: null,
            groupData: null,
        },
        this.setFixedHeight
        );
        return false;
    }

    let { voList } = res || {};
    const { selectDate } = this.state;

    voList = [
        {
        date: "2014-09-01",
        sendNum: 99,
        dispNum: 88,
        dayGrowth: 99,
        },
        {
        date: "2018-12-09",
        sendNum: 10,
        dispNum: 72,
        dayGrowth: 72,
        },
        {
        date: "2017-09-08",
        sendNum: 74,
        dispNum: 26,
        dayGrowth: 53,
        },
        {
        date: "1991-03-27",
        sendNum: 71,
        dispNum: 70,
        dayGrowth: 15,
        },
        {
        date: "1991-09-18",
        sendNum: 2,
        dispNum: 21,
        dayGrowth: 17,
        },
        {
        date: "2004-05-24",
        sendNum: 67,
        dispNum: 29,
        dayGrowth: 7,
        },
        {
        date: "1971-01-13",
        sendNum: 67,
        dispNum: 78,
        dayGrowth: 96,
        },
        {
        date: "2013-08-27",
        sendNum: 96,
        dispNum: 81,
        dayGrowth: 61,
        },
        {
        date: "1982-02-02",
        sendNum: 31,
        dispNum: 30,
        dayGrowth: 99,
        },
        {
        date: "2004-07-08",
        sendNum: 53,
        dispNum: 22,
        dayGrowth: 88,
        },
    ];

    let stateData: any = {
        chartLoading: false,
        // chartData: _.isEmpty(voList) ? null : voList,
        chartData: voList,
    };

    // 赋值默认所选时间
    if (!selectDate) {
        stateData.selectDate = voList[voList.length - 1]?.date;
    }

    this.setState(stateData, () => {
        this.getDetailFetchData();
        this.setFixedHeight();
    });
    };

    getDetailFetchData() {
    this.getDetailGroupData();
    this.getCompanyGroupData();
    }

    // 获取详情数据
    getDetailGroupData = async () => {
    const { selectDate } = this.state;
    if (!selectDate) {
        return false;
    }
    this.setState({
        chartLoading: true,
        groupData: null,
    });
    const getParams = this.getParams({ date: selectDate });
    let res = await post(ReqAddress.wholeAging.detail, {
        ...getParams,
    });

    const { voList } = res || {};
    this.setState({
        chartLoading: false,
        groupData: [
        {
            groupName: "一集团",
            siteNum: 2091,
            siteMonthGrowth: 1037,
            shopNum: 507,
            shopMonthGrowth: 201,
            sendNum: 811,
            dispNum: 296,
        },
        {
            groupName: "二集团",
            siteNum: 3186,
            siteMonthGrowth: 1056,
            shopNum: 8,
            shopMonthGrowth: 225,
            sendNum: 696,
            dispNum: 84,
        },
        {
            groupName: "三集团",
            siteNum: 6737,
            siteMonthGrowth: -466,
            shopNum: 611,
            shopMonthGrowth: 491,
            sendNum: 1016,
            dispNum: 78,
        },
        {
            groupName: "四集团",
            siteNum: 41,
            siteMonthGrowth: 1017,
            shopNum: 886,
            shopMonthGrowth: 670,
            sendNum: 1040,
            dispNum: 606,
        },
        ],
    });
    };

    // 获取详情数据
    getCompanyGroupData = async () => {
    const { selectDate } = this.state;
    if (!selectDate) {
        return false;
    }
    this.setState({
        companyLoading: true,
        companyData: null,
    });
    const getParams = this.getParams({ date: selectDate });
    let res = await post(ReqAddress.wholeAging.detail, {
        ...getParams,
    });

    const { voList } = res || {};
    this.setState({
        companyLoading: false,
        companyData: {
        data1: [
            {
            companyName: "一集团",
            areaName: "泉州北",
            siteNum: 2091,
            siteMonthGrowth: 1037,
            shopNum: 507,
            shopMonthGrowth: 201,
            sendNum: 811,
            dispNum: 296,
            },
            {
            companyName: "二集团",
            areaName: "泉州北",
            siteNum: 3186,
            siteMonthGrowth: 1056,
            shopNum: 8,
            shopMonthGrowth: 225,
            sendNum: 696,
            dispNum: 84,
            },
            {
            companyName: "三集团",
            areaName: "泉州北",
            siteNum: 6737,
            siteMonthGrowth: -466,
            shopNum: 611,
            shopMonthGrowth: 491,
            sendNum: 1016,
            dispNum: 78,
            },
            {
            companyName: "四集团",
            areaName: "泉州北",
            siteNum: 41,
            siteMonthGrowth: 1017,
            shopNum: 886,
            shopMonthGrowth: 670,
            sendNum: 1040,
            dispNum: 606,
            },
        ],
        data2: [
            {
            companyName: "一集团",
            siteNum: 2091,
            siteMonthGrowth: 1037,
            shopNum: 507,
            shopMonthGrowth: 201,
            sendNum: 811,
            dispNum: 296,
            },
            {
            companyName: "二集团",
            siteNum: 3186,
            siteMonthGrowth: 1056,
            shopNum: 8,
            shopMonthGrowth: 225,
            sendNum: 696,
            dispNum: 84,
            },
            {
            companyName: "三集团",
            siteNum: 6737,
            siteMonthGrowth: -466,
            shopNum: 611,
            shopMonthGrowth: 491,
            sendNum: 1016,
            dispNum: 78,
            },
            {
            companyName: "四集团",
            siteNum: 41,
            siteMonthGrowth: 1017,
            shopNum: 886,
            shopMonthGrowth: 670,
            sendNum: 1040,
            dispNum: 606,
            },
        ],
        data3: [
            {
            companyName: "一集团",
            siteNum: 2091,
            siteMonthGrowth: 1037,
            shopNum: 507,
            shopMonthGrowth: 201,
            sendNum: 811,
            dispNum: 296,
            },
            {
            companyName: "二集团",
            siteNum: 3186,
            siteMonthGrowth: 1056,
            shopNum: 8,
            shopMonthGrowth: 225,
            sendNum: 696,
            dispNum: 84,
            },
            {
            companyName: "三集团",
            siteNum: 6737,
            siteMonthGrowth: -466,
            shopNum: 611,
            shopMonthGrowth: 491,
            sendNum: 1016,
            dispNum: 78,
            },
            {
            companyName: "四集团",
            siteNum: 41,
            siteMonthGrowth: 1017,
            shopNum: 886,
            shopMonthGrowth: 670,
            sendNum: 1040,
            dispNum: 606,
            },
        ],
        data4: [
            {
            companyName: "一集团",
            siteNum: 2091,
            siteMonthGrowth: 1037,
            shopNum: 507,
            shopMonthGrowth: 201,
            sendNum: 811,
            dispNum: 296,
            },
            {
            companyName: "二集团",
            siteNum: 3186,
            siteMonthGrowth: 1056,
            shopNum: 8,
            shopMonthGrowth: 225,
            sendNum: 696,
            dispNum: 84,
            },
            {
            companyName: "三集团",
            siteNum: 6737,
            siteMonthGrowth: -466,
            shopNum: 611,
            shopMonthGrowth: 491,
            sendNum: 1016,
            dispNum: 78,
            },
            {
            companyName: "四集团",
            siteNum: 41,
            siteMonthGrowth: 1017,
            shopNum: 886,
            shopMonthGrowth: 670,
            sendNum: 1040,
            dispNum: 606,
            },
        ],
        },
    });
    };

    //分拨查询
    getSearchData = (start: any, end: any) => {
    console.log(start, end);
    };
    //分拨修改
    onRouterChange = () => {
    setTimeout(() => {
        this.setFixedHeight();
    }, 200);
    };

    _renderSelector() {
    const { state } = this;
    const { fold, manageType } = state;
    const foldStyle = !fold
        ? { top: 0 }
        : { top: 48 - document.getElementById("wzsFlodTop").offsetHeight };
    return (
        <div className="wzsCommonFlod" id="wzsCommonFlod" style={{ height: 52 }}>
        <div className="wzsFlodTop" id="wzsFlodTop" style={foldStyle}>
            <RouterHub
            onSearch={this.getSearchData}
            onChange={this.onRouterChange}
            pageType="sendHub"
            pageValue="siteActive"
            />

            <div className="wzsFlodBottom">
            <div className="wzsSelectorBlock">
                <Selector
                value={manageType}
                defaultValue={manageType}
                options={[
                    { value: "", label: "全部" },
                    { value: "JOIN", label: "加盟" },
                    { value: "DIRECT", label: "直营" },
                ]}
                onChange={(v) =>
                    v.length &&
                    this.setState({ manageType: v }, this.getFetchData)
                }
                />
            </div>
            <Button
                shape="round"
                className="wzsFlodButton"
                onClick={() =>
                this.setState({ fold: !fold }, this.setFixedHeight)
                }
                type="primary"
                size="small"
                icon={fold ? <DownOutlined /> : <UpOutlined />}
            >
                {fold ? "展开" : "收起"}
            </Button>
            </div>
        </div>
        </div>
    );
    }

    render() {
    const {
        chartData,
        chartLoading,
        groupData,
        selectDate,
        companyData,
        companyLoading,
    } = this.state;
    return (
        <div className={styles.${titleCase(name)}}>
        <Spin spinning={chartLoading}>
            {/* 顶部固定 */}
            {this._renderSelector()}

            {/* 门店活跃度趋势 */}
            <div className={styles.vehicleOnTime}>
            <div className="wzsFlagFlex">
                门店活跃度趋势
                <span
                className="wzsFlagIcon"
                onClick={() => this.statisticsDescription.show("vehicleOnTime")}
                >
                <QuestionCircleFill color="#006AFF" fontSize={18} />
                </span>
            </div>
            {chartData ? (
                <BarChart
                barData={chartData}
                dateType="DAY"
                selectDate={selectDate}
                onSearchRouterDetail={(data: any) =>
                    this.setState(
                    { selectDate: data.date, groupData: null },
                    this.getDetailFetchData
                    )
                }
                />
            ) : (
                <div className="wzsNoData">暂无数据</div>
            )}
            {renderFormatChartDate("DAY", selectDate)}
            </div>

            {/* 门店汇总统计 */}
            <div className={styles.vehicleOnTime}>
            <div className="wzsFlagFlex">
                门店汇总统计
                <span
                className="wzsFlagIcon"
                onClick={() => this.statisticsDescription.show("vehicleOnTime")}
                >
                <QuestionCircleFill color="#006AFF" fontSize={18} />
                </span>
            </div>
            {groupData ? (
                <GroupTable dataSource={groupData} />
            ) : (
                <div className="wzsNoData">暂无数据</div>
            )}
            </div>

            {/* 门店明细 */}
            <div className={styles.vehicleOnTime}>
            <div className="wzsFlagFlex">
                门店明细
                <span
                className="wzsFlagIcon"
                onClick={() => this.statisticsDescription.show("vehicleOnTime")}
                >
                <QuestionCircleFill color="#006AFF" fontSize={18} />
                </span>
            </div>
            {companyData ? (
                <CompanyTable dataSource={companyData} loading={companyLoading} />
            ) : (
                <div className="wzsNoData">暂无数据</div>
            )}
            </div>
        </Spin>
        {/* 统计说明 */}
        <div style={{ margin: "20px auto" }}>
            <StatisticsInfoBtn
            onClick={() => this.statisticsDescription.show()}
            />
            <StatisticsDescription
            ref={(ref) => (this.statisticsDescription = ref)}
            />
        </div>
        </div>
    );
    }
}
export default ${titleCase(name)};
`
}

/**
 * @description: 创建TS模版文件
 * @param dirpath: 路径
 * @param name: 名称
 * @return {*}
 */
function writeIAIndexTSFile(dirpath, name) {
    const str = getIndexCodeString(name)
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
    .agingVolume,
    .vehicleOnTime {
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
    .groupTable {
        margin-top: 20px;
        .growthFlex {
        padding-left: 10px;
        display: flex;
        justify-content: end;
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
    return `import * as React from "react";
import CustomerDialog from "scripts/components/CustomerDialog";

interface IStatisticsDescriptionProps {
    onOperate?: (key: string) => void;
}
interface IStatisticsDescriptionState {
    show: boolean;
    type: string;
    title: string;
}
class StatisticsDescription extends React.Component<
    IStatisticsDescriptionProps,
    IStatisticsDescriptionState
> {
    state: IStatisticsDescriptionState = {
    show: false,
    type: "",
    title: "统计说明",
    };
    render() {
    const { show, title } = this.state;
    return (
        <div>
        <CustomerDialog
            onClose={() => this.setState({ show: false })}
            customerTitle={title}
            visible={show}
            actions={[]}
            content={this.renderContent()}
        />
        </div>
    );
    }
    renderContent = () => {
    const { type } = this.state;
    if (type === "agingVolume") {
        return (
        <div className="wzsPerWrap">
            <div className="boldStyle">数据范围</div>
            <div className="defaultStyle">{}</div>
            <div className="boldStyle">字段逻辑</div>
            <div className="defaultStyle">{}</div>
        </div>
        );
    }
    if (type === "arriveRateDetail") {
        return (
        <div className="wzsPerWrap">
            <div className="boldStyle">数据范围</div>
            <div className="defaultStyle">{}</div>
            <div className="boldStyle">字段逻辑</div>
            <div className="defaultStyle">{}</div>
        </div>
        );
    }
    return (
        <div className="wzsPerWrap">
        <div className="boldStyle">数据范围</div>
        <div className="defaultStyle">{}</div>
        <div className="boldStyle">字段逻辑</div>
        <div className="defaultStyle">{}</div>
        </div>
    );
    };
    show = (type: string = "") => {
    let title = "统计说明";
    switch (type) {
        case "agingVolume":
        title = "时效达成货量";
        break;
        case "arriveRateDetail":
        title = "达成率明细";
        break;
        default:
        break;
    }

    this.setState({ show: true, type, title });
    };
}
export default StatisticsDescription;`
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

const getChartString = function(name){
    return `/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import * as React from "react";
import moment from "moment";
import EChartsComponent5 from "scripts/components/commons/components/ECharts5";
import _ from "lodash";
import styles from "./index.module.less";
import { getD8ZDay } from "scripts/utils/date";

interface IBarChartProps {
    barData: any;
    dateType: string;
    onSearchRouterDetail: (date: string) => void;
    selectDate?: string | number;
}
interface IBarChartState {
    selectDate: any;
    options: any;
    zoom: number;
}

const pingFangFontFamily =
    "PingFang SC,PingFangSC-Regular, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif";

const selectTextStyle = {
    color: "#fff",
    backgroundColor: "#006AFF",
    borderRadius: 3,
};

class BarChart extends React.Component<IBarChartProps, IBarChartState> {
    state: IBarChartState = {
    selectDate: this.props.selectDate || null,
    options: null,
    zoom: 0,
    };

    echartsRef: any;

    componentDidMount() {
    this.setState({
        options: this.getOptions(),
    });
    }

    handleChartColumnsSelect = (index: number, echartsCurrent: any) => {
    if (!echartsCurrent) return false;

    // 更新当前所选日期
    const { barData, dateType } = this.props;
    let formatStr = this.getFormatStr();

    let xAxisData: any[] = [];
    barData.forEach((element: any, elementIndex: number) => {
        xAxisData.push({
        value:
            dateType === "WEEK"
            ? element.date
            : moment(element.date).format(formatStr),
        textStyle: index === elementIndex ? selectTextStyle : {},
        });
    });
    if (index >= 0) {
        echartsCurrent.dispatchAction({
        type: "select",
        seriesIndex: [0, 1],
        dataIndex: index,
        __byTrendCharts__: true,
        });

        this.echartsRef.echarts.setOption({ xAxis: { data: xAxisData } });
    }
    };

    renderChart() {
    const { options } = this.state;

    if (!options) return <div className="wzsNoData">暂无数据</div>;

    let chartProps: any = {};

    chartProps.ref = (ref: any) => {
        return (this.echartsRef = ref);
    };
    chartProps.onZRClick = (e: any) => {
        // 获取echart对象
        const echartsCurrent = this.echartsRef.echarts;
        // 获取偏移量
        const pointInPixel = [e.offsetX, e.offsetY];
        // 使用 convertFromPixel方法 转换像素坐标值到逻辑坐标系上的点。获取点击位置对应的x轴数据的索引		 值，借助于索引值的获取到其它的信息
        const pointInGrid = echartsCurrent.convertFromPixel(
        { seriesIndex: 0 },
        pointInPixel
        );
        // 获取点击事假对应数据坐标
        const index = pointInGrid[0];
        const { barData } = this.props;
        // 点击表格头和尾的位置 不做处理，防止增加错误数据导致增加空坐标柱的bug
        if (index > barData.length - 1 || index < 0) {
        return false;
        }
        // 更新x轴日子所选中UI样式
        this.handleChartColumnsSelect(index, echartsCurrent);
        // 更新数据
        this.props.onSearchRouterDetail(barData[index]);
    };
    chartProps.onUnSelect = (e: any) => {
        if (e.__byTrendCharts__) {
        console.log("ignore");
        return;
        }
        const echartsCurrent = this.echartsRef.echarts;
        echartsCurrent.dispatchAction({
        type: "select",
        seriesIndex: [0, 1],
        dataIndex: e.dataIndexInside,
        __byTrendCharts__: true,
        });
    };

    return (
        <>
        <div style={{ width: "100%", overflow: "hidden", height: 266 }}>
            <div
            style={{
                width: document.body.clientWidth,
                position: "absolute",
                left: "50%",
                transform: "translate(-50%, 0)",
            }}
            >
            <EChartsComponent5 height={250} option={options} {...chartProps} />
            </div>
        </div>
        </>
    );
    }

    getFormatStr() {
    const { dateType } = this.props;
    let formatStr = "";
    switch (dateType) {
        case "DAY":
        formatStr = "MM-DD";
        break;
        case "WEEK":
        formatStr = "YYYY-WW";
        break;
        case "MONTH":
        formatStr = "YYYY-MM";
        break;
        default:
        break;
    }
    return formatStr;
    }

    getOptions() {
    const { barData, dateType } = this.props;
    const { selectDate } = this.state;
    if (!barData) return null;

    let xAxisData: any[] = [];
    let sendNum: number[] = []; // 未发任务数
    let dispNum: number[] = [];
    let dayGrowth: number[] = [];

    let formatStr = this.getFormatStr();

    barData.forEach((element: any) => {
        xAxisData.push({
        value: getD8ZDay(element.date).format(formatStr),
        textStyle:
            selectDate && selectDate === element.date ? selectTextStyle : {},
        });
        sendNum.push(element.sendNum || 0);
        dispNum.push(element.dispNum || 0);
        dayGrowth.push(element.dayGrowth || 0);
    });

    let splitNumber = 8;

    if (dateType === "WEEK") {
        splitNumber = 5;
    }

    if (dateType === "MONTH") {
        splitNumber = 4;
    }

    const startIndex = barData.length - splitNumber;
    let start = startIndex < 0 ? 0 : startIndex;
    const endIndex = barData.length - 1;
    let end = endIndex < 0 ? 0 : endIndex;

    return {
        backgroundColor: "#fff",
        grid: {
        top: "15%",
        left: "5%",
        bottom: "24%",
        right: "5%",
        containLabel: true,
        },
        tooltip: {
        trigger: "axis",
        axisPointer: {
            type: "shadow",
        },
        textStyle: {
            fontSize: 11,
        },
        },
        xAxis: [
        {
            type: "category",
            data: xAxisData,
            axisTick: {
            alignWithLabel: true,
            show: false,
            },
            axisLine: {
            show: false,
            },
            axisLabel: {
            color: "#999999",
            fontSize: 11,
            interval: "auto",
            formatter: dateType === "WEEK" ? "{value}W" : "{value}",
            },
        },
        ],
        yAxis: [
        {
            type: "value",
            min: 0,
            splitLine: {
            show: true,
            lineStyle: {
                opacity: 0.3,
                color: "#D8D8D8",
            },
            },
            axisLine: {
            show: false,
            },
            axisTick: {
            show: false,
            },
            splitArea: {
            show: false,
            },
            axisLabel: {
            fontSize: 12,
            color: "#999999",
            // formatter: '{value}T'
            },
        },
        {
            type: "value",
            show: false,
            splitLine: {
            show: true,
            lineStyle: {
                opacity: 0.3,
                color: "#D8D8D8",
            },
            },
            axisLabel: {
            fontSize: 12,
            color: "#999999",
            },
        },
        ],
        dataZoom: [
        {
            show: false,
            realtime: true,
            startValue: start,
            endValue: end,
        },
        {
            type: "inside",
            realtime: true,
            startValue: start,
            endValue: end,
        },
        {
            type: "slider",
            xAxisIndex: 0,
            filterMode: "none",
        },
        ],
        series: [
        {
            name: "寄件活跃",
            type: "bar",
            //   stack: "Line",
            emphasis: {
            focus: "series",
            },
            barWidth: "30%",
            itemStyle: {
            color: "#0F3674",
            },
            label: {
            show: true,
            fontFamliy: pingFangFontFamily,
            fontSize: 10,
            },
            data: sendNum,
        },
        {
            name: "派件活跃",
            type: "bar",
            //   stack: "Line",
            emphasis: {
            focus: "series",
            },
            barWidth: "30%",
            itemStyle: {
            color: "#75A0ED",
            },
            label: {
            show: true,
            fontFamliy: pingFangFontFamily,
            fontSize: 10,
            },
            data: dispNum,
        },
        {
            name: "当日门店净增长",
            type: "line",
            yAxisIndex: 1,
            lineStyle: {
            color: "#5389EC",
            },
            itemStyle: {
            color: "#5389EC",
            },
            label: {
            show: true,
            color: "#474747",
            fontFamliy: pingFangFontFamily,
            fontSize: 10,
            },
            data: dayGrowth,
        },
        ],
    };
    }
`
}

/**
 * @description: 创建Chart TS模版文件
 * @param dirpath: 路径
 * @param name: 名称
 * @return {*}
 */
function writeIAChartTSFile(dirpath, name) {
    const str = getChartString(name)
    // 创建JS文件
    fs.writeFile(dirpath, str, function (err) {
        if (err) {
            return console.error(err)
        }
        console.log(color.green('JS: write file surrcss!'))
    })
}

const getTableString = function(name){
    return `import { Table } from "antd";
import * as React from "react";
import classNames from "classnames";
import { ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons";
import { formatNumber } from "scripts/components/commons/numberFormat";
import { getRowClassName } from "scripts/utils";
import styles from "./index.module.less";

interface IGroupTableProps {
    dataSource: any;
}
interface IGroupTableState {}

class GroupTable extends React.Component<IGroupTableProps, IGroupTableState> {
    state: IGroupTableState = {};

    componentDidMount() {}

    renderArrow(v: number) {
    if (v > 0) {
        return <ArrowUpOutlined style={{ color: "red" }} />;
    }
    if (v < 0) {
        return <ArrowDownOutlined style={{ color: "green" }} />;
    }
    return null;
    }

    renderGrowth(v: number) {
    return (
        <div className={styles.growthFlex}>
        <span
            className={classNames({
            wzsRed: v > 0,
            wzsGreen: v < 0,
            })}
        >
            {formatNumber(v)}
        </span>
        <span>{this.renderArrow(v)}</span>
        </div>
    );
    }

    getColumns() {
    const columns: any = [
        {
        title: <></>,
        dataIndex: "groupName",
        align: "left",
        width: 25,
        },
        {
        title: "网点数",
        dataIndex: "siteNum",
        align: "right",
        width: 25,
        render: (v: number) => formatNumber(v),
        },
        {
        title: <>当月净增</>,
        dataIndex: "siteMonthGrowth",
        align: "right",
        width: 30,
        render: (v: number) => this.renderGrowth(v),
        },
        {
        title: <>门店数</>,
        dataIndex: "shopNum",
        align: "right",
        width: 25,
        render: (v: number) => formatNumber(v),
        },
        {
        title: <>当月净增</>,
        dataIndex: "shopMonthGrowth",
        align: "right",
        width: 30,
        render: (v: number) => this.renderGrowth(v),
        },
        {
        title: (
            <>
            寄件活
            <br />
            跃门店
            </>
        ),
        dataIndex: "sendNum",
        align: "right",
        width: 30,
        render: (v: number) => formatNumber(v),
        },
        {
        title: (
            <>
            派件活
            <br />
            跃门店
            </>
        ),
        dataIndex: "dispNum",
        align: "right",
        width: 30,
        render: (v: number) => formatNumber(v),
        },
    ];

    return columns;
    }

    render() {
    const { dataSource } = this.props;
    return (
        <div className={styles.groupTable}>
        <Table
            columns={this.getColumns()}
            rowKey="rank"
            className="wzsCommonTable hasProgress"
            dataSource={dataSource || []}
            pagination={false}
            showHeader={true}
            style={{ width: document.body.clientWidth }}
            scroll={{ x: 440, y: 260 }}
            rowClassName={getRowClassName}
            sticky
            summary={(pageData: any) => {
            let siteNumTotal = 0;
            let siteMonthGrowthTotal = 0;
            let shopNumTotal = 0;
            let shopMonthGrowthTotal = 0;
            let sendNumTotal = 0;
            let dispNumTotal = 0;
            pageData.forEach(
                ({
                siteNum,
                siteMonthGrowth,
                shopNum,
                shopMonthGrowth,
                sendNum,
                dispNum,
                }: any) => {
                siteNumTotal += siteNum;
                siteMonthGrowthTotal += siteMonthGrowth;
                shopNumTotal += shopNum;
                shopMonthGrowthTotal += shopMonthGrowth;
                sendNumTotal += sendNum;
                dispNumTotal += dispNum;
                }
            );
            return (
                <Table.Summary>
                <Table.Summary.Row>
                    <Table.Summary.Cell index={0}>全网</Table.Summary.Cell>
                    <Table.Summary.Cell index={1} align="right">
                    {formatNumber(siteNumTotal)}
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={2} align="right">
                    {this.renderGrowth(siteMonthGrowthTotal)}
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={3} align="right">
                    {formatNumber(shopNumTotal)}
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={4} align="right">
                    {this.renderGrowth(shopMonthGrowthTotal)}
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={5} align="right">
                    {formatNumber(sendNumTotal)}
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={6} align="right">
                    {formatNumber(dispNumTotal)}
                    </Table.Summary.Cell>
                </Table.Summary.Row>
                </Table.Summary>
            );
            }}
        />
        </div>
    );
    }
}
export default GroupTable;`
}

/**
 * @description: 创建带有汇总行的table TS模版文件
 * @param dirpath: 路径
 * @param name: 名称
 * @return {*}
 */
function writeIATableTSFile(dirpath, name) {
    const str = getTableString(name)
    // 创建JS文件
    fs.writeFile(dirpath, str, function (err) {
        if (err) {
            return console.error(err)
        }
        console.log(color.green('JS: write file surrcss!'))
    })
}

const getTableTabsString = function(){
    return `import { Table } from "antd";
import { Tabs } from "antd-mobile";
import * as React from "react";
import { formatNumber } from "scripts/components/commons/numberFormat";
import { getRowClassName } from "scripts/utils";
import styles from "./index.module.less";

interface ICompanyTableProps {
    dataSource: any;
    loading: boolean;
}
interface ICompanyTableState {
    selectInfo: any;
    rankType: string;
}

class CompanyTable extends React.Component<
    ICompanyTableProps,
    ICompanyTableState
> {
    state: ICompanyTableState = {
    selectInfo: {},
    rankType: "data1",
    };

    componentDidMount() {}

    getColumns() {
    const columns: any = [
        {
        title: <>分公司</>,
        dataIndex: "companyName",
        align: "left",
        width: 34,
        },
        {
        title: "片区",
        dataIndex: "areaName",
        align: "right",
        width: 30,
        },
        {
        title: <>网点数</>,
        dataIndex: "siteNum",
        align: "right",
        width: 30,
        sorter: (a: any, b: any) => a.siteNum - b.siteNum,
        showSorterTooltip: false,
        render: (v: number) => formatNumber(v),
        },
        {
        title: <>门店数</>,
        dataIndex: "shopNum",
        align: "right",
        width: 30,
        sorter: (a: any, b: any) => (a.shopNum || 0) - (b.shopNum || 0),
        showSorterTooltip: false,
        render: (v: number) => formatNumber(v),
        },
        {
        title: (
            <>
            寄件活
            <br />
            跃门店
            </>
        ),
        dataIndex: "sendNum",
        align: "right",
        width: 30,
        sorter: (a: any, b: any) => (a.sendNum || 0) - (b.sendNum || 0),
        showSorterTooltip: false,
        render: (v: number) => formatNumber(v),
        },
        {
        title: (
            <>
            当日寄
            <br />
            件门店
            </>
        ),
        dataIndex: "todaySendNum",
        align: "right",
        width: 30,
        sorter: (a: any, b: any) =>
            (a.todaySendNum || 0) - (b.todaySendNum || 0),
        showSorterTooltip: false,
        render: (v: number) => formatNumber(v),
        },
        {
        title: (
            <>
            当月累计
            <br />
            出货门点
            </>
        ),
        dataIndex: "monthSendNum",
        align: "right",
        width: 35,
        sorter: (a: any, b: any) =>
            (a.monthSendNum || 0) - (b.monthSendNum || 0),
        showSorterTooltip: false,
        render: (v: number) => formatNumber(v),
        },
        {
        title: (
            <>
            派件活
            <br />
            跃门店
            </>
        ),
        dataIndex: "dispNum",
        align: "right",
        width: 30,
        sorter: (a: any, b: any) => (a.dispNum || 0) - (b.dispNum || 0),
        showSorterTooltip: false,
        render: (v: number) => formatNumber(v),
        },
        {
        title: (
            <>
            当日派
            <br />
            件门店
            </>
        ),
        dataIndex: "todayDispNum",
        align: "right",
        width: 30,
        sorter: (a: any, b: any) =>
            (a.todayDispNum || 0) - (b.todayDispNum || 0),
        showSorterTooltip: false,
        render: (v: number) => formatNumber(v),
        },
        {
        title: (
            <>
            当月累计
            <br />
            派件门店
            </>
        ),
        dataIndex: "monthDispNum",
        align: "right",
        width: 35,
        sorter: (a: any, b: any) =>
            (a.monthDispNum || 0) - (b.monthDispNum || 0),
        showSorterTooltip: false,
        render: (v: number) => formatNumber(v),
        },
    ];

    return columns;
    }

    render() {
    const { rankType } = this.state;
    const { dataSource, loading } = this.props;
    return (
        <div className={styles.CompanyTable}>
        <Tabs
            className="wzsCommonSmallTabs"
            activeKey={rankType}
            onChange={(v: string) => {
            this.setState({ rankType: v });
            }}
        >
            <Tabs.TabPane key="data1" title={"第一集团"}></Tabs.TabPane>
            <Tabs.TabPane key="data2" title={"第二集团"}></Tabs.TabPane>
            <Tabs.TabPane key="data3" title={"第三集团"}></Tabs.TabPane>
            <Tabs.TabPane key="data4" title={"第四集团"}></Tabs.TabPane>
        </Tabs>
        <Table
            columns={this.getColumns()}
            rowKey="rank"
            loading={loading}
            className="wzsCommonTable hasProgress"
            dataSource={dataSource[rankType] || []}
            pagination={false}
            showHeader={true}
            style={{ width: document.body.clientWidth }}
            scroll={{ x: 720, y: 260 }}
            rowClassName={getRowClassName}
        />
        </div>
    );
    }
}
export default CompanyTable;`
}

/**
 * @description: 创建带有汇总行的table and Tab TS模版文件
 * @param dirpath: 路径
 * @param name: 名称
 * @return {*}
 */
function writeIATableTabsTSFile(dirpath, name) {
    const str = getTableTabsString(name)
    // 创建JS文件
    fs.writeFile(dirpath, str, function (err) {
        if (err) {
            return console.error(err)
        }
        console.log(color.green('JS: write file surrcss!'))
    })
}

module.exports = { writeIATableTabsTSFile, writeIAIndexTSFile, writeIALessFile, writeIASratisticsTSFile, writeIAChartTSFile, writeIATableTSFile }