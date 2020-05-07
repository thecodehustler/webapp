<template>
  <v-card max-width="680">
    <v-sheet tile color="primary" height="150">
      <v-container class="align-content-end fill-height">
        <v-row no-gutters>
          <h1 class="display-2 font-weight-thin">天空旅行团</h1>
        </v-row>
      </v-container>
    </v-sheet>
    <v-container>
      <v-row>
        <v-subheader>本项目使用到的框架：</v-subheader>
      </v-row>

      <v-row>
        <v-list>
          <v-list-item >
            <v-card outlined href="https://github.com/vuejs/vue" class="god-damn-vuetify-grid">
              <v-container>
                <v-row>
                  <v-col class="flex-shrink-1 flex-grow-0">
                    <v-avatar size="48">
                      <v-img src="https://cn.vuejs.org/images/logo.png"></v-img>
                    </v-avatar>
                  </v-col>
                  <v-col class="flex-grow-1 flex-shrink-0">
                    <h2 class="title">Vue.js</h2>
                    <p class="body-2">渐进式 JavaScript 框架</p>
                  </v-col>
                </v-row>
              </v-container>
            </v-card>
          </v-list-item>

          <v-list-item>
            <v-card outlined href="https://github.com/vuetifyjs/vuetify" class="god-damn-vuetify-grid">
              <v-container>
                <v-row>
                  <v-col class="flex-shrink-1 flex-grow-0">
                    <v-avatar size="48">
                      <v-img src="https://vuetifyjs.com/apple-touch-icon-180x180.png"></v-img>
                    </v-avatar>
                  </v-col>
                  <v-col class="flex-grow-1 flex-shrink-0">
                    <h2 class="title">Vuetify</h2>
                    <p class="body-2">制作精良的 Material Design UI 组件库。</p>
                  </v-col>
                </v-row>
              </v-container>
            </v-card>
          </v-list-item>
        </v-list>
      </v-row>
    </v-container>
  </v-card>
</template>

<style scoped>
.god-damn-vuetify-grid {
  width: 100%;
}
</style>
