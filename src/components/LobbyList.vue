<template>
    <div class="list-container">
        <div v-for="elem in list" 
        :key="elem" 
        class="item-container"
        @click="elem_action(elem)">
            <LobbyListItem></LobbyListItem>
        </div>
    </div>
</template>
  
<script setup>
    import { LobbyListItem } from '@/components/LobbyListItem'
    const props = defineProps(['list', 'elem_action', 'LobbyListItem'])
    
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
  .item-container{
    cursor: pointer;
    background-color: blueviolet;
    width: 100%;
    text-align: center;
  }
</style>
