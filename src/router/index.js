import { createRouter, createWebHistory } from 'vue-router'
import GameView from '../views/GameView.vue'
import LoginView from '../views/LoginView.vue'
import LobbyView from '../views/LobbyView.vue'
import { getCurrentUser } from 'vuefire'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: LoginView,
      meta: { requiresAuth: false }
    },
    {
      path: '/game',
      name: 'game',
      component: GameView,
      props: true,
      meta: { requiresAuth: true }
    },
    {
      path: '/lobby',
      name: 'lobby',
      component: LobbyView,
      props: true,
      meta: { requiresAuth: true }
    },
  ]
})
router.beforeEach(async (to) => {
  if (to.meta.requiresAuth) {
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      return {
        name: 'login',
        query: {
          redirect: to.fullPath,
        },
      }
    }
  }
})

export default router
