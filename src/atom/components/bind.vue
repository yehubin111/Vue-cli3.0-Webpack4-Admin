<template>
    <div class="bind">
        <p class="title">绑定Facebook账号</p>
        <p class="info">未绑定Facebook账号将无法使用Facebook相关功能，请先绑定</p>
        <el-button type="primary" @click="getAuth">去绑定</el-button>
    </div> 
</template>

<script>
export default {
  data() {
    return {
      
    };
  },
  methods: {
      getLongtimeToken(token){
        this.$store.dispatch('getLongToken', {token});
      },

      getAuth(){
        // Get FB Login Status
        FB.getLoginStatus( response => {
          if ( response.status === 'connected' ) {
            // 获取到token，上传到服务端申请长期token
            this.getLongtimeToken(response.authResponse.accessToken);
          } else if ( response.status === 'not_authorized' ) {
            // 申请权限
            FB.login(function(response){
              this.getLongtimeToken(response.authResponse.accessToken);
            }, {scope: 'ads_management,ads_read,manage_pages,email,business_management'});

          } else if ( response.status === 'unknown' ) {
            // 申请权限
            FB.login(function(response){
              this.getLongtimeToken(response.authResponse.accessToken);
            }, {scope: 'ads_management,ads_read,manage_pages,email,business_management'});
          }
        });
      }
  },
  mounted() {
      (function(d, s, id){
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) {return;}
        js = d.createElement(s); js.id = id;
        js.src = "//connect.facebook.net/zh_TW/sdk.js";
        fjs.parentNode.insertBefore(js, fjs);
      }(document, 'script', 'facebook-jssdk'));

      window.fbAsyncInit = function() {
        FB.init({
          appId            : '329006174266183',
          autoLogAppEvents : true,
          xfbml            : true,
          version          : 'v2.10'
        });
        FB.AppEvents.logPageView();
      };
  }
};
</script>

<style lang="less" scoped>
.bind {
  width: 1200px;
  margin: 0 auto;
  text-align: center;
  .title{
      font-size: 16px;
      text-align: center;
      line-height: 40px;
      margin-top: 100px;
  }
  .info{
      font-size: 14px;
      text-align: center;
      line-height: 40px;
      color: #999;
  }
  .el-button {
    padding: 10px 40px;
    margin-top: 15px;
    border-radius: 18px;
  }
}
</style>
