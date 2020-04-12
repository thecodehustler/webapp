<template>
<div class="loading-flex">
    <div class="loading-container">
        <v-progress-linear indeterminate color="blue"></v-progress-linear>
        <div class="title">{{loadingText}}</div>
    </div>
</div>
</template>

<script>
export default {
name: 'Loading',
data() {
    return {
        loadingText: '正在载入',
        timeout: 5000
    }
},
mounted() {
    console.log('Mounted. still loading?')
    setTimeout(() => {
        console.log('timeout reached.')
        this.loadingText = '载入的时间似乎比预期要慢一些。\n请稍等片刻。'
    }, this.timeout);
}
}
</script>

<style>
.loading-flex {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    /* margin: 0 auto auto; */
    width: 100%;
    height: 100%;
    position: relative;
    margin: 0;
    text-align: center;
}

.loading-container {
    display: flex;
    max-width: 400px;
    width: 80%;
    height: auto;
    min-height: 4em;
    flex-direction: column;

}
</style>