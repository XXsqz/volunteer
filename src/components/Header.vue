<script setup lang="ts">
import {router} from '../router'
import {User, SwitchButton, Key} from "@element-plus/icons-vue"   //图标

const role = sessionStorage.getItem('role')    //登录的时候插入的
const token = sessionStorage.getItem('token')  //登录的时候插入的
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
    router.push({path: "/login"})
  })
}
</script>


<template>
  <el-header class="custom-header" height="20">
    <el-row :gutter="10" justify="space-between">

      <el-col :span="3" class="header-icon">
        <router-link to="/volunteer" v-slot="{navigate}" class="no-link">
          <h1 @click="navigate" class="header-text"> volunteer</h1>
        </router-link>
      </el-col>

      <el-col :span="3" class="header-icon">
        <router-link to="/dashboard" v-slot="{navigate}">
          <el-icon @click="navigate" :size="35" color="blue" v-if="token&&role!='ADMIN'"><User /></el-icon >
        <router-link to="/login" v-slot="{navigate}">
            <el-icon @click="navigate" :size="35" color="blue" v-if="!token"><Key /></el-icon>
          </router-link>
          <el-icon @click="logout" :size="35" color="blue" style="margin-left: 10px;" v-if="token"><SwitchButton /></el-icon>
        </router-link>
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
  color:rgb(50, 134, 231);
  font-size: 30px;
  min-width: max-content;
  margin-top: 15px;
  margin-bottom: 15px;
  font-family: 'Comic Sans MS', sans-serif;
}

.header-icon {
  display: flex;
  flex-direction: column;
  align-items:center;
  justify-content: center;
}
</style>
