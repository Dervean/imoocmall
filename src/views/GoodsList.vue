<template>
    <div>
        <nav-header></nav-header>
        <nav-bread>
            <span>Goods</span>
        </nav-bread>
        <div class="accessory-result-page accessory-page">
            <div class="container">
                <div class="filter-nav">
                    <span class="sortby">Sort by:</span>
                    <span class="sortby">Sort by:</span>
                    <a
                        href="javascript:void(0)"
                        class="default cur"
                    >Default</a>
                    <a
                        href="javascript:void(0)"
                        class="price"
                        v-bind:class="{'sort-up':sortFlag}"
                        @click="sortGoods()"
                    >Price <svg class="icon icon-arrow-short">
                            <use xlink:href="#icon-arrow-short"></use>
                        </svg></a>
                    <a
                        href="javascript:void(0)"
                        class="filterby stopPop"
                        @click="showFilterPop"
                    >Filter by</a>
                </div>
                <div class="accessory-result">
                    <!-- filter -->
                    <div
                        class="filter stopPop"
                        id="filter"
                        v-bind:class="{'filterby-show':filterBy}"
                    >
                        <dl class="filter-price">
                            <dt>Price:</dt>
                            <dd><a
                                    href="javascript:void(0)"
                                    v-bind:class="{'cur': priceChecked==='all'}"
                                    @click="setPriceFilter('all')"
                                >All</a></dd>
                            <dd
                                v-for="(price, index) in priceFilter"
                                v-bind:key="index"
                            >
                                <a
                                    href="javascript:void(0)"
                                    @click="setPriceFilter(index)"
                                    v-bind:class="{'cur': priceChecked===index}"
                                >{{price.startPrice}} - {{price.endPrice}}</a>
                            </dd>
                        </dl>
                    </div>

                    <!-- search result accessories list -->
                    <div class="accessory-list-wrap">
                        <div class="accessory-list col-4">
                            <ul>
                                <li
                                    v-for="item in goodsList"
                                    v-bind:key='item.productId'
                                >
                                    <div class="pic">
                                        <a href="#"><img
                                                v-lazy="'/static/'+item.productImage"
                                                alt=""
                                            ></a>
                                    </div>
                                    <div class="main">
                                        <div class="name">{{item.productName}}</div>
                                        <div class="price">{{item.salePrice}}</div>
                                        <div class="btn-area">
                                            <a
                                                href="javascript:;"
                                                class="btn btn-cart"
                                                @click="addCart(item.productId)"
                                            >加入购物车</a>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                        <div
                            class="view-more-normal"
                            v-infinite-scroll="loadMore"
                            infinite-scroll-disabled="busy"
                            infinite-scroll-distance="20"
                        >
                            <span v-if='!alldone'>加载中.......</span>
                            <span v-if='alldone'>没有更多啦！</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 模态框 -->
        <modal
            v-bind:mdShow="mdShow"
            v-on:close="closeModal"
        >
            <p slot="message">
                请先登录,否则无法加入到购物车中!
            </p>
            <div slot="btnGroup">
                <a
                    class="btn btn--m"
                    href="javascript:;"
                    @click="mdShow = false"
                >关闭</a>
            </div>
        </modal>
        <modal
            v-bind:mdShow="mdShowCart"
            v-on:close="closeModal"
        >
            <p slot="message">
                <svg class="icon-status-ok">
                    <use
                        xmlns:xlink="http://www.w3.org/1999/xlink"
                        xlink:href="#icon-status-ok"
                    ></use>
                </svg>
                <span>加入购物车成功!</span>
            </p>
            <div slot="btnGroup">
                <a
                    class="btn btn--m"
                    href="javascript:;"
                    @click="mdShowCart = false"
                >继续购物</a>
                <router-link
                    class="btn btn--m btn--red"
                    href="javascript:;"
                    to="/cart"
                >查看购物车</router-link>
            </div>
        </modal>

        <!-- 遮罩 -->
        <div
            class="md-overlay"
            v-show="overLayFlag"
            @click.stop="closePop"
        ></div>
        <nav-footer></nav-footer>
    </div>
</template>
<script>
    import NavHeader from '@/components/NavHeader';
    import NavFooter from '@/components/NavFooter';
    import NavBread from '@/components/NavBread';
    import Modal from '@/components/Modal'
    import axios from 'axios';
    export default {
        data() {
            return {
                goodsList: [],
                page: 1,
                pageSize: 8,
                sortFlag: false,
                busy: true,
                alldone: false,
                mdShow:false,
                mdShowCart:false,
                priceFilter: [
                    {
                        startPrice: '0.00',
                        endPrice: '100.00'
                    },
                    {
                        startPrice: '100.00',
                        endPrice: '500.00'
                    },
                    {
                        startPrice: '500.00',
                        endPrice: '1000.00'
                    },
                    {
                        startPrice: '1000.00',
                        endPrice: '5000.00'
                    }
                ],
                priceChecked: 'all',
                filterBy: false,
                overLayFlag: false
            };
        },
        components: {
            NavHeader,
            NavFooter,
            NavBread,
            Modal
        },
        mounted() {
            this.getGoodsList();
        },
        methods: {
            getGoodsList(flag) {
                var params = {
                    page: this.page,
                    pageSize: this.pageSize,
                    sort: this.sortFlag ? 1 : -1,
                    priceLevel: this.priceChecked
                };

                this.alldone = false;
                axios.get('/goods/list', { params: params }).then(response => {
                    let res = response.data;
                    if (res.status === '0') {
                        // flag 鼠标向下滑多加载
                        if (flag) {
                            this.goodsList = this.goodsList.concat(res.result.list);

                            if (res.result.count < this.pageSize) {
                                this.busy = true;
                                this.alldone = true;
                            } else {
                                this.busy = false;
                            }
                        } else {
                            this.goodsList = res.result.list;
                            this.busy = false;
                        }
                    } else {
                        this.goodsList = [];
                    }
                });
            },

            addCart(productId) {
                // let reg = new RegExp("(^|)userId=([^;]*)(;|$)");
                // let arr = document.cookie.match(reg);
                // let userId = '';
                // if(arr){
                //     userId = arr[2];
                // }
                axios.post('/goods/addCart', {productId: productId }).then(respose => {
                    let res = respose.data;
                    if (res.status === '0') {
                        this.mdShowCart = true;
                        this.$store.commit("updateCartCount",1);
                    }
                    else{
                        this.mdShow = true;
                    }
                });
            },

            sortGoods() {
                this.sortFlag = !this.sortFlag;
                this.page = 1;
                this.getGoodsList();
            },

            setPriceFilter(index) {
                this.priceChecked = index;
                this.page = 1;
                this.getGoodsList();
            },

            loadMore() {
                this.busy = true;
                setTimeout(() => {
                    this.page++;
                    this.getGoodsList(true);
                }, 500);
            },

            closePop() {
                this.filterBy = false;
                this.overLayFlag = false;
                this.mdShowCart = false;
            },

            showFilterPop() {
                this.filterBy = true;
                this.overLayFlag = true;
            },

            closeModal(){
              this.mdShow = false;
              this.mdShowCart = false;
            },
        }
    };
</script>

