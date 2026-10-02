//index.js 
//获取应用实例      
var api = require('../../api.js');
const app = getApp() 
Page({
  data: { 
    windowWidth:0, //屏幕宽度

    waste_Y:0, //放入垃圾桶的Y高度

    /*初始垃圾位置*/
    owleft: 0,
    owtop: 100, 
    wleft:0, 　
    wtop:100, 
    /*初始垃圾位置*/

    /*初始答题位置*/
    beginleft:0,
  /*初始答题位置*/ 

    wastetypelist:[], //累计类型列表
    mstyle:'block', 
    wstyle:'none',

    answer_id:0, //题目答案id
 

    test_num:0, //测试个数
    oknum:0, //答案正确数
    socre:0, //测试得分

    oks:'1037.wav', //答对时的声音
    nos: '5969.wav', //答错时声音

  },
  onReady: function (e) {
    this.audioCtx = wx.createAudioContext('myAudio');
  }, 
  onShow:function()  
  {
    var that=this;
    wx.getSystemInfo({  
      success: function(res) {
        that.setData({
          windowWidth: res.windowWidth,
          wleft:(res.screenWidth-80)/2,
          owleft: (res.screenWidth - 80) / 2,
          beginleft: (res.screenWidth - 250) / 2,
          wh:res.windowHeight,
          waste_Y:res.windowHeight-160
      })  
      },
    })
  },  
  onLoad: function () {
    var that = this;
    that.get_waste_type();
  },
  //拖动垃圾放入垃圾桶
  dragbindtouchend: function (e) {
    var that = this; 
    var _y = e.changedTouches["0"].clientY;
    var _x = e.changedTouches["0"].clientX; 
    
    if (_y < that.data.waste_Y)
    {  
      that.setData({
        wleft: that.data.wleft,
        wtop: that.data.wtop
      })
    } 
    else 
    {
      var _index=1;
      if(_x>0)
      {
        var _len = that.data.wastetypelist.length;//得到个数
        var _w = that.data.windowWidth;
        var _w_ = _w / _len; 
        _index = parseInt(_x/_w_); 
        if (_x % _w_>0)
        {
          _index++;
        }  
      } 
      _index=_index==-1?1:_index; 
      _index = _index >= _len? _len:_index;
      var _obj = that.data.wastetypelist[_index-1]; 
     try
      {
        that.submitanswer(_obj.id); 
      }
      catch(ex)
      { 
        that.setData({
          wtop: that.data.wleft,
          wtop: that.data.wtop
        })
      }
    }

  }, 
  //得到垃圾分类列表
  get_waste_type:function()
  {
    var that=this;
    app.request({
      url: api.saas.get_catalog,
      data: {
        ctype: 0,
      },
      method: 'POST',
      success: function (res) {
       // console.log(res);
        that.setData({
            wastetypelist:res
        })
      },
      complete: function () {
        
      }
    })
  },

//提交答案
 submitanswer:function(_id)
{
  var that=this;
  if (_id == that.data.answer_id) {
    wx.showToast({
      title: '正确：+10分',
      image: '/images/ok.png'
    })
    that.setData({
      socre: that.data.socre + 10,
    });
    that.audioCtx.setSrc(api.root.radio + that.data.oks);
    that.audioCtx.play();
  }
  else { 
    wx.showToast({
      title: '错误：-10分',
      image: '/images/no.png'
    })  
    that.setData({
      socre: that.data.socre - 10
    });
    that.audioCtx.setSrc(api.root.radio + that.data.nos);
    that.audioCtx.play();
  }
  that.get_test();
  setTimeout(function(){
   that.setData({
     wleft: that.data.owleft,
     wtop: that.data.owtop
   })
  },1500)  
},

//点击垃圾桶提交答案
  doanswer:function(e)
  { 
    console.log(e);
    var _x = e.detail.x;
    var _y =e.detail.y;
    var that=this;
    that.setData({
      wleft:_x-40,
      wtop:_y
    });
     var _id = e.currentTarget.dataset.id
     console.log(_id);
     if(_id==that.data.answer_id)
     {
       wx.showToast({
         title: '正确：+10分',
         image: '/images/ok.png'
       })
       that.setData({
         socre: that.data.socre+10, 
       });
       that.audioCtx.setSrc(api.root.radio + that.data.oks);  
       that.audioCtx.play();   
     }
     else
     {
       wx.showToast({
         title: '错误：-10分',
         image: '/images/no.png'
       })
       that.setData({
         socre: that.data.socre - 10
       });
       that.audioCtx.setSrc(api.root.radio + that.data.nos);  
       that.audioCtx.play();   
     }
    setTimeout(function () {
      console.log('10秒以后');
      that.setData({
        wleft: that.data.owleft,
        wtop: that.data.owtop
      })
    }, 1500)

     that.get_test(); 
  },
  //开始游戏
  begingame:function()
  {
    var that=this; 
    that.setData({
      mstyle: 'none',  
    })
    that.get_test();
  },
  //随机得到题目
  get_test:function()
  {
    var that=this;
    app.request({
      url: api.saas.get_test, 
      method: 'POST',
      success: function (res) { 
        that.setData({
          wstyle: 'block',
          wasteicon:res.icon,
          answer_id:res.answer_id
        })
       // console.log(res.icon);
      },
      complete: function () { 
      }
    })
  },
  takePhoto() {
    var that=this;
    this.ctx.takePhoto({
      quality: 'high',
      success: (res) => {
        this.setData({
          src: res.tempImagePath
        })
        /******上传识别图片*******/
        wx.showLoading({
          title: '识别中...',
        })
        var tempFilePaths = res.tempImagePath
        
        wx.uploadFile({
          url: '后台服务器地址',
          header: { "Content-Type": "multipart/form-data" },
          filePath: tempFilePaths,
          name: encodeURI('img'),
          formData: {
            uid: encodeURI('test')
          },
          success(res) {
            console.log(res)
            var dataarr = JSON.parse(res.data);
            that.setData({ itemdata: dataarr.result})
          },
          fail: function (error) {
            wx.hideLoading();
            wx.showToast({
              title: '请求超时',
              icon: 'loading',
              duration: 2000
            });
            console.log(error)
          },
          complete: function () {
            wx.hideLoading();
          }
        })
        /**end */
      }
    })
  }

})
