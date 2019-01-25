import { Message } from 'element-ui'
import axios from 'axios'
import baseurl from '../js/baseurl'

export default {
    toLogin({ commit, dispatch }, { eml, psw }) {
        let params = {
            loginName: eml,
            password: psw
        }

        axios.post(baseurl[process.env.VUE_APP_URLBASE].BASE_URL + '/user/login', params)
            .then(res => {
                let r = res.data;
                console.log(r);
 
                if (r.code == 0) {
                    commit('SETTOKEN', r);
                    // 查询绑定状态
                    dispatch('testBind');
                } else {
                    Message({
                        message: r.msg,
                        type: 'error',
                        duration: 5000
                    })
                }
            })
            .catch(err => {
                console.log(err);
            })

    },
    testBind({ commit }) {
        let url = 'facebook/isBindFacebok';

        let AXIOS = axios.create({
            baseURL: baseurl[process.env.VUE_APP_URLBASE].BASE_URL,
            timeout: 5000,
            headers: {
                'X-Token': localStorage.getItem('atom_token')
            }
        });

        AXIOS.get(url)
            .then(res => {
                let r = res.data;

                commit('SETBIND', r);
            })
            .catch(err => {
                console.log(err);
            })
    }
}