var mysql = require('mysql');

var mode = process.env.NODE_ENV||"development";
var app_config = require('../../../app_config.json')[mode];
var logger =  require('../logger');

var Database = module.exports;

Database.connector = mysql.createConnection({
  host: app_config.dbhost,
  user: app_config.dbuser,
  password: app_config.dbpassword,
  database: app_config.dbname
});

Database.connect = function()
{
    let self = this;
    this.connector.connect(async function(err)
    {
      if(err)
      {
        logger.warn("Database Connection has been failed: reason " + err);
        return;
      }
      logger.info("Database connection has been established..")
      self.connector.query("SELECT * FROM tbl_user", function (error, results, fields) {
        if (error) throw error;
      });
    });
}

Database.ExecuteQuery = async function(sql, params = null) {
  let self = this;
  return   new Promise((resolve, reject) => {
    if(params == null){
      self.connector.query(sql,function (error, results, fields) {
        if (error) reject (error);
        resolve(results);
      });
    }else{
      self.connector.query(sql, params, function (error, results, fields) {
        if (error) reject (error);
        resolve(results);
      });
    }
  });  
};



Database.SelectQuery =  async function(sql, params = null)
{
  try{
    return await this.ExecuteQuery(sql, params);
  }catch(err){
    logger.warn("Database query error: Select query has been failed: reason " + err);
  }
  return [];
}


Database.UpdateQuery = async function(sql, params)
{
  try{
    return await this.ExecuteQuery(sql, params);
  }catch(err){
    logger.warn("Database query error: Update query has been failed: reason " + err);
  }
  return [];
}

Database.DeleteQuery = async function(sql, params)
{
  try{
    return await this.ExecuteQuery(sql, params);
  }catch(err){
    logger.warn("Database query error: Delete query has been failed: reason " + err);
  }
  return [];
}

Database.InsertQuery = async function(sql, params)
{
  try{
    return await this.ExecuteQuery(sql, params);
  }catch(err){
    logger.warn("Database query error: Insert query has been failed: reason " + err);
  }
  return [];
}

Database.close = function()
{

}
