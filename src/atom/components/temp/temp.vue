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
          <el-dropdown-item command="a" :disabled="!ctrluse">下载</el-dropdown-item>
          <el-dropdown-item command="b" :disabled="!ctrluse">删除</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-button type="text" class="add" @click="selectAll">{{selectall? '取消全选': '全选'}}</el-button>
    </div>
    <temp-list :selectall.sync="selectall" :ctrluse.sync="ctrluse"></temp-list>
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
      ctrluse: false,
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
      this.ctrluse = this.selectall;
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
      let res;
      switch (type) {
        case "a":
          this.$confirm("确认打包下载所选图片吗？", "下载", {
            confirmButtonText: "下载",
            cancelButtonText: "取消",
            type: "warning"
          })
            .then(async () => {
              location.href = `/api/files/downloadZip?fileIds=${fileIds.join(",")}`;
            })
            .catch(() => {});
          break;
        case "b":
          this.$confirm("确认删除所选图片吗？", "删除", {
            confirmButtonText: "删除",
            cancelButtonText: "取消",
            type: "warning"
          })
            .then(async () => {
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
            })
            .catch(() => {});

          break;
      }
    }
  }
};
</script>
<style lang="less" scoped>
.contain {
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


