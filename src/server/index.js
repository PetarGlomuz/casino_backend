const Koa = require('koa');
var bodyParser = require('koa-bodyparser');
const serve = require('koa-static');
const path = require('path');
var cors = require('koa-cors');
var convert = require('koa-convert');
const session = require("koa-session2");
const adminRouters = require('./routes');
const logger = require('./logger');
const Database = require('./storage/database');
//const RedisStore = require("./storage/store.js");
Database.connect();
const app = new Koa();
app.use(bodyParser({enableTypes: ['json', 'text']}));
/*
app.use(session({
    key: "FIT-SESS",
    store: new RedisStore()
}));
*/
const PORT = process.env.PORT || 5001;

const whitelist = ['http://172.16.71.109:3000', 'http://localhost:3000', 'http://localhost:3002'];

function checkOriginAgainstWhitelist(ctx) {
    const requestOrigin = ctx.accept.headers.origin;
    if (!whitelist.includes(requestOrigin)) {
        //return ctx.throw(`${requestOrigin} is not a valid origin`);
    }
    return requestOrigin;
 }
app.use(convert(cors({ origin: checkOriginAgainstWhitelist,  credentials :true})));
app.use(adminRouters());
app.use(serve(path.resolve(__dirname, '../../public/')));

const server = app.listen(PORT, () => {
  logger.info(`Server listening on port: ${PORT}`);
});


var gracefulShutdown = function() {
  console.log("Received kill signal, shutting down gracefully.");
  server.close(function() {
    console.log("Closed out remaining connections.");
    process.exit();
  });

   // if after
   setTimeout(function() {
       console.error("Could not close connections in time, forcefully shutting down");
       process.exit();
  }, 10*1000);
};


// listen for TERM signal .e.g. kill
process.on ('SIGTERM', gracefulShutdown);

// listen for INT signal e.g. Ctrl-C
process.on ('SIGINT', gracefulShutdown);
module.exports = server;
