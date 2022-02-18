/*
*  Create by Petar (2022-02-04)
*/
var path = require('path');
var winston = require('winston');
global.env = process.env.NODE_ENV || 'production';
var logger = new (winston.Logger)({
    transports: [
        new (winston.transports.Console)({
            colorize: true,
            prettyPrint: true,
            timestamp: function () {
                var date = new Date();
                return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.toTimeString().substr(0, 8);
            },
            level: global.env === 'production' ? 'info' : 'verbose'
        }),
        new (winston.transports.File)({
            name: 'info-file',
            colorize: true,
            filename: path.join(__dirname + '/../../log/log_info.log'),
            maxsize: '4194304',
            timestamp: function () {
                var date = new Date();
                return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.toTimeString().substr(0, 8);
            },
            level: global.env === 'production' ? 'info' : 'verbose'
        }),
    ],
    exceptionHandlers: [
        new winston.transports.File({
            filename: path.join(__dirname + '/../../log/exceptions.json'),
            timestamp: function () {
                var date = new Date();
                return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.toTimeString().substr(0, 8);
            },
            level: global.env === 'production' ? 'info' : 'verbose'
        })
    ]
})
module.exports = logger;
