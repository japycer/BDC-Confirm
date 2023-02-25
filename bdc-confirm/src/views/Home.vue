<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img src="../assets/logo.png" alt="LOGO" />
        <span>不动产信息复核系统</span>
      </div>
      <el-popconfirm
        confirm-button-text="退出"
        cancel-button-text="留下"
        icon="el-icon-info"
        icon-color="red"
        placement="left"
        @confirm="confirmQuit"
        title="确保界面数据复核完成？"
      >
        <el-button slot="reference" type="info">退出</el-button>
      </el-popconfirm></el-header
    >
    <!-- 主体区域 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle-button" @click="toggleCollape">|||</div>
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409eff"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          router
          :default-active="activePath"
        >
          <el-submenu index="1">
            <template slot="title">
              <i class="iconfont icon-tijikongjian"></i>
              <span>信息复核</span>
            </template>
            <el-menu-item index="fdcq2" @click="saveNavState('/fdcq2')">
              <i class="el-icon-menu"></i>
              <span slot="title">房地产权</span>
            </el-menu-item>
            <el-menu-item index="qlr" @click="saveNavState('/qlr')">
              <i class="el-icon-menu"></i>
              <span slot="title">权利人信息</span>
            </el-menu-item>
            <el-menu-item index="zszm" @click="saveNavState('/zszm')">
              <i class="el-icon-menu"></i>
              <span slot="title">证书证明</span>
            </el-menu-item>
            <el-menu-item index="h" @click="saveNavState('/h')">
              <i class="el-icon-menu"></i>
              <span slot="title">户表</span>
            </el-menu-item>
          </el-submenu>
          <el-submenu index="2">
            <template slot="title">
              <i class="iconfont icon-baobiao"></i>
              <span>完成度统计</span>
            </template>
            <el-menu-item index="stat-today">
              <i class="el-icon-menu"></i>
              <span slot="title">今日完成统计</span>
            </el-menu-item>
            <el-menu-item index="remain">
              <i class="el-icon-menu"></i>
              <span slot="title">余量统计</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 内容区域 -->
      <el-main>
        <keep-alive include="FdcqUI, QlrUI">
          <router-view></router-view>
        </keep-alive>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {
      isCollapse: false,
      activePath: "",
    };
  },
  methods: {
    confirmQuit() {
      this.$http.get("/api/other/logout");
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
    toggleCollape() {
      this.isCollapse = !this.isCollapse;
    },
    saveNavState(activePath) {
      sessionStorage.setItem("activePath", activePath);
      this.activePath = activePath;
    },
  },
  created() {
    this.activePath = sessionStorage.getItem("activePath");
  },
};
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
}

.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #fff;
  font-size: 20px;
  > div {
    display: flex;
    align-items: center;
    span {
      margin-left: 15px;
    }
  }
}

.el-header img {
  height: 64px;
}

.el-aside {
  background-color: #333744;
  .el-menu {
    border-right: none;
  }
}

.el-main {
  background-color: #eaedf1;
}

.iconfont {
  margin-right: 15px;
}

.toggle-button {
  background-color: #4a5064;
  color: #fff;
  font-size: 10px;
  line-height: 24px;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>