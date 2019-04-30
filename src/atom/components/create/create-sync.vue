<template>
  <el-dialog title="选择需要同步的广告账户" :visible.sync="dialogFormVisible" class="dialog" @close="toCancel">
    <el-select
      class="select"
      v-model="account"
      multiple
      filterable
      collapse-tags
      placeholder="请选择广告账户，可搜索"
      @change="toGettime"
    >
      <el-option
        v-for="item in commonaccount"
        :key="item.fbId"
        :label="item.name + '('+item.fbAccountId+')'"
        :value="item.fbId"
        :disabled="item.accountStatus != 1"
      ></el-option>
    </el-select>
    <p class="tip" v-show="account.length > 0">
      预计同步
      <span>{{synctime}}</span>，同步时间随创意和广告账户数量而减少
    </p>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">取 消</el-button>
      <el-button @click="toAdd" type="primary">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import { Msgwarning } from "../../js/message";
export default {
  props: ["status", "ifsyncall"],
  data() {
    return {
      account: [],
      dialogFormVisible: false,
      timeout: null
    };
  },
  watch: {
    status(n, v) {
      this.dialogFormVisible = n;
    }
  },
  computed: {
    ...mapState(["synctime", "commonaccount"]),
    ...mapGetters(["allcheckidstatus"])
  },
  methods: {
    toGettime() {
      if (this.account.length != 0) {
        let accountIds = this.account.join(",");
        let ids = this.ifsyncall
          ? ""
          : this.allcheckidstatus.map(v => v.id).join(",");
        let projectId = this.$route.params.id;
        this.$store.dispatch("syncTime", { accountIds, ids, projectId });
      }
    },
    toAdd() {
      console.log(this.account);

      this.$emit("toSync", this.account);
      this.dialogFormVisible = false;
    },
    toCancel() {
      this.$emit("cancelAddbm", "status8");

      this.account = [];
    }
  },
  mounted() {}
};
</script>

<style lang="less" scoped>
.search {
  width: 100%;
}
.select {
  width: 80%;
}
.tip {
  line-height: 40px;
  color: #666;
  span {
    color: #409eff;
  }
}
.tag {
  margin-bottom: 20px;
  .evtag {
    margin-right: 10px;
    margin-bottom: 10px;
  }
}
</style>
