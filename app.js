var express = require('express');
var redis = require('./models/redis.js');

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
    res.json(result);
  });
});

app.listen(3000);
