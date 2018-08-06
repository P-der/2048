<template>
    <div class="overlay" v-show="show">
        <p class="message">{{contents}}</p>
        <button class="tryAgain" @click="restart" >Try again</button>
    </div>
</template>

<script>

    export default{
        data(){
            return{

            }
        },
        props:{
            box:{
                type:Object,
                required:true
            },
            onrestart:{
                type:Function,
                required:true
            }
        },
        computed:{
            show(){
                console.log(this.box.hasLost())
                return this.box.hasWon() || this.box.hasLost()
            },
            contents(){
                if(this.box.hasWon()){
                    return 'You are Win'
                }else if(this.box.hasLost()){
                    return ' You are Lost , Game Over'
                }else {
                    return ''
                }
            }
        },
        methods:{
            restart(){
                this.onrestart && this.onrestart();
            }
        }
    }
</script>
