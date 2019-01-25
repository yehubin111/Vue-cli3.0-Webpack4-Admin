import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUi from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import Icon from 'vue-svg-icon/Icon.vue'
import Plugins from './js/plugins'
import VueDND from 'awe-dnd'
import './icons/svg.js'

// import VueLazyload from 'vue-lazyload'
// import VueFileUpload from 'vue-file-upload';

Vue.use(ElementUi);
// Vue.use('VueFileUpload', VueFileUpload);

Vue.use(Plugins);
Vue.use(VueDND);

// Vue.use(VueLazyload, {
//     error: './assets/error.png',
//     loading: './assets/Loading.png'
// })

// Vue.component('icon', Icon);

router.beforeEach((to, from, next) => {
    if (to.meta.title) {
        document.title = to.meta.title;
    }

    next();
});

// 组件

// import {
//     Progress,
//     Container,
//     Header,
//     Aside,
//     Main,
//     Footer,
//     Select,
//     Option
// } from 'element-ui';

// Vue.use(Progress);
// Vue.use(Container);
// Vue.use(Header);
// Vue.use(Aside);
// Vue.use(Main);
// Vue.use(Footer);
// Vue.use(Select);
// Vue.use(Option);
Vue.filter('numberFormat', (value) => {
    let bdot = value.toString().split('.')[0];
    let afdot = value.toString().split('.')[1];

    let vl = bdot.split('').reverse();

    let i = 3;
    let other = 0;
    while (i < bdot.length) {
        vl.splice(i + other, 0, ',');

        other++;
        i += 3;
    }
    vl.reverse();
    return afdot ? vl.join('') + '.' + afdot : vl.join('');
});

Vue.filter('timeFormat', (value, type) => {
    if (!value)
        return '';

    let newdate = new Date();
    newdate.setTime(value);
    let nyear = newdate.getFullYear();
    let ftime = type ? type : 'yyyy-MM-dd';
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
});
// 点击空白关闭
Vue.directive('clickOutside', {
    bind(el, binding, vnode) {
        function documentHandler(e) {
            if (binding.expression) {
                binding.value(e);
            }
        }

        el.__vueClickOutside__ = documentHandler;
        document.addEventListener('click', documentHandler);
    },
    update() { },
    unbind(el, binding) {
        document.removeEventListener('click', el.__vueClickOutside__);
        delete el.__vueClickOutside__;
    }
});
// 下拉框 下拉加载更多
Vue.directive('loadMore', {
    bind(el, binding) {
        const selectWrap = el.querySelector('.el-scrollbar__wrap')
        selectWrap.addEventListener('scroll', function () {
            let sign = 30;
            const scrollDistance = this.scrollHeight - this.scrollTop - this.clientHeight
            if (scrollDistance <= sign) {
                binding.value()
            }
        })
    }
})

new Vue({
    el: '#app',
    router,
    store,
    template: '<App/>',
    components: { App }
})