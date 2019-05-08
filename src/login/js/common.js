export default {
    // 获取URL参数
    getSearch: function (key, url) {
        var _sh = url ? url.match(/(?:\?)[^\#]*/g)[0].substr(1) : location.search.substr(1);
        if (!_sh)
            return null;

        let _search = new URLSearchParams(_sh);
        return _search.get(key);
    }
}