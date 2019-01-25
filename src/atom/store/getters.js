import cm from '../js/common'
export default {
    // 今日安装
    todayinstall: state => {
        return state.todayInstallsNum ? state.todayInstallsNum : 0;
    },
    // 今日花费
    todayexpend: state => {
        return state.todaySpend ? state.todaySpend : 0;
    },
    // app list
    applist: state => {
        let arr = [];
        if (!state.reportAppDataList) return [];

        state.reportAppDataList.forEach(v => {
            let obj = {};
            obj.name = v.appName;
            obj.id = v.fbAppId;

            arr.push(obj);
        });
        return arr;
    },
    appdatalist: state => {
        let arr = [];
        if (!state.reportAppDataList) return [];

        state.reportAppDataList.forEach(v => {
            let obj = {
                app: v.appName,
                cd: v.reachNum,
                zs: v.showNum,
                dj: v.clicksNum,
                ctr: v.ctr,
                cvr: v.cvr,
                cpm: v.cpm,
                cpc: v.cpc,
                xgd: v.relevanceScore,
                az: v.installsNum,
                hf: v.spend,
                cpi: v.cpi,
                fbAppId: v.fbAppId,
                afInstallsNum: v.afInstallsNum,
                gap: v.gap < 0 ? (v.gap * 100).toFixed(2) : '+' + (v.gap * 100).toFixed(2)
            };

            arr.push(obj);
        });

        arr = arr.filter(v => state.appdataappid ? (v.fbAppId == state.appdataappid) : true)

        return arr;
    },
    // 单个app列表
    onlyapplist: state => {
        if (!state.appdata) return;

        state.appdata.forEach(v => {
            v.insightDateFormat = cm.timeFormat(v.insightDate, 'yyyy-MM-dd')
        });

        return state.appdata;

        // let arr = [];
        // state.appdata.forEach(v => {
        //     let obj = {
        //         rq: cm.timeFormat(v.insightDate, 'yyyy-MM-dd'),
        //         gj: v.country,
        //         pt: v.userOs,
        //         az: v.installsNum,
        //         hf: v.spend,
        //         cpi: v.cpi
        //     };

        //     arr.push(obj);
        // });

        // return arr;
    },
    countryfilter: state => {
        if (!state.countryfilter) return;

        let arr = [];
        state.countryfilter.forEach(v => {
            let obj = {
                text: `${v}`,
                value: `country_${v}`
            };

            arr.push(obj);
        });

        return arr;
    },
    disaccount: state => {
        if (state.accountkwd.trim() == '' || state.disaccount.length == 0)
            return state.disaccount;

        let arr = state.disaccount.filter(v => v.fbAccountId.indexOf(state.accountkwd.trim()) != -1 || v.name.indexOf(state.accountkwd.trim()) != -1);

        return arr;
    },
    dispage: state => {
        if (state.pagekwd.trim() == '' || state.dispage.length == 0)
            return state.dispage;

        let arr = state.dispage.filter(v => v.pageId.indexOf(state.pagekwd.trim()) != -1 || v.name.indexOf(state.pagekwd.trim()) != -1);

        return arr;
    },
    disapp: state => {
        if (state.appkwd.trim() == '' || state.applist.length == 0)
            return state.applist;

        let arr = state.applist.filter(v => v.applicationId.toLowerCase().indexOf(state.appkwd.trim().toLowerCase()) != -1 || v.name.toLowerCase().indexOf(state.appkwd.trim()) != -1);

        return arr;
    },
    dismanage: state => {
        return state.managelist;
    },
    setapplist: state => {
        return state.setappstatus === '' ? state.setapplist : state.setapplist.filter(v => v.status == state.setappstatus);
    },
    cansetapplist: state => {
        return state.setappstatus === '' ? state.cansetapplist : state.cansetapplist.filter(v => v.status == state.setappstatus);
    },
    // project
    // rule
    rulelist: state => {
        let r = state.rulelist;
        r.unshift({
            name: '不限',
            id: '-1'
        })

        return r;
    },
    allcheckidstatus: state => {
        let r = state.createchecked;
        let ar = [];

        r.forEach((v, i) => {
            let obj = {};
            if (v) {
                obj.id = state.createlist[i].id;
                obj.status = state.createlist[i].status;
                ar.push(obj);
            }
        })

        return ar;
    },
    createclassify: state => {
        let ar = [];
        state.classify.shift();
        state.classify.forEach(v => {
            let obj = {};
            obj.value = v;

            ar.push(obj);
        });
        return ar;
    },
    allactions: state => {
        return state.allactions;
    },
    selectcreatelength: state => {
        return state.inusecreate.length;
    },
    canselectcreatelength: state => {
        return state.inusecreate.filter(v => v.status != 1).length;
    },
    createlist: state => {
        let ar = [];

        ar = state.createlist.filter(v => v.status == state.createstatus);
        ar = ar.filter(v => v.classify == state.createclassify);
        ar = ar.filter(v => v.creativityName.indexOf(state.createkeyword) != -1);

        // console.log(ar);
        return ar;
    },
    selectcreate: state => {
        let ar = [];

        ar = state.selectcreate.filter(v => v.classify == state.createclassify);
        ar = ar.filter(v => v.creativityName.indexOf(state.createkeyword) != -1);

        return ar;
    },
    selectaccountlength: state => {
        return state.inuseaccount.length;
    },
    canselectaccountlength: state => {
        return state.inuseaccount.filter(v => v.status != 1).length;
    },
    badselectaccountlength: state => {
        return state.inuseaccount.filter(v => v.accountStatus != 1).length;
    },
    inuseaccount: state => {
        let ar = state.inuseaccount;
        if (state.accountstatus)
            ar = ar.filter(v => v.status == state.accountstatus);
        ar = ar.filter(v => v.fbAccountId.indexOf(state.accountkeyword) != -1 || v.name.indexOf(state.accountkeyword) != -1)
        return ar;
    },
    nouseaccount: state => {
        let ar = state.nouseaccount.filter(v => v.fbAccountId.indexOf(state.accountkeyword) != -1 || v.name.indexOf(state.accountkeyword) != -1)
        return ar;
    },
    detailadsuccess: state => {
        let s = 0;
        state.logdetail.forEach(v => {
            s += v.adDetail.createSuccess;
        })
        return s;
    },
    detailsetsuccess: state => {
        let f = 0;
        state.logdetail.forEach(v => {
            f += v.adsetDetail.createSuccess;
        })
        return f;
    },
    detailcampaignsuccess: state => {
        let l = 0;
        state.logdetail.forEach(v => {
            l += v.campaignDetail.createSuccess;
        })
        return l;
    },
    cpiCountry: state => {
        if (state.cpicountry.length == 0) return;

        let arr = [];
        state.cpicountry.forEach(v => {
            let obj = {
                text: v,
                value: `country_${v}`
            };

            arr.push(obj);
        });

        return arr;
    },
    cpiImpression: state => {
        if (state.cpiimpression.length == 0) return;

        let arr = [];
        state.cpiimpression.forEach(v => {
            let obj = {
                text: v,
                value: v
            };

            arr.push(obj);
        });
        return arr;
    },
    ruleappforCreate: state => {
        if (state.ruleapp.length == 0) return;

        return state.ruleapp.slice(1);
    },
    createcheckstatus: state => {
        if (state.createchecked.filter(v => !v).length > 0) {
            return false;
        } else {
            return true;
        }
    },
    daycpilist: state => {
        // console.log(state.daycpilist.length);
        return state.daycpilist;
    }
}