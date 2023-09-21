<template>
    <div class='tictac-main' :style="{backgroundColor: (blocked ? 'gray' : 'black')}">
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
                {{matrix[i][j]}}
            </div>
        </div>
    </div>
</template>

<script setup>
import { update_matrix } from '@/services/services';
import { ref, onMounted, reactive, computed} from 'vue'
const emit = defineEmits(['update_matrix'])
const test = ref(null)
const font_size = 30
const props = defineProps(['myx', 'myy', 'blocked'])
const myx = props.myx
const myy = props.myy
const blocked = props.blocked
const matrix = ref([
            [0,0,0],
            [0,0,0],
            [0,0,0]
        ])

function update_matrix_in(i, j, event) {
    if (event) {
        update_matrix(myx, myy, i, j).then(response => {
            emit('update_matrix', response.data)
            matrix.value[i][j] = response.data.player
        })
    }
  }

onMounted(() => {

})
</script>

<style scoped>
    @import "../assets/TicTacToe.css";
    
</style>