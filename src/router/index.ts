import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'

import Home from '@/views/home.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/imagesPreview',
    name: 'imagesPreview',
    component: () => import(/* webpackChunkName: "imagesPreview" */ '@/views/images-preview.vue')
  },
  {
    name: 'Home',
    path: '/',
    component: Home,
    
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
