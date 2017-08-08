const express = require('express');
const router = express.Router();
const OAuth2 = require('../oauth2').OAuth2;
const config = require('../config');
const crypto = require('crypto');
const querystring = require('querystring');
const qs = require("qs");
const request = require('request');
var secret = "adeghskdjfhbqigohqdiouka";

var oauth_client = new OAuth2(config.oauth.client_id,
                    config.oauth.client_secret,
                    config.oauth.account_server,
                    '/oauth2/authorize',
                    '/oauth2/token',
                    config.oauth.callbackURL);

//validate userToken and fetch adminToken
router.use(function (req,res,next) {
    console.log(1);
    var url = config.oauth.account_server + '/user';
    // Using the access token asks the IDM for the user info
    oauth_client.get(url, decrypt(req.cookies.oauth_token), function (e, response) {
        if (e) {
            console.log(e);
            res.redirect('/');
        }
        else {
            console.log(2);
            //1. fetch productAdminAccessToken
            var userId = JSON.parse(response).id;
            var headers = {
                'Authorization': 'Basic ' + encodeClientCredentials(config.productAdminOauth.client_id, config.productAdminOauth.client_secret),
                'Content-Type': 'application/x-www-form-urlencoded',
            }

            var form_data = qs.stringify({
                grant_type: 'password',
                username: config.productAdminOauth.username,
                password: config.productAdminOauth.password
            });

            var productAdminAccessToken = undefined;
            var options = {
                url: /*config.oauth.account_server*/ 'http://124.251.62.217:8000' + '/oauth2/token',
                body: form_data,
                headers: headers
            };

            console.log(JSON.stringify(options,4,4));
            request.post(options, function (adminTokenError, resp, body) {
                console.log(3);
                if (adminTokenError) {
                    console.log(adminTokenError);
                    res.redirect('/');
                } else {
                    console.log(body);
                    productAdminAccessToken = JSON.parse(body).access_token;
                    req.userId = userId;
                    req.adminAccessToken = productAdminAccessToken;
                    next();
                }
            });
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

router.get('/', function(req, res) {
    res.send('hello!'+ req.userId + ':' + req.adminAccessToken);
  //res.render('users', { title: 'Users' });
});

module.exports = router;
