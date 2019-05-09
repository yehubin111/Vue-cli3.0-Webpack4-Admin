import Vue from 'vue'
import Vuex from 'vuex'
import state from './state'
import actions from './actions'
import getters from './getters'
import mutations from './mutations'
import createPersistedState from "vuex-persistedstate";
// 需要存到本地缓存的state
import stateStorage from './state-storage';

Vue.use(Vuex);

export default new Vuex.Store({
    state,
    getters,
    mutations,
    actions,
    /**
     * vuex数据永久存储插件
     * 数据改变的时候存到本地缓存
     * 刷新页面的时候自动获取
     */
    plugins: [createPersistedState({
        storage: window.localStorage,
        reducer(val) {
            let obj = {};
            Object.keys(stateStorage).forEach(v => {
                obj[v] = val[v];
            })
            return obj;
        }
    })]
});