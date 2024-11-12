<script setup lang="ts">
import {parseType} from "../utils"

// 使用props接收父界面传来的数据
const props = defineProps({
  productId: {
    type: Number,
    required: true
  },
  product: {
    type: Object,
    required: true
  }
})
</script>


<template>
  <el-card class="product-item-card" shadow="hover">
    <img  :src="props.product.imageUrl[0]" alt="图片" class="product-image">
    <div >
      <h1> {{ props.product.name }} </h1>
      <el-descriptions :column="1">
        <el-descriptions-item style="font-size: 10px " label="品类">
          {{ parseType(props.product.type) }}
        </el-descriptions-item>
        <el-descriptions-item style="font-size: 10px" label="价格">
          {{ props.product.price }} 元
        </el-descriptions-item>
        <el-descriptions-item style="font-size: 10px" label="库存">
          {{ props.product.stock }} 件
        </el-descriptions-item>
        <el-descriptions-item style="font-size: 10px" label="评分" v-if="props.product.score==null||props.product.score==0">
          未评分 
        </el-descriptions-item>
        <el-descriptions-item style="font-size: 10px" label="评分" v-if="props.product.score!=null&&props.product.score!=0">
          {{ parseFloat(props.product.score).toFixed(2) }}
        </el-descriptions-item>
      </el-descriptions>
    </div>
  </el-card>
</template>


<style scoped>
.product-item-card{
  border-style: solid;
  border-width: 1px;
  border-color: #E4E4E4;
  width: calc(33% - 14px);/*14px极限宽度*/
  padding: 10px 0px 0px 0px;
  margin-right: 10px;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  flex-direction: column;
  background: #fff;
  border-radius: 15px; /* 使显示的卡片边角更圆润 */
}
.store-item-card:nth-child(3n) {
  margin-right: 0;
}
.product-image {
  width:auto; /* 自适应宽度 */
  height: 100px; /* 设置固定高度 */
  /*居中
  display: block;*/
}

h1 {
  margin-top: 10px;
  text-align: center; 
}

.photo-div {
  display: flex;
  justify-content: center;
}
</style>
