<script setup lang="ts">
import {ref,defineProps,defineExpose,defineEmits} from 'vue';
import {getThisProduct} from '../../api/product.ts'
import {orderCreate} from '../../api/order.ts'
import MyPay from './MyPay.vue'
import { userInfo } from '../../api/user.ts';
// 定义props
const {title,productId}=defineProps({
    title: {
        type: String,
        default: '标题',
    },
    productId: {
        required: true
    }
});
let telList = ref<string[]>([])
let addressList = ref<string[]>([])
getUserInfo()
function getUserInfo() {
  userInfo().then(res => {
    telList.value = res.data.result.receivePhone
    addressList.value = res.data.result.receiveAddress
  })
}
interface Product{
  id: number;
  name: string;
  type: string;
  price: number;
  storeId: string;
  description: string;
  imageUrl: string[];
  stock: number;
}
const product = ref<Product>();
function handleProductData(id: any){
    getThisProduct(id).then(res => {
        product.value=res
    })
}
const orderId = ref(0);
// 定义emits
const emit = defineEmits(['submit','closed']);
// 定义表单数据
let dialogVisible = ref(false);
let formData = ref({
    productnumber: 1,
    payMethod: '',
    receiveMethod: '',
    address: '',
    phone: '',
});
let formRef = ref();
let formRules = ref({
    productnumber: [{
        required: true,
        message: '请输入购买数量',
        trigger: 'blur',
    }, ],
    payMethod: [{
        required: true,
        message: '请选择购买方式',
        trigger: 'blur',
    }, ],
    receiveMethod: [{
        required: true,
        message: '请选择提货方式',
        trigger: 'blur',
    }, ],
    address: [{
        required: true,
        message: '请选择收货地址',
        trigger: 'blur',
    }, ],
    phone: [{
        required: true,
        message: '请选择联系电话',
        trigger: 'blur',
    }, ],
});
// 重置表单
function resetForm() {
    formData.value = {
        productnumber: 1,
        payMethod: '',
        receiveMethod: '',
        address: addressList.value[0],
        phone: telList.value[0],
    };
}
// 提交数据
function submitForm() {
    formRef.value.validate((valid: any) => {
        if(formData.value.productnumber>product.value.stock){
            ElMessage({
                customClass: 'customMessage',
                type: 'error',
                message: '库存不足!',
            })
        }else if(formData.value.productnumber<=0){
            ElMessage({
                customClass: 'customMessage',
                type: 'error',
                message: '购买数量需大于0!',
            })
        }
        else {
            if (valid) {
                dialogVisible.value = false;
                emit('submit', orderCreate({
                    quantity: formData.value.productnumber,
                    payMethod: formData.value.payMethod,
                    pickUpMethod: formData.value.receiveMethod,
                    productId: productId,
                    storeId: product.value.storeId,
                    perPrice: product.value.price,
                    totalPrice: product.value.price*formData.value.productnumber,
                    address: formData.value.receiveMethod === 'PICKUP' ? undefined : formData.value.address,
                    phone: formData.value.phone,
                    orderStatus: "UNPAID"
                }).then(res => {
                    if (res.code === '400') {  //类型守卫，它检查 res.data 对象中是否存在名为 code 的属性
                        ElMessage({
                            message: res.msg,
                            type: 'error',
                            center: true,
                        })
                    } else{
                        orderId.value = res;
                        ElMessage({
                            message: "订单提交成功",
                            type: 'success',
                            center: true,
                        })
                        open(orderId.value)
                    }
                }));
            }
        }
    });
}
// 关闭弹窗
function dialogClose(){
    emit('closed');
}
defineExpose({
    showDialog: () => {
        resetForm();
        handleProductData(productId);
        dialogVisible.value = true;
    },
    hideDialog: () => {
        dialogVisible.value = false;
    },
});
const myPayRef = ref();
const open= (id: any) => {
    myPayRef.value.showDialog(id);
};
const submit = () => {
  console.log('Form submitted');
};
</script>

<template>
    <el-dialog v-model="dialogVisible" class="customer-container" :title="title" width="30%" @close="dialogClose">
        <el-form label-width="100px" ref="formRef" :model="formData" :rules="formRules">
            <el-form-item >
                <img  :src="product?.imageUrl[0]" alt="图片" class="product-image">
            </el-form-item>
            <el-form-item label="单价" prop="price">
                <el-tag class="price-tag"> ￥{{ product?.price }}</el-tag>
            </el-form-item>
            <el-form-item label="购买数量" prop="productnumber">
                <el-input v-model="formData.productnumber" />
            </el-form-item>
            <el-form-item label="购买方式" prop="payMethod">
                <el-select id="payMethod" 
                           v-model="formData.payMethod"
                           placeholder="请选择"
                           style="width: 100%;">
                  <el-option value="wechat" class="input_font" label="微信"/>
                  <el-option value="zhifubao" class="input_font" label="支付宝"/>
                </el-select>
            </el-form-item>
            <el-form-item label="提货方式" prop="receiveMethod">
                <el-select id="receiveMethod" 
                           v-model="formData.receiveMethod"
                           placeholder="请选择"
                           style="width: 100%;">
                  <el-option value="DELIVERY" class="input_font" label="快递送达"/>
                  <el-option value="PICKUP" class="input_font" label="到店自提"/>
                </el-select>
            </el-form-item>
            <el-form-item label="收货地址" prop="address" v-if="formData.receiveMethod==='DELIVERY'">
                <el-select id="address" 
                           v-model="formData.address"
                           placeholder="请选择"
                           style="width: 100%;">
                  <el-option v-for="(item,index) in addressList" :key="index" :label="item" :value="item"/>
                </el-select>
            </el-form-item>
            <el-form-item label="联系电话" prop="phone">
                <el-select id="phone" 
                           v-model="formData.phone"
                           placeholder="请选择"
                           style="width: 100%;">
                  <el-option v-for="(item,index) in telList" :key="index" :label="item" :value="item"/>
                </el-select>
            </el-form-item>
            <el-form-item label="合计" prop="tot_price">
                <el-tag class="price-tag"> ￥{{ product?.price*formData.productnumber }}</el-tag>
            </el-form-item>
        </el-form>
        <template #footer>
            <span>
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="submitForm"> 提交
                </el-button>
            </span>
        </template>
    </el-dialog>
    <MyPay ref="myPayRef" title="支付"  @submit="submit"></MyPay>
</template>
<style scoped>
.price-tag {
  font-size: 24px;
  color: #FF6000;
  font-weight: bold;
  background-color: transparent;
  border: none;
}
.product-image{
  width:160px; /* 设置固定宽度 */
  height: auto; /* 自适应高度 */
}
.customer-container {
  z-index: 20000;  /* 设置一个较大的 z-index 值 */
}
</style>