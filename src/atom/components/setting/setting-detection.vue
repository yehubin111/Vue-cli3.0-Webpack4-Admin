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
import { Msgwarning, Msgsuccess, Msgerror } from "../../js/message";
export default {
  props: ["status", "id", "platform"],
  data() {
    return {
      form: {
        apikey1: ""
      },
      formLabelWidth: "100px"
    };
  },
  mounted() {},
  computed: {
    ...mapGetters(["disapp"])
  },
  watch: {},
  methods: {
    async toSet() {
      if (!this.form.apikey1) {
        Msgwarning("请输入api密钥");
        return;
      }
      let res = await this.$store.dispatch("setAF", {
        af_key: this.form.apikey1
      });
      if (res.data) {
        Msgsuccess("绑定成功");
        this.$store.dispatch('getAfState');
        this.toCancel();
      } else {
        Msgerror("绑定失败");
      }
    },
    formReset() {
      this.form.apikey1 = "";
    },
    toCancel() {
      this.$emit("update:status", false);
      this.formReset();
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
