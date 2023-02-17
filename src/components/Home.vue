<template>
  <el-container class="home-container">
    <!-- 头部 -->
    <el-header>
      <div>
        <img src="../assets/images/cart.png" alt="">
        <span>U-shop Admin System</span>
      </div>
      <el-button type="info" @click="logout">Logout</el-button>
    </el-header>
    <el-container>
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <!-- 侧边栏 -->
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <div class="sidebar-cont">
          <el-menu active-text-color="#409eef" background-color="#333744" class="el-menu-vertical-demo"
            :default-active="activePath" text-color="#fff" unique-opened :collapse="isCollapse"
            :collapse-transition="false" router>

            <el-submenu :index="item.id + ''" v-for="item in menuList" :key="item.id">
              <template #title>
                <i :class="iconsObj[item.id]"></i>
                <span>{{ item.authName }}</span>
              </template>
              <el-menu-item :index="'/' + subItem.path" v-for="subItem in item.children" :key="subItem.id"
                @click="saveNavState('/' + subItem.path)">
                <template #title>

                  <i class="el-icon-menu"></i>
                  <span>{{ subItem.authName }}</span>
                </template>

              </el-menu-item>

            </el-submenu>
          </el-menu>
        </div>
      </el-aside>
      <el-main>
        <!-- 路由占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>

</template>

<script>

import axios from 'axios'

export default {
  name: 'VueShopHome',

  data () {
    return {
      menuList: [],
      iconsObj: {
        125: 'el-icon-user',
        103: 'el-icon-unlock',
        101: 'el-icon-goods',
        102: 'el-icon-tickets',
        145: 'el-icon-data-line'
      },
      isCollapse: false,
      activePath: ''
    }
  },

  components: {

  },

  mounted () {

  },

  created () {
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  },

  methods: {
    logout () {
      window.sessionStorage.removeItem('token')
      this.$router.push('/login')
    },
    async getMenuList () {
      const { data: res } = await axios.get('menus')

      if (res.meta.status !== 200) {
        return this.$message({
          message: res.meta.msg,
          type: 'error'
        })
      }
      this.menuList = res.data
    },
    toggleCollapse () {
      this.isCollapse = !this.isCollapse
    },
    saveNavState (activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    }
  }
}
</script>

<style lang="less" scoped>
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0px;
  align-items: center;
  color: #eee;
  font-size: 20px;

  >div {
    display: flex;
    align-items: center;
  }

  img {
    height: 30%;
    width: 31%;
  }

  span {
    margin-left: 15px;
  }
}

.el-aside {
  background-color: #333744;

  .el-menu {
    border-right: 0;
  }
}

.el-main {
  background-color: #eaedf1;
}

.home-container {
  height: 100%;
}

.toggle-button {
  background-color: #4a5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>
