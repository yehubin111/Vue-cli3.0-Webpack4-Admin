<template>
  <div class="optimize">
    <p class="title">项目{{projectname}}&nbsp;&nbsp;>&nbsp;&nbsp;优化记录</p>
    <div class="sort">
      <el-select class="select" v-model="value1" placeholder="规则" @change="toSort">
        <el-option v-for="item in rulelist" :key="item.id" :label="item.name" :value="item.id">
        </el-option>
      </el-select>
      <el-select class="select" v-model="value2" filterable placeholder="广告账户" @change="toSort">
        <el-option v-for="item in optimizeaccount" :key="item.fbAccountId" :label="item.fbAccountName + (item.fbAccountId != -1?'('+item.fbAccountId+')':'')" :value="item.fbAccountId">
        </el-option>
      </el-select>
      <el-select class="select" v-model="value3" placeholder="状态" @change="toSort">
        <el-option v-for="item in options3" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
      <el-date-picker v-model="value4" @change="toSort" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
      </el-date-picker>
    </div>
    <div class="dialog">
      <optimize-list></optimize-list>
    </div>
    <div class="pageswitch">
      <el-pagination background @size-change="pageSizeChange" :page-sizes="[20, 200, 500]" layout="total, sizes, prev, pager, next, jumper" :total="optotal" :page-size="oppagesize" @current-change="pageSwitch">
      </el-pagination>
    </div>
  </div>

</template>

<script>
import { mapState, mapGetters } from "vuex";
import OptimizeList from "./optimize-list";
export default {
  props: ["id"],
  components: {
    OptimizeList
  },
  data() {
    return {
      value1: "",
      value2: "",
      value3: "",
      value4: [],
      pageindex: 1,
      pagesize: 20,
      //   pgtotal: 0,

      options3: [
        {
          value: "-1",
          label: "不限"
        },
        {
          value: "1",
          label: "成功"
        },
        {
          value: "0",
          label: "失败"
        }
      ]
    };
  },
  computed: {
    ...mapState(["itemlist", "optimizeaccount", "optotal", "oppagesize"]),
    ...mapGetters(["rulelist"]),
    projectname() {
      if (this.itemlist.length == 0) return;
      return this.itemlist.find(v => v.id == this.$route.params.id).projectName;
    },
    // applicationid() {
    //   if (this.itemlist.length == 0) return;
    //   return this.itemlist.find(v => v.id == this.$route.params.id)
    //     .applicationId;
    // }
  },
  mounted() {
    this.$store.dispatch("getRules", this.$route.params.id);

    this.toSort();

    let n = this.$route.params.id;
    this.$store.dispatch("getOptimizeAccount", n);
  },
  methods: {
    pageSizeChange(size) {
      this.pagesize = size;
      this.toSort();
    },
    pageSwitch(page) {
      this.pageindex = page;

      this.toSort();
    },
    toSort() {
      console.log(this.value4);
      let optlist = {
        status: this.value3 == "-1" ? "" : this.value3,
        ruleGroupId: this.value1 == "-1" ? "" : this.value1,
        fbAccountId: this.value2 == "-1" ? "" : this.value2,
        startTime:
          this.value4 && this.value4.length > 0
            ? this.$timeFormat(this.value4[0], "yyyy-MM-dd HH:mm:ss")
            : "",
        endTime:
          this.value4 && this.value4.length > 0
            ? this.$timeFormat(this.value4[1], "yyyy-MM-dd HH:mm:ss")
            : "",
        pageSize: this.pagesize,
        pageNo: this.pageindex
      };

      let projectId = this.$route.params.id;

      this.$store.dispatch("getOptimizeList", {
        optlist,
        projectId
      });
    }
  },
  watch: {
    // applicationid(n, o) {
    //   if (n != "") {
        
    //   }
    // }
  }
};
</script>

<style lang="less" scoped>
.optimize {
  flex-grow: 1;
  .title {
    line-height: 60px;
    font-size: 20px;
    margin-bottom: 20px;
    margin-left: 40px;
    .back {
      color: #333;
    }
  }
  .sort {
    margin-left: 40px;
    margin-bottom: 20px;
    .select {
      width: 150px;
      margin-right: 20px;
    }
    .label {
      font-size: 14px;
      margin-right: 5px;
    }
  }
  .dialog {
    margin-left: 40px;
    //   width: 100%;
  }
  .pageswitch {
    text-align: center;
    margin-top: 20px;
  }
}
</style>
