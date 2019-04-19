<template>
  <div>
    <ul class="templist">
      <li>
        <p class="image">
          <img
            src="http://172.31.1.45/file/image/2019/01/21/a2a167f0-4220-4d52-9abe-f2c9e1d3f7a4.jpg"
            alt
          >
        </p>
        <el-checkbox v-model="checked" class="select"></el-checkbox>
      </li>
      <li>
        <p class="image">
          <img
            src="http://172.31.1.45/file/image/2019/01/21/a2a167f0-4220-4d52-9abe-f2c9e1d3f7a4.jpg"
            alt
          >
        </p>
        <el-checkbox v-model="checked" class="select"></el-checkbox>
      </li>
      <li>
        <p class="image">
          <img
            src="http://172.31.1.45/file/image/2019/01/21/a2a167f0-4220-4d52-9abe-f2c9e1d3f7a4.jpg"
            alt
          >
        </p>
        <el-checkbox v-model="checked" class="select"></el-checkbox>
      </li>
      <li>
        <p class="image">
          <img
            src="http://172.31.1.45/file/image/2019/01/21/a2a167f0-4220-4d52-9abe-f2c9e1d3f7a4.jpg"
            alt
          >
        </p>
        <el-checkbox v-model="checked" class="select"></el-checkbox>
      </li>
      <li>
        <p class="image">
          <img
            src="http://172.31.1.45/file/image/2019/01/21/a2a167f0-4220-4d52-9abe-f2c9e1d3f7a4.jpg"
            alt
          >
        </p>
        <el-checkbox v-model="checked" class="select"></el-checkbox>
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
        :total="total"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
export default {
    data() {
        return {
            pageindex: 1,
            pagesize: 20,
            total: 30
        }
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
.pageswitch{
    text-align: center;
    margin-bottom: 100px;
}
</style>
