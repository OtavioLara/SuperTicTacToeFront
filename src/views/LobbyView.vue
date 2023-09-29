<template>
  <main class="p-0 m-0 min-vw-100 d-flex flex-column align-items-center gap-3">
    <section class="lobby_container w-75 rounded-4 align-items-center d-flex flex-column p-2"
      v-if="!(my_lobby.value && my_lobby.value.players.length > 0)">
      <h3 class="title-color">Rooms</h3>
      <ul class="p-0 m-0 flex-grow-1 d-flex flex-column align-items-center">
        <li v-for="l in lobbies" :key="l" class="room p-0 m-0" @click="join_lobby_view(l.id)">
          <h4 class="m-0 p-0">{{ l.players[0].nick_name }}'s room</h4>
        </li>
      </ul>
      <button class="py-1 px-2 d-flex align-items-center btn-create-room" @click="create_lobby_view">Create room</button>
    </section>

    <section class="lobby_container w-75 rounded-4 align-items-center d-flex flex-column p-2"
      v-if="my_lobby.value && my_lobby.value.players.length > 0" v-bind="my_lobby">
      <h3 class="title-color">Room name</h3>
      <ul id="player-list" class="p-0 m-0 flex-grow-1 d-flex flex-column align-items-center">
        <li v-for="player in my_lobby.value.players" :key="player">
          {{ player.nick_name }}
        </li>
      </ul>
      <h5 class="font-color-is-danger fs-6 text-center fw-normal" v-if="my_lobby.value.players.length < 2">
        Aguardando outro jogador
      </h5>
      <ul class="p-0 m-0 d-flex w-100 justify-content-between">
        <li><button class="py-1 px-3 d-flex align-items-center fw-medium rounded-5 btn-leave-room"
            @click="">
            leaveROm
          </button></li>

        <li><button class="py-1 px-3 d-flex align-items-center fw-medium rounded-5 btn-start"
            :class="{ 'can-hover': (my_lobby.value.players.length >= 2) }" @click="start_game_view(my_lobby.value.id)">
            Play
          </button></li>
      </ul>
    </section>
      <ul class="p-0 m-0 fs-2 d-flex flex-column w-75 gap-2" v-if="my_lobby.value && my_lobby.value.players.length > 0">
        <h3 class="title-color align-self-center">Online players</h3>
        <li class="d-flex gap-2 online-player-item" v-for="p in all_players" :key="p" 
        @click="ask_to_join(p)">
          <icon class="m-0 p-0 border-0 rounded-5">invite</icon>
          <p class="m-0 p-0">{{ p.nick_name }}</p>
        </li>
      </ul>
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
const my_lobby = reactive({ value: { players: [] } })
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
    if (lobby) {
      all_players.value = response.data.filter(x => {
        return lobby.players.filter(y => x.email === y.email).length == 0
      })
    }
  })
}

const ask_to_join = (p) => {
  console.log('Ask to ' + p.email + ' to join your lobby')
}
const create_lobby_view = () => {
  create_lobby(player_store.getEmail).then(response => {
    my_lobby.value = response.data
  })
}

const join_lobby_view = ((id_lobby) => {
  join_lobby(id_lobby, player_store.getEmail).then(response => {
    if (response.data) {
      my_lobby.value = response.data
    } else {
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
    router.push({ name: 'game' })
  })
})
onBeforeMount(() => {
  list_lobbies()
})
</script>

<style scoped>
.title-color {
  color: var(--color-blue);
}

.room {
  cursor: pointer;
}

#player-list {
  color: var(--color-text);
}

.online-player-item {
  cursor: pointer;
}

.online-player-item p {
  font-size: 0.7em;
  color: var(--color-text);
}

.online-player-item icon {
  font-size: 0.6em;
  background-color: var(--color-purple);
  color: var(--color-white);
}

.player-container {
  cursor: pointer;
  background-color: blueviolet;
  width: 100%;
  text-align: center;
}

.btn-create-room {
  border: 1px solid var(--color-light-blue);
  border-radius: 1rem;
  font-weight: bold;
  cursor: pointer;
  background-color: var(--color-blue);
  color: var(--color-white);
  text-align: center;
}

.btn-leave-room {
  background-color: var(--color-red);
  border: 1px solid var(--color-red);
  opacity: 0.8;
}

.btn-leave-room:hover {
  opacity: 1;
}

.btn-start {
  border: 1px solid var(--color-blue);
  color: var(--color-background-primary);
  background-color: var(--color-light-blue);
  opacity: 0.6;
}

.can-hover.btn-start {
  background-color: var(--color-light-blue);
  opacity: 0.8;
}

.can-hover:hover {
  color: var(--color-background-terciary);
  opacity: 1;
}

.lobby_container {
  background-color: var(--color-background-terciary);
  border: 1px solid var(--color-purple);
  box-shadow: 5px 5px 100px rgba(162, 210, 251, 0.2);
  height: 45vh;
}
</style>