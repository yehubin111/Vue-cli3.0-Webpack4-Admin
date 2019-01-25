import Vue from 'vue/dist/vue.js'
import Router from 'vue-router'
import page from '../components/index'

Vue.use(Router);

export default new Router({
    // mode: 'history',
    routes: [{
        path: '/',
        name: 'index',
        component: page
    }]
})