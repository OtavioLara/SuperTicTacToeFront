<template>
  <main class="p-0 m-0 min-vw-100 d-flex flex-column align-items-center gap-3">
    
    <!-- Show all lobbies -->  
    <section v-if="!get_my_lobby" class="lobby_container w-75 rounded-4 align-items-center d-flex flex-column p-2">
      <h3 class="title-color">Rooms</h3>
      <ul class="p-0 m-0 flex-grow-1 d-flex flex-column align-items-center">
        <li v-for="l in lobbies" :key="l" class="room p-0 m-0" @click="join_lobby(l)">
          <h4 class="m-0 p-0">{{ l.players[0].name }}'s room</h4>
        </li>
      </ul>
      <button class="py-1 px-2 d-flex align-items-center btn-create-room" @click="create_lobby">Create room</button>
    </section>

    <!-- Show your lobby -->
    <section v-if="get_my_lobby" class="lobby_container w-75 rounded-4 align-items-center d-flex flex-column p-2">
      <h3 class="title-color"> {{get_my_lobby.players[0] && get_my_lobby.players[0].name}}'s Room</h3>
      <ul id="player-list" class="p-0 m-0 flex-grow-1 d-flex flex-column align-items-center">
        <li v-for="player in get_my_lobby.players" :key="player">
          {{ player.name + ' - ready: '+ player.ready }}
        </li>
        <button @click="check_ready">ready</button>
      </ul>
      <h5 class="font-color-is-danger fs-6 text-center fw-normal" v-if="get_my_lobby.players.length < 2">
        Aguardando outro jogador
      </h5>
      <ul class="p-0 m-0 d-flex w-100 justify-content-between">
        <li><button class="py-1 px-3 d-flex align-items-center fw-medium rounded-5 btn-leave-room" @click="leave_lobby(get_my_lobby)">
            leaveROm
          </button></li>

        <li><button class="py-1 px-3 d-flex align-items-center fw-medium rounded-5 btn-start"
            :class="{ 'can-hover': (get_my_lobby.players.length >= 2) }" @click="start_game()">
            Play
          </button></li>
      </ul>
    </section >

    <!-- List all players that are not in your lobby -->
    <ul v-if="get_my_lobby" class="p-0 m-0 fs-2 d-flex flex-column w-75 gap-2" >
      <h3 class="title-color align-self-center">Online players</h3>
      <li class="d-flex gap-2 online-player-item" v-for="p in get_all_players" :key="p" 
      @click="ask_to_join(p)">
        <i class="m-0 p-0 border-0 rounded-5">invite</i>
        <p class="m-0 p-0">{{ p.name }}</p>
      </li>
    </ul>
    <div>
      <h4> invites </h4>
      <div v-for="n in get_my_invites" :key="n">
        {{ get_player_from_uid(n.from).name }} invited you to play
        <button @click="accept_invitation(n)">Accept</button>
        <button @click="decline_invitation(n)">Decline</button>
      </div>
    </div>
  </main>
</template>


<script setup>

  import { useRouter } from 'vue-router'
  
  import { useGameStore } from '@/stores/game_store'
  import { onBeforeMount, computed, ref } from 'vue';


  import { useDatabase, getCurrentUser, useDatabaseList } from 'vuefire'
  import { ref as dbRef, push, set, update, remove, onChildChanged, onChildAdded} from 'firebase/database'

  const game_store = useGameStore()
  const db = useDatabase()
    
  const cur_player = ref('')

  const players_ref = dbRef(db, 'players')
  const all_players = useDatabaseList(players_ref)
  
  const lobby_ref = dbRef(db, 'lobby')
  const lobbies = useDatabaseList(lobby_ref)

  const invites_ref = dbRef(db, 'invites')
  const invites = useDatabaseList(invites_ref)

  const router = useRouter()

  let my_player_ref = ref('')

  const get_my_invites = computed(() =>  invites.value ? invites.value.filter( n => n.to === cur_player.value.uid) : [])
  const get_all_players = computed(() => {
    if(get_my_lobby.value && all_players.value){
      return all_players.value.filter(p => !get_my_lobby.value.players.find(lp => lp.uid === p.id))
    }
    return all_players
  })
  const get_player_from_uid = (player_uid) =>{
    return all_players.value.find(p => p.id == player_uid)
  }
  function create_lobby() {
    if(!get_my_lobby.value){
      push(lobby_ref, {players: [{'uid': cur_player.value.uid, 'name': cur_player.value.displayName, 'ready': false}]})
    }else{
      console.log('User already has a lobby')
    }
  }
  
  function get_player_lobby(player_uid){
      return lobbies.value.find(l => l.players.find(p => p.uid == player_uid))
  }

  const get_my_lobby = computed(() => {
    if(!cur_player.value || !lobbies.value)
      return {players : []}
    const lobby = get_player_lobby(cur_player.value.uid)
    if(lobby && lobby.id){
      onChildAdded(dbRef(db, 'lobby/'+lobby.id), (data) => {
        if(lobby.start_game && lobby.start_game.game_uid){
          join_game(lobby.start_game.game_uid)
        }
      })
    }
    return lobby
  })

  const join_lobby = (lobby) => {
    if(lobby.players.length == 2){
      console.log("Lobby is full")
      return
    }
    if(lobby.players.find(p => p.uid == cur_player.value.uid)){
      console.log("You have already joined this lobby")    
      return
    }
    update(dbRef(db, 'lobby/'+lobby.id+'/players/1'), {'uid': cur_player.value.uid, 'name': cur_player.value.displayName, 'ready': false})
  }
  function check_ready(){
    const clone_players = [...get_my_lobby.value.players]
    clone_players.map(p => {
      if(p.uid == cur_player.value.uid){
        p.ready = !p.ready
      }
      return p
    })
    set(dbRef(db, 'lobby/'+get_my_lobby.value.id+'/players'), clone_players)
  }
  const leave_lobby = (lobby) => {
    if(lobby.players.length == 1){
      remove(dbRef(db, 'lobby/'+lobby.id))
    }
    if(lobby.players.length == 2){      
      set(dbRef(db, 'lobby/'+lobby.id+'/players'), lobby.players.filter(p => p.uid !== cur_player.value.uid))
    }
  }
  
  const ask_to_join = (player) => {
    push(dbRef(db, 'invites'), {'from': cur_player.value.uid, 'to': player.id})
  }
  const accept_invitation = (invite) => {
    remove(dbRef(db, 'invites/'+invite.id))
    const lobby = get_player_lobby(invite.from)
    if(lobby){
      join_lobby(lobby)
    }else{
      console.log('player is not in a lobby')
    }
  }
  const decline_invitation = (invite) => {
    remove(dbRef(db, 'invites/'+invite.id))
  }

  const start_game = () => {
    const my_lobby = get_my_lobby.value
    if(my_lobby.players.length < 2){
      console.log('At least 2 players to play')
      return
    }
    const game_dict = {}
    game_dict['players'] = my_lobby.players
    game_dict['game_matrix'] = [[[[0, 0, 0], [0, 0, 0], [0, 0, 0]], [[0, 0, 0], [0, 0, 0], [0, 0, 0]], [[0, 0, 0], [0, 0, 0], [0, 0, 0]]], 
                                [[[0, 0, 0], [0, 0, 0], [0, 0, 0]], [[0, 0, 0], [0, 0, 0], [0, 0, 0]], [[0, 0, 0], [0, 0, 0], [0, 0, 0]]], 
                                [[[0, 0, 0], [0, 0, 0], [0, 0, 0]], [[0, 0, 0], [0, 0, 0], [0, 0, 0]], [[0, 0, 0], [0, 0, 0], [0, 0, 0]]]]
    game_dict['main_matrix'] = [[0, 0, 0], [0, 0, 0], [0, 0, 0]]
    game_dict['turn'] = 0
    game_dict['all_free'] = true
    game_dict['last_x'] = 0
    game_dict['last_y'] = 0
    game_dict['global_winner'] = -1
    push(dbRef(db, 'game'), game_dict).then(response => {
      game_store.setGameUid(response.key)
      call_friend(response.key)
      
      sleep(2000).then(() => { router.push({name: 'game'}) });

      
    })
  }
  function call_friend(game_uid){
    set(dbRef(db, 'lobby/'+get_my_lobby.value.id+'/start_game'), {'game_uid': game_uid})
  }
  function join_game(game_uid){
    game_store.setGameUid(game_uid)
    remove(dbRef(db, 'lobby/'+get_my_lobby.value.id))
    router.push({name: 'game'})
  }
  getCurrentUser().then( response => {
    cur_player.value = response
    my_player_ref.value = dbRef(db, 'players/' + response.uid)
  })
  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
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

.online-player-item i {
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