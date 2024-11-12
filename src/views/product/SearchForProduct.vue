<script setup lang="ts">
import {ref} from 'vue';
import {productSelect} from "../../api/product.ts"
import ProductItem from '../../components/ProductItem.vue'
import {router} from '../../router'
import { SortDown,SortUp } from "@element-plus/icons-vue";
const productname=ref('') //商品名称
const priceRange = {
    min: ref(),
    max: ref(),
}
const sortOption = ref('')
const productkind=ref('ALL')
interface Product{
  id: number;
  name: string;
  type: string;
  price: number;
  storeId: string;
  description: string;
  imageUrl: string[];
  stock: number;
  score: number;
}
const products = ref<Product[]>([]);
function searchproducts(){
    if(priceRange.min.value == null||priceRange.min.value == '')priceRange.min.value = 0;
    if(priceRange.max.value == null||priceRange.max.value == '')priceRange.max.value = 99999999;
    if(priceRange.min.value>priceRange.max.value){
        let temp = priceRange.min.value;
        priceRange.min.value = priceRange.max.value;
        priceRange.max.value = temp;
    }
    if(productkind.value=='ALL')productkind.value='';
    let data = {
        name: productname.value,
        type: productkind.value,
        minPrice: priceRange.min.value,
        maxPrice: priceRange.max.value,
    }
    productSelect(data).then(res => {
        products.value=res.data.result;
        if(products.value.length==0)
            ElMessage({
                message: "未找到符合条件的商品,请更换搜索条件重新搜索",
                type: 'warning',
                center: true,
            })
    })
    if(productkind.value=='')productkind.value='ALL';
}
function sortupproducts(){
    if(sortOption.value == 'score'){
        products.value.sort((a,b) => a.score - b.score)
    }
    else if(sortOption.value == 'price'){
        products.value.sort((a,b) => a.price - b.price)
    }
    else if(sortOption.value == 'stock'){
        products.value.sort((a,b) => a.stock - b.stock)
    }
    else {
        ElMessage({
            message: "请选择排序条件",
            type: 'warning',
            center: true,
        })
    }
}
function sortdownproducts(){
    if(sortOption.value == 'score'){
        products.value.sort((a,b) => b.score - a.score)
    }
    else if(sortOption.value == 'price'){
        products.value.sort((a,b) => b.price - a.price)
    }
    else if(sortOption.value == 'stock'){
        products.value.sort((a,b) => b.stock - a.stock)
    }
    else {
        ElMessage({
            message: "请选择排序条件",
            type: 'warning',
            center: true,
        })
    }
}
function clearfilter(){
    productname.value = ''
    productkind.value = 'ALL'
    priceRange.min.value = ''
    priceRange.max.value = ''
}
function toProductDetailPage(productId: any) {
    
    router.push({
        path:'/ProductDetail',
        query:{
            productId:productId
        }
    })
}
</script>

<template>
    <el-container class="content-container bgimage" direction="vertical">
        <div class="top">
            <!--表单输入框开始-->
            <el-form ref="ruleFormRef" label-width="120px" class="input-form" status-icon>
                <el-form-item label="商品名称" prop="name">
                    <el-input v-model="productname"/>
                </el-form-item>
                <el-form-item label="商品类型" prop="kind">
                    <el-select id="kind"
                        v-model="productkind"
                        placeholder="请选择"
                        style="width: 200px;">
                    <el-option value="ALL" label="全部"/>
                    <el-option value="FOOD" label="食品"/>
                    <el-option value="CLOTHES" label="服饰"/>
                    <el-option value="FURNITURE" label="家具"/>
                    <el-option value="ELECTRONICS" label="电子产品"/>
                    <el-option value="ENTERTAINMENT" label="娱乐"/>
                    <el-option value="SPORTS" label="体育产品"/>
                    <el-option value="LUXURY" label="奢侈品"/>
                    <el-option value="OTHERS" label="其他"/>
                    </el-select>
                </el-form-item>
                <el-form-item label="价格区间" prop="price">
                    <el-input-number v-model="priceRange.min.value" :min="0" placeholder="最低价格"></el-input-number>
                    <el-input-number v-model="priceRange.max.value" :min="0" placeholder="最高价格"></el-input-number>
                </el-form-item>
            </el-form>
            <!--表单输入框结束-->
            <!--表单按钮组开始-->
            <div class="btns">
                <el-button type="primary" @click="searchproducts"> 搜索 </el-button>
                <el-button type="primary" @click="clearfilter"> 清空条件 </el-button>
                <el-select v-model="sortOption" placeholder="请选择排序条件" style="width: 200px;">
                    <el-option value="score" label="按评分排序"/>
                    <el-option value="price" label="按价格排序"/>
                    <el-option value="stock" label="按库存排序"/>
                </el-select>
                <el-button link type="primary" @click="sortupproducts">
                    <el-icon name="sortup"><SortUp/></el-icon>
                    升序 
                </el-button>
                <el-button link type="primary" @click="sortdownproducts">
                    <el-icon name="sortdown"><SortDown/></el-icon>
                    降序
                </el-button>
            </div>
        </div>
            <!--表单按钮组结束--> 
        <div class="all-product-main">
            <ProductItem class="product-item-list"
            v-for="productVO in products" :productId="productVO.id" :product="productVO"
            @click="toProductDetailPage(productVO.id)"/>
        </div>
    </el-container>
</template>
                           
<style scoped> 
.el-button {
    margin-right: 10px;  /* 右边距 */
    margin-left: 0px; /* 左边距 */
}
.bgimage {
  background-image: url("../../assets/shopping-1s-1084px.svg");
}
.content-container{ 
    /*与上端保持一定距离*/
    margin-top:10px;
    width:100%; 
    .top{ 
        width:100%; 
        border:1px solid#ccc; 
        box-shadow:3px 1px rgb(223,217,217); 
        padding:10px 0; 
        flex:2; 
        display:flex; 
        flex-direction:column; 
        justify-content:space-between; 
        background-color: #fff;
        /*输入表单*/
        .input-form{ 
            display:flex; 
            flex-wrap:wrap; 
            justify-content:flex-start; 
            vertical-align:middle; 
            
        } 
        /*按钮组*/
        .btns{ 
            display:flex; 
            padding:0 10px; 
            margin-left:40px; 
        } 
    } 
    /*表格*/
    .all-product-main {
        display: flex;
        flex-direction: row;
        padding: 20px;
        flex-flow: wrap;
        align-content: start;
        justify-content: start;
        flex:12;
    }
    .product-item-list {
        display: flex;
        padding: 2px;
        flex-flow: wrap;
        justify-content: center;
        align-content: start;
    }
}
</style>