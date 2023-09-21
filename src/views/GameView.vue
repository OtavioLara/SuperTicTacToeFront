<template>
    <main class='game-view tictac-main'>
        <div v-for='(vector, i) in matrix' 
        :key='vector'
        class='tictac-row'>
            <TicTacToe v-for='(elem, j) in vector' 
            :key='elem' 
            :myx='i' 
            :myy='j'
            :blocked='blocked_matrix[i][j]' 
            class='tictac-element' style="background-color:none"
            @update_matrix='(data) => update_matrix(data, i, j)'>
            </TicTacToe>
        </div>
    </main>
</template>

<script setup>
  import { reactive, ref} from 'vue'
import TicTacToe from '../components/TicTacToe.vue'
  let matrix = [
            [0,0,0],
            [0,0,0],
            [0,0,0]
        ]
  const blocked_matrix = ref([
      [false, false, false],
      [false, false, false],
      [false, false, false]
  ])
  const update_matrix = (data, i, j) => {
      console.log(data)
      matrix = data.game_matrix
      blocked_matrix.value = data.blocked_matrix
      
      console.log(i)
      console.log(j)
  }
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