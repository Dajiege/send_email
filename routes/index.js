var express = require('express');
var task = require('../task/sendmail');
var mongo = require('../seriver/mongoutil');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    var price = parseFloat(req.query.price);
    var push = parseFloat(req.query.pushprice);
    if(price){
        mongo.selectData({'id': 'price'},'mystatus',{},function(result){
            if(result.length == 0){
                var data = {'id': 'price', 'price' : price , 'pushprice' : push, 'status' : false};
                mongo.insertData(data, 'mystatus');
            } else {
                var data = {'price' : price , 'pushprice' : push, 'status' : false};
                mongo.updateData(data,{'id': 'price'},'mystatus');
            }
        })
    }
    task(function(arr){
        res.render('index',{data:arr});
    })
});

module.exports = router;
