<template>
  <div class="create-select">
    <div class="select-on">
      <span class="title">当前选择创意：</span>
      <span v-show="!selectCreate.creativityName">无</span>
      <div v-show="selectCreate.creativityName">
        <span class="selecthead">
          <img :src="selectCreate.image" alt>
        </span>
        <span
          class="createtitle"
          :title="selectCreate.creativityText+'（'+selectCreate.countryId+','+selectCreate.sexName+'）'"
        >{{selectCreate.creativityText}}（{{selectCreate.countryId}},{{selectCreate.sexName}}）</span>
        <span>创意ID：{{selectCreate.id}}</span>
        <span>分类：{{selectCreate.classify}}</span>
        <span class="ctrl">
          <el-button type="text" @click="setCurrent">取消</el-button>
        </span>
      </div>
    </div>
    <div class="select-sort">
      <el-input
        class="search"
        v-model="searchstate"
        placeholder="搜索创意ID"
        suffix-icon="el-icon-search"
        @input="createSearch"
      ></el-input>
      <el-select class="select" v-model="classifyselect" placeholder="分类" @change="classifyChange">
        <el-option v-for="item in classify" :key="item" :label="item" :value="item"></el-option>
      </el-select>
    </div>
    <div class="select-table">
      <el-table
        height="393"
        highlight-current-row
        @current-change="handleCurrentChange"
        :data="adcreatelist"
        :show-header="false"
        ref="singleTable"
      >
        <el-table-column prop="id" label="创意ID" width="60"></el-table-column>
        <el-table-column prop="creativityText" label="文本">
          <template
            slot-scope="scope"
          >{{scope.row.creativityText}}<el-tag size="mini" style="margin-left: 5px">{{scope.row.countryId}}</el-tag><el-tag size="mini" style="margin-left: 5px">{{scope.row.sexName}}</el-tag></template>
        </el-table-column>
        <!-- <el-table-column prop="creativityTypeName" label="类型" width="100"></el-table-column> -->
        <el-table-column prop="picture" label="缩略图" width="80">
          <template slot-scope="scope">
            <span class="headpic">
              <img :src="scope.row.image" alt>
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="classify" label="分类" width="100"></el-table-column>
      </el-table>
    </div>
    <div class="pageswitch">
      <el-pagination
        background
        layout="prev, pager, next, total"
        :total="adcreatetotal"
        :page-size="40"
        @current-change="pageSwitch"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
let tosearch;
export default {
  props: ['creativeType'],
  data() {
    return {
      classifyselect: "",
      searchstate: "",
      pageindex: 1,
      selectCreate: {}
    };
  },
  computed: {
    ...mapState(["adcreatelist", "adcreatetotal", "classify"])
  },
  methods: {
    reset() {
      this.selectCreate = {};
    },
    createSearch() {
      this.pageindex = 1;
      clearTimeout(tosearch);

      tosearch = setTimeout(() => {
        this.dataUpdata();
      }, 300);
    },
    classifyChange() {
      this.pageindex = 1;
      this.dataUpdata();
    },
    handleCurrentChange(vl) {
      // console.log(vl);
      if (vl) this.selectCreate = Object.assign({}, vl);
      this.toSelectCreate();
    },
    setCurrent(row) {
      this.$refs.singleTable.setCurrentRow(row);
      this.toSelectCreate();
    },
    toSelectCreate() {
      this.$emit('selectCreate', this.selectCreate);
    },
    dataUpdata() {
      this.$store.dispatch("getSelectCreateList", {
        creativityType: this.creativeType,
        creativityName: this.searchstate,
        classify: this.classifyselect == "不限" ? "" : this.classifyselect,
        pageIndex: this.pageindex,
        projectId: this.$route.params.id
      });
    },
    pageSwitch(page) {
      this.pageindex = page;
      this.dataUpdata();
    }
  },
  watch: {
    creativeType(n, o){
      this.pageindex = 1;
      this.dataUpdata();
    }
  }
};
</script>

<style lang="less" scoped>
.create-select {
  height: 100%;
  // display: flex;
  flex-direction: column;
  .select-on {
    // flex-basis: 45px;
    margin-bottom: 10px;
    display: block;
    width: 100%;
    overflow: hidden;
    span {
      // color: #999;
      float: left;
      margin-right: 20px;
      // display: inline-block;
      white-space: pre-wrap;
      &.title {
        margin-right: 10px;
      }
      &.selecthead {
        margin-right: 10px;
      }
      &.ctrl {
        margin-right: 0;
      }
      &.createtitle {
        max-width: 280px;
        word-break: break-all;
        overflow: hidden;
        text-overflow: ellipsis;
        height: 40px;
        white-space: nowrap;
      }
    }
  }
  .select-sort {
    margin-bottom: 10px;
    display: flex;
    .search {
      margin-right: 10px;
    }
    .select {
    }
  }
  .select-table {
    // flex-grow: 1;
    display: block;
    overflow-y: auto;
    border: 1px solid #e5e5e5;
  }
}

.selecthead,
.headpic {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  display: block;
  background-color: #f5f5f5;
  img {
    width: 100%;
    height: 100%;
  }
}
.selecthead {
  display: inline-block;
}
.pageswitch {
  text-align: center;
  margin-top: 20px;
  margin-bottom: 20px;
}
</style>
<style>
.select-table .el-table__row{
  cursor: pointer;
}
</style>
