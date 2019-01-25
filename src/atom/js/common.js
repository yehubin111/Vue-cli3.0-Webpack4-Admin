export default {
    // 获取URL参数
    getSearch: function (key, url) {
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
    },
    timeFormat: function (vl, type) {
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
    },
    exportHTML: function (id, xlsname, htmlstr, format) {
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
    },
    exportEXCEL: function (id, xlsname, htmlstr, format) {
        let formatarr = {
            'xls': 'application/vnd.ms-excel',
            'csv': 'text/csv'
        }
        let str = htmlstr ? htmlstr : document.getElementById(id).outerHTML;
        let name = xlsname ? xlsname : '数据';
        let unit = format ? format : 'xls';
        let content = `${str}`;

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
    },
    // obj array 转换成 formdata
    transFormdata: function (data, params, objname) {
        if (data instanceof Array) {

        }

        return params;
    }
}