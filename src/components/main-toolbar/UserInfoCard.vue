<template>
  <v-card @click.prevent.self :ripple="false" min-width="240">
    <v-list>
      <v-list-item @click.stop>
        <v-list-item-avatar size="64">
          <!-- <v-badge overlap color="primary" :icon="genderIcon"> -->
          <!-- <template v-slot:badge>
              <span>12</span>
          </template>-->

          <v-avatar size="64" color="grey">
            <v-img :src="userInfo.avatar_url"></v-img>
            <span class="white--text headline">{{avatarAlt}}</span>
          </v-avatar>
          <!-- </v-badge> -->
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title class="font-weight-medium">
            {{userInfo.name}}
            <v-icon size="12">{{genderIcon}}</v-icon>
          </v-list-item-title>
          <v-list-item-subtitle>{{userInfo.id}}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-list>

    <v-divider></v-divider>

    <v-card-actions>
      <v-spacer></v-spacer>

      <v-btn color="error" text @click.stop :disabled="fake">{{$t('toolbar.log_out')}}</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapState } from "vuex";
export default {
  computed: {
    ...mapState({
      wxReady: state => state.wx.wxState == 0,
      userInfo: state => {
        if (state.wx.useFake) return state.wx.localFake;
        return state.wx.userInfo;
      },
      fake: state => state.wx.useFake
    }),
    genderIcon() {
      if (this.userInfo.gender == 1) {
        return "mdi-gender-male";
      } else if (this.userInfo.gender == 2) {
        return "mdi-gender-female";
      } else {
        return "mdi-gender-male-female";
      }
    },
    avatarAlt() {
      let text = "";
      if (this.userInfo.name) {
        let arr = this.userInfo.name.split(" ");
        text.concat(arr[0].charAt(0));
        if (arr.length > 1) {
          text.concat(arr[arr.length - 1].charAt(0));
        }
      }
      return text;
    }
  }
};
</script>

<style>
</style>