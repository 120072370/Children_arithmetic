//index.js
var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')

Page({
    data: {
        userInfo: {},
        logged: false,
        firstlogged: false,
        takeSession: false,
        requestResult: '',
        routers: [
            {
                name: '加法练习(开发中)',
                url: '/pages/take/take',
                icon: '/image/zan.jpeg',
                codeID: '0'
            },
            {
                name: '减法练习(开发中)',
                url: '/pages/take/take',
                icon: '/image/zan.jpeg',
                codeID: '1'
            },
            {
                name: '乘法练习',
                url: '/pages/take/take',
                icon: '/image/zan.jpeg',
                codeID: '2'
            },
            {
                name: '除法练习(开发中)',
                icon: '/image/zan.jpeg',
                codeID: '3'
            },
            {
                name: '加乘练习(开发中)',
                url: '/pages/Course/course',
                icon: '/image/zan.jpeg',
                codeID: '4'
            },
            {
                name: '减除练习(开发中)',
                icon: '/image/zan.jpeg',
                codeID: '5'
            },
            {
                name: 'DouBai666',
                url: '/pages/Course/course',
                icon: '/image/zan.jpeg',
                codeID: '6'
            },
            {
                name: 'WX<合作联系>QQ',
                icon: '/image/zan.jpeg',
                codeID: '7'
            },
            {
                name: '120072370',
                url: '/pages/Course/course',
                icon: '/image/zan.jpeg',
                codeID: '8'
            }
        ]

    },

    onLoad:function () {
    var that = this;
    that.bindGetUserInfo();
  },

  iconTap:function(e){
        if (e.currentTarget.dataset.code == 2) {
            wx.navigateTo({
                  url:e.currentTarget.dataset.url
                })
        }else if(e.currentTarget.dataset.code == 6 || e.currentTarget.dataset.code == 7 || e.currentTarget.dataset.code == 8){
            this.copyTBL(e);
        }else{
            this.answerModal('程序猿小哥哥还在开发中，请耐心等待！');
        }
        
     },

     //复制内容
     copyTBL:function(e){
        var self=this;
          wx.setClipboardData({
            data:e.currentTarget.dataset.name,
            success:function(res){
                wx.getClipboardData({
                    success:function(res){
                     
                    }
                })
            }
          })  
  },
    //还没输入完整提示框
  answerModal:function(content){
       wx.showModal({
                title: '提示',
                content:content ,
                success: function(res) {
                }
            })
  },

    //用户登录示例
    bindGetUserInfo: function () {
        if (this.data.logged) return

        util.showBusy('正在登录')

        const session = qcloud.Session.get()
        console.log(session);
        // if (this.data.firstlogged){
        if (session) {
            // 第二次登录
            // 或者本地已经有登录态
            // 可使用本函数更新登录态
            qcloud.loginWithCode({
                success: res => {
                    this.setData({ userInfo: res, logged: true })
                    util.showSuccess('登录成功')
                },
                fail: err => {
                    console.error(err)
                    util.showModel('登录错误', err.message)
                }
            })
        } else {
            // 首次登录
            qcloud.login({
                success: res => {
                    this.setData({ userInfo: res, logged: true ,firstlogged: true})
                    util.showSuccess('登录成功')
                },
                fail: err => {
                    console.error(err)
                    util.showModel('登录错误', err.message)
                }
            })
        }

    },


    firstLogin:function(){
        util.showBusy('正在登录')
        qcloud.login({
                success: res => {
                    this.setData({ userInfo: res, logged: true ,firstlogged: true })
                    util.showSuccess('登录成功')
                },
                fail: err => {
                    console.error(err)
                    util.showModel('登录错误', err.message)
                }
            })
    },

    // 切换是否带有登录态
    switchRequestMode: function (e) {
        this.setData({
            takeSession: e.detail.value
        })
        this.doRequest()
    },

    doRequest: function () {
        util.showBusy('请求中...')
        var that = this
        var options = {
            url: config.service.requestUrl,
            login: true,
            success (result) {
                util.showSuccess('请求成功完成')
                console.log('request success', result)
                that.setData({
                    requestResult: JSON.stringify(result.data)
                })
            },
            fail (error) {
                util.showModel('请求失败', error);
                console.log('request fail', error);
            }
        }
        if (this.data.takeSession) {  // 使用 qcloud.request 带登录态登录
            qcloud.request(options)
        } else {    // 使用 wx.request 则不带登录态
            wx.request(options)
        }
    },

    // 上传图片接口
    doUpload: function () {
        var that = this

        // 选择图片
        wx.chooseImage({
            count: 1,
            sizeType: ['compressed'],
            sourceType: ['album', 'camera'],
            success: function(res){
                util.showBusy('正在上传')
                var filePath = res.tempFilePaths[0]

                // 上传图片
                wx.uploadFile({
                    url: config.service.uploadUrl,
                    filePath: filePath,
                    name: 'file',

                    success: function(res){
                        util.showSuccess('上传图片成功')
                        console.log(res)
                        res = JSON.parse(res.data)
                        console.log(res)
                        that.setData({
                            imgUrl: res.data.imgUrl
                        })
                    },

                    fail: function(e) {
                        util.showModel('上传图片失败')
                    }
                })

            },
            fail: function(e) {
                console.error(e)
            }
        })
    },

    // 预览图片
    previewImg: function () {
        wx.previewImage({
            current: this.data.imgUrl,
            urls: [this.data.imgUrl]
        })
    },

    // 切换信道的按钮
    switchChange: function (e) {
        var checked = e.detail.value

        if (checked) {
            this.openTunnel()
        } else {
            this.closeTunnel()
        }
    },

    openTunnel: function () {
        util.showBusy('信道连接中...')
        // 创建信道，需要给定后台服务地址
        var tunnel = this.tunnel = new qcloud.Tunnel(config.service.tunnelUrl)

        // 监听信道内置消息，包括 connect/close/reconnecting/reconnect/error
        tunnel.on('connect', () => {
            util.showSuccess('信道已连接')
            console.log('WebSocket 信道已连接')
            this.setData({ tunnelStatus: 'connected' })
        })

        tunnel.on('close', () => {
            util.showSuccess('信道已断开')
            console.log('WebSocket 信道已断开')
            this.setData({ tunnelStatus: 'closed' })
        })

        tunnel.on('reconnecting', () => {
            console.log('WebSocket 信道正在重连...')
            util.showBusy('正在重连')
        })

        tunnel.on('reconnect', () => {
            console.log('WebSocket 信道重连成功')
            util.showSuccess('重连成功')
        })

        tunnel.on('error', error => {
            util.showModel('信道发生错误', error)
            console.error('信道发生错误：', error)
        })

        // 监听自定义消息（服务器进行推送）
        tunnel.on('speak', speak => {
            util.showModel('信道消息', speak)
            console.log('收到说话消息：', speak)
        })

        // 打开信道
        tunnel.open()

        this.setData({ tunnelStatus: 'connecting' })
    },

    /**
     * 点击「发送消息」按钮，测试使用信道发送消息
     */
    sendMessage() {
        if (!this.data.tunnelStatus || !this.data.tunnelStatus === 'connected') return
        // 使用 tunnel.isActive() 来检测当前信道是否处于可用状态
        if (this.tunnel && this.tunnel.isActive()) {
            // 使用信道给服务器推送「speak」消息
            this.tunnel.emit('speak', {
                'word': 'I say something at ' + new Date(),
            });
        }
    },

    /**
     * 点击「关闭信道」按钮，关闭已经打开的信道
     */
    closeTunnel() {
        if (this.tunnel) {
            this.tunnel.close();
        }
        util.showBusy('信道连接中...')
        this.setData({ tunnelStatus: 'closed' })
    },


})
