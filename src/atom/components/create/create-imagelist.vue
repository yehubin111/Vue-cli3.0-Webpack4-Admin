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
      this.$emit('change');
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
  }
}
</style>
