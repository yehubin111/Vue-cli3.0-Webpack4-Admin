import Vue from 'vue'
import Vuex from 'vuex'
import state from './state'
import actions from './actions'
import getters from './getters'
import mutations from './mutations'
// import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex);

export default new Vuex.Store({
    state,
    getters,
    mutations,
    actions,
    // plugins: [createPersistedState({
    //     storage: window.localStorage,
    //     reducer(val) {
    //         testuser: val.testuser
    //     }
    // })]
});