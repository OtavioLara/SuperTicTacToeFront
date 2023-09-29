<template>
  <main class="p-0 m-0 min-vw-100 d-flex flex-column align-items-center gap-3 flex-md-row px-md-4 gap-md-0 justify-content-md-around justify-content-lg-center gap-lg-5">
    <section class="lobby_container w-75 rounded-4 align-items-center d-flex flex-column max-w-400px p-2"
      v-if="!(my_lobby.value && my_lobby.value.players.length > 0)">
      <h3 class="title-color">Rooms</h3>
      <ul class="room-list p-0 m-0 flex-grow-1 d-flex flex-column align-items-left gap-2">
        <li v-for="l in lobbies" :key="l" class="room gap-2 align-items-baseline d-flex p-0 m-0" @click="join_lobby_view(l.id)"
          :class="{'is-full': (l.players.length >= 2)}">
          <fa 
          v-if="l.players.length < 2"
          class="empty-icon"
          :icon="['fa', 'person']"/>
          <fa 
          v-if="l.players.length >=2"
          class="full-icon"
          :icon="['fa', 'person-circle-exclamation']"/>
          <h4 class="m-0 p-0">{{ l.players[0].nick_name }}'s room</h4>
        </li>
      </ul>
      <button class="py-1 px-2 d-flex align-items-center btn-create-room" @click="create_lobby_view">Create room</button>
    </section>

    <section class="lobby_container w-75 rounded-4 align-items-center d-flex flex-column max-w-400px p-2"
      v-if="my_lobby.value && my_lobby.value.players.length > 0" v-bind="my_lobby">
      <h3 class="title-color">{{ my_lobby.value.players[0].nick_name }}'s room</h3>
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
            <fa :icon="['fas', 'right-from-bracket']" />
          </button></li>

        <li><button class="p-0 d-flex flex-column align-items-center justify-content-center rounded-5 btn-start"
            :class="{ 'can-hover': (my_lobby.value.players.length >= 2) }" @click="start_game_view(my_lobby.value.id)">
            <fa :icon="['fas', 'play']"/>
          </button></li>
      </ul>
    </section>
    <section class="d-flex flex-column w-100 w-auto">
      <ul class="players-container max-w-400px p-0 m-0 fs-2 align-self-center d-flex flex-column w-75 align-self-md-end gap-2 px-md-3"
      v-if="my_lobby.value && my_lobby.value.players.length > 0">
        <h3 class="title-color align-self-center">Online players</h3>
        <li class="d-flex align-items-center gap-2 online-player-item" v-for="p in all_players" :key="p" 
        @click="ask_to_join(p)">
          <span class="m-0 p-0 d-flex flex-column justify-content-center border-0 rounded-5 lh-1"><fa :icon="['fas', 'plus']"/></span>
          <p class="m-0 p-0">{{ p.nick_name }}</p>
        </li>
      </ul>
    </section>
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

.empty-icon {
  color: var(--color-green);
}

.max-w-400px {
  max-width: 400px;
}

.is-full {
  order: 2;
}

.full-icon ~ h4 {
  opacity: 0.5;
  cursor: default;
}

.full-icon {
  color: var(--color-orange);
}
.title-color {
  color: var(--color-blue);
}

.room-list {
  overflow-y: scroll;
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

.online-player-item span {
  font-size: 0.8em;
  width: 1.2em;
  height: 1.2em;
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
  color: var(--color-white);
  opacity: 0.8;
  font-size: 1.7em;
  width: 1.5em;
  height: 1.5em;
}

.btn-leave-room svg {
  position: relative;
  left: -0.3em;
}

.btn-leave-room:hover {
  opacity: 1;
}

.btn-start {
  position: relative;
  border: 1px solid var(--color-green);
  background-color: var(--color-light-blue);
  color: var(--color-white);
  opacity: 0.6;
  font-size: 1.7em;
  width: 1.5em;
  height: 1.5em;
}

.btn-start svg {
  position: absolute;
  left: 30%;
}

.can-hover.btn-start {
  background-color: var(--color-green);
  opacity: 0.8;
}

.players-container {
  min-width: 200px;
  overflow-x: hidden;
}

.can-hover:hover {
  opacity: 1;
}

.lobby_container {
  background-color: var(--color-background-terciary);
  border: 1px solid var(--color-purple);
  box-shadow: 5px 5px 100px rgba(162, 210, 251, 0.2);
  height: 45vh;
}

@media only screen and (min-width: 768px) {
  .players-container {
  max-height: 300px;
  overflow-y: scroll;
  box-shadow: inset 0 -2px 4px var(--color-text-translucid);
  min-width: 300px;
}
}
</style>