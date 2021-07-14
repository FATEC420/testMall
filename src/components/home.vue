<template>
  <el-container class="home-container">
    <el-header>
      <div>
        <img src="../assets/mm.jpg" alt="" />
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <el-container>
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle-button" @click="toggleC">|||</div>
        <!-- 侧边栏菜单 -->
        <el-menu
          :collapse-transition="false"
          :collapse="isCollapse"
          :unique-opened="true"
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409eff"
          router
          :default-active="activePath"
        >
          <!-- 一级菜单 -->
          <el-submenu v-for="it in menulist" :index="it.id + ''" :key="it.id">
            <!-- 一级菜单模板区域 -->
            <template slot="title">
              <!-- 图标 -->
              <i :class="icons[it.id]"></i>
              <!-- 文本 -->
              <span>{{ it.authName }}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item
              v-for="item in it.children"
              :index="'/' + item.path"
              :key="item.id"
              @click="saveNavState('/' + item.path)"
            >
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-menu"></i>
                <!-- 文本 -->
                <span>{{ item.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: 'home',
  data() {
    return {
      // 左侧菜单数据
      menulist: [],
      // 图标
      icons: {
        125: 'el-icon-s-custom',
        103: 'el-icon-s-tools',
        101: 'el-icon-s-goods',
        102: 'el-icon-s-order',
        145: 'el-icon-s-marketing',
      },
      isCollapse: false,
      //被激活的链接地址
      activePath: '',
    }
  },
  methods: {
    //将路径存放到sessionstorage中
    saveNavState(activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    },
    toggleC() {
      // 点击按钮，切换菜单折叠
      this.isCollapse = !this.isCollapse
    },
    logout() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    //获取所有菜单
    async getMenuList() {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menulist = res.data
    },
  },
  created() {
    //获取sessionstorage中的值，
    this.activePath = window.sessionStorage.getItem('activePath')
    this.getMenuList()
  },
}
</script>

<style scoped>
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
  font-size: 25px;
}
.el-header div {
  display: flex;
  align-items: center;
}
.el-header span {
  margin-left: 15px;
}
.el-aside {
  background-color: #333744;
}
.el-aside .el-menu {
  border-right: 0;
}
.el-main {
  background-color: #eaedf1;
}
img {
  height: 60px;
  width: 60px;
}
/* 图标位置 */
.el-icon-s-order {
  margin-left: 5px;
}
.toggle-button {
  background-color: #4a5064;
  line-height: 24px;
  font-size: 10px;
  color: #fff;
  text-align: center;
  /* 控制字间距 */
  letter-spacing: 0.2em;
}
</style>