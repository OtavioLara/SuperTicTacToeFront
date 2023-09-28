<template>
  <main>
    <div>
      <div class="form-floating mb-3">
        <input type="email" @input="clear_mensages" class="form-control" id="floatingInput" placeholder="name@example.com" v-model="player.email">
        <label for="floatingInput">Email address</label>
      </div>
      <div class="form-floating mb-3">
        <input type="password" @input="clear_mensages" class="form-control" id="floatingPassword" placeholder="Password" v-model="player.password">
        <label for="floatingPassword" >Password</label>
      </div>
      <div v-if="is_signingin" class="form-floating mb-3">
        <input type="text" @input="clear_mensages" class="form-control" id="floatingNick" placeholder="Nick name" v-model="player.nick_name">
        <label for="floatingNick" >Nick</label>
      </div>
      <div class="buttons">
        <div v-if="error_menssage != ''" style="color: red">{{ error_menssage }}</div>
        <div v-if="success_menssage != ''" style="color: green">{{ success_menssage }}</div>
      </div>
      <div class="buttons">
        <button v-if="!is_signingin" @click="login_button" class="btn btn-primary">Login</button>
        <button @click="signin_button" class="btn" :class="{'btn-secondary': !is_signingin, 'btn-primary': is_signingin}">Sign in</button>
      </div>
      <div class="buttons">
        <a v-if="is_signingin" @click="back_login" class="back-menu-link">Back to login</a>
      </div>
      
    </div>
  </main>
</template>

<script setup>
  import { storeToRefs } from 'pinia'
  import { useRouter } from 'vue-router'
  import { login, signin } from '@/services/services'
  import { onMounted, reactive, ref, computed } from 'vue'
  import { usePlayerStore } from '@/stores/user_store'

  const router = useRouter()
  
  const is_signingin = ref(false)
  const error_menssage = ref('')
  const success_menssage = ref('')
  const player = reactive({})

  const player_store = usePlayerStore()

  const login_button = () => {
    login(player).then( response => {
      if(response.data.error){
        error_menssage.value = response.data.error
      } else {
        console.log(player)
        player_store.setEmail(response.data.email)
        player_store.setNickName(response.data.nick_name)
        router.push({ name: 'lobby'})
      }
    })
  }
  const signin_button = () => {
    if(is_signingin.value){
      signin(player).then( response => {
        console.log(response.data)
        if(response.data.error){
          error_menssage.value = response.data.error
        }else{
          success_menssage.value = 'User added'
        }
      })
    }
    is_signingin.value = !is_signingin.value
  }
  const back_login = () => {
    is_signingin.value = false
  }
  const clear_mensages = () => {
    success_menssage.value = ''
    error_menssage.value = ''
  }
</script>

<style scoped>
.buttons{
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-evenly;
}
.back-menu-link{
  cursor: pointer;
}
</style>