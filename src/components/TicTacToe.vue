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
                        @click='(event) => click_in_matrix(i, j, event)'
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

const emit = defineEmits(['click_in_matrix'])
const font_size = 30
const props = defineProps(['blocked', 'matrix', 'winner'])

const blocked = props.blocked
const matrix = props.matrix
const winner = props.winner

const show_value = (v) => {
    if(v == 1){
        return 'O'
    }else if(v == 2){
        return 'X'
    }else{
        return ''
    }
}

function click_in_matrix(i, j, event) {
    if (event) {
        if(!blocked && matrix[i][j] == 0){
            emit('click_in_matrix', {'x_in': i, 'y_in': j})
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