<template>
  <el-dialog title="选择图片" :visible="status" @close="toCancel" class="imgdialog">
    <ul class="templist">
      <li v-for="(img,index) in tempimages" :key="img.id" @click="singleSelect(img)" :class="{singleselect: !multiple}">
        <p class="image">
          <img :src="img.filePath" alt>
        </p>
        <el-checkbox v-if="multiple" v-model="img.select" class="select" @change="selectChange"></el-checkbox>
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
    <div class="selectctrl" v-if="multiple">
      <span>已选0/{{tempimagestotal}}</span>
      <p>
        <el-button @click="toCancel">取消</el-button>
        <el-button type="primary" @click="toSelect">确定</el-button>
      </p>
    </div>
  </el-dialog>
</template>

<script>
import { mapState } from "vuex";
export default {
  components: {},
  props: {
    status: {
      type: Boolean,
      required: true
    },
    multiple: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      pageindex: 1,
      pagesize: 20,
      selectall: false,
      ctrluse: false,
      select: [],
      selectcount: 0
    };
  },
  computed: {
    ...mapState(["tempimagestotal", "tempimages"])
  },
  watch: {
    status(n, o) {
      if (n) {
        this.$store.dispatch("getTempImages", {
          pageIndex: this.pageindex,
          pageSize: this.pagesize
        });
      }
    }
  },
  methods: {
    selectChange() {
      this.select = this.tempimages.filter(v => v.select);
      this.selectcount = this.select.length;
    },
    singleSelect(img) {
      if(this.multiple) 
        return;
      this.$emit("select", [img]);
      this.toCancel();
    },
    pageSizeChange() {},
    pageSwitch() {},
    toCancel() {
      this.$emit("update:status", false);
      this.toReset();
    },
    toReset() {
      this.pageindex = 1;
      this.pagesize = 20;
      this.select = [];
    },
    toSelect() {
      this.$emit("select", this.select);
      this.toCancel();
    }
  }
};
</script>

<style lang="less">
.imgdialog {
  .el-dialog {
    width: 70%;
  }
}
</style>
<style lang="less" scoped>
.pageswitch {
  text-align: right;
  margin-bottom: 20px;
}
.selectctrl {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.templist {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  // grid-template-rows: 1fr 1fr 1fr 1fr;
  grid-gap: 20px;
  margin-bottom: 50px;
  li {
    border: 1px solid #ddd;
    overflow: hidden;
    position: relative;
    height: 185px;
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
    &.singleselect{
      cursor: pointer;
    }
  }
}
</style>

