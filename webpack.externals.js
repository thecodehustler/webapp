const commons = [];

function generateAssetURL(name, version) {
    return 'https://';
}

if (process.env.NODE_ENV === 'production') {
    commons.push(...[
        {
            id: 'weixin-js-sdk',
            assets: 'https://unpkg.com/weixin-js-sdk@1.6.0/index.original.js',
            global: 'jWeixin'
        },
        {
            id: 'vue',
            assets: 'https://cdn.bootcdn.net/ajax/libs/vue/2.6.11/vue.runtime.min.js',
            global: 'Vue'
        },
        {
            id: 'vue-router',
            assets: 'https://cdn.bootcdn.net/ajax/libs/vue-router/3.2.0/vue-router.min.js',
            global: 'VueRouter'
        },
        {
            id: 'vuex',
            assets: 'https://cdn.bootcdn.net/ajax/libs/vuex/3.5.1/vuex.min.js',
            global: 'Vuex'
        },
        {
            id: 'vue-i18n',
            assets: 'https://cdn.bootcdn.net/ajax/libs/vue-i18n/8.20.0/vue-i18n.min.js',
            global: 'VueI18n'
        },
        {
            id: 'vue-cesium',
            assets: 'https://cdn.bootcdn.net/ajax/libs/vue-cesium/2.1.4/lib/index.umd.min.js',
            global: 'VueCesium'
        },
        {
            id: 'lodash',
            assets: 'https://cdn.bootcdn.net/ajax/libs/lodash.js/4.17.19/lodash.min.js',
            global: '_'
        },
        {
            id: 'axios',
            assets: 'https://cdn.bootcdn.net/ajax/libs/axios/0.19.2/axios.min.js'
        },
    ]);
}

exports.default = commons;
// export default commons;