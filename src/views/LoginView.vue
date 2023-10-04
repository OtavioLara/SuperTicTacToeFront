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
  import { useRouter } from 'vue-router'
  // import { login, signin } from '@/services/services'
  import { reactive, ref } from 'vue'
  import { usePlayerStore } from '@/stores/user_store'
  import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile} from "firebase/auth";
  import { useDatabase, useFirebaseAuth, getCurrentUser } from 'vuefire'
  import { set, ref as dbRef} from 'firebase/database'
  
  const auth = useFirebaseAuth();
  const db = useDatabase()

  const router = useRouter()
  
  const is_signingin = ref(false)
  const error_menssage = ref('')
  const success_menssage = ref('')
  const player = reactive({})

  const player_store = usePlayerStore()

  const login_button = (event) => {
    event.preventDefault();
    signInWithEmailAndPassword(auth, player.email, player.password)
    .then((userCredential) => {
        console.log(userCredential)
        player_store.setUser(userCredential.user)
        router.push({ name: 'lobby'})
    }).catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode)
      console.log(error_menssage)
      error_menssage.value = "Email or password incorrect"
    });
  }

  const signin_button = (event) => {
    event.preventDefault();
    if(is_signingin.value){
      createUserWithEmailAndPassword(auth, player.email, player.password)
      .then((userCredential) => {
        updateProfile(userCredential.user, {displayName: player.nick_name})
        player_store.setUser(userCredential.user)
        set(dbRef(db, "players/"+userCredential.user.uid), {
          name: player.nick_name
        })
        router.push({ name: 'lobby'})
      }).catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, error_menssage)
        error_menssage.value = "user cant be created"
      });
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