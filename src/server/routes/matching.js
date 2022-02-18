/*
*  Create by Petar (2022-02-04)
*/
const Router = require('koa-router');
var logger = require('../logger');
const Database = require('../storage/database');
var mode = process.env.NODE_ENV || "development";
var app_config = require('../../../app_config.json')[mode];
const util = require('util')
const koaBody = require('koa-body');
const { Console } = require('console');

const router = new Router({
    prefix: "/api/matching"
});

setInterval(function () {

}, 15000)

//Get all Game Rooms
router.get('/list', async (ctx) => {
    try {
        let strSQL = 'SELECT * FROM tbl_matching';
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

//Create a new Room
router.post('/create_room', koaBody({ multipart: true }), async (ctx) => {
    let { accountID, gameID, roomName } = ctx.request.body;
    try {
        let timestamp_now = Math.floor(Date.now() / 1000);
        //Get userID inside user table from accountID
        strSQL = 'Select * from tbl_user where accountID=?';
        result = await Database.SelectQuery(strSQL, [accountID]);
        console.log("---User ID : " + result);
        let hostID = result[0]['id'];

        strSQL = 'Insert into tbl_matching (hostID, gameID, roomName, requestStatus, createdDate) values ' +
            '(?, ?, ?, ?, ?)';

        await Database.InsertQuery(strSQL, [hostID, gameID, roomName, 0, timestamp_now]);

        ctx.body = {
            success: true
        };
        return;
    } catch (ex) {
        console.log("Create Room issue", ex);
        logger.warn(ex);
        ctx.status = 403;
        ctx.body = {
            success: false,
            message: "Failure for Creating a New Room"
        };
    }
});

//Join to a Room
router.post('/join_room', koaBody({ multipart: true }), async (ctx) => {
    let { accountID, roomID } = ctx.request.body;
    try {
        //Get userID inside user table from accountID
        strSQL = 'Select * from tbl_user where accountID=?';
        result = await Database.SelectQuery(strSQL, [accountID]);
        let curClientID = result[0]['id'];

        //Get Current Room ClientID
        strSQL = 'Select * from tbl_matching where id=?';
        result = await Database.SelectQuery(strSQL, [roomID]);
        let roomClientID = result[0]['clientID'];

        if (roomClientID !== null && roomClientID.includes(" " + curClientID + ',')) {
            console.log("---already joined---");

            ctx.body = {
                success: true,
                message: "Already Joined"
            };
        }
        else {
            if (roomClientID == null) {
                roomClientID = " " + curClientID + ",";
            }
            else {
                roomClientID += " " + curClientID + ",";
            }

            strSQL = 'Update tbl_matching set clientID=? where id=?';
            await Database.UpdateQuery(strSQL, [roomClientID, roomID]);

            ctx.body = {
                success: true
            };
        }

        
        return;
    } catch (ex) {
        console.log("Create Join issue", ex);
        logger.warn(ex);
        ctx.status = 403;
        ctx.body = {
            success: false,
            message: "Failure for Join to the Room"
        };
    }
});

module.exports = router;
