import Loading from "./views/landing/Loading.vue";
import ErrorComponent from "./views/landing/Error.vue";

export default {
    asyncComponent(path, root) {
        return () => ({
            component: import('' + path),
            // 异步组件加载时使用的组件
            loading: Loading,
            // 加载失败时使用的组件
            error: ErrorComponent,
            // 展示加载时组件的延时时间。默认值是 200 (毫秒)
            delay: 200,
            timeout: 20000
        });
    },
}