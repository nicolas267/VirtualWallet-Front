import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      component: () => import('@/views/dashboard/Index'),
      children: [
        // Dashboard
        {
          name: 'Dashboard',
          path: '',
          component: () => import('@/views/dashboard/Dashboard'),
        },
        // Pages
        {
          name: 'Crear billetera virtual',
          path: 'clients/create',
          component: () => import('@/views/dashboard/pages/ClientCreate'),
        },
        {
          name: 'Recargar billetera virtual',
          path: 'wallet/recharge',
          component: () => import('@/views/dashboard/pages/Recharge'),
        },
        {
          name: 'Pagar con billetera virtual',
          path: 'wallet/pay',
          component: () => import('@/views/dashboard/pages/Pay'),
        },
      ],
    },
  ],
})
