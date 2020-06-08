<template>
  <v-container class="fill-height text-center align-content-center">
    <v-row align-content="center" align="center" class="text-center">
      <v-col>
        <h1 class="display-2 font-weight-light condensed">{{$t('app.webgl_unsupported')}}</h1>
      </v-col>
    </v-row>
    <v-row justify="center" align="center">
      <v-col>
        <p class="text--secondary subtitle-1">{{$t('app.webgl_unsupported_description')}}</p>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-btn href="https://browsehappy.com/" target="_blank">{{$t('app.upgrade_help')}}<v-icon small>mdi-open-in-new</v-icon></v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>