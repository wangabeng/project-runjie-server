var express = require('express');
var app = express();
var db = require('./models/db.js');

// 导入数据库模块
var MongoClient = require('mongodb').MongoClient

// 增加一个中间件 设置访问权限 'Access-Control-Allow-Origin', 'http://localhost:8080' 只允许 'http://localhost:8080'访问
app.use((req, res, next) => {
  // prod
  res.setHeader('Access-Control-Allow-Origin', 'runjie.benkid.cn:80');
  // dev
  // res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');
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

// 用户要传入collectionName 页码数（第几页）curPage
// 必须传入集合名 collectionName
// 若要查询第几页的数据 必须传入第几页 每页多少数量pageCapacity
// 传入集合名 第几页 页面容量应用示例
// http://localhost:3000/find?contentName=test&curPage=2&pageCapacity=5
// 只传入集合名示例
// http://localhost:3000/find
app.get('/find', (req, res, next) => {
  // contentName查询集合名 必须传入
  // 有 aboutus case certification news service
  var contentName = req.query.contentName;
  // 用户是否传入当前页 如果没有传入 默认是第1页 如果用户输入的是第0页 就显示第一页的内容
  var curPage = parseInt(req.query.curPage) || 1 ;
  // 用户是否传入查询调价 如果没有传入 默认为空对象{}
  var searchQuery = req.query.searchQuery || {};
  // 用户是否输入页面容量 即limit的值 如果没有输入 默认是非常大 暂定1000
  var pageCapacity = parseInt(req.query.pageCapacity) || 1000;
  // 计算skip的值
  var skip = (curPage - 1) * pageCapacity;
  // json包含查询条件和分页信息
  var json = {
    searchQuery: searchQuery,
    curPage: curPage,
    limit: pageCapacity,
    skip: skip
  };

  // json 是个对象 包含三个参数 {query: Object, limit: Number, skip: Number }
  db.find(contentName, json, (err, result) => {
    if (err) {
      console.log(err);
      next();
      return;
    } else {
      console.log('查询结果是:', result);
      res.send(result);
    }
  })
});


app.get('/delete', (req, res, next) => {
  var json = { 
    "age" : parseInt(req.query['id'])
    // "abeng" : '15'
  };

  db.delete('class', json, (err, result) => {
    if (err) {
      console.log(err);
      // res.send('没有查询到结果，请检查您的查询条件');
      next();
      return;
    } else {
      console.log(result);
      res.send('删除成功');
    }
  })
});

// 应用示例
// http://localhost:3000/getcount?contentName=test
app.get('/getcount', (req, res, next) => {
  // contentName查询集合名 必须传入
  var contentName = req.query.contentName;
  // 用户是否传入查询调价 如果没有传入 默认为空对象{}
  var searchQuery = req.query.searchQuery || {};
  // 用户是否输入页面容量 即limit的值 如果没有输入 默认是非常大 暂定1000
  var json = {
    searchQuery: searchQuery,
  };
  db.getAllCount(contentName, json, (result => {
    console.log(result);
    res.send(result.toString());
  }));
});

// 查询错误中间件
app.use((req, res) => {
  res.type('text/plain');
  res.send('请求错误');
});

app.listen(3009);

