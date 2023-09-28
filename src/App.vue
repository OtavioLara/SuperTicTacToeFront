<script setup>
  import { ref } from 'vue';
  const is_darkMode = ref(true);
  function toggleDarkMode() {
    const body = document.querySelector('body');
    body.classList.toggle('dark-mode');

    is_darkMode.value = !is_darkMode.value;
  }

</script>

<template>
  <header class="d-flex justify-content-between align-items-center p-3">
    <h1 class="page-title p-0 m-0">Super Tic Tac Toe</h1>

    <button 
    class="btn-dark"
    type="button"
    @click="toggleDarkMode">
    <svg v-if="is_darkMode" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 384 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M223.5 32C100 32 0 132.3 0 256S100 480 223.5 480c60.6 0 115.5-24.2 155.8-63.4c5-4.9 6.3-12.5 3.1-18.7s-10.1-9.7-17-8.5c-9.8 1.7-19.8 2.6-30.1 2.6c-96.9 0-175.5-78.8-175.5-176c0-65.8 36-123.1 89.3-153.3c6.1-3.5 9.2-10.5 7.7-17.3s-7.3-11.9-14.3-12.5c-6.3-.5-12.6-.8-19-.8z"/></svg>
    <svg v-if="!is_darkMode" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M361.5 1.2c5 2.1 8.6 6.6 9.6 11.9L391 121l107.9 19.8c5.3 1 9.8 4.6 11.9 9.6s1.5 10.7-1.6 15.2L446.9 256l62.3 90.3c3.1 4.5 3.7 10.2 1.6 15.2s-6.6 8.6-11.9 9.6L391 391 371.1 498.9c-1 5.3-4.6 9.8-9.6 11.9s-10.7 1.5-15.2-1.6L256 446.9l-90.3 62.3c-4.5 3.1-10.2 3.7-15.2 1.6s-8.6-6.6-9.6-11.9L121 391 13.1 371.1c-5.3-1-9.8-4.6-11.9-9.6s-1.5-10.7 1.6-15.2L65.1 256 2.8 165.7c-3.1-4.5-3.7-10.2-1.6-15.2s6.6-8.6 11.9-9.6L121 121 140.9 13.1c1-5.3 4.6-9.8 9.6-11.9s10.7-1.5 15.2 1.6L256 65.1 346.3 2.8c4.5-3.1 10.2-3.7 15.2-1.6zM160 256a96 96 0 1 1 192 0 96 96 0 1 1 -192 0zm224 0a128 128 0 1 0 -256 0 128 128 0 1 0 256 0z"/></svg>
    </button>
  </header>
  <section id="router" class="d-flex justify-content-center">
    <router-view></router-view>
  </section>
</template>

<style>

  .btn-dark {
    width: 1.5em;
    height: 1.5em;
    background: url('./assets/moon.svg');
  }

  .page-title {
    color: var(--color-purple);
  }

  #app {
    min-height: 100vh;
    background-color: var(--color-background-primary);
    display: flex;
    flex-flow: column;
  }

  #router {
    margin: auto 0;
  }

  body.dark-mode {
    
    --color-background-primary: #0d1117;

    --color-background-secondary: #161b22;

    --color-background-terciary: #21262d;

    --color-gray: #89929b;

    --color-light-gray: #c6cdd5;

    --color-white: #ecf2f8;

    --color-red: #fa7970;

    --color-orange: #faa356;
  
    --color-green: #7ce38b;
  
    --color-light-blue: #a2d2fb;
  
    --color-blue: #77bdfb;
  
    --color-purple: #cea5fb;

  }

  body {
    
    --color-background-primary: #ffffff;

    --color-background-secondary: #9EA8B0;

    --color-background-terciary: #EAEDF2;

    --color-gray: #89929b;

    --color-light-gray: #c6cdd5;

    --color-white: #ecf2f8;

    --color-red: #D34441;

    --color-orange: #EC7933;
  
    --color-green: #43C94D;
  
    --color-light-blue: #6BC2D8;
  
    --color-blue: #527FF2;
  
    --color-purple: #7769BA;

  }

</style>
