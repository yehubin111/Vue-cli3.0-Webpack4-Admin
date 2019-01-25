<template>
  <div class="sort">
    <div class="left">
      <el-select v-model="value" placeholder="请选择" @change="selectApp">
        <el-option label="所有APP" value="">
        </el-option>
        <el-option v-for="item in applist" :key="item.id" :label="item.name" :value="item.id">
        </el-option>
      </el-select>
      <span class="tip">FB数据稳定期为28天，28天内数据均会微调</span>
    </div>
    <div class="right">
      <div class="block">
        <el-date-picker v-model="value6" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
        </el-date-picker>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
export default {
  data() {
    return {
      value: "",
      value6: [
        new Date().getTime() - 6 * 24 * 3600 * 1000,
        new Date()
      ],
      appid: ""
    };
  },
  mounted() {},
  computed: {
    ...mapGetters(["applist"])
  },
  methods: {
    ...mapMutations(["SETSTATE"]),
    selectApp() {
      let item = this.applist.find(v => v.id == this.value);
      var k = "ifapp",
        v;
      if (!item) {
        this.appid = "";
        v = false;
        this.SETSTATE({ k, v });
        (k = "appdataappid"), (v = appid);
        this.SETSTATE({ k, v });

        k = "appdatasort";
        v = "";
        this.SETSTATE({ k, v });
        k = "appdatacountry";
        v = "";
        this.SETSTATE({ k, v });

        k = "appdataimporession";
        v = "";
        this.SETSTATE({ k, v });
        return;
      }

      let id = item.id;
      let name = item.name;

      this.$emit("selectProject", name);

      // 显示隐藏的模块
      v = true;
      this.SETSTATE({ k, v });

      let appid = id;
      this.appid = id;
      let startDate = this.$timeFormat(
        this.value6.length == 0
          ? new Date().getTime() - 7 * 24 * 3600 * 1000
          : this.value6[0],
        "yyyy-MM-dd"
      );
      let endDate = this.$timeFormat(
        this.value6.length == 0 ? new Date().getTime() : this.value6[1],
        "yyyy-MM-dd"
      );

      (k = "appdataappid"), (v = appid);
      this.SETSTATE({ k, v });

      (k = "appdatastartdate"), (v = startDate);
      this.SETSTATE({ k, v });

      (k = "appdataenddate"), (v = endDate);
      this.SETSTATE({ k, v });

      k = "appdataindex";
      v = 1;
      this.SETSTATE({ k, v });

      this.$store.dispatch("selectApp");

      // 20181031新增自定义事件
      this.$store.dispatch('getCustomEvent', this.value);
    }
  },
  watch: {
    value6(n, o) {
      let startDate = this.$timeFormat(n[0], "yyyy-MM-dd");
      let endDate = this.$timeFormat(n[1], "yyyy-MM-dd");

      var k = "appdatastartdate";
      var v = startDate;
      this.SETSTATE({ k, v });

      (k = "appdataenddate"), (v = endDate);
      this.SETSTATE({ k, v });

      this.$store.dispatch("infoInit", { startDate, endDate });

      let appid = this.appid;
      if (this.appid) {
        // k = "appdatacountry";
        // v = "";
        // this.SETSTATE({ k, v });

        // k = "appdataimporession";
        // v = "";
        // this.SETSTATE({ k, v });

        this.$store.dispatch("selectApp", { appid, startDate, endDate });
      }
    }
  }
};
</script>

<style lang="less" scoped>
.sort {
  height: 60px;
  background-color: #f5f5f5;
  flex-grow: 1;
  display: flex;
  align-items: center;
  position: relative;
  .left {
    margin-left: 20px;
    .tip {
      margin-left: 10px;
      font-size: 14px;
    }
  }
  .right {
    position: absolute;
    right: 20px;
  }
}
</style>
