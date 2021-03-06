var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Goods = require('../models/goods');

//连接MongoDB数据库
mongoose.connect('mongodb://127.0.0.1:27017/dervean');

mongoose.connection.on('connected', function() {
    console.log('MongoDB connected success.');
});

mongoose.connection.on('error', function() {
    console.log('MongoDB connected fail.');
});

mongoose.connection.on('disconnected', function() {
    console.log('MongoDB connected disconnected.');
});

//查询商品列表数据
router.get('/list', function(req, res, next) {
    let page = parseInt(req.param('page'));
    let pageSize = parseInt(req.param('pageSize'));
    let priceLevel = req.param('priceLevel');
    let sort = req.param('sort');
    let skip = (page - 1) * pageSize;
    var priceGt = '',
        priceLte = '';
    let params = {};
    if (priceLevel != 'all') {
        switch (priceLevel) {
            case '0':
                priceGt = 0;
                priceLte = 100;
                break;
            case '1':
                priceGt = 100;
                priceLte = 500;
                break;
            case '2':
                priceGt = 500;
                priceLte = 1000;
                break;
            case '3':
                priceGt = 1000;
                priceLte = 5000;
                break;
        }
        params = {
            salePrice: {
                $gt: priceGt,
                $lte: priceLte
            }
        };
    }
    let goodsModel = Goods.find(params)
        .skip(skip)
        .limit(pageSize);
    goodsModel.sort({ salePrice: sort });
    goodsModel.exec(function(err, docs) {
        if (err) {
            res.json({
                status: '1',
                msg: err.message
            });
        } else {
            res.json({
                status: '0',
                msg: '',
                result: {
                    count: docs.length,
                    list: docs
                }
            });
        }
    });
});

//加入到购物车
router.post('/addCart', function(req, res, next) {
    // 根据 cookie 获取用户 id
    var userId = req.cookies.userId;

    var productId = req.body.productId;
    var Users = require('../models/users');
    Users.findOne({ userId: userId }, function(err, userDoc) {
        if (err) {
            res.json({
                status: '1',
                msg: err.message
            });
        } else {
            if (userDoc) {
                var goodsItem = '';
                userDoc.cartList.forEach(function(item) {
                    if (item.productId === productId) {
                        goodsItem = item;
                        item.productNum++;
                    }
                });

                // 购物车未曾添加该商品
                if (!goodsItem) {
                    Goods.findOne({ productId: productId }, function(err, doc) {
                        if (err) {
                            res.json({
                                status: '1',
                                msg: err1.message
                            });
                        } else {
                            if (doc) {
                                doc.productNum = 1;
                                doc.checked = 1;
                                userDoc.cartList.push(doc);
                                userDoc.save(function(err, doc) {
                                    if (err) {
                                        res.json({
                                            status: '1',
                                            msg: err.message
                                        });
                                    } else {
                                        res.json({
                                            status: '0',
                                            msg: '',
                                            result: 'success'
                                        });
                                    }
                                });
                            }
                        }
                    });
                } else {
                    userDoc.save(function(err, doc) {
                        if (err) {
                            res.json({
                                status: '1',
                                msg: err.message
                            });
                        } else {
                            res.json({
                                status: '0',
                                msg: '',
                                result: 'success'
                            });
                        }
                    });
                }
            } 
            else {
                res.json({
                    status: '1',
                    msg: 'user not exists!'
                });
            }
        }
    });
});

module.exports = router;
