import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import Admin from '../views/Administration.vue';
import Random from '../views/Random.vue';

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Home',
    redirect: '/admin',
  },
  {
    path: '/admin',
    name: 'Administration',
    component: Admin,
    children: [
      {
        path: ':project/:element?',
        name: 'Project',
        component: () => import('../views/Administration/Viewer.vue'),
      },
    ],
  },
  {
    path: '/random',
    name: 'Random',
    component: Random,
  },
  // {
  //   path: '/palette',
  //   name: 'Palette',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/Palette.vue'),
  // },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
