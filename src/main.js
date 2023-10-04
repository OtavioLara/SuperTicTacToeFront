import './assets/TicTacToe.css'

import { VueFire, VueFireAuth } from 'vuefire'
import { firebaseApp } from '@/services/fire_base_service'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(VueFire, {
    firebaseApp,
    modules: [
        VueFireAuth(),
    ]
})

app.use(createPinia())
app.use(router)

app.mount('#app')
