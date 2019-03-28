<template>
  <el-dialog title="规则执行预览" :visible="status" class="deletedialog" @close="toCancel">
    <p class="fonttip important">
      <b>如果现在运行规则，{{executelist.length > 0? '以下': '选中的'}}{{type}}{{executelist.length > 0? '符合': '都不符合'}}你的条件，设置的条件是：</b>
    </p>
    <div class="fonttip important" style="margin-bottom: 20px;">
      <p v-for="(item, index) in condition" :key="index">· {{item}}</p>
    </div>
    <el-table :data="executelist" border style="width: 100%" id="ruleExecute">
      <el-table-column prop="fbTargetName" label="名称"></el-table-column>
      <!-- <el-table-column prop="name" label="详情"></el-table-column> -->
    </el-table>
    <div slot="footer" class="dialog-footer">
      <el-button @click="toCancel">取 消</el-button>
      <el-button type="primary" @click="submitExecute">执 行</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { mapState, mapMutations } from "vuex";
export default {
  props: ["status"],
  data() {
    return {
      id: "",
      type: "",
      condition: []
    };
  },
  methods: {
    ...mapMutations(['SETSTATE']),
    initData(fbid, type, condition) {
      this.id = fbid;
      this.type = type;
      this.condition = condition.split("且");
      // 获取执行信息
      this.$store.dispatch("getExecute", fbid);
    },
    toCancel() {
      this.$emit("update:status", false);

      this.SETSTATE({k: 'executelist', v: []});
    },
    async submitExecute() {
      let res = await this.$store.dispatch('executeRule', this.id);

      if(res.data) {
        this.toCancel();
      }
    }
  },
  computed: {
    ...mapState(["executelist"])
  },
  watch: {}
};
</script>

<style lang='less' scoped>
.fonttip {
  margin-bottom: 10px;
}
.targetlist {
  margin-bottom: 20px;
}
</style>
