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

/*    var describeInstance = function(callback,callbackError){
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
    };*/
 
    var describeBgpip = function(callback,callbackError){
         sendRequest('GET','hybrid/qcloud/bgpip',undefined,function(resp){
		callback(JSON.parse(resp));
         },callbackError);
    };

    var describeQcloudIns = function(regionId,callback,callbackError){
        sendRequest('GET','hybrid/qcloud/cvm?regionId='+regionId,undefined,function(resp){
            callback(JSON.parse(resp));
            },callbackError);
    };

    var readQcloudIns = function(regionId,id,callback,callbackError){
        var orderId = id.split('-')[0];
        var orderItemId = id.split('-')[1];
        var instId = id.split('-')[2] + '-' + id.split('-')[3];
        sendRequest('GET','hybrid/qcloud/cvm?regionId='+regionId + '&orderId=' + orderId + '&orderItemId=' + orderItemId +
            '&instanceId=' + instId ,undefined,function(resp){
            callback(JSON.parse(resp));
            },callbackError);
    };

    var stopQcloudIns = function(instId,regionId,callback,callbackError){
        var body = {
            regionId:regionId
        }
        sendRequest('POST','hybrid/qcloud/cvm/'+instId+'/stop',JSON.stringify(body),function(resp){
          callback(JSON.parse(resp));
        },callbackError);
   };

    var startQcloudIns = function(instId,regionId,callback,callbackError){
        var body = {
            regionId:regionId
        }
        sendRequest('POST','hybrid/qcloud/cvm/'+instId+'/start',JSON.stringify(body),function(resp){
          callback(JSON.parse(resp));
        },callbackError);
    };

    var rebootQcloudIns = function(instId,regionId,callback,callbackError){
        var body = {
            regionId:regionId
        }
        sendRequest('POST','hybrid/qcloud/cvm/'+instId+'/reboot',JSON.stringify(body),function(resp){
          callback(JSON.parse(resp));
        },callbackError);
    };

    var resetPWIns = function (instId,regionId,pw,callback,callbackError) {
        var body = {
            regionId:regionId,
            password:pw
        }
        sendRequest('POST','hybrid/qcloud/cvm/'+instId+'/resetPassword',JSON.stringify(body),function(resp){
          callback(JSON.parse(resp));
        },callbackError);
    }

    var describeQcloudKeypair = function(regionId,callback,callbackError){
        sendRequest('GET','hybrid/qcloud/keypair?regionId='+ regionId,undefined,function(resp){
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
        var url = undefined;
        if(body.publiceKey == undefined)
            url = 'hybrid/qcloud/keypair';
        else
            url = 'hybrid/qcloud/keypair/import';

        sendRequest('POST',url,JSON.stringify(body),function(resp){
          callback(JSON.parse(resp));
        },callbackError);

    };

    var describeSecurityGroup = function(regionId,callback,callbackError) {
         sendRequest('GET','hybrid/qcloud/securityGroup?regionId=' + regionId,undefined,function(resp){
          callback(JSON.parse(resp));
        },callbackError);
    };

    var createSecurityGroup = function (name,regionId,desc,callback,callbackError) {
        var body = {
            regionId:regionId,
            sgName:name,
            sgRemark:desc
        }
        sendRequest('POST','hybrid/qcloud/securityGroup',JSON.stringify(body),function(resp){
          callback(JSON.parse(resp));
        },callbackError);
    };

    var delSecurityGroup = function (sgId,regionId,callback,callbackError) {
        sendRequest('DELETE','hybrid/qcloud/securityGroup/'+sgId + '?regionId=' +regionId,undefined,function(resp){
          callback(JSON.parse(resp));
        },callbackError);
    };

    var describeSecurityGroupDetail = function(sgId,regionId,callback,callbackError) {
         sendRequest('GET','hybrid/qcloud/securityGroup/'+ sgId + '/securityGroupRule?regionId='+regionId,undefined,function(resp){
             console.log('55555555555555555555555');
             console.log(JSON.stringify(JSON.parse(resp),4,4));
             console.log('5555555555555555555555555');
          callback(JSON.parse(resp));
        },callbackError);
    };


    var createSecurityGroupRule = function (sgId,regionId,direction,index,ipProtocol,cidrIp,from_port,to_port,action,callback,callbackError){
        var body = {
            Region: regionId,
            sgId:sgId,
            direction: direction,
            index: index,
            policys: [{//Mandatory
                ipProtocol: ipProtocol,
                cidrIp: cidrIp,
                portRange: from_port === to_port?from_port:from_port + '-' + to_port,
                desc: '',
                action: action
            }]
        }
        console.log('777777777777777777777777777777777');
        console.log(JSON.stringify(body,4,4));
        sendRequest('POST','hybrid/qcloud/securityGroup/'+sgId + '/securityGroupRule',JSON.stringify(body),function(resp){
          callback(JSON.parse(resp));
        },callbackError);
    };

    var delSecurityGroupRule = function (sgId,regionId,direction,index,callback,callbackError) {
        sendRequest('DELETE','hybrid/qcloud/securityGroup/'+sgId + '/securityGroupRule/' +
          index  + '?regionId=' +regionId + '&direction=' + direction,undefined,function(resp){
          callback(JSON.parse(resp));
        },callbackError);
    };

        /***********************************************************************************************************/

/*
    //获取高仿ip列表
    var getGFIPList = function(model,callback,callbackError){
    alert("sss");
        sendRequest('GET',
            '/gfip/list',
            undefined,
            function(resp){
              callback(JSON.parse(resp));
            },callbackError);
    };
*/
    //修改高仿ip信息
    var updateGFIPInfo = function(model,callback,callbackError,options){
        sendRequest('POST',
            '/gfip/gfipInfo/update',
            JSON.stringify(options.context),
            function(resp){
                callback(JSON.parse(resp));
            },callbackError);
    };

    //获取高仿ip规则列表
    var getRuleList = function(model,callback,callbackError,options){
        sendRequest('GET',
            '/gfip/gfipRule/list?bgpId='+options.parent_id,
            undefined,
            function(resp){
                callback(JSON.parse(resp));
            },callbackError);
    };

    //删除高仿ip规则
    var delRule = function(model,callback,callbackError,options){
        var p = {};
        p.ruleId = options.ruleId;
        sendRequest('POST',
            '/gfip/gfipRule/del',
            JSON.stringify(p),
            function(resp){
                callback(JSON.parse(resp));
            },callbackError);
    };

    //增加高仿ip规则
    var addRule = function(model,callback,callbackError,options){
        sendRequest('POST',
            '/gfip/gfipRule/add',
            JSON.stringify(options.context),
            function(resp){
                callback(JSON.parse(resp));
            },callbackError);
    };


    //获取高仿ip列表
    var getGFIPList = function(model,callback,callbackError,options){
        sendRequest('GET',
            'hybrid/qcloud/getGFIPList',
            undefined,
            function(resp){
              callback(JSON.parse(resp));
            },callbackError);
    };

    //获取白名单列表
    var getWhiteList = function(model,callback,callbackError,options){
        sendRequest('GET',
            '/gfip/whitelist/list',
            undefined,
            function(resp){
                callback(JSON.parse(resp));
            },callbackError);
    }

    //增加白名单
    var addWhiteList = function(model,callback,callbackError,options){
        sendRequest('POST',
            '/gfip/whitelist/add',
            JSON.stringify(options.context),
            function(resp){
                callback(JSON.parse(resp));
            },callbackError);
    }

    //删除白名单
    var delWhiteList = function(model,callback,callbackError,options){
        var p = {};
        p.whitelist = [{'url':options.url}];
        sendRequest('POST',
            '/gfip/whitelist/del',
            JSON.stringify(p),
            function(resp){
                callback(JSON.parse(resp));
            },callbackError);
    }

    //修改cc阀值
    var updateThreshold = function(model,callback,callbackError,options){
        var p = {};
        p.threshold = options.value;
        sendRequest('POST',
            '/gfip/cc/threshold',
            JSON.stringify(p),
            function(resp){
                callback(JSON.parse(resp));
         },callbackError);
    }

    //修改cc防护状态
    var updateCCStatus = function(model,callback,callbackError,options){
        var p = {};
        p.status = options.value;
        sendRequest('POST',
            '/gfip/cc/protection',
            JSON.stringify(p),
            function(resp){
                callback(JSON.parse(resp));
        },callbackError);
    }



    /******************************************************************************************************************/


    return {
            getRegion:getRegion,
/*            describeInstance:describeInstance,
            stopInstance:stopInstance,
            startInstance:startInstance,*/
            describeBgpip:describeBgpip,
            describeQcloudIns:describeQcloudIns,
            readQcloudIns:readQcloudIns,
            stopQcloudIns:stopQcloudIns,
            startQcloudIns:startQcloudIns,
            rebootQcloudIns:rebootQcloudIns,
            resetPWIns:resetPWIns,
            describeQcloudKeypair:describeQcloudKeypair,
            delQcloudKeypair:delQcloudKeypair,
            createQcloudKeypair:createQcloudKeypair,
            describeSecurityGroup:describeSecurityGroup,
            createSecurityGroup:createSecurityGroup,
            delSecurityGroup:delSecurityGroup,
            describeSecurityGroupDetail:describeSecurityGroupDetail,
            createSecurityGroupRule:createSecurityGroupRule,
            delSecurityGroupRule:delSecurityGroupRule,
            getRuleList:getRuleList,
            delRule:delRule,
            addRule:addRule,
            updateGFIPInfo:updateGFIPInfo,
            getGFIPList:getGFIPList,
            getWhiteList:getWhiteList,
            addWhiteList:addWhiteList,
            delWhiteList:delWhiteList,
            updateThreshold:updateThreshold,
            updateCCStatus:updateCCStatus
           };
}(OTHERCLOUD));
