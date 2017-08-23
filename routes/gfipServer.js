const express = require('express');
const gifpserver = express.Router();
const OAuth2 = require('../oauth2').OAuth2;
const config = require('../config');
const crypto = require('crypto');
const querystring = require('querystring');
const qs = require("qs");
const request = require('request');
const rp = require("request-promise");
const Capi = require('../../qcloudapi-sdk');
const assign = require('object-assign');
var Promise = require('bluebird');

var capi = new Capi({
        SecretId: config.qcloud.SecretId,
        SecretKey: config.qcloud.SecretKey,
        serviceType: 'account'
    });


//高仿ip规则列表
gifpserver.get('/gfipRule/list',function(req,resp){

    console.log('root app gfip rule');
    console.log("rule list===="+req.param("regionId"));

     var result = {gfipRules:[
         {"id":"rule-00000001","protocol":"TCP","virtualPort":"80","sourcePort":"80","ipList":"1.2.3.4；1.1.1.1"},
         {"id":"rule-00000002","protocol":"TCP","virtualPort":"80","sourcePort":"80","ipList":"1.2.3.5；2.2.2.2"},
         {"id":"rule-00000003","protocol":"TCP","virtualPort":"80","sourcePort":"80","ipList":"1.2.3.5；3.3.3.3"},
         {"id":"rule-00000004","protocol":"TCP","virtualPort":"80","sourcePort":"80","ipList":"1.2.3.5；4.4.4.4"},
         {"id":"rule-00000005","protocol":"TCP","virtualPort":"80","sourcePort":"80","ipList":"1.2.3.5；5.5.5.5"},
         {"id":"rule-00000006","protocol":"TCP","virtualPort":"80","sourcePort":"80","ipList":"1.2.3.5；6.6.6.6"},
         {"id":"rule-00000007","protocol":"TCP","virtualPort":"80","sourcePort":"80","ipList":"1.2.3.5；7.7.7.7"},
         {"id":"rule-00000008","protocol":"TCP","virtualPort":"80","sourcePort":"80","ipList":"1.2.3.5；7.7.7.7"},
         {"id":"rule-00000009","protocol":"TCP","virtualPort":"80","sourcePort":"80","ipList":"1.2.3.5；7.7.7.7"},
         {"id":"rule-00000010","protocol":"TCP","virtualPort":"80","sourcePort":"80","ipList":"1.2.3.5；7.7.7.7"},
         {"id":"rule-00000011","protocol":"TCP","virtualPort":"80","sourcePort":"80","ipList":"1.2.3.5；7.7.7.7"},
         {"id":"rule-00000012","protocol":"TCP","virtualPort":"80","sourcePort":"80","ipList":"1.2.3.5；7.7.7.7"},
         {"id":"rule-00000013","protocol":"TCP","virtualPort":"80","sourcePort":"80","ipList":"1.2.3.5；7.7.7.7"},
         {"id":"rule-00000014","protocol":"TCP","virtualPort":"80","sourcePort":"80","ipList":"1.2.3.5；7.7.7.7"},
         {"id":"rule-00000015","protocol":"TCP","virtualPort":"80","sourcePort":"80","ipList":"1.2.3.5；7.7.7.7"},
         {"id":"rule-00000016","protocol":"TCP","virtualPort":"80","sourcePort":"80","ipList":"1.2.3.5；7.7.7.7"},
         {"id":"rule-00000017","protocol":"TCP","virtualPort":"80","sourcePort":"80","ipList":"1.2.3.5；7.7.7.7"}

    ]};

    //result.gfipRules.splice(0,1);
    console.info("res       "+JSON.stringify(result));
    resp.send(JSON.stringify(result));

    /*

    new Promise(function(resolve,reject){
        //删除规则
        //查处本条高仿ip下所有规则
        var x = {
            'region': 'sh'
          };
        var params = assign({
            Region: 'sh',
            Action: 'NS.BGPIP.ServicePack.GetTransRules',
                    bgpId:'',
                    'paging.index':'',
                    'paging.count':''
            },
            x);

            var capi = new Capi({
                SecretId: config.qcloud.SecretIdc,
                SecretKey: config.qcloud.SecretKeyc,
                serviceType: 'account'
            });
            capi.request(params, {
                     serviceType: 'csec'
            }, function(error, data) {
                     return data;
            });
    }).then(function(result){
        resp.send(JSON.stringify(result));
    });
*/

});


//删除高仿ip规则
gifpserver.post("/gfipRule/del",function(req,resp){

    console.log('root app gfip rule del');
    var json = JSON.parse(req.body);
    console.log('rule del==='+json.regionId);

    new Promise(function(resolve,reject){
        //删除规则
        var capi = new Capi({
                SecretId: config.qcloud.SecretIdc,
                SecretKey: config.qcloud.SecretKeyc,
                serviceType: 'account'
        });
        var x = {
            'region': 'sh'
        }
        var params = assign({
                Region: 'sh',
                Action: 'NS.BGPIP.ServicePack.DeleteTransRules',
                uleId:''
            },
        x);
        capi.request(params, {
                 serviceType: 'csec'
        }, function(error, data) {
                 //console.log(data)
            resolve(data);
        });
    }).then(
        //查处本条高仿ip下所有规则
        function(result1){
            var capi = new Capi({
                SecretId: config.qcloud.SecretIdc,
                SecretKey: config.qcloud.SecretKeyc,
                serviceType: 'account'
            });
            var x = {
                'region': 'sh'
            };
            var params = assign({
                    Region: 'sh',
                    Action: 'NS.BGPIP.ServicePack.GetTransRules',
                    bgpId:'',
                    'paging.index':'',
                    'paging.count':''
                },
            x);
            capi.request(params, {
                     serviceType: 'csec'
            }, function(error, data) {
                     return data;
            });
        }
    ).then(function(result2){
        resp.send(JSON.stringify(result2));
    });

    /*
    //var id = req.body.ruleId;
    var json = JSON.parse(req.body);
    var id = json.ruleId;
    console.info("del rule       "+id);
    console.info("del rule       "+JSON.stringify(req.params));
    console.info("del rule       "+JSON.stringify(req.query));
    console.info("del rule       "+JSON.stringify(req.body));
    console.info("del rule       "+req.body);

    var result = {gfipRules:[
        {"id":"rule-00000001","protocol":"TCP","virtualPort":"80","sourcePort":"80","ipList":"1.2.3.4；1.1.1.1"},
        {"id":"rule-00000002","protocol":"TCP","virtualPort":"80","sourcePort":"80","ipList":"1.2.3.5；2.2.2.2"},
    ]};

    result.gfipRules.splice(0,1);
    console.info("res       "+JSON.stringify(result));
    resp.send(JSON.stringify(result));
    */
});

//修改高仿ip
gifpserver.post("/gfipInfo/update",function(req,resp){

    console.log('root app gfip rule update');
    var json = JSON.parse(req.body);
    console.log('regionId = '+json.regionId);
    /*
    var json = JSON.parse(req.body);
    var result = {"gfip":{}};
    result.gfip = json;
    console.info("res    update   "+JSON.stringify(json));
    resp.send(JSON.stringify(json));
    */

    new Promise(function(resolve,reject){
        //增加规则
        var capi = new Capi({
                SecretId: config.qcloud.SecretIdc,
                SecretKey: config.qcloud.SecretKeyc,
                serviceType: 'account'
        });
        var x = {
                'region': 'sh'
            };



        var params = assign({
                Region: 'sh',
                Action: 'NS.BGPIP.ServicePack.AddTransRules',   //NS.BGPIP.ServicePack.Rename
                bgpId: '',
                vip: '',
                protocol: '',
                virtualPort: '',
                sourcePort: '',
                ipList: ''
            },
        x);

        capi.request(params, {
                serviceType: 'csec'
        }, function(error, data) {
                 //console.log(data)
            resolve(data);
        });
    }).then(function(result){
        resp.send(JSON.stringify(result));
    });
});





//增加高仿ip规则
gifpserver.post("/gfipRule/add",function(req,resp){

    var json = JSON.parse(req.body);
    console.log("add rule======"+json.regionId);

    var id = req.body.ruleId;

    new Promise(function(resolve,reject){
        //增加规则
        var capi = new Capi({
                SecretId: config.qcloud.SecretIdc,
                SecretKey: config.qcloud.SecretKeyc,
                serviceType: 'account'
        });
        var x = {
                'region': 'sh'
            };
        var params = assign({
                Region: 'sh',
                Action: 'NS.BGPIP.ServicePack.AddTransRules',
                bgpId: '',
                vip: '',
                protocol: '',
                virtualPort: '',
                sourcePort: '',
                ipList: ''
            },
        x);

        capi.request(params, {
                 serviceType: 'csec'
        }, function(error, data) {
                 //console.log(data)
            resolve(data);
        });
    }).then(
        //查处本条高仿ip下所有规则
        function(result1){
            var capi = new Capi({
                SecretId: config.qcloud.SecretIdc,
                SecretKey: config.qcloud.SecretKeyc,
                serviceType: 'account'
            });
            var x = {
                'region': 'sh'
            };
            var params = assign({
                    Region: 'sh',
                    Action: 'NS.BGPIP.ServicePack.GetTransRules',
                    bgpId:'',
                    'paging.index':'',
                    'paging.count':''
                },
            x);

            capi.request(params, {
                     serviceType: 'csec'
            }, function(error, data) {
                     return data;
            });
        }
    ).then(function(result2){
        resp.send(JSON.stringify(result2));
    });

    //var id = req.body.ruleId;
    /*
    var json = JSON.parse(req.body);

    console.info("res    ss   "+JSON.stringify(json));
    var result = {gfipRules:[
        {"id":"rule-00000001","protocol":"TCP","virtualPort":"80","sourcePort":"80","ipList":"1.2.3.4；1.1.1.1"},
        {"id":"rule-00000002","protocol":"TCP","virtualPort":"80","sourcePort":"80","ipList":"1.2.3.5；2.2.2.2"},
    ]};

    result.gfipRules.push(json);
    console.info("res    ss   "+JSON.stringify(result));
    resp.send(JSON.stringify(result));
    */
});


