<template>
  <el-dialog title="设置监测平台" :visible.sync="dialogFormVisible" class="dialog" @close="toCancel">
    <el-form :model="form" class="form" label-position="left" :label-width="formLabelWidth">
      <p class="title" v-if="platform.find(v => v.marketType == 'google_play')">设置Google Play监测平台</p>
      <el-form-item label="监测平台" v-if="platform.find(v => v.marketType == 'google_play')">
        <el-radio-group v-model="form.radio1">
          <el-radio label="AppsFlyer"></el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="API密钥" v-if="platform.find(v => v.marketType == 'google_play')">
        <el-input class="input" v-model="form.apikey1" auto-complete="off" placeholder="请输入密钥"></el-input>
      </el-form-item>
      <p class="title" v-if="platform.find(v => v.marketType == 'itunes')">设置iTunes监测平台</p>
      <el-form-item label="监测平台" v-if="platform.find(v => v.marketType == 'itunes')">
        <el-radio-group v-model="form.radio2">
          <el-radio label="AppsFlyer"></el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="API密钥" v-if="platform.find(v => v.marketType == 'itunes')">
        <el-input class="input" v-model="form.apikey2" auto-complete="off" placeholder="请输入密钥"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">取 消</el-button>
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
      dialogFormVisible: false,
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
    status(n, v) {
      this.dialogFormVisible = n;

      if (n) {
        let self = this;
        this.formReset();

        let obj = this.disapp.find(v => v.applicationId == this.id);
        if (obj) {
          obj.AfDataList.forEach(v => {
            if (v.marketType == "google_play" && v.afKey) {
              this.form.radio1 = "AppsFlyer";
              this.form.apikey1 = v.afKey;
            }
            if (v.marketType == "itunes" && v.afKey) {
              this.form.radio2 = "AppsFlyer";
              this.form.apikey2 = v.afKey;
            }
          });
        }
      }
    }
  },
  methods: {
    toSet() {
      if (!this.form.radio1 && !this.form.radio2) {
        Msgwarning("请选择监测平台");
        return;
      }
      if (
        this.platform.find(v => v.marketType == "google_play") &&
        (!this.form.radio1 || this.form.apikey1 == "")
      ) {
        Msgwarning("请完善平台信息");
        return;
      }
      if (
        this.platform.find(v => v.marketType == "itunes") &&
        (!this.form.radio2 || this.form.apikey2 == "")
      ) {
        Msgwarning("请完善平台信息");
        return;
      }
      if (this.form.radio1) {
        this.$store.dispatch("setAF", {
          application_id: this.id,
          market_type: "google_play",
          af_key: this.form.apikey1
        });
      }

      if (this.form.radio2) {
        this.$store.dispatch("setAF", {
          application_id: this.id,
          market_type: "itunes",
          af_key: this.form.apikey2
        });
      }

      this.dialogFormVisible = false;
      this.formReset();
    },
    formReset() {
      this.form.radio1 = "";
      this.form.radio2 = "";
      this.form.apikey1 = "";
      this.form.apikey2 = "";
    },
    toCancel() {
      this.$emit("cancelAddapp", "status3");
    }
  }
};
</script>

<style lang="less" scoped>
.dialog {
  width: 1200px;
  margin: auto;
  overflow-y: hidden;
  .title {
    font-size: 16px;
    margin-bottom: 10px;
    margin-top: 10px;
  }
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
.addselect {
  width: 400px;
}
</style>
