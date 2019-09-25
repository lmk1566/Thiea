import Vue from 'vue';
import Router from 'vue-router';
import Home from '@/components/Home';
import Dashboard from '@/components/Dashboard';
import Main from '@/components/Main';

// 个人事务
import Todo from '@/components/person/Todo';
import Timelist from '@/components/person/Timelist';

//基础数据
import BAS001 from '@/components/BAS/BAS001'

//生产管理
import MFG003 from '@/components/MFG/MFG003'
import MFG004 from '@/components/MFG/MFG004'

//质量管理
import QAS006 from '@/components/QAS/QAS006'

//设备管理
import EQP001 from '@/components/EQP/EQP001'
import EQP002 from '@/components/EQP/EQP002'
import EQP003 from '@/components/EQP/EQP003'
import EQP004 from '@/components/EQP/EQP004'
import EQP005 from '@/components/EQP/EQP005'
import EQP006 from '@/components/EQP/EQP006'
import EQP007 from '@/components/EQP/EQP007'
import EQP008 from '@/components/EQP/EQP008'
import EQP009 from '@/components/EQP/EQP009'
import EQP010 from '@/components/EQP/EQP010'
import EQP011 from '@/components/EQP/EQP011'
import EQP016 from '@/components/EQP/EQP016'
import EQP017 from '@/components/EQP/EQP017'
import EQP037 from '@/components/EQP/EQP037'
import EQP035 from '@/components/EQP/EQP035'
import EQP036 from '@/components/EQP/EQP036'

import EQP012 from '@/components/EQP/EQP012'

//用户管理
import UserList from '@/components/user/list';
import UserChangePwd from '@/components/user/changepwd';
import UserProfile from '@/components/user/profile';


// 懒加载方式，当路由被访问的时候才加载对应组件
const Login = resolve => require(['@/components/Login'], resolve);

Vue.use(Router);

let router = new Router({
  routes: [
    {
      path: '/login',
      name: '登录',
      component: Login
    },
    {
      path: '/',
      name: '个人事务',
      component: Home,
      redirect: '/main',
      menuShow: true,
      iconCls: 'iconfont icon-component',
      children: [
        {
          path: '/main',
          name: '首页',
          component: Main
        },
        {
          path: '/person/todo',
          component: Todo,
          name: '待办事项',
          menuShow: true
        },
        {
          path: '/person/timelist',
          component: Timelist,
          name: '日程安排',
          menuShow: true
        }
      ]
    },
    {
      path: '/',
      component: Home,
      name: '基础数据',
      menuShow: true,
      iconCls: 'iconfont icon-set',
      children: [
        {
          path: '/BAS/BAS001',
          component: BAS001,
          name: '组织架构',
          menuShow: true
        },
      ]
    },
    {
      path: '/',
      component: Home,
      name: '生产管理',
      menuShow: true,
      iconCls: 'iconfont icon-set',
      children: [
        {
          path: '/MFG/MFG003',
          component: MFG003,
          name: '工序设置',
          menuShow: true
        },
        {
          path: '/MFG/MFG004',
          component: MFG004,
          name: '工艺路线',
          menuShow: true
        },
      ]
    },
    {
        path: '/',
        component: Home,
        name: '设备管理',
        menuShow: true,
        iconCls: 'iconfont icon-set',
        children: [
          {
            path: '/EQP/EQP001',
            component: EQP001,
            name: '设备用途',
            menuShow: true
          },
          {
            path: '/EQP/EQP002',
            component: EQP002,
            name: '设备工作状态',
            menuShow: true
          },
          {
            path: '/EQP/EQP003',
            component: EQP003,
            name: '故障分类',
            menuShow: true
          },
          {
            path: '/EQP/EQP004',
            component: EQP004,
            name: '作业类型',
            menuShow: true
          },
          {
            path: '/EQP/EQP005',
            component: EQP005,
            name: '设备资产状态',
            menuShow: true
          },
          {
            path: '/EQP/EQP006',
            component: EQP006,
            name: '设备位置',
            menuShow: true
          },
          {
            path: '/EQP/EQP007',
            component: EQP007,
            name: '维保分类',
            menuShow: true
          },
          {
            path: '/EQP/EQP008',
            component: EQP008,
            name: '点巡检分类',
            menuShow: true
          },
          {
            path: '/EQP/EQP009',
            component: EQP009,
            name: '备件分类',
            menuShow: true
          },
          {
            path: '/EQP/EQP010',
            component: EQP010,
            name: '备件仓库分类',
            menuShow: true
          },
          {
            path: '/EQP/EQP011',
            component: EQP011,
            name: '零部件分类',
            menuShow: true
          },
          {
            path: '/EQP/EQP016',
            component: EQP016,
            name: '设备类型',
            menuShow: true
          },
          {
            path: '/EQP/EQP017',
            component: EQP017,
            name: '设备台账',
            menuShow: true
          },
          {
            path: '/EQP/EQP037',
            component: EQP037,
            name: '备件基本信息',
            menuShow: true
          },
          {
            path: '/EQP/EQP035',
            component: EQP035,
            name: '备件领用',
            menuShow: true
          },
          {
            path: '/EQP/EQP036',
            component: EQP036,
            name: '备件归还',
            menuShow: true
          },
          {
            path: '/EQP/EQP012',
            component: EQP012,
            name: '维保方案配置',
            menuShow: true
          },
        ]
    },
    {
      path: '/',
      component: Home,
      name: '质量管理',
      menuShow: true,
      iconCls: 'iconfont icon-set',
      children: [
        {
          path: '/QAS/QAS006',
          component: QAS006,
          name: 'IQC检验申请',
          menuShow: true
        },
      ]
    },
    {
      path: '/',
      component: Home,
      name: '理货包装',
      menuShow: true,
      iconCls: 'iconfont icon-set',
      children: [
      ]
    },
    {
      path: '/',
      component: Home,
      name: '统计报表',
      menuShow: true,
      iconCls: 'iconfont icon-set',
      children: [
      ]
    },
    {
      path: '/',
      component: Home,
      name: '系统管理',
      menuShow: true,
      iconCls: 'iconfont icon-set',
      children: [
      ]
    }
  ]
});

router.beforeEach((to, from, next) => {
  // console.log('to:' + to.path)
  if (to.path.startsWith('/login')) {
    window.localStorage.removeItem('access-user');
    next();
  } else {
    let user = JSON.parse(window.localStorage.getItem('access-user'));
    if (!user) {
      next({ path: '/login' });
    } else {
      next();
    }
  }
});

export default router;
