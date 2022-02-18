const combineRouters = require('koa-combine-routers')
const Router = require('koa-router');

const userRoutes = require('./user');
const matchingRoutes = require('./matching');

const router = combineRouters(
    userRoutes,
    matchingRoutes
);

module.exports = router;
