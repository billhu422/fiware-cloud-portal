var OTHERCLOUD = OTHERCLOUD || {};

OTHERCLOUD.VERSION = '0.1';

OTHERCLOUD.AUTHORS = '21VIANET';

OTHERCLOUD.API = (function (_OTHERCLOUD,undefined) {
    
    var othercloudUrl = '';

    var sendRequest = function (method, url, body, callback, callbackError) {

        var req = new XMLHttpRequest();

        var token = JSTACK.Keystone.params.access.token;

        req.onreadystatechange = onreadystatechange = function () {

            if (req.readyState == '4') {

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



    var describeInstance = function(callback,callbackError){

	sendRequest('GET','cloud',undefined,function(resp){
	  callback(JSON.parse(resp));
        },callbackError);
    };

    var stopInstance = function(instId,callback,callbackError){
        console.log("othercloud stop!!!!");
        console.log(instId);
        sendRequest('POST','cloud/'+instId+'/stop',undefined,function(resp){
          callback(JSON.parse(resp));
        },callbackError);
   };

    var startInstance = function(instId,callback,callbackError){
        console.log("othercloud start!!!!");
        console.log(instId);
        sendRequest('POST','cloud/'+instId+'/start',undefined,function(resp){
          console.log("1111111111888888888888888888888111111111111111118888888888888888888888");
          console.log(JSON.parse(resp));
          console.log("1111111111888888888888888888888111111111111111118888888888888888888888");
          callback(JSON.parse(resp));
        },callbackError);
    };

  
    return {describeInstance:describeInstance,
            stopInstance:stopInstance,
            startInstance:startInstance
           };
}(OTHERCLOUD));
