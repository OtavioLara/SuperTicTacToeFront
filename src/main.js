import './assets/TicTacToe.css'

import { VueFire, VueFireAuth } from 'vuefire'
import { firebaseApp } from '@/services/fire_base_service'

import { createApp } from 'vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { faPlus as fasPlus, faPlay as fasPlay, faRightFromBracket as fasRightFromBracket, faPerson, faPersonCircleExclamation } from '@fortawesome/free-solid-svg-icons'

library.add(fasPlus, fasPlay, fasRightFromBracket, faPerson, faPersonCircleExclamation);

const app = createApp(App)
    .component('fa', FontAwesomeIcon);

app.use(VueFire, {
    firebaseApp,
    modules: [
        VueFireAuth(),
    ]
})

app.use(createPinia())
app.use(router)

app.mount('#app')
