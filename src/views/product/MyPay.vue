<script setup lang="ts">
import {ref,defineProps,defineExpose,defineEmits} from 'vue';
import {getCoupons} from "../../api/coupons.ts";
import {parseTime} from "../../utils";
import {getThisOrder} from '../../api/order.ts'
import {getAlipay} from '../../api/pay.ts'
// 定义props
const {title}=defineProps({
    title: {
        type: String,
        default: '标题',
    },
});
interface Coupon{
    id:number;
    type:string;
    isGlobal:boolean;
    discount:number;
    threshold:number;
    discountRate:number;
    startTime:string;
    endTime:string;
    storeId:any;
    storeName:string;
    isAvailable:boolean;
}
const coupons = ref<Coupon[]>([]);
const Availablecoupons = ref<Coupon[]>([]);

//handleCouponData()
function handleCouponData(visible: any){
    if(visible){
        getCoupons().then(res =>{
            coupons.value = res.data.result
            for(const coupon of coupons.value){
                let now = new Date();
                coupon.endTime=parseTime(coupon.endTime);
                if(now>new Date(coupon.endTime))coupon.isAvailable=false;
            }
            for(const coupon of coupons.value){
                if(coupon.threshold>tot_price.value){
                    coupon.isAvailable=false;
                }
                if(!coupon.isGlobal&&coupon.storeId != store_id.value){
                    coupon.isAvailable=false;
                }
                if(coupon.type === "SEC_DISCOUNT" && quantity.value<2){
                    coupon.isAvailable=false;
                }
            }
            Availablecoupons.value = coupons.value.filter(coupon => coupon.isAvailable);
        });
        selectedCoupons.value = [];
    }
    
}
const order_id = ref(0);
const tot_price = ref(0);
const store_id = ref(0);
const per_price = ref(0);
const quantity = ref(0);
function handleOrderData(id: any){
    order_id.value = id;
    getThisOrder(id).then(res => {
        tot_price.value = res.totalPrice;
        store_id.value = res.storeId;
        per_price.value = res.perPrice;
        quantity.value = res.quantity;
    })
}
function trans(row: any){
    let id=row.id;
    for(const coupon of coupons.value){
        if(coupon.id === id){
            if(coupon.type ==="BLUE_WHALE") return "蓝鲸券"
            else if(coupon.type ==="FULL_REDUCTION"){
                return "满减券: 满 "+coupon.threshold+" 减 "+coupon.discount;
            }
            else if(coupon.type ==="FULL_DISCOUNT"){
                return "满折券: 满 "+coupon.threshold+" 打 "+coupon.discountRate*10+"折";
            }
            else if(coupon.type ==="SEC_DISCOUNT"){
                return "第二件折扣券: 第二件打"+coupon.discountRate*10+"折";
            }
        }
    }
    return'';
}
function NewPrice(){
    if(selectedCoupons.value.length === 1){
        for(const coupon of coupons.value){
            if(coupon.id === selectedCoupons.value[0].id){
                if(coupon.type ==="FULL_REDUCTION")return tot_price.value-coupon.discount;
                else if(coupon.type ==="FULL_DISCOUNT")return tot_price.value*coupon.discountRate;
                else if(coupon.type ==="SEC_DISCOUNT")return tot_price.value-per_price.value+per_price.value*coupon.discountRate;
                else {
                    let price=0;
                    let form_price=tot_price.value;
                    if(form_price<=100)price=form_price*0.95;
                    else if(form_price<=200)price=95+(form_price-100)*0.9;
                    else if(form_price<=300)price=185+(form_price-200)*0.85;
                    else if(form_price<=400)price=270+(form_price-300)*0.8;
                    else if(form_price<=500)price=350+(form_price-400)*0.75;
                    else price=425+(form_price-500)*0.7;
                    return price;
                }
            }
        }
    }
    else if(selectedCoupons.value.length >= 2){
        let price = tot_price.value;
        let secRate = 1;
        selectedCoupons.value.sort((a, b) => {// 对 selectedCoupons.value 数组进行排序，以实现优惠券的优先级
            if (a.type === 'SEC_DISCOUNT' && b.type !== 'SEC_DISCOUNT') return -1;
            if (a.type !== 'SEC_DISCOUNT' && b.type === 'SEC_DISCOUNT') return 1;
            if (a.type === 'FULL_REDUCTION' && b.type !== 'FULL_REDUCTION') return -1;
            if (a.type !== 'FULL_REDUCTION' && b.type === 'FULL_REDUCTION') return 1;
            if (a.type === 'FULL_DISCOUNT' && b.type !== 'FULL_DISCOUNT') return -1;
            if (a.type !== 'FULL_DISCOUNT' && b.type === 'FULL_DISCOUNT') return 1;
            return 0;
        });
        for(const coupon of selectedCoupons.value){
            if(coupon.type === "FULL_REDUCTION") price -= coupon.discount;
            else if(coupon.type === "FULL_DISCOUNT") price *= coupon.discountRate;
            else secRate*=coupon.discountRate;
        }
        price -= per_price.value*(1-secRate);
        return price;
    }
    return tot_price.value;
}
// 定义emits
const emit = defineEmits(['submit','closed']);
// 定义表单数据
let dialogVisible = ref(false);
let formData = ref({
    coupon: [],
});
let formRef = ref();
// 重置表单
function resetForm() {
    selectedCoupons.value = [];
}
// 提交数据
function submitForm() {
    formRef.value.validate((valid: any) => {
        if (valid){
            let key={
                id: order_id.value,
                couponIds: selectedCoupons.value.map(coupon => coupon.id),
                totalPrice: NewPrice(),
            }
            emit('submit', getAlipay(key)
            .then(res => {
                let win = window.open('', '_blank');
                if (win){
                    win.document.write(res);
                    let timer = setInterval(() => {
                        if (win.closed) {
                            clearInterval(timer);
                            // 在这里发送请求，检查支付是否成功
                            getThisOrder(order_id.value).then(res => {
                                
                                if(res.orderStatus === 'UNDELIVERED'){
                                    ElMessage({
                                        message: '支付成功',
                                        type: 'success',
                                        center: true,
                                    })
                                }else {
                                    ElMessage({
                                        message: '支付失败',
                                        type: 'error',
                                        center: true,
                                    })
                                }
                            })
                        }
                    }, 500); 
                }
                else {
                    ElMessage({
                        message: '弹出窗口失败',
                        type: 'error',
                        center: true,
                    })
                }

            }
            ));
            dialogVisible.value = false;
        }
    });
}
// 关闭弹窗
function dialogClose(){
    emit('closed');
}
defineExpose({
    showDialog: (orderId: any) => {
        handleOrderData(orderId);
        resetForm();
        useCoupon.value = false;
        dialogVisible.value = true;
    },
    hideDialog: () => {
        dialogVisible.value = false;
    },
});
let useCoupon = ref(false);
const selectedCoupons = ref<Coupon[]>([]);
function isSelectable(row: any) {
    if (selectedCoupons.value.length > 0) {
        if (selectedCoupons.value.some(coupon => coupon.id === row.id))return true;
        // 如果已选的是蓝鲸券，那么其他的优惠券就不能被选择
        if (selectedCoupons.value[0].type === "BLUE_WHALE")return false;
        // 如果要选择的是蓝鲸券，那么也不能被选择
        if (row.type === 'BLUE_WHALE')return false;
        if (selectedCoupons.value.filter(coupon => coupon.type === row.type).length >= 2) return false;
        if (selectedCoupons.value.filter(coupon => coupon.type === row.type).length >= 1 && row.type === 'SEC_DISCOUNT') return false;
        if (row.type === 'FULL_DISCOUNT' && selectedCoupons.value.some(coupon => coupon.type === 'SEC_DISCOUNT'))return false;
        if (row.type === 'SEC_DISCOUNT'&& selectedCoupons.value.some(coupon => coupon.type === 'FULL_DISCOUNT'))return false;
    }
    return true;
}
function handleSelectionChange(val: any) {
    selectedCoupons.value = val.map((item: any) => item);
    //formData.value.coupon = selectedCoupons.value;
}
</script>

