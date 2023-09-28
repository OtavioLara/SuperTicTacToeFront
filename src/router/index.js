import { createRouter, createWebHistory } from 'vue-router'
import GameView from '../views/GameView.vue'
import LoginView from '../views/LoginView.vue'
import LobbyView from '../views/LobbyView.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: LoginView
    },
    {
      path: '/game',
      name: 'game',
      component: GameView,
      props: true
    },
    {
      path: '/lobby',
      name: 'lobby',
      component: LobbyView,
      props: true
    },
  ]
})

export default router
