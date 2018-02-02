var express = require('express');
var app = express();
var db = require('./models/db.js');

// 导入数据库模块
var MongoClient = require('mongodb').MongoClient

// 增加一个中间件 设置访问权限 'Access-Control-Allow-Origin', 'http://localhost:8080' 只允许 'http://localhost:8080'访问
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');
  // res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', true);
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  next();
});

app.use(express.static('./static'));

app.get('/insert', (req, res) => {
  var json = { 
    "name" : "beben",
    'age': 133
  };

  db.insertOne('class', json, (err, result) => {
    if (err) {
      console.log(err);
      return;
    } else {
      console.log('插入成功');
      return;
    }
  })
});

app.get('/find', (req, res) => {
  // contentName有 aboutus case certification news service
  var contentName = req.query.contentName;
  // json包含查询条件和分页信息
  var json = {
    query: {},
    curPage: 1,
    pageAmount: '',
    limit: 1000,
    skip: 0
  };

  // json 是个对象 包含三个参数 {query: Object, limit: Number, skip: Number }
  db.find(contentName, json, (err, result) => {
    if (err) {
      console.log(err);
      return;
    } else {
      console.log('查询结果是:', result);
      res.send(result);
    }
  })
});


app.get('/delete', (req, res) => {
  var json = { 
    "age" : parseInt(req.query['id'])
    // "abeng" : '15'
  };

  db.delete('class', json, (err, result) => {
    if (err) {
      console.log(err);
      return;
    } else {
      console.log(result);
      res.send('删除成功');
    }
  })
});

app.get('/getcount', (req, res) => {
  var json = {};
  db.getAllCount('class', json, (result => {
    console.log(result);
    res.send(result.toString());
  }));
})

app.listen(3000);

