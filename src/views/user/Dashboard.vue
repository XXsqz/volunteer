<script setup lang="ts">
import {computed, ref} from 'vue'
import {userInfo, userInfoUpdate} from '../../api/user.ts'
//import {parseRole, parseTime} from "../../utils"
import {router} from '../../router'
import {UserFilled} from "@element-plus/icons-vue"
//import {userInfo_storename} from "../../api/store.ts"
import { Md5 } from 'ts-md5';
//import { Remove } from "@element-plus/icons-vue";
//const role = sessionStorage.getItem("role")
const name = ref('')
//const storeName = ref('')
//const storeId = ref()
const tel = ref('')
//const address = ref('')
//const regTime = ref()
const studentId = ref('')
const newStudentId =ref('')
const newName = ref('')
const newTel = ref('')
const pass_word = ref('')
const displayInfoCard = ref(false)

const password = ref('')
const confirmPassword = ref('')

const hasConfirmPasswordInput = computed(() => confirmPassword.value != '')
const isPasswordIdentical = computed(() => password.value == confirmPassword.value)
const changeDisabled = computed(() => {
  return !((hasConfirmPasswordInput.value && isPasswordIdentical.value)||newName.value!=name.value||(newTel.value!=tel.value&&telLegal.value)||newStudentId.value!=studentId.value)
})


//let telList = ref<string[]>([])
//let addressList = ref<string[]>([])
getUserInfo()
function getUserInfo() {
  userInfo().then(res => {
    //console.log(res.data);
    //res.data.result =res.data[0]
    name.value = res.data.result.name
    tel.value = res.data.result.phone
    studentId.value = res.data.result.studentId
    pass_word.value = res.data.result.password
    //address.value = res.data.result.address
    //telList.value = res.data.result.receivePhone
    //addressList.value = res.data.result.receiveAddress
    //storeId.value = res.data.result.storeId
    //regTime.value = parseTime(res.data.result.createTime)
    newName.value = name.value
    newStudentId.value = studentId.value
    newTel.value = tel.value
    // if(role === 'STAFF'){
    //   userInfo_storename(storeId.value).then(res =>{
    //     storeName.value=res.data
    //   })
    // }
  })
}

// function gocreatestore(){
//     router.push({path:'/createStore'})
// }
// function gostore(){
//     router.push({
//       path:'/storeDetail',
//       query:{
//         storeId:storeId.value
//    }})
// }

/*function updateInfo() {
  //console.log(telList.value)
  //console.log(addressList.value)
  //手机号要合法，地址不能为空
  for(let i = 0; i < telList.value.length; i++) {
    if(!telLegal(i)) {
      ElMessage({
        customClass: 'customMessage',
        type: 'error',
        message: '存在手机号不合法！',
      })
      return
    }
  }
  for(let i = 0; i < addressList.value.length; i++) {
    if(addressList.value[i].length === 0) {
      ElMessage({
        customClass: 'customMessage',
        type: 'error',
        message: '存在地址为空！',
      })
      return
    }
  }
  userInfoUpdate({
    name: newName.value,
    password: undefined,
    //phone: telList.value[0],
    //address: addressList.value[0],
    //receivePhone: telList.value,
    //receiveAddress: addressList.value,
  }).then(res => {
    if (res.data.code === '000') {
      ElMessage({
        customClass: 'customMessage',
        type: 'success',
        message: '更新成功！',
      })
      getUserInfo()
    } else if (res.data.code === '400') {
      ElMessage({
        customClass: 'customMessage',
        type: 'error',
        message: res.data.msg,
      })
    }
  })
}
*/
function updatePassword() {
  //const md5:any = new Md5()
  //md5.appendAsciiStr(password.value)
  //password.value = md5.end()
  if(password.value!=''){
    pass_word.value = password.value
  }
  userInfoUpdate({
    password: pass_word.value,
    name: newName.value,
    phone: newTel.value,
    studentId: newStudentId.value
  }).then(res => {
    if (res.data.code === '000') {
      
      if(password.value!=''){
        ElMessageBox.alert(
          `请重新登录`,
          '修改成功',
          {
            customClass: "customDialog",
            confirmButtonText: '跳转到登录',
            type: "success",
            showClose: false,
            roundButton: true,
            center: true
          }).then(() => router.push({path: "/login"}))
        }
      else{
        ElMessage({
          customClass: 'customMessage',
          type: 'success',
          message: '更新成功！',
        })
        getUserInfo()
        displayInfoCard.value = false
      }
      password.value = ''
      confirmPassword.value = ''
    } else if (res.data.code === '400') {
      ElMessage({
        customClass: 'customMessage',
        type: 'error',
        message: res.data.msg,
      })
      password.value = ''
      confirmPassword.value = ''
    }
  })
}
// function addTel() {
//   telList.value.push('');
// }
// function addAddress() {
//   addressList.value.push('');
// }
// function setDefaultTel(index: number) {
//   const defaultTel = telList.value.splice(index, 1)[0];
//   telList.value.unshift(defaultTel);
// }
// function setDefaultAddress(index: number) {
//   const defaultAddress = addressList.value.splice(index, 1)[0];
//   addressList.value.unshift(defaultAddress);
// }
/*function removeAddress(index: number) {
  ElMessageBox.confirm(
    '确定要删除该地址吗？',
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
    if(addressList.value.length === 1) {
      ElMessage({
        customClass: 'customMessage',
        type: 'error',
        message: '至少保留一个地址！',
      })
    }
    else addressList.value.splice(index, 1);
  }).catch(() => {
  });
}
function removeTel(index: number) {
  ElMessageBox.confirm(
    '确定要删除该手机号吗？',
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
    if(telList.value.length === 1) {
      ElMessage({
        customClass: 'customMessage',
        type: 'error',
        message: '至少保留一个手机号！',
      })
    }
    else telList.value.splice(index, 1);
  }).catch(() => {
  });
}*/
// 电话号码的规则
const chinaMobileRegex = /^1(3[0-9]|4[579]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[189])\d{8}$/
const telLegal = computed(() => chinaMobileRegex.test(newTel.value))
// function telLegal(index: number) {
//   return chinaMobileRegex.test(telList.value[index])
// }
</script>

<template>
  <el-main class="main-container bgimage">
    <el-card class="aside-card">
      <div class="avatar-area">
        <el-avatar :icon="UserFilled" :size="80">
        </el-avatar>
        <span class="avatar-text"> 欢迎您，{{ name }}</span>
      </div>

      <el-divider></el-divider>

      <el-descriptions
          :column="1"
          border
          title="个人信息"
      >
        <template #extra>
          <el-button type="primary"
                     @click="displayInfoCard = displayInfoCard === false;">
            <span v-if="displayInfoCard">返回</span>
            <span v-else>修改个人信息</span>
          </el-button>
        </template>

        <!-- <el-descriptions-item label="身份">
          <el-tag>{{ parseRole(role) }}</el-tag>
        </el-descriptions-item> -->

        <el-descriptions-item label="联系电话">
          {{ tel }}
        </el-descriptions-item>
        <el-descriptions-item label="学号">
          {{ studentId}}
        </el-descriptions-item>

        <!-- <el-descriptions-item label="地址" v-if="role === 'CUSTOMER' || role === 'STAFF'">
          {{ address }}
        </el-descriptions-item> -->

        <!-- <el-descriptions-item label="注册时间">
          {{ regTime }}
        </el-descriptions-item> -->
      </el-descriptions>

      <el-divider></el-divider>
      
    <!-- create a store using the button -->
    <!-- <el-button class = "Store_button" @click="gocreatestore" v-if="role === 'MANAGER'">
      创建商店
    </el-button>
    <el-button class = "Store_button" @click="gostore" v-if="role === 'STAFF'">
      我的商店
    </el-button> -->

    </el-card>
    <el-card v-if="!displayInfoCard" class="change-card">

    </el-card>
    <!-- <el-card v-if="displayInfoCard" class="change-card">
      <template #header>
        <div class="card-header">
          <span>个人信息</span>
          <el-button @click="updateInfo">更新</el-button>
        </div>
      </template>

      <el-form>
        <el-form-item>
          <label for="name">昵称</label>
          <el-input type="text" id="name" v-model="newName"/>
        </el-form-item>
        <el-form-item v-if="role!='CUSTOMER'">
          <label for="phone">手机号</label>
          <el-input id="phone" v-model="tel" disabled/>
        </el-form-item>
        <el-form-item v-for="(tel, index) in telList" :key="index" v-if="role==='CUSTOMER'">
          <label :for="'phone' + index">
            手机号{{ index + 1 }}
            <span v-if="index === 0" style="color: green;">（默认手机号）</span>
            <el-button v-if="index !== 0" type="primary" 
              @click="setDefaultTel(index)" 
              style="background-color: #AFFB98; border-color: #90FB90; color: #006400; padding: 2px;">
              设为默认手机号
            </el-button>
            <el-button link type="danger" @click="removeTel(index)">
              <el-icon name="remove" style="font-size: 16px;"><Remove/></el-icon>
            </el-button>
          </label>
          <label v-if="!telLegal(index)" for="tel" class="error-warn">
            手机号不合法
          </label>
          <el-input :id="'phone' + index" v-model="telList[index]" />
        </el-form-item>
        <el-button type="primary" @click="addTel" v-if="role==='CUSTOMER'">添加手机号</el-button>
        <el-form-item v-if="role === 'STAFF'">
          <label for="address" v-if="role === 'STAFF'">商家地址</label>
          <el-input id="address" type="textarea"
                    rows="4"
                    v-model="address" placeholder="中华门"></el-input>
        </el-form-item>
        <el-form-item v-for="(address, index) in addressList" :key="index" v-if="role==='CUSTOMER'">
          <label :for="'address' + index">
            收货地址{{ index + 1 }}
            <span v-if="index === 0" style="color: green;">（默认地址）</span>
            <el-button v-if="index !== 0" type="primary" 
              @click="setDefaultAddress(index)" 
              style="background-color: #AFFB98; border-color: #90FB90; color: #006400; padding: 2px;">
              设为默认地址
            </el-button>
            <el-button link type="danger" @click="removeAddress(index)">
              <el-icon name="remove" style="font-size: 16px;"><Remove/></el-icon>
            </el-button>
          </label>
          <label v-if="addressList[index].length===0" for="address" class="error-warn">
            地址不能为空
          </label>
          <el-input :id="'address' + index" type="textarea" rows="2" v-model="addressList[index]" />
        </el-form-item>
        <el-button type="primary" @click="addAddress" v-if="role==='CUSTOMER'">添加收货地址</el-button>
      </el-form>
    </el-card> -->

    <el-card v-if="displayInfoCard" class="change-card">
      <template #header>
        <div class="card-header">
          <span>修改个人信息</span>
          <el-button @click="updatePassword" :disabled="changeDisabled">
            修改
          </el-button>
        </div>
      </template>

      <el-form>
        <el-form-item>
          <label for="name">名称</label>
          <el-input type="name" id="name" v-model="newName" required/>
        </el-form-item>
        <el-form-item>
          <label for="studentId">学号</label>
          <el-input type="studentId" id="studentId" v-model="newStudentId" required/>
        </el-form-item>
        <el-form-item>
          <label v-if="!telLegal" class="error-warn" for="tel">手机号不合法</label>
          <label v-else for="tel">手机号</label>
          <el-input type="tel" id="tel" v-model="newTel" required/>
        </el-form-item>
        <el-form-item>
          <label for="password">密码</label>
          <el-input type="password" id="password" v-model="password" placeholder="•••••••••" required/>
        </el-form-item>
        <el-form-item>
          <label v-if="!hasConfirmPasswordInput" for="confirm_password">确认密码</label>
          <label v-else-if="!isPasswordIdentical" for="confirm_password" class="error-warn">密码不一致</label>
          <label v-else for="confirm_password">确认密码</label>

          <el-input type="password" id="confirm_password" v-model="confirmPassword"
                    :class="{'error-warn-input' :(hasConfirmPasswordInput && !isPasswordIdentical)}"
                    placeholder="•••••••••" required/>
        </el-form-item>
      </el-form>

    </el-card>
  </el-main>
</template>

<style scoped>
.bgimage {
  background-image: url("../../assets/shopping-1s-1084px.svg");
}

.error-warn {
  color: red;
}

.error-warn-input {
  --el-input-focus-border-color: red;
}

.main-container {
  display: flex;
  flex-direction: row;
  padding: 15px;
  gap: 5px;
  justify-content: center;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.change-card {
  width: 66%;
}

.avatar-area {
  display: flex;
  justify-content: space-around;
  align-items: center;
  gap: 30px;
}

.avatar-text {
  font-size: x-large;
  font-weight: bolder;
  padding-right: 40px;
}

.Store_button {
  font-size: 24px; /* 调整按钮的字体大小 */
  padding:24px 2px; /* 调整按钮的内边距 */
  float: left; /* 按钮靠左 */
  margin-top: 10px; /* 按钮与上边的距离 */
  margin-bottom: 10px; /* 按钮与下边的距离 */
  width: 40%; /* 按钮宽度 */
  height: 100%; /* 按钮高度 */
  background-color: #409EFF; /* 按钮背景颜色 */
  color: #FFFFFF; /* 按钮字体颜色 */
  border: none; /* 按钮边框 */
  border-radius: 20px; /* 按钮圆角 */
  cursor: pointer; /* 鼠标移动到按钮上时显示手型 */
}

</style>


