import Clipboard from 'clipboard';
import { Msgsuccess } from "./message";
export default {
    install(Vue, options) {
        Vue.prototype.$exportHTML = (id, xlsname, htmlstr, format) => {
            let formatarr = {
                'xls': 'application/vnd.ms-excel',
                'csv': 'text/csv'
            }
            let str = htmlstr ? htmlstr : document.getElementById(id).outerHTML;
            let name = xlsname ? xlsname : '数据';
            let unit = format ? format : 'xls';
            let content = `<html><head><meta charset="UTF-8"></head><body>${str}</body></html>`;

            let excelBlob = new Blob([content], {
                type: formatarr[unit]
            });

            // 创建一个a标签
            let oA = document.createElement("a");
            // 利用URL.createObjectURL()方法为a元素生成blob URL
            oA.href = URL.createObjectURL(excelBlob);
            // 给文件命名
            oA.download = `${name}.${unit}`;
            // 模拟点击
            oA.click();
        }

        Vue.prototype.$timeFormat = (vl, type) => {
            if (!vl)
                return '';

            let newdate = new Date();
            newdate.setTime(vl);
            let nyear = newdate.getFullYear();
            let ftime = type ? type : 'yyyy-MM-dd HH:mm:ss';
            let dateitems = {
                'M': newdate.getMonth() + 1,
                'd': newdate.getDate(),
                'H': newdate.getHours(),
                'm': newdate.getMinutes(),
                's': newdate.getSeconds()
            };
            //替换年份
            if (/(y+)/.test(ftime)) {
                ftime = ftime.replace(RegExp.$1, nyear);
            }
            //替换月份以及其他的
            for (let i in dateitems) {
                if (new RegExp('(' + i + '+)').test(ftime)) {
                    ftime = ftime.replace(RegExp.$1, RegExp.$1.length === 1 ? dateitems[i] : ('00' + dateitems[i]).substring(('' + dateitems[i]).length));
                }
            }
            return ftime;
        }
        // 数组元素是否相同
        Vue.prototype.$equalArray = (arr) => {
            let baselength = arr.map(v => v.length);
            // 如果长度不同，则直接返回false
            if ([...new Set(baselength)].length > 1) {
                return false;
            }
            // 排除重复元素
            let arrlist = arr.map(v => [...new Set(v)]);
            // 获取每个数组的长度
            let lengthlist = arrlist.map(v => v.length);
            // 如果排除重复元素的情况下，出现长度不同的数组，则直接返回false
            if ([...new Set(lengthlist)].length > 1) {
                return false;
            }
            // 组合全部数组元素
            let totalarr = [];
            arrlist.forEach(v => {
                totalarr = totalarr.concat(v);
            })
            // 如果总数组的长度等于分数组的长度，则表示合并数组并没有使数组长度增加，则返回true
            if ([...new Set(totalarr)].length == [...new Set(lengthlist)][0]) {
                return true;
            } else {
                return false;
            }
        }
        // 复制
        Vue.prototype.$textCopy = (target) => {
            let clipboard = new Clipboard(target);

            clipboard.on('success', function (e) {
                // 清除选中内容
                e.clearSelection();
                Msgsuccess('已复制到粘贴板');
            });
            clipboard.on('error', function (e) {
                console.log(e);
            });
        }
        // 阻塞
        Vue.prototype.$barrageTime = (time) => {
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve('wait');
                }, time);
            })
        }
        // 视频图片文件下载
        Vue.prototype.$fileDownload = (url) => {
            function downloadFile(fileName, content) {
                var aLink = document.createElement('a');
                var blob = new Blob([content]);
                var evt = document.createEvent("HTMLEvents");
                evt.initEvent("click", false, false);//initEvent 不加后两个参数在FF下会报错
                aLink.download = fileName;
                aLink.href = URL.createObjectURL(blob);
                aLink.click();
                // aLink.dispatchEvent(evt);
            }

            return new Promise((resolve, reject) => {
                let end = url.indexOf('?');
                let urllink = url.substring(0, end == -1 ? url.length : end);
                let start = urllink.lastIndexOf('/');
                let fileName = urllink.substring(start + 1);
                var oReq = new XMLHttpRequest();
                oReq.open("GET", url, true);
                oReq.responseType = "arraybuffer";
                oReq.onload = function (oEvent) {
                    var arrayBuffer = oReq.response;
                    if (arrayBuffer) {
                        downloadFile(fileName, arrayBuffer);

                        setTimeout(() => {
                            resolve('download');
                        }, 2000);
                    }
                }
                oReq.send();
            })
        }
        // 获取search参数
        Vue.prototype.$getSearch = (key) => {
            var _sh = url ? url.match(/(?:\?)[^\#]*?(?=[\?|\#])/g)[0].substr(1) : location.search.substr(1);
            if (!_sh)
                return '';
            var _ar = _sh.split('&');
            var _search = {};
    
            _ar.forEach((v, i) => {
                var t = v.split('=');
                _search[t[0]] = t[1];
            });
    
            return _search[key] ? _search[key] : '';
        }
    }
}