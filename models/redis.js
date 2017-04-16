var redis = require('redis'),
    client = redis.createClient(6379, '192.168.19.129', {}),
    client2 = redis.createClient(6379, '192.168.19.129', {})
    client3 = redis.createClient(6379, '192.168.19.129', {});

exports.throw = function(bottle, callback){
// add new code for restrict 10 bottles
  client2.SELECT(2, function(){
    client2.GET(bottle.owner, function (err, result){
      if(result >= 10){
        return callback({code: 0, msg: "today have no chance to get more bottles"});
      }
      client2.INCR(bottle.owner, function(){
        client2.TTL(bottle.owner, function (err, ttl){
          if(ttl === -1){
            client2.EXPIRE(bottle.owner, 86400);
          }
        });
      });


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

 });
 });
}

exports.pick = function(info, callback){
// add new code for restrict 10 bottles
client3.SELECT(3, function(){
  client3.GET(info.user, function(err, result){
    if(result >= 10){
      return callback({code: 0, msg: "today no chance to throw more bottles"});
    }
    client3.INCR(info.user, function(){
      client3.TTL(info.user, function(err, ttl){
        if(ttl === -1){
          client3.EXPIRE(info.user, 86400);
        }
      });
    });


  // 20% is star
  if(Math.random() <= 0.2){
    return callback({code: 0, msg: "sea star"});
  }
  var type = {all: Math.round(Math.random()), male: 0, female: 1};
  info.type = info.type || 'all';
  client.SELECT(type[info.type], function(){
    client.RANDOMKEY(function(err, bottleId){
      if(!bottleId){
    //    return callback({code: 0, msg: "empty ocean...."});
         return callback({code: 0, msg: "sea star"});
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
  
 });
 });
}

exports.throwBack = function (bottle, callback){
  var type = {male: 0, female: 1};
  var bottleId = Math.random().toString(16);
  client.SELECT(type[bottle.type], function(){
    client.HMSET(bottleId, bottle, function (err, result){
      if(err){
        return callback({code: 0, msg: "try again later..."});
      }
      callback({code: 1, msg: result});
      client.PEXPIRE(bottleId, bottle.time+86400000 - Date.now());
    });
  });
}
