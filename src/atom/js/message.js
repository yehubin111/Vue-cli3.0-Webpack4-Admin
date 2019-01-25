import { Message, Notification } from 'element-ui'

export function Msgsuccess(msg) {
    Message({
        message: msg,
        type: 'success',
        duration: 5000
    })
}
export function Msgerror(msg) {
    Message({
        message: msg,
        type: 'error',
        duration: 5000
    })
}

export function Msgwarning(msg, dangerouslyUseHTMLString) {
    Message({
        message: msg,
        type: 'warning',
        duration: 5000,
        dangerouslyUseHTMLString
    })
}

export function Msgnotify(title, msg, dangerouslyUseHTMLString) {
    Notification({
        title: title,
        message: msg,
        duration: 5000,
        dangerouslyUseHTMLString
    })
}

export function MsgnotifySuccess(title, msg, callback) {
    Notification.success({
        title: title,
        message: msg,
        duration: 5000,
        dangerouslyUseHTMLString: true,
        onClick: callback ? callback : null
    })
}

export function MsgnotifyError(title, msg) {
    Notification.error({
        title: title,
        message: msg,
        duration: 5000
    })
}

export function MsgnotifyWarning(title, msg, callback) {
    Notification.warning({
        title: title,
        message: msg,
        duration: 5000,
        dangerouslyUseHTMLString: true,
        onClick: callback ? callback : null
    })
}
