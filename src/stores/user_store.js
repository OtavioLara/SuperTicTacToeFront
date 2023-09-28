import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const usePlayerStore = defineStore('player', () => {
    const email = ref('')
    const nick_name = ref('')
    const getEmail = computed(() => {
        email.value = localStorage.getItem('email')
        return email.value
    })
    const setEmail = (value) => {
        localStorage.setItem('email', value);
        email.value = value
    }

    const getNickName = computed(() => {
        nick_name.value = localStorage.getItem('nick_name')
        return nick_name.value
    })
    const setNickName = (value) => {
        localStorage.setItem('nick_name', value)
        nick_name.value = value
    }
    
    return { getEmail, setEmail, getNickName, setNickName }
})