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

function  asyncDescribeKeypair(item) {
    var bd = new Promise(function (resolve, reject) {
        var params = assign({
            Region: item.region,
            Action: 'DescribeKeyPairs',
            Version:'2017-03-12',
            KeyIds:[item.instanceId]
        });
        capi.request(params, {serviceType: 'cvm'}, function (err, data) {
            if (err) {
                reject(err);
            }
            else {
                resolve(assign(item,data.Response.KeyPairSet[0]));
            }
        });
    });
    return bd;
}

function asyncDescribeSecurityGroup(item){
    var bd = new Promise(function (resolve, reject) {
        var params = assign({
            Region: item.region,
            Action: 'DescribeSecurityGroupEx',
            Version:'2017-03-12',
            sgId:item.instanceId
        });
        //console.log(params);
        capi.request(params, {serviceType: 'dfw'}, function (err, data) {
            //console.log(data);

            if(err){
                reject(data);
            }else if(data.codeDesc != 'Success'|| data.data.detail.length == 0) {
                resolve(undefined);
            } else {
                resolve(assign(item,data.data.detail[0]));
            }
        });
    });
    return bd;
}


function asyncDescribeSGRule(item){
    var bd = new Promise(function (resolve, reject) {
        var params = assign({
            Region: item.region,
            Action: 'DescribeSecurityGroupPolicys',
            Version:'2017-03-12',
            sgId:item.instanceId
        });
        //console.log(params);
        capi.request(params, {serviceType: 'dfw'}, function (err, data) {
            //console.log(data);

            if(err){
                reject(data);
            }else if(data.codeDesc != 'Success') {
                resolve(undefined);
            } else {
                resolve(assign(item,data.data));
            }
        });
    });
    return bd;
}


router.get('/region',function (req,res) {
/*    var options = {
        Region: 'bj',
        Action: 'DescribeRegions'
    }

    capi.request(options, {
        serviceType: 'cvm'
    }, function(error, data) {
        //console.log(data);
        res.send(data)
    })*/

    res.send(JSON.stringify(config.qcloud.region));
})



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
        res.send({code:0});
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
        res.send({code:0});
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
        res.send({code:0});
    })
});



router.get('/securityGroup/:sgId/securityGroupRule',function(req, res) {
    var reqForm= {
        Region: JSON.parse(req.body).regionId,
        Action: 'DescribeSecurityGroupPolicys',
        sgId: req.params.sgId
    }
    //console.log(reqForm);
    req.userId = undefined;
    req.adminAccessToken = undefined;

    capi.request(reqForm, {
        serviceType: 'dfw'
    }, function(error, data) {
        if(error){
            console.log(error);
        }else{
            console.log(JSON.stringify(data,4,4));
            res.send(data);
        }
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

    //console.log(JSON.stringify(options,4,4));
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


router.get('/keypair',function(req, res) {
    var adminAccessToken = req.adminAccessToken;
    var reqForm= {
        userId:req.userId,
        provider:'qcloud',
        productName:'keypair',
        del:0
    }

    req.userId = undefined;
    req.adminAccessToken = undefined;

    var options = {
        headers: {'content-type' : 'application/json','Authorization': 'Bearer ' + adminAccessToken },
        url:     config.delivery.baseUrl + '/v1/hybrid/instance?'+ qs.stringify(reqForm),
    }

    request.get(options, function(e, response, body) {
            Promise.map(JSON.parse(body).instances, function (item) {
            return asyncDescribeKeypair(item);
            })
            .then(function(allResults){
                res.send('{"code":0,"instanceInfos":' + JSON.stringify(allResults) + '}');
        })
    });
});

router.delete('/keypair/:id',function(req, res) {
    var adminAccessToken = req.adminAccessToken;
    var keypairId = req.params.id;
    var reqForm= {
        userId:req.userId,
        regionId:req.query.regionId,
    }
    console.log(JSON.stringify(reqForm));
    req.userId = undefined;
    req.adminAccessToken = undefined;

    var options = {
        headers: {'content-type' : 'application/json','Authorization': 'Bearer ' + adminAccessToken },
        url:     config.delivery.baseUrl + '/v1/hybrid/qcloud/keypair/'+ keypairId + '?' + qs.stringify(reqForm),
    }

    request.delete(options, function(e, response, body) {
        if(e){
            console.log(JSON.stringify(e));
        }
        else{
            console.log(body);
            res.status(200).send({name:keypairId})
        }
    });
});

router.post('/keypair',function (req,res) {
    var adminAccessToken = req.adminAccessToken;
    var form= {
        userId:req.userId,
        projectId:config.qcloud.projectId,
        region:JSON.parse(req.body).regionId,
        keyName:JSON.parse(req.body).keyName
    }
    console.log(JSON.stringify(form));
    req.userId = undefined;
    req.adminAccessToken = undefined;

    var options = {
        headers:{'content-type' : 'application/json','Authorization': 'Bearer ' + adminAccessToken },
        url:    config.delivery.baseUrl + '/v1/hybrid/qcloud/keypair',
        form:   form
    }
    /*
    {
  "code": 0,
  "keyPair": {
    "KeyId": "skey-74cdnt2p",
    "KeyName": "111",
    "ProjectId": 1057374,
    "PublicKey": "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAAAgQDeQr5hGLYeFnUJ9lee5+woGMLFq0poJUbZkZhCQJapisbX7RmAcXYZygC/M8h60xB+oRTy/6xQJSWNMaDScIgXArRs2fzU7abxOwAI81MxHM72zTC+gaP3S1JGZjF/mWLuwRU2BQJehS3F4iYC3G4Fscnh4mfStQSmwb9j7MLbbQ== skey_170821",
    "PrivateKey": "-----BEGIN RSA PRIVATE KEY-----\nMIICXAIBAAKBgQDeQr5hGLYeFnUJ9lee5+woGMLFq0poJUbZkZhCQJapisbX7RmA\ncXYZygC/M8h60xB+oRTy/6xQJSWNMaDScIgXArRs2fzU7abxOwAI81MxHM72zTC+\ngaP3S1JGZjF/mWLuwRU2BQJehS3F4iYC3G4Fscnh4mfStQSmwb9j7MLbbQIDAQAB\nAoGAWGVxNErQu7ywxcqM5K1W1keqx1Ut3afdutBWHxtzEHEaTmyFNPlrQCyACYt9\n06O4LrTAETkwfhuYCMTRMoEBDm/yXGNUEaY2dz9jp+A2PR7MR7d5dxNo8k9DdPhj\nsRDcYdmvb49AxJxqJ1xGckPnz/bBkhYm8ztiFUv/NQ85df0CQQD2yp6SYSLX2zbx\nnyZaxKVMyNalnmNQDz5B6TeKCnaCoPj+bt02/7kdNE9fcRItHYnPY0ViPDUD7T+w\nqSD6V/LXAkEA5o3Nto7tg0uy1+GJIdyV1w/knlKoYgLTYFBu2RTmfeZSiNZIobEq\n3r1T1guDJByyJygWrJzddcuaRpmTZDSfWwJBAO4nK4zgdepN3iCezzlqaIXHjfN2\n/CmG/DJIp1Lrs99tDbsiKxFnBzEaiLn2eG7XAWUDTDJ3HUXzzbFiFLPg6TMCQHOE\nl48iHCWOF0UNr001HirMvssJNW8uZUS76F6Cl157udzwKSJDB+zkxg3YZNQCQM1X\ny8yfKGNuKZW4O16Y80MCQCRgRU5frVQVyXREhim2Gk6mpOW7uP+fCi1yYAMFeTRk\nFNyQLGyEh416vThxXxk3cVYI74X/PoHnHourHHbZk54=\n-----END RSA PRIVATE KEY-----\n"
  }
}
   */
    request.post(options, function(e, response, body) {
        if(e){
            console.log(JSON.stringify(e));
        }
        else{
            var rbody = {
                    'name' : JSON.parse(body).keyPair.KeyName,
                    'public_key':JSON.parse(body).keyPair.PublicKey,
                    'private_key': JSON.parse(body).keyPair.PrivateKey
            };
            res.status(201);
            res.send(JSON.stringify(rbody));
        }
    });
})

router.post('/keypair/import',function (req,res) {
    var adminAccessToken = req.adminAccessToken;
    var form= {
        userId:req.userId,
        projectId:config.qcloud.projectId,
        region:JSON.parse(req.body).regionId,
        keyName:JSON.parse(req.body).keyName,
        publicKey:JSON.parse(req.body).publicKey
    }
    console.log(JSON.stringify(form));
    req.userId = undefined;
    req.adminAccessToken = undefined;

    var options = {
        headers:{'content-type' : 'application/json','Authorization': 'Bearer ' + adminAccessToken },
        url:    config.delivery.baseUrl + '/v1/hybrid/qcloud/keypair/import',
        form:   form
    }
    /*
    body example:
    {
    "code": 0,
    "keyId": "skey-7zemjxq7"
}
 */
    console.log(JSON.stringify(options));
    request.post(options, function(e, response, body) {
        console.log(body);
        if(e){
            console.log(JSON.stringify(e));
        }
        else{
            if(response.statusChanged == 201){
                var rbody = {
                    'keyId':JSON.parse(body).keyId,
                };
                console.log(JSON.stringify(rbody));
                res.status(201);
                res.send(JSON.stringify(rbody));
            }
            else{
                res.status(response.statusCode);
                res.send(body);
            }
        }
    });
})

router.get('/securityGroup',function(req, res) {
    var adminAccessToken = req.adminAccessToken;
    var reqForm= {
        userId:req.userId,
        provider:'qcloud',
        productName:'securitygroup',
        del:0
    }
    //console.log(reqForm);
    req.userId = undefined;
    req.adminAccessToken = undefined;

    var options = {
        headers: {'content-type' : 'application/json','Authorization': 'Bearer ' + adminAccessToken },
        url:     config.delivery.baseUrl + '/v1/hybrid/instance?'+ qs.stringify(reqForm),
    }
    //console.log(options);
    request.get(options, function(e, response, body) {
            //console.log(body);
            Promise.map(JSON.parse(body).instances, function (item) {
            return asyncDescribeSecurityGroup(item);
            })
            .then(function(allResults){
                var info=[];
                for(r in allResults){
                    if(allResults[r] != undefined) info.push(allResults[r]);
                }
                //console.log(info);
                res.send({code:0,instanceInfos:info});
            })
    });
});


router.post('/securityGroup',function (req,res) {
    var adminAccessToken = req.adminAccessToken;
    //console.log(JSON.stringify(req.body));
    var form= {
        userId:req.userId,
        projectId:config.qcloud.projectId,
        region:JSON.parse(req.body).regionId,
        sgName:JSON.parse(req.body).sgName,
        sgRemark:JSON.parse(req.body).sgRemark,
    }
    console.log(JSON.stringify(form));
    req.userId = undefined;
    req.adminAccessToken = undefined;

    var options = {
        headers:{'content-type' : 'application/json','Authorization': 'Bearer ' + adminAccessToken },
        url:    config.delivery.baseUrl + '/v1/hybrid/qcloud/securityGroup',
        form:   JSON.parse(JSON.stringify(form))
    }
    /*
    body example:
{ code: 0,
  message: '',
  codeDesc: 'Success',
  data: { sgId: 'sg-4jnkhvn9', sgName: '001', sgRemark: 'xxx1' } }
 */
    console.log(JSON.stringify(options));
    request.post(options, function(e, response, body) {
        console.log(body);
        if(e){
            console.log(JSON.stringify(e));
        }
        else{
            if(response.statusChanged == 201){
                var rbody = {
                    'sgId':JSON.parse(body).data.sgId,
                };
                console.log(JSON.stringify(rbody));
                res.status(201);
                res.send(JSON.stringify(rbody));
            }
            else{
                res.status(response.statusCode);
                res.send(body);
            }
        }
    });
})

router.delete('/securityGroup/:id',function(req, res) {
    var adminAccessToken = req.adminAccessToken;
    var sgId = req.params.id;
    var reqForm= {
        userId:req.userId,
        regionId:req.query.regionId,
    }
    console.log(JSON.stringify(reqForm));
    req.userId = undefined;
    req.adminAccessToken = undefined;

    var options = {
        headers: {'content-type' : 'application/json','Authorization': 'Bearer ' + adminAccessToken },
        url:     config.delivery.baseUrl + '/v1/hybrid/qcloud/securityGroup/'+ sgId + '?' + qs.stringify(reqForm),
    }

    request.delete(options, function(e, response, body) {
        if(e){
            console.log(JSON.stringify(e));
        }
        else{
            console.log(body);
            res.status(200).send({name:sgId});
        }
    });
});

router.get('/securityGroupRule',function(req, res) {
    var reqForm= {
        Region: JSON.parse(req.body).regionId,
        Action: 'DescribeSecurityGroupPolicys',
        sgId:JSON.parse(req.body).sgId
    }
    //console.log(reqForm);
    req.userId = undefined;
    req.adminAccessToken = undefined;

    capi.request(reqForm, {
        serviceType: 'dfw'
    }, function(error, data) {
        if(error){
            console.log(error);
        }else{
            console.log(JSON.stringify(data,4,4));
            res.send(data);
        }
    })
});


module.exports = router;
