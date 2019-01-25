import URL from './url.js'
class heartBeat {
    timeout = 60000;
    heartRun = null;
    callback = null;
    constructor() { }
    set(k, v) {
        this[k] = v;
    }
    reset() {
        // console.log('%cheart check reset', 'color: blue');
        clearTimeout(this.heartRun);
        this.start();
    }
    start() {
        this.heartRun = setTimeout(() => {
            // console.log('%cheart check', 'color: blue');
            if (this.callback) this.callback();
        }, this.timeout);
    }
}

class atomWebsocket extends heartBeat {
    socket = null;
    url = URL.messageCountWebsocket;
    connectRock = false; // 防止重复连接
    onMessage = null; // 正常收到消息回调函数
    constructor(option) {
        // 父对象实例化
        super();
        // 父对象绑定回调函数
        super.set('callback', this.sendInfo);

        this.onMessage = option.onMessage;
        // 初始化socket连接
        this.connect();
    }
    connect() {
        try {
            this.socket = new WebSocket(`${this.url}${localStorage.getItem('atom_id')}`);//${localStorage.getItem('atom_token')}
            this.init();
        } catch (err) {
            console.log(err)
        }
    }
    init() {
        this.socket.onopen = () => {
            super.start();
        }
        this.socket.onmessage = (res) => {
            super.reset();
            // console.log(res);
            if (this.onMessage && res != 'heart beat')
                this.onMessage(res);
        }
        this.socket.onerror = (e) => {
            // console.log(e);
            // console.log('websocket 错误: ' + e);
            this.reConnect('error');
        }
        this.socket.onclose = (e) => {
            console.log('websocket 断开: ' + e.code + ' ' + e.reason + ' ' + e.wasClean);
            this.reConnect('close');
        }
    }
    sendInfo() {
        // console.log(`%csend heart ${this.socket.readyState}`, 'color: red');
        try {
            if (this.socket.readyState == 1)
                this.socket.send('heart beat');
        } catch (err) {
            console.log(err);
        }
    }
    reConnect(key) {
        if (this.connectRock) return;

        // console.log(`%creconnect with ${key}`, 'color: blue');
        this.connectRock = true;
        setTimeout(() => {
            this.connectRock = false;
            this.connect();
        }, 6000);
    }
}

export default atomWebsocket;