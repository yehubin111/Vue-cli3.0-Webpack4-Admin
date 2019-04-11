<template>
  <div class="ad">
    <el-breadcrumb class="title" separator=">">
      <el-breadcrumb-item>项目{{projectname}}</el-breadcrumb-item>
      <el-breadcrumb-item>素材报表</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="ctrlbutton">
      <el-select
        class="select"
        v-model="form.value1"
        filterable
        multiple
        collapse-tags
        placeholder="广告账户"
        no-data-text="无数据，请输入或者改变关键字"
        @change="toSort"
      >
        <el-option
          v-for="item in adaccountlist"
          :key="item.fbId"
          :label="item.name + (item.fbId != -1?'('+item.fbId+')':'')"
          :value="item.fbId"
        ></el-option>
      </el-select>
      <p class="download">
        <span @click="outTable">导出全部
          <svg-icon svgname="save" svgclass="save"></svg-icon>
        </span>
      </p>
      <el-date-picker
        class="datar"
        v-model="form.value8"
        type="daterange"
        range-separator="至"
        :clearable="false"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        @change="toSort"
      ></el-date-picker>
    </div>
    <div class="advanceCtr">
      <el-select
        class="select"
        v-model="form.value4"
        filterable
        multiple
        collapse-tags
        placeholder="年龄"
        @change="toSort"
      >
        <el-option v-for="item in dataage" :key="item" :label="item" :value="item"></el-option>
      </el-select>
      <el-select
        class="select"
        v-model="form.value5"
        filterable
        multiple
        collapse-tags
        placeholder="性别"
        @change="toSort"
      >
        <el-option v-for="item in datasex" :key="item.code" :label="item.name" :value="item.code"></el-option>
      </el-select>
    </div>
    <div class="tablist">
      <span class="downmatter" @click="downMatter">下载当页素材</span>
      <el-tabs v-model="activeName" class="activeName" type="card" @tab-click="handleClick">
        <el-tab-pane label="图片" name="first">
          <div class="list">
            <image-list ref="imageList" @tableSort="tableSort"></image-list>
          </div>
          <div class="pageswitch">
            <el-pagination
              background
              @size-change="pageSizeChange"
              :page-sizes="[20, 200, 500]"
              layout="total, sizes, prev, pager, next, jumper"
              :current-page="pageindex"
              :total="imagemattertotal"
              :page-size="pagesize"
              @current-change="pageSwitch"
            ></el-pagination>
          </div>
        </el-tab-pane>
        <el-tab-pane label="视频" name="second">
          <div class="list">
            <video-list ref="videoList" @tableSort="tableSort"></video-list>
          </div>
          <div class="pageswitch">
            <el-pagination
              background
              @size-change="pageSizeChange"
              :page-sizes="[20, 200, 500]"
              layout="total, sizes, prev, pager, next, jumper"
              :current-page="pageindex"
              :total="videomattertotal"
              :page-size="pagesize"
              @current-change="pageSwitch"
            ></el-pagination>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import ImageList from "./matterform-imagelist";
import VideoList from "./matterform-videolist";
import { mapState, mapMutations } from "vuex";
import { Msgwarning } from "../../js/message";
let search;
let moreoption;
export default {
  data() {
    return {
      state: "",
      sort: "",
      cardname: "first",
      activeName: "first",
      form: {
        value1: [],
        value2: [],
        value4: [],
        value5: [],
        value8: [
          new Date().setDate(new Date().getDate() - 1),
          new Date().setDate(new Date().getDate() - 1)
        ]
      },
      pageindex: 1,
      pagesize: 20,
      datasex: [
        {
          name: "全部",
          code: "0"
        },
        {
          name: "男",
          code: "1"
        },
        {
          name: "女",
          code: "2"
        }
      ]
    };
  },
  components: {
    ImageList,
    VideoList
  },
  mounted() {
    let projectId = this.$route.params.id;
    this.$store.dispatch("getCondition", { projectId });

    let option = {
      pageNo: 1,
      pageSize: 20,
      projectId: this.$route.params.id,
      endDate: this.$timeFormat(this.form.value8[1], "yyyy-MM-dd"),
      startDate: this.$timeFormat(this.form.value8[0], "yyyy-MM-dd"),
      materialType: 0 // 素材类型 0图片 1视频
    };

    this.$store.dispatch("getMatterList", { option });

    this.$store.dispatch("getAdaccount", projectId);
  },
  methods: {
    ...mapMutations(["SETSTATE"]),
    downMatter() {
      if(this.activeName == 'first') {
        this.$refs.imageList.downMatter();
      } else {
        this.$refs.videoList.downMatter();
      }
    },
    handleClick(card) {
      console.log(card.name);
      this.cardname = card.name;
      /**
       * 切换的时候清空排序条件
       */
      this.sort = "";

      if (this.cardname == "first") {
        this.SETSTATE({ k: "videomatterlist", v: [] });
        // 删除排序
        this.$refs.imageList.$refs.dataForm.clearSort();
      } else {
        this.SETSTATE({ k: "imagematterlist", v: [] });
        // 删除排序
        this.$refs.videoList.$refs.dataCard.clearSort();
      }

      this.toGetdata();
    },
    clearArr(k) {
      let v = [];
      this.SETSTATE({ k, v });
    },
    // searchAccount(kword) {
    //   let accountKeyword = kword;
    //   clearTimeout(moreoption);

    //   moreoption = setTimeout(() => {
    //     this.$store.dispatch("getOptionMore", {
    //       projectId: this.$route.params.id,
    //       accountKeyword
    //     });
    //   }, 300);
    // },
    tableSort(sort) {
      this.sort = sort;
      this.toGetdata();
    },
    pageSizeChange(size) {
      this.pagesize = size;

      this.toGetdata();
    },
    outTable() {
      let option = {
        ageList: this.form.value4.join(","),
        endDate: this.$timeFormat(this.form.value8[1], "yyyy-MM-dd"),
        fbAdAccountIdList: this.form.value1.join(","),
        fbAdCreativeIdList: "",
        fbAppId: "",
        flag: "",
        genderList: this.form.value5.join(","),
        insightDate: "",
        orderByClause: this.sort,
        pageNo: 1,
        startDate: this.$timeFormat(this.form.value8[0], "yyyy-MM-dd"),
        accountKeyword: "",
        campainKeyword: "",
        creativeKeyword: this.state,
        projectId: this.$route.params.id
      };

      let name = "";

      if (this.cardname == "first") {
        option.materialType = 0; // 素材类型 0图片 1视频
        option.pageSize = this.imagemattertotal;
        name = `${this.projectname}图片素材报表${this.$timeFormat(
          new Date(),
          "yyyyMMddHHmmss"
        )}`;
      } else {
        option.materialType = 1; // 素材类型 0图片 1视频
        option.pageSize = this.videomattertotal;
        name = `${this.projectname}视频素材卡片${this.$timeFormat(
          new Date(),
          "yyyyMMddHHmmss"
        )}`;
      }
      this.$store.dispatch("getMatterList", { option, name });
    },
    toSort() {
      this.pageindex = 1;

      this.toGetdata();
    },
    toGetdata() {
      console.log(this.form);
      let option = {
        ageList: this.form.value4.join(","),
        endDate: this.$timeFormat(this.form.value8[1], "yyyy-MM-dd"),
        fbAdAccountIdList: this.form.value1.join(","),
        fbAdCreativeIdList: "",
        fbAppId: "",
        flag: "",
        genderList: this.form.value5.join(","),
        insightDate: "",
        orderByClause: this.sort,
        pageNo: this.pageindex,
        pageSize: this.pagesize,
        startDate: this.$timeFormat(this.form.value8[0], "yyyy-MM-dd"),
        accountKeyword: "",
        campainKeyword: "",
        creativeKeyword: this.state,
        projectId: this.$route.params.id
      };

      if (this.cardname == "first"){
        option.materialType = 0; // 素材类型 0图片 1视频
      } else {
        option.materialType = 1;
      }
      this.$store.dispatch("getMatterList", { option });
    },
    dataSearch() {
      let self = this;

      this.pageindex = 1;

      clearTimeout(search);
      search = setTimeout(() => {
        self.toGetdata();
      }, 300);
    },
    pageSwitch(page) {
      this.pageindex = page;

      this.toGetdata();
    }
  },
  computed: {
    ...mapState([
      "itemlist",
      // "adaccount",
      "adaccountlist",
      "adcampaign",
      "dataage",
      "imagemattertotal",
      "videomattertotal"
    ]),
    projectname() {
      if (this.itemlist.length == 0) return;
      return this.itemlist.find(v => v.id == this.$route.params.id).projectName;
    }
  }
};
</script>

<style lang="less">
.maxcount {
  line-height: 36px;
  text-align: center;
  color: #999;
  font-size: 12px;
}
.ctrlbutton {
  .select {
    .el-tag {
      position: relative;
      padding-right: 20px;
      span {
        max-width: 100px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        display: inline-block;
      }
      i {
        background-color: #c0c4cc;
        right: 3px;
        top: 5px;
        color: #fff;
        position: absolute;
      }
    }
  }
}
</style>

<style lang="less" scoped>
.ad {
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
  .activeName {
    margin-left: 40px;
  }
  .tablist{
    position: relative;
    .downmatter{
      position: absolute;
      font-size: 14px;
      line-height: 40px;
      left: 200px;
      color: #3297ff;
      cursor: pointer;
      z-index: 90;
    }
  }
  .advanceCtr {
    margin-left: 40px;
    overflow: hidden;
    margin-bottom: 10px;
    display: flex;
    .select {
      flex-basis: 300px;
      margin-right: 15px;
    }
    .selectmul {
      //   flex-basis: 280px;
      flex: 1;
      margin-right: 15px;
    }
    .selectspe{
      margin-right: 0;
    }
  }
  .ctrlbutton {
    margin-left: 40px;
    overflow: hidden;
    margin-bottom: 10px;
    .datar {
      float: right;
      width: 360px;
      flex-grow: 1;
    }
    .select {
      float: left;
      width: 240px;
      margin-right: 20px;
    }
    .advanceSelect {
      float: left;
      margin-right: 20px;
    }
    .search {
      float: right;
      width: 200px;
      //   margin-left: 20px;
    }
    .selectr {
      width: 100px;
      margin-left: 20px;
      float: right;
    }
    .rollswitch {
      float: right;
      margin-top: 10px;
      margin-right: 10px;
    }
    .download {
      font-size: 14px;
      color: #3297ff;
      text-align: right;
      float: left;
      line-height: 20px;
      margin-bottom: 5px;
      span {
        position: relative;
        padding-right: 24px;
        display: inline-block;
        cursor: pointer;
        line-height: 40px;
        .save {
          width: 16px;
          height: 16px;
          position: absolute;
          right: 0;
          top: 12px;
          cursor: pointer;
        }
      }
    }
  }
  .list {
    // margin-left: 40px;
    // width: 960px;
  }
  .pageswitch {
    text-align: center;
    margin-top: 20px;
    margin-bottom: 50px;
  }
}
</style>
