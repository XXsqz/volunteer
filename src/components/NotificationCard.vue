<template>
    <ul>
        <li v-for="notification in notifications">
            <el-card style="margin: 5px">
                <div>{{ notification.message }}</div>
                <div slot="header" class="header">
                    <el-button v-if="!notification.read" :icon="Check"
                        @click="markAsRead(notification, updater)"></el-button>
                </div>
            </el-card>
        </li>
    </ul>
</template>

<script setup lang="ts">
import { router } from '../router'
import { Check } from "@element-plus/icons-vue"   //图标
import { markNotificationAsRead, Notification } from '../api/notify';


const props = defineProps({
    notifications: {
        type: Object,
        required: true
    },
    updater: {
        type: Function,
        required: true
    },
})


function markAsRead(notification: Notification, updater: Function) {
    notification.read = true;
    markNotificationAsRead(notification.id).then(res => {
        if (res.data.code === '000') {
            updater()
        }
    });
}

</script>

<style scoped>
.header {
    display: flex;
    justify-content: flex-end;
}


li {
    list-style: none
}
</style>
