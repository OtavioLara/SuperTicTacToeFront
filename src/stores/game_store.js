import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useGameStore = defineStore('game', () => {
    const game = ref('')
    
    const getGameUid = computed(() => {
        game.value = localStorage.getItem('game')
        return game.value
    })
    const setGameUid = (value) => {
        localStorage.setItem('game', value);
        game.value = value
    }
    
    return { getGameUid, setGameUid }
})