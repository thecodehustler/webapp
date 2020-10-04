// Global Vars for Webpack to inject.
// This should only be visible in Node environment.

/* eslint-disable @typescript-eslint/no-var-requires */
const GitRevision = require('git-revision-webpack-plugin');
const CustomSettings = require('./custom-settings');
class Vars { 
  VERSION = '';
  COPYRIGHT = `'©2020 SHERRY / APTX.'`
  BEIAN_TEXT = CustomSettings.BEIAN_NO;
  WX_APPID = CustomSettings.WX_APPID;
  CESIUM_ACCESS_TOKEN = CustomSettings.CESIUM_ACCESS_TOKEN;
  constructor() {
    const a = new Date();
    this.VERSION = `"${a.getFullYear() % 1000 * 10000 + (a.getMonth() + 1) * 100 + a.getDate()}@${new GitRevision().version()}"`;
  }
}

// 注意：如果这里的值类型是 string 的话，Webpack 的 DefinePlugin 会把 string 里面的内容完整的拷贝到最终代码里面。
// 也就是说，如果应用有 let ver = VARS.VERSION;
// 最后会出现：let ver = 200707@7f44ac3 // 报错。
// 对于对象也是一样的。

const GlobalVars = {VARS: new Vars()};

exports.VARS = GlobalVars;