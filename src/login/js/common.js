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
    }
}