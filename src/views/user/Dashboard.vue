<script setup lang="ts">
import { computed, ref } from 'vue'
import { userInfo, userInfoUpdate } from '../../api/user.ts'
import { deleteRegistration, getPersonalRegistrations } from '../../api/register.ts'
import { router } from '../../router'
import { UserFilled } from "@element-plus/icons-vue"
const name = ref('')
const tel = ref('')
const studentId = ref('')
const newStudentId = ref('')
const newName = ref('')
const newTel = ref('')
const pass_word = ref('')
const displayInfoCard = ref(false)

const password = ref('')
const confirmPassword = ref('')

const hasConfirmPasswordInput = computed(() => confirmPassword.value != '')
const isPasswordIdentical = computed(() => password.value == confirmPassword.value)
const changeDisabled = computed(() => {
    return !((hasConfirmPasswordInput.value && isPasswordIdentical.value) || newName.value != name.value || (newTel.value != tel.value && telLegal.value) || newStudentId.value != studentId.value)
})
interface PersonalEvent {
    id: number;
    name: string;
    contactPeople: string;
    contactPhone: string;
    location: string;
    eventStartTime: string;
    eventEndTime: string;
}
const personalEvents = ref<PersonalEvent[]>([])
getPersonalRegistrations().then(res => {
    if (res.data.code === '000') {
        personalEvents.value = res.data.result;
        console.log(res.data.result);
    }
});;

function formattedTime(date_str: string) {
    const date = new Date(date_str)
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
}

getUserInfo()
function getUserInfo() {
    userInfo().then(res => {
        name.value = res.data.result.name
        tel.value = res.data.result.phone
        studentId.value = res.data.result.studentId
        pass_word.value = res.data.result.password
        newName.value = name.value
        newStudentId.value = studentId.value
        newTel.value = tel.value
    })
}

function updatePassword() {
    //const md5:any = new Md5()
    //md5.appendAsciiStr(password.value)
    //password.value = md5.end()
    if (password.value != '') {
        pass_word.value = password.value
    }
    userInfoUpdate({
        password: pass_word.value,
        name: newName.value,
        phone: newTel.value,
        studentId: newStudentId.value
    }).then(res => {
        if (res.data.code === '000') {
            if (password.value != '') {
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
                    }).then(() => router.push({ path: "/login" }))
            }
            else {
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

// 电话号码的规则
const chinaMobileRegex = /^1(3[0-9]|4[579]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[189])\d{8}$/
const telLegal = computed(() => chinaMobileRegex.test(newTel.value))
function exitProject(id: number) {
    ElMessageBox.confirm(
        '是否要退出该项目？',
        '提示',
        {
            customClass: "customDialog",
            confirmButtonText: '是',
            cancelButtonText: '否',
            type: "warning",
            showClose: false,
            roundButton: true,
            center: true
        }
    ).then(() => {
        deleteRegistration(id).then(res => {
            if (res.data.code === '000') {
                ElMessage({
                    customClass: 'customMessage',
                    type: 'success',
                    message: '退出成功！',
                })
                getPersonalRegistrations().then(res => {
                    if (res.data.code === '000') {
                        personalEvents.value = res.data.result;
                    }
                });
            } else if (res.data.code === '400') {
                ElMessage({
                    customClass: 'customMessage',
                    type: 'error',
                    message: res.data.msg,
                })
            }
        })
    })
}
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

            <el-descriptions :column="1" border title="个人信息">
                <template #extra>
                    <el-button type="primary" @click="displayInfoCard = displayInfoCard === false;">
                        <span v-if="displayInfoCard">返回</span>
                        <span v-else>修改个人信息</span>
                    </el-button>
                </template>

                <el-descriptions-item label="联系电话">
                    {{ tel }}
                </el-descriptions-item>
                <el-descriptions-item label="学号">
                    {{ studentId }}
                </el-descriptions-item>

            </el-descriptions>

            <el-divider></el-divider>

        </el-card>

        <el-card v-if="!displayInfoCard" class="change-card">
            <template #header>
                <div class="card-header">
                    <span>个人主页</span>
                </div>
            </template>

            <el-descriptions :column="1" border title="您参与过的项目">
            </el-descriptions>

            <el-card v-for="personalEvent in personalEvents" class="change-card">

                <el-descriptions :column="1" border :title="personalEvent.name">
                    <template #extra>
                        <el-button @click="exitProject(personalEvent.id)" type="danger" size="mini" style="margin-left: 10px;">
                            退出项目
                        </el-button>
                    </template>

                    <el-descriptions-item label="联系人">
                        {{ personalEvent.contactPeople }}
                    </el-descriptions-item>

                    <el-descriptions-item label="联系电话">
                        {{ personalEvent.contactPhone }}
                    </el-descriptions-item>

                    <el-descriptions-item label="地点">
                        {{ personalEvent.location }}
                    </el-descriptions-item>

                    <el-descriptions-item label="开始时间">
                        {{ formattedTime(personalEvent.eventStartTime) }}
                    </el-descriptions-item>

                    <el-descriptions-item label="开始时间">
                        {{ formattedTime(personalEvent.eventEndTime) }}
                    </el-descriptions-item>

                </el-descriptions>



            </el-card>
        </el-card>



        <el-card v-if="displayInfoCard" class="change-card">
            <template #header>
                <div class="card-header">
                    <span>修改个人信息</span>
                    
                </div>
            </template>

            <el-form>
                <el-form-item>
                    <label for="name">名称</label>
                    <el-input type="name" id="name" v-model="newName" required />
                </el-form-item>
                <el-form-item>
                    <label for="studentId">学号</label>
                    <el-input type="studentId" id="studentId" v-model="newStudentId" required />
                </el-form-item>
                <el-form-item>
                    <label v-if="!telLegal" class="error-warn" for="tel">手机号不合法</label>
                    <label v-else for="tel">手机号</label>
                    <el-input type="tel" id="tel" v-model="newTel" required />
                </el-form-item>
                <el-form-item>
                    <label for="password">密码</label>
                    <el-input type="password" id="password" v-model="password" placeholder="•••••••••" required />
                </el-form-item>
                <el-form-item>
                    <label v-if="!hasConfirmPasswordInput" for="confirm_password">确认密码</label>
                    <label v-else-if="!isPasswordIdentical" for="confirm_password" class="error-warn">密码不一致</label>
                    <label v-else for="confirm_password">确认密码</label>

                    <el-input type="password" id="confirm_password" v-model="confirmPassword"
                        :class="{ 'error-warn-input': (hasConfirmPasswordInput && !isPasswordIdentical) }"
                        placeholder="•••••••••" required />
                </el-form-item>
                <el-form-item>
                    <el-button @click="updatePassword" :disabled="changeDisabled" class="update-button">
                        修改
                    </el-button>
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

.update-button {
  font-size: 18px; /* 放大按钮字体 */
  padding: 10px 20px; /* 增加按钮内边距 */
}

.change-card {
    margin-bottom: 25px;
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
    font-size: 24px;
    /* 调整按钮的字体大小 */
    padding: 24px 2px;
    /* 调整按钮的内边距 */
    float: left;
    /* 按钮靠左 */
    margin-top: 10px;
    /* 按钮与上边的距离 */
    margin-bottom: 10px;
    /* 按钮与下边的距离 */
    width: 40%;
    /* 按钮宽度 */
    height: 100%;
    /* 按钮高度 */
    background-color: #409EFF;
    /* 按钮背景颜色 */
    color: #FFFFFF;
    /* 按钮字体颜色 */
    border: none;
    /* 按钮边框 */
    border-radius: 20px;
    /* 按钮圆角 */
    cursor: pointer;
    /* 鼠标移动到按钮上时显示手型 */
}
</style>
