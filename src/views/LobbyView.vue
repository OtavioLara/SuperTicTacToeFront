<template>
  <main class="container-of-lists">
    <div class="list-container" v-if="!(my_lobby.value && my_lobby.value.players.length > 0)">
      <div class="create-lobby lobby-container">
        <div class="add-button" @click="create_lobby_view">+</div>
      </div>
      <div v-for="l in lobbies"
      :key="l"
      class="lobby-container"
      @click="join_lobby_view(l.id)">
        {{ l }}
      </div>
    </div>
    <div class="lobby_container" v-if="my_lobby.value && my_lobby.value.players.length > 0" v-bind="my_lobby">
       <div>
          <h3 v-for="player in my_lobby.value.players" :key="player">
            Player: {{ player.nick_name }}</h3>
          <h5 v-if="my_lobby.value.players.length < 2">Aguardando outro jogador</h5>
          <button @click="start_game_view(my_lobby.value.id)">Start Game</button>
       </div>
    </div>
    <div class="list-container" v-if="my_lobby.value && my_lobby.value.players.length > 0">
      <div v-for="p in all_players" 
      :key="p" 
      class="player-container"
      @click="ask_to_join(p)">
        {{ p.nick_name }}
      </div>
    </div>
  </main>
</template>


<script setup>
  import { useGameStore } from '@/stores/game_store'
  import { useRouter } from 'vue-router'
  import { storeToRefs } from 'pinia';
  import { list_online_players, list_all_lobbies, create_lobby, join_lobby, start_game } from '@/services/services';
  import { onBeforeMount, onMounted, reactive, ref } from 'vue';
  import { usePlayerStore } from '@/stores/user_store'

  const game_store = useGameStore()
  const { id, player1, player2, game_data } = storeToRefs(game_store)
  const all_players = ref([])
  const lobbies = ref([])
  const player_store = usePlayerStore()
  const my_lobby = reactive({value: {players: []}})
  const router = useRouter()
  
  const list_lobbies = () => {
    list_all_lobbies().then(response => {
      lobbies.value = response.data
      const temp = response.data.filter((x) => {
        return x.players.filter(y => y.email === player_store.getEmail).length != 0
      })
      my_lobby.value = temp[0]
      list_all_players(temp[0])
    })
  }
  
  const list_all_players = (lobby) => {
    list_online_players().then(response => {
      if(lobby){
        all_players.value = response.data.filter(x => {
          return lobby.players.filter(y => x.email === y.email).length == 0
        })
      }
    })
  }
  
  const ask_to_join = (p) => {
    console.log('Ask to '+p.email+' to join your lobby')
  }
  const create_lobby_view = () => {
    create_lobby(player_store.getEmail).then(response => {
      my_lobby.value = response.data
    })
  }

  const join_lobby_view = ((id_lobby) => {
    join_lobby(id_lobby, player_store.getEmail).then(response =>{
      if(response.data){
          my_lobby.value = response.data
      }else{
        alert('This lobby is full')
      }
    })
  })
  const start_game_view = ((id_lobby) => {
    console.log(id_lobby)
    start_game(id_lobby).then(response => {
      response.data
      game_data.value = response.data.game_data
      player1.value = response.data.player1
      player2.value = response.data.player2
      id.value = response.data.id
      router.push({ name: 'game'})
    })
  })
  onBeforeMount(() => {
    list_lobbies()
  })
</script>

<style scoped>
  .list-container{
    border: solid 0.3rem black;
    border-radius: 1rem;
    overflow-y: auto;
    height: 40vh;
    width: 20vw;
    box-shadow: 5px 5px 5px 5px rgba(0, 0, 0, 0.3);
    display: flex;
    flex-flow: column nowrap;
    justify-content: top;
    align-items: center;
    gap: 0.5rem;
  }
  .player-container{
    cursor: pointer;
    background-color: blueviolet;
    width: 100%;
    text-align: center;
  }
  .add-button{
    width: 2rem;
    height: 1.5rem;
    border-radius: 1rem;
    font-weight: bold;
    cursor: pointer;
    background-color: green;
    color: white;
    text-align: center;
  }
  .lobby_container{
    border: solid 0.3rem black;
    border-radius: 1rem;
    overflow-y: auto;
    height: 40vh;
    width: 20vw;
    box-shadow: 5px 5px 5px 5px rgba(0, 0, 0, 0.3);
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.5rem;
  }
  .container-of-lists{
    display: flex;
    flex-flow: row nowrap;
    gap: 1rem
  }
</style>