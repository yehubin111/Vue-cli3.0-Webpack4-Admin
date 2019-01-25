<template>
  <el-dialog title="批量新增国家" :visible.sync="dialogFormVisible" class="dialog" @close="toCancel">
    <el-select class="select" v-model="country" multiple filterable remote placeholder="请选择国家">
      <el-option v-for="item in othercountries" :key="item.code" :label="item.name +'(' + item.code + ')'" :value="item.code">
      </el-option>
    </el-select>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">取 消</el-button>
      <el-button @click="toAdd" type="primary">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { mapState } from "vuex";
import { Msgwarning } from "../../js/message";
export default {
  props: ["status"],
  data() {
    return {
      country: [],
      dialogFormVisible: false,
      timeout: null,
      restaurants: [],
      selectArr: []
    };
  },
  watch: {
    status(n, v) {
      this.dialogFormVisible = n;
    }
  },
  computed: {
    ...mapState(["othercountries"])
  },
  methods: {
    toAdd() {
      let ar = this.country.join(',');

      this.$emit("toAddCountries", ar);
    },
    toCancel() {
      this.$emit("cancelAddbm", "status3");
      this.selectArr = [];
      this.country = [];
    },
    cancelSelect(id) {
      this.selectArr = this.selectArr.filter(v => v.id != id);
    }
  },
  mounted() {}
};
</script>

<style lang="less" scoped>
.search {
  width: 100%;
}
.select{
  width: 100%;
}
.tag {
  margin-bottom: 20px;
  .evtag {
    margin-right: 10px;
    margin-bottom: 10px;
  }
}
</style>
