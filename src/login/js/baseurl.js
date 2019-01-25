export default {
    'development': {
        BASE_URL: process.env.NODE_SPECIAL_HOST || 'http://172.31.1.76:9600',
        UPLOAD_URL: process.env.NODE_SPECIAL_HOST || 'http://172.31.1.27:8888',
        
        // BASE_URL: process.env.NODE_SPECIAL_HOST || 'http://172.31.17.190:9600/', // wuhonggang
        // BASE_URL: process.env.NODE_SPECIAL_HOST || 'http://172.31.17.192:9600', // zhangkai
        // BASE_URL: process.env.NODE_SPECIAL_HOST || 'http://172.31.5.226:9600',
        // BASE_URL: process.env.NODE_SPECIAL_HOST || 'http://172.31.1.45/api',
    },
    'production': {
        BASE_URL: '/api' //http://169.53.46.167
    },
    'testing': {
        BASE_URL: '/api' //http://172.31.1.45
    }
}