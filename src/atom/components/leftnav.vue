<template>
  <el-col :span="12" class="elcol">
    <el-menu default-active="0" :router="true" class="el-menu-vertical-demo">
      <el-menu-item :index="'/project/' + $route.params.id + '/ad'" class="specialitem">
        <i class="el-icon-menu"></i>
        <span slot="title" class="theme">广告管理</span>
      </el-menu-item>
      <el-submenu index="1">
        <template slot="title">
          <i class="el-icon-location"></i>
          <span class="theme">推广计划</span>
        </template>
        <el-menu-item-group>
          <el-menu-item class="lstitle" :index="'/project/' + $route.params.id + '/plan'">推广计划管理</el-menu-item>
          <el-menu-item class="lstitle" :index="'/project/' + $route.params.id + '/gener/1'">创建推广计划</el-menu-item>
        </el-menu-item-group>
      </el-submenu>
      <el-menu-item :index="'/project/' + $route.params.id + '/target'" class="specialitem">
        <i class="el-icon-location-outline"></i>
        <span slot="title" class="theme">受众管理</span>
      </el-menu-item>
      <el-submenu index="3">
        <template slot="title">
          <i class="el-icon-edit"></i>
          <span class="theme">创意库&nbsp;&nbsp;&nbsp;&nbsp;</span>
        </template>
        <el-menu-item-group>
          <el-menu-item class="lstitle" :index="'/project/' + $route.params.id + '/create'">创意管理</el-menu-item>
          <el-menu-item class="lstitle" :index="'/project/' + $route.params.id + '/sync'">同步记录</el-menu-item>
          <el-menu-item class="lstitle" :index="'/project/' + $route.params.id + '/createform'">创意报表</el-menu-item>        
        </el-menu-item-group>
      </el-submenu>
      <el-submenu index="4">
        <template slot="title">
          <i class="el-icon-setting"></i>
          <span class="theme">规则引擎</span>
        </template>
        <el-menu-item-group>
          <el-menu-item class="lstitle" :index="'/project/' + $route.params.id + '/rule'">规则管理</el-menu-item>
          <el-menu-item class="lstitle" :index="'/project/' + $route.params.id + '/optimize'">优化记录</el-menu-item>
        </el-menu-item-group>
      </el-submenu>
      <el-submenu index="5">
        <template slot="title">
          <i class="el-icon-document"></i>
          <span class="theme">数据报表</span>
        </template>
        <el-menu-item-group>
          <!-- <el-menu-item class="lstitle" index="5-1" disabled>尽请期待</el-menu-item> -->
          <el-menu-item class="lstitle" :index="'/project/' + $route.params.id + '/data'">账户报表</el-menu-item>
          <!-- <el-menu-item class="lstitle" :index="'/project/' + $route.params.id + '/adform'">广告报表</el-menu-item> -->
          <el-menu-item class="lstitle" :index="'/project/' + $route.params.id + '/daycpi'">每日CPI</el-menu-item>
        </el-menu-item-group>
      </el-submenu>
    </el-menu>
  </el-col>
</template>

<script>
export default {};
</script>

<style lang="less" scoped>
.elcol {
  width: 100%;
}
.theme {
  font-weight: bold;
}
.el-menu-item-group__title {
  display: none;
}
.el-submenu {
  .lstitle {
    // color: #666;
    padding: 0;
    a {
      // display: block;
      padding-right: 40px;
      // color: #666;
    }
  }
}
</style>