<template>
    <el-dialog v-model="dialogVisible" class="customer-container" :modal-append-to-body='false'
    append-to-body :title="title" width="30%" @close="dialogClose">
        <el-form label-width="100px" ref="formRef" :model="formData" >
            <el-form-item label="总价" prop="tot_price">
                <el-tag class="price-tag"> ￥{{ tot_price }}</el-tag>
            </el-form-item>
            <el-form-item label="优惠券" prop="coupon">
                <el-checkbox v-model="useCoupon" @change="handleCouponData">使用优惠券</el-checkbox>
            </el-form-item>
        </el-form>
        <el-table v-if="useCoupon"
            :data="Availablecoupons"
            @selection-change="handleSelectionChange"
            style="width: 100% ; margin-top: -20px;">
            <el-table-column
                type="selection"
                width="40"
                :selectable="isSelectable">
            </el-table-column>
            <el-table-column
                prop="id"
                label="优惠券描述"
                width="240"
                :formatter="trans">
            </el-table-column>
        </el-table>
        <el-form label-width="100px">
            <el-form-item label="折后总价" prop="New_tot_price">
                <el-tag class="price-tag"> ￥{{ NewPrice().toFixed(2) }}</el-tag>
            </el-form-item>
        </el-form>
        <template #footer>
            <span>
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="submitForm"> 支付
                </el-button>
            </span>
        </template>
    </el-dialog>
</template>
<style scoped>
.price-tag {
  font-size: 24px;
  color: #FF6000;
  font-weight: bold;
  background-color: transparent;
  border: none;
}
:deep(.el-table__header-wrapper .el-table__header .el-checkbox) {
 	 display: none;
}
</style>