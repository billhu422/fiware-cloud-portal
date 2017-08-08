const express = require('express');
const router = express.Router();
const OAuth2 = require('../oauth2').OAuth2;
const config = require('../config');
const crypto = require('crypto');
const querystring = require('querystring');
const qs = require("qs");
const request = require('request');
const rp = require("request-promise");
const Capi = require('../../qcloudapi-sdk');
const assign = require('object-assign');

//var Promise = require('promise');
var Promise = require('bluebird');
var secret = "adeghskdjfhbqigohqdiouka";

var oauth_client = new OAuth2(config.oauth.client_id,
                    config.oauth.client_secret,
                    config.oauth.account_server,
                    '/oauth2/authorize',
                    '/oauth2/token',
                    config.oauth.callbackURL);

var capi = new Capi({
        SecretId: config.qcloud.SecretId,
        SecretKey: config.qcloud.SecretKey,
        serviceType: 'account'
    })

function  asyncRequest(){
    var bd = new Promise(function(resolve, reject) {
        request.get({url:'http://124.251.62.217:8000/'}, function(err,r, data) {
            console.log(2);
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        });
        return bd;
}


router.get('/hello', function(req,res){
      asyncRequest().then(function(data) {
          console.log(6);
          console.log(data);
    });
})


function  asyncDescribeCvm(item) {
    var bd = new Promise(function (resolve, reject) {
        var params = assign({
            Region: item.region,
            Action: 'DescribeInstances',
            'region': item.region,
            instanceIds: [item.instanceId]
        });
        capi.request(params, {serviceType: 'cvm'}, function (err, data) {
            if (err) {
                reject(err);
            }
            else {

                resolve(assign(item,data.instanceSet[0]));
            }
        });
    });
    return bd;
}



//validate userToken
router.use(function (req,res,next) {
    var url = config.oauth.account_server + '/user';
    // Using the access token asks the IDM for the user info
    oauth_client.get(url, decrypt(req.cookies.oauth_token), function (e, response) {
        if (e) {
            console.log(e);
            res.redirect('/');
        }
        else {
            req.userId = JSON.parse(response).id;
            next();
        }
    });
});


router.post('/cvm/:id/start',function (req,res) {

    var options = {
        Region: 'bj',
        Action: 'StartInstances',
        'instanceIds.0': req.params.id
    }

    capi.request(options, {
        serviceType: 'cvm'
    }, function(error, data) {
        console.log(data);
    })
});

router.post('/cvm/:id/stop',function (req,res) {

    var options = {
        Region: 'bj',
        Action: 'StopInstances',
        'instanceIds.0': req.params.id
    }
    console.log(options);
    capi.request(options, {
        serviceType: 'cvm'
    }, function(error, data) {
        console.log(data);
    })
});

router.post('/cvm/:id/reboot',function (req,res) {

    var options = {
        Region: 'bj',
        Action: 'RestartInstances',
        'instanceIds.0': req.params.id
    }
    console.log(options);
    capi.request(options, {
        serviceType: 'cvm'
    }, function(error, data) {
        console.log(data);
    })
});

//fetch adminAccessToken
router.use(function (req,res,next) {
    var headers = {
        'Authorization': 'Basic ' + encodeClientCredentials(config.productAdminOauth.client_id, config.productAdminOauth.client_secret),
        'Content-Type': 'application/x-www-form-urlencoded',
    }

    var form_data = qs.stringify({
        grant_type: 'password',
        username: config.productAdminOauth.username,
        password: config.productAdminOauth.password
    });

    var options = {
        url: /*config.oauth.account_server*/ 'http://124.251.62.217:8000' + '/oauth2/token',
        body: form_data,
        headers: headers
    };

    console.log(JSON.stringify(options,4,4));
    request.post(options, function (e, resp, body) {
        if (e) {
            console.log(e);
            res.redirect('/');
        } else {
            req.adminAccessToken = JSON.parse(body).access_token;
            next();
        }
    });
});


var encodeClientCredentials = function(clientId, clientSecret) {
	return new Buffer(querystring.escape(clientId) + ':' + querystring.escape(clientSecret)).toString('base64');
};

function decrypt(str){
  var decipher = crypto.createDecipher('aes-256-cbc',secret);
  var dec = decipher.update(str,'hex','utf8');
  dec += decipher.final('utf8');
  return dec;
}

router.get('/cvm', function(req, res) {
    var userId = req.userId;
    var adminAccessToken = req.adminAccessToken;

    req.userId = undefined;
    req.adminAccessToken = undefined;

    var options = {
        headers: {'content-type' : 'application/json','Authorization': 'Bearer ' + adminAccessToken },
        url:     config.delivery.baseUrl + '/v1/hybrid/instance?userId='+ userId + '&provider=qcloud&productName=cvm',
    }

    request.get(options, function(e, response, body) {
            Promise.map(JSON.parse(body).instances, function (item) {
            return asyncDescribeCvm(item);
            })
            .then(function(allResults){
                res.send('{"code":0,"instanceInfos":' + JSON.stringify(allResults) + '}');
        })
    });
});

module.exports = router;
