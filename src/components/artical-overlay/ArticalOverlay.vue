<template>
  <v-overlay :value="show" @click="selfClose">
    <v-container fluid>
      <v-card width="95vw" max-width="450px">
        <v-img
          :aspect-ratio="16/9"
          gradient="to bottom, rgba(100,115,201,.33), rgba(25,32,72,.7)"
          src="https://cdn.vuetifyjs.com/images/cards/forest-art.jpg"
        >
          <v-container class="fill-height align-content-end">
            <v-row>
              <v-col>
                <h2 class="heading">{{ textInfo.name }}</h2>
                <div class="subheading">{{textInfo.subtitle}}</div>
              </v-col>
            </v-row>
          </v-container>
        </v-img>
        <v-card-text>
          <v-row>
            <v-col>{{textInfo.description}}</v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-btn :href="textInfo.mp_link">前往公众号查看<v-icon small>mdi-open-in-new</v-icon></v-btn>
        </v-card-actions>
      </v-card>
    </v-container>
  </v-overlay>
</template>

<script>
import axios from 'axios';
export default {
  data() {
    return {
      textInfo: { // 需要与后端返回的数据一致
        name: "",
        subtitle: "",
        top_image_url: "",
        description: "",
        mp_link: ""
      }
    };
  },
  props: {
    debugInfo: {
      type: Object,
      required: false
    },
    show: {
      type: Boolean,
      required: true
    },
    url: {
      type: String, 
      required: false
    }
  },
  created() {
    if (this.$props.debugInfo) {
      this.textInfo = this.$props.debugInfo;
    }
  },
  mounted() {
    if (this.$props.url) {
      this.loadFromURL(this.$props.url);
    }
  },
  methods: {
    selfClose() {
      this.show = false;
    },
    loadFromURL(url) {
      axios.get(url).then(value => {
        console.log('success,',value);
      }).catch(reason => {
        console.log(reason);
      })
    }
  }
};
</script>

<style>

</style>