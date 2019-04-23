<template>
  <div class="contain">
    <el-breadcrumb class="title" separator=">">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>模板制图</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="ctrl">
      <el-button class="add" type="primary" @click="toCreateImage">制作图片</el-button>
      <el-dropdown class="add" split-button type="primary" @command="templateCtrl">
        批量
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="a">下载</el-dropdown-item>
          <el-dropdown-item command="b">删除</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-button type="text" class="add" @click="selectAll">{{selectall? '取消全选': '全选'}}</el-button>
    </div>
    <temp-list :selectall.sync="selectall"></temp-list>
    <div class="pageswitch">
      <el-pagination
        @size-change="pageSizeChange"
        @current-change="pageSwitch"
        :current-page="pageindex"
        :page-sizes="[20, 50, 80]"
        :page-size="pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="tempimagestotal"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import TempList from "./temp-templist";
import exportTemplate from "@/atom/js/imageTemplate";
import { mapState } from "vuex";
import { Msgsuccess, Msgerror } from "@/atom/js/message";
import { Msgwarning } from "../../js/message";
export default {
  components: {
    TempList
  },
  data() {
    return {
      createstatus: true,
      selectall: false,
      pageindex: 1,
      pagesize: 20
    };
  },
  mounted() {
    this.getData();
  },
  watch: {},
  computed: {
    ...mapState(["tempimages", "tempimagestotal"])
  },
  methods: {
    selectAll() {
      this.selectall = !this.selectall;
      this.tempimages.forEach(v => {
        v.select = this.selectall;
      });
    },
    pageSizeChange(size) {
      this.pagesize = size;
      this.getData();
    },
    pageSwitch(index) {
      this.pageindex = index;
      this.getData();
    },
    getData() {
      this.$store.dispatch("getTempImages", {
        pageIndex: this.pageindex,
        pageSize: this.pagesize
      });
    },
    toCreateImage() {
      this.$router.push({
        name: "createtemp"
      });
    },
    async templateCtrl(type) {
      let fileIds = this.tempimages.filter(v => v.select).map(v => v.id);
      if (fileIds.length == 0) {
        Msgwarning("请先选择模板");
        return;
      }
      let res;
      switch (type) {
        case "a":
          res = await this.$store.dispatch("downloadTempImages", {
            fileIds: fileIds.join(",")
          });
          if (res && res.data) {
            Msgsuccess("正在下载...");
          } else {
            Msgerror("下载失败");
          }
          break;
        case "b":
          res = await this.$store.dispatch("deleteTempImages", {
            fileIds: fileIds.join(",")
          });
          if (res && res.data) {
            Msgsuccess("删除成功");
            this.pageindex = 1;
            this.getData();
          } else {
            Msgerror("删除失败");
          }
          break;
      }
    }
  }
};
</script>
<style lang="less" scoped>
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
    margin-bottom: 30px;
    .add {
      float: left;
      margin-right: 20px;
    }
    .search {
      float: right;
      width: 250px;
    }
  }
  .pageswitch {
    text-align: center;
    margin-bottom: 100px;
  }
}
</style>


