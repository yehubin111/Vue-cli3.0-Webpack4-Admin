<template>
    <div class="box">
        <p class="title">Log into UnityMob</p>
        <p class="name">Email</p>
        <el-input v-model="email" @input="emailInput" placeholder="Please enter your email"></el-input>
        <p class="name">Password</p>
        <el-input v-model="password" @input="passwordInput" type="password" placeholder="Please enter your password"></el-input>
        <el-button type="primary" @click="infoTest">Login</el-button>
    </div>
</template>

<script>
import { mapMutations } from "vuex";
import { Message } from 'element-ui'
export default {
  data() {
    return {
      email: "",
      password: ""
    };
  },
  computed: {

  },
  mounted() {
    this.SETREF();
  },
  methods: {
    ...mapMutations(["CHANGEMSG", "SETREF"]),
    infoTest() {
      let eml = this.email;
      if (!eml) {
        this.msg = "邮箱不能为空";
        this.messageAlert();
        return;
      }
      let psw = this.password;
      if (!psw) {
        this.msg = "密码不能为空";
        this.messageAlert();
        return;
      }

      this.$store.dispatch("toLogin", { eml, psw });
    },
    emailInput() {
      this.ifemail = false;
      this.CHANGEMSG("");
    },
    passwordInput() {
      this.ifpassword = false;
      this.CHANGEMSG("");
    },
    messageAlert() {
      Message({
        message: this.msg,
        type: "error",
        duration: 5000
      });
    }
  }
};
</script>

<style lang="less" scoped>
.box {
  width: 300px;
  border: 1px solid #d6d6d6;
  flex-basis: 325px;
  margin-top: 30px;
  border-radius: 5px;
  text-align: center;
  margin-bottom: 200px;
  position: relative;
  flex-shrink: 0;
  .title {
    font-size: 18px;
    text-align: center;
    line-height: 60px;
  }
  .name {
    padding-left: 20px;
    line-height: 30px;
    font-size: 12px;
    text-align: left;
  }
  .el-input {
    padding: 0 20px;
    box-sizing: border-box;
    margin-bottom: 20px;
  }
  .el-button {
    padding: 10px 60px;
    margin-top: 15px;
    border-radius: 18px;
  }
  .info {
    color: #f44446;
    position: absolute;
    line-height: 20px;
    padding-left: 20px;
    &.email {
      top: 131px;
    }
    &.password {
      top: 221px;
    }
    &.all {
      text-align: center;
      position: static;
      padding-left: 0;
    }
  }
}
</style>
