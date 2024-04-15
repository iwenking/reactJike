const path = require('path');

module.exports = {
    webpack: {
        alias: {
            // 配置路径别名
            '@': path.resolve(__dirname, 'src')
        }
    }
}