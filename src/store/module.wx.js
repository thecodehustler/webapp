import wx from 'weixin-js-sdk';
import axios from "axios";

const APPID = 'wxf72802a4a9dc0581';

// 暂时是这样的了。
let thisURL = window.location.href.split('#')[0];

const mod = {
    state: {
        userInfo: {
            name: '',
            id: '',
            avatar_url: ''
        },
        wxState: -1
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
        }
    },
    actions: {
        initWX({commit}) {
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
                wx.ready(()=> {
                    console.log('wx ready');
                    commit('wxSuccess');
                });
                wx.error(e => {
                    console.warn(e);
                    console.log('wxFail');
                    commit('wxFail');
                })
            })
        },
        obtainUserinfo({commit}) {
            // ....
            commit('updateInfo'/**一些参数 */);
        },
    }
}

export default mod;