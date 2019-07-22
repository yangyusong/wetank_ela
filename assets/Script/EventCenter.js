// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
const io = require('./socket.io');


var script = document.createElement("script");
script.type = "text/javascript";
script.src = "https://code.jquery.com/jquery-2.2.4.js";
document.getElementsByTagName("head")[0].appendChild(script);

var script = document.createElement("script");
script.type = "text/javascript";
script.src = 'https://cdn.bootcss.com/lodash.js/4.17.12-pre/lodash.min.js';
document.getElementsByTagName("head")[0].appendChild(script);

//setTimeout(function(){
//    var script = document.createElement('script');
//    script.type = 'text/javascript';
//    script.src = 'https://cdn.bootcss.com/lodash.js/4.17.12-pre/lodash.min.js';     //填自己的js路径
//    $('body').append(script);
//}, 300);

function buildIdentity() {
    var schemeConfig = {
        "AppID": "7d80c7e800f5842b3b8e7ec7318189f66b7fd5b6db13bb80fbd89d2b1c444772c1d0202fea1e9cbabbf3258b3d91685484c02c2ae52d78ca39e2e54593ec81dd",
            "AppName": "Hackathon",
            "RandomNumber": "123456789",
            "DID": "iXzenTELVRDc712tmt2Qvbtk3KcAwV2tU8",
            "PublicKey": "032f6347b27401dc0bced2de0ab4531e62c496841cd8e67a58c572e3018dcb72d9",
            "ReturnUrl": location.href,
            "RequestInfo": "elaaddress,Email,Nickname"
    }
    var url = "elaphant://identity?";
    _.forEach(schemeConfig, function(val, key, index) {
        if (key === 'ReturnUrl') {
            val = encodeURIComponent(val);
        }
        url += key + '=' + val + '&';
    });

    return url.substring(0, url.length - 1);
}

window.buildIdentity = buildIdentity;

function test(){
    //构建身份授权协议
    var url = buildIdentity();
    //拼接大象钱包过度页面
    var turl = 'https://elephantwallet.app/redirect?appName=Hackathon&appTitle=Hackathon&autoRedirect=True&redirectURL=' + encodeURIComponent(url);
    //跳转
    location.href = turl;
}

window.test = test;

var schemeConfigPay = {
    "AppID": "a53172fef2f25b53dbfdf958483ff921e592d27bdd88c4e9e6f6aac2abae2a64ff9572190297d3671eeb53d4ee34c55aafc68a019aa39f1256445e8a7b5f7429",
        "AppName": "wetank",
        "Description": "test pay",
        "OrderID": "12349",
        "CoinName": "ELA",
        "Amount": 0.0001,
        "ReceivingAddress": "EeoJsLZmJhAeMhhYxpHYDnvFytKKm9bsAM",
        "DID": "ibrVqyoGp9jfqjomtDZTPPoFN1mEN9XkwU",
        "PublicKey": "026e48362f9ea157de350f887a36bd073dd0724f095d98a0b647957b1754ae9790",
        "ReturnUrl": location.host,
};

window.schemeConfigPay = schemeConfigPay;

var buildElapay = function() {
    var url = "elaphant://elapay?";
    _.forEach(schemeConfigPay, function(val, key, index) {
        if (key === 'ReturnUrl') {
            val = encodeURIComponent(val);
        }
        url += key + '=' + val + '&';
    });

    return url.substring(0, url.length - 1);
}

window.buildElapay = buildElapay;

var goPay = function() {
    //构建支付协议
    var url = buildElapay();
    //拼接大象钱包过度页面
    var turl = 'https://elephantwallet.app/redirect?appName=Hackathon&appTitle=Hackathon&autoRedirect=True&redirectURL=' + encodeURIComponent(url);
    //跳转
    location.href = turl;
}

window.goPay = goPay;

var getQueryString = function(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
};

window.getQueryString = getQueryString;

var waitToMain = function(){
    setTimeout(function(){
        if(window.glbData)
        {
            toGameMain();
        }
        else{
            waitToMain();
        }
    }, 300);
}

var toGameMain = function(){
    var mySocket = window.mySocket;
    var userName = localStorage.getItem("username");
    var gameUser={
        userName:userName,
        roomName:'free'
    };
    mySocket.emit('joinRoom', gameUser,function(retMsg){
        console.log(retMsg);
        if (userName.length > 0) {
            console.log(userName);
            var mySocket = window.mySocket;
            window.myUserName = userName;
            cc.director.loadScene('game');

        } else {

            console.log("username is null");
        }

    });
}

if(getQueryString("TXID") != null && getQueryString("TXID") != "")
{
    //获取用户信息，，跳转到支付页
    var orderId = getQueryString("OrderID");//todo 发给服务器
    var txId = getQueryString("TXID");//todo 发给服务器

    var userName = localStorage.getItem("name");
    console.log(userName);

    waitToMain();
}

if(getQueryString("data") != "" && getQueryString("data") != null && getQueryString("afterPay") != "yes")
{
    //获取用户信息，，跳转到支付页
    var data = getQueryString("data");//todo 发给服务器
    var user =JSON.parse(decodeURIComponent(data));
    console.log( user);
    localStorage.setItem("name", user.Nickname);
    goPay();
}



cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        cc.game.addPersistRootNode(this.node);
        
        //var mySocket = io.connect('http://localhost:10800');
        var mySocket = io.connect('http://47.103.103.166:10800');
         //var mySocket = io.connect('http://sh.suishizhuan.com:10800', {
         //
         //});
        
        window.mySocket = mySocket;
        mySocket.on('connect', function () {
            cc.director.emit('socketConnect',"connect");
            console.log("连接成功");
            window.glbData = {ext: "yes"};
        });
        mySocket.on('disconnect', function () {
            cc.director.emit('socketConnect',"disconnect");
            console.log("连接断开");
            mySocket.open();
        });
    },

    start () {

    },

    // update (dt) {},
});
