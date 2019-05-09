import Vue from 'vue/dist/vue.js'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUi from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import Icon from 'vue-svg-icon/Icon.vue'

Vue.use(ElementUi);
// Vue.component('icon', Icon)

new Vue({
    el: '#app',
    router,
    store,
    template: '<App/>',
    components: { App }
})