import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from "../views/LoggedIn.vue"

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: Dashboard
    },
    {
      path: '/users',
      name: 'user_management',
      component: () => import("../views/admin-views/UserManagement.vue")
    },
    {
      path: '/prices',
      name: 'price-management',
      component: () => import("../views/admin-views/PriceManagement.vue")
    },
    {
      path: '/scooters',
      name: 'scooter_management',
      component: () => import("../views/admin-views/ScooterManagement.vue")
    },
  ]
})

export default router
