export default {
    // atom 底部图
    pie1() {
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
                data:['直接访问','邮件营销','联盟广告','视频广告','搜索引擎']
            },
            grid: {
                left: '0px',
                top: 0
            },
            color: ['#3758d3','#617bdc', '#94a6e7', '#b3cef9', '#dbe4ff','#749f83',  '#ca8622', '#bda29a','#6e7074', '#546570', '#c4ccd3'],
            series: [
                {
                    name:'访问来源',
                    type:'pie',
                    center : ['35%', '50%'],
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
                    data:[
                        {value:335, name:'直接访问'},
                        {value:310, name:'邮件营销'},
                        {value:234, name:'联盟广告'},
                        {value:135, name:'视频广告'},
                        {value:1548, name:'搜索引擎'}
                    ]
                }
            ]
        }
    },
    appChart: {
        title: {
            text: ''
        },
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data:['安装','花费','CPI'],
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
            data: ['周一','周二','周三','周四','周五','周六','周日']
        },
        yAxis: {
            type: 'value'
        },
        color: ['#1796eb', '#01c857', '#f44446'],
        series: [
            {
                name:'安装',
                type:'line',
                smooth: true,
                stack: '总量',
                data:[120, 132, 101, 134, 90, 230, 210]
            },
            {
                name:'花费',
                type:'line',
                smooth: true,
                stack: '总量',
                data:[220, 182, 191, 234, 290, 330, 310]
            },
            {
                name:'CPI',
                type:'line',
                smooth: true,
                stack: '总量',
                data:[150, 232, 201, 154, 190, 330, 410]
            }
        ]
    }
}