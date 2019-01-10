// 通过云函数获取openid 如果有 unionid 则获取 unionid
import basicInfo from '../../store/basicInfo.js'
export const getUserInfo = () => {
  return new Promise((resolve, reject) => {
    if (wx.cloud) {
      wx.cloud.init({
        traceUser: true
      });
      let openid = wx.getStorageSync('openid');
      if (!openid.openid) {
        wx.getSetting({
          success: res => {
            console.log("getSetting", res)
          }
        })
        wx.cloud.callFunction({
          // 云函数名称
          name: 'login',
          // 传给云函数的参数
          data: {},
        }).then(res => {
          let _data = res.result;
          wx.setStorageSync('openid', _data);
          basicInfo.commit('updatauserInfo',_data);
          resolve(_data);
        }).catch(error => {
          console.error(error);
          reject(error)
        })
      } else {
        basicInfo.commit('updatauserInfo',openid);
        resolve(openid);
      }
    } else {
      console.error("请使用 2.2.3 或以上的基础库以使用云能力");
    }
  })

}
/**
 * 写入用户信息
 * @param {*} id  openid 或者 unionid 的值
 * @param {*} type 0-使用openid(defalut) 1-使用unionid
 */
export const saveUserInfo = (userInfo) => {
  type = type ? type : 0;
}

module.export = {
  getUserInfo: getUserInfo,
  saveUserInfo: saveUserInfo
};
