/* eslint-disable no-console */

import { register } from 'register-service-worker'
// Try to workaround with this.
if (process.env.NODE_ENV === 'production') {
  register(`${process.env.BASE_URL}service-worker.js`, {
    ready () {
      console.log(
        'App is being served from cache by a service worker.\n' +
        'For more details, visit https://goo.gl/AFskqB'
      )
    },
    registered () {
      console.log('Service worker has been registered.');
    },
    cached () {
      console.log('Content has been cached for offline use.')
    },
    updatefound () {
      console.log('New content is downloading.')
    },
    updated () {
      // 不做了 这个 Register Service Worker 就是个垃圾。
      // let refreshing = false;
      // navigator.serviceWorker.addEventListener('controllerchange', () => {
      //   if (refreshing) return;  // 应该是防止重复刷新了。
      //   window.location.reload();
      //   refreshing = true;
      // });

      // console.log(self, this);
      // this.clients.matchAll({type: 'window'}).then(clients => {
      //   // client.postMessage({type: 'updateAvaliable'});
      //   clients.forEach(client => {
      //     client.postMessage({type: 'updateAvaliable'});
      //   });
      // });
      // console.log(reg)
      // for (const client of await clients.matchAll({type: 'window'})) {
      //   client.postMessage({type: 'updateAvaliable'});
      // }

         
      // reg.waiting.postMessage({ type: 'SKIP_WAITING' });
      
      console.log('New content is available; please refresh.');
      // Service Worker 不能直接操作 DOM，因此要主动发送消息给主线程。
    },
    offline () {
      console.log('No internet connection found. App is running in offline mode.');
      postMessage('offline');
      
    },
    error (error) {
      console.error('Error during service worker registration:', error)
    }
  })
}
