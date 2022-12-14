import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'default',
    redirect: '/index',
  },
  {
    path: '/prototype/:protoID',
    name: 'Prototype',
    component: () => import('../views/prototype/ProtoWorkSpace.vue'),
    meta: {
      title: '云图',
    },
  },
  {
    path: '/attendTeam/:code',
    name: 'AttendTeam',
    component: () => import('../views/team/AttendTeam.vue'),
    meta: {
      title: '云图',
    },
  },
  {
    path: '/team',
    name: 'team',
    component: () => import('../views/team/Index.vue'),
    meta: {
      title: '云图',
    },
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
          {
            path: 'doc/',
            name: 'documentCenter',
            component: () => import('../views/team/DocumentCenter.vue'),
          },
          {
            path: 'dir/:dirID',
            name: 'directory',
            component: () => import('../views/team/DocumentCenter.vue'),
          },
          {
            path: 'trash',
            name: 'teamTrash',
            component: () => import('../views/project/ProjectTrash.vue'),
          },
        ],
      },
    ],
  },
  {
    path: '/user',
    name: 'user',
    component: () => import('../views/user/UserOverview.vue'),
    meta: {
      title: '云图',
    },
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
      {
        path: 'desktop',
        name: 'ProjectDesktop',
        component: () => import('../views/project/ProjectDesktop.vue'),
      },
    ],
  },
  {
    path: '/workspace/:ProjID',
    name: 'workspace',
    component: () => import('../views/workspace/WorkspaceOverview.vue'),
    meta: {
      title: '云图',
    },
    children: [
      {
        path: 'doc/',
        name: 'DocumentList',
        component: () => import('../components/document/Documents.vue'),
      },
      {
        path: 'dir/:dirID',
        name: 'DirList',
        component: () => import('../components/document/Documents.vue'),
      },
      {
        path: 'uml',
        name: 'UMLList',
        component: () => import('../views/workspace/UMLList.vue'),
      },
      {
        path: 'prototype',
        name: 'PrototypeList',
        component: () => import('../views/workspace/PrototypeList.vue'),
      },
      {
        path: 'recycleBin',
        name: 'TrashList',
        component: () => import('../views/workspace/TrashList.vue'),
      },
    ],
  },
  {
    path: '/edit/:id',
    name: 'editor',
    component: () => import('../views/document/DocumentEditor.vue'),
    meta: {
      title: '云图',
    },
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/login/LoginPage.vue'),
    meta: {
      title: '云图',
    },
  },
  {
    path: '/:catchAll(.*)',
    name: 'NoFound',
    component: () => import('../views/common/noFound.vue'),
    meta: {
      title: '云图-404',
    },
  },
  {
    path: '/index',
    name: 'Index',
    component: () => import('../views/homepage/HomePage.vue'),
    meta: {
      title: '云图-首页',
    },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  //登录鉴权
  if (to.meta.requiresAuth && !localStorage.getItem('token')) {
    window.$message.warning('您还没有登录，请先登录');
    return {
      path: '/login',
      query: { redirect: to.fullPath },
    };
  }
  next();
});

export default router;
