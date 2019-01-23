<template>
    <div>
        <h1>{{msg}}</h1>
        <Counter v-bind:num="num" v-on:incre="increment" v-on:decre="decrement"></Counter>
        <p>parent: {{num}}</p>
    </div>
</template>
<script>
import Counter from "./Counter"
export default {
    components:{
        Counter
    },
    data(){
        return{
            num:10,
            msg:"test $emit!"
        }
    },
    methods:{
        increment(){
            this.num += 1;
        },
        decrement(){
            this.num -= 1;
        }
    }
}
</script>
<style scoped>
h1, h2 {
  font-weight: normal;
}
</style>