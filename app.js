/*
 * @Author: 詹真琦 
 * @Date: 2017-12-08 10:46:27 
 * @Description: 
 * @Last Modified by: 詹真琦
 * @Last Modified time: 2017-12-14 17:28:53
 */

const express = require('express'),
    app = express(),
    http = require('http'),
    path = require('path'),
    bodyParser = require('body-parser'),
    routers = require('./routers');
app.use(bodyParser.json());
const staticBasePath = path.join(__dirname, 'src');
app.use(express.static(path.join(staticBasePath, 'static')));
const server = http.createServer(app).listen(3000);
routers(app);