import Loading from "../../components/indeterminate/Loading.vue";
import ErrorComponent from '../../components/indeterminate/Error.vue';

export default {
    build(path: string) {
        return () => ({
            component: import(`SRC/${path}`), // 前缀是为了确保能以 src 目录起始
            // 异步组件加载时使用的组件
            loading: Loading,
            // 加载失败时使用的组件
            error: ErrorComponent,
            // 展示加载时组件的延时时间。默认值是 200 (毫秒)
            delay: 1000,
        });
    },
}