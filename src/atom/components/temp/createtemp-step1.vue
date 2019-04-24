<template>
  <div class="contain">
    <div class="sort">
      <p>
        <span class="title">尺寸</span>
        <el-radio-group v-model="size" @change="sortChange">
          <el-radio :label="size.name" v-for="size in tempsize" :key="size.name">{{size.name}}</el-radio>
        </el-radio-group>
      </p>
      <p>
        <span class="title">行业</span>
        <el-radio-group v-model="trade" @change="sortChange">
          <el-radio :label="trade.name" v-for="trade in temptrade" :key="trade.name">{{trade.name}}</el-radio>
        </el-radio-group>
      </p>
    </div>
    <ul class="templatelist">
      <li v-for="temp in templatelist" :key="temp.id" @click="selectTemp(temp.id)">
        <p class="image">
          <img :src="temp.coverImage" alt>
        </p>
        <p class="tip">
          <el-tag v-for="tag in temp.label.split(',')" :key="tag" class="tag" size="medium">{{tag}}</el-tag>
        </p>
      </li>
    </ul>
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
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      pageindex: 1,
      pagesize: 20,
      size: "",
      trade: ""
    };
  },
  methods: {
    selectTemp(id) {
      this.$emit('selectTemp', id);
    },
    pageSizeChange(size) {
      this.pagesize = size;
      this.getTemplateList();
    },
    pageSwitch(idx) {
      this.pageindex = idx;
      this.getTemplateList();
    },
    sortChange() {
      this.pageindex = 1;
      this.getTemplateList();
    },
    getTemplateList() {
      let option = {
        size: this.size,
        business: this.trade,
        pageIndex: this.pageindex,
        pageSize: this.pagesize
      };

      this.$store.dispatch("getTemplateList", option);
    }
  },
  computed: {
    ...mapState(["templatelist", "templatetotal", "tempsize", "temptrade"])
  },
  watch: {
  },
  async mounted() {
    // 获取尺寸列表
    await this.$store.dispatch("getSizeTrade", "template_size");
    // 获取行业列表
    await this.$store.dispatch("getSizeTrade", "template_business");

    this.size = this.tempsize[0].name;
    this.trade = this.temptrade[0].name;
    // 获取模板列表
    this.getTemplateList();
  }
};
</script>

<style lang='less' scoped>
.contain{
  width: 1200px;
  margin: 0 auto;
}
.sort {
  margin-bottom: 20px;
  overflow: hidden;
  p {
    margin-bottom: 20px;
    span {
      font-size: 14px;
      color: #999;
      margin-right: 30px;
      line-height: 30px;
      padding: 0 10px;
      &.title {
        color: #000;
        margin-right: 30px;
      }
      &.sel {
        cursor: pointer;
      }
      &.on {
        color: #409eff;
      }
    }
  }
}
.templatelist {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  // grid-template-rows: 1fr 1fr 1fr 1fr;
  grid-gap: 20px;
  // height: 1200px;
  margin-bottom: 50px;
  li {
    border: 1px solid #ddd;
    overflow: hidden;
    position: relative;
    display: flex;
    flex-direction: column;
    cursor: pointer;
    height: 285px;
    .image {
      flex-grow: 1;
      width: 100%;
      height: 100%;
      background-color: #f4f4f4;
      display: flex;
      align-items: center;
      justify-content: center;
      img {
        width: 100%;
        display: block;
      }
    }
    .tip {
      flex-basis: 60px;
      display: flex;
      align-items: center;
      .tag {
        margin-left: 10px;
      }
    }
  }
}
.pageswitch {
  text-align: center;
  margin-bottom: 100px;
}
</style>
