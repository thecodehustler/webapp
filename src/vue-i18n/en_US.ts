import LangInterface from "@/vue-i18n/lang-interface";
import {LocaleMessageObject, LocaleMessages} from "vue-i18n";

class en_US implements LangInterface, LocaleMessages{
    app = {
      title: 'SKY SOARING CREW',
      offlineMessage: 'Your device is offline. Some contents may be outdated or unavaliable.',
      update_avaliable: 'New content avaliable. Please refresh this page.',
      action_refresh: 'Refresh page',
      action_dismiss: 'Got it',
      loading_text: 'Loading...',
      loading_longer: 'This loading takes more time than expected. Be patient...',
      load_failed_title: 'Oops, error occured.',
      load_failed_text: 'This may due to a slow connection, or a corruption in our program. Please refresh this page.',
      webgl_unsupported: 'Your browser doesn\'t support WebGL.',
      webgl_unsupported_description: 'Please check your browser configuration, or consider upgrading to a modern browser.',
      upgrade_help: 'Need help?',
      close: 'Close',
      ie_warning: 'You\'re using Internet Explorer, which is not fully supported by this site. We recommend switching to a modern browser.',
    }
    about = {
      open_source_libraries: 'Open-source Projects',
      map: '2D map: ',
      website: 'Website: ',
      modeling: '3D modeling: ',
      articles: 'Articles: ',
      homepage: 'Homepage',
      guide: 'Guidance: ',
      staff: 'Staff',
      build_version: 'build'
    }
    home = {
      locBtn_TrackGeo: 'Follow my step',
      locBtn_Geolocating: 'Locating……',
      locBtn_StopTrack: 'Stop tracking',
      locBtn_GeoLocationFailed: '无法定位。',
      locBtn_Continue: 'Continue',
      debug_Title: 'Debug info',
      cesium_RenderErrorTitle: 'Render error occurred in Cesium.',
      cesium_RenderErrorDescription: 'The rendering process has stopped. Please refresh this page.'
    }
    article = {
      errors: {
        network: 'Error connecting to the server.',
        not_exist: 'The requested item doesn\'t exist.',
        corrupted: '无法理解服务器传输的数据。\n请向服务器管理员反馈该问题。',
        internal_server_error: 'Server internal error.',
        unknown: 'Unknown error.'
      },
      got_it: 'Got it',
      goto: 'View in Official Account'
    }
    toolbar = {
      search: 'Search...',
      searchResult: 'No result. | {count} result. | {count} results',
      log_out: 'Log out',
      menu: {
        show3d: 'Show 3D buildings',
        show3dHint: 'This may cause a major data usage and some lag.',
        about: 'About...'
      },
      userCard: {
        myCollection: 'My Collection'
      },
      search_error: 'Error while searching.'
    }
}
  export default new en_US();