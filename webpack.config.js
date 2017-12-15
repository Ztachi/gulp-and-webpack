/*
 * @Author: 詹真琦(legendryztachi@gmail.com)
 * @Date: 2017-12-08 15:18:44 
 * @Description: 
 * @Last Modified by: 詹真琦(legendryztachi@gmail.com)
 * @Last Modified time: 2017-12-15 15:42:38
 */
const webpack = require('webpack'),
    path = require('path'),
    BASE_PATH = './src/app/js/';

module.exports = {
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