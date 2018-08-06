<template>
    <div class="box" tabIndex='1'>
        <div v-for="r_item in box.cells">
            <cell v-for='c_item in r_item'></cell>
        </div>
        <tile v-for='tile in tiles' :tile='tile' >
        </tile>
        <game-over :box='box' :onrestart="onRestart"></game-over>
    </div>
</template>

<script>
    import Cell from './Cell.vue'
    import Tile from './Tile.vue'
    import GameOver from './GameOver.vue'
    import {Box} from '../Box.js'
    export default {
        data(){
            return {
                box:new Box()
            }
        },
        mounted(){
            window.addEventListener('keydown',this.handleKeyDown.bind(this))
        },
        beforeDestroy(){
            window.removeEventListener('keydown', this.handleKeyDown.bind(this));
        },
        computed:{
            tiles(){
              return this.box.tiles.filter(tile => tile.value != 0)
            }
        },
        methods: {
            handleKeyDown(event){
                console.log(this.box.hasLost)
                if (this.box.hasWon()||this.box.hasLost()) {
                    console.log('over');
                    return;
                }
                if (event.keyCode >= 37 && event.keyCode <= 40) {
                    event.preventDefault();
                    var direction = event.keyCode - 37;
                    this.box.move(direction)
                }
            },
            onRestart(){
                this.box = new Box()
            }
        },
        components: {
            Cell,
            Tile,
            GameOver
        }
    }
</script>
