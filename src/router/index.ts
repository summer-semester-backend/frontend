import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'default',
    redirect: 'login',
  },
  {
    path: '/project',
    name: 'project',
    component: () => import('../views/project/ProjectOverview.vue'),
  },
  {
    path: '/team',
    name: 'team',
    component: () => import('../views/team/TeamOverview.vue'),
  },
  {
    path: '/user',
    name: 'user',
    component: () => import('../views/user/UserOverview.vue'),
    children: [
        {
          path: 'personInfo',
          name: 'PersonInfo',
          component: () => import('../components/user/PersonInfo.vue'),
        },
        {
          path: 'passwordChange',
          name: 'PasswordChange',
          component: () => import('../components/user/PasswordChange.vue'),
        },
        {
          path: "",
          redirect: "/user/personInfo",
        },
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/login/LoginPage.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from) => {
  if (to.meta.requiresAuth && !localStorage.getItem('token')) {
    window.$message.warning('您还没有登录，请先登录');
    return {
      path: '/login',
      query: { redirect: to.fullPath },
    };
  }
});

export default router;
