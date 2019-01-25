<template>
  <div class="message">
    <router-link to="/message">
      <i class="el-icon-message"></i>
      <p v-show="parseInt(messagecount) > 0">{{messagecount}}</p>
    </router-link>
  </div>
</template>

<script>
import { mapState } from "vuex";
let messagecount;
export default {
  data() {
    return {};
  },
  computed: {
    ...mapState(["messagecount"])
  },
  mounted() {
    // 打开手动获取一次消息数量
    this.$store.dispatch("getMessageCount");
    
    // clearInterval(messagecount);
    // messagecount = setInterval(() => {
    //   this.$store.dispatch('getMessageCount');
    // }, 3000);
  }
};
</script>

<style lang="less" scoped>
.message {
  float: right;
  color: #fff;
  position: relative;
  margin-right: 10px;
  cursor: pointer;
  a {
    color: #fff;
    i {
      width: 20px;
      height: 20px;
      font-size: 20px;
      margin-top: 20px;
    }
    p {
      height: 16px;
      line-height: 16px;
      background-color: red;
      border-radius: 8px;
      color: #fff;
      padding: 0 5px;
      font-size: 12px;
      position: absolute;
      top: 12px;
      right: -15px;
    }
  }
}
</style>
