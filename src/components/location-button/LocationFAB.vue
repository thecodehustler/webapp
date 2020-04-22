<template>
<!-- v-on="$listeners" 就是继承父组件传过来的 onxxx 事件 -->
  <v-btn fab fixed right bottom v-on="$listeners">
    <v-icon>{{iconText}}</v-icon>
  </v-btn>
</template>

<script>
export const States = {
  STOPPED: 0, // 未开始
  RUNNING: 1, // 已在运行
  ERROR: 2,   // 出错
  PAUSED: 3,  // 已被暂停
  PENDING: 4, // 正在等待返回
};

export default {
  data() {
    return {
      count: 0,
      iconText: 'mdi-crosshairs-gps'
    };
  },
  // 从父组件传过来的属性
  props: ["state"],
  created() {
    this.intervalID = undefined;
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
          throw new RangeError('Unexpected state of FAB.');
      }
    }
  }
};
</script>

<style>
</style>