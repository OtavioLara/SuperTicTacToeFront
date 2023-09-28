import { defineStore } from 'pinia'
import { ref } from 'vue'

export const usePlayerStore = defineStore('player', () => {
    const email = ref('')
    const nick_name = ref('')
    return { email, nick_name }
})