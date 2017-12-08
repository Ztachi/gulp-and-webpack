/*
 * @Author: 詹真琦 
 * @Date: 2017-12-08 10:46:27 
 * @Description: 
 * @Last Modified by: 詹真琦
 * @Last Modified time: 2017-12-08 14:17:36
 */

const express = require('express'),
app =express(),
http = require('http'),
path = require('path'),
bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'src/static')));
app.use('/img',express.static(path.join(__dirname, 'src/static/img')));
app.use('/js',express.static(path.join(__dirname, 'src/static/js')));
app.use('/css',express.static(path.join(__dirname, 'src/static/css')));
app.use('/svg',express.static(path.join(__dirname, 'src/static/svg')));
app.set('port', process.env.PORT || 3000);
const server=http.createServer(app).listen(80);