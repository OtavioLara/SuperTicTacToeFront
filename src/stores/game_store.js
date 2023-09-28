import { defineStore } from 'pinia'
import { ref, computed, reactive } from 'vue'

export const useGameStore = defineStore('game', () => {
    const id = ref('')
    const player1 = reactive({})
    const player2 = reactive({})
    const game_data = reactive({})
    
    return { id, player1, player2, game_data }
})