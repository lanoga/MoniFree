import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/views/HomePage.vue'
import BlankLayout from '@/layouts/BlankLayout.vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import { useAuth } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'index',
      meta: {
        layout: DefaultLayout,
      },
      component: HomePage,
    },
    {
      path: '/login',
      name: 'login',
      meta: {
        layout: BlankLayout,
        redirectIfLoggedIn: true,
      },
      component: () => import(/* webpackChunkName: "login" */ '../views/LoginPage.vue'),
    },
    {
      path: '/not-authorized',
      name: 'not-authorized',
      meta: {
        layout: BlankLayout,
        redirectIfLoggedIn: true,
      },
      component: () => import(/* webpackChunkName: "not-authorized" */ '../views/NotAuthorizedPage.vue'),
    },
    {
      path: '/users',
      name: 'users',
      meta: {
        layout: DefaultLayout,
      },
      component: () => import(/* webpackChunkName: "users" */ '../views/UsersPage.vue'),
    },
  ],
})

router.beforeEach(to => {
  const auth = useAuth()

  if (to.meta.redirectIfLoggedIn && auth.isLoggedIn) {
    return '/'
  }

  if (!auth.isLoggedIn && to.name !== 'login') {
    return { name: 'login', query: { to: to.name !== 'index' ? to.fullPath : undefined } }
  }
})

export default router
