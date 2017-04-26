var request = require('superagent');
require('superagent-charset')(request);
var nodemailer = require("nodemailer");
var mongo = require('../seriver/mongoutil');
var send = function(cb){
    request
    .get('http://ta.hncae.net/front/hq/delay_hq.json')
    .charset('gbk')
    .end(function (err,r) {
        var arr = [];
        var data_  = eval(r.text);
        var data = data_[0].stockList;
        var transporter = nodemailer.createTransport('SMTP',{
            host: "smtp.163.com",
            secureConnection: true,
            port:465,
            auth: {
                user: '***@163.com',
                pass: '***'
            }
        });
        function jsonpCallback(a){
            return a;
        }
        for(var i = 0; i < data.length; i++){
            if(data[i].hqzqdm === "403011"){
                arr.push(data[i].hqjrzd);
                arr.push(data[i].hqzjcj);
            }
        }
        var mailOptions = {
            from: '"lin" <18621303280@163.com>', // sender address
            to: '5175248@qq.com', // list of receivers
            subject: '涨跌情况', // Subject line
            text: '抽奖', // plain text body
            html: '<b>涨跌幅：</b>' + arr[0] + '<br><b>当前价：</b>' + arr[1]// html body
        };
        mongo.selectData({'id': 'price'},'mystatus',{},function(result){
            if(result.length !== 0){
                var price = result[0].price;
                var push = result[0].pushprice;
                var flag = result[0].status;
                if(parseFloat(arr[1]) < (price+push) && !flag){
                    transporter.sendMail(mailOptions,function(err,res){
                        console.log(res);
                        var data = {'status' : true};
                        mongo.updateData(data,{'id': 'price'},'mystatus');
                    })
                }
            }
        });
        if(cb){
            cb(arr);
        }
    });
}

module.exports = send;