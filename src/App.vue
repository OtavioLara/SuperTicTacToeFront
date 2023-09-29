<script setup>
  import headerTitle from './components/headerTitle.vue';
</script>

<template>
  <headerTitle/>
  <section id="router" class="d-flex justify-content-center">
    <router-view></router-view>
  </section>
</template>

<style>
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

    --color-text: #ecf2f8;

    color: var(--color-text);

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
  
    --color-light-blue: rgb(107, 194, 216);
  
    --color-blue: rgb(82, 127, 242);
  
    --color-purple: rgb(119, 105, 186);

    --color-text: #161b22;

    color: var(--color-text);

  }

  .font-color-is-danger {
    color: var(--color-red);
  }

  li {
    list-style: none;
  }

</style>
