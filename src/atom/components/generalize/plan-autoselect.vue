<template>
  <el-dialog
    title="智能选择"
    :visible.sync="dialogFormVisible"
    class="dialog autodialog"
    @close="toCancel"
  >
    <el-form ref="form" :model="form" label-width="80px" class="cform">
      <el-form-item label="创意类型" class="cline">
        <el-checkbox-group v-model="form.type" @change="getFilterCount">
          <el-checkbox label="0" name="type">单图片</el-checkbox>
          <el-checkbox label="1" name="type">单视频</el-checkbox>
          <el-checkbox label="2" name="type">轮播</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="选择分类" class="cline">
        <el-select class="accountinput" multiple v-model="form.classify" placeholder="选填，为空则不限制分类" @change="getFilterCount">
          <el-option v-for="(item, index) in classifyforplan" :key="index" :label="item" :value="item"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="创意数量" class="cline">
        <el-input class="accountinput" v-model="form.count" placeholder="最多不超过2000"></el-input>
        <p class="tip">符合条件的创意总数为：{{classifyfiltercount}}</p>
      </el-form-item>
      <el-form-item label="选择策略" class="cline">
        <el-radio-group v-model="form.tactics">
          <el-radio label="1">新创意优先</el-radio>
          <el-radio label="2">完全随机</el-radio>
          <el-radio label="3">高点击率优先</el-radio>
          <el-radio label="4">视频/图片不同优先</el-radio>
        </el-radio-group>
        <el-tooltip
          class="item"
          effect="dark"
          content="不同策略会选到不同的创意，请根据需求选择合适的策略"
          placement="top-start"
        >
          <i class="el-icon-question"></i>
        </el-tooltip>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <!-- <span class="tip">将覆盖已选的创意，优先使用新创意，老创意中选择CTR高的</span> -->
      <el-button @click="dialogFormVisible = false">取 消</el-button>
      <el-button @click="toSave" type="primary">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { mapState, mapGetters, mapMutations } from "vuex";
import { Msgwarning } from "../../js/message";
export default {
  props: ["status", "id"],
  components: {},
  data() {
    return {
      state: "",
      activeIndex: "1",
      dialogFormVisible: false,
      title: "",
      form: {
        type: [],
        count: "",
        tactics: "1",
        classify: []
      },
      value: "",
      value2: ""
    };
  },
  watch: {
    status(n, v) {
      this.dialogFormVisible = n;
      if (n) {
        this.SETSTATE({k: 'classifyfiltercount', v: 0});
        this.$store.dispatch("getClassifyForPlan", this.$route.params.id);
      }
    }
  },
  computed: {
    ...mapState(["classifyforplan", "classifyfiltercount"])
  },
  methods: {
    ...mapMutations(['SETSTATE']),
    getFilterCount() {
      if(this.form.type.length == 0) {
        this.SETSTATE({k: 'classifyfiltercount', v: 0});
        return
      };

      let planid = this.id;
      let creativetype = this.form.type.join(',');
      let classify = this.form.classify.join(',');
      this.$store.dispatch('classifyFilterCount', {planid, creativetype, classify})
    },
    reset() {
      this.form.type = [];
      this.form.count = "";
      this.form.tactics = '1';
      this.form.classify = [];
    },
    toSave() {
      if (this.form.type.length == 0) {
        Msgwarning("请选择创意类型");
        return;
      }
      if (this.form.count == "") {
        Msgwarning("请输入创意数量");
        return;
      }
      if (parseInt(this.form.count) > 2000) {
        Msgwarning("创意数量最多为2000");
        return;
      }

      let plan_id = this.id;
      let creative_type = this.form.type.join(",");
      let creative_num = parseInt(this.form.count);
      let creative_strategy = this.form.tactics;
      let creative_classify = this.form.classify.join(',');

      this.$store.dispatch("autoSelect", {
        plan_id,
        creative_type,
        creative_num,
        creative_strategy,
        creative_classify
      });
      this.dialogFormVisible = false;
    },
    toCancel() {
      this.SETSTATE({k: 'classifyfiltercount', v: 0});

      this.$emit("cancelAddbm", "status2");
      this.reset();
    }
  }
};
</script>
<style>
.autodialog .el-form-item__label {
  padding-right: 30px;
  /* width: 4em; */
  box-sizing: content-box;
}
</style>


<style lang="less" scoped>
.el-menu-demo {
  margin-bottom: 20px;
}
.accountinput {
  width: 300px;
}
.cline {
  position: relative;
  .item {
    position: absolute;
    left: 3px;
    top: 14px;
  }
}
.tip {
  font-size: 14px;
  // margin-right: 20px;
  color: #999;
  margin-left: 30px;
}
</style>
