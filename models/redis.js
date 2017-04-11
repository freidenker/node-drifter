var redis = require('redis'),
    client = redis.createClient(6379, '15.107.16.134', {});

exports.throw = function(bottle, callback){
  bottle.time = bottle.time || Date.now();
  var bottleId = Math.random().toString(16);
  var type = {male: 0, female: 1};
  client.SELECT(type[bottle.type], function(){
    client.HMSET(bottleId, bottle, function(err, result){
      if(err){
        return callback({code: 0, msg: "try again later"});
      }
      callback({code: 1, msg: result});
      client.EXPIRE(bottleId, 86400);
    });
  });
}

exports.pick = function(info, callback){
  var type = {all: Math.round(Math.random()), male: 0, female: 1};
  info.type = info.type || 'all';
  client.SELECT(type[info.type], function(){
    client.RANDOMKEY(function(err, bottleId){
      if(!bottleId){
        return callback({code: 0, msg: "empty ocean...."});
      }
      client.HGETALL(bottleId, function(err, bottle){
        if(err){
          return callback({code: 0, msg: "the bottle is broke...."});
        }
        callback({code: 1, msg: bottle});
        client.DEL(bottleId);
      });
    });
  });
}
