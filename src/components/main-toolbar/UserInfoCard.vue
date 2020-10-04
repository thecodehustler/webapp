<template>
  <v-card :ripple="false" width="360">
    <v-window v-model="windowLevel">
      <v-window-item :value="1">
        <v-list>
          <v-list-item three-line>
            <v-badge :icon="genderIcon" color="error" overlap bottom bordered offset-x="32" offset-y="36">
            <v-list-item-avatar size="64" class="ml-0">
                <v-avatar size="64" color="grey">
                  <v-img :src="userInfo.avatar_url"></v-img>
                  <span class="white--text headline" v-if="userInfo.avatar_url === ''">{{ avatarAlt }}</span>
                </v-avatar>
            </v-list-item-avatar>
            </v-badge>

            <v-list-item-content class="align-self-center">
              <v-list-item-title class="text-h6 text-truncate pb-1">
                {{ userInfo.name }}
              </v-list-item-title>
              <v-list-item-subtitle>{{ userInfo.id }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item @click.stop="goToMyCollection">
            <v-list-item-icon>
              <v-icon>mdi-heart</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>{{ $t('toolbar.userCard.myCollection') }}</v-list-item-title>
            </v-list-item-content>
            <v-list-item-icon>
              <v-icon>mdi-arrow-right</v-icon>
            </v-list-item-icon>
          </v-list-item>
        </v-list>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn color="error" text @click.stop="" :disabled="fake">{{ $t('toolbar.log_out') }}</v-btn>
        </v-card-actions>
      </v-window-item>

      <v-window-item :value="2">
        <MyCollectionManage @back="goBack"/>
      </v-window-item>
    </v-window>
  </v-card>
</template>

<script lang="ts">
import {Vue, Component} from "vue-property-decorator";
import {State} from "vuex-class";

import MyCollectionManage from './MyCollectionManage.vue';

enum Gender {
  UNKNOWN,
  MALE,
  FEMALE
}

@Component({
  components: {
    MyCollectionManage
  }
})
export default class UserInfoCard extends Vue {
  @State(state => state.wx.wxState == 0) wxReady: any;
  @State(state => (state.wx.useFake ? state.wx.localFake : state.wx.userInfo))
  userInfo;
  @State(state => state.wx.useFake) fake;

  get genderIcon(): string {
    if (this.userInfo.gender == Gender.MALE) {
      return "mdi-gender-male";
    } else if (this.userInfo.gender == Gender.FEMALE) {
      return "mdi-gender-female";
    } else {
      return "mdi-gender-male-female";
    }
  }

  get avatarAlt(): string {
    const text = "";
    if (this.userInfo.name) {
      const arr = this.userInfo.name.split(" ");
      text.concat(arr[0].charAt(0));
      if (arr.length > 1) {
        text.concat(arr[arr.length - 1].charAt(0));
      }
    }
    return text;
  }

  // 窗口的层级
  windowLevel = 1;

  goBack() {
    if (this.windowLevel > 1)
      this.windowLevel--;
  }

  goToMyCollection() {
    this.windowLevel++;
  }
}

</script>

<style>
</style>