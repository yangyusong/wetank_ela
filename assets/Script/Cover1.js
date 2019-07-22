// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        connectStatusTxt: {
            default: null,
            type: cc.Label,
            displayName: '链接状态',
        },
        testDes: {
            default: null,
            type: cc.Node,
            displayName: '测试删除',
        },
        userNameEdit: {
            default: null,
            type: cc.EditBox,
            displayName: '玩家名字',
        },
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

    onClickEoe() {

    },

    onClickFree() {
        this.onClick();
    },

    onClickEla() {
    let userName = this.userNameEdit.string;
    localStorage.setItem("username", userName);
    test();
    },

    /**
     * 登录接口
     * @param account
     * @param password
     */
    login: function () {
        //显示loading界面
        cc.gameSpace.showLoading(cc.gameSpace.text.logining);

        console.log("login====")

        var _this = this;
        if (cc.gameSpace.SDK === 'eos') {
            const eosAdapter = require('eosAdapter');
            eosAdapter.initSDK(()=>{
                cc.gameSpace.isInitFinished = true;
            eosAdapter.login(function (err) {
                if (err) {
                    cc.gameSpace.showTips(err);
                    cc.gameSpace.hideLoading();
                } else {
                    // configuration.setGlobalData(constants.DATA_KEY.ACCOUNT, account);
                    // configuration.setGlobalData(constants.DATA_KEY.PASSWORD, password); //TODO 正式的时候需要去除这个

                    cc.gameSpace.showLoading(cc.gameSpace.text.loading_main+'...');

                    //加载玩家数据
                    _this.loadPlayerInfo();
                }
            });
        });
    } else {
        bcxAdapter.initSDK(()=>{
            //SDK初始华完毕
            cc.gameSpace.isInitFinished = true;
        console.log("bcxAdapter.initSDK====")

        bcxAdapter.login(function (err) {
            console.log("bcxAdapter.initSDK=1==",err)
            if (err) {
                cc.gameSpace.showTips(err);
                cc.gameSpace.hideLoading();
            } else {
                console.log("bcxAdapter.initSDK222")
                // configuration.setGlobalData(constants.DATA_KEY.ACCOUNT, account);
                // configuration.setGlobalData(constants.DATA_KEY.PASSWORD, password); //TODO 正式的时候需要去除这个

                cc.gameSpace.showLoading(cc.gameSpace.text.loading_main+'...');

                //加载玩家数据
                _this.loadPlayerInfo();
            }
        });

    });
    }


    },

    onClickCocos() {
    this.login();
    },

onClick() {
    //
    // this.goFullScreen();
    let userName = this.userNameEdit.string;
    if (userName.length > 0) {
        console.log(userName);
        var mySocket = window.mySocket;
        var gameUser={
            userName:userName,
            roomName:'free'
        };
        mySocket.emit('joinRoom', gameUser,function(retMsg){
            console.log(retMsg);
            window.myUserName = userName;
            cc.director.loadScene('game');
        });
    } else {
        console.log("username is null");
    }
},
    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        let that = this;
        cc.director.on("socketConnect",function(state){
            if(state=='connect'){
                that.connectStatusTxt.string = "";
            }
            if(state=='disconnect'){
                that.connectStatusTxt.string = "Connecting";
            }
        });
    },

    start() {

    },

    goFullScreen(){
        let element = document.documentElement;
        if (element.requestFullscreen) {
            element.requestFullscreen();
        } else if (element.webkitRequestFullScreen) {
            element.webkitRequestFullScreen();
        } else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
        } else if (element.msRequestFullscreen) {
            // IE11
            element.msRequestFullscreen();
        }
    }

    // update (dt) {},
});