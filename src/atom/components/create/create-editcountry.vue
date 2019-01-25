<template>
  <el-dialog title="编辑国家" :visible.sync="dialogFormVisible" class="dialog" @close="toCancel">
    <el-form ref="form" label-width="120px" class="cform">
      <el-form-item label="选择国家" class="cline">
        <el-select class="select" v-model="country" multiple filterable remote placeholder="请选择国家">
          <el-option v-for="item in othercountries" :key="item.code" :label="item.name +'(' + item.code + ')'" :value="item.code">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">取 消</el-button>
      <el-button @click="toSave" type="primary">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { mapState, mapGetters, mapMutations } from "vuex";
import { Msgwarning } from "../../js/message";
export default {
  props: ["status", "oldid", "oldcountry"],
  components: {},
  data() {
    return {
      state: "",
      activeIndex: "1",
      dialogFormVisible: false,
      title: "",
      country: this.oldcountry,
      value: "",
      value2: ""
    };
  },
  watch: {
    status(n, v) {
      this.dialogFormVisible = n;
    },
    oldcountry(n, v) {
      this.country = n;
    }
  },
  computed: {
    ...mapState(["othercountries"])
  },
  methods: {
    toSave() {
      console.log(this.country);
      if (this.country.length == 0) {
        Msgwarning("请选择国家");
        return;
      }

      let id = this.oldid;
      let countryId = this.country.join(",");
      this.$store.dispatch("updateSex", { id, countryId });

      this.dialogFormVisible = false;
    },
    toCancel() {
      this.$emit("cancelAddbm", "status7");
    }
  }
};
</script>

<style lang="less" scoped>
.select{
  width: 80%;
}
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
