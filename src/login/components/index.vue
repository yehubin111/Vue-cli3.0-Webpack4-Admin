<template>
  <div class="login">
    <p class="logo"></p>
    <login-box></login-box>
  </div>
</template>

<script>
import LoginBox from './loginbox'
export default {
  components: {
    LoginBox
  },
  created() {
    
  }
}
</script>

<style lang="less" scoped>
.login{
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  position: fixed;
  .logo{
    flex-basis: 60px;
    width: 100%;
    flex-shrink: 0;
    background: url('../assets/logo.png') center 0 no-repeat;
    background-size: auto 60px;
  }
}
</style>
