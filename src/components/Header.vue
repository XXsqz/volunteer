<script setup lang="ts">
import { router } from '../router'
import { User, SwitchButton, Key, Bell } from "@element-plus/icons-vue"   //图标
import { getPersonalNotifications, Notification } from '../api/notify';
import NotificationCard from "./NotificationCard.vue";
import { ref } from 'vue';

const role = sessionStorage.getItem('role')    //登录的时候插入的
const token = sessionStorage.getItem('token')  //登录的时候插入的

const defaultTab = ref('first')
const notifications = ref([])
const unreadNotifications = ref([])
const readNotifications = ref([])
//退出登录

function logout(event: Event) {
    event.preventDefault();
    ElMessageBox.confirm(
        '是否要退出登录？',
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
        sessionStorage.setItem('token', '')
        router.push({ path: "/login" })
    })
}

function toggleNotification() {
    getPersonalNotifications().then(res => {
        if (res.data.code === '000') {
            const notificationsArray = res.data.result as Notification[]
            notifications.value = notificationsArray

            unreadNotifications.value = notificationsArray.filter((notification: Notification) => !notification.read) as []
            readNotifications.value = notificationsArray.filter((notification: Notification) => notification.read) as []


            console.log(unreadNotifications.value)
            console.log(readNotifications.value)
        }
    })
}

</script>


<template>
    <el-header class="custom-header" height="20">
        <el-row :gutter="10" justify="space-between">

            <el-col :span="3" class="header-icon">
                <router-link to="/volunteer" v-slot="{ navigate }" class="no-link">
                    <h1 @click="navigate" class="header-text"> volunteer</h1>
                </router-link>
            </el-col>

            <el-col :span="16">
            </el-col>

            <el-col :span="1" class="header-icon">
                <router-link to="/login" v-slot="{ navigate }">
                    <el-icon class="real-icon" @click="navigate" :size="35" color="blue" v-if="!token">
                        <Key class="real-icon" />
                    </el-icon>
                </router-link>
            </el-col>

            <el-col :span="1" class="header-icon" v-if="token && role != 'ADMIN'">
                <router-link to="/dashboard" v-slot="{ navigate }">
                    <el-icon class="real-icon" @click="navigate" :size="35" color="blue">
                        <User />
                    </el-icon>
                </router-link>
            </el-col>

            <el-col :span="1" class="header-icon" v-if="token && role === 'ADMIN'">
                <router-link to="/edit" v-slot="{ navigate }">
                    <el-icon @click="navigate" :size="35" color="blue">
                        <User />
                    </el-icon>
                </router-link>
            </el-col>


            <el-col :span="1" class="header-icon" v-if="token && role != 'ADMIN'">
                <el-popover placement="bottom" width=300 trigger="click">
                    <template #reference>
                        <el-icon :size="35">
                            <Bell class="real-icon" @click="toggleNotification" color="blue" />
                        </el-icon>
                    </template>

                    <template #default>
                        <el-tabs v-model="defaultTab" :stretch=true class="demo-tabs">
                            <el-tab-pane label="未读消息" name="first">
                                <NotificationCard :notifications="unreadNotifications" :updater="toggleNotification" />
                            </el-tab-pane>

                            <el-tab-pane label="已读消息" name="second">
                                <NotificationCard :notifications="readNotifications" :updater="toggleNotification" />
                            </el-tab-pane>
                        </el-tabs>
                    </template>
                </el-popover>
            </el-col>


            <el-col :span="1" class="header-icon" v-if="token">
                <el-icon :size="35">
                    <SwitchButton class="real-icon" @click="logout" color="blue" />
                </el-icon>
            </el-col>


        </el-row>
    </el-header>
</template>


<style scoped>
.custom-header {
    background-color: #f9fafc;
    border-bottom-left-radius: 20px;
    border-bottom-right-radius: 20px;

    display: flex;
    flex-direction: column;
}

.no-link {
    text-decoration: none;
}

.role-tag {
    margin-top: 20px;
    font-size: 20px;
}

.header-text {
    color: rgb(50, 134, 231);
    font-size: 30px;
    min-width: max-content;
    margin-top: 15px;
    margin-bottom: 15px;
    font-family: 'Comic Sans MS', sans-serif;
}

.header-icon {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.real-icon:hover {
    cursor: pointer;
    /* 鼠标悬停时改变鼠标形状 */
}

.reminder-button {
    padding: 10px 20px;
    background-color: #007bff;
    color: white;
    border: none;
    cursor: pointer;
}

.dropdown {
    position: absolute;
    top: 100%;
    /* 让下拉框悬浮在按钮下方 */
    background-color: #f9f9f9;
    border: 1px solid #ccc;
    padding: 10px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    /* 添加阴影效果 */
}

.tabs {
    display: flex;
}

.tabs button {
    padding: 10px 20px;
    border: none;
    cursor: pointer;
}

.tabs button.active {
    background-color: #007bff;
    color: white;
}
</style>
