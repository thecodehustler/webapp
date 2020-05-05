<template>
  <v-container class="bottom-absolute">
    <v-card>
      <v-toolbar dense bottom>
        <v-avatar color="indigo" size="36" v-show="wxReady">
          <span class="white--text">DC</span>
        </v-avatar>
        <v-text-field hide-details prepend-inner-icon="mdi-magnify" single-line clearable dark v-model="textInput" solo label="搜索"></v-text-field>
        <v-btn @click="btnClicked" icon>
          <v-icon>{{iconText}}</v-icon>
        </v-btn>
      </v-toolbar>
    </v-card>
  </v-container>
</template>

<script>
import lodash from 'lodash';

export const States = {
  STOPPED: 0, // 未开始
  RUNNING: 1, // 已在运行
  ERROR: 2, // 出错
  PAUSED: 3, // 已被暂停
  PENDING: 4 // 正在等待返回
};

export default {
  data() {
    return {
      count: 0,
      iconText: "mdi-crosshairs-gps",
      textInput: ''
    };
  },
  computed: {
    wxReady() {
      return this.$store.state.wx.ready;
    }
  },
  props: {
    state: {
      required: true,
      type: Number
    }
  },
  created() {
    this.intervalID = undefined;
    // `_.debounce` 是一个通过 Lodash 限制操作频率的函数。
    // 在这个例子中，我们希望限制访问 yesno.wtf/api 的频率
    // AJAX 请求直到用户输入完毕才会发出。想要了解更多关于
    // `_.debounce` 函数 (及其近亲 `_.throttle`) 的知识，
    // 请参考：https://lodash.com/docs#debounce
    this.debouncedGetEntries = lodash.debounce(this.searchQuery, 1500);
  },
  methods: {
    start() {
      if (this.intervalID == undefined) {
        this.intervalID = setInterval(() => {
          this.count++;
          if (this.count % 2 == 0) {
            this.iconText = "mdi-crosshairs";
          } else {
            this.iconText = "mdi-crosshairs-gps";
          }
        }, 500);
      }
    },
    stop() {
      if (this.intervalID) {
        clearInterval(this.intervalID);
        this.intervalID = undefined;
      }
      this.iconText = "mdi-crosshairs-gps";
    },
    error() {
      this.stop();
      this.iconText = "mdi-error";
    },
    btnClicked() {
      this.$emit("locBtnClick");
    },
    searchQuery() {
      if (this.textInput !== '') {
        var vm = this;
        console.log('searchQuery HERE! 这里做一些异步操作。', vm);
      }
    }
  },
  watch: {
    // 当 State 发生改变时被调用。
    state: function(newV) {
      console.log(this);
      switch (newV) {
        case States.RUNNING:
          console.log(this);
          this.start();
          break;
        case States.STOPPED:
          this.stop();
          break;
        case States.ERROR:
          this.error();
          break;
        case States.PAUSED:
          this.stop();
          break;
        default:
          throw new RangeError("Unexpected state of FAB.");
      }
    }, 
    textInput: function(newVal) {
      if (newVal !== '') {
        this.debouncedGetEntries();
      }
    }
  }
};
</script>

<style>
div.bottom-absolute {
  position: absolute;
  display: flex;
  bottom: 0;
  left: 0;
}
</style>