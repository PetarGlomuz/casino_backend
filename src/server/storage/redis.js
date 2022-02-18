/*
*  Create by Petar (2022-02-04)
*/
var redis = require('redis');
var logger = require('../logger');

var RedisInterface = module.exports;


RedisInterface.connect = function(){
    //this.client = redis.createClient();
    //this.client.on('connect', function() {
    //    logger.info('Redis connection has been established successfully!!!');
    //});
}

RedisInterface.saveTree = function(key, value){
    let client = redis.createClient();
    client.on('connect', function() {
        client.hset("fit-tree-list", key, value);
        client.quit();
    });
}

RedisInterface.getTree = async function(key){
    let client = redis.createClient();
    return new Promise((resolve, reject) => {
        client.hget("fit-tree-list", key, function(err, result){
            client.quit();
            if(err) reject(err);
            resolve(result)
        });
    });
}

RedisInterface.setLastInboxChecked = async function(key, value){
  let client = redis.createClient();
  client.on('connect', function() {
      client.hset("fit-inbox-checked", key, value);
      client.quit();
  });
}

RedisInterface.getLastInboxChecked = async function(key){
  let client = redis.createClient();
  return new Promise((resolve, reject) => {
      client.hget("fit-inbox-checked", key, function(err, result){
          client.quit();
          if(err) reject(err);
          resolve(result)
      });
  });
}

RedisInterface.saveMessage = function(messageItem){
    let client = redis.createClient();
    client.on('connect', function() {
        client.sadd("chathistory-" + messageItem.threadid, JSON.stringify(messageItem));
        client.quit();
    });
}

RedisInterface.getChatHistory = async function(key){
    let client = redis.createClient();
    return new Promise((resolve, reject) => {
        client.smembers("chathistory-" + key, function(err, result){
            client.quit();
            if(err) reject(err);
            result = result.sort(function(a, b){
              a = JSON.parse(a).created;
              b = JSON.parse(b).created;
              if (a < b) return 1;
              if (a > b) return -1;
              return 0;
            })
            let ret = []
            result.forEach(function(item){
              ret.push(JSON.parse(item));
            })
            resolve(ret)
        });
    })
}

RedisInterface.removeUserGame =  function(key, delVal){
    let client = redis.createClient();
    client.srem("usergames-" + key, delVal);
    client.quit();
}

RedisInterface.setSMSCode = function(phone, sms){
    let client = redis.createClient();
    client.hset("sms-list", phone, sms);
    client.quit();
}

RedisInterface.getSMSCode = function(phone){
    let client = redis.createClient();
    return new Promise((resolve, reject) => {
        client.hget("sms-list", phone, function(err, result){
            client.hdel("sms-list", phone);
            client.quit();
            if(err) reject(err);
            resolve(result)
        });
    });
}


RedisInterface.setBetPreset = function(userid, preset){
    let client = redis.createClient();
    client.hset("BetPreset", userid, preset);
    client.quit();
}

RedisInterface.getBetPreset = function(userid){
    let client = redis.createClient();
    return new Promise((resolve, reject) => {
        client.hget("BetPreset", userid, function(err, result){
            client.quit();
            if(err) reject(err);
            resolve(result)
        });
    });
}
