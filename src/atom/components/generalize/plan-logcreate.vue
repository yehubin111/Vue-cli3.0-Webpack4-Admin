<template>
  <el-dialog title="创建广告" :visible.sync="dialogFormVisible" class="dialog" @close="toCancel">
    <el-form ref="form" :model="form" label-width="120px" class="cform">
      <p class="loginfo">{{logcreateaccount}}个广告账户各包含{{logcreatecampaign}}个广告系列，每个广告系列包含{{logcreateset}}个广告组，每个广告组包含{{logcreatecreative}}个创意；<br />创建广告前请同步创意，不会使用停用的广告账户和创意创建广告</p>
      <el-form-item label="广告系列名称" class="cline">
        <el-input class="accountinput" v-model="form.name" placeholder="请输入广告系列名称"></el-input>
        <span>{{time}}</span>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">取 消</el-button>
      <el-button @click="toSave" type="primary">创建广告</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { mapState, mapGetters, mapMutations } from "vuex";
import { Msgwarning } from "../../js/message";
export default {
  props: ["status", "id", "name"],
  components: {},
  data() {
    return {
      state: "",
      activeIndex: "1",
      dialogFormVisible: false,
      title: "",
      form: {
        name: ""
      },
      value: "",
      value2: ""
    };
  },
  watch: {
    status(n, v) {
      this.dialogFormVisible = n;

      let planid = this.id;
      if (n) {
        this.$store.dispatch("getCreateNum", planid);
      }
    },
    name(n, v) {
      this.form.name = n;
    }
  },
  computed: {
    ...mapState([
      "logcreatecreative",
      "logcreateaccount",
      "logcreateset",
      "logcreatecampaign"
    ]),
    time() {
      return `_${this.$timeFormat(new Date(), "yyyyMMddHHmmss")}`;
    }
  },
  methods: {
    ...mapMutations(["SETSTATE"]),
    toSave() {
      if (this.form.name.trim() == "") {
        Msgwarning("请输入广告系列名称");
        return;
      }

      let option = {
        campaignName: this.form.name + this.time,
        planId: this.id,
        projectId: this.$route.params.id
      };

      this.$store.dispatch("createLogad", { option });

      // this.$emit("showLogdetailbox", "status4");
      this.dialogFormVisible = false;

      setTimeout(g => {
        let k = "ifadcreate";
        let v = true;
        this.SETSTATE({ k, v });
      }, 300);
    },
    toCancel() {
      this.$emit("cancelAddbm", "status5");
    }
  }
};
</script>

<style lang="less" scoped>
.el-menu-demo {
  margin-bottom: 20px;
}
.loginfo {
  left: 20px;
  margin-bottom: 30px;
  margin-left: 23px;
}
.accountinput {
  width: 300px;
}
.tip {
  font-size: 14px;
  margin-right: 20px;
}
</style>
