<template>
  <ul class="templist">
    <li v-for="img in tempimages" :key="img.id">
      <p class="image">
        <img :src="img.filePath" alt>
      </p>
      <el-checkbox v-model="img.select" class="select" @change="changeSelect"></el-checkbox>
    </li>
  </ul>
</template>

<script>
import { mapState } from "vuex";
export default {
  props: ["selectall", "ctrluse"],
  data() {
    return {};
  },
  computed: {
    ...mapState(["tempimages"])
  },
  methods: {
    changeSelect() {
      // 有勾选的情况下，可以用操作
      if(this.tempimages.find(v => v.select)) {
        this.$emit('update:ctrluse', true);
      } else {
        this.$emit('update:ctrluse', false);
      }
      // 没找到未选的，则为全选
      if (!this.tempimages.find(v => !v.select)) {
        this.$emit("update:selectall", true);
      } else {
        this.$emit("update:selectall", false);
      }
    }
  }
};
</script>

<style lang="less" scoped>
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
    height: 285px;
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
</style>
