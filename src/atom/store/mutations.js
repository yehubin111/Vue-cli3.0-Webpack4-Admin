import chart from '../js/charts'
import cm from '../js/common'
import { Msgsuccess, MsgnotifySuccess, MsgnotifyWarning } from '../js/message'
import Vue from 'vue'

export default {
    /***************************** common */
    SENDPERMISSION(state, r) {
        console.log(r);
        switch (r) {
            case 'granted':
                let notification = new Notification('我是推送君', {
                    body: '我是文本君',
                    icon: 'https://avatars3.githubusercontent.com/u/43479428?v=4'
                })

                notification.onclick = function () {
                    console.log('推送君已关闭');
                    notification.close();
                }
                break;
            case 'denied':
                break;
            case 'default':
                break;
        }
    },
    ITEMLIST(state, r) {
        let list = r.data;
        state.itemlist = list;
    },
    PASSWORD(state, r) {
        let c = r.msg;

        Msgsuccess('密码修改成功, 请重新登录');
    },
    LOGOUT(state) {
        location.href = '/login.html';

        localStorage.removeItem('atom_token');
    },
    SETSTATE(state, { k, v }) {
        state[k] = v;
    },
    MESSAGECOUNT(state, r) {
        switch (true) {
            case (r.data != '99+' && Array.isArray(eval(r.data))):
                // 广告管理结果返回
                let result = eval(r.data);
                let successtask = result[0].success;
                let failtask = result[0].fail;
                let totaltask = result[0].completed;
                let taskname = result[0].taskName;
                let requestId = result[0].requestId;

                if (failtask == 0) {
                    // 成功
                    MsgnotifySuccess('成功', `${successtask}项${taskname}成功`);
                } else {
                    state.taskfail = failtask;
                    state.tasksuccess = successtask;
                    state.taskname = taskname;
                    // 至少有一项失败
                    MsgnotifyWarning('警告', `${failtask}项${taskname}失败，${successtask}项成功，<span style="color:#409eff;cursor:pointer;">点击查看详情</span>`, () => {
                        state.jobfailkey = requestId;
                        state.jobfaildetail = true;

                        state.taskfaildetail = failtask;
                        state.tasksuccessdetail = successtask;
                        state.tasknamedetail = taskname;
                    });
                }
                break;
            default:
                // 消息数量
                state.messagecount = r.data;
                break;
        }
    },
    VIDEOURL(state, { r, originurl }) {
        state.videoerrmsg = [];
        state.videoresult = [];
        let res = r.data;
        // console.log(originurl);

        for (let i = 0; i < originurl.length; i++) {
            if (originurl[i].trim() === '') {
                state.videoerrmsg.push({
                    result: '',
                    status: false
                });
                res.splice(i, 0, '');
                continue;
            }
            if (res[i].errMsg) {
                state.videoerrmsg.push({
                    result: res[i].errMsg,
                    status: false
                });
            } else {
                state.videoerrmsg.push({
                    result: res[i].url,
                    status: true
                });
                state.videoresult.push(res[i].url);
            }
        }
    },
    /***************************** index */
    APPCOUNT(state, r) {
        state.appcount = r.data ? r.data.length : 0;
    },
    // 信息初始化
    PAYCOUNT(state, r) {
        state.paycountlist = r.data;
        state.paycount = r.data.length;
    },
    INFO(state, r) {
        // APP list
        state.reportAppDataList = r.data.reportAppDataList;
        // 安装图
        state.appInstallsLists = r.data.appInstallsLists ? r.data.appInstallsLists : [];
        let ist = r.data.appInstallsLists ? r.data.appInstallsLists : [];
        let chart2 = [];
        let x2 = [];

        ist.forEach(v => {
            let obj = {};
            obj.name = v.appName;
            obj.value = v.installsNum;

            chart2.push(obj);
            x2.push(obj.name);
        });

        myChart2.setOption(chart.pie(x2, chart2, '各APP安装比例'));
        // 花费图
        state.appSpendDatasLists = r.data.appSpendDatasLists ? r.data.appSpendDatasLists : [];
        let spd = r.data.appSpendDatasLists ? r.data.appSpendDatasLists : [];
        let chart3 = [];
        let x3 = [];

        spd.forEach(v => {
            let obj = {};
            obj.name = v.appName;
            obj.value = v.spend;

            chart3.push(obj);
            x3.push(obj.name);
        });

        myChart3.setOption(chart.pie(x3, chart3, '各APP花费比例'));

        // 今日安装花费
        state.todayInstallsNum = r.data.todayInstallsNum;
        state.todaySpend = r.data.todaySpend;
    },
    // 单只app 信息
    APPINFO(state, r) {
        // app数据图
        let ist = r.data.pageInfoAll.list;
        let chartall = [], x = [], az = {
            name: '安装',
            type: 'line',
            smooth: true,
            stack: '',
            data: []
        }, hf = {
            name: '花费',
            type: 'line',
            smooth: true,
            stack: '',
            data: []
        }, cpi = {
            name: 'CPI',
            type: 'line',
            smooth: true,
            stack: '',
            data: []
        };

        ist.forEach(v => {
            let obj = {};
            obj.name = v.appName;
            obj.value = v.installsNum;

            az.data.push(v.installsNum);
            hf.data.push(v.spend);
            cpi.data.push(v.cpi);
            x.push(cm.timeFormat(v.insightDate, 'yyyy-MM-dd'));
        });

        chartall.push(az, hf, cpi);

        myChart.setOption(chart.appChart(x, chartall));
    },
    APPINFOTABLE(state, r) {
        // state.appdata = r.data.pageInfoAll.list;
        state.appdatatotal = r.data.pageInfoAll.total;
        state.countryfilter = r.data.countryList.length > 0 ? r.data.countryList : [''];

        /**
         * 20181101新增，把返回的事件相关数据取出到外层
         */
        r.data.pageInfoAll.list.forEach(v => {
            // v.afMinsRate = v.afInstallsNum && v.installsNum ? ((v.afInstallsNum - v.installsNum) * 100 / v.installsNum).toFixed(2) + '%' : '';
            // v.afRetentionRate = v.afRetentionRate ? v.afRetentionRate + '%' : '';
            v.afReRate1 = v.afReRate1 ? v.afReRate1 + '%' : '';
            v.afReRate2 = v.afReRate2 ? v.afReRate2 + '%' : '';
            v.afReRate3 = v.afReRate3 ? v.afReRate3 + '%' : '';
            v.afReRate4 = v.afReRate4 ? v.afReRate4 + '%' : '';
            v.afReRate5 = v.afReRate5 ? v.afReRate5 + '%' : '';
            v.afReRate6 = v.afReRate6 ? v.afReRate6 + '%' : '';
            v.afReRate7 = v.afReRate7 ? v.afReRate7 + '%' : '';
            v.appEventsList.forEach(g => {
                v[`${g.eventsName}|eventCounter`] = g.eventCounter;
                v[`${g.eventsName}|uniqueUsers`] = g.uniqueUsers;
                v[`${g.eventsName}|salesIn`] = g.salesIn;
            })
            // v.gap = v.gap < 0 ? (v.gap * 100).toFixed(2) : '+' + (v.gap * 100).toFixed(2)
        });


        state.appdata = r.data.pageInfoAll.list;
        // console.log(state.appdata);
    },
    APPINFOTABLETOTAL(state, r) {
        state.appcpitotal = r.data;
    },
    APPINFOTABLEOUT(state, { res, name }) {
        state.appdataall = res.data.pageInfoAll.list;
        state.appdataall.forEach(v => {
            v.appEventsList.forEach(g => {
                v[`${g.eventsName}|eventCounter`] = g.eventCounter;
                v[`${g.eventsName}|uniqueUsers`] = g.uniqueUsers;
                v[`${g.eventsName}|salesIn`] = g.salesIn;
            })
            v.gap = v.gap < 0 ? (v.gap * 100).toFixed(2) : '+' + (v.gap * 100).toFixed(2)
        });
        // state.appdataall
        let defaultOption = localStorage.getItem(pandectOptionLS.new) && JSON.parse(localStorage.getItem(pandectOptionLS.new))[state.appdataappid]
            ? JSON.parse(localStorage.getItem(pandectOptionLS.new))[state.appdataappid]
            : [
                { name: "触达", key: "reachNum", checked: true },
                { name: "展示", key: "showNum", checked: true },
                { name: "点击", key: "clicksNum", checked: true },
                { name: "CTR", key: "ctr", checked: true },
                { name: "CVR", key: "cvr", checked: true },
                { name: "CPM", key: "cpm", checked: true },
                { name: "CPC", key: "cpc", checked: true },
                { name: "安装", key: "installsNum", checked: true },
                { name: "花费", key: "spend", checked: true },
                { name: "CPI", key: "cpi", checked: true }
            ]

        let titlear = [
            { name: "日期", key: "insightDateFormat" },
            { name: "国家", key: "country" },
            { name: "平台", key: "userOs" },
            ...defaultOption
        ];
        let str = "<table><thead><tr>";
        titlear.forEach(v => {
            str += `<th>${v.name}</th>`;
        });
        str += "</tr></thead><tbody>";

        for (let i = 0; i < state.appdataall.length; i++) {
            str += "<tr>";
            titlear.forEach(v => {
                if (v.key == 'insightDateFormat') {
                    str += `<td>${cm.timeFormat(
                        state.appdataall[i]['insightDate'],
                        "yyyy-MM-dd"
                    )}</td>`;
                } else {
                    str += `<td>${state.appdataall[i][v.key] ? state.appdataall[i][v.key] : '--'}</td>`;
                }
            });
            str += "</tr>";
        }
        str += "</tbody></table>";

        cm.exportHTML("outOther", name, str);
    },
    CUSTOMEVENT(state, r) {
        state.customevent = [];
        state.customunit = r.data.eventsunit;

        r.data.eventsNameList.forEach(v => {
            let obj = {};
            obj.name = v;
            obj.checked1 = false;
            obj.checked2 = false;
            obj.checked3 = false;

            state.customevent.push(obj);
        })

        // console.log(state.customevent);

    },
    /***************************** bm */
    BMLIST(state, r) {
        let dt = r.data;
        state.bmlist = dt;
        state.getbmover = true;

        state.disbmid = state.bmlist[0].bmId;
    },
    ADDBMLIST(state, r) {
        let dt = r.data;
        state.addbmlist = dt;
    },
    SAVEBM(state, r) {
        state.bmlist = state.bmlist.concat(r);

        r.forEach((q) => {
            state.addbmlist = state.addbmlist.filter(v => v.id != q.bmId);
        });

    },
    SETACCOUNT(state, r) {
        state.disaccount = r.data.list;
        state.accounttotal = r.data.total;
    },
    ADDACCOUNT(state, r) {
        state.disaddaccount = r.data;
    },
    SAVEACCOUNT(state, r) {
        state.disaccount = state.disaccount.concat(r);
        state.addata[state.disbmid] = state.addata[state.disbmid].concat(r);

        r.forEach(q => {
            state.disaddaccount = state.disaddaccount.filter(v => v.account_id != q.fbAccountId);
            state.adaccount[state.disbmid] = state.adaccount[state.disbmid].filter(v => v.account_id != q.fbAccountId);
        })
    },
    SETPAGE(state, r) {
        state.dispage = r.data.list;

        state.pagetotal = r.data.total;
    },
    ADDPAGE(state, r) {
        state.disaddpage = r.data;

        state.disaddpage.forEach(v => {
            v.checked = false;
        })
    },
    SAVEPAGE(state, r) {
        state.dispage = state.dispage.concat(r);
        state.pagedata[state.disbmid] = state.pagedata[state.disbmid].concat(r);

        r.forEach(q => {
            state.disaddpage = state.disaddpage.filter(v => v.pageId != q.pageId);
            state.pageaccount[state.disbmid] = state.pageaccount[state.disbmid].filter(v => v.pageId != q.pageId);
        })
    },
    // app
    SETAPPLIST(state, r) {
        state.applist = r.data;
    },
    ADDAPP(state, r) {
        state.addapplist = r.data;
    },
    SETAPP(state, r) {
        state.setapplist = r.data;

        state.setapplist.forEach(v => {
            v.stateName = '已启用';
        });
    },
    CANSETAPP(state, r) {
        state.cansetapplist = r.data;
    },
    // manage
    MANAGELIST(state, r) {
        state.managelist = r.data.list;
        state.total = r.data.total;
        state.pagesize = r.data.pageSize;
    },
    MANAGEAPPLIST(state, r) {
        state.manageapplist = r.data;
    },
    // project rules
    RULES(state, r) {
        state.rulelist = r.data;
    },
    RULEACCOUNT(state, r) {
        let dt = r.data;
        dt.unshift({
            name: '不限',
            fbAccountId: '-1',
            fbId: '-1'
        });
        state.ruleapp = dt;
    },
    OPTIMIZEACCOUNT(state, r) {
        let dt = r.data;
        dt.unshift({
            fbAccountName: '不限',
            fbAccountId: '-1',
        });
        state.optimizeaccount = dt;
    },
    OPTIMIZELIST(state, r) {
        state.optotal = r.data.total;
        state.oppagesize = r.data.pageSize;
        state.optimizelist = r.data.list;
    },
    // create
    CREATE(state, r) {
        state.createlist = r.data.list;
        state.crtotal = r.data.total;
        state.crpagesize = r.data.pageSize;

        state.createchecked = [];

        state.createlist.forEach(v => {
            state.createchecked.push(false);

            if (v.imageUrl)
                v.img = eval('(' + v.imageUrl + ')').imageUrl;
            if (v.videoUrl)
                v.video = eval('(' + v.videoUrl + ')').videoUrl;
            if (v.card)
                v.card = eval('(' + v.card + ')');
        });
    },
    ALLSELECT(state) {
        let k = [];
        if (state.createchecked.filter(v => !v).length > 0) {
            state.createchecked.forEach(v => {
                k.push(true);
            });
        } else {
            state.createchecked.forEach(v => {
                k.push(false);
            });
        }
        state.createchecked = k.slice(0);
    },
    CLASSIFY(state, r) {
        state.classify = r.data;
        state.classify.unshift('不限');
    },
    COUNTRIES(state, r) {
        state.countries = r.data;
        state.countries.unshift('不限')

        // state.countries.forEach(v => {
        //     v.value = v.name;
        // })
    },
    ALLPAGES(state, r) {
        state.allpagelist = r.data;
    },
    ALLACTIONS(state, r) {
        r.data.forEach(v => {
            v.value = v.name;
        })

        state.allactions = r.data.filter(v => v.show);
    },
    SYNCTIME(state, r) {
        state.synctime = r.data < 60 ? `${r.data}秒` : `${parseInt(r.data / 60)}分${r.data % 60}秒`;
    },
    // sync
    SYNCLIST(state, r) {
        state.synclist = r.data.list ? r.data.list : [];
        state.synctotal = r.data.total;

        state.synclist.forEach(v => {
            v.img = eval('(' + v.imageUrl + ')').imageUrl;
        })
    },
    // gener
    OTHERCOUNTRIES(state, r) {
        state.othercountries = r.data;

        state.othercountries.forEach(v => {
            v.value = v.name;
        })
    },
    LANGUAGE(state, r) {
        state.language = r.data;
    },
    INTERESTS(state, r) {
        state.interests = r.data;
    },
    PLATFORM(state, r) {
        state.platform = r.data.applicationPlatforms;

        state.platform.unshift({
            marketType: '不限'
        });
    },
    CREATEPLATFORM(state, r) {
        state.createplatform = r.data.applicationPlatforms;
    },
    SYSTEM(state, r) {
        state.system = r.data;
    },
    SELECTCREATE(state, r) {
        let obj = state.createlist.find(v => v.id == r);
        state.createlist = state.createlist.filter(v => v.id != r);
        state.selectcreate.push(obj);
    },
    CANCELCREATE(state, r) {
        let obj = state.selectcreate.find(v => v.id == r);
        state.selectcreate = state.selectcreate.filter(v => v.id != r);
        state.createlist.push(obj);
    },
    PLANLIST(state, r) {
        state.planlist = r.data.list;
        state.pltotal = r.data.total;
        state.plpagesize = r.data.pageSize;
    },
    PLANCOUNTRY(state, r) {
        state.plancountry = r.data;
        state.plancountry.unshift({
            name: '不限',
            code: '不限'
        });
    },
    INUSECREATE(state, r) {
        state.inusecreate = r.data.list;
        state.inusetotal = r.data.total;

        state.inusecreate.forEach(v => {
            switch (v.creativityType) {
                case 0:
                    v.creativityTypeName = '单图片';
                    break;
                case 1:
                    v.creativityTypeName = '单视频';
                    break;
                case 2:
                    v.creativityTypeName = '轮播';
                    break;
            }

            if (v.imageUrl)
                v.img = eval('(' + v.imageUrl + ')').imageUrl;
            if (v.videoUrl)
                v.video = eval('(' + v.videoUrl + ')').videoUrl;
        });
    },
    NOUSECREATE(state, r) {
        state.nousecreate = r.data.list;
        state.nousetotal = r.data.total;

        state.nousecreate.forEach(v => {
            switch (v.creativityType) {
                case 0:
                    v.creativityTypeName = '单图片';
                    break;
                case 1:
                    v.creativityTypeName = '单视频';
                    break;
                case 2:
                    v.creativityTypeName = '轮播';
                    break;
            }

            if (v.imageUrl)
                v.img = eval('(' + v.imageUrl + ')').imageUrl;
            if (v.videoUrl)
                v.video = eval('(' + v.videoUrl + ')').videoUrl;
        });
    },
    ACCOUNTLIST(state, r) {
        state.inuseaccount = r.data.usedAdaccounts;
        state.nouseaccount = r.data.notUsedAdaccounts;
    },
    LOGLIST(state, r) {
        state.loglist = r.data.slice(0, 20);
    },
    LOGDETAIL(state, r) {
        state.logdetail = r.data;

        state.logdetail.forEach(v => {
            if (v.campaignDetail.createSuccess > 0 || v.campaignDetail.createFailed > 0) {
                // v.statusname = '创建成功';
                v.statuskey1 = true;
            } else {
                v.statuskey1 = false;
            }
            if (v.adsetDetail.createSuccess > 0 || v.adsetDetail.createFailed > 0) {
                // v.statusname = '等待创建';
                v.statuskey2 = true;
            } else {
                v.statuskey2 = false;
            }
            if (v.adDetail.createSuccess > 0 || v.adDetail.createFailed > 0) {
                // v.statusname = '创建失败';
                v.statuskey3 = true;
            } else {
                v.statuskey3 = false;
            }
        })
    },
    LOGCREATEFAIL(state) {
        state.ifadcreate = false;
    },
    LOGCREATE(state, { res, option }) {
        state.logdetailid = res.data.planCreateLogId
        state.logdetailname = option.campaignName;
    },
    CREARENUM(state, res) {
        state.logcreatecreative = res.data.creativeNum;
        state.logcreateaccount = res.data.adaccountNum;
        // state.logcreateset = res.data.adsetNum;
        state.logcreateset = res.data.onlyCampaignAdsetNum;
        state.logcreatecampaign = res.data.campaignNum;
    },
    CREATEINFO(state, r) {
        let included = r.data.includeAudiences ? JSON.parse(r.data.includeAudiences) : {};
        let excluded = r.data.excludedAudiences ? JSON.parse(r.data.excludedAudiences) : {};
        r.data.included = [];
        for (let i in included) {
            included[i].forEach(v => {
                r.data.included.push(`${v}|${i}`);
            })
        }
        r.data.excluded = [];
        for (let p in excluded) {
            excluded[p].forEach(v => {
                r.data.excluded.push(`${v}|${p}`);
            })
        }
        state.createinfo = r.data;
        state.disinfo.push(r.data);
    },
    RESETEDIT(state, r) {
        state.disinfo.splice(0);
    },
    GENERTARGET(state, r) {
        let data = r.data;
        state.genertarget = [];

        for (let i in data) {
            let obj = {};
            obj.label = i;
            obj.options = data[i];
            state.genertarget.push(obj);
        }
    },
    GENERACCOUNT(state, r) {
        state.generaccount = r.data.adaccounts;
    },
    BIDGUIDE(state, r) {
        // r = { "code": 0, "msg": "", "data": [{ "bidAmount": 16.0, "installs": 31, "spend": 231.27, "cpi": 7.46, "bidAmountStart": 13.0, "bidAmountEnd": 17.29 }, { "bidAmount": 20.0, "installs": 1965, "spend": 16215.77, "cpi": 8.25, "bidAmountStart": 17.3, "bidAmountEnd": 21.59 }, { "bidAmount": 25.0, "installs": 912, "spend": 9345.53, "cpi": 10.25, "bidAmountStart": 21.6, "bidAmountEnd": 25.89 }, { "bidAmount": 30.0, "installs": 3390, "spend": 36112.02, "cpi": 10.65, "bidAmountStart": 25.9, "bidAmountEnd": 30.19 }, { "bidAmount": 32.0, "installs": 181, "spend": 758.89, "cpi": 4.19, "bidAmountStart": 30.2, "bidAmountEnd": 34.49 }, { "bidAmount": 36.0, "installs": 5204, "spend": 41107.69, "cpi": 7.9, "bidAmountStart": 34.5, "bidAmountEnd": 38.79 }, { "bidAmount": 41.0, "installs": 166, "spend": 921.75, "cpi": 5.55, "bidAmountStart": 38.8, "bidAmountEnd": 43.09 }, { "bidAmount": 46.0, "installs": 11, "spend": 43.94, "cpi": 3.99, "bidAmountStart": 43.1, "bidAmountEnd": 47.39 }, { "bidAmount": 50.0, "installs": 3503, "spend": 23494.8, "cpi": 6.71, "bidAmountStart": 47.4, "bidAmountEnd": 51.69 }, { "bidAmount": 56.0, "installs": 302, "spend": 1450.1, "cpi": 4.8, "bidAmountStart": 51.7, "bidAmountEnd": 56.0 }] }
        state.bidguide = r.data;

        let x = [];
        let dt1 = [], dt2 = [], dt3 = [];
        state.bidguide.forEach(v => {
            x.push(`${v.bidAmountStart}-${v.bidAmountEnd}`);
            dt1.push(v.cpi ? parseFloat(v.cpi).toFixed(2) : '暂无');
            dt2.push(v.spend ? parseFloat(v.spend).toFixed(2) : '暂无');
            dt3.push(v.installs ? v.installs : '暂无');
        })
        let y1 = [{
            name: 'CPI',
            type: 'bar',
            data: dt1
        }];
        let y2 = [{
            name: '花费',
            type: 'bar',
            data: dt2
        }];
        let y3 = [{
            name: '安装量',
            type: 'bar',
            data: dt3
        }];

        myChart8.setOption(chart.bidGuide(x, y1));
        myChart9.setOption(chart.bidGuide(x, y2));
        myChart10.setOption(chart.bidGuide(x, y3));
    },
    //ad
    ADPLANLIST(state, r) {
        state.adplanlist = r.data.list;
        state.adplanlist.unshift({
            fbId: '-1',
            name: '不限'
        })
        console.log(state.adplanlist);
    },
    CUSTOMEVENTAD(state, { r, applicationId }) {
        state.adcustomevent = [];
        state.customunit = r.data.eventsunit;
        // let localevent = localStorage.getItem(adOptionLS.new) && JSON.parse(localStorage.getItem(adOptionLS.new))[applicationId] ? JSON.parse(localStorage.getItem(adOptionLS.new))[applicationId] : [];

        r.data.eventsNameList.forEach(v => {
            let obj = {};
            obj.name = v;
            obj.checked1 = false;
            obj.checked2 = false;
            obj.checked3 = false;

            state.adcustomevent.push(obj);
        })

        // console.log(state.customeventcampain);

    },
    GETCONDITION(state, res) {
        state.conditionlist = res.data;
    },
    ADLIST(state, { res, type, dateCond, editType, name, customOption }) {
        // 重置超时状态
        state.adlisttimeout = false;

        let arr = [];
        // 投放状态不同的分组不同的字段
        let effect = '';
        let imptEffect = '';
        switch (type) {
            case 'campaignName':
                effect = 'adCampaignStatus';
                imptEffect = 'adCampaignFbStatus';
                break;
            case 'adSetName':
                effect = 'adSetStatus';
                imptEffect = 'adSetFbStatus';
                break;
            case 'adName':
                effect = 'adStatus';
                imptEffect = 'adFbStatus';
                break;
        }

        /**
         * 20181130新增细分数据逻辑
         */
        let caredata = [];
        let afcaredata = [];
        // 提取细分数据
        res.data.list.forEach((v, i) => {
            // 普通细分数据
            if (v.fbAdPartList) {
                v.fbAdPartList.forEach((g, q) => {
                    let name = '';
                    let materialId = g.materialId && g.materialId.indexOf('http') != -1 ? `<span class="headpic"><a href="${g.materialId}" target="_blank"><img src="${g.materialId}"/></span></a>` : g.materialId;
                    name += dateCond && g.insightDate ? ',' + g.insightDate : '';
                    name += g.age ? ',' + g.age : '';
                    name += g.gender ? ',' + g.gender : '';
                    name += g.country ? ',' + g.country : '';
                    name += g.impressionDevice ? ',' + g.impressionDevice : '';
                    name += g.publisherPlatform ? ',' + g.publisherPlatform : '';
                    name += materialId ? ',' + materialId : '';
                    name += g.materialText ? ',' + g.materialText : '';

                    g['parentindex'] = i;
                    g['iscare'] = true;
                    g[type] = name.substring(1);
                    // 特殊细分数据，用于判断是否展示缩略图
                    g['careimg'] = g.materialId && g.materialId.indexOf('http') != -1 ? true : false;
                    caredata.push(g);
                })
            }
            // af细分数据
            if (v.fbAdAfPartList) {
                v.fbAdAfPartList.forEach((g, q) => {
                    let name = '';
                    name += dateCond && g.insightDate ? ',' + g.insightDate : '';
                    name += g.country ? ',' + g.country : '';

                    g['parentindex'] = i;
                    g['iscare'] = true;
                    g[type] = name.substring(1);
                    afcaredata.push(g);
                })
            }
        })
        // console.log(caredata);
        // console.log(afcaredata);
        /**
         * 2019-02-15新增
         * 细分数据合并逻辑
         * 如果条件相同(名称和序号)，则把普通细分数据与af细分数据合并成同一行
         * 如果没有相同的，则普通细分数据在前，af细分数据在后排列
         */
        caredata.forEach((v, i) => {
            let pindex;
            let sameobj = afcaredata.find((g, p) => {
                if (g[type] == v[type] && g['parentindex'] == v['parentindex']) {
                    pindex = p;
                    return g;
                }
            });
            if (sameobj) {
                caredata[i] = Object.assign(v, sameobj);
                afcaredata.splice(pindex, 1);
            }
        });
        let allcare = caredata.concat(afcaredata);
        allcare.forEach(v => {
            v['afMinsRate'] = v['installNum'] && v['afInstallsNum'] ? ((v['afInstallsNum'] - v['installNum']) * 100 / v['installNum']).toFixed(2) : null;
            v['afCpi'] = v['afInstallsNum'] && v['spend'] ? (v['spend'] / v['afInstallsNum']).toFixed(2) : null;
        })
        // console.log(allcare);
        // 按照下标，在列表数组中插入细分数据
        allcare.forEach((v, i) => {
            res.data.list.splice(v.parentindex + 1 + i, 0, v);
        })

        // 排序情况下，全部数据取的第一个接口
        res.data.list.forEach((v, i) => {
            let kname = '';
            // v[imptEffect] = v[imptEffect]?v[imptEffect]: '';
            // console.log(v[imptEffect]);
            switch (v[imptEffect]) {
                case 'ARCHIVED':
                    kname = '已归档';
                    break;
                case 'ACTIVE':
                    kname = '投放中';
                    break;
                case 'DELETED':
                    kname = '已删除';
                    break;
                case 'PAUSED':
                    kname = '已暂停';
                    break;
                default:
                    kname = '';
                    break;
            }

            let iname = '';
            // v[effect] = v[effect]?v[effect]:'';
            // console.log(v[effect]);
            switch (v[effect]) {
                case 'ACTIVE':
                    iname = '投放中';
                    break;
                case 'PAUSE':
                    iname = '已暂停';
                    break;
                case 'DELETED':
                    iname = '已删除';
                    break;
                case 'PENDING_REVIEW':
                    iname = '审核中';
                    break;
                case 'DSIAPPROVED':
                    iname = '未获批';
                    break;
                case 'PREAPPROVED':
                    iname = '预先获批';
                    break;
                case 'PENDING_BILLING_INFO':
                    iname = '结算中';
                    break;
                case 'CAMPAIGN_PAUSED':
                    iname = '广告系列已暂停';
                    break;
                case 'ARCHIVED':
                    iname = '已归档';
                    break;
                case 'ADSET_PAUSED':
                    iname = '广告组已暂停';
                    break;
                default:
                    iname = '';
                    break;
            }
            let obj = {
                ...v
            }
            obj.imid = v.id ? v.id : '';
            obj.effectiveStatus = v[imptEffect];
            obj.effectiveStatusName = kname;
            obj.effectiveImport = v[effect];
            obj.effectiveImportName = iname;
            obj.switchStatus = v[imptEffect];
            obj.jobStatus = ''; // job状态，如果在job中，则为true
            switch (type) {
                case 'campaignName':
                    obj.jobStatus = v.adCampaignLockStatus > 0 ? true : false;
                    break;
                case 'adSetName':
                    obj.jobStatus = v.adSetLockStatus > 0 ? true : false;
                    break;
                case 'adName':
                    obj.jobStatus = v.adLockStatus > 0 ? true : false;
                    break;
            }
            // obj.fbGroupId = v.fbAdId ? v.fbAdId : '';
            obj.fbAccountId = v.fbAccountId ? v.fbAccountId.split('_')[1] : '';
            // obj['afInstallDiff'] = obj.afInstanNum && obj.instalNum ? ((obj.afInstanNum - obj.instalNum) * 100 / obj.instalNum).toFixed(2) + '%' : '';
            obj['ctr'] = obj['ctr'] ? obj['ctr'] + '%' : '';
            obj['afMinsRate'] = obj['afMinsRate'] ? obj['afMinsRate'] + '%' : '';
            obj['afRetentionRate'] = obj['afRetentionRate'] ? obj['afRetentionRate'] + '%' : '';
            obj['cvr'] = obj['cvr'] ? obj['cvr'] + '%' : '';
            obj['afCtr'] = obj['afCtr'] ? obj['afCtr'] + '%' : '';
            obj['afLoyalUsersRate'] = obj['afLoyalUsersRate'] ? obj['afLoyalUsersRate'] + '%' : '';
            obj['afROI'] = obj['afROI'] ? obj['afROI'] + '%' : '';
            obj['afConversionRate'] = obj['afConversionRate'] ? obj['afConversionRate'] + '%' : '';
            obj['afReRate1'] = obj['afReRate1'] ? obj['afReRate1'] + '%' : '';
            obj['afReRate2'] = obj['afReRate2'] ? obj['afReRate2'] + '%' : '';
            obj['afReRate3'] = obj['afReRate3'] ? obj['afReRate3'] + '%' : '';
            obj['afReRate4'] = obj['afReRate4'] ? obj['afReRate4'] + '%' : '';
            obj['afReRate5'] = obj['afReRate5'] ? obj['afReRate5'] + '%' : '';
            obj['afReRate6'] = obj['afReRate6'] ? obj['afReRate6'] + '%' : '';
            obj['afReRate7'] = obj['afReRate7'] ? obj['afReRate7'] + '%' : '';
            if (v.appEventsList) {
                v.appEventsList.forEach(h => {
                    obj[`${h.eventsName}|eventCounter`] = h.eventCounter;
                    obj[`${h.eventsName}|uniqueUsers`] = h.uniqueUsers;
                    obj[`${h.eventsName}|salesIn`] = h.salesIn;
                });
            }

            arr.push(obj);
        })
        // 导出全部
        if (editType) {
            let str = '\uFEFF';
            str += "" + customOption.map(v => v.name).join(',');
            str += '\n';

            for (let i = 0; i < arr.length; i++) {
                let content = ''
                customOption.forEach(v => {
                    if (v.key == 'campaignId' || v.key == 'adsetId' || v.key == 'adId' || v.key == 'accountId')
                        content += `,${arr[i][v.key] ? arr[i][v.key] + '\t' : '--'}`
                    else
                        content += `,${arr[i][v.key] !== null && arr[i][v.key] !== undefined && arr[i][v.key] !== '' ? '"' + arr[i][v.key] + '"' : '--'}`;
                })
                content = content.substr(1);
                str += content;
                str += "\n";
            }

            cm.exportEXCEL("outAdList", name, str, 'xls');
            return;
        }
        switch (type) {
            case 'campaignName':
                state.adcampaignlist = JSON.stringify(arr);
                state.adcampaigntotal = res.data.total;
                break;
            case 'adSetName':
                state.adsetlist = JSON.stringify(arr);
                state.adsettotal = res.data.total;
                break;
            case 'adName':
                state.adadlist = JSON.stringify(arr);
                state.adadtotal = res.data.total;
                break;
        }
    },
    ADLISTTOTAL(state, r) {
        state.adlisttotal = r.data;
    },
    ADLISTTIMEOUT(state) {
        state.adlisttimeout = true;
    },
    UPDATETIME(state, r) {
        state.nowtime = r.data.now;
        state.updatetime = r.data.fbDataUpdateTime;
        let time = state.nowtime - state.updatetime;
        if (time <= 60000) {
            state.datestatus = '刚刚';
        } else {
            state.datestatus = `${parseInt(time / 60000)}分钟前`;
        }
    },
    ADACCOUNT(state, r) {
        state.adaccountlist = r.data;

        // state.adaccountlist.unshift({
        //     fbId: '-1',
        //     name: '不限'
        // })
    },
    CHANGESTATUS(state, r) {
        state.adlist.forEach(v => {
            if (r.adIds.indexOf(v.fbAdId) != -1) {
                v.status = r.status;
            }
            v.load = false;
        })
    },
    CHANGEADLOAD(state, id) {
        state.adlist.forEach(v => {
            if (v.fbAdId == id) {
                v.load = true;
            }
        })
    },
    ADCAMPAIGNLIST(state, res) {
        state.copycampaignlist = res.data;
    },
    ADSETLIST(state, res) {
        state.copyadsetlist = res.data;
    },
    CALCUCOUNT(state, res) {
        state.adcount = res.data.adCount;
        state.adsetcount = res.data.adsetCount;
        state.campaigncount = res.data.campaignCount;
    },
    CAMPAIGNINFO(state, res) {
        state.editcampaignlist = res.data;
    },
    CREATECAMPAIGNLIST(state, res) {
        state.createcampaignlist = res.data;
    },
    ADSETINFO(state, { res, applicationid }) {
        console.log(applicationid);
        state.editadsetlist = res.data;
        state.editadsetlist.forEach(v => {
            let userOs = v.userOs.split('_');
            let target = JSON.parse(v.targeting);
            let schedule = JSON.parse(v.adsetSchedule);

            v.included = target.custom_audiences ? target.custom_audiences.map(v => v.id) : [];
            v.excluded = target.excluded_custom_audiences ? target.excluded_custom_audiences.map(v => v.id) : [];
            v.country = v.countries.split(',');
            v.platform = userOs[0].toLocaleLowerCase().indexOf('android') != -1 ? 'google_play' : 'itunes';
            v.lowversion = userOs[2];
            v.highversion = userOs[4] == 'above' ? '' : userOs[4];
            v.moneytype = v.dailyBudget > 0 ? 'day_budget' : 'total_budget';
            v.minage = target.age_min;
            v.maxage = target.age_max;
            v.language = target.locales ? target.locales : [];
            v.interest = target.interests ? target.interests.map(v => v.id) : [];
            v.filtra = [];
            v.filtrapage = [];
            v.filtrapageObj = [];
            if (target.excluded_connections && target.excluded_connections.length > 0) {
                let install = target.excluded_connections.filter(v => v.id == applicationid);
                let attention = target.excluded_connections.filter(v => v.id != applicationid);

                attention.forEach(v => {
                    v.pageId = v.id;
                })
                if (install.length > 0) {
                    v.filtra.push("1")
                }
                if (attention.length > 0) {
                    v.filtra.push("2")
                    v.filtrapage = attention.map(v => v.id);
                    v.filtrapageObj = attention;
                }
            }
            if (v.genders.length == 1) {
                if (v.genders.indexOf(1) != -1) {
                    v.sex = 1;
                } else {
                    v.sex = 2;
                }
            } else {
                v.sex = 0;
            }
            v.timerange = schedule ? 'schedule' : 'allday';
            v.startMinute = schedule ? parseInt(schedule[0].start_minute) : 0;
            v.endMinute = schedule ? parseInt(schedule[0].end_minute) : 0;
            v.weekday = schedule ? schedule[0].days : [];
            v.equip = v.userDevice.split(',');
            v.verpla = v.publisherPlatforms.split(',');
            v.bid = v.billingEvent == 'IMPRESSIONS' ? 'cpm' : 'cpi';
        });
    },
    CREATEADSETLIST(state, res) {
        state.createadsetlist = res.data;
    },
    ADCREATELIST(state, res) {
        state.adcreatelist = res.data.list;
        state.adcreatetotal = res.data.total;

        state.adcreatelist.forEach(v => {
            // if (v.imageUrl)
            //     v.img = eval('(' + v.imageUrl + ')').imageUrl;
            // if (v.videoUrl)
            //     v.video = eval('(' + v.videoUrl + ')').videoUrl;
            if (v.sex == '1')
                v.sexName = '男';
            else if (v.sex == '2')
                v.sexName = '女';
            else
                v.sexName = '全部';

        });
    },
    ADINFO(state, res) {
        state.editadlist = res.data;
    },
    DYNAMICCREATE(state, res) {
        let r = [...new Set(Object.values(res.data))];
        state.isdynamic = r.indexOf(false) != -1 ? true : false;
    },
    SETADCREATEAPPLIST(state, r) {
        let dt = r.data;
        if (state.adapplist.length > 0) {
            dt = dt.filter(v => v.id != state.adapplist[0].id);
        }
        state.adapplist = dt;
    },
    ADAPPINFO(state, r) {
        state.adapplist = state.adapplist.filter(v => v.id != r.data[0].id);
        state.adapplist.push(r.data[0]);
    },
    CREATEALLPAGES(state, r) {
        if (state.createallpagelist.length > 0) {
            let arr = state.createallpagelist.map(v => v.id);
            let dt = r.data.filter(v => arr.indexOf(v.id) == -1);
            state.createallpagelist = state.createallpagelist.concat(dt);
        } else
            state.createallpagelist = r.data;
    },
    JOBPROCESS(state, r) {
        state.jobtotal = r.completed + r.unCompleted;
        state.jobcomplete = r.completed;
        state.copyjoblistdetail = [];

        r.tasks.forEach(v => {
            let obj = {
                name: v.taskName,
                total: v.completed + v.unCompleted,
                completed: v.completed,
                percent: v.completed * 100 / (v.completed + v.unCompleted)
            }

            state.copyjoblistdetail.push(obj);
        });
    },
    JOBPROCESSCOMPLETE(state, r) {
        state.jobtotal = 0;
        state.jobcomplete = 0;
        state.copyjoblistdetail = [];
    },
    JOBLISTDETAIL(state, r) {
        state.taskresult = [];

        let tabcampaign = r.find(v => v.taskName == '复制广告系列');
        if (tabcampaign)
            state.taskresult.push({
                tabname: `广告系列${tabcampaign['success']}/${tabcampaign['tasks'].length}`,
                tasks: tabcampaign['tasks']
            })
        let tabadset = r.find(v => v.taskName == '复制广告组');
        if (tabadset)
            state.taskresult.push({
                tabname: `广告组${tabadset['success']}/${tabadset['tasks'].length}`,
                tasks: tabadset['tasks']
            })
        let tabad = r.find(v => v.taskName == '复制广告' || v.taskName == '创建广告' || v.taskName == '编辑广告');
        if (tabad)
            state.taskresult.push({
                tabname: `广告${tabad['success']}/${tabad['tasks'].length}`,
                tasks: tabad['tasks']
            })
        let tabcreate = r.find(v => v.taskName == '替换创意');
        if (tabcreate)
            state.taskresult.push({
                tabname: `创意${tabcreate['success']}/${tabcreate['tasks'].length}`,
                tasks: tabcreate['tasks']
            })
    },
    CALENDARDATE(state, r) {
        state.calendardate = r.data;
    },
    AFFILEDOWNLOAD(state, { r, name }) {
        let nameArr = [
            { name: 'Ad Group', key: 'adgroupName' },
            { name: 'Adset', key: 'adSetName' },
            { name: 'Country', key: 'country' },
            { name: 'Date', key: 'date' },
            { name: 'Install Day', key: 'installDayNum' },
            { name: 'Day 1', key: 'day1Num' },
            { name: 'Day 2', key: 'day2Num' },
            { name: 'Day 3', key: 'day3Num' },
            { name: 'Day 4', key: 'day4Num' },
            { name: 'Day 5', key: 'day5Num' },
            { name: 'Day 6', key: 'day6Num' },
            { name: 'Day 7', key: 'day7Num' }
        ];

        let str = '\uFEFF';
        str += nameArr.map(v => v.name).join(',');
        str += "\n";

        for (let i = 0; i < r.data.length; i++) {
            let content = ''
            nameArr.forEach(v => {
                content += `,${r.data[i][v.key] !== null && r.data[i][v.key] !== undefined ? r.data[i][v.key] : '--'}`;
            })
            str += content.substr(1);
            str += '\n';
        }

        cm.exportEXCEL("", name.replace(/\.csv$/, '') + '_error', str, 'xls');
    },
    ACTIVEAD(state, r) {
        state.hascreatead = r.data;
    },
    // data
    CONDITION(state, r) {
        state.datacountry = r.data.countryList;
        state.dataage = r.data.ageList;
        state.dataplatform = ['Facebook', 'Instagram', 'Audience Network', 'Messenger'];
        state.dataimpression = ['安卓智能手机', 'iphone', 'ipad'];
    },
    DATALIST(state, r) {
        state.datalist = r.data.list;
        state.datatotal = r.data.total;
    },
    DATALISTOUT(state, { res, name }) {
        let dt = res.data.list;

        let titlear = [
            "广告账户ID",
            "广告账户名称",
            "触达",
            "展示",
            "点击",
            "CTR",
            "CVR",
            "CPM",
            "CPC",
            "相关度",
            "安装",
            "花费",
            "CPI"
        ];
        let str = "<table><thead><tr>";
        titlear.forEach(v => {
            str += `<th>${v}</th>`;
        });
        str += "</tr></thead><tbody>";

        for (let i = 0; i < dt.length; i++) {
            str += "<tr>";
            str += `<td style="mso-number-format:'\\@'">${dt[i]['fbAccountId']}</td>`;
            str += `<td>${dt[i]['adAccountName']}</td>`;
            str += `<td>${dt[i]['reachNum']}</td>`;
            str += `<td>${dt[i]['showNum']}</td>`;
            str += `<td>${dt[i]['clicksNum']}</td>`;
            str += `<td>${dt[i]['ctr'] ? dt[i]['ctr'] : ''}</td>`;
            str += `<td>${dt[i]['cvr'] ? dt[i]['cvr'] : ''}</td>`;
            str += `<td>${dt[i]['cpm'] ? dt[i]['cpm'] : ''}</td>`;
            str += `<td>${dt[i]['cpc'] ? dt[i]['cpc'] : ''}</td>`;
            str += `<td>${dt[i]['relevanceScore']}</td>`;
            str += `<td>${dt[i]['installsNum']}</td>`;
            str += `<td>${dt[i]['spend']}</td>`;
            str += `<td>${dt[i]['cpi'] ? dt[i]['cpi'] : ''}</td>`;
            str += "</tr>";
        }
        str += '</tbody></table>';

        cm.exportHTML("dataTable", name, str);
    },
    ADFORM(state, r) {
        state.adformlist = r.data.list;
        state.adformtotal = r.data.total;
    },
    ADFORMOUT(state, { res, name }) {
        let dt = res.data.list;

        let titlear = [
            "广告系列名称",
            "推广计划名称",
            "触达",
            "展示",
            "点击",
            "CTR",
            "CVR",
            "CPM",
            "CPC",
            "相关度",
            "安装",
            "花费",
            "CPI"
        ];
        let str = "<table><thead><tr>";
        titlear.forEach(v => {
            str += `<th>${v}</th>`;
        });
        str += "</tr></thead><tbody>";

        for (let i = 0; i < dt.length; i++) {
            str += "<tr>";
            str += `<td>${dt[i]['adCampaignName']}</td>`;
            str += `<td>${dt[i]['adPlanName']}</td>`;
            str += `<td>${dt[i]['reachNum']}</td>`;
            str += `<td>${dt[i]['showNum']}</td>`;
            str += `<td>${dt[i]['clicksNum']}</td>`;
            str += `<td>${dt[i]['ctr'] ? dt[i]['ctr'] : ''}</td>`;
            str += `<td>${dt[i]['cvr'] ? dt[i]['cvr'] : ''}</td>`;
            str += `<td>${dt[i]['cpm'] ? dt[i]['cpm'] : ''}</td>`;
            str += `<td>${dt[i]['cpc'] ? dt[i]['cpc'] : ''}</td>`;
            str += `<td>${dt[i]['relevanceScore']}</td>`;
            str += `<td>${dt[i]['installsNum']}</td>`;
            str += `<td>${dt[i]['spend']}</td>`;
            str += `<td>${dt[i]['cpi'] ? dt[i]['cpi'] : ''}</td>`;
            str += "</tr>";
        }
        str += '</tbody></table>';

        cm.exportHTML("dataTable", name, str);
    },
    CREATEFORM(state, r) {
        state.createformlist = r.data.list;
        state.createformtotal = r.data.total;

        state.createformlist.forEach(v => {
            if (v.imageUrl)
                v.img = eval('(' + v.imageUrl + ')').imageUrl;
        })
    },
    CREATECARD(state, r) {
        state.createcardlist = r.data.list;
        state.createcardtotal = r.data.total;

        // state.createformlist.forEach(v => {
        //     if (v.imageUrl)
        //         v.img = eval('(' + v.imageUrl + ')').imageUrl;
        // })
    },
    CREATEFORMOUT(state, { res, name }) {
        let dt = res.data.list;

        // state.createformlist.forEach(v => {
        //     if (v.imageUrl)
        //         v.img = eval('(' + v.imageUrl + ')').imageUrl;
        // })

        let titlear = [
            "创意ID",
            "创意名称",
            "缩略图",
            "国家",
            "触达",
            "展示",
            "点击",
            "CTR",
            "CVR",
            "CPM",
            "CPC",
            "相关度",
            "安装",
            "花费",
            "CPI"
        ];
        let str = "<table><thead><tr>";
        titlear.forEach(v => {
            str += `<th>${v}</th>`;
        });
        str += "</tr></thead><tbody>";

        dt.forEach(v => {
            str += "<tr>";
            str += `<td style="mso-number-format:'\\@'">${v['fbAdCreativeId']}</td>`;
            str += `<td>${v['adCreativeName']}</td>`;
            str += `<td>${v.imageUrl ? eval('(' + v.imageUrl + ')').imageUrl : ''}</td>`;
            str += `<td>${v['country'] ? v['country'] : ''}</td>`;
            str += `<td>${v['reachNum']}</td>`;
            str += `<td>${v['showNum']}</td>`;
            str += `<td>${v['clicksNum']}</td>`;
            str += `<td>${v['ctr'] ? v['ctr'] : ''}</td>`;
            str += `<td>${v['cvr'] ? v['cvr'] : ''}</td>`;
            str += `<td>${v['cpm'] ? v['cpm'] : ''}</td>`;
            str += `<td>${v['cpc'] ? v['cpc'] : ''}</td>`;
            str += `<td>${v['relevanceScore']}</td>`;
            str += `<td>${v['installsNum']}</td>`;
            str += `<td>${v['spend']}</td>`;
            str += `<td>${v['cpi'] ? v['cpi'] : ''}</td>`;
            str += "</tr>";
        })
        str += '</tbody></table>';

        cm.exportHTML("", name, str);
    },
    CREATECARDOUT(state, { res, name }) {
        let dt = res.data.list;

        let titlear = [
            "创意ID",
            "创意名称",
            "卡片ID",
            "卡片名称",
            // "缩略图",
            "国家",
            "点击"
        ];
        let str = "<table><thead><tr>";
        titlear.forEach(v => {
            str += `<th>${v}</th>`;
        });
        str += "</tr></thead><tbody>";

        dt.forEach(v => {
            str += "<tr>";
            str += `<td style="mso-number-format:'\\@'">${v['creativeId']}</td>`;
            str += `<td>${v['adCreativeName']}</td>`;
            str += `<td style="mso-number-format:'\\@'">${v['creativeCardId']}</td>`;
            str += `<td>${v['creativeCardName']}</td>`;
            // str += `<td>${v['creativeCardImage']}</td>`;
            str += `<td>${v['country'] ? v['country'] : ''}</td>`;
            str += `<td>${v['clicksNum']}</td>`;
            str += "</tr>";
        })
        str += '</tbody></table>';

        cm.exportHTML("", name, str);
    },
    DAYCPITABLE(state, r) {
        state.daycpilist = [];
        state.daycpilist = r.data.pageInfoAll.list.slice(0);

        state.daycpitotal = r.data.pageInfoAll.total;
        state.cpicountry = r.data.countryList ? r.data.countryList : [];
        state.cpiimpression = r.data.impressionList ? r.data.impressionList : [];
    },
    DAYCPI(state, r) {
        // app数据图
        let ist = r.data.pageInfoAll.list;
        let chartall = [], x = [], az = {
            name: '安装',
            type: 'line',
            smooth: true,
            stack: '',
            data: []
        }, hf = {
            name: '花费',
            type: 'line',
            smooth: true,
            stack: '',
            data: []
        }, cpi = {
            name: 'CPI',
            type: 'line',
            smooth: true,
            stack: '',
            data: []
        };

        ist.forEach(v => {
            let obj = {};
            obj.name = v.appName;
            obj.value = v.installsNum;

            az.data.push(v.installsNum);
            hf.data.push(v.spend);
            cpi.data.push(v.cpi);
            x.push(cm.timeFormat(v.insightDate, 'yyyy-MM-dd'));
        });

        chartall.push(az, hf, cpi);

        myChart4.setOption(chart.appChart(x, chartall));
    },
    DAYCPIOUT(state, { res, name }) {
        let dt = res.data.pageInfoAll.list;

        let titlear = [
            "日期",
            "国家",
            "平台",
            "安装",
            "花费",
            "CPI"
        ];
        let str = "<table><thead><tr>";
        titlear.forEach(v => {
            str += `<th>${v}</th>`;
        });
        str += "</tr></thead><tbody>";

        for (let i = 0; i < dt.length; i++) {
            str += "<tr>";
            str += `<td>${cm.timeFormat(dt[i]['insightDate'], 'yyyy-MM-dd')}</td>`;
            str += `<td>${dt[i]['country']}</td>`;
            str += `<td>${dt[i]['impressionDevice']}</td>`;
            str += `<td>${dt[i]['installsNum']}</td>`;
            str += `<td>${dt[i]['spend']}</td>`;
            str += `<td>${dt[i]['cpi'] ? dt[i]['cpi'] : ''}</td>`;
            str += "</tr>";
        }
        str += '</tbody></table>';

        cm.exportHTML("daycpiTable", name, str);
    },
    OPTIONMORE(state, { res, keyword }) {
        state.adcampaign = keyword == 'campaignKeyword' ? res.data : [];
        state.adaccount = keyword == 'accountKeyword' ? res.data : [];
        state.adcreate = keyword == 'creativeKeyword' ? res.data : [];
    },
    MATTERLIST(state, { res, type, name }) {
        if (name) {
            let data = res.data.list;
            let titlearr = [
                { name: type == 0 ? 'FB图片编号' : 'FB视频编号', key: 'materialId' },
                { name: type == 0 ? '图片' : '视频', key: type == 0 ? 'materialUrl' : 'materialUrl' },
                { name: '触达', key: 'reachNum' },
                { name: '展示', key: 'showNum' },
                { name: '点击', key: 'clicksNum' },
                { name: 'CTR', key: 'ctr' },
                { name: 'CVR', key: 'cvr' },
                { name: 'CPM', key: 'cpm' },
                { name: 'CPC', key: 'cpc' },
                { name: '相关度', key: 'relevanceScore' },
                { name: '安装', key: 'installsNum' },
                { name: '花费', key: 'spend' },
                { name: 'CPI', key: 'cpi' }];
            let str = '\uFEFF';
            str += "" + titlearr.map(v => v.name).join(',');
            str += '\n';

            for (let i = 0; i < data.length; i++) {
                let content = ''
                titlearr.forEach(v => {
                    content += `,${data[i][v.key] !== null && data[i][v.key] !== undefined && data[i][v.key] !== '' ? '"' + data[i][v.key] + '"' : '--'}`;
                })
                content = content.substr(1);
                str += content;
                str += "\n";
            }
            let sum = '';
            sum += '合计, ,';
            titlearr.forEach(v => {
                if (v.key != 'materialId' && v.key != 'materialUrl') {
                    sum += res.data[v.key] + ',';
                }
            })
            str += sum;

            cm.exportEXCEL("outAdList", name, str, 'xls');
        } else if (type == 0) {
            state.imagematterlist = res.data.list;
            state.imagematterlist.forEach(v => {
                v.ctr = v.ctr * 100 + '%';
                v.cvr = v.cvr * 100 + '%';
            })
            state.imagemattersum = res.data;
            state.imagemattertotal = res.data.count;
            delete (state.imagemattersum, 'list');
        } else {
            state.videomatterlist = res.data.list;
            state.videomatterlist.forEach(v => {
                v.ctr = v.ctr * 100 + '%';
                v.cvr = v.cvr * 100 + '%';
            })
            state.videomattersum = res.data;
            state.videomattertotal = res.data.count;
            delete (state.videomattersum, 'list');
        }
    },
    // target 
    TARGETADLIST(state, r) {
        state.targetadlist = r.data.list;

        state.targetadlist.forEach(v => {
            v.secondtree = true;
            v.isIndeterminate = false;
        })
    },
    TARGETADSETLIST(state, { r, campaignid }) {
        let data = r.data.list;
        data.forEach(v => {
            v.checked = '';
        })
        state.targetadsetlist = data;

        // 下面的暂时用不到
        // state.targetadsetarray[`campaignid_${campaignid}`] = data;

        // state.targetadlist.forEach(v => {
        //     if (v.campaignId == campaignid)
        //         v.secondtree = false;
        // })
    },
    TARGETTREE(state, campaignid) {
        state.targetadsetlist = state.targetadsetarray[`campaignid_${campaignid}`];
    },
    TARGETLIST(state, r) {
        state.targetlist = r.data.data;
        state.targettotal = r.data.total;

        state.targetlist.forEach(v => {
            // 是否可以编辑/共享
            v.ifedit = v.ownAccountId.split('_')[1] != v.accountId ? false : true;
            // 是否可以删除
            v.ifdelete = v.lookalikeAudienceIds ? false : true;

            switch (v.deliveryStatusCode) {
                case 200:
                    v.statusName = '正常';
                    break;
                case 400:
                    v.statusName = '警告';
                    break;
                case '':
                case null:
                case undefined:
                    v.statusName = '--';
                    break;
                default:
                    v.statusName = '错误';
                    break;
            }
            let targettype = [
                { name: '客户文件', key: 'CUSTOM' },
                { name: '网站', key: 'WEBSITE' },
                { name: '应用', key: 'APP' },
                { name: '线下转化', key: 'OFFLINE_CONVERSION' },
                { name: 'CLAIM', key: 'CLAIM' },
                { name: '合作伙伴', key: 'PARTNER' },
                { name: 'MANAGED', key: 'MANAGED' },
                { name: '视频', key: 'VIDEO' },
                { name: '预约', key: 'ENGAGEMENT' },
                { name: '账户包', key: 'BAG_OF_ACCOUNTS' },
                { name: '研究规则受众', key: 'STUDY_RULE_AUDIENCE' },
                { name: 'FOX', key: 'FOX' }
            ]
            switch (v.subtype) {
                // 类似受众
                case 'LOOKALIKE':
                    let lookaliketype = JSON.parse(v.lookalikeSpec).origin[0];
                    if (lookaliketype.type == 'custom_audience') {
                        v.childType = `自定义受众：${lookaliketype.name}`;
                        v.childliketype = 'custom_audience';
                    } else if (lookaliketype.type == "campaign_conversion") {
                        v.childType = '广告转化';
                        v.childliketype = 'campaign_conversion';
                    } else if (lookaliketype.type == 'page') {
                        v.childType = '主页粉丝';
                        v.childliketype = 'page';
                    }
                    break;
                // 自定义受众
                default:
                    let tg = targettype.find(g => g.key == v.subtype);
                    v.childType = tg ? tg.name : v.subtype;
                    break;
            }
        })

        state.targettype = [{
            name: '不限',
            value: '-1'
        }, {
            name: '类似受众',
            value: 'LOOKALIKE'
        }, {
            name: '自定义受众',
            value: 'APP'
        }];
    },
    TARGETDETAIL(state, r) {
        state.targetdetail = r.data;

        state.targetdetail.forEach(v => {
            switch (v.operationStatus) {
                case 200:
                    v.statusName = '正常';
                    break;
                case 400:
                    v.statusName = '警告';
                    break;
                case '':
                case null:
                case undefined:
                    v.statusName = '--';
                    break;
                default:
                    v.statusName = '错误';
                    break;
            }

            v.approximateCount = v.approximateCount == 1000 ? '<1000' : v.approximateCount;
        });
    },
    APPACCOUNT(state, r) {
        state.appaccount = r.data;
    },
    TARGETADDDETAIL(state, r) {
        state.targetadddetail = r.data;
    },
    TARGETINFO(state, { r, type }) {
        switch (type) {
            case 'app':
                state.targetinfo = r.data;
                break;
            case 'lookalike':
                state.liketargetinfo = r.data;
                break;
            default:
                state.specialtargetinfo = r.data;
                break;
        }
    },
    // LIKETARGETINFO(state, r) {
    //     state.liketargetinfo = r.data;
    // },
    TARGETACCOUNT(state, r) {
        let ar = [];
        r.data.forEach(v => {
            let obj = {
                name: v.fbAccountName,
                fbId: v.fbAccountId
            }

            ar.push(obj);
        });
        state.targetaccount = ar;
    },
    LIKETARGET(state, r) {
        state.liketarget = r.data;
    },
    TARGETCAMPAINGNS(state, { res, pageIndex }) {
        if (pageIndex == 1) {
            state.targetcampaigns = [];
        }
        state.targetcampaigns = state.targetcampaigns.concat(res.data.list);
        if (state.targetcampaigns.length != res.data.total)
            state.ifmorecampaigns = true;
    },
    TARGETAPPLIST(state, r) {
        state.targetapplist = r.data;
    },
    SAMELIKE(state) {
        state.ifsame = true;
    },
    TARGETPLANLIST(state, r) {
        let ar = r.data.list;
        ar.forEach(v => {
            // v.checked = false;

            // 树形结构第二级，推广计划对应的批次列表
            v.treegradelist = [];
            v.secondtree = true;
            v.isIndeterminate = false;
        });
        state.targetplanlist = ar;
    },
    TARGETPLANLISTCHECK(state, { id, key, vl }) {
        state.targetadlist.forEach(v => {
            if (id) {
                if (v.campaignId == id)
                    v[key] = vl;
            } else {
                console.log(key);
                v[key] = vl;
            }
        })
    },
    TARGETTREECHECK(state, { check }) {
        state.targetadsetlist.forEach(v => {
            v.checked = check
        })
    },
    TARGETLOGOPENCLOSE(state, { ifopen }) {
        if (ifopen) {
            state.targetplanlist.forEach(v => {
                if (state.filterarr.indexOf(v.id) != -1) {
                    console.log(v.id);
                    v.disabled = false;
                }
            })
        } else {
            state.targetplanlist.forEach(v => {
                v.disabled = true;
            })
        }
    },
    TARGETCAMPAIGNACCOUNT(state, r) {
        state.targetcampaignaccount = r.data;
    },
    DELETEDETAIL(state, r) {
        state.deleteusing = r.data.usedAudience;
        state.deletesharing = r.data.sharedAudience;
    },
    // regular
    REGULARLIST(state, r) {
        state.regularlist = r.data.list;

        state.regularlist.forEach(v => {
            switch (v.ruleStatus) {
                case 0:
                    v.statusName = '测试'
                    break;
                case 1:
                    v.statusName = '已上架'
                    break;
                case 2:
                    v.statusName = '已下架'
                    break;
            }
        })

        state.regulartotal = r.data.total;
    },
    ALLRULES(state, r) {
        state.allrules = r.data;
    },
    REGUFORMDATA(state, r) {
        // 规则启用比例
        let qybl = r.data.ruleDurations;
        let chart1 = [], x1 = [];
        for (let i in qybl) {
            let obj = {};
            obj.name = i;
            obj.value = qybl[i];

            chart1.push(obj);
            x1.push(obj.name);
        }

        myChart5.setOption(chart.regularPie(x1, chart1, '规则启用比例'));

        // 规则启用比例
        let cfbl = r.data.ruleGroupTriggerCounts;
        let chart2 = [], x2 = [];
        for (let q in cfbl) {
            let obj = {};
            obj.name = q;
            obj.value = cfbl[q];

            chart2.push(obj);
            x2.push(obj.name);
        }
        console.log(chart2);
        myChart6.setOption(chart.regularPie(x2, chart2, '规则触发比例'));

        // 触发柱状比例
        let cfstrip = r.data.ruleGroupTriggerStatistics;
        let data1 = [], data2 = [], x3 = [];
        for (let k in cfstrip) {
            data1.push(cfstrip[k].triggerCount);
            data2.push((cfstrip[k].fbTargetRate * 100).toFixed(2));
            x3.push(k);
        }

        let chart3 = [{
            name: '规则触发数',
            type: 'bar',
            data: data1
        }, {
            name: '触发广告占比',
            type: 'bar',
            data: data2,
            yAxisIndex: 1,
            // tooltip: {
            //     formatter: '{c}%'
            // }
            // itemStyle: {
            //     normal: {  
            //         label: {  
            //             show: true,  
            //             position: 'top',  
            //             formatter: '{c}%'  
            //         }  
            //     }  
            // }
        }]

        let maxstep = '1000000000000';
        // 间隔计算基准 1000 - 100
        let step = Math.max(...data1).toString().length;
        let sp = maxstep.substr(0, step - 1);
        /**
         * 计算最大值 
         * sp ? sp : 1 特殊情况排除 当最大值为一位数时
         * 分割段数 5段
         */
        let y1max = parseInt(Math.max(...data1) / (sp ? sp : 1) + 1) * (sp ? sp : 1);
        let y1step = y1max / 5;
        /**
         * 触发广告占比
         */
        let max2 = Math.max(...data2)
        let y2max = 0;
        switch (true) {
            case max2 > 10:
                y2max = (parseInt(max2 / 10) + 1) * 10;
                break;
            case max2 > 1:
                y2max = parseInt(max2) + 1;
                break;
            default:
                y2max = (parseInt(max2 * 10) + 1) / 10
                break;
        }
        let y2step = y2max / 5;

        myChart7.setOption(chart.triggerCharts(x3, chart3, y1max, y1step, y2max, y2step));

        // 表格
        state.ruleform = [];
        let formdata = r.data.ruleEffects;
        for (let p in formdata) {
            let obj = {};
            obj.name = p;
            obj.groupId = formdata[p].groupId;
            obj.installChange = formdata[p].installChange;
            obj.costChange = formdata[p].costChange;
            obj.cpiChange = formdata[p].cpiChange;

            state.ruleform.push(obj);
        }
    },
    // message
    MESSAGELIST(state, r) {
        state.messagelist = r.data;
        state.messagetotal = r.data.length;
    }
}
