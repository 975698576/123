//app.js
App({
  onLaunch: function () {
    
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        
         env: 'lenn0104',
        traceUser: true,
      })
    }},
    globalData:{
      item:{}
    },
    nowdate(itemdate){
      var da = new Date(itemdate);
      var delta=new Date() - da;
      itemdate = parseInt(itemdate,10);
    
      if(isNaN(itemdate)){
        itemdate=0;
      }
      if(delta<=itemdate){
        return '刚刚';
      }
      var units=null;
      var conversions = {
        '毫秒': 1,
        '秒': 1000,
        '分钟': 60,
        '小时': 60,
        '天': 24,
        '月': 30,
        '年': 12
      };
      for(var key in conversions){
        if(delta < conversions[key]){
          break;
        }else{
          units=key;
          delta=delta/conversions[key];
        }
      }
      delta=Math.floor(delta);
      return [delta,units].join(" ")+"前";
    }
})
