<script setup lang="ts">
import {ref} from 'vue'
import {getStoreData} from "../../api/store.ts"
import {router} from '../../router'
import StoreItem from '../../components/StoreItem.vue'
import { Search } from "@element-plus/icons-vue";
interface Store {

  id: number;
  storeName: string;
  logoUrl: string;
  description: string;

}
const stores = ref<Store[]>([]);
handleStoreData()
function handleStoreData(){
    getStoreData().then(res => {
        stores.value=res  
    })
}
function toStoreDetailPage(storeId: any) {
  router.push({
      path:'/storeDetail',
      query:{
        storeId:storeId
   }})
}
function jumptosearch(){
  router.push({
      path:'/searchForProduct'
  })
}

</script>

<template>
  <el-main class="bgimage">
    <div>
       <h1>商店列表
       <el-button @click.prevent="handleStoreData"
                       type="primary" style="display: none">
              刷新列表
       </el-button>
       <el-button @click.prevent="jumptosearch" link type="primary" 
       style="float: right; font-size: 22px; margin-right: 60px; margin-top: 6px">
          <el-icon name="search"><Search/></el-icon>
              搜索
       </el-button>
      </h1>
    </div>
    <div class="store-item-list">
      <StoreItem v-for="storeVO in stores" :storeId="storeVO.id" @click="toStoreDetailPage(storeVO.id)"/>
    </div>
</el-main>
</template>

<style scoped>
.bgimage {
  background-image: url("../../assets/shopping-1s-1084px.svg");
}
.store-item-list {
  display: flex;
  padding: 2px;
  flex-flow: wrap;
  justify-content: center;
  align-content: start;
}
</style>