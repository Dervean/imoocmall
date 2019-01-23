// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'

// 图片懒加载
import VueLazyload from 'vue-lazyload'
import infiniteScroll from  'vue-infinite-scroll'
import Vuex from 'vuex'

import './assets/css/base.css'
import './assets/css/checkout.css'
import './assets/css/product.css'

Vue.config.productionTip = false

Vue.use(VueLazyload, {
  loading: 'static/loading-svg/loading-spinning-bubbles.svg',
  try: 3 // default 1
});
Vue.use(infiniteScroll);
Vue.use(Vuex);

// 使用全局 filter
// import {currency} from '@/utils/currency'
// Vue.filter("currency",currency);

const store = new Vuex.Store({
  state: {
    nickName:'',
    cartCount:0
  },
  mutations: {
    //更新用户信息
    updateUserInfo(state, nickName) {
      state.nickName = nickName;
    },
    initCartCount(state,cartCount){
      state.cartCount = cartCount;
    },
    updateCartCount(state,cartCount){
      state.cartCount += cartCount;
    }
  }
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>',

  mounted(){
    this.checkLogin();
    this.getCartCount();
  },
  methods:{
    checkLogin(){
      axios.get("/users/checkLogin").then(res => {
        var res = res.data;
        if (res.status === "0") {
          this.$store.commit("updateUserInfo", res.result);
        }
        else{
          if(this.$route.path != "/"){
            this.$router.push("/");
          }
        }
      });
    },
    getCartCount(){
      axios.get("/users/getCartCount").then(res=>{
        var res = res.data;
        if(res.status === "0"){
          this.$store.commit("initCartCount",res.result);
        }
      });
    }
  }
})
