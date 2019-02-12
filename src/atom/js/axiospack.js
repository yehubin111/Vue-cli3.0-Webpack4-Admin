import axios from 'axios'
import { Msgsuccess, Msgerror } from './message'
import baseurl from './baseurl'
import { Loading } from 'element-ui'

const AXIOS = axios.create({
    baseURL: baseurl[process.env.VUE_APP_URLBASE].BASE_URL,
    timeout: 60000,
    headers: {
        'X-Token': localStorage.getItem('atom_token')
    },
    loadDom: ''
})

let LOAD;
// request拦截器
AXIOS.interceptors.request.use(
    config => {
        // 请求拦截，加入loading
        if (config.loadDom || config.fullscreen) {
            let dom = document.getElementById(config.loadDom);
            LOAD = Loading.service({ target: dom, fullscreen: config.fullscreen });
        }
        return config;
    }
)

// response拦截器
AXIOS.interceptors.response.use(
    res => {
        // 请求成功，去掉loading
        if (LOAD)
            LOAD.close();

        let r = res.data;

        if (r.code && r.code != 0) {
            Msgerror(r.msg);

            if (r.code === 1000) {
                location.href = '/login.html';
            }

            return Promise.reject('error');
        } else {
            return r;
        }
    }
)

export default AXIOS;