<template>
  <div class="contain">
    <p class="title">上传模板</p>
    <div class="ctrl">
      <el-button class="add" type="primary" @click="addTemplates">上传模板</el-button>
      <el-select class="fr" clearable v-model="trade" placeholder="请选择行业" @change="getTemplateList">
        <el-option :label="td.name" :value="td.name" v-for="td in temptrade" :key="td.name"></el-option>
      </el-select>
      <el-select class="fr" clearable v-model="size" placeholder="请选择尺寸" @change="getTemplateList">
        <el-option :label="sz.name" :value="sz.name" v-for="sz in tempsize" :key="sz.name"></el-option>
      </el-select>
      <el-button class="fr" type="text" @click="tradestatus = true">行业管理</el-button>
      <el-button class="fr" type="text" @click="sizestatus = true">尺寸管理</el-button>
    </div>
    <templates-list @templistReset="templistReset"></templates-list>

    <div class="pageswitch">
      <el-pagination
        @size-change="pageSizeChange"
        @current-change="pageSwitch"
        :current-page="pageindex"
        :page-sizes="[20, 50, 80]"
        :page-size="pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="templatetotal"
      ></el-pagination>
    </div>
    <size-ctrl :status.sync="sizestatus"></size-ctrl>
    <trade-ctrl :status.sync="tradestatus"></trade-ctrl>
  </div>
</template>

<script>
import TemplatesList from "./templates-list";
import SizeCtrl from "./templates-sizectrl";
import TradeCtrl from "./templates-tradectrl";
import { mapState } from "vuex";
export default {
  components: {
    TemplatesList,
    SizeCtrl,
    TradeCtrl
  },
  data() {
    return {
      size: "",
      trade: "",
      pageindex: 1,
      pagesize: 20,
      sizestatus: false,
      tradestatus: false
    };
  },
  mounted() {
    // 获取模板列表
    this.getTemplateList();
    // 获取筛选条件列表
    this.getSortList();
  },
  computed: {
    ...mapState(["tempsize", "temptrade", "templatetotal"])
  },
  methods: {
    pageSizeChange(size) {
      this.pagesize = size;
      this.getTemplateList();
    },
    pageSwitch(idx) {
      this.pageindex = idx;
      this.getTemplateList();
    },
    getSortList() {
      // 获取尺寸列表
      this.$store.dispatch("getSizeTrade", "template_size");
      // 获取行业列表
      this.$store.dispatch("getSizeTrade", "template_business");
    },
    templistReset() {
      this.pageindex = 1;
      this.getTemplateList();
      // 删除列表项之后，需要重置尺寸行业列表，改变是否可删除状态
      this.getSortList();
    },
    getTemplateList() {
      let option = {
        size: this.size,
        business: this.trade,
        pageIndex: this.pageindex,
        pageSize: this.pagesize
      };

      this.$store.dispatch("getTemplateList", option);
    },
    addTemplates() {
      this.$router.push({
        name: "addtemplates"
      });
    }
  }
};
</script>

<style lang="less" scoped>
.pageswitch {
  margin-top: 20px;
  text-align: center;
  margin-bottom: 100px;
}
.contain {
  width: 1200px;
  margin: 0 auto 50px auto;
  .title {
    line-height: 60px;
    font-size: 20px;
    margin-bottom: 20px;
  }
  .ctrl {
    overflow: hidden;
    margin-bottom: 10px;
    .add {
      float: left;
    }
    .fr {
      float: right;
      margin-left: 20px;
    }
  }
}
</style>
