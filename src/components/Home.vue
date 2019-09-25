<template>
  <el-row class="container">
    <!--头部-->
    <el-col :span="24">
      <!--展开折叠开关-->
      <el-col :span="1" class="topbar-left-wrap">
        <div class="menu-toggle" @click.prevent="collapse">
          <i class="iconfont icon-category" v-show="!collapsed"></i>
          <i class="iconfont icon-more" v-show="collapsed"></i>
        </div>
      </el-col>
      <el-col :span="23" class="topbar-wrap">
        <div class="topbar-title">
          <span class="top_logo" v-show="!collapsed">Theia MES</span>
        </div>
        <div class="topbar-account topbar-btn">
          <el-dropdown trigger="click">
            <span class="el-dropdown-link userinfo-inner"><img src="../assets/images/user.jpeg" class="user_pic"> 管理员&nbsp;&nbsp;<i
              class="iconfont icon-code"></i></span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <div @click="jumpTo('/main')"><span style="color: #555;font-size: 14px;">返回首页</span></div>
              </el-dropdown-item>
              <el-dropdown-item>
                <div @click="jumpTo('/user/profile')"><span style="color: #555;font-size: 14px;">个人信息</span></div>
              </el-dropdown-item>
              <el-dropdown-item>
                <div @click="jumpTo('/user/changepwd')"><span style="color: #555;font-size: 14px;">修改密码</span></div>
              </el-dropdown-item>
              <el-dropdown-item divided @click.native="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </el-col>
    </el-col>

    <!--中间-->
    <el-col :span="24" class="main">
      <!--左侧导航-->
      <aside :class="{showSidebar:!collapsed}">
        <!--导航菜单-->
        <el-menu :default-active="defaultActiveIndex" router :collapse="collapsed" @select="handleSelect">
          <template v-for="(item,index) in $router.options.routes" v-if="item.menuShow">
            <el-submenu v-if="!item.leaf" :index="index+''">
              <template slot="title"><i :class="item.iconCls"></i><span slot="title">{{item.name}}</span></template>
              <el-menu-item v-for="sec_term in item.children" :key="sec_term.path" :index="sec_term.path" v-if="sec_term.menuShow"
                            :class="$route.path==sec_term.path?'is-active':''">
                <i :class="sec_term.iconCls"></i><span slot="title">{{sec_term.name}}</span>
              </el-menu-item>
            </el-submenu>
            <el-menu-item v-else-if="item.leaf&&item.children&&item.children.length" :index="item.children[0].path"
                          :class="$route.path==item.children[0].path?'is-active':''">
              <i :class="item.iconCls"></i><span slot="title">{{item.children[0].name}}</span>

              <el-menu-item v-for="third_term in item.children" :key="third_term.path" :index="third_term.path" v-if="third_term.menuShow"
                            :class="$route.path==third_term.path?'is-active':''">
                <i :class="third_term.iconCls"></i><span slot="title">{{third_term.name}}</span>
              </el-menu-item>

            </el-menu-item>
          </template>
        </el-menu>
      </aside>

      <!--右侧内容区-->
      <section class="content-container">
        <div class="grid-content bg-purple-light">
          <el-row>
            <el-col :span="24" class="content-wrapper">
              <transition name="fade" mode="out-in">
                <router-view></router-view>
              </transition>
            </el-col>
          </el-row>
          <el-row :span="24" style="text-align:center;line-height:35px;color:#666;">
              <el-col>CopyRight &copy;2019 武陵源软件系统有限公司版权所有</el-col>
          </el-row>
        </div>
      </section>
    </el-col>

  </el-row>
</template>

<script>
import API from '../api/api_user';

export default {
  name: 'home',
  created() {
    this.$on('setNickName', text => {
      this.nickname = text;
    });

    this.$on('goto', url => {
      if (url === '/login') {
        localStorage.removeItem('access-user');
      }
      this.$router.push(url);
    });
  },
  data() {
    return {
      defaultActiveIndex: '0',
      nickname: '',
      collapsed: false
    };
  },
  methods: {
    handleSelect(index) {
      this.defaultActiveIndex = index;
    },
    //折叠导航栏
    collapse: function() {
      this.collapsed = !this.collapsed;
    },
    jumpTo(url) {
      this.defaultActiveIndex = url;
      this.$router.push(url); //用go刷新
    },
    logout() {
      let that = this;
      this.$confirm('确认退出吗?', '提示', {
        confirmButtonClass: 'el-button--warning'
      })
        .then(() => {
          that.loading = true;
          that.$router.push('/login');
        })
        .catch(() => {});
    }
  },
  mounted() {
    let user = localStorage.getItem('access-user');
    if (user) {
      user = JSON.parse(user);
      this.nickname = user.nickname || '';
    }
  }
};

/**
 *           <!--一级菜单-->
 <template v-for="(item,index) in $router.options.routes" v-if="item.menuShow">
 <el-submenu v-if="item.children && item.children.length" :index="index+''" :key="item.path">
 <template slot="title"><i :class="item.iconCls"></i><span slot="title">{{item.name}}</span></template>

 <!-- 二级菜单 -->
 <template v-for="itemChild in item.children">
 <el-submenu v-if="itemChild.children && itemChild.children.length" :index="itemChild.path" :key="itemChild.path">
 <!-- 二级菜单叶子 -->
 <template slot="title"><i :class="itemChild.icon"></i><span>{{itemChild.name}}</span></template>

 <!-- 三级菜单 -->
 <template v-for="itemChild_Child in itemChild.children">
 <el-submenu v-if="itemChild_Child.children && itemChild_Child.children.length" :index="itemChild_Child.path" :key="itemChild_Child.path">
 <!-- 三级菜单叶子 -->
 <template slot="title"><i :class="itemChild_Child.icon"></i><span>{{itemChild_Child.name}}</span></template>
 </el-submenu>

 <!--三级菜单根结点-->
 <el-menu-item v-else :index="itemChild_Child.path" :key="itemChild_Child.path">
 <i :class="itemChild_Child.icon"></i><span slot="title">{{itemChild_Child.name}}</span>
 </el-menu-item>
 </template>

 </el-submenu>

 <!--二级菜单根结点-->
 <el-menu-item v-else :index="item.children[0].path" :key="item.children[0].path">
 <i :class="itemChild.icon"></i><span slot="title">{{itemChild.name}}</span>
 </el-menu-item>
 </template>
 </el-submenu>

 <!--一级菜单根结点-->
 <el-menu-item v-else :index="item.path" :key="item.path">
 <i :class="item.icon"></i><span slot="title">{{item.name}}</span>
 </el-menu-item>
 </template>
 </el-menu>
 */
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.container {
  position: absolute;
  top: 0px;
  bottom: 0px;
  width: 100%;

  .topbar-left-wrap {
    height: 60px;
    line-height: 60px;
    padding: 0px;
    width:60px;
    background-color: #1F252D;

    .menu-toggle {
      float: left;
      text-align: center;
      color: #27ffe4;
      opacity: 0.8;
      font-weight: bold;
      line-height: 60px;
      width:60px;
    }

    .menu-toggle:hover {
      color: #409eff;
      cursor: pointer;
      opacity: 0.8;
    }
  }

  .topbar-wrap {
    height: 60px;
    line-height: 60px;
    padding: 0px;
    background-color: #dedede;

    .topbar-title {/*Theia MES DIV*/
      float: left;
      width: 160px;
      padding-left: 0px;
      background-color: #1F252D;
    }

    .top_logo {
      font-size: 20px;
      color: white;
      font-weight: 500;
      opacity: 0.8;
    }

    .topbar-btn {
      color: #fff;
      background-color: #dedede;
    }

    .topbar-account {
      float: right;
      padding-right: 12px;
      background-color: #dedede;
    }
    .userinfo-inner {
      cursor: pointer;
      color: black;
      opacity: 0.8;
      padding-left: 10px;
      position: relative;
      .user_pic {
        position: absolute;
        left: -20px;
        top: -8px;
        width: 32px;
        height: 32px;
        border-radius: 50%;
      }
      .iconfont {
        font-weight: 800;
      }
      .iconfont:hover {
        color: #409eff;
      }
    }
  }

  .main {
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    position: absolute;
    top: 60px;
    bottom: 0px;
    overflow: hidden;
    backgroud-color: #c4ffe5!important;
  }

  aside {
    min-width: 60px;
    background-color: #1F252D;

    &::-webkit-scrollbar {
      display: none;
    }

    &.showSidebar {
       overflow-x: hidden;
       overflow-y: auto;
       background-color: #1F252D;
    }

    .el-menu {
      height: 100%; /*写给不支持calc()的浏览器*/
      height: -moz-calc(100% - 80px);
      height: -webkit-calc(100% - 80px);
      height: calc(100% - 80px);
      border-radius: 0px;
      border-right: 0px;
      background-color: #1F252D;
    }

    .el-submenu .el-menu-item {
      min-width: 60px;
    }
    .el-menu {
      width: 220px;
    }
    .el-menu--collapse {
      width: 60px;
    }

    .el-menu .el-menu-item,
    .el-submenu .el-submenu__title {
      height: 56px;
      line-height: 56px;
    }
    .el-submenu .el-submenu__title .el-menu-item:hover,
    .el-submenu .el-menu-item:hover,
    .el-submenu .el-submenu__title:hover {
      background-color: rgba(0, 0, 0, 0.3);
      color: #409eff;
    }
  }

  .content-container {
    flex: 1;
    overflow-y: auto;
    padding: 10px;
    padding-bottom: 1px;
    backgroud-color: #c4ffe5!important;

    .content-wrapper {
      box-sizing: border-box;
    }
  }
}
</style>
