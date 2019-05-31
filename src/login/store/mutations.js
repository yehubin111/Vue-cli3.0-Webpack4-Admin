import { Message } from 'element-ui'
export default {
    // 保存token
    SETTOKEN(state, r) {
        // 登录成功
        if (r.code == 0) {
            localStorage.setItem('atom_token', r.data.token);
            localStorage.setItem('atom_nickname', r.data.nickName);
            localStorage.setItem('atom_roleId', r.data.roleId);
            localStorage.setItem('atom_id', r.data.id);
        } else { // 失败
            Message({
                message: r.msg,
                type: 'error',
                duration: 5000
            })
        }
    },
    CHANGEMSG(state, vl) {
        state.msg = vl;
    },
    // 记录来源地址
    SETREF(state) {
        let frm = document.referrer;
        state.refurl = frm;
    },
    SETBIND(state, r) {
        console.log(JSON.stringify(r));
        // if (r.data.status == 'normal')
        //     localStorage.setItem('atom_bind', 1);
        // else
        //     localStorage.setItem('atom_bind', 0);

        // 登录成功之后跳转来源页面
        location.href = !state.refurl || state.refurl.indexOf('login') != -1 ? '/#/pandect' : state.refurl;
    }
}