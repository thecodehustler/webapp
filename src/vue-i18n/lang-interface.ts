export default interface LangInterface {
  app: {
    title: string,
    offlineMessage: string,
    update_avaliable: string,
    action_refresh: string,
    action_dismiss: string,
    loading_text: string,
    loading_longer: string,
    load_failed_title: string,
    load_failed_text: string,
    webgl_unsupported: string,
    webgl_unsupported_description: string,
    upgrade_help: string,
    close: string,
    ie_warning: string
  }
  about: {
    open_source_libraries: string,
    build_version: string,
    map: string,
    website: string,
    modeling: string,
    articles: string,
    homepage: string,
    guide: string,
    staff: string,
  },
  home: {
    locBtn_TrackGeo: string,
    locBtn_Geolocating: string,
    locBtn_StopTrack: string,
    locBtn_GeoLocationFailed: string,
    locBtn_Continue: string,
    debug_Title: string,
    cesium_RenderErrorTitle: string,
    cesium_RenderErrorDescription: string,
  },
  article: {
    errors: {
      network: string,
      not_exist: string,
      corrupted: string,
      internal_server_error: string,
      unknown: string
    },
    got_it: string,
    goto: string
  },
  toolbar: {
    userButtonAriaLabel: string,
    goHomeAriaLabel: string,
    moreAriaLabel: string,
    search: string,
    searchResult: string,
    log_out: string,
    menu: {
      show3d: string,
      show3dHint: string,
      about: string
    },
    userCard: {
      myCollection: string
    },
    search_error: string,
  },
  settings: {
    themeOptions: {
      follow: string,
      light: string,
      dark: string,
    }
  }
}