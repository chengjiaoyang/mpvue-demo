import qcloud from 'wafer2-client-sdk'
import config from '@/config.js'
var Cookie = require('./lib/cookie');

/**
 *  所有请求
 *  全部 携带cookie
 * @param folder_name 在数据库m_config里面配置的项目名
 * @param module  模块
 * @param action  动作
 * @param data    json格式数据
 * @param is_show_toast 失败时是否toast提示; true:后台返回是已err_code,err_msg这些返回,false:表示ftl返回的页面
 * @param callback  回调函数
 */
export function request_h(
  folder_name,
  module,
  action,
  data,
  is_show_toast,
  callback,
  is_show_toast2
) {
  var is_check_login = checkUserInfo()
  console.log('request_h working',
    is_check_login, qcloud.Session.get())
  if (is_check_login) {
    var headCookie = Cookie.getHeadCookie()
    var session_data = qcloud.Session.get()
    data['session_token'] = session_data.session_token
    data['cookie_data'] = headCookie
  } else {
    data['session_token'] = ''
    data['cookie_data'] = ''
  }

  //console.log(headCookie);
  if (is_show_toast2)
    // wx.showLoading({title:"正在加载",mask:true});
    wx.showNavigationBarLoading()
  wx.request({
    url: config.domain_url +
      '/' +
      config.json.json_config[folder_name] +
      config.extra_folder_name +
      '/' +
      module +
      '/' +
      action +
      config.json.request_suffix +
      '?' +
      config.json.common_param +
      '&small_key_suffix=' +
      config.small_key_suffix +
      '&supplier_id=' +
      config.supplier_id,
    method: 'POST',
    data: data,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    success: function (result) {
      if (is_show_toast2)
        // wx.hideLoading();
        wx.hideNavigationBarLoading()
      var res = result.data
      if (res) {
        var set_cookie = result.header['Set-Cookie']
        if (set_cookie) {
          Cookie.saveCookie(set_cookie)
          var timestamp = Date.parse(new Date())
          timestamp = timestamp / 1000
        } else {
          // console.log("+++222++++set_cookie");
          //console.log(set_cookie);
        }
        if (is_show_toast) {
          if (res.err_code === -1) {
            wx.showToast({
              title: res.err_msg
            });
            callback(res)
          } else {
            //登录失败
            wx.showToast({
              title: res.err_msg
            })
          }
        } else {
          callback(res)
        }
      }
    },
    fail: function (res) {
      // wx.hideLoading();
      wx.hideNavigationBarLoading()
      wx.showToast({
        title: '系统正忙,接口调用失败'
      })
      console.log(res)
    }
  });
}

export function request(folder_name, module, action, data, is_show_toast, callback) {
  request_h(
    folder_name,
    module,
    action,
    data,
    is_show_toast,
    callback,
    true
  );
}

/**
 * 检查用户数据
 * @returns {boolean}
 */
export function checkUserInfo() {
  try {
    var session_data = qcloud.Session.get()
    var userInfo = session_data.userInfo
    return true
  } catch (err) {
    return false
  }
}


/**
 * 文件上传
 * @param path 文件路径
 * @param callback
 */
export function uploadImg(path, callback) {
  // wx.showLoading({
  //   title: '图片上传中',
  // })
  console.log(path);
  request_h("project_name_oss", "oss", "jsapiTicket", {}, false, function (res) {
    if (res.err_code == -1) {
      const config = JSON.parse(res.config);
      wx.uploadFile({
        url: config.visit_end_point,
        filePath: path,
        name: "file",
        formData: {
          'Filename': config.path + '/${filename}',
          'key': config.path + '/${filename}',
          'policy': config.policy,
          'OSSAccessKeyId': config.accessid,
          'success_action_status': '200', //让服务端返回200,不然，默认会返回204
          'signature': config.signature
        },
        success: function (res) {
          const json = {};
          let arr = path.split("/");
          json.url = config.visit_end_point + "/" + config.path + "/" + arr[arr.length - 1];
          // wx.hideLoading();
          callback(json);
        },
        fail: function (res) {
          // wx.hideLoading();
          console.log(res);
          wx.showToast({
            title: '上传失败',
            icon: "none"
          })
        }
      })
    } else {
      console.log(res);
      wx.showToast({
        title: '获取上传凭证失败',
        icon: 'none'
      })
    }
  }, false);
}

export default {
  request_h,
  request,
  checkUserInfo,
  uploadImg
}
