/*
 * @Author: 詹真琦(legendryztachi@gmail.com)
 * @Date: 2017-12-08 15:18:44 
 * @Description: 
 * @Last Modified by: 詹真琦(legendryztachi@gmail.com)
 * @Last Modified time: 2017-12-15 17:34:05
 */
const webpack = require('webpack'),
    path = require('path'),
    BASE_PATH = './src/app/js/';

module.exports = {
    entry:{
        index:BASE_PATH+'index'
    },
    output:{
        //gulp将js打包至static。publicPath:'/'的路径就在static
        publicPath: '/',
        filename:'[name].js',
        //未被列在entry中，却又需要被打包出来的文件命名配置，如
        //const a= require.ensure(['widget/getRepeat'],function(require){},'a');
        //第三个参数就是name
        chunkFilename:'[name].chunk.js'
        
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