<template>
    <div class="userinfo">
        <span @mouseenter="showList" @mouseleave="hideList">
            <svg-icon svgclass="user" svgname="user"></svg-icon>
            {{nickname}}
            <i></i>
        </span>
        <!-- <transition name="fade"> -->
        <div class="list" v-show="list" @mouseenter="showList" @mouseleave="hideList">
            <p @click="changePassword">修改密码</p>
            <p @click="toLogout">退出</p>
        </div>
        <!-- <div class="changepassword">
                <p class="title">修改密码</p>
                <el-form ref="form" :model="form" label-width="80px">
                    <el-form-item label="活动名称">
                        <el-input v-model="form.name"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <div class="shadow"></div> -->
        <!-- </transition> -->
        <el-dialog title="修改密码" :visible.sync="dialogFormVisible" class="dialog">
            <el-form :model="form" class="form" label-position="left" :label-width="formLabelWidth">
                <el-form-item label="密码">
                    <el-input class="input" type="password" v-model="form.oldpassword" auto-complete="off" placeholder="请输入旧密码"></el-input>
                </el-form-item>
                <el-form-item label="新密码">
                    <el-input class="input" type="password" v-model="form.password" auto-complete="off" placeholder="6-18位字母或数字或特殊符号"></el-input>
                </el-form-item>
                <el-form-item label="重复新密码">
                    <el-input class="input" type="password" v-model="form.passwordagain" auto-complete="off" placeholder="请再次输入密码"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="toChange">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import { Msgsuccess, Msgerror } from "../js/message.js";
export default {
  data() {
    return {
      list: false,
      dialogFormVisible: false,
      form: {
        oldpassword: "",
        password: "",
        passwordagain: ""
      },
      formLabelWidth: "100px"
    };
  },
  created() {
    let k = "nickname";
    let v = localStorage.getItem("atom_nickname");
    this.SETSTATE({ k, v });
  },
  mounted() {
  },
  computed: {
    ...mapState(["nickname"])
  },
  methods: {
    ...mapMutations(["SETSTATE"]),
    showList() {
      this.list = true;
    },
    hideList() {
      this.list = false;
    },
    changePassword() {
      this.dialogFormVisible = true;
    },
    toLogout() {
      this.$store.dispatch("toLogout");
    },
    toChange() {
      let k = this.form.oldpassword;
      let n1 = this.form.password;
      let n2 = this.form.passwordagain;
      if (!k) {
        Msgerror("旧密码不能为空");
        return;
      }
      if (!n1) {
        Msgerror("新密码不能为空");
        return;
      }
      if (!n2) {
        Msgerror("重复密码不能为空");
        return;
      }

      if (n1 !== n2) {
        Msgerror("两次输入的密码不一样");
        return;
      }
      this.$store.dispatch("changePassword", { k, n1, n2 });
    }
  }
};
</script>

<style lang="less" scoped>
.userinfo {
  float: right;
  color: #fff;
  line-height: 60px;
  position: relative;
  & > span {
    margin-left: 20px;
    padding: 0 16px 0 28px;
    position: relative;
    // margin-right: 20px;
    display: inline-block;
    cursor: pointer;
    .user {
      width: 20px;
      height: 20px;
      position: absolute;
      left: 0;
      top: 20px;
    }
    i {
      width: 0;
      height: 0;
      border: 5px solid transparent;
      border-top-color: #fff;
      position: absolute;
      right: 0;
      top: 29px;
    }
  }
  .list {
    position: absolute;
    width: 120px;
    top: 55px;
    right: 10px;
    border-radius: 5px;
    overflow: hidden;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    p {
      line-height: 30px;
      background-color: #fff;
      padding: 0 0 0 20px;
      color: #333;
      font-size: 14px;
      cursor: pointer;
      &:hover {
        background-color: #deedfd;
        color: #3297ff;
      }
    }
  }
  .dialog {
    width: 1200px;
    margin: auto;
    overflow-y: hidden;
    .form {
      margin-top: -20px;
      margin-left: 20px;
      .input {
        width: 400px;
      }
    }
    .dialog-footer {
      margin-top: -20px;
    }
  }
  .changepassword {
    width: 600px;
    height: 400px;
    background-color: #fff;
    position: fixed;
    top: 50%;
    left: 50%;
    margin: -200px 0 0 -300px;
    z-index: 998;
    .title {
      line-height: 60px;
      font-size: 16px;
      padding-left: 20px;
    }
  }
  .shadow {
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    position: fixed;
    z-index: 997;
    background-color: rgba(0, 0, 0, 0.5);
  }
}
</style>
