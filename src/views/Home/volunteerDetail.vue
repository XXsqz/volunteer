<template>
    <div class="container">
        <div class="header">
            <h1>{{ title }}</h1>
            <p>{{ author }}</p>
        </div>
        <div class="content">
            <div class="html-content" v-html="htmlContent"></div>
        </div>
    
    <div class="application" v-if="!applying">
        <el-button type="primary" @click="getinfo">申请</el-button>
    </div>
    <div class="application-form-card" v-else>
    <el-card v-if="applying" class="application-form-card">
    <el-form :model="form" label-width="120px" class="form-container">
    <div class="form-row">
      <el-form-item label="姓名:">
        <div class="form-value">{{ form.name }}</div>
      </el-form-item>
      <el-form-item label="学号:">
        <div class="form-value">{{ form.studentId }}</div>
      </el-form-item>
    </div>
    <div class="form-row">
      <el-form-item label="联系电话:">
        <div class="form-value">{{ form.phone }}</div>
      </el-form-item>
      <el-form-item label="项目名称:">
        <div class="form-value">{{ form.projectName }}</div>
      </el-form-item>
    </div>
    <div class="form-row">
      <el-form-item label="项目开始时间:">
        <div class="form-value">{{ form.startTime }}</div>
      </el-form-item>
      <el-form-item label="项目结束时间:">
        <div class="form-value">{{ form.endTime }}</div>
      </el-form-item>
    </div>
    <div class="form-row">
      <el-form-item label="项目类型:">
        <div class="form-value">{{ form.projectType }}</div>
      </el-form-item>
      <el-form-item label="活动地点:">
        <div class="form-value">{{ form.location }}</div>
      </el-form-item>
    </div>
      <el-form-item>
        <el-button type="primary" @click="submitApplication">确认信息并提交申请</el-button>
        <el-button type="primary" @click="applying = false">取消</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { getArticle } from '../../api/article';
import Quill from 'quill';
import { useRoute } from 'vue-router';
import { userInfo } from '../../api/user';
import { getEvent } from '../../api/event';
import { parseTime, parseCategory} from '../../utils/index';
import { addApplication } from '../../api/register';
const route = useRoute();
const articleId = Number(route.params.id);
const eventId = ref(0);
const userId = ref(0);
const applying = ref(false);
// 在组件挂载时获取文章ID并输出
interface Application{
    name: string;
    studentId: string;
    phone: string;
    projectName: string;
    startTime: string;
    endTime: string;
    projectType: string;
    location: string;
}
const form = ref<Application>({
    name: '',
    studentId: '',
    phone: '',
    projectName: '',
    startTime: '',
    endTime: '',
    projectType: '',
    location: ''
});
function getinfo(){
    applying.value = true;
    userInfo().then(res => {
        form.value.name= res.data.result.name
        form.value.phone = res.data.result.phone
        form.value.studentId = res.data.result.studentId
        userId.value = res.data.result.id
    })
    getEvent(eventId.value).then(res => {
        form.value.projectName = res.data.result.name
        form.value.startTime = parseTime(res.data.result.eventStartTime)
        form.value.endTime = parseTime(res.data.result.eventEndTime)
        form.value.projectType = parseCategory(res.data.result.type)
        form.value.location = res.data.result.location
    });
}
// import renderer from 'quilljs-renderer';
// const Document = renderer.Document;
// renderer.loadFormat('html');
const title = ref('文章标题');
const author = ref('作者名称');
const htmlContent = ref('<p>1<strong>1<em>12<u>4</u></em><u>35</u></strong></p>');
function submitApplication() {
  // 提交申请逻辑
  addApplication({
    userId: userId.value,
    eventId: eventId.value
  }).then(res => {
    console.log(res);
    if (res.data.code === '000') {
      console.log('申请成功');
    }
  });
}
// console.log("Article ID:", articleId);
let quill: Quill;
const quillContainer = document.createElement('div');
quill = new Quill(quillContainer);
handleArticleContent(articleId)
function handleArticleContent(id: number) {
    getArticle(id).then((res) => {
        console.log(res);
        title.value = res.data.result.title;
        author.value = res.data.result.author;
        eventId.value = res.data.result.eventId;
        console.log(JSON.parse(res.data.result.content));
        const delta = JSON.parse(res.data.result.content);
        quill.setContents(delta);
        htmlContent.value = quill.root.innerHTML;
    });
}
</script>

<style scoped>
.container {
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100vh;
    padding: 20px;
    box-sizing: border-box;
    
}

.header {
    text-align: center;
    margin-bottom: 10px;
}

.content {
    display: flex;
    justify-content: center;
    align-items: flex-end;
    width: 100%;
    height: auto;
}

.html-content {
    width: 70%;
    height: 100%;
    background-color: #f9f9f9;
    padding: 20px;
    box-sizing: border-box;
    overflow: auto;
}
.application-form-card {
  width: 82%;
  margin: 0 auto;
  padding: 20px;
}
.form-container {
  display: flex;
  flex-wrap: wrap;
}
.form-row {
  display: flex;
  width: 100%;
  justify-content: space-between;
}
.el-form-item {
  flex: 1;
  margin-right: 20px;
}

.el-form-item:last-child {
  margin-right: 0;
}
</style>