//开关弹性防护
gifpserver.post("/elastic/protection",function(req,resp){

            var json = JSON.parse(req.body);
            var threshold = json.threshold;
            console.log('tanxing=================');
            console.log('regionId = '+json.regionId);

            var capi = new Capi({
                SecretId: config.qcloud.SecretIdc,
                SecretKey: config.qcloud.SecretKeyc,
                serviceType: 'account'
            });
            var x = {
                'region': 'sh'
            };
            var params = assign({
                    Region: 'sh',
                    Action: 'NS.BGPIP.ServicePack.GetTransRules',
                    bgpId:'',
                    'paging.index':'',
                    'paging.count':''
                },
            x);

            capi.request(params, {
                     serviceType: 'csec'
            }, function(error, data) {
                     //resp.send(JSON.stringify(result2));
            });

            resp.send(JSON.stringify(json));

});

//开关cc防护
gifpserver.post("/cc/protection",function(req,resp){
            console.log("cc_protection  !!!---------------------------");

            var json = JSON.parse(req.body);
            var status = json.status;
            console.log('regionId = '+json.regionId);
            console.log("cc_protection  status !!!---------------------------"+status);

            var capi = new Capi({
                SecretId: config.qcloud.SecretIdc,
                SecretKey: config.qcloud.SecretKeyc,
                serviceType: 'account'
            });

            var x = {
                'region': 'sh'
            };
            var params = assign({
                    Region: 'sh',
                    Action: 'NS.BGPIP.ServicePack.GetTransRules',
                    bgpId:'',
                    'paging.index':'',
                    'paging.count':''
                },
            x);

            capi.request(params, {
                     serviceType: 'csec'
            }, function(error, data) {
                     //resp.send(JSON.stringify(result2));
            });

            resp.send(JSON.stringify(json));
});


//设置cc防护阀值
gifpserver.post("/cc/threshold",function(req,resp){
            console.log("cc_threshold  !!!---------------------------");

            var json = JSON.parse(req.body);
            var threshold = json.threshold;

            console.log("cc_threshold  threshold !!!---------------------------"+threshold);
            console.log('regionId = '+json.regionId);
            var capi = new Capi({
                SecretId: config.qcloud.SecretIdc,
                SecretKey: config.qcloud.SecretKeyc,
                serviceType: 'account'
            });
            var x = {
                'region': 'sh'
            };
            var params = assign({
                    Region: 'sh',
                    Action: 'NS.BGPIP.ServicePack.SetCCThreshold',
                    bgpId:'',
                    'paging.index':'',
                    'paging.count':''
                },
            x);

            capi.request(params, {
                     serviceType: 'csec'
            }, function(error, data) {
                     //resp.send(JSON.stringify(result2));
            });



            resp.send(JSON.stringify(json));
});

//获取白名单列表
gifpserver.get("/whitelist/list",function(req,resp){
    console.log("whitelist----list!--ss");
    var result = {'whitelist':[{'id':1,'url':'http://www.111.com'},{'id':2,'url':'http://www.222.com'}]};
    console.log(JSON.stringify(result));
    resp.send(JSON.stringify(result));

});

//增加白名单
gifpserver.post("/whitelist/add",function(req,resp){
    console.log("whitelist----add!"+"  "+req.body.url);
    var json = JSON.parse(req.body);
    var result = {'whitelist':[{'id':1,'url':'http://www.111.com'},{'id':2,'url':'http://www.222.com'},
        {'id':3,'url':json.url}]};
    console.log(JSON.stringify(result));
    resp.send(JSON.stringify(result));

});

//删除白名单
gifpserver.post("/whitelist/del",function(req,resp){
    console.log("whitelist----del!");
    var json = JSON.parse(req.body);
    console.log("whitelist----del!==="+json.url);
    var result = {'whitelist':[
        {'id':1,'url':'http://www.111.com'}
       ]};
    resp.send(JSON.stringify(result));
});



module.exports = gifpserver;