<template>
  <main>
    <div class="list-container">
      <div v-for="p in all_players" 
      :key="p" 
      class="player-container"
      @click="ask_to_join(p)">
        {{ p.nick_name }}
      </div>
    </div>
    <div class="list-container">
      <div class="create-lobby lobby-container">
        <div class="add-button" @click="create_lobby_view">+</div>
      </div>
      <div v-for="l in lobbies"
      :key="l"
      class="lobby-container">
        {{ l }}
      </div>
    </div>
  </main>
</template>

<script setup>
  import { useRouter } from 'vue-router'
  import { list_online_players, list_all_lobbies, create_lobby } from '@/services/services';
  import { onMounted, reactive, ref } from 'vue';
  import { usePlayerStore } from '@/stores/user_store'
  import { storeToRefs } from 'pinia'

  const all_players = ref([])
  const lobbies = ref([])
  
  const player_store = usePlayerStore()
  const {email, nick_name} = storeToRefs(player_store)

  const list_lobbies = () => {
    list_all_lobbies().then(response => {
      lobbies.value = response.data
    })
  }
  const list_all_players = () => {
    list_online_players().then(response => {
      all_players.value = response.data
    })
  }
  
  const ask_to_join = (p) => {
    console.log('Ask to '+p.email+' to join your lobby')
  }
  const create_lobby_view = () => {
    create_lobby(email).then(response => {
      console.log(response.data)
    })
  }
  onMounted(() => {
    
    list_all_players()
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
</style>