var OTHERCLOUD = OTHERCLOUD || {};

OTHERCLOUD.VERSION = '0.1';

OTHERCLOUD.AUTHORS = '21VIANET';

OTHERCLOUD.API = (function (_OTHERCLOUD,undefined) {
    
    var othercloudUrl = '';

    var sendRequest = function (method, url, body, callback, callbackError) {

        var req = new XMLHttpRequest();

        var token = JSTACK.Keystone.params.access.token;

        req.onreadystatechange = onreadystatechange = function () {

            if (req.readyState === XMLHttpRequest.DONE ) {

                switch (req.status) {

                    case 100:
                    case 200:
                    case 201:
                    case 202:
                    case 203:
                    case 204:
                    case 205:
                        callback(req.responseText);
                        break;
                    default:
                        callbackError({message:req.status + " Error", body:req.responseText});
                }
            }
        }

        req.open(method, othercloudUrl + url, true);

        req.setRequestHeader('Accept', 'application/xml');
        req.setRequestHeader('Content-Type', 'application/xml');
//        req.setRequestHeader('X-Auth-Token', token);

        req.timeout = 20000;
        req.send(body);
    };



    var getRegion = function(callback,callbackError){
      	sendRequest('GET','hybrid/qcloud/region',undefined,function(resp){
	        callback(JSON.parse(resp));
        },callbackError);
    };

    var describeInstance = function(callback,callbackError){
        sendRequest('GET','cloud',undefined,function(resp){
          callback(JSON.parse(resp));
            },callbackError);
    };

    var stopInstance = function(instId,callback,callbackError){
        sendRequest('POST','cloud/'+instId+'/stop',undefined,function(resp){
          callback(JSON.parse(resp));
        },callbackError);
   };

    var startInstance = function(instId,callback,callbackError){
        sendRequest('POST','cloud/'+instId+'/start',undefined,function(resp){
          callback(JSON.parse(resp));
        },callbackError);
    };
 
    var describeBgpip = function(callback,callbackError){
         sendRequest('GET','hybrid/qcloud/bgpip',undefined,function(resp){
		callback(JSON.parse(resp));
         },callbackError);
    };

    var describeQcloudIns = function(callback,callbackError){
        sendRequest('GET','hybrid/qcloud/cvm',undefined,function(resp){
            callback(JSON.parse(resp));
            },callbackError);

    };

    var stopQcloudIns = function(instId,callback,callbackError){
        sendRequest('POST','hybrid/qcloud/cvm/'+instId+'/stop',undefined,function(resp){
          callback(JSON.parse(resp));
        },callbackError);
   };


    var startQcloudIns = function(instId,callback,callbackError){

        sendRequest('POST','hybrid/qcloud/cvm/'+instId+'/start',undefined,function(resp){
          callback(JSON.parse(resp));
        },callbackError);
    };

    var rebootQcloudIns = function(instId,callback,callbackError){

        sendRequest('POST','hybrid/qcloud/cvm/'+instId+'/reboot',undefined,function(resp){
          callback(JSON.parse(resp));
        },callbackError);
    };

    var describeQcloudKeypair = function(callback,callbackError){
        sendRequest('GET','hybrid/qcloud/keypair',undefined,function(resp){
          callback(JSON.parse(resp));
        },callbackError);
    };

    var delQcloudKeypair = function(keyId,regionId,callback,callbackError){
        sendRequest('DELETE','hybrid/qcloud/keypair/'+keyId+'?regionId=' + regionId,undefined,function(resp){
          callback(JSON.parse(resp));
        },callbackError);
    };

    var createQcloudKeypair = function (keyName,regionId,pubkey,callback,callbackError) {
        var body = {
            regionId:regionId,
            keyName:keyName,
            publicKey:pubkey
        }
        console.log('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAaa');
        console.log('body:'+JSON.stringify(body));
        var url = undefined;
        if(body.publiceKey == undefined)
            url = 'hybrid/qcloud/keypair';
        else
            url = 'hybrid/qcloud/keypair/import';

        sendRequest('POST',url,JSON.stringify(body),function(resp){
            console.log(resp);
          callback(JSON.parse(resp));
        },callbackError);

    };
  
    return {
            getRegion:getRegion,
            describeInstance:describeInstance,
            stopInstance:stopInstance,
            startInstance:startInstance,
            describeBgpip:describeBgpip,
            describeQcloudIns:describeQcloudIns,
            stopQcloudIns:stopQcloudIns,
            startQcloudIns:startQcloudIns,
            rebootQcloudIns:rebootQcloudIns,
            describeQcloudKeypair:describeQcloudKeypair,
            delQcloudKeypair:delQcloudKeypair,
            createQcloudKeypair:createQcloudKeypair
           };
}(OTHERCLOUD));
