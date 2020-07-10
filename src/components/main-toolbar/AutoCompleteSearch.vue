<template>
  <v-autocomplete
    v-model="model"
    :loading="isLoading"
    :items="data"
    :search-input.sync="searchInput"
    :label="$t('toolbar.search')"
    no-filter
    hide-no-data
    hide-details
    clearable
    single-line
    item-text="name"
    item-value="subtitle"
    small-chips
  >
    <template v-slot:no-data>
      <v-subheader>{{ $tc('toolbar.searchResult', count, {count: count})}}</v-subheader>
    </template>

    <template v-slot:selection="{ attr, on, item, selected }">
      <v-chip v-bind="attr" :input-value="selected" v-on="on">
        <span v-text="item.name"></span>
      </v-chip>
    </template>

    <template v-slot:item="{ item }">
      <!-- <v-list-item @click="itemClicked(result)"> -->
      <v-list-item-content>
        <v-list-item-title v-text="item.name"></v-list-item-title>
        <v-list-item-subtitle v-text="item.subtitle"></v-list-item-subtitle>
      </v-list-item-content>
      <!-- </v-list-item> -->
    </template>
  </v-autocomplete>
</template>

<script lang="ts">
interface DataEntry {
  landmark_id: number;
  name: string;
  subtitle: string;
}

import lodash from "lodash";
import Axios from "axios";

import { Vue, Component, Watch } from "vue-property-decorator";

@Component
export default class AutoCompleteSearch extends Vue {
  data: Array<DataEntry> = [];
  isLoading = false;
  searchInput = "";
  model = null;

  @Watch("searchInput") onInputChanged(val: string) {
    if (typeof val === "string") {
      let queryString = val.trim();
      if (queryString && queryString !== "") this.debouncesGetEntries(val);
    } else {
      this.data.splice(0, this.data.length);
    }
  }

  set count(value) {
    console.log("count setter");
  }

  get count() {
    console.log("count getter,", this.data.length);

    return this.data.length;
  }

  doSearchQuery(value: string) {
    this.isLoading = true;
    if (value !== "") {
      Axios.get("/api/search", {
        params: {
          name: value
        }
      })
        .then(ret => {
          this.data.splice(0, this.data.length);
          let data: Array<DataEntry> = ret.data;
          this.data.push(...data);
          // this.data = data;
        })
        .catch(reason => {
          console.warn(reason);
          // this.searchState = SearchState.ERROR;
        })
        .finally(() => {
          this.isLoading = false;
        });
    }
  }
  debouncesGetEntries = lodash.debounce(this.doSearchQuery, 500);

  filter() {
    return true;
  }
}
</script>

<style lang="scss">
</style>