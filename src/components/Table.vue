<script setup lang="ts">
import { ref } from 'vue';
import NewProject from '../components/Editor.vue'; // 导入新组件
import { addEvent, updateEvent } from '../api/event';
import { defineProps, defineEmits } from 'vue';
import { getEvent } from '../api/event';
import { parseCategory, parseTime } from '../utils/index';
const props = defineProps<{
  param1: number;
}>();
const emits = defineEmits(['submitted']);
const form = ref({
  name: '',
  eventStartTime: '',
  eventEndTime: '',
  enrollStartTime: '',
  enrollEndTime: '',
  recruitNumber: 0,
  location: '',
  type: '',
  contactPeople: '',
  contactPhone: '',
});
const categories = ['MEDICAL', 'CLEANUP', 'EXPLAIN', 'LAYOUT', 'GUIDE', 'TEACHING'];
function submitForm() {
  if (!props.param1) {
    addEvent({
      name: form.value.name,
      eventStartTime: new Date(form.value.eventStartTime),
      eventEndTime: new Date(form.value.eventEndTime),
      enrollStartTime: new Date(form.value.enrollStartTime),
      enrollEndTime: new Date(form.value.enrollEndTime),
      recruitNumber: form.value.recruitNumber,
      location: form.value.location,
      type: form.value.type,
      contactPeople: form.value.contactPeople,
      contactPhone: form.value.contactPhone,
    }).then(res => {
      if (res.data.code === '000') {
        console.log("项目提交成功:", res);
        resetForm();
        alert("项目提交成功！");
      }
      else if (res.data.code === '400') {
        alert("提交失败，请稍后重试！");
      }
    });
  }
  else {
    updateEvent({
      id: props.param1,
      name: form.value.name,
      eventStartTime: new Date(form.value.eventStartTime),
      eventEndTime: new Date(form.value.eventEndTime),
      enrollStartTime: new Date(form.value.enrollStartTime),
      enrollEndTime: new Date(form.value.enrollEndTime),
      recruitNumber: form.value.recruitNumber,
      location: form.value.location,
      type: form.value.type,
      contactPeople: form.value.contactPeople,
      contactPhone: form.value.contactPhone,
    }).then(res => {
      if (res.data.code === '000') {
        console.log("项目更新成功:", res);
        alert("项目更新成功！");
        resetForm();
        emits('submitted');
      }
      else if (res.data.code === '400') {
        alert("更新失败，请稍后重试！");
      }
    });
  }
}
// console.log("param1", props.param1);
if(props.param1 != 0){
  getEvent(props.param1).then(res => {
    if (res.data.code === '000') {
      //console.log("项目获取成功:", res);
      form.value = res.data.result;
      //console.log("form", form.value);
      form.value.enrollStartTime = new Date(form.value.enrollStartTime).toISOString().split('T')[0];
      form.value.enrollEndTime = new Date(form.value.enrollEndTime).toISOString().split('T')[0];
      form.value.eventStartTime = new Date(form.value.eventStartTime).toISOString().split('T')[0];
      form.value.eventEndTime = new Date(form.value.eventEndTime).toISOString().split('T')[0];
      //console.log("form", form.value);
    }
    else if (res.data.code === '400') {
      alert("获取失败，请稍后重试！");
    }
  });
}
const validateForm = () => {
  let isValid = true;
  if (!form.value.name||!form.value.type||!form.value.location||!form.value.contactPeople||
  !form.value.contactPhone||!form.value.eventStartTime||!form.value.eventEndTime||
  !form.value.enrollStartTime||!form.value.enrollEndTime||!form.value.recruitNumber) {
    isValid = false;
  }
  return isValid;
};
function resetForm() {
  form.value = {
    name: '',
    eventStartTime: '',
    eventEndTime: '',
    enrollStartTime: '',
    enrollEndTime: '',
    recruitNumber: 0,
    location: '',
    type: '',
    contactPeople: '',
    contactPhone: '',
  };
}
</script>

<template>
  <form @submit.prevent="submitForm" class="form-container">
    <div class="form-row-3">
      <div class="form-field">
        <label for="name"><span class="required">*</span> 项目名称</label>
        <input type="text" id="name" v-model="form.name" required />
      </div>
      <div class="form-field">
        <label for="type"><span class="required">*</span> 项目类型</label>
        <select id="type" v-model="form.type" required>
          <option value="">请选择</option>
          <option v-for="category in categories" :key="category" :value="category">{{ parseCategory(category) }}</option>
        </select>
      </div>
      <div class="form-field">
        <label for="location"><span class="required">*</span> 活动地点</label>
        <input type="text" id="location" v-model="form.location" required />
      </div>
    </div>
    <div class="form-row-2">
      <div class="form-field">
        <label for="eventStartTime"><span class="required">*</span> 项目开始时间</label>
        <input type="date" id="eventStartTime" v-model="form.eventStartTime" :max="form.eventEndTime" required style="width: 350px;"/>
      </div>
      <div class="form-field">
        <label for="eventEndTime"><span class="required">*</span> 项目结束时间</label>
        <input type="date" id="eventEndTime" v-model="form.eventEndTime" :min="form.eventStartTime" required style="width: 350px;"/>
      </div>
    </div>
    <div class="form-row-2">
      <div class="form-field">
        <label for="enrollStartTime"><span class="required">*</span> 报名开始时间</label>
        <input type="date" id="enrollStartTime" v-model="form.enrollStartTime" :max="form.enrollEndTime" required style="width: 350px;"/>
      </div>
      <div class="form-field">
        <label for="enrollEndTime"><span class="required">*</span> 报名结束时间</label>
        <input type="date" id="enrollEndTime" v-model="form.enrollEndTime" :min="form.enrollStartTime" required style="width: 350px;"/>
        
      </div>
    </div>
    <div class="form-row-3">
      <div class="form-field">
        <label for="recruitNumber">
          <span class="required">*</span> 项目可报名人数 
          <span class="error-message" v-if="form.recruitNumber < 0"> 人数不能为负数</span>
        </label>
        <input type="number" id="recruitNumber" v-model="form.recruitNumber" min="0" required />
        
      </div>
      <div class="form-field">
        <label for="contactPeople"><span class="required">*</span> 联系人</label>
        <input type="text" id="contactPeople" v-model="form.contactPeople" required />
      </div>
      <div class="form-field">
        <label for="contactPhone"><span class="required">*</span> 联系电话</label>
        <input type="text" id="contactPhone" v-model="form.contactPhone" required />
      </div>
    </div>
    <button type="submit" :disabled="!validateForm()" class="submit-button" :class="{ 'disabled-button': !validateForm() }">提交表单</button>
  </form>
</template>

<style scoped>
.form-container {
  width: 80%;
  margin: 0;
  padding: 20px;
  background-color: white;
  border-radius: 8px;
}

.form-row-2 {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
}
.form-row-3 {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
}
.form-row-3 > * {
  flex: 1;
  margin-right: 10px;
}

.form-row-3 > *:last-child {
  margin-right: 0;
}

.form-field {
  flex-basis: calc(50% - 10px);
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: #333;
}

.required {
  color: red;
  margin-right: 5px;
}

input[type="text"],
input[type="number"],
select,
input[type="date"] {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
  box-sizing: border-box;
}

input[type="text"]:focus,
input[type="number"]:focus,
select:focus,
input[type="date"]:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 8px rgba(0, 123, 255, 0.2);
}

.submit-button {
  align-self: flex-start;
  padding: 10px 20px;
  border: none;
  background-color: #3498db;
  color: white;
  cursor: pointer;
  border-radius: 5px;
}
.submit-button.disabled-button {
  background-color: #ccc;
  cursor: not-allowed;
}
.error-message {
  color: red;
  font-size: 12px;
}
</style>