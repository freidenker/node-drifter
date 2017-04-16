var express = require('express');
var redis = require('./models/redis.js');
var mongodb = require('./models/mongodb.js');

var app = express();
app.use(express.bodyParser());

// POST owner=xxx&type=xxx&content=xxx[&time=xxx]
app.post('/',function(req,res){
  if(!(req.body.owner && req.body.type && req.body.content)){
    if(req.body.type && (["male","female"].indexOf(req.body.type) === -1)){
      return res.json({code: 0, msg: "type error"});
    }
    return res.json({code: 0, msg: "info not completed"});
  }
  redis.throw(req.body, function(result){
    res.json(result);
  });
});

//GET /?user=xxx[&type=xxx]
app.get('/', function(req, res){
  if(!req.query.user){
    return res.json({code: 0, msg: "info not completed"});
  }
  if(req.query.type && (["male","female"].indexOf(req.query.type) === -1 )){
    return res.json({code: 0, msg: "type error"});
  }
  redis.pick(req.query, function(result){
    if(result.code === 1){
      mongodb.save(req.query.user, result.msg, function (err){
        if(err){
          return res.json({code: 0, msg: "getting bottle failed, try again"});
        }
        return res.json(result);
      });
    }
    res.json(result);
  //  res.json(result);
  });
});

// give away bottle
// POST owner=xxx&type=xxx&content=xxx&time=xxx
app.post('/back', function (req,res){
  redis.throwBack(req.body, function(result){
    res.json(result);
  });
});

// GET /user/winter
app.get('/user/:user', function(req, res){
  mongodb.getAll(req.params.user, function(result){
    res.json(result);
  });
});

// GET /bottle/_id
app.get('/bottle/:_id', function (req, res){
  mongodb.getOne(req.params._id, function(result){
    res.json(result);
  });
});

// POST user=xxx&content=xxx[&time=xxx]
app.post('/reply/:_id', function (req, res){
  if(!(req.body.user && req.body.content)){
    return callback({code: 0, msg: "reply info not completed"});
  }
  mongodb.reply(req.params._id, req.body, function (result){
    res.json(result);
  });
});

// GET /delete/_id
app.get('/delete/:_id', function(req, res){
  mongodb.delete(req.params._id, function (result){
    res.json(result);
  });
});

app.listen(3000);
