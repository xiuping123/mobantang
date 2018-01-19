var express = require('express');
var router = express.Router();
var ShopModel = require("../model/shop");
var multiparty = require("multiparty")

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET login page. */
router.get('/login', function(req, res, next) {
  res.render('login', { title: '登录界面' });
});

/* GET list page. */
router.get('/list', function(req, res, next) {
  res.render('list', { title: '列表界面' });
});

/* 商品列表 */
router.get('/shoplist', function(req, res, next) {
  res.render('shoplist');
})

/* 添加商品 */
router.get('/shopadd', function(req, res, next) {
  res.render('shopadd');
})

/* 获取数据 */
router.get('/api/listajax', function(req, res, next) {
	var condition = req.query.condition;
	// 注意代码的健壮性
	// 测试中，有异常系测试。 后端最头疼的是异常系测试。
	var pageNO = req.query.pageNO || 1;//页码
	pageNO = parseInt(pageNO);
	var perPageCnt = req.query.perPageCnt || 10;//每页显示的个数
	perPageCnt = parseInt(perPageCnt);

	ShopModel.count({flag: condition}, function(err, count){
		console.log("数量:" + count);
		var query = ShopModel.find({flag: condition})
		.skip((pageNO-1)*perPageCnt).limit(perPageCnt);
		query.exec(function(err, docs){
			console.log(err, docs);
			var result = {
				total: count,
				data: docs,
				pageNO: pageNO,
				perPageCnt:perPageCnt
			};
			res.json(result);
		});
	})
});

/* 更改数据库信息 */
router.post('/api/removedata', function (req, res, next) {
	var sname = req.body.sname;
	ShopModel.update({shopname:sname},{$set:{flag:0}},function (err) {
		if(err){
			console.log(err);
		}
		res.send("删除成功")
	});

})

/* 更新数据库信息 */
router.post('/api/updatedata', function (req, res, next) {
	var uname = req.body.uname;
	ShopModel.find({shopname:uname},function (err,docs) {
		res.send(docs);
	});


})

/* 登录 */
router.post('/api/loginajax', function(req, res, next) {
	var username = req.body.username;
	var psw = req.body.psw;
	var captcha = req.body.captcha;
	var result = {
		code: 1,
		message: "登录成功"
	};
	console.log(username,psw,captcha);
	if(captcha == ""){
		result.code = -554;
		result.message = "验证码不能为空";
		res.json(result);
		return;
	}
	if(username=="admin" && psw=="h5h5h5h5"){
		res.json(result);

	}else {
		result.code = -555;
		result.message = "用户名或密码错错误，请重新输入";
		res.json(result);
	}
})

/* 添加商品 */
router.post('/api/referajax', function (req, res, next) {
	
	var form = new multiparty.Form({
		uploadDir: "public/images"
	});
	var result = {
		code: 1,
		message: "商品信息保存成功"
	};
	form.parse(req, function(err, body, files){
		if(err) {
			console.log(err);
		}
		console.log(body);
		var shopname = body.shopname[0];
		var shopnum = body.shopnum[0];
		var shopprice = body.shopprice[0];
		var shopsales = body.shopsales[0];
		var shopstcok = body.shopstcok[0];
		var imgPath = files["img"][0].path.replace("public\\", "");
		//添加新商品
		var sh = new ShopModel();
		sh.shopname = shopname;
		sh.shopnum = shopnum;
		sh.shopprice = shopprice;
		sh.shopsales = shopsales;
		sh.shopstcok = shopstcok;
		sh.imgPath = imgPath;
		sh.flag = 1;
		sh.save(function (err) {
			if(err){
				console.log(err);
				result.code = -110;
				result.message = "添加失败";
				res.send("添加失败");
			}
			res.json(result);
		})
		
	})

})


module.exports = router;
