var site ='https://card.doosuns.cn/saas/';
var _domain = site+'index.php/api/';
var _api_root = _domain+'Saas/';  
var api = { 
  root:{
    path: site,
    radio:'https://card.doosuns.cn/saas/public/waste_sorting/images/',
  },
  saas:{ 
    //获取用户的小程序openid 
    get_catalog: _api_root + 'get_catalog',
    get_test: _api_root + 'get_test',
  },  
   
};  
module.exports = api;