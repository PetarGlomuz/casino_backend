/*
*  Create by Petar (2022-02-04)
*/
const Router = require('koa-router');
var logger = require('../logger');
const Database = require('../storage/database');
var mode = process.env.NODE_ENV || "development";
var app_config = require('../../../app_config.json')[mode];
const util = require('util')
const koaBody = require('koa-body')

const router = new Router({
    prefix: "/api/user"
});

setInterval(function () {
    
}, 15000)

router.get('/list', async (ctx) => {
    try {
        let strSQL = 'SELECT * FROM tbl_user';
        result = await Database.SelectQuery(strSQL);
        ctx.body = {
            items: result
        };
    } catch (ex) {
        logger.warn(ex);
        ctx.status = 403;
        ctx.body = {
            success: false,
            message: "Failure for editing detail."
        };
    }
});

//User Register
router.post('/register', koaBody({ multipart: true }), async (ctx) => {
    let { nickName, accountID, password, accountCode} = ctx.request.body;
    console.log("---nickName : " + nickName + " , accountID : " + accountID + " , password : " + password + " , accountCode : " + accountCode);
    try {
        let timestamp_now = Math.floor(Date.now() / 1000);

        if(nickName !== undefined && accountID !== undefined && password !== undefined && accountCode !== undefined)
        {
            let strSQL = 'SELECT * FROM tbl_user where nickName=? OR accountID=? OR accountCode=?';
            result = await Database.SelectQuery(strSQL, [nickName, accountID, accountCode]);

            if(result == null || result.length == 0)
            {
                strSQL = 'Insert into tbl_user (nickName, accountID, password, accountCode, date) values ' +
                        '(?, ?, ?, ?, ?)';

                await Database.InsertQuery(strSQL, [nickName, accountID, password, accountCode, timestamp_now]);

                ctx.body = {
                    success: true
                };
            }
            else
            {
                ctx.body = {
                    success: false,
                    message: "There is user already has same info"
                };
            }
        }
        else
        {
            ctx.body = {
                success: false,
                message: "parameters are not inputed"
            };
        }
        return;
    } catch (ex) {
        console.log("register user issue", ex);
        logger.warn(ex);
        ctx.status = 403;
        ctx.body = {
            success: false,
            message: "Register failed"
        };
    }
});

//User Login
router.post('/login', koaBody({ multipart: true }), async (ctx) => {
    let { accountID, password} = ctx.request.body;
    try {
        let timestamp_now = Math.floor(Date.now() / 1000);

        strSQL = 'Select * from tbl_user where accountID=? And password=?';
        result = await Database.SelectQuery(strSQL, [accountID, password]);

        if(result == null || result.length == 0)
        {
            ctx.body = {
                success: false,
                message: "Login Fail"
            };
        }
        else
        {
            strSQL = 'Update tbl_user set date=? where accountID=?';
            await Database.UpdateQuery(strSQL, [timestamp_now, accountID]);
            ctx.body = {
                success: true
            };
        }
        return;
    } catch (ex) {
        console.log("Login issue", ex);
        logger.warn(ex);
        ctx.status = 403;
        ctx.body = {
            success: false,
            message: "Login Error"
        };
    }
});

//Forgot Password
router.post('/forgot_password', koaBody({ multipart: true }), async (ctx) => {
    let { accountID, new_password} = ctx.request.body;
    try {
        strSQL = 'Update tbl_user set password=? where accountID=?';
        await Database.UpdateQuery(strSQL, [new_password, accountID]);

        ctx.body = {
            success: true,
            message: "Password Reset Success"
        };
        return;
    } catch (ex) {
        console.log("Password Reset issue", ex);
        logger.warn(ex);
        ctx.status = 403;
        ctx.body = {
            success: false,
            message: "Password Reset Error"
        };
    }
});

//Update User Info
router.post('/update_user', koaBody({ multipart: true }), async (ctx) => {
    console.log('22222222', ctx.request.body);
    let { accountID, avatar, nickName} = ctx.request.body;
    try {
        let strSQL = 'Select * from tbl_user where accountID=?';
        result = await Database.SelectQuery(strSQL, [accountID]);

        let timestamp_now = Math.floor(Date.now() / 1000);
        
        if(result == null || result.length == 0)
        {
        }
        else
        {
            console.log("BBBBBBBBBBBBBBBBBBB");
            strSQL = 'Update tbl_user set avatar=?, nickName=?, date=? where accountID=?';
            await Database.UpdateQuery(strSQL, [avatar, nickName, timestamp_now, accountID]);
        }

        ctx.body = {
            success: true
        };
        return;
    } catch (ex) {
        console.log("update user issue", ex);
        logger.warn(ex);
        ctx.status = 403;
        ctx.body = {
            success: false,
            message: "Failure for modifying main setting"
        };
    }
});

module.exports = router;
