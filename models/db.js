var MongoClient = require('mongodb').MongoClient;
// 导入数据库服务器配置
var settings = require("./settings.js");

// 基础方法 连接数据库 把得到的数据传递给
function _connectDB (callback) {
	var url = settings.url;
	// 连接数据库
	MongoClient.connect(url, (err, db) => {
		callback(err, db);
	})
}

// 插入数据
exports.insertOne = (collectionName, json, callback) => {
	 _connectDB ((err, db) => {
	 	db.collection(collectionName).insertOne(json, (err, result) => {
	 		callback(err, result);
	 		db.close();
	 	})
	 })
}

// 查询数据
// collectionName 查询数据库特定集合的名称
// json 查询条件 如果查询条件为空 传入{}
// toArray是使查询结果以数组返回
// json 是个对象 包含三个参数 {query: Object, limit: Number, skip: Number }
exports.find = (collectionName, json, callback) => {
	 _connectDB ((err, db) => {
    db.collection(collectionName).find(json.searchQuery).limit(json.limit).skip(json.skip).toArray((err, result) => {
	 		callback(err, result);
	 		db.close();
	 	})
	 })
}

// 删除数据
exports.delete = (collectionName, json, callback) => {
	 _connectDB ((err, db) => {
	 	db.collection(collectionName).deleteMany(json, (err, result) => {
	 		callback(err, result);
	 		db.close();
	 	})
	 })
}

// 修改数据  json1是查询条件 json2是要修改的数据
exports.updateMany = function (collectionName, json1, json2, callback) {
    _connectDB((err, db) => {
        db.collection(collectionName).update(
            json1,
            json2,
            (err, result) => {
                callback(err, result);
                db.close();
            });
    })
}

// 分页的时候 获取所有数据数量
exports.getAllCount = (collectionName, json, callback) => {
	 _connectDB ((err, db) => {
	 	db.collection(collectionName).find(json.searchQuery).count().then((result) => {
	 		callback(result);
	 		db.close();
	 	});
	 })
}
