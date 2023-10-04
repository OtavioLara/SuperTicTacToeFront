import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const usePlayerStore = defineStore('player', () => {
    const user = ref('')
    
    const getUser = computed(() => {
        user.value = localStorage.getItem('user')
        return user.value
    })
    const setUser = (value) => {
        localStorage.setItem('user', value);
        user.value = value
    }
    
    return { getUser, setUser }
})