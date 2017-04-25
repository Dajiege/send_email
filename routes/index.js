var express = require('express');
var task = require('../task/sendmail');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  task(function(arr){
        res.render('index',{data:arr});
    })
});

module.exports = router;
