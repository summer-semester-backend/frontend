import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'default',
    redirect: 'login',
  },
  {
    path: '/project/desktop',
    name: 'ProjectDesktop',
    component: () => import('../views/project/ProjectDesktop.vue'),
  },
  {
    path: '/project/trash',
    name: 'ProjectTrash',
    component: () => import('../views/project/ProjectTrash.vue'),
  },
  {
    path: '/project',
    name: 'project',
    component: () => import('../views/project/ProjectOverview.vue'),
  },
  {
    path: '/team',
    name: 'team',
    component: () => import('../views/team/Index.vue'),
    children: [
      {
        path: ':teamID',
        name: 'teamOverview',
        component: () => import('../views/team/TeamOverview.vue'),
        children: [
          {
            path: '',
            name: 'teamDetail',
            component: () => import('../views/team/TeamDetail.vue'),
          },
          {
            path: 'project',
            name: 'teamProject',
            component: () => import('../views/team/TeamProject.vue'),
          },
        ],
      },
    ],
  },
  {
    path: '/team/project',
    name: 'TeamProject',
    component: () => import('../views/team/TeamProject.vue'),
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
  {
    path: '/document/editor',
    name: 'editor',
    component: () => import('../views/document/DocumentEditor.vue'),
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
