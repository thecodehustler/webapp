<template>
  <v-container class="bottom-absolute">
    <v-card>
      <v-toolbar dense bottom>
        <v-text-field hide-details prepend-inner-icon="mdi-magnify" single-line clearable dark></v-text-field>
        <v-btn @click="btnClicked" icon>
          <v-icon>{{iconText}}</v-icon>
        </v-btn>
      </v-toolbar>
    </v-card>
  </v-container>
</template>

<script>
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
      iconText: "mdi-crosshairs-gps"
    };
  },
  props: {
    state: {
      required: true,
      type: Number
    }
  },
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
    },
    btnClicked() {
      this.$emit("locBtnClick");
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