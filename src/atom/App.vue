<template>
    <div class="app" id="app">
        <router-view></router-view>
    </div>
</template>
<script>
export default {
  // name: 'app'
  mounted() {
    /**
     * 建立websocket连接，获取消息数量
     * 放到最外层，防止重复建立链接
     */
    this.$store.dispatch("messageWebsocket");
  }
};
</script>  
<style lang="less">
@import "../common/less/reset.less";

body {
  background-color: #fff;
}
</style>

