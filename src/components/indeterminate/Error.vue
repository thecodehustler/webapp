<template>
<div class="error-flex">
    <v-card width="auto" color="error">
        <v-card-title><v-icon>mdi-error</v-icon>很抱歉，载入超时。</v-card-title>
        <v-card-text>攻城狮对此感到非常遗憾。<br />请检查您的网络连接，并刷新页面重试。</v-card-text>
        <v-card-actions>
            <v-spacer />
            <v-btn @click="reload" text>刷新页面</v-btn>
        </v-card-actions>
    </v-card>
</div>
  
</template>

<script>
export default {
    name: 'Error',
    methods: {
        reload() {
            location.reload();
        }
    }
}
</script>

<style>
.error-flex {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    /* margin: 0 auto auto; */
    width: 100%;
    height: 100%;
    position: relative;
    margin: 0;
}

</style>