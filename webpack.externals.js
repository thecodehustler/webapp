const commons = [];

function generateAssetURL() {
    return '';
}

if (process.env.NODE_ENV === 'production') {
    commons.push(...[
        {
            id: 'weixin-js-sdk',
            assets: 'https://cdn.jsdelivr.net/npm/weixin-js-sdk@1.6.0/index.original.js',
            global: 'jWeixin'
        },
        {
            id: 'vue',
            assets: 'https://cdn.jsdelivr.net/npm/vue@2.6.11/dist/vue.runtime.min.js',
            global: 'Vue'
        },
        {
            id: 'vue-router',
            assets: 'https://cdn.jsdelivr.net/npm/vue-router@3.3.4/dist/vue-router.min.js',
            global: 'VueRouter'
        },
        {
            id: 'vuex',
            assets: 'https://cdn.jsdelivr.net/npm/vuex@3.5.1/dist/vuex.min.js',
            global: 'Vuex'
        },
        {
            id: 'vue-i18n',
            assets: 'https://cdn.jsdelivr.net/npm/vue-i18n@8.18.2/dist/vue-i18n.min.js',
            global: 'VueI18n'
        },
        {
            id: 'vue-cesium',
            assets: 'https://cdn.jsdelivr.net/npm/vue-cesium@2.1.4/lib/index.umd.min.js',
            global: 'VueCesium'
        },
        {
            id: 'lodash',
            assets: 'https://cdn.jsdelivr.net/npm/lodash@4.17.15/lodash.min.js',
            global: '_'
        },
        {
            id: 'axios',
            assets: 'https://cdn.jsdelivr.net/npm/axios@0.19.2/dist/axios.min.js',
            global: 'axios'
        },
    ]);
}

exports.default = commons;
// export default commons;