<template>
  <div>
    <el-container class="container">
      <!-- 头部 -->
      <el-header>
        <el-row>
          <el-col :span="4">
            <div class="grid-content bg-purple" :model="form">              
              <img class="logoImg" src="../../assets/logo.png" alt="" />             
                <span class="username">欢迎您，{{form.currentUser}}</span>            
            </div>
          </el-col>
          <el-col :span="18"
            ><div class="grid-content bg-purple-light">
              电商后台管理系统
            </div></el-col
          >
          <el-col :span="2">
            <div class="grid-content bg-purple">
              <a class="logout" @click.prevent="handleLogout()" href="#">退出</a>
            </div>
          </el-col>
        </el-row>
      </el-header>
      <el-container>
        <!-- 侧边栏 -->
        <el-aside width="190px">
          <el-menu :router="true" :unique-opened="true">
            <el-submenu index="1">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>用户管理</span>
              </template>
              <el-menu-item index="users">
                <i class="el-icon-s-custom"></i>
                <span>用户列表</span>
              </el-menu-item>
            </el-submenu>
            <el-submenu index="2">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>权限管理</span>
              </template>
              <el-menu-item index="role">角色列表</el-menu-item>
              <el-menu-item index="privilege">权限列表</el-menu-item>
            </el-submenu>
            <el-submenu index="3">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>商品管理</span>
              </template>
              <el-menu-item index="goods">商品列表</el-menu-item>
              <el-menu-item index="params">分类参数</el-menu-item>
              <!-- <el-menu-item index="3-3">商品分类</el-menu-item> -->
            </el-submenu>
            <el-submenu index="4">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>订单管理</span>
              </template>
              <el-menu-item index="orders">订单列表</el-menu-item>
            </el-submenu>
            
          </el-menu>
        </el-aside>
        <!-- 内容 -->
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  data(){
    return{
      form:{
        currentUser:''
      }      
    }
  },
  beforeCreate(){
    // 获取token
    const token = localStorage.getItem('token')
    // 没有token说明未登录，即跳转到登录页
    if (!token) {
      this.$router.push({name:'login'})
    }
  },
  created(){
    this.getCurrentUser()
  },
  methods:{
    // 退出登录
    handleLogout(){
      // 清除token
      localStorage.clear()
      this.$message.success('退出成功')
      this.$router.push({name:'login'})
    },
    // 获取当前登录的用户名并显示
    getCurrentUser(){
      this.form.currentUser = localStorage.getItem('currentUser')
    }
    
  }
};
</script>

<style>
.container{
  width: 100%;
  height: 100%;
  position: absolute;
}
.el-header{
  background-color: #b3c0d1;
  color: #fff;
  font-size: 20px;
  text-align: center;
  line-height: 60px;
  padding: 0;
}

.el-aside {
  background-color: #d3dce6;
  color: #333;
}

.el-main {
  background-color: #e9eef3;
  color: #333;
}

/* 头部样式 */
.logoImg {
  width: 50px;
  height: 50px;
  vertical-align: middle;
}
.username{
  font-size: 16px;
}
.logout {
  text-decoration: none;
  font-size: 16px;
}
/* 侧边栏 */
.el-submenu .el-menu-item {
    min-width: 190px;
}
</style>