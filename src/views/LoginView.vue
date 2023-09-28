<template>
  <main class="d-flex">
    <form 
    id="login-form" 
    class="d-flex flex-column p-3 align-self-center">

      <div class="form-floating mb-3">
        <input 
          type="email" 
          @input="clear_mensages" 
          class="form-control" 
          id="floatingInput" 
          placeholder="name@example.com" 
          v-model="player.email">

        <label for="floatingInput">Email address</label>
      </div>

      <div class="form-floating mb-3">
        <input 
        type="password" 
        @input="clear_mensages" 
        class="form-control" 
        id="floatingPassword" 
        placeholder="Password" 
        v-model="player.password">

        <label for="floatingPassword" >Password</label>
      </div>

      <div v-if="is_signingin" class="form-floating mb-3">
        <input 
        type="text" 
        @input="clear_mensages" 
        class="form-control" 
        id="floatingNick" 
        placeholder="Nick name" 
        v-model="player.nick_name">

        <label for="floatingNick" >Nickname</label>
      </div>

      <ul id="login-message" class="d-flex p-0 justify-content-center">
        <li 
          v-if="error_menssage != ''" 
          style="color: var(--color-red)">
          {{ error_menssage }}
        </li>

        <li 
          v-if="success_menssage != ''" 
          style="color: var(--color-green)">
          {{ success_menssage }}
        </li>
      </ul>

      <ul class="d-flex justify-content-around p-0">
        <li v-if="!is_signingin" >
          <button 
            :class="{'hide': is_signingin}"
            @click="login_button" 
            type="submit" 
            class="btn btn-primary">
            Login
          </button>
        </li>

        <li>
          <button 
            @click="signin_button" 
            type="submit" 
            class="btn" 
            :class="{'btn-secondary': !is_signingin, 'btn-primary': is_signingin}">
            Sign in
          </button>
        </li>
      </ul>

      <div class="align-self-center">
        <a id="back-to-login" v-if="is_signingin" @click="back_login" class="back-menu-link">Back to login</a>
      </div>
    </form>
  </main>
</template>

<script setup>
  import { storeToRefs } from 'pinia'
  import { useRouter } from 'vue-router'
  import { login, signin } from '@/services/services'
  import { onMounted, reactive, ref } from 'vue'
  import { usePlayerStore } from '@/stores/user_store'

  const router = useRouter()
  
  const is_signingin = ref(false)
  const error_menssage = ref('')
  const success_menssage = ref('')
  const player = reactive({})

  const player_store = usePlayerStore()
  const {email, nick_name} =  storeToRefs(player_store)
  
  const login_button = (event) => {
    event.preventDefault();

    login(player).then( response => {
      if(response.data.error){
        error_menssage.value = response.data.error
      } else {
        console.log(player)
        email.value = response.data.email
        nick_name.value = response.data.nick_name
        router.push({ name: 'lobby'})
      }
    })
  }
  

  const signin_button = (event) => {
    event.preventDefault();

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

#back-to-login {
  font-size: 0.75em;
}
body.dark-mode #back-to-login {
  color: var(--color-light-blue);
}

#login-form {
    background-color: var(--color-background-terciary);
    border-radius: 1em;
}

li {
    list-style: none;
}

#login-message {
  height: 1.5em;
}

.back-menu-link{
  cursor: pointer;
}
</style>