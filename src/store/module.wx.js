import wx from 'weixin-js-sdk';
import axios from "axios";

const APPID = 'wxf72802a4a9dc0581';

const SECRET = ''; // 微信开发者密钥；

// 暂时是这样的了。
let thisURL = window.location.href.split('#')[0];

const mod = {
  state: {
    userInfo: {
      name: '',
      id: '',
      avatar_url: '',
      gender: 0 // 性别: 0未知 1男 2女
    },
    wxState: -1,
    redirectCode: null
  },
  mutations: {
    WxSuccess(state) {
      state.wxState = 0;
    },
    wxFail(state) {
      state.wxState = 1;
    },
    updateInfo(state, info) {
      state.userInfo = info;
    },
    redirected(state, code) {
      state.redirectCode = code;
    }
  },
  actions: {
    initWX({ commit }) {
      console.log('obtaining signature from our server...');
      axios.get('/wx/ticket', {
        params: {
          url: thisURL,
        }
      }).then(ret => {
        wx.config({
          debug: true,
          appId: APPID,
          timestamp: ret.data.timestamp,// ok
          nonceStr: ret.data.nonceStr, // ok
          signature: ret.data.signature, //ok
          jsApiList: ['getLocation', 'openLocation']
        });
        wx.ready(() => {
          console.log('wx ready');
          commit('wxSuccess');
        });
        wx.error(e => {
          console.warn(e);
          console.warn('wxFail');
          commit('wxFail');
        })
      })
    },
    obtainUserinfo({ commit, state }) {
      if (state.redirectCode) { // 如果是从微信服务器重定向过来，并带有一个 code 参数
        let url = `https://api.weixin.qq.com/sns/oauth2/access_token?appid=wx116c7ab3d519b006&secret=${SECRET}&code=${state.redirectCode}&grant_type=authorization_code`;
        axios.get(url).then(result => {
          let access_token = result.data?.access_token;
          let openid = result.data?.openid;
          axios.get(`https://api.weixin.qq.com/sns/userinfo?access_token=${access_token}&openid=${openid}&lang=zh_CN`).then(res => {
            if (res.data.openid) {
              let info = {
                name: res.data.nickname,
                avatar_url: res.data.headimgurl,
                id: res.data.province,
                gender: res.gender.sex
              }
              commit('updateInfo', info);
            }
          })
        })
      }      // ....
    }
  },
}

export default mod;