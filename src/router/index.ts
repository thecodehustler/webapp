import Vue from 'vue'
import VueRouter from 'vue-router'

// import AsyncComponents from '../commons/async-components/AsyncComponents';
// import Main from '../views/Main.vue';
// import About from '../views/About.vue';
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
          fs: () => import(/* webpackChunkName: "about" */'../views/About.vue'),
        }
      },
      {
        path: 'landmark',
        name: 'Landmark',
        components: {
          fs: () => import (/* webpackChunkName: "landmark" */ '../components/article-overlay/ArticleOverlay.vue')
        }
      }
    ]
  },
]

const router = new VueRouter({
  routes: routes,
  mode: "history"
});

export default router;