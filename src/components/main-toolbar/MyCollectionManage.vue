<template>
  <div>
    <v-toolbar
      short
      dense
      :flat="editingMode"
      :color="editingMode? 'grey darken-4': 'grey darken-2'"
      :class="{'toolbar-editing': editingMode}"
    >
      <v-btn icon @click.stop="editingMode = false" v-if="editingMode">
        <v-icon>mdi-close</v-icon>
      </v-btn>
      <v-btn icon @click.stop="goBack" v-else>
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <v-toolbar-title>{{$t('toolbar.userCard.myCollection')}}</v-toolbar-title>
      <v-spacer />
      <v-btn title="编辑" icon v-if="!editingMode" @click.stop="editingMode = true">
        <v-icon>mdi-pencil</v-icon>
      </v-btn>
      <v-btn title="删除" icon v-else @click.stop>
        <v-icon>mdi-delete</v-icon>
      </v-btn>
    </v-toolbar>
    <v-list v-if="state == 0">
      <v-list-item v-for="(data, index) in testData" :key="data.name" @click.stop>
        <v-list-item-content>
          <v-list-item-title>{{data.name}}</v-list-item-title>
          <v-list-item-subtitle>{{data.description}}</v-list-item-subtitle>
        </v-list-item-content>
        <v-list-item-action v-show="editingMode">
          <v-checkbox></v-checkbox>
        </v-list-item-action>
      </v-list-item>
    </v-list>
    <v-container v-else-if="state == 1">
      <v-row>
        <v-col>
          <v-progress-circular indeterminate></v-progress-circular>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Emit } from "vue-property-decorator";

type Entry = {
  name: string;
  description: string;
};

enum CollectionState {
  PENDING,
  ONGOING,
  ERROR
}

@Component
export default class MyCollectionManage extends Vue {
  testData: Array<Entry> = [];
  @Emit("back") goBack() {}

  editingMode = false;
  selectedIndex = new Set<number>();
  state = CollectionState.PENDING;

  mounted() {
    this.state = CollectionState.ONGOING;

    new Promise((resolve, reject) => {
      setTimeout(() => {
        const res = [
          {
            name: "她声音像清爽薄荷",
            description: "她的呼吸能不能感应 遥远时差外的海域"
          },
          {
            name: "她的耳朵能否听到我",
            description: "万千频率中渺小一个"
          },
          {
            name: 'Mirror Maru',
            description: 'Cashmere Cat'
          }
        ];
        resolve(res);
      }, 10000);
    }).then(result => {
      console.log('promise fulfilled.');
      this.testData.push(...(result as Array<Entry>));
      this.state = CollectionState.PENDING;
    });
    // populate
  }
}
</script>

<style lang="scss">
// @import '~vuetify/src/styles/main.sass';

.toolbar-editing {
  border-bottom: 4px solid blue;
}
</style>