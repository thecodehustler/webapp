import wx from 'weixin-js-sdk';
import axios from "axios";

const APPID = 'wxf72802a4a9dc0581';

// const SECRET = ''; // 微信开发者密钥；
// 不要存在前端
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
    redirectCode: null,
    localFake: {
      name: '',
      id: '',
      avatar_url: '',
      gender: 0 // 性别: 0未知 1男 2女
    },
    useFake: false,
  },
  mutations: {
    wxSuccess(state) {
      state.wxState = 0;
    },
    wxFail(state) {
      state.wxState = 1;
      state.useFake = true;
    },
    updateInfo(state, info) {
      state.userInfo = info;
    },
    redirected(state, code) {
      state.redirectCode = code;
    },
    updateFake(state, info) {
      state.localFake = info;
    },
    useFake(state) {
      state.useFake = true;
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
        console.log(ret);
        wx.config({
          debug: false,
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
          console.warn('wx Fail');
          commit('wxFail');
        })
      }).catch(e => {
        console.warn(e);
        commit('wxFail');
      });
    },
    obtainUserinfo({ commit, state }) {
      console.log('module-wx: redirectCode', state.redirectCode);
      if (state.redirectCode) {
        axios.get('/wx/userinfo', {
          params: {
            code: state.redirectCode
          }
        }).then( result => {
          let d = result.data;
          commit('updateInfo', d);
          console.log(d);
        })
      }
      // 这代码不应该存在于客户端。
      // if (state.redirectCode) { // 如果是从微信服务器重定向过来，并带有一个 code 参数
        // let url = `https://api.weixin.qq.com/sns/oauth2/access_token?appid=${APPID}&secret=${SECRET}&code=${state.redirectCode}&grant_type=authorization_code`;
        // axios.get(url).then(result => {
        //   let access_token = result.data?.access_token;
        //   let openid = result.data?.openid;
        //   axios.get(`https://api.weixin.qq.com/sns/userinfo?access_token=${access_token}&openid=${openid}&lang=zh_CN`).then(res => {
        //     if (res.data.openid) {
        //       let info = {
        //         name: res.data.nickname,
        //         avatar_url: res.data.headimgurl,
        //         id: res.data.province,
        //         gender: res.gender.sex
        //       }
        //       commit('updateInfo', info);
        //     }
        //   })
        // });
            // ....
    }
  },
}

export default mod;