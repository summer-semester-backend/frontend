import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'default',
    redirect: 'project',
  },
  {
    path: '/project',
    name: 'project',
    component: () => import('../views/project/ProjectOverview.vue'),
    children: [
      {
        path: 'desktop',
        name: 'ProjectDesktop',
        component: () => import('../views/project/ProjectDesktop.vue'),
      },
      {
        path: 'trash',
        name: 'ProjectTrash',
        component: () => import('../views/project/ProjectTrash.vue'),
      },
    ],
  },
  {
    path: '/project/prototype',
    name: 'prototype',
    component: () => import('../views/prototype/WorkSpace.vue'),
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
            path: 'teamDetail',
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
        path: '',
        name: 'UserDefault',
        redirect: '/user/personInfo',
      },
    ],
  },
  {
    path: '/workspace',
    name: 'workspace',
    component: () => import('../views/workspace/WorkspaceOverview.vue'),
    children: [
      {
        path: 'doc',
        name: 'DocumentList',
        component: () => import('../views/workspace/DocumentList.vue'),
      },
    ],
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
