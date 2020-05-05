import wx from 'weixin-js-sdk';
import axios from "axios";
import store from '../store';

let thisURL = window.location.href.split('#')[0];

console.log('obtaining signature...');
axios.get('/wx/ticket', {
    params: {
        url: thisURL,
    }
}).then(ret => {
    wx.config({
        debug: true,
        appId: 'wxf72802a4a9dc0581',
        timestamp: ret.data.timestamp,// ok
        nonceStr: ret.data.nonceStr, // ok
        signature: ret.data.signature, //ok
        jsApiList: ['getLocation', 'openLocation']
    });
    wx.ready(()=> {
        console.log('wx ready');
        store.commit('wxReady'); // 
    });
    wx.error(e => {
        console.warn(e);
    })
})

export default wx;