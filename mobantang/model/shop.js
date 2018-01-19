var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Shops = new Schema({
	shopname	: 	String,
	shopprice	: 	String,
	shopnum		: 	String,
	shopsales	: 	Number,
	shopstcok	: 	Number,
	imgPath     : String,
	flag		: 	Number,
	create_date: { type: Date, default: Date.now }
});
// 创建model对象
var ShopsModel = mongoose.model('shop', Shops);
// 公开对象，暴露接口
module.exports = ShopsModel;