//app.js
var api = require('api.js');
App({
    onLaunch: function() {

        if (!wx.cloud) {
            console.error('请使用 2.2.3 或以上的基础库以使用云能力')
        } else {
            wx.cloud.init({
                env: 'REPLACE_WITH_YOUR_CLOUD_ENV',
                traceUser: true,
            })
        }
        const updateManager = wx.getUpdateManager()
        updateManager.onCheckForUpdate(function(res) {
            console.log(res.hasUpdate)
            if (res.hasUpdate) {
                updateManager.onUpdateReady(function() {
                    wx.showModal({
                        title: '更新提示',
                        content: '新版本已经准备好，是否重启应用？',
                        success: function(res) {
                            if (res.confirm) {
                                updateManager.applyUpdate()
                            }
                        }
                    })
                })
            }
        })
        updateManager.onUpdateFailed(function() {
            // 新版本下载失败
        })
        var that=this; 
        var user_id=0;  
        var access_toaccess_user = wx.getStorageSync("access_user"); 
        if (access_toaccess_user) { 
          that.globalData.access_user = access_toaccess_user;  
          user_id = that.globalData.access_user.id; //用户id 
          console.log(that.globalData.access_user);
        }else 
        { 
            //如果没有登陆则登陆
            wx.login({      
                success: res => {     
                  var code = res.code;
                 // that.auto_login(code,user_id);
                }
            })     
        } 
        that.street_info(); 

    },

       

    street_info:function()
  { 
    var that=this; 
    that.request({
      url: api.saas.street_info, 
      success: function (res) {
        console.log(res);
        wx.setNavigationBarTitle({
          title: res,
        })
      },
      complete: function () {
      }
    })
  },

    auto_login: function (code,user_id) {
        var that = this; 
        that.request({    
          url: api.saas.auto_login,
          data: {  
            'code': code, 
            'user_id':user_id  
          },   
          success: function (res) {
            //通过openid自动登陆 
            if(res.code!=undefined)
            {   
             // console.log('游客登陆');
             // console.log(res); 
              that.globalData.openid=res.openid;//得到openid
              that.globalData.tourists_id = res.tourists_id;//得到游客id  
            }
            else
            {
              that.globalData.access_user = res;
              wx.setStorageSync("access_user", res); //设置登录信息 
            } 
          },
          complete: function () {  
          }
        }); 
      },

    request: function (object) {  
        var that=this;
        if (!object.data)
        {
          object.data = {};
        }
        object.data.street_id = that.globalData.street_id; //默认把街道参数带上
        wx.request({
          url: object.url,
          header: object.header || {
            'content-type': 'application/x-www-form-urlencoded'
          },
          data: object.data || {},
          method: object.method || "GET",
          dataType: object.dataType || "json",
          success: function (res) {
            if (object.success){
              object.success(res.data);
            }
          },
          fail: function (res) {
            if (object.fail)
              object.fail(res);
          },
          complete: function (res) {
            if (object.complete)
              object.complete(res);
          }
        });
      },

    saveFormId: function (form_id) {
        this.request({
          url: api.user.save_form_id,
          data: {
            form_id: form_id,
          }
        });  
      },   

    topage: function (page,type) { 
        if(page.indexOf('/')==-1)
        {
          page='../'+page+'/'+page;
        }else
        {
          page = '../' + page;
        }
        switch (type) {
          case '1':
            wx.navigateTo({
              url: page,
            })
            break;
          case '2':
            wx.switchTab({
              url: page,
            })
            break;
        } 
      },  

    globalData: {
        street_id:1,
    streetInfo:null, //街道信息
    userInfo:null, 
    access_user:[],  
    islogin:0,
    openid:'', 
    key: 'REPLACE_WITH_YOUR_TENCENT_MAPS_KEY', //应用腾讯地图key 
    }
})