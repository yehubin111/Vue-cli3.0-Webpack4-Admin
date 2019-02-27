<template>
  <el-table
    id="dataTable"
    ref="dataCard"
    @sort-change="sortChange"
    :data="videomatterlist"
    style="width: 960px"
    show-summary
    :summary-method="getSummaries"
  >
    <el-table-column prop="materialId" fixed label="FB视频编号" width="160"></el-table-column>
    <el-table-column prop="materialUrl" label="视频" width="120">
      <template slot-scope="scope">
        <div class="imageline">
          <span class="headpic">
            <img :src="scope.row.materialUrl" alt @click="showBig(scope.row.materialId)">
          </span>
          <i
            class="el-icon-download download"
            @click="downloadFile(scope.row.materialId)"
            v-show="scope.row.materialUrl"
          ></i>
        </div>
      </template>
    </el-table-column>
    <el-table-column prop="reachNum" label="触达" sortable="custom" width="90"></el-table-column>
    <el-table-column prop="showNum" label="展示" sortable="custom" width="90"></el-table-column>
    <el-table-column prop="clicksNum" label="点击" sortable="custom" width="90"></el-table-column>
    <el-table-column prop="ctr" label="CTR" sortable="custom" width="90"></el-table-column>
    <el-table-column prop="cvr" label="CVR" sortable="custom" width="90"></el-table-column>
    <el-table-column prop="cpm" label="CPM" sortable="custom" width="90"></el-table-column>
    <el-table-column prop="cpc" label="CPC" sortable="custom" width="90"></el-table-column>
    <el-table-column prop="relevanceScore" label="相关度" sortable="custom" width="90"></el-table-column>
    <el-table-column prop="installsNum" label="安装" sortable="custom" width="90"></el-table-column>
    <el-table-column prop="spend" label="花费" sortable="custom" width="90"></el-table-column>
    <el-table-column prop="cpi" label="CPI" sortable="custom" width="90"></el-table-column>
  </el-table>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import { Loading } from "element-ui";
import { Msgwarning } from "../../js/message";
export default {
  data() {
    return {};
  },
  mounted() {},
  methods: {
    downMatter() {
      let urlArr = this.videomatterlist.map(v => v.materialId);
      console.log(urlArr);

      for(let i = 1;i<urlArr.length;i++) {
        let v = urlArr[i];
        if (v) {
          let res = await this.$store.dispatch("getVideoLink", v);
          await this.$fileDownload(res.data);
        }
      }
    },
    async showBig(id) {
      // 先获取视频地址
      let res = await this.$store.dispatch("getVideoLink", id);
      window.open(res.data);
    },
    async downloadFile(id) {
      //   let loading = Loading.service({ fullscreen: true });
      Msgwarning("视频素材正在下载中...");
      // 先获取视频地址
      let res = await this.$store.dispatch("getVideoLink", id);
      let down = await this.$fileDownload(res.data);
      //   loading.close();
    },
    sortChange({ column, prop, order }) {
      let sort = "";
      switch (prop) {
        case "reachNum":
          if (order == "ascending") sort = "reach_num asc";
          else sort = "reach_num desc";
          break;
        case "showNum":
          if (order == "ascending") sort = "show_num asc";
          else sort = "show_num desc";

          break;
        case "clicksNum":
          if (order == "ascending") sort = "clicks_num asc";
          else sort = "clicks_num desc";
          break;
        case "ctr":
          if (order == "ascending") sort = "ctr asc";
          else sort = "ctr desc";
          break;
        case "cvr":
          if (order == "ascending") sort = "cvr asc";
          else sort = "cvr desc";

          break;
        case "cpm":
          if (order == "ascending") sort = "cpm asc";
          else sort = "cpm desc";
          break;
        case "cpc":
          if (order == "ascending") sort = "cpc asc";
          else sort = "cpc desc";
          break;
        case "relevanceScore":
          if (order == "ascending") sort = "relevance_score asc";
          else sort = "relevance_score desc";

          break;
        case "installsNum":
          if (order == "ascending") sort = "installs_num asc";
          else sort = "installs_num desc";
          break;
        case "spend":
          if (order == "ascending") sort = "spend asc";
          else sort = "spend desc";
          break;
        case "cpi":
          if (order == "ascending") sort = "cpi asc";
          else sort = "cpi desc";

          break;
      }

      this.$emit("tableSort", sort);
    },
    getSummaries(param) {
      let { columns, data } = param;
      let sums = [];
      let keyarr = [
        "reachNum",
        "showNum",
        "clicksNum",
        "ctr",
        "cvr",
        "cpm",
        "cpc",
        "relevanceScore",
        "installsNum",
        "spend",
        "cpi"
      ];
      columns.forEach((column, index) => {
        switch (index) {
          case 0:
            sums[index] = "合计";
            break;
          case 1:
            sums[index] = "";
            break;
          default:
            sums[index] = this.videomattersum[keyarr[index - 2]];
            break;
        }
      });

      return sums;
    }
  },
  computed: {
    ...mapState(["videomatterlist", "videomattersum"])
  }
};
</script>

<style lang="less" scoped>
.imageline {
  display: flex;
  align-content: center;
  .headpic {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    overflow: hidden;
    display: inline-block;
    background-color: #f5f5f5;
    position: relative;
    margin-right: 10px;
    flex-basis: 60px;
    flex-shrink: 0;
    img {
      // width: 100%;
      position: absolute;
      left: 50%;
      transform: translate(-50%, 0);
      height: 100%;
      cursor: pointer;
    }
  }
  .download {
    line-height: 60px;
    color: #3297ff;
    font-size: 20px;
    font-weight: bold;
    cursor: pointer;
  }
}
</style>
