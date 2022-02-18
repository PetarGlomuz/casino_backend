/*
*  Create by Petar (2022-02-04)
*/
var jwt = require('jsonwebtoken');
var logger = require('../logger');

const Constants = require('../constants/index');
const Database = require('../storage/database');
var mode = process.env.NODE_ENV||"development";
var app_config = require('../../../app_config.json')[mode];
const jwtSecret = app_config.jwtSecret;

async function verifyToken(ctx, next) {
  var token = ctx.request.header['authorization'];
  token = token.split(' ')[1];
  if (!token){
    ctx.status  = 403 ;
    ctx.body = { auth: false, success:false, message: 'No token provided.' };
    return
  }

  try{
    let decoded = await jwt.verify(token, jwtSecret);
    console.log(decoded);
    ctx.user = decoded;
    let result = await Database.SelectQuery("SELECT * FROM bd_admin WHERE id = ?", [decoded.id]);
    if(result.length > 0 ){
        ctx.user = result[0];
    }
    return next();
  }catch(ex){
    logger.warn(ex);
    ctx.status = 500;
    ctx.body = { auth: false, success:false, message: 'Failed to authenticate token.' };
    return;
  }
}

module.exports = verifyToken;
