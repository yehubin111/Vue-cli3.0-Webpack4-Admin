<template>
  <div>
    <ul class="templist">
      <li v-for="img in tempimages" :key="img.id">
        <p class="image">
          <img :src="img.filePath" alt>
        </p>
        <el-checkbox v-model="img.select" class="select"></el-checkbox>
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
        :total="tempimagestotal"
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
      pagesize: 20
    };
  },
  computed: {
    ...mapState(["tempimages", "tempimagestotal"])
  },
  methods: {
    pageSizeChange() {},
    pageSwitch() {}
  }
};
</script>

<style lang="less" scoped>
.templist {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr 1fr 1fr;
  grid-gap: 20px;
  height: 1200px;
  li {
    border: 1px solid #ddd;
    overflow: hidden;
    position: relative;
    .image {
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100%;
      img {
        width: 100%;
        display: block;
      }
    }
    .select {
      position: absolute;
      right: 10px;
      top: 7px;
    }
  }
}
.pageswitch {
  text-align: center;
  margin-bottom: 100px;
}
</style>
