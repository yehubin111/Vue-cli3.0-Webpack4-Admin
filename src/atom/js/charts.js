export default {
    // 创建推广计划 出价指南
    bidGuide(x, data) {
        return {
            tooltip: {
                trigger: 'axis',
                formatter: function (params) {
                    var res = '<p style="color: #fff;">价位：$' + params[0].name + '</p>';
                    res += '<p style="color: #fff;">' + params[0].seriesName + '：' + (params[0].seriesName == 'CPI' || params[0].seriesName == '花费'?'$':'') + params[0].data + '</p>';
                    return res;
                },
                textStyle: {
                    color: '#fff'
                }
                // axisPointer: {
                //     type: 'cross',
                //     crossStyle: {
                //         color: '#999'
                //     },
                //     label: {
                //         show: false
                //         // formatter: v => {
                //         //     console.log(v);
                //         // }
                //     }
                // }
            },
            legend: {
                // data: x,
                // align: 'left'
                bottom: '0',
                show: false
            },
            xAxis: {
                type: 'category',
                data: x,
                axisTick: {
                    show: false
                },
                axisLabel: {
                    show: false
                },
                axisPointer: {
                    // show: false,
                    type: 'shadow'
                }
            },
            grid: {
                left: '20px',
                right: '20px',
                top: '25px',
                bottom: '33px'
            },
            yAxis: {
                type: 'value',
                name: '',
                splitLine: {
                    show: false
                },
                axisLine: {
                    show: false
                },
                axisTick: {
                    show: false
                },
                axisLabel: {
                    show: false
                }
                // min: 0,
                // max: y1max,
                // interval: y1step
            },
            color: ['#409eff', '#94a6e7', '#b3cef9', '#dbe4ff', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3'],
            series: data
        }
    },
    // 规则报表 触发柱状图
    triggerCharts(x, data, y1max, y1step, y2max, y2step) {
        return {
            tooltip: {
                trigger: 'axis',
                formatter: '{b0}<br/>{a0}: {c0}<br/>{a1}: {c1}%',
                axisPointer: {
                    type: 'cross',
                    crossStyle: {
                        color: '#999'
                    },
                    label: {
                        show: false
                        // formatter: v => {
                        //     console.log(v);
                        // }
                    }
                }
            },
            legend: {
                // data: x,
                // align: 'left'
                bottom: '0'
            },
            xAxis: {
                type: 'category',
                data: x,
                axisPointer: {
                    type: 'shadow'
                }
            },
            yAxis: [{
                type: 'value',
                name: '规则触发数',
                min: 0,
                max: y1max,
                interval: y1step
            },
            {
                type: 'value',
                name: '触发广告占比',
                min: 0,
                max: y2max,
                interval: y2step,
                axisLabel: {
                    formatter: v => {
                        return `${v.toFixed(3)}%`
                    }
                }
            }
            ],
            color: ['#3758d3', '#94a6e7', '#b3cef9', '#dbe4ff', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3'],
            series: data
        }
    },
    // 规则报表头部饼图
    regularPie(x, data, title) {
        return {
            title: {
                show: false,
                textStyle: {
                    // align: 'center',
                    fontSize: 14
                },

                left: '70px'
            },
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b}: {c} ({d}%)"
            },
            legend: {
                // orient: 'vertical',
                // x: 'right',
                // y: 'bottom',
                // right: '10px',
                top: '260px',
                itemWidth: 10,
                itemHeight: 10,
                formatter: function (name) {
                    return name.length > 12 ? name.substr(0, 11) + "..." : name;
                },
                data: x // ['直接访问','邮件营销','联盟广告','视频广告','搜索引擎']
            },
            grid: {
                left: '0px',
                top: 0
            },
            color: ['#3758d3', '#617bdc', '#94a6e7', '#b3cef9', '#dbe4ff', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3'],
            series: [
                {
                    name: title,
                    type: 'pie',
                    center: ['50%', '135'],
                    radius: [0, '90%'],
                    // avoidLabelOverlap: false,
                    label: {
                        normal: {
                            show: false,
                            position: 'center'
                        },
                        // emphasis: {
                        //     show: true,
                        //     textStyle: {
                        //         fontSize: '30',
                        //         fontWeight: 'bold'
                        //     }
                        // }
                    },
                    labelLine: {
                        normal: {
                            show: false
                        }
                    },
                    data: data
                    // [
                    //     {value:335, name:'直接访问'},
                    //     {value:310, name:'邮件营销'},
                    //     {value:234, name:'联盟广告'},
                    //     {value:135, name:'视频广告'},
                    //     {value:1548, name:'搜索引擎'}
                    // ]
                }
            ]
        }
    },
    // atom 底部图
    pie(x, data, title) {
        return {
            title: {
                // text: '各APP安装比例',
                show: false,
                textStyle: {
                    // align: 'center',
                    fontSize: 14
                },

                left: '70px'
            },
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b}: {c} ({d}%)"
            },
            legend: {
                orient: 'vertical',
                // x: 'right',
                // y: 'bottom',
                right: '10px',
                bottom: '10px',
                itemWidth: 10,
                itemHeight: 10,
                formatter: function (name) {
                    return name.length > 12 ? name.substr(0, 11) + "..." : name;
                },
                data: x // ['直接访问','邮件营销','联盟广告','视频广告','搜索引擎']
            },
            grid: {
                left: '0px',
                top: 0
            },
            color: ['#3758d3', '#617bdc', '#94a6e7', '#b3cef9', '#dbe4ff', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3'],
            series: [
                {
                    name: title,
                    type: 'pie',
                    center: ['35%', '50%'],
                    radius: [0, '90%'],
                    // avoidLabelOverlap: false,
                    label: {
                        normal: {
                            show: false,
                            position: 'center'
                        },
                        // emphasis: {
                        //     show: true,
                        //     textStyle: {
                        //         fontSize: '30',
                        //         fontWeight: 'bold'
                        //     }
                        // }
                    },
                    labelLine: {
                        normal: {
                            show: false
                        }
                    },
                    data: data
                    // [
                    //     {value:335, name:'直接访问'},
                    //     {value:310, name:'邮件营销'},
                    //     {value:234, name:'联盟广告'},
                    //     {value:135, name:'视频广告'},
                    //     {value:1548, name:'搜索引擎'}
                    // ]
                }
            ]
        }
    },
    appChart(x, data) {
        return {
            title: {
                text: ''
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                // data:['安装','花费','CPI'],
                bottom: 0
            },
            grid: {
                left: '3%',
                right: '4%',
                top: '40px',
                bottom: '40px',
                containLabel: true
            },
            toolbox: {
                show: false,
                feature: {
                    saveAsImage: {}
                }
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: x
            },
            yAxis: {
                type: 'value'
            },
            color: ['#1796eb', '#01c857', '#f44446'],
            series: data
        }
    }
}