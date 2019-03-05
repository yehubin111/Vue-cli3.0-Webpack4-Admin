export default {
    'development': {
        // BASE_URL: 'http://172.31.1.76:9600',
        // UPLOAD_URL: 'http://172.31.1.76:8888',
        // MD5_URL: 'http://172.31.1.76:8888',
        // WEBSOCKET_URL: '172.31.1.76:9600',
        BASE_URL: 'http://172.31.1.45/api', //http://172.31.1.45
        UPLOAD_URL: 'http://172.31.1.45/api',
        WEBSOCKET_URL: '172.31.1.45:9600',
        MD5_URL: 'http://172.31.1.45'

        // BASE_URL: process.env.NODE_SPECIAL_HOST || 'http://172.31.17.190:9600/', // wuhonggang
        // BASE_URL: process.env.NODE_SPECIAL_HOST || 'http://172.31.5.226:9600',
        // BASE_URL: process.env.NODE_SPECIAL_HOST || 'http://172.31.1.45/api',
        // BASE_URL: process.env.NODE_SPECIAL_HOST || 'http://172.31.17.192:9600', // zhangkai
        // WEBSOCKET_URL: '172.31.17.192:9600', // zhangkai
    },
    'production': {
        BASE_URL: '/api', //http://169.53.46.167
        UPLOAD_URL: '/api',
        WEBSOCKET_URL: 'atom.unitymob.com/api',
        MD5_URL: ''
    },
    'testing': {
        BASE_URL: '/api', //http://172.31.1.45
        UPLOAD_URL: '/api',
        WEBSOCKET_URL: '172.31.1.45:9600',
        MD5_URL: ''
    }
}