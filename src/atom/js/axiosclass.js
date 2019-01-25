import axios from 'axios'
import { Msgsuccess, Msgerror } from './message'
import baseurl from './baseurl'
import { Loading } from 'element-ui'

class AXIOS {
    constructor() {
        this.axios = axios.create({
            baseURL: baseurl[process.env.VUE_APP_URLBASE].BASE_URL,
            timeout: 60000,
            headers: {
                'X-Token': localStorage.getItem('atom_token')
            },
            loadDom: ''
        });
        this.load;
        this.init();

        return this.axios;
    }
    init() {
        // request拦截器
        this.axios.interceptors.request.use(
            config => {
                // 请求拦截，加入loading
                if (config.loadDom || config.fullScreen) {
                    let dom = document.getElementById(config.loadDom);
                    this.load = Loading.service({ target: dom, fullscreen: config.fullScreen });
                }
                return config;
            }
        )

        // response拦截器
        this.axios.interceptors.response.use(
            res => {
                // 请求成功，去掉loading
                if (this.load)
                    this.load.close();

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
    }
}

export default AXIOS;