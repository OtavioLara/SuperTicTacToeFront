<template>
    <div class="tictac-template">
            <div v-if="matrix" class='tictac-main' :style="{backgroundColor: (blocked ? 'gray' : 'black')}">
                <div v-for='(vector, i) in matrix'  
                    :key='vector' 
                    :index='i'
                    class='tictac-row'
                >
                    <div v-for='(elem, j) in vector'  
                        :key='elem' 
                        :index='j'
                        :style="{ fontSize: font_size + 'px'}"
                        class='tictac-element' ref='test'
                        @click='(event) => update_matrix_in(i, j, event)'
                    >
                        {{show_value(matrix[i][j])}}
                    </div>
                </div>
            </div>
        <div v-if="winner != 0" class="tictac-big-symbol">
            {{show_value(winner)}}
        </div>
    </div>
</template>

<script setup>
import { update_matrix } from '@/services/services';
const emit = defineEmits(['update_matrix'])
const font_size = 30
const props = defineProps(['myx', 'myy', 'game_data', 'main_matrix'])
const myx = props.myx
const myy = props.myy
const blocked = props.game_data.blocked_matrix[myx][myy]
const matrix = props.game_data.full_matrix[myx][myy]
const winner = props.game_data.main_matrix[myx][myy]

const show_value = (v) => {
    if(v == 1){
        return 'O'
    }else if(v == 2){
        return 'X'
    }else{
        return ''
    }
}

function update_matrix_in(i, j, event) {
    if (event) {
        if(!blocked){
            update_matrix(myx, myy, i, j).then(response => {
                emit('update_matrix', response.data)
            })
        }
    }
  }
</script>

<style scoped>
    @import "../assets/TicTacToe.css";
    .tictac-big-symbol{
    width: 100%;
    height: 100%;
    opacity: 50%;
    font-size: 10rem;
    position:absolute;
    background-color: white;
    left: 0;
    top: 0;
  }
  .tictac-template{
    position: relative;
  }
</style>