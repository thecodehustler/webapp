import LangInterface from './lang-interface';
import {LocaleMessages} from "vue-i18n";

class zh_CN implements LangInterface, LocaleMessages{
  app: LocaleMessages = {
    title: '天空旅行团',
    offlineMessage: '您的设备已离线，部分内容可能过期或者不可用。',
    update_avaliable: '新内容已可用，请刷新页面。',
    action_refresh: '刷新页面',
    action_dismiss: '知道了',
    loading_text: '正在载入……',
    loading_longer: '载入的时间似乎比预期要慢一些。请稍等片刻。',
    load_failed_title: '啊哦，出错了。',
    load_failed_text: '这可能是网络连接问题导致的，也可能是程序自己的问题。请刷新页面。',
    webgl_unsupported: '您的浏览器不支持 WebGL。',
    webgl_unsupported_description: '请考虑更改您浏览器的相关设定，或者更新您的浏览器。',
    upgrade_help: '需要帮助？',
    close: '关闭',
    ie_warning: '您正在使用 IE 浏览器，而该网站对其的支持比较有限。我们建议您切换到现代浏览器。'
  };
  about = {
    open_source_libraries: '本项目使用的开源项目',
    build_version: '构建版本：',
    map: '2D 地图：',
    website: '网站：',
    modeling: '3D 模型：',
    articles: '文案：',
    homepage: '主页',
    guide: '指导：',
    staff: '人员',
  }
  home = {
    locBtn_TrackGeo: '跟踪当前位置',
    locBtn_Geolocating: '正在定位……',
    locBtn_StopTrack: '停止跟踪',
    locBtn_GeoLocationFailed: '无法定位。',
    locBtn_Continue: '继续',
    debug_Title: '调试信息',
    cesium_RenderErrorTitle: 'Cesium 发生渲染错误。',
    cesium_RenderErrorDescription: '地图的渲染已停止。请刷新页面。'
  }
  article = {
    errors: {
      network: '与服务器的连接发生错误。',
      not_exist: '请求的项目不存在。',
      corrupted: '无法理解服务器传输的数据。\n请向服务器管理员反馈该问题。',
      internal_server_error: '服务器内部错误。',
      unknown: '未知错误。'
    },
    got_it: '知道了',
    goto: '前往公众号查看'
  }
  toolbar = {
    userButtonAriaLabel: '用户信息',
    goHomeAriaLabel: '回到初始位置',
    moreAriaLabel: '更多',
    search: '搜索…',
    searchResult: '无结果。 | {count} 条结果。 | {count} 条结果。',
    log_out: '登出',
    menu: {
      show3d: '显示 3D 建筑',
      show3dHint: '这可能会消耗大量的数据流量和处理性能。',
      about: '关于…'
    },
    userCard: {
      myCollection: '我的收藏'
    },
    search_error: '尝试搜索时出错。'
  }
  settings = {
    themeOptions: {
      follow: '自动',
      light: '亮色',
      dark: '暗色',
    }
  }
}

export default new zh_CN();