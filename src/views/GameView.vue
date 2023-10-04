<template>
    <main v-if="game" >
        <div class='game-view tictac-main'>
          <div v-for='(vector, i) in game.game_matrix' 
            :key='vector'
            class='tictac-row'>
              <TicTacToe v-for='(elem, j) in vector' 
                :key='elem' 
                :blocked=' (!game.all_free && (game.last_x != i || game.last_y != j)) || game.global_winner != -1 || ((cur_player && game && game.players) && cur_player.uid != game.players[game.turn].uid)'
                :matrix='elem'
                :winner='game.main_matrix[i][j]'
                class='tictac-element' style="background-color:none"
                @click_in_matrix="(pos) => play({...pos, 'x': i, 'y': j})">
              </TicTacToe>
          </div>
        </div>
        <h5>{{ game.players[0].name+": O" }}</h5>
        <h5>{{ game.players[1].name+": X" }}</h5>
        <h1 v-if="((cur_player && game && game.players) && cur_player.uid == game.players[game.turn].uid)"> Seu turno!</h1>
        <h1 v-if="((cur_player && game && game.players) && cur_player.uid != game.players[game.turn].uid)">{{"Aguardando "+ game.players[game.turn].name + " Jogar"}}</h1>
        <h1 v-if="game.global_winner != -1" style="color: red">{{game.players[game.global_winner].name+" Venceu"}} </h1>
        <button @click="leave_game">Leave Game</button>
    </main>
</template>

<script setup>
  import { useGameStore } from '@/stores/game_store'
  
  import { useRouter } from 'vue-router'
  import TicTacToe from '../components/TicTacToe.vue'
  import { ref } from 'vue'
  import { useDatabaseObject, getCurrentUser, useDatabaseList, useDatabase } from 'vuefire'
  import { ref as dbRef, push, set, update, remove, onChildAdded} from 'firebase/database'

  const router = useRouter()
  const db = useDatabase()
  const game_store = useGameStore()
  const game_ref = dbRef(db, 'game/'+game_store.getGameUid)
  const game = useDatabaseObject(game_ref)
  const cur_player = ref('')
  const my_player_ref = ref('')

  function is_winner(matrix){
    let point = true
    // verify row
    for (var i = 0; i < 3; i++) {
      if(matrix[i][0] != 0){
        point = true
        for (var j = 1; j < 3; j++) {
          if(matrix[i][0] != matrix[i][j]){
            point = false
          }
        }
        if(point){
          return {'winner': matrix[i][0]}
        }
      }
    }
    // Verify col
    for (var i = 0; i < 3; i++) {
      if(matrix[0][i] != 0){
        point = true
        for (var j = 1; j < 3; j++) {
          if(matrix[0][i] != matrix[j][i]){
            point = false
          }
        }
        if(point){
          return {'winner': matrix[0][i]}
        }
      }
    }
    // Verify main dyagonal
    point = true
    for (var i = 0; i < 2; i++) {
      if(matrix[0][0] != 0){
        if(matrix[0][0] != matrix[i+1][i+1]){
            point = false
        }
      }else{
        point = false
        break;
      }
    }
    if(point){
      return {'winner': matrix[0][0]}
    }
    // Verify other dyagonal
    point = true
    for (var i = 0; i < 2; i++) {
      if(matrix[i][2-i] != 0){
        if(matrix[i][2-i] != matrix[i+1][2-i-1]){
            point = false
        }
      }else{
        point = false
        break
      }
    }
    if(point){
      return {'winner': matrix[0][2]}
    }
    return {'winner': false}
  }
  
  const play = (pos) => {
    const { x, y, x_in, y_in } = pos
    game.value.game_matrix[x][y][x_in][y_in] = game.value.turn + 1
    game.value.turn = game.value.turn == 0 ? 1 : 0
    const winner = is_winner(game.value.game_matrix[x][y])
    if(winner['winner']){
      game.value.main_matrix[x][y] = winner['winner']
    }
    game.value.last_x = x_in
    game.value.last_y = y_in
    game.value.all_free = game.value.main_matrix[x_in][y_in] != 0
    const global_winner = is_winner(game.value.main_matrix)
    if(global_winner['winner']){
      game.value.global_winner = global_winner['winner']-1
      const placar = {}
      placar['players'] = game.value.players
      placar['vencedor'] = game.value.players[global_winner['winner']-1]
      placar['timestamp'] = new Date().getTime()
      push(dbRef(db, 'placar'), placar)
    }
    set(dbRef(db, 'game/'+game_store.getGameUid), game.value)
  }
  getCurrentUser().then( response => {
    cur_player.value = response
    my_player_ref.value = dbRef(db, 'players/' + response.uid)
    onChildAdded(dbRef(db, 'game/'+game_store.getGameUid+"/leave_game"), (data) => {
        remove(dbRef(db, 'game/'+game_store.getGameUid))
        router.push({'name': 'lobby'})
    })
  })
  const leave_game = (() => {
    set(dbRef(db, 'game/'+game_store.getGameUid+"/leave_game"), {'leave_game': true})
    
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