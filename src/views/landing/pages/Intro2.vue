<template>
  <v-sheet color="orange" class="fill-height">
    <v-container class="fill-height">
      <v-row align="center" justify="center">
        <v-col>
          <div class="display-3">很好！</div>
          <br />
          <div class="display-6">请开始探索！</div>
        </v-col>
      </v-row>
      <v-row align="right">
        <v-col>
          <v-btn fab @click="onClose()">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-sheet>
</template>

<script>
export default {
  name: "Intro2",
  methods: {
    onClose() {
      console.log("Hello??? Closing!!");
      this.$emit("landing-close");
    }
  }
};
</script>

<style>
/* .root {
    width: 800px;
} */
</style>