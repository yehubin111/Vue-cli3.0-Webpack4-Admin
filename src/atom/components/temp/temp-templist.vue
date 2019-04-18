<template>
  <ul class="templist">
    <li>
      <p class="image">
        <img
          src="http://172.31.1.45/file/image/2019/01/21/e9903413-1837-4a21-b15c-2885679dbf14.jpg"
          alt
        >
      </p>
    </li>
    <li></li>
    <li></li>
    <li></li>
    <li></li>
  </ul>
</template>

<script>
export default {};
</script>

<style lang="less" scoped>
.templist {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr 1fr 1fr;
  grid-gap: 20px;
  height: 1000px;
  li {
    border: 1px solid #ddd;
    .image{
        width: 100%;
        img{
            width: 100%;
        }
    }
  }
}
</style>
