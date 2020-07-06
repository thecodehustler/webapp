import Vue from 'vue'
import VueRouter from 'vue-router'

// import AsyncComponents from '../commons/async-components/AsyncComponents';
// import Main from '../views/Main.vue';
import ArticleOverlay from '../components/article-overlay/ArticleOverlay.vue';
import About from '../views/About.vue';
Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Main',
    components: {
      default: () => import( /* webpackChunkName: "main" */'../views/Main.vue')
    },
    children: [
      {
        path: 'about',
        name: 'About',
        
        components: {
          fs: About,
        }
      },
      {
        path: 'landmark',
        name: 'Landmark',
        components: {
          fs: ArticleOverlay
        }
      }
    ]
  },
]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router
