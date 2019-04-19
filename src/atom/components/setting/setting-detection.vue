<template>
  <el-dialog title="绑定AppsFlyer" :visible="status" class="dialog" @close="toCancel">
    <el-form :model="form" class="form" label-position="left" :label-width="formLabelWidth">
      <el-form-item label="API密钥">
        <el-input class="input" v-model="form.apikey1" auto-complete="off" placeholder="请输入密钥"></el-input>
        <p>绑定后可获取Appsflyer中的监测数据</p>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="toCancel">取 消</el-button>
      <el-button @click="toSet" type="primary">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import { Msgwarning } from "../../js/message";
export default {
  props: ["status", "id", "platform"],
  data() {
    return {
      form: {
        radio1: "",
        radio2: "",
        apikey1: "",
        apikey2: ""
      },
      formLabelWidth: "100px"
    };
  },
  mounted() {},
  computed: {
    ...mapGetters(["disapp"])
  },
  watch: {

  },
  methods: {
    toSet() {
      

      this.toCancel();
      this.formReset();
    },
    formReset() {
      
    },
    toCancel() {
      this.$emit("update:status", false);
    }
  }
};
</script>

<style lang="less" scoped>
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
</style>
