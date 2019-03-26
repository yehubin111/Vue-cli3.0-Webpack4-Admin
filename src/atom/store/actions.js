// import dt from '../js/data.js'
import _axios from '../js/axiospack';
import AX from '../js/axiosclass';
// import axios from 'axios';
import URL from '../js/url.js'
import WS from '../js/websocket'
import { Msgsuccess, Msgwarning, Msgerror, MsgnotifySuccess, MsgnotifyError } from "../js/message";
import { Loading } from 'element-ui';
function Axios({ url, method = 'get', data = {}, success = null, fail = null, fullscreen = false }) {
    return _axios({
        method,
        url,
        data,
        fullscreen
    })
        .then(res => {
            return success(res);
        })
        .catch(err => {
            console.error(err);
            if (fail) fail();
        })
}

export default {
    /***************************** common */
    setPermission({ state, commit }) {
        Notification.requestPermission()
            .then(res => {
                commit('SENDPERMISSION', res);
            })
            .catch(err => {
                console.log(err);
            })
    },
    getPayCount({ state, commit }) {
        let url = URL.counturl;

        _axios.post(url)
            .then(res => {
                commit('PAYCOUNT', res);
            })
            .catch(err => {
                console.log(err);
            })
    },
    getItemList({ state, commit }) {
        let url = URL.itemlist;

        _axios.get(url)
            .then(res => {
                let r = res;
                commit('ITEMLIST', r);
            })
            .catch(err => {
                console.log(err);
            })
    },
    changePassword({ state, commit, dispatch }, { k, n1, n2 }) {
        let url = URL.changepassword.replace('{oldPassword}', k).replace('{password}', n1).replace('{password2}', n2);

        _axios.get(url)
            .then(res => {
                let r = res;

                if (r.code == 0) {
                    commit('PASSWORD', r);
                    // 退出登录
                    dispatch('toLogout');
                }
            })
            .catch(err => {
                console.log(err);
            })
    },
    toLogout({ state, commit }) {
        let url = URL.logout;

        _axios.post(url)
            .then(res => {
                let r = res;

                if (r.code == 0)
                    commit('LOGOUT');

            })
            .catch(err => {
                console.log(err);
            })
    },
    getLongToken({ state, commit }, { token }) {
        let url = URL.gettoken;
        let params = {
            shortToken: token
        };

        _axios.post(url, params)
            .then(res => {
                let r = res.data;
            })
            .catch(err => {
                console.log(err)
            })
    },
    getMessageCount({ state, commit }) {
        let url = URL.messagecount;

        _axios.get(url)
            .then(res => {
                commit('MESSAGECOUNT', res);
            })
            .catch(err => {
                console.log(err);
            })
    },
    messageWebsocket({ state, commit, dispatch }) {
        if (WebSocket) {
            // 创建websocket消息数量提醒实例
            new WS({
                onMessage: (res) => {
                    console.log(res);
                    // 心跳监测
                    if (res.data == 'heart beat') {
                        return;
                    }
                    /**
                     * 如果当前只有一个task，而且接收到task结果推送，则表示当前task已经完成，马上结束定时器
                     * （由于定时器原因，可能不能马上返回结果，所以做这个处理）
                     */
                    if (res.data != '99+' && Array.isArray(eval(res.data)) && state.copyjoblistdetail.length == 1) {
                        let opts;
                        switch (state.adtab) {
                            case 'campaignName':
                                opts = 'campain_option';
                                break;
                            case 'adSetName':
                                opts = 'set_option';
                                break;
                            case 'adName':
                                opts = 'ad_option';
                                break;
                        }

                        clearInterval(jobProcess);
                        console.log('复制异步结束');
                        commit('JOBPROCESSCOMPLETE', res);
                        dispatch('getAdlist', { option: state[opts], type: state.adtab })
                    }

                    commit('MESSAGECOUNT', res);
                }
            });
        } else {
            console.log('%c 您的浏览器不支持Websocket ', 'background:#222;color:#bada55');
        }
    },
    videoUrlTranslate({ state, commit }, { urls, originurl }) {
        let url = URL.videourl;

        _axios.post(url, urls, { fullScreen: true })
            .then(res => {
                Msgsuccess('转换完成');
                commit('VIDEOURL', { r: res, originurl });
            })
            .catch(err => {
                console.log(err);
            })
    },
    /***************************** index */
    getAppCount({ state, commit }) {
        let url = URL.applist;
        _axios.get(url)
            .then(res => {
                commit('APPCOUNT', res);

                let k = 'ifaccount';
                let v = true;
                commit('SETSTATE', { k, v });

            })
            .catch(err => {
                console.log(err);
            })
    },
    infoInit({ state, commit }, { startDate, endDate } = {}) {
        let url = URL.initurl;
        let params = {
            startDate,
            endDate
        };

        _axios.post(url, params)
            .then(res => {
                // console.log(res);
                let r = res;
                commit('INFO', r);
            })
            .catch(err => {
                console.log(err);
            })
    },
    selectApp({ state, commit, dispatch }) {
        let url = URL.appurl;

        let params = {
            fbAppId: state.appdataappid,
            startDate: state.appdatastartdate,
            endDate: state.appdataenddate,
            countryList: state.appdatacountry,
            impressionDeviceList: state.appdataimporession
            // orderByClause: state.appdatasort
        };

        _axios.post(url, params)
            .then(res => {
                let r = res;
                commit('APPINFO', r);
            })
            .catch(err => {
                console.log(err);
            })

        dispatch('selectApptable');
    },
    selectApptable({ state, commit }) {
        let url = URL.appurl;

        let params2 = {
            fbAppId: state.appdataappid,
            startDate: state.appdatastartdate,
            endDate: state.appdataenddate,
            flag: '1',
            pageNo: state.appdataindex,
            pageSize: state.appdatapagesize,
            countryList: state.appdatacountry,
            impressionDeviceList: state.appdataimporession,
            orderByClause: state.appdatasort,
            eventsName: localStorage.getItem(pandectEventLS.new) && JSON.parse(localStorage.getItem(pandectEventLS.new))[state.appdataappid] ? JSON.parse(localStorage.getItem(pandectEventLS.new))[state.appdataappid].join(',') : ""
        };

        // 合计
        let totalurl = URL.appcpitotal;
        Axios({
            url: totalurl,
            method: 'post',
            data: params2,
            success: res => {
                commit('APPINFOTABLETOTAL', res);
            }
        })

        _axios.post(url, params2)
            .then(res => {
                let r = res;
                commit('APPINFOTABLE', r);
            })
            .catch(err => {
                console.log(err);
            })
    },
    selectAppout({ state, commit }, name) {
        let url = URL.appurl;

        let params2 = {
            fbAppId: state.appdataappid,
            startDate: state.appdatastartdate,
            endDate: state.appdataenddate,
            flag: '1',
            pageNo: state.appdataindex,
            pageSize: state.appdatatotal,
            eventsName: localStorage.getItem(pandectEventLS.new) && JSON.parse(localStorage.getItem(pandectEventLS.new))[state.appdataappid] ? JSON.parse(localStorage.getItem(pandectEventLS.new))[state.appdataappid].join(',') : ""
        };
        _axios.post(url, params2)
            .then(res => {
                let r = res;
                commit('APPINFOTABLEOUT', { res, name });
            })
            .catch(err => {
                console.log(err);
            })
    },
    getCustomEvent({ state, commit }, applicationId) {
        let url = URL.customevent + 'applicationId=' + applicationId;

        _axios.get(url)
            .then(res => {
                commit('CUSTOMEVENT', res);
            })
            .catch(err => {
                console.log(err);
            })
    },
    /***************************** bm */
    getBmlist({ state, commit, dispatch }) {
        let url = URL.bmlist;

        _axios.get(url)
            .then(res => {
                commit('BMLIST', res);

                dispatch("getAccount");
                // dispatch("getAddAccount", { bmid, loadDom: 'addAccount' });
                dispatch("getPage");
                // dispatch("getAddPage", state.disbmid);
            })
            .catch(err => {
                console.log(err);
            })
    },
    getAddBmlist({ state, commit }, { loadDom }) {
        let url = URL.addbmlist;

        _axios.get(url, { loadDom })
            .then(res => {
                commit('ADDBMLIST', res);
            })
            .catch(err => {
                console.log(err);
            })
    },
    saveBm({ state, commit }, { bm }) {
        let url = URL.savebm;
        let params = bm.slice(0);

        _axios.post(url, params)
            .then(res => {
                if (res.code == 0)
                    commit('SAVEBM', bm);
            })
            .catch(err => {
                console.log(err);
            })
    },
    getAccount({ state, commit }, bmid) {
        let url = URL.bmaccountlist.replace('{bmid}', state.disbmid) + '&keyword=' + state.accountkwd;

        let key = ['pageIndex', 'pageSize'];

        let str = '';
        key.forEach(v => {
            if (state['bm_' + v])
                str += '&' + v + '=' + state['bm_' + v];
        });

        url = url + str;

        _axios.get(url)
            .then(res => {
                commit('SETACCOUNT', res);
            })
            .catch(err => {
                console.log(err);
            })
    },
    getAddAccount({ state, commit }, { bmid, loadDom = '' }) {
        let url = URL.addaccountlist.replace('{bmid}', bmid);

        _axios.get(url, { loadDom })
            .then(res => {
                commit('ADDACCOUNT', res);
            })
            .catch(err => {
                console.log(err);
            })
    },
    async saveAccount({ state, commit, dispatch }, { account }) {
        let url = URL.saveaccount;
        let params = account.slice(0);
        let bmid = state.disbmid;

        let res = await _axios.post(url, params)
            .then(res => res)
            .catch(err => {
                console.log(err);
            })

        if (res.code == 0) {
            dispatch("getAccount", bmid);
            dispatch("getAddAccount", { bmid });
        }
    },
    accountStatus({ state, commit }, { id, status }) {
        let url = URL.switchstatus;
        let params = {
            fbId: id,
            status: status
        };

        _axios.post(url, params)
            .then(res => {

            })
            .catch(err => {
                console.log(err);
            })

    },
    getPage({ state, commit }, bmid) {
        let url = URL.pagelist.replace('{bmid}', state.disbmid) + '&keyword=' + state.pagekwd;
        let key = ['pageIndex', 'pageSize'];

        let str = '';
        key.forEach(v => {
            if (state['bmpg_' + v])
                str += '&' + v + '=' + state['bmpg_' + v];
        });

        url = url + str;

        _axios.get(url)
            .then(res => {
                commit('SETPAGE', res);
            })
            .catch(err => {
                console.log(err);
            })
    },
    getAddPage({ state, commit }, { bmid, loadDom = '' }) {
        let url = URL.addpagelist.replace('{bmid}', bmid);

        _axios.get(url, { loadDom })
            .then(res => {
                commit('ADDPAGE', res);
            })
            .catch(err => {
                console.log(err);
            })
    },
    async savePage({ state, commit, dispatch }, { page }) {
        let url = URL.savepage;
        let params = page.slice(0);
        let bmid = state.disbmid;

        let res = await _axios.post(url, params)
            .then(res => res)
            .catch(err => {
                console.log(err);
            })

        if (res.code == 0) {
            dispatch("getPage", bmid);
            dispatch("getAddPage", { bmid });
        }
    },
    getPbia({ state, commit, dispatch }, id) {
        let url = URL.pbia.replace('{pageid}', id);

        Msgwarning('同步中...');

        _axios.get(url)
            .then(res => {
                Msgsuccess('同步成功');
                if (res.code == 0)
                    dispatch('getPage', state.disbmid)
                // location.reload();
            })
            .catch(err => {
                console.log(err);
            })
    },
    // app
    getApplist({ state, commit }) {
        let url = URL.applist;
        _axios.get(url)
            .then(res => {
                commit('SETAPPLIST', res);
            })
            .catch(err => {
                console.log(err);
            })
    },
    getAddApplist({ state, commit }, { loadDom }) {
        let url = URL.addapplist;

        _axios.get(url, { loadDom })
            .then(res => {
                commit('ADDAPP', res);
            })
            .catch(err => {
                console.log(err);
            })
    },
    saveApp({ state, commit, dispatch }, { app }) {
        let url = URL.saveapp;
        let params = app.slice(0);

        _axios.post(url, params)
            .then(res => {
                dispatch('getApplist');
            })
            .catch(err => {
                console.log(err);
            })
    },
    setApp({ state, commit }, { id, loading = '' }) {
        let url = URL.setapp.replace('{applicationid}', id);
        let _LOAD;

        if (loading) {
            let dom = document.getElementById(loading);
            _LOAD = Loading.service({ target: dom });
        }

        _axios.get(url)
            .then(res => {
                if (loading) {
                    _LOAD.close();
                }
                if (res.code == 0)
                    commit('SETAPP', res);
            })
            .catch(err => {
                console.log(err);
            })
    },
    canSetapp({ state, commit }, { id, loading = '' }) {
        let url = URL.cansetapp.replace('{applicationid}', id);
        let _LOAD;

        if (loading) {
            let dom = document.getElementById(loading);
            _LOAD = Loading.service({ target: dom });
        }

        _axios.get(url)
            .then(res => {
                if (loading) {
                    _LOAD.close();
                }
                if (res.code == 0)
                    commit('CANSETAPP', res);
            })
            .catch(err => {
                console.log(err);
            })
    },
    saveSet({ state, commit, dispatch }, { option }) {
        let url = URL.saveset;

        _axios.post(url, option, { loadDom: 'cansetapplist' })
            .then(res => {
                let id = option[0].applicationId;
                if (res.code == 0) {
                    dispatch('setApp', { id });
                    dispatch('canSetapp', { id, loading: 'cansetapplist' });

                    dispatch('getApplist');
                }
            })
            .catch(err => {
                console.log(err);
            })
    },
    delSet({ state, commit, dispatch }, { option }) {
        let url = URL.delset;

        _axios.post(url, option, { loadDom: 'setList' })
            .then(res => {
                let id = option[0].applicationId;
                if (res.code == 0) {
                    dispatch('setApp', { id, loading: 'setList' });
                    dispatch('canSetapp', { id });

                    dispatch('getApplist');
                }
            })
            .catch(err => {
                console.log(err);
            })
    },
    setAF({ state, commit, dispatch }, { application_id, market_type, af_key }) {
        let url = `${URL.setaf}application_id=${application_id}&market_type=${market_type}&af_key=${af_key}`;

        _axios.get(url)
            .then(res => {
                Msgsuccess(`${market_type}设置成功`);

                dispatch('getApplist');
            })
            .catch(err => {
                console.log(err);
            })
    },
    // manage
    getManagelist({ state, commit }, { status = '1', pageIndex = 1, pageSize = 20 }) {
        let url = URL.managelist.replace("{keywords}", state.projectkwd).replace("{status}", status).replace("{pageIndex}", pageIndex).replace("{pageSize}", pageSize);

        let load = Loading.service({ target: document.getElementById('manageTable') });

        _axios.get(url, { loadDom: 'manageTable' })
            .then(res => {
                if (load) {
                    load.close();
                }

                if (res.code == 0)
                    commit('MANAGELIST', res);
            })
            .catch(err => {
                console.log(err);
            })
    },
    manageApplist({ state, commit }) {
        let url = URL.applist;

        _axios.get(url)
            .then(res => {
                commit('MANAGEAPPLIST', res);
            })
            .catch(err => {
                console.log(err);
            })
    },
    addProject({ state, commit, dispatch }, { appid, pname, pplat, ptag, id }) {
        let url = URL.addproject;
        let params = {
            applicationId: appid,
            id: id,
            projectName: pname,
            projectPlatForm: pplat,
            projectTarget: ptag,
            status: true,
            token: localStorage.getItem('atom_token')
        }

        _axios.post(url, params)
            .then(res => {
                dispatch('getManagelist', {});
            })
            .catch(err => {
                console.log(err);
            })

    },
    headerAddProject({ state, commit, dispatch }, { appid, pname, pplat, ptag, route }) {
        let url = URL.addproject;
        let params = {
            applicationId: appid,
            // id: id,
            projectName: pname,
            projectPlatForm: pplat,
            projectTarget: ptag,
            status: true,
            token: localStorage.getItem('atom_token')
        }

        _axios.post(url, params)
            .then(res => {
                Msgsuccess('创建成功');
                setTimeout(function () {
                    route.push(`/manage`);
                }, 2000);
                // dispatch('getManagelist', {});

            })
            .catch(err => {
                console.log(err);
            })

    },
    editProject({ state, commit, dispatch }, { appid, pname, pplat, ptag, id }) {
        let url = URL.editproject;
        let params = {
            applicationId: appid,
            id: id,
            projectName: pname,
            projectPlatForm: pplat,
            projectTarget: ptag,
            status: true,
            token: localStorage.getItem('atom_token')
        }

        _axios.post(url, params)
            .then(res => {
                dispatch('getManagelist', {});
            })
            .catch(err => {
                console.log(err);
            })

    },
    overProject({ state, commit, dispatch }, { id, adIsOff }) {
        let url = URL.projectover;
        let params = {
            id,
            adIsOff
        };

        _axios.post(url, params)
            .then(res => {
                if (res.code == 0) {
                    dispatch('getManagelist', {});
                    dispatch("getItemList");
                }

            })
            .catch(err => {
                console.log(err);
            })
    },
    beginProject({ state, commit, dispatch }, { id }) {
        let url = URL.projectbegin;
        let params = {
            id
        };
        let status = 0;

        _axios.post(url, params)
            .then(res => {
                if (res.code == 0) {
                    dispatch("getManagelist", { status });
                    dispatch("getItemList");
                }
            })
            .catch(err => {
                console.log(err);
            })
    },
    // project rules
    getRules({ state, commit }, id) {
        let url = URL.getrules.replace('{projectId}', id);

        _axios.get(url)
            .then(res => {
                commit('RULES', res);
            })
            .catch(err => {
                console.log(err);
            })
    },
    getRuleList({ state, commit }) {
        let url = URL.getrulelist;
        let str = '';
        Object.keys(state.ruleoption).forEach(v => {
            if(state.ruleoption[v])
                str += `&${v}=${state.ruleoption[v]}`;
        })
        str = str.substr(1);
        url += str;

        Axios({
            url,
            success: res => {
                commit('GETRULELIST', res);
            }
        })
    },
    openRule({ state, commit }, { projid, ruleGroupId }) {
        let url = URL.openrule.replace('{projectId}', projid);
        let params = {
            ruleGroupId
        }

        _axios.post(url, params)
            .then(res => {
                // commit('RULES', res);
            })
            .catch(err => {
                console.log(err);
            })
    },
    closeRule({ state, commit }, { projid, ruleGroupId }) {
        let url = URL.closerule.replace('{projectId}', projid);
        let params = {
            ruleGroupId
        }

        _axios.post(url, params)
            .then(res => {
                // commit('RULES', res);
            })
            .catch(err => {
                console.log(err);
            })

    },
    getRuleAccount({ state, commit }, id) {
        let url = URL.setapp.replace('{applicationid}', id);

        _axios.get(url)
            .then(res => {
                commit('RULEACCOUNT', res);
            })
            .catch(err => {
                console.log(err);
            })
    },
    getOptimizeAccount({ state, commit }, id) {
        let url = URL.optimizeadaccount + 'projectId=' + id;

        _axios.get(url)
            .then(res => {
                commit('OPTIMIZEACCOUNT', res);
            })
            .catch(err => {
                console.log(err);
            })
    },
    getOptimizeList({ state, commit }, { optlist, projectId }) {
        let url = URL.optimize.replace('{projectId}', projectId);

        let str = '';
        for (let i in optlist) {
            if (optlist[i])
                str += `&${i}=${optlist[i]}`;
        }

        url += str.substr(1);

        _axios.get(url)
            .then(res => {
                commit('OPTIMIZELIST', res);
            })
            .catch(err => {
                console.log(err);
            })
    },
    // create
    matchFileMD5({ state, commit }, { md5, file, list, type, tabvalue, on, vdname }) {
        let url = URL.matchmd5;

        // console.log(list);

        _axios.post(url, md5)
            .then(res => {
                if (res.code == 0 && res.data.length > 0) {
                    // 设置上传状态，true为上传完成，允许提交
                    commit('SETSTATE', { k: on, v: true });

                    if (type == 'video' && !list.find(v => v.processVIO[0] && v.processVIO[0].videoHash == res.data[0].md5)) {
                        list.forEach((h, j) => {
                            if (h.name == tabvalue) {
                                list[j].processVIO.push({ videoHash: res.data[0].md5, fmname: '' });
                            }
                        });
                    }
                    if (type == 'img' && !list.find(v => v.processIMG[0] && v.processIMG[0].imageHash == res.data[0].md5)) {
                        list.forEach((h, j) => {
                            if (h.name == tabvalue) {
                                list[j].processIMG.push({ imageHash: res.data[0].md5 });
                            }
                        });
                    }

                    let obj = null;
                    // let oj = null;
                    let idx = 0;
                    list.forEach((v, i) => {
                        if (type == 'img' && v.name == tabvalue) {
                            v.processIMG[0].imageUrl = res.data[0].targetName;
                            v.processIMG[0].name = file.name;
                            v.processIMG[0].process = 100;
                        }
                        if (type == 'video' && v.name == tabvalue) {
                            v.processVIO[0].videoUrl = res.data[0].targetName;
                            v.processVIO[0].name = file.name;
                            v.processVIO[0].process = 100;
                        }
                        if (type == 'fm' && v.name == tabvalue) {
                            idx = i;
                            obj = v;
                            obj.processVIO[0].fmname = file.name;
                            obj.processVIO[0].fmUrl = res.data[0].targetName;
                            obj.processVIO[0].fmHash = res.data[0].md5;
                            obj.processVIO[0].fmprocess = 100;
                        }
                    });
                    if (type == 'fm') {
                        list.splice(idx, 1);
                        list.splice(idx, 0, obj);
                    }
                    file.cancel();
                    file.remove();

                    console.log(list);
                } else {
                    file.upload();
                }
            })
            .catch(err => {
                console.log(err);
            })
    },
    matchMutiFileMD5({ state, commit }, { md5, file, list, type, on, vdname, callback = null, maxcount = 0 }) {
        let url = URL.matchmd5;

        // 阻塞
        // await setTimeout(() => {return true}, 500);
        // console.log(list, vdname);

        _axios.post(url, md5)
            .then(res => {
                /**
                 * 20180130新增创建广告模块，图片视频素材最大数量判断
                 */
                if (type == 'img') {
                    if (maxcount && list.length + state.imgspwant >= maxcount) {
                        Msgwarning("图片素材最多上传10张");
                        file.cancel();
                        file.remove();

                        state.imgspwant++;
                        state.wantupload++;
                        return;
                    } else {
                        state.imgspwant++;
                        state.wantupload++;
                    }
                } else {
                    if (maxcount && list.length + state.viospwant >= maxcount) {
                        Msgwarning("视频素材最多上传10个");
                        file.cancel();
                        file.remove();

                        state.viospwant++;
                        state.wantupload++;
                        return;
                    } else {
                        state.viospwant++;
                        state.wantupload++;
                    }
                }

                if (res.code == 0 && res.data.length > 0) {
                    // 设置上传状态，true为上传完成，允许提交
                    commit('SETSTATE', { k: on, v: true });

                    if (type == 'img' && !list.find(v => v.imageHash == res.data[0].md5)) {
                        list.push({ imageHash: res.data[0].md5 });
                        state.imgspwant--;
                    }
                    if (type == 'video' && !list.find(v => v.videoHash == res.data[0].md5)) {
                        list.push({ videoHash: res.data[0].md5 });
                        state.viospwant--;
                    }

                    let obj = null;
                    let oj = null;
                    let idx = 0;
                    list.forEach((v, i) => {
                        if (type == 'img' && v.imageHash == res.data[0].md5) {
                            v.imageUrl = res.data[0].targetName;
                            v.name = file.name;
                            v.process = 100;
                        }
                        if (type == 'video' && v.videoHash == res.data[0].md5) {
                            v.videoUrl = res.data[0].targetName;
                            v.name = file.name;
                            v.process = 100;
                        }
                        if (type == 'fm' && v.name == vdname) {
                            idx = i;
                            obj = v;
                            oj = {
                                ...obj,
                                fmname: file.name,
                                fmUrl: res.data[0].targetName,
                                fmHash: res.data[0].md5,
                                fmprocess: 100
                            }
                        }
                    });
                    if (type == 'fm') {
                        list.splice(idx, 1);
                        list.splice(idx, 0, oj);
                    }
                    file.cancel();
                    file.remove();
                    // 计算总条数，适用于批量新增创意
                    if (callback) callback();
                } else if (type == 'fm') {
                    file.upload();
                }
                // else {
                //     // console.log(file, '-------------uploading')
                //     file.upload();
                // }
            })
            .catch(err => {
                console.log(err);
            })
    },
    fileUpload({ state, commit }, { option }) {
        let url = URL.fileupload;

        let params = new FormData();
        params.append('file', option);

        _axios.post(url, params)
            .then(res => {

            })
            .catch(err => {
                console.log(err);
            })
    },
    getClassify({ state, commit }, projectid) {
        let url = URL.classify.replace('{projectid}', projectid);

        _axios.get(url)
            .then(res => {
                commit('CLASSIFY', res);
            })
            .catch(err => {
                console.log(err);
            })
    },
    getCountries({ state, commit }, projectid) {
        let url = URL.createcountry + 'projectId=' + projectid;

        _axios.get(url)
            .then(res => {
                commit('COUNTRIES', res);
            })
            .catch(err => {
                console.log(err);
            })
    },
    getCreateList({ state, commit }, { loading = false } = {}) {
        let url = URL.createlist;
        let option = ['creativityName', 'classify', 'countryId', 'sex', 'status', 'pageIndex', 'pageSize', 'projectId'];
        let load;

        let str = '';
        option.forEach(v => {
            if (state['cr_' + v])
                str += '&' + v + '=' + state['cr_' + v];
        });

        url = url + str.substr(1);

        if (loading) {
            load = Loading.service({ target: document.getElementById(loading) });
        }

        _axios.get(url)
            .then(res => {
                if (load)
                    load.close();

                commit('CREATE', res);
            })
            .catch(err => {
                console.log(err);
            })
    },
    updateSex({ state, commit, dispatch }, { id, sex, creativityName, countryId }) {
        let url = URL.updatesex;
        let params = {
            sex,
            id,
            creativityName,
            countryId
        }

        _axios.post(url, params)
            .then(res => {
                dispatch('getCreateList');
            })
            .catch(err => {
                console.log(err);
            })
    },
    openCreate({ state, commit, dispatch }, { option }) {
        let url = URL.createopen;
        let params = option;

        _axios.post(url, params)
            .then(res => {
                dispatch('getCreateList');
            })
            .catch(err => {
                console.log(err);
            })
    },
    syncAll({ state, commit }, { accountIds, projectId }) {
        let url = `${URL.syncall}accountIds=${accountIds}&projectId=${projectId}`;

        _axios.get(url)
            .then(res => {
                // Msgsuccess('同步成功');
            })
            .catch(err => {
                console.log(err);
            })
    },
    syncGroup({ state, commit }, { accountIds, ids, projectId }) {
        let url = `${URL.syncgroup}`;
        let params = new URLSearchParams();
        params.append('accountIds', accountIds);
        params.append('ids', ids);
        params.append('projectId', projectId);

        _axios.post(url, params)
            .then(res => {
                // Msgsuccess('同步成功');
            })
            .catch(err => {
                console.log(err);
            })
    },
    syncTime({ state, commit }, { accountIds, ids, projectId }) {
        let url = `${URL.synctime}accountIds=${accountIds}&ids=${ids}&projectId=${projectId}`;

        _axios.get(url)
            .then(res => {
                commit('SYNCTIME', res);
            })
            .catch(err => {
                console.log(err);
            })
    },
    closeCreate({ state, commit, dispatch }, { option }) {
        let url = URL.createclose;
        let params = option;

        _axios.post(url, params)
            .then(res => {
                dispatch('getCreateList');
            })
            .catch(err => {
                console.log(err);
            })
    },
    addCountries({ state, commit, dispatch }, { creativityIds, countryId }) {
        let url = URL.addcountries.replace('{creativityIds}', creativityIds).replace('{countryId}', countryId);

        _axios.get(url)
            .then(res => {
                dispatch('getCreateList');
            })
            .catch(err => {
                console.log(err);
            })
    },
    getAllpages({ state, commit }) {
        let url = URL.allpagelist;

        _axios.get(url)
            .then(res => {
                commit('ALLPAGES', res);
            })
            .catch(err => {
                console.log(err);
            })
    },
    getAllactions({ state, commit }) {
        let url = URL.actionlist;

        _axios.get(url)
            .then(res => {
                commit('ALLACTIONS', res);
            })
            .catch(err => {
                console.log(err);
            })
    },
    toAddCreate({ state, commit, dispatch }, { option, id }) {
        let url = URL.toaddcreate;

        _axios.post(url, option)
            .then(res => {
                Msgsuccess('新增成功');

                dispatch('getCreateList', { loading: 'createList' });
                // 重新获取分类以及国家
                dispatch("getClassify", id);
                dispatch("getCountries", id);
            })
            .catch(err => {
                console.log(err);
            })
    },
    addCreates({ state, commit, dispatch }, { option, id }) {
        let url = URL.addcreates;

        _axios.post(url, option, { fullScreen: true })
            .then(res => {
                Msgsuccess(`${option.length}个创意提交成功`);
                dispatch('getCreateList', { loading: 'createList' });

                // 重新获取分类以及国家
                dispatch("getClassify", id);
                dispatch("getCountries", id);
            })
            .catch(err => {
                console.log(err);
            })
    },
    // sync
    syncList({ state, commit }, { loading = false } = {}) {
        let url = URL.synclist;
        let load;

        let option = ['keyWords', 'status', 'fbAccountId', 'pageIndex', 'pageSize', 'projectId'];

        let str = '';
        option.forEach(v => {
            if (state['sync_' + v])
                str += '&' + v + '=' + state['sync_' + v];
        });

        url = url + str.substr(1);

        if (loading) {
            load = Loading.service({ target: document.getElementById(loading) });
        }

        _axios.get(url)
            .then(res => {
                if (load)
                    load.close();

                commit('SYNCLIST', res);
            })
            .catch(err => {
                console.log(err);
            })
    },
    synclistall({ state, commit, dispatch }, { ids }) {
        let url = URL.synclistall.replace('{ids}', ids);

        _axios.get(url)
            .then(res => {
                dispatch('syncList');
            })
            .catch(err => {
                console.log(err);
            })
    },
    // gener
    otherCountries({ state, commit }) {
        let url = URL.countries;

        _axios.get(url)
            .then(res => {
                commit('OTHERCOUNTRIES', res);
            })
            .catch(err => {
                console.log(err);
            })
    },
    getLanguage({ state, commit }) {
        let url = URL.language;

        _axios.get(url)
            .then(res => {
                commit('LANGUAGE', res);
            })
            .catch(err => {
                console.log(err);
            })
    },
    getInterests({ state, commit }) {
        let url = URL.interests;

        _axios.get(url)
            .then(res => {
                commit('INTERESTS', res);
            })
            .catch(err => {
                console.log(err);
            })
    },
    getPlatform({ state, commit }, { applicationid }) {
        let url = URL.platform.replace('{applicationid}', applicationid);

        _axios.get(url)
            .then(res => {
                commit('PLATFORM', res);
            })
            .catch(err => {
                console.log(err);
            })
    },
    getCreatePlatform({ state, commit }, { applicationid }) {
        let url = URL.platform.replace('{applicationid}', applicationid);

        _axios.get(url)
            .then(res => {
                commit('CREATEPLATFORM', res);
            })
            .catch(err => {
                console.log(err);
            })
    },
    getSystem({ state, commit }, { os }) {
        let url = URL.system.replace('{os}', os);

        _axios.get(url)
            .then(res => {
                commit('SYSTEM', res);
            })
            .catch(err => {
                console.log(err);
            })
    },
    getOtherCreateList({ state, commit }) {
        let url = URL.createlist;
        let option = ['creativityName', 'classify', 'countryId', 'sex', 'status', 'projectId'];

        let str = '';
        option.forEach(v => {
            if (state['cr_' + v])
                str += '&' + v + '=' + state['cr_' + v];
        });

        url = url + str.substr(1);

        _axios.get(url)
            .then(res => {
                commit('CREATE', res);
            })
            .catch(err => {
                console.log(err);
            })
    },
    createGener({ state, commit }, { option }) {
        let url = URL.creategener;
        let params = option.planInfoVO;
        let route = option.route;
        let projectid = option.projectid;

        _axios.post(url, params, { fullScreen: true })
            .then(res => {
                Msgsuccess('创建成功');
                setTimeout(function () {
                    route.push(`/project/${projectid}/plan`);
                }, 1000);
            })
            .catch(err => {

            })
    },
    getPlanlist({ state, commit }, { loading = false } = {}) {
        let url = URL.planlist;
        let load;
        let option = ['project_id',
            'country',
            'platform',
            'keyword',
            'pageIndex',
            'pageSize'];

        let str = '';
        option.forEach(v => {
            if (state['pl_' + v])
                str += '&' + v + '=' + state['pl_' + v];
        });

        url = url + str.substr(1);

        if (loading) {
            load = Loading.service({ target: document.getElementById(loading) });
        }

        _axios.get(url)
            .then(res => {
                if (load)
                    load.close();

                commit('PLANLIST', res);
            })
            .catch(err => {
                console.log(err);
            })
    },
    getPlanCountry({ state, commit }, v) {
        let url = URL.plancountry.replace('{projectid}', v);

        _axios.get(url)
            .then(res => {
                commit('PLANCOUNTRY', res);
            })
            .catch(err => {
                console.log(err);
            })
    },
    changePrice({ state, commit, dispatch }, { goalBid, planId }) {
        let url = URL.changeprice;
        let params = {
            goalBid, planId
        }

        _axios.post(url, params)
            .then(res => {
                dispatch('getPlanlist');
            })
            .then(err => {
                console.log(err);
            })
    },
    getInuseCreate({ state, commit, dispatch }, { plan_id = '', pageIndex = 1, pageSize = 20, loadDom = '', fullScreen = '' }) {
        let url = URL.inusecreate;

        let str = '';
        str += 'plan_id=' + plan_id;
        str += '&pageIndex=' + pageIndex;
        str += '&pageSize=' + pageSize;
        if (state.plcreatestatus)
            str += '&status=' + state.plcreatestatus;
        if (state.plcreateclassify)
            str += '&classify=' + state.plcreateclassify;
        if (state.plcreatekeyword)
            str += '&keyword=' + state.plcreatekeyword;

        url += str;

        _axios.get(url, { loadDom, fullScreen })
            .then(res => {
                commit('INUSECREATE', res);
            })
            .catch(err => {
                console.log(err);
            })

    },
    getNouseCreate({ state, commit, dispatch }, { plan_id = '', pageIndex = 1, pageSize = 20, fullScreen = '' }) {
        let url = URL.nousecreate;

        let str = '';
        str += 'plan_id=' + plan_id;
        str += '&pageIndex=' + pageIndex;
        str += '&pageSize=' + pageSize;
        if (state.plcreateclassify)
            str += '&classify=' + state.plcreateclassify;
        if (state.plcreatekeyword)
            str += '&keyword=' + state.plcreatekeyword;

        url += str;

        _axios.get(url, { fullScreen })
            .then(res => {
                commit('NOUSECREATE', res);
            })
            .catch(err => {
                console.log(err);
            })

    },
    addCreate({ state, commit, dispatch }, { option }) {
        let url = URL.addcreate;

        _axios.post(url, option, { fullScreen: true })
            .then(res => {
                let plan_id = option[0].planId;
                dispatch('getInuseCreate', { plan_id });
                dispatch('getNouseCreate', { plan_id, fullScreen: true });
                dispatch('getPlanlist');
            })
            .catch(err => {
                console.log(err);
            })
    },
    delCreate({ state, commit, dispatch }, { option }) {
        let url = URL.delcreate;

        _axios.post(url, option, { fullScreen: true })
            .then(res => {
                let plan_id = option[0].planId;
                dispatch('getInuseCreate', { plan_id, fullScreen: true });
                dispatch('getNouseCreate', { plan_id });
                dispatch('getPlanlist');
            })
            .catch(err => {
                console.log(err);
            })
    },
    autoSelect({ state, commit, dispatch }, { plan_id, creative_type, creative_num, creative_strategy, creative_classify }) {
        let url = URL.autoselect;

        let str = '';
        str += 'plan_id=' + plan_id;
        str += '&creative_type=' + creative_type;
        str += '&creative_num=' + creative_num;
        str += '&creative_strategy=' + creative_strategy;
        str += '&creative_classify=' + creative_classify;

        url += str;

        _axios.get(url, { fullScreen: true })
            .then(res => {
                let r = res.data;
                if (!r || r.length == 0)
                    Msgwarning('没有找到合适的创意');
                else {
                    dispatch('delAllCreate', { planId: plan_id, type: 10, result: res.data });
                }
                // dispatch('getPlanlist');
            })
            .catch(err => {
                console.log(err);
            })
    },
    async delAllCreate({ state, commit, dispatch }, { planId, type, result }) {
        let url = URL.delallcreate;
        let planIdList = [planId];
        let plan_id = planId;

        let res = await _axios.post(url, planIdList)
            .then(res => res)
            .catch(err => {
                console.log(err);
            })

        if (res.code == 0) {
            if (type == 10) {
                if (!result || result.length == 0) {
                    Msgwarning('未找到数据');
                    return;
                }
                let option = [];
                result.forEach(v => {
                    let obj = {
                        creativeId: v.id,
                        planId: plan_id,
                        creativeStatus: v.status
                    };

                    option.push(obj);
                });

                dispatch("addCreate", { option });
            } else {
                dispatch('getInuseCreate', { plan_id, fullScreen: true });
                dispatch('getNouseCreate', { plan_id });
                dispatch('getPlanlist');
            }
        }
    },
    addAllCreate({ state, commit, dispatch }, { planId }) {
        let url = `${URL.addallcreate}plan_id=${planId}&keyword=${state.plcreatekeyword}&status=${state.plcreatestatus}&classify=${state.plcreateclassify}`;

        _axios.get(url)
            .then(res => {
                let plan_id = planId;
                dispatch('getInuseCreate', { plan_id });
                dispatch('getNouseCreate', { plan_id, fullScreen: true });
                dispatch('getPlanlist');
            })
            .catch(err => {
                console.log(err);
            })
    },
    getAccountList({ state, commit }, { plan_id, loadDom = '', fullScreen = '' }) {
        let url = URL.accountlist;
        url += 'plan_id=' + plan_id;

        _axios.get(url, { loadDom, fullScreen })
            .then(res => {
                commit('ACCOUNTLIST', res);
            })
            .catch(err => {
                console.log(err);
            })
    },
    addAccount({ state, commit, dispatch }, { option }) {
        let url = URL.addaccount;

        console.log(option);

        _axios.post(url, option, { fullScreen: true })
            .then(res => {
                let plan_id = option[0].planId;
                dispatch('getAccountList', { plan_id, fullScreen: true });
                dispatch('getPlanlist');
            })
            .catch(err => {
                console.log(err);
            })
    },
    delAccount({ state, commit, dispatch }, { option }) {
        let url = URL.delaccount;

        _axios.post(url, option, { fullScreen: true })
            .then(res => {
                let plan_id = option[0].planId;
                dispatch('getAccountList', { plan_id, fullScreen: true });
                dispatch('getPlanlist');
            })
            .catch(err => {
                console.log(err);
            })
    },
    getLog({ state, commit }, { plan_id, loadDom = '' }) {
        let url = URL.planlog;
        url += 'plan_id=' + plan_id;

        _axios.get(url, { loadDom })
            .then(res => {
                commit('LOGLIST', res);
            })
            .catch(err => {
                console.log(err);
            })
    },
    getLogdetail({ state, commit }) {
        let url = URL.logdetail + 'batch_id=' + state.logdetailid;

        _axios.get(url)
            .then(res => {
                commit('LOGDETAIL', res);
            })
            .catch(err => {
                console.log(err);
            })
    },
    // getFailReason({ state, commit }, campaign_id) {
    //     let url = URL.adfailreason + 'campaign_id=' + campaign_id;

    //     _axios.get(url)
    //         .then(res => {
    //             // commit('LOGDETAIL', res);
    //         })
    //         .catch(err => {
    //             console.log(err);
    //         })
    // },
    createLogad({ state, commit, dispatch }, { option }) {
        let url = URL.logcreate;
        _axios.post(url, option)
            .then(res => {
                commit('LOGCREATE', { res, option });
                dispatch('getLogdetail');

                dispatch('getPlanlist');
            })
            .catch(err => {
                commit('LOGCREATEFAIL');
                console.log(err);
            })
    },
    getCreateNum({ state, commit }, planid) {
        let url = `${URL.logcreatenum}plan_id=${planid}`;

        _axios.get(url)
            .then(res => {
                commit('CREARENUM', res);
            })
            .catch(err => {
                console.log(err);
            })
    },
    getCreateInfo({ state, commit }, { plan_id }) {
        let url = URL.createinfo + 'plan_id=' + plan_id;

        _axios.get(url)
            .then(res => {
                commit('CREATEINFO', res);
            })
            .catch(err => {
                console.log(err);
            })
    },
    editGener({ state, commit }, { option }) {
        let url = URL.editcreate;
        let params = option.planInfoVO
        let route = option.route;
        let projectid = option.projectid;

        // console.log(option);
        // return;
        _axios.post(url, params, { fullScreen: true })
            .then(res => {
                Msgsuccess('编辑成功');
                commit('RESETEDIT');
                setTimeout(function () {
                    route.push(`/project/${projectid}/plan`);
                }, 1000);
            })
            .catch(err => {

            })
    },
    openPlan({ state, commit }, { option }) {
        let url = URL.openplan;

        _axios.post(url, option)
            .then(res => {

            })
            .catch(err => {
                console.log(err);
            })
    },
    closePlan({ state, commit }, { option }) {
        let url = URL.closeplan;

        _axios.post(url, option)
            .then(res => {

            })
            .catch(err => {
                console.log(err);
            })
    },
    async syncCreate({ state, commit, dispatch }, { planid, createnum, projectId }) {
        let createurl = `${URL.inusecreate}plan_id=${planid}&pageIndex=1&pageSize=${createnum}`;
        let accounturl = `${URL.accountlist}plan_id=${planid}`;

        let create = await dispatch('planCreateAccount', createurl);
        let account = await dispatch('planCreateAccount', accounturl);

        let createid = create.data.list.map(v => v.id);
        let accountid = account.data.usedAdaccounts.map(v => v.fbId);

        dispatch('syncGroup', { accountIds: accountid.join(','), ids: createid.join(','), projectId })
    },
    planCreateAccount({ state, commit }, url) {
        return _axios.get(url)
            .then(res => res)
            .catch(err => {
                console.log(err);
            })
    },
    generTargetList({ state, commit }, { fb_account_ids }) {
        let url = `${URL.genertarget}adaccount_ids=${fb_account_ids}`;

        _axios.get(url)
            .then(res => {
                commit('GENERTARGET', res);
            })
            .catch(err => {
                console.log(err);
            })
    },
    generAccountList({ state, commit }, { audience_ids, project_id }) {
        let url = `${URL.generaccount}audience_ids=${audience_ids}&project_id=${project_id}`;

        _axios.get(url)
            .then(res => {
                commit('GENERACCOUNT', res);
            })
            .catch(err => {
                console.log(err);
            })
    },
    bidGuide({ state, commit }, { country, fbApplicationId, billingEvent }) {
        let url = `${URL.bidguide}country=${country}&fbApplicationId=${fbApplicationId}&billingEvent=${billingEvent}`;

        _axios.get(url)
            .then(res => {
                commit('BIDGUIDE', res);
            })
            .catch(err => {
                console.log(err);
            })
    },
    getClassifyForPlan({ state, commit }, projectid) {
        let url = URL.classify.replace('{projectid}', projectid);

        Axios({
            url,
            success: res => {
                commit('CLASSIFYFORPLAN', res);
            }
        })
    },
    classifyFilterCount({ state, commit }, { planid, creativetype, classify }) {
        let url = `${URL.classifyfilter}plan_id=${planid}&creative_type=${creativetype}&classify=${classify}`;

        Axios({
            url,
            success: res => {
                commit('CLASSIFYFILTERCOUNT', res);
            }
        })
    },
    classifyFilterCountNoPlan({ state, commit }, { country, gender, projectId, creativetype, classify }) {
        let url = `${URL.classifyfilternoplan}country=${country}&gender=${gender}&projectId=${projectId}&creative_type=${creativetype}&classify=${classify}`;

        Axios({
            url,
            success: res => {
                commit('CLASSIFYFILTERCOUNT', res);
            }
        })
    },

    // ad
    getAdPlanlist({ state, commit }, projectid) {
        let url = `${URL.planlist}project_id=${projectid}&pageIndex=1&pageSize=1000`;

        _axios.get(url)
            .then(res => {
                commit('ADPLANLIST', res);
            })
            .catch(err => {
                console.log(err);
            })
    },
    getCustomEventAd({ state, commit }, applicationId) {
        let url = URL.customevent + 'applicationId=' + applicationId;

        _axios.get(url)
            .then(res => {
                commit('CUSTOMEVENTAD', { r: res, applicationId });
            })
            .catch(err => {
                console.log(err);
            })
    },
    deleteSearchCondition({ state, commit, dispatch }, { id, userId, projectId }) {
        let url = `${URL.deletecondition}id=${id}`;

        _axios.get(url)
            .then(res => {
                dispatch('getSearchCondition', { userId: userId, projectId: projectId });
            })
            .catch(err => {
                console.log(err);
            })
    },
    getSearchCondition({ state, commit, dispatch }, { userId, projectId }) {
        let url = `${URL.getcondition}userId=${userId}&projectId=${projectId}`;

        _axios.get(url)
            .then(res => {
                commit('GETCONDITION', res);
            })
            .catch(err => {
                console.log(err);
            })
    },
    saveSearchCondition({ state, commit, dispatch }, option) {
        let url = URL.savecondition;
        let str = '';

        for (let i in option) {
            str += `&${i}=${option[i]}`
        }
        url += str.substring(1);

        _axios.get(url)
            .then(res => {
                dispatch('getSearchCondition', { userId: option.userId, projectId: option.projectId });
            })
            .catch(err => {
                console.log(err);
            })
    },
    getUpdateTime({ state, commit }) {
        let url = URL.updatetime;

        _axios.get(url)
            .then(res => {
                commit('UPDATETIME', res);
            })
            .catch(err => {
                console.log(err);
            })
    },
    async getAdlist({ state, commit, dispatch }, { option, loading = false, fullScreen = true, type, applicationid, editType = '', name = '', customOption = null, outNotify = null }) {
        let url = URL.adlistnew;
        let load;
        applicationid = applicationid ? applicationid : state.adapplicationid;
        let eventsName = localStorage.getItem(adEventLS.new) && JSON.parse(localStorage.getItem(adEventLS.new))[applicationid] ? JSON.parse(localStorage.getItem(adEventLS.new))[applicationid].join(',') : '';
        /*
         * 如果广告系列有勾选，则广告组以及广告根据筛选条件来获取数据
         * 如果广告组有勾选，则广告栏根据筛选条件来获取数据，优先级高于广告系列 
         * */
        let opt = {
            startDate: state.adstarttime,
            endDate: state.adendtime,
            ...option
        }
        // console.log(state.adaccountid);
        // console.log(11111);
        if (state.adaccountid && state.adaccountid.length > 0)
            opt.accountIdStr = state.adaccountid.join(',');
        if (state.adplanid)
            opt.planId = state.adplanid;
        if (eventsName)
            opt.eventsName = eventsName;

        let group = ''
        if (type == 'campaignName') {
            group = 'campaign_id';
        }
        if (type == 'adSetName') {
            group = 'adset_id';
            if (state.campainsortlist.length > 0)
                opt.campaignIdInStr = state.campainsortlist.map(v => v.campaignId).join(',');
        }
        if (type == 'adName') {
            group = 'ad_id';
            if (state.setsortlist.length > 0)
                opt.adSetIdInStr = state.setsortlist.map(v => v.adsetId).join(',');
            else if (state.campainsortlist.length > 0)
                opt.campaignIdInStr = state.campainsortlist.map(v => v.campaignId).join(',');
        }

        opt.groupByClause = group;

        if (fullScreen) {
            load = Loading.service({ fullscreen: fullScreen });
        }

        // 区分列表请求和导出数据
        if (!editType) {
            // 获取合计数据
            let totalurl = URL.adlisttotal;
            commit('SETSTATE', { k: 'adlisttotal', v: {} })
            Axios({
                url: totalurl,
                method: 'post',
                data: opt,
                success: res => {
                    commit('ADLISTTOTAL', res);
                }
            })

            _axios.post(url, opt, {
                timeout: 20000
            })
                .then(async res => {
                    if (load)
                        load.close();

                    commit('ADLIST', { res, type, dateCond: opt.dateOptions, editType, name, customOption })
                    // 获取更新时间情况
                    dispatch('getUpdateTime');
                })
                .catch(err => {
                    console.log(`%c${err}`, 'color: blue');

                    // 超时之后增加提示，区分非导出全部情况
                    if (load)
                        load.close();

                    commit('ADLISTTIMEOUT');
                })
        } else {
            let timeCount = 2500; // 导出分批请求，每批的条数
            let totalCount = opt.pageSize;
            let exportData = [];
            opt.pageSize = timeCount;
            for (let i = 0; i < totalCount / timeCount; i++) {
                opt.pageNo = i + 1;
                console.log(`%cpage ${i + 1}`, 'color: orange');
                let datares = await _axios.post(url, opt)
                    .then(res => res.data.list)
                    .catch(err => {
                        console.log(`%cexport ${err}`, 'color: blue');
                        // MsgnotifyError('导出错误', '接口超时，减少数据量后重试');
                    })
                // 如果失败了一次，则退出整个导出循环
                if (datares && datares.length > 0)
                    exportData = exportData.concat(datares);
                else
                    break;
            }
            outNotify.close();
            // 打开导出按钮状态
            commit('SETSTATE', { k: 'exportstatus', v: true });
            if (exportData.length > timeCount * (Math.ceil(totalCount / timeCount) - 1)) {
                MsgnotifySuccess('导出成功', '正在下载文件');
                commit('ADLIST', { res: { data: { list: exportData } }, type, dateCond: opt.dateOptions, editType, name, customOption })
            } else {
                MsgnotifyError('导出错误', '接口超时，减少数据量后重试');
            }
        }
    },
    getAdaccount({ state, commit }, projectId) {
        let url = `${URL.adaccountlist}projectId=${projectId}`;

        _axios.get(url)
            .then(res => {
                commit('ADACCOUNT', res)
            })
            .catch(err => {
                console.log(err);
            })
    },
    changeAdstatus({ state, commit, dispatch }, { option, type, fullScreen }) {
        let url = URL.changeadstatus;

        let str = '';
        for (let i in option) {
            if (option[i] !== '')
                str += '&' + i + '=' + option[i];
        }

        url += str.substr(1);

        let opts;
        switch (type) {
            case 'campaignName':
                opts = 'campain_option';
                break;
            case 'adSetName':
                opts = 'set_option';
                break;
            case 'adName':
                opts = 'ad_option';
                break;
        }

        Axios({
            url,
            fullscreen: fullScreen,
            success: res => {
                if (res.code == 0) {
                    Msgsuccess('更新成功');
                    commit('CHANGESTATUS', option);
                    setTimeout(() => {
                        dispatch('getAdlist', { option: state[opts], type })
                    }, 2000);
                }
            }
        })
    },
    resetName({ state, commit, dispatch }, { id, name, type }) {
        let url = `${URL.resetname}`;
        let opts;
        switch (type) {
            case 'campaignName':
                url += `fbAdCampaignId=${id}&name=${name}`;
                opts = 'campain_option';
                break;
            case 'adSetName':
                url += `fbAdSetId=${id}&name=${name}`;
                opts = 'set_option';
                break;
            case 'adName':
                url += `fbAdId=${id}&name=${name}`;
                opts = 'ad_option';
                break;
        }

        _axios.get(url, { fullScreen: true })
            .then(res => {
                Msgsuccess('重命名成功');
                dispatch('getAdlist', { option: state[opts], type });
            })
            .catch(err => {
                console.log(err);
            })
    },
    seekReplace({ state, commit, dispatch }, { data, type }) {
        let url = `${URL.seekreplace}`;
        let opts;
        let typename = '';
        switch (type) {
            case 'campaignName':
                url += `adCampaignData=${data}`;
                opts = 'campain_option';
                typename = '广告系列';
                break;
            case 'adSetName':
                url += `adSetData=${data}`;
                opts = 'set_option';
                typename = '广告组';
                break;
            case 'adName':
                url += `adData=${data}`;
                opts = 'ad_option';
                typename = '广告';
                break;
        }

        Axios({
            url,
            fullscreen: true,
            success: res => {
                let obj = Object.entries(res.data);
                let failobj = obj.filter(v => !v[1]);
                if (failobj.length > 0) {
                    let failname = failobj.map(v => v[0]).join(',');
                    Msgerror(`以下${typename}查找替换失败：${failname}`);
                } else {
                    Msgsuccess('查找替换成功');
                }

                dispatch('getAdlist', { option: state[opts], type })
            }
        })
    },
    seekReplaceCreate({ state, commit, dispatch }, { option }) {
        let url = URL.seekreplacecreate;

        Axios({
            url,
            method: 'post',
            data: option,
            fullscreen: true,
            success: res => {
                Msgsuccess('提交成功');
                // 重置定时器
                clearInterval(jobProcess);
                setTimeout(function () {
                    dispatch('jobList');
                }, 2000);
            }
        })
        // _axios.post(url, option, { fullScreen: true })
        //     .then(res => {
        //         return res;
        //     })
        //     .catch(err => {
        //         console.log(err);
        //     })
    },
    adGetCampaignlist({ state, commit }, { projectId, keyword = '' }) {
        // let url = `${URL.adcampaignlist}fbAccountId=${accountId}`;
        let url = `${URL.createcampaignlist}project_id=${projectId}&keyword=${keyword}`;

        _axios.get(url)
            .then(res => {
                commit('ADCAMPAIGNLIST', res);
            })
            .catch(err => {
                console.log(err);
            })
    },
    adGetAdsetList({ state, commit }, { projectId, keyword = '' }) {
        // let url = `${URL.adsetlist}fbAccountId=${accountId}`;
        let url = `${URL.createadsetlist}project_id=${projectId}&keyword=${keyword}`;

        _axios.get(url)
            .then(res => {
                commit('ADSETLIST', res);
            })
            .catch(err => {
                console.log(err);
            })
    },
    creativeDetail({ state, commit }, { creativeId, fullScreen = false }) {
        let url = `${URL.creativedetail}fbCreativeIds=${creativeId}`;

        return Axios({
            url,
            fullscreen: fullScreen,
            success: res => res
        })
    },
    adCopy({ state, commit, dispatch }, { orgId, distId, count, identify, type, projectId, fbAccountId }) {
        let url = URL.adcopy;
        let params = new FormData();
        params.append('copyNum', count);
        params.append('identify', identify);
        params.append('projectId', projectId);
        /**
         * 20190319新增，跨广告账户复制新添加参数，目标广告账户id
         */
        if (fbAccountId)
            params.append('fbAccountId', fbAccountId);

        if (type == 'campaignName') {
            params.append('campaignId', orgId.join(','));
        } else {
            let arr = [];
            orgId.forEach((v, i) => {
                let obj = {
                    targetId: distId.length == 1 ? distId[0] : distId[i],
                    superId: v
                }
                arr.push(obj);
            })
            params.append('copyVO', JSON.stringify(arr));
        }
        let opts;
        let keyname = '';
        switch (type) {
            case 'campaignName':
                opts = 'campain_option';
                keyname = '广告系列';
                break;
            case 'adSetName':
                opts = 'set_option';
                keyname = '广告组';
                break;
            case 'adName':
                opts = 'ad_option';
                keyname = '广告';
                break;
        }

        _axios.post(url, params, { fullScreen: true })
            .then(res => {
                if (res.data == false) {
                    Msgsuccess('提交失败');
                } else {
                    let errorarr = [];
                    for (let i in res.data) {
                        if (!res.data[i].b) {
                            errorarr.push(i);
                        }
                    }
                    if (errorarr.length > 0) {
                        Msgerror(`${keyname}复制失败，请稍后重试，${keyname}ID：${errorarr.join('\n')}`);
                    } else {
                        Msgsuccess('提交成功');
                    }

                    // 重置定时器
                    clearInterval(jobProcess);
                    setTimeout(function () {
                        dispatch('jobList');
                    }, 2000);
                }
            })
            .catch(err => {
                console.log(err);
            })
    },
    asyncJobProcess({ state, commit, dispatch }) {
        let url = URL.joblist;
        return new AX().get(url)
            .then(res => res)
    },
    async jobList({ state, commit, dispatch }) {
        let url = URL.joblist;
        let opts;
        switch (state.adtab) {
            case 'campaignName':
                opts = 'campain_option';
                break;
            case 'adSetName':
                opts = 'set_option';
                break;
            case 'adName':
                opts = 'ad_option';
                break;
        }

        let res = await dispatch('asyncJobProcess').catch(err => {
            console.log(err);
            /**
             * 初始化的时候这一步非常重要，保证在task接口失败的情况下，广告管理列表可以正常渲染
             */
            dispatch('getAdlist', { option: state[opts], type: state.adtab });
        });
        if (!res) return;

        if (res.unCompleted == 0) {
            dispatch('getAdlist', { option: state[opts], type: state.adtab });
            return;
        } else {
            commit('JOBPROCESS', res);
            dispatch('getAdlist', { option: state[opts], type: state.adtab });
        }
        /**
         * 20180109优化异步处理方法
         * 轮询task接口，返回正在执行中的task任务数量和类别
         * 当有一个task任务完成之后，会通过 messageWebsocket建立的websocket返回结果信息，task任务从接口中删除
         */
        clearInterval(jobProcess);
        jobProcess = setInterval(async () => {
            res = await dispatch('asyncJobProcess');
            if (res.unCompleted == 0) {
                clearInterval(jobProcess);
                console.log('复制异步结束');
                commit('JOBPROCESSCOMPLETE', res);
                dispatch('getAdlist', { option: state[opts], type: state.adtab })
            } else {
                commit('JOBPROCESS', res);
            }
        }, 5000);
    },
    joblistDetail({ state, commit }) {
        let url = `${URL.jobresultdetail}${state.jobfailkey}`;

        Axios({
            url,
            success: res => {
                commit('JOBLISTDETAIL', res);
            },
            fail: err => {
                commit('JOBLISTDETAILERROR');
            }
        })
    },
    copyCreateCampaign({ state, commit, dispatch }, { name, accountId, orgId, count, identify, type, projectId, ifstride }) {
        let url = URL.createcampaign;
        let option = {
            adAccount: accountId,
            campaignName: name
        };

        _axios.post(url, option, { fullScreen: true })
            .then(res => {
                if (res.data[0].status == 'success')
                    dispatch('adCopy', { orgId, distId: [res.data[0].campaignId], count, identify, type, projectId, fbAccountId: !ifstride ? null : accountId });
                else
                    Msgerror(res.data[0].errorMsg)
            })
            .catch(err => {
                console.log(err);
            })
    },
    calcuCount({ state, commit }, { id, type }) {
        let url = `${URL.calcucount}ids=${id.join(',')}&type=${type}`;

        _axios.get(url)
            .then(res => {
                commit('CALCUCOUNT', res);
            })
            .catch(err => {
                console.log(err);
            })
    },
    createCampaign({ state, commit, dispatch }, { name, accountId }) {
        let url = URL.createcampaign;
        let option = {
            adAccount: accountId,
            campaignName: name
        };

        return _axios.post(url, option, { fullScreen: true })
            .then(res => res)
            .catch(err => {
                console.log(err);
            })
    },
    getCampaignInfo({ state, commit }, { campaignId }) {
        let url = `${URL.campaigninfo}campaignIds=${campaignId.join(',')}`;

        _axios.get(url)
            .then(res => {
                commit('CAMPAIGNINFO', res);
            })
            .catch(err => {
                console.log(err);
            })
    },
    editCampaign({ state, commit, dispatch }, { campaignId, name }) {
        let url = URL.editcampaign;
        let option = {
            campaignList: campaignId,
            campaignName: name
        }

        return _axios.post(url, option, { fullScreen: true })
            .then(res => {
                if (!res.data.find(v => v.status == 'failed')) {
                    dispatch('getAdlist', { option: state['campain_option'], type: 'campaignName' })
                }
                return res;
            })
            .catch(err => {
                console.log(err);
            })
    },
    getCreateCampaignlist({ state, commit }, { keyword, projectId }) {
        let url = `${URL.createcampaignlist}keyword=${keyword}&project_id=${projectId}`;

        _axios.get(url)
            .then(res => {
                commit('CREATECAMPAIGNLIST', res);
            })
            .catch(err => {
                console.log(err);
            })
    },
    createAdset({ state, commit }, option) {
        let url = URL.createadset;

        return Axios({
            url,
            method: 'post',
            data: option,
            fullscreen: true,
            success: res => res
        })
    },
    getAdsetInfo({ state, commit }, { adsetId, applicationid }) {
        let url = `${URL.adsetinfo}adsetIds=${adsetId.join(',')}`;

        _axios.get(url)
            .then(res => {
                commit('ADSETINFO', { res, applicationid });
            })
            .catch(err => {
                console.log(err);
            })
    },
    editAdset({ state, commit, dispatch }, option) {
        let url = URL.editadset;

        return Axios({
            url,
            method: 'post',
            data: option,
            fullscreen: true,
            success: res => {
                if (!res.data.find(v => v.status == 'failed')) {
                    dispatch('getAdlist', { option: state['set_option'], type: 'adSetName' })
                }
                return res;
            }
        })
    },
    getCreateAdsetlist({ state, commit }, { keyword, projectId }) {
        let url = `${URL.createadsetlist}keyword=${keyword}&project_id=${projectId}`;

        return _axios.get(url)
            .then(res => {
                commit('SETSTATE', { k: 'adsetlistload', v: false })

                commit('CREATEADSETLIST', res);
            })
            .catch(err => {
                console.log(err);
            })
    },
    getSelectCreateList({ state, commit }, { creativityType, creativityName, classify, pageIndex, projectId }) {
        let url = `${URL.createlist}creativityType=${creativityType}&creativityName=${creativityName}&classify=${classify}&pageIndex=${pageIndex}&pageSize=40&projectId=${projectId}`;

        _axios.get(url)
            .then(res => {
                commit('ADCREATELIST', res);
            })
            .catch(err => {
                console.log(err);
            })
    },
    createAd({ state, commit }, option) {
        let url = URL.createad;

        return _axios.post(url, option, { fullScreen: true })
            .then(res => res)
            .catch(err => {
                console.log(err);
            })
    },
    createEditAdAsync({ state, commit, dispatch }, option) {
        let url = URL.createeditasync;

        return _axios.post(url, option)
            .then(res => {
                let failarr = res.data.filter(v => v.status == 'failed');
                if (failarr.length == 0) {
                    Msgsuccess('提交成功');
                    // 重置定时器
                    clearInterval(jobProcess);
                    setTimeout(function () {
                        dispatch('jobList');
                    }, 2000);

                    return true;
                } else {
                    Msgerror(`广告编辑失败，请稍后重试，${failarr.map(v => v.errMsg).join(',')}`);
                    return false;
                }
            })
            .catch(err => {
                console.log(err);
            })
    },
    getAdInfo({ state, commit }, { adId }) {
        let url = `${URL.adinfo}ads=${adId.join(',')}`;

        _axios.get(url, { fullScreen: true })
            .then(res => {
                commit('ADINFO', res);
            })
            .catch(err => {
                console.log(err);
            })
    },
    isDynamicCreate({ state, commit }, creativeids) {
        let url = `${URL.dynamiccreate}fbCreativeIds=${creativeids}`;

        _axios.get(url)
            .then(res => {
                commit('DYNAMICCREATE', res);
            })
            .catch(err => {
                console.log(err);
            })
    },
    editAd({ state, commit, dispatch }, option) {
        let url = URL.editad;

        return _axios.post(url, option, { fullScreen: true })
            .then(res => {
                if (!res.data.find(v => v.status == 'failed')) {
                    dispatch('getAdlist', { option: state['ad_option'], type: 'adName' })
                }
                return res;
            })
            .catch(err => {
                console.log(err);
            })
    },
    getAdsetCreateApplist({ state, commit }) {
        let url = URL.applist;
        _axios.get(url)
            .then(res => {
                commit('SETADCREATEAPPLIST', res);
            })
            .catch(err => {
                console.log(err);
            })
    },
    getAppInfo({ state, commit }, applicationId) {
        let url = `${URL.appinfo}apps=${applicationId}`;

        _axios.get(url)
            .then(res => {
                commit('ADAPPINFO', res);
            })
            .catch(err => {
                console.log(err);
            })
    },
    getAdsetCreateAllpages({ state, commit }) {
        let url = URL.allpagelist;

        _axios.get(url)
            .then(res => {
                commit('CREATEALLPAGES', res);
            })
            .catch(err => {
                console.log(err);
            })
    },
    getCalendarData({ state, commit }, { projectId, startDate, endDate, userOs }) {
        let url = `${URL.calendardata}projectId=${projectId}&startDate=${startDate}&endDate=${endDate}&userOs=${userOs}`;

        _axios.get(url)
            .then(res => {
                commit('CALENDARDATE', res);
            })
            .catch(err => {
                console.log(err);
            })
    },
    submitAfdata({ state }, option) {
        let url = URL.submitafdata;

        return _axios.post(url, option, { fullScreen: true, timeout: 180000 })
            .then(res => res)
            .catch(err => {
                console.log(err);
            })
    },
    affileDownload({ state, commit }, fileName) {
        let url = `${URL.affiledownload}fileName=${fileName}`;

        _axios.get(url)
            .then(res => {
                commit('AFFILEDOWNLOAD', { r: res, name: fileName });
            })
            .catch(err => {
                console.log(err);
            })
    },
    isActiveAd({ state, commit }, adsetid) {
        let url = `${URL.isactivead}adset_id=${adsetid}`;

        _axios.get(url)
            .then(res => {
                commit('ACTIVEAD', res);
            })
            .catch(err => {
                console.log(err);
            })
    },
    // data
    getCondition({ state, commit }, { projectId }) {
        let url = URL.conditionlist + '?projectId=' + projectId;

        _axios.get(url)
            .then(res => {
                commit('CONDITION', res);
            })
            .catch(err => {
                console.log(err);
            })
    },
    getDataList({ state, commit }, { option }) {
        let url = URL.datalist;

        _axios.post(url, option)
            .then(res => {
                commit('DATALIST', res);
            })
            .catch(err => {
                console.log(err);
            })
    },
    getDataListout({ state, commit }, { option, name }) {
        let url = URL.datalist;

        _axios.post(url, option)
            .then(res => {
                commit('DATALISTOUT', { res, name });
            })
            .catch(err => {
                console.log(err);
            })
    },
    geAdformList({ state, commit }, { option }) {
        let url = URL.adformlist;

        _axios.post(url, option)
            .then(res => {
                commit('ADFORM', res);
            })
            .catch(err => {
                console.log(err);
            })
    },
    geAdformListout({ state, commit }, { option, name }) {
        let url = URL.adformlist;

        _axios.post(url, option)
            .then(res => {
                commit('ADFORMOUT', { res, name });
            })
            .catch(err => {
                console.log(err);
            })
    },
    getCreateformList({ state, commit }, { option }) {
        let url = URL.createformlist;

        _axios.post(url, option, { loadDom: 'dataTable' })
            .then(res => {
                commit('CREATEFORM', res);
            })
            .catch(err => {
                console.log(err);
            })
    },
    getCreatecardList({ state, commit }, { option }) {
        let url = URL.createcard;

        _axios.post(url, option, { loadDom: 'dataTableCard' })
            .then(res => {
                commit('CREATECARD', res);
            })
            .catch(err => {
                console.log(err);
            })
    },
    getCreateformListout({ state, commit }, { option, name }) {
        let url = URL.createformlist;

        _axios.post(url, option)
            .then(res => {
                commit('CREATEFORMOUT', { res, name });
            })
            .catch(err => {
                console.log(err);
            })
    },
    getCreatecardListout({ state, commit }, { option, name }) {
        let url = URL.createcard;

        _axios.post(url, option)
            .then(res => {
                commit('CREATECARDOUT', { res, name });
            })
            .catch(err => {
                console.log(err);
            })
    },
    getDaycpiList({ state, commit }, { option, sort }) {
        let url = URL.daycpi;

        _axios.post(url, option)
            .then(res => {
                commit('DAYCPI', res);
            })
            .catch(err => {
                console.log(err);
            })


        let listopt = Object.assign({ flag: '1', orderByClause: sort }, option);
        _axios.post(url, listopt)
            .then(res => {
                commit('DAYCPITABLE', res);
            })
            .catch(err => {
                console.log(err);
            })
    },
    getDaycpiListout({ state, commit }, { option, name }) {
        let url = URL.daycpi;

        option.flag = '1';
        _axios.post(url, option)
            .then(res => {
                commit('DAYCPIOUT', { res, name });
            })
            .catch(err => {
                console.log(err);
            })
    },
    getOptionMore({ state, commit }, { projectId, campaignKeyword, creativeKeyword, accountKeyword }) {
        let url = URL.getoptionmore;
        let keyword = '';
        keyword = campaignKeyword ? 'campaignKeyword' : keyword;
        keyword = creativeKeyword ? 'creativeKeyword' : keyword;
        keyword = accountKeyword ? 'accountKeyword' : keyword;

        url += projectId ? `projectId=${projectId}` : '';
        url += campaignKeyword ? `&campaignKeyword=${campaignKeyword}` : '';
        url += creativeKeyword ? `&creativeKeyword=${creativeKeyword}` : '';
        url += accountKeyword ? `&accountKeyword=${accountKeyword}` : '';

        console.log(keyword);
        _axios.get(url)
            .then(res => {
                commit('OPTIONMORE', { res, keyword });
            })
            .catch(err => {
                console.log(err);
            })

    },
    getMatterList({ state, commit }, { option, name = '' }) {
        let url = URL.matterlist;

        Axios({
            url,
            method: 'post',
            data: option,
            fullscreen: true,
            success: res => {
                commit('MATTERLIST', { res, type: option.materialType, name });
            }
        })
    },
    getVideoLink({ state, commit }, videoid) {
        let url = `${URL.getvideourl}videoId=${videoid}`;

        return _axios.get(url)
            .then(res => res)
            .catch(err => {
                console.log(err)
            })
    },
    // target
    targetAdlist({ state, commit, dispatch }, { option, type }) {
        let url = URL.adlistnew;

        Axios({
            url,
            method: 'post',
            data: option,
            success: res => {
                if (type == 'campaign')
                    commit('TARGETADLIST', res);
                else
                    commit('TARGETADSETLIST', { r: res, campaignid: option.campaignIdInStr });
            }
        })
    },
    getTargetlist({ state, commit }, { fullScreen = '' } = {}) {
        let url = URL.targetlist;

        let data = [
            'projectId',
            'type',
            'keyword',
            'adaccounts',
            'pageIndex',
            'pageSize'];

        let str = '';
        data.forEach(v => {
            if (state['tg_' + v])
                str += '&' + v + '=' + state['tg_' + v];
        });

        url = url + str.substr(1);

        Axios({
            url,
            data,
            fullscreen: true,
            success: res => {
                commit('TARGETLIST', res);
            }
        })
    },
    getTargetDetail({ state, commit }, { targetid, loadDom }) {
        let url = URL.targetdetail;
        url += 'audience_id=' + targetid;

        _axios.get(url, { loadDom })
            .then(res => {
                commit('TARGETDETAIL', res);
            })
            .catch(err => {
                console.log(err);
            })
    },
    appToAccount({ state, commit }, { appid }) {
        let url = `${URL.appmethod}app_id=${appid}`;

        _axios.get(url)
            .then(res => {
                commit('APPACCOUNT', res);
            })
            .catch(err => {
                console.log(err);
            })
    },
    addTarget({ state, commit, dispatch }, { option, type = '' }) {
        let url = '';
        let keyname = '';
        switch (type) {
            // 根据自定义受众创建类似受众
            case 'auto':
                url = URL.autoliketarget;
                keyname = '类似';
                break;
            // 根据主页创建类似受众
            case 'page':
                url = URL.pageliketarget;
                keyname = '类似';
                break;
            case 'ad':
                url = URL.adliketarget;
                keyname = '类似';
                break;
            case 'special':
                url = URL.specialtarget;
                keyname = '';
                break;
            // 创建自定义受众
            default:
                url = URL.addtarget;
                keyname = '自定义';
                break;
        }

        return Axios({
            url,
            method: 'post',
            data: option,
            fullscreen: true,
            success: res => {
                if (res.data.status == 'failed') {
                    Msgerror(res.data.errorMsg);
                    //     commit('SAMELIKE');
                } else {
                    Msgsuccess(`${keyname}受众${option.fbAudienceId ? '编辑' : '创建'}成功`);
                    dispatch('getTargetlist', { fullScreen: true });
                }
                return res;
            }
        })
    },
    getAddDetail({ state, commit }) {
        let url = `${URL.targetadddetail}audience_id=${state.resultid}`;

        Axios({
            url,
            success: res => {
                commit('TARGETADDDETAIL', res);
            }
        })
    },
    getTargetInfo({ state, commit }, { id, type }) {
        // if (!state.audience_id) return;
        let url = `${URL.targetinfo}id=${id}`;

        _axios.get(url)
            .then(res => {
                commit('TARGETINFO', { r: res, type });
            })
            .catch(err => {
                console.log(err);
            })
    },
    getTargetAccount({ state, commit }, { targetid, loadDom }) {
        let url = URL.targetdetail;
        url += 'audience_id=' + targetid;

        _axios.get(url, { loadDom })
            .then(res => {
                commit('TARGETACCOUNT', res);
            })
            .catch(err => {
                console.log(err);
            })
    },
    likeTarget({ state, commit }, { adaccount }) {
        let url = `${URL.liketarget}adaccount=${adaccount}&keyword=`;

        Axios({
            url,
            success: res => {
                commit('LIKETARGET', res);
            }
        })
    },
    targetCampaigns({ state, commit }, { project_id, keyword = '', pageIndex = 1, pageSize = 50 }) {
        let url = `${URL.targetcampaigns}project_id=${project_id}&keyword=${keyword}&pageIndex=${pageIndex}&pageSize=${pageSize}`;

        _axios.get(url)
            .then(res => {
                commit('TARGETCAMPAINGNS', { res, pageIndex });
            })
            .catch(err => {
                console.log(err);
            })
    },
    targetApplist({ state, commit }) {
        let url = URL.applist;

        _axios.get(url)
            .then(res => {
                commit('TARGETAPPLIST', res);
            })
            .catch(err => {
                console.log(err);
            })
    },
    getTargetCampaignAccount({ state, commit }, { project_id, batch_id }) {
        let url = `${URL.campaigntoaccount}project_id=${project_id}&batch_id=${batch_id}`;

        _axios.get(url)
            .then(res => {
                commit('TARGETCAMPAIGNACCOUNT', res);
            })
            .catch(err => {
                console.log(err);
            })
    },
    deleteDetail({ state, commit }, ids) {
        let url = `${URL.deletedetail}audience_ids=${ids}`;

        Axios({
            url,
            success: res => {
                commit('DELETEDETAIL', res);
            }
        })
    },
    submitDelete({ state, commit, dispatch }, ids) {
        let url = URL.targetdelete;
        let data = ids;

        return Axios({
            url,
            method: 'post',
            data,
            success: res => {
                dispatch('getTargetlist', { fullScreen: true });
                return res;
            }
        })
    },
    submitShare({ state, commit, dispatch }, { audienceList, adaccountList }) {
        let url = URL.targetshare;
        let data = {
            audienceList,
            adaccountList
        };

        return Axios({
            url,
            method: 'post',
            data,
            success: res => {
                dispatch('getTargetlist', { fullScreen: true });
                return res;
            }
        })
    },
    // regular
    getRegular({ state, commit }) {
        let url = URL.regularlist;

        let option = ['ruleStatus',
            'keyword',
            'pageNo',
            'pageSize'];

        let str = '';
        option.forEach(v => {
            if (state['rg_' + v])
                str += '&' + v + '=' + state['rg_' + v];
        });

        url = url + str.substr(1);

        _axios.get(url)
            .then(res => {
                commit('REGULARLIST', res);
            })
            .catch(err => {
                console.log(err);
            })
    },
    setRegularStatus({ state, commit, dispatch }, { status, id }) {
        let url = `${URL.regularstatus}ruleStatus=${status}&id=${id}`;

        _axios.get(url)
            .then(res => {
                Msgsuccess('规则状态已修改');

                dispatch('getRegular');
            })
            .catch(err => {
                console.log(err);
            })
    },
    getTargetPlan({ state, commit }, { project_id }) {
        let url = `${URL.planlist}project_id=${project_id}&pageIndex=1&pageSize=2000`;

        _axios.get(url)
            .then(res => {
                commit('TARGETPLANLIST', res);
            })
            .catch(err => {
                console.log(err);
            })
    },
    getAllRules({ state, commit }) {
        let url = URL.allrules;

        _axios.get(url)
            .then(res => {
                commit('ALLRULES', res);
            })
            .catch(err => {
                console.log(err);
            })
    },
    getReguFormData({ state, commit }, { startTime = '', endTime = '', ruleGroupIds = '' } = {}) {
        let url = `${URL.reguformdata}startTime=${startTime}&endTime=${endTime}&ruleGroupIds=${ruleGroupIds}`;

        _axios.get(url)
            .then(res => {
                commit('REGUFORMDATA', res);
            })
            .catch(err => {
                console.log(err);
            })
    },
    // message
    getMessageList({ state, commit }) {
        let url = `${URL.messagelist}pageIndex=${state.msgpageindex}&pageSize=${state.msgpagesize}`;

        _axios.get(url)
            .then(res => {
                commit('MESSAGELIST', res);
            })
            .catch(err => {
                console.log(err);
            })
    },
    updateMessage({ state, commit, dispatch }, { ids }) {
        let url = `${URL.setmessage}ids=${ids}`;

        _axios.get(url)
            .then(res => {
                // dispatch('getMessageList');
                dispatch('getMessageCount');
            })
            .catch(err => {
                console.log(err);
            })
    },
    setAllRead({ state, commit }) {
        let url = URL.setallread;

        _axios.get(url)
            .then(res => {
            })
            .catch(err => {
                console.log(err);
            })
    }
}