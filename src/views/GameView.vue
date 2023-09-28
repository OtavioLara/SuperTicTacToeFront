<template>
    <main v-if="game_data_received" >
        <div class='game-view tictac-main'>
          <div v-for='(vector, i) in matrix' 
            :key='vector'
            class='tictac-row'>
              <TicTacToe v-for='(elem, j) in vector' 
                :key='elem' 
                :myx='i' 
                :myy='j'
                :game_data='game_data'
                class='tictac-element' style="background-color:none"
                @update_matrix='(data) => update_matrix(data, i, j)'>
              </TicTacToe>
          </div>
        </div>
        <h1>Vez do {{show_value(game_data.player)}}</h1>
    </main>
</template>

<script setup>
  import { useGameStore } from '@/stores/game_store'
  import { storeToRefs } from 'pinia';
  import { onMounted, reactive, ref} from 'vue'
  import TicTacToe from '../components/TicTacToe.vue'
  const matrix = ref([
            [0,0,0],
            [0,0,0],
            [0,0,0]
        ])
  const game_data_received = ref(false)
  const game_store = useGameStore()
  const { id, player1, player2, game_data } = storeToRefs(game_store)
  const update_matrix = (id_game, data, i, j) => {
      console.log(data)
      matrix.value = data.main_matrix
      game_data.blocked_matrix = data.blocked_matrix
      game_data.full_matrix =data.game_matrix
      game_data.main_matrix =data.main_matrix
      game_data.player = data.player
  }
  const show_value = (v) => {
    if(v == 2){
        return 'O'
    }else if(v == 1){
        return 'X'
    }else{
        return ''
    }
  }
  onMounted(() => {
    update_matrix()
  })
</script>

<style scoped>
  @import '../assets/TicTacToe.css';
  .game-view{
    height: 40rem;
    width: 40rem;
    min-width: 40rem;
    max-width: 40rem;
    background-color:darkcyan;
  }

</style>