/*
 * @Author: 詹真琦(legendryztachi@gmail.com)
 * @Date: 2017-12-08 15:18:44 
 * @Description: 
 * @Last Modified by: 詹真琦(legendryztachi@gmail.com)
 * @Last Modified time: 2017-12-19 17:25:22
 */
const webpack = require('webpack'),
    path = require('path'),
    BASE_PATH = './src/app/js/';

module.exports = {
    entry:{
        index:BASE_PATH+'index',
        b1:BASE_PATH+'/b/b1'
    },
    output:{
        // //浏览器异步动态加载chunk的路径
        publicPath: '/js/',
        filename:'[name].js',
        // //未被列在entry中，却又需要被打包出来的文件命名配置，如
        // //const a= require.ensure([],function(require){},'a');
        // //第一个是依赖，第二个是回调，第三个参数就是name
        //一般用于动态加载不立即需要又较大的js文件
        chunkFilename:'[name].chunk.js'
        
    },
    // 观察模式
    // 监测代码，并在代码改变的时候进行重新编译
    watch: true,
    watchOptions: {
        // 当代码首次被改变后增加一个时间延迟
        // 如果在这段延迟时间内，又有其他代码发生了改变，
        // 则其他的改变也将在这段延迟时间后，一并进行编译
        aggregateTimeout: 500,

        // 不进行监测的文件
        // 监测大量的文件将占用CPU或许多内存空间，例如node_modules
        ignored: /node_modules/,

        // 每隔一段时间，自动检查代码的改变，例如1000表示每秒进行一次检查
        // 在观察模式不起作用的时候，可以尝试打开这个配置项
        poll: 1000
    },
    resolve: {
        // 给路径添加别名，可有效避免模块中require的路径过长
        alias: {
            widget: path.resolve(__dirname, './src/widget')
        }
    },
    module:{
        rules:[
            {
                test:/(\.html|\.js)$/,
                use:{
                    loader: "babel-loader",
                    options: {
                        presets: [
                            "es2015"
                        ]
                    }
                },
                //忽略文件夹
                exclude: /node_modules/
            }
        ]
    }
}