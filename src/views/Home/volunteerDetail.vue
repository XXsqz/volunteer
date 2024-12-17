<template>
    <div class="container">
        <div class="header">
            <h1>{{ title }}</h1>
            <p>{{ author }}</p>
        </div>
        <el-container style="width: 100%; display: flex;">  
          <el-aside style="width: 15%;">
            <!-- <div class="html-content" v-html="htmlContent"></div> -->
          </el-aside>
          <el-aside class="content" style="width: 70%;">
             <div class="html-content" v-html="htmlContent"></div>
          </el-aside>
          <el-aside style="width: 15%;">
            <button
              v-if="showBackToTop"
              @click="scrollToTop"
              class="back-to-top"
              data-tooltip="回到顶部"
              data-tooltip-position="left"
              data-tooltip-will-hide-on-click="true"
              aria-label="回到顶部"
              type="button"
              title="回到顶部">
              <el-icon class="top-icon"><Top /></el-icon>
            </button>
          </el-aside>
        </el-container>
        <div class="application" v-if="!eventId">
        </div>
    <div class="application" v-else-if="!token">
        <el-button type="primary" disabled class="disabled-button" >请先登录</el-button>
    </div>
    <div class="application-form-card" v-else-if="applying">
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
    <div class="application" v-else-if="!eventstart">
        <el-button type="primary" disabled class="disabled-button" >项目报名未开始</el-button>
    </div>
    <div class="application" v-else-if="eventend">
        <el-button type="primary" disabled class="disabled-button" >项目报名已结束</el-button>
    </div>
    <div class="application" v-else-if="applied">
        <el-button type="primary" disabled class="disabled-button" >已申请成功</el-button>
    </div>
    <!-- <div class="application" v-else-if="!full">
        
        <el-button id="parentIframe" @click.prevent="getinfo()" type="primary" style="display: none">
        </el-button>
    </div> -->
    <div class="application" v-else-if="full">
        <el-button type="primary" disabled class="disabled-button">项目报名人数已满</el-button>
    </div>
    
    
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted} from 'vue';
import { getArticle } from '../../api/article';
import Quill from 'quill';
import { useRoute } from 'vue-router';
import { userInfo } from '../../api/user';
import { getEvent } from '../../api/event';
import { parseTime, parseCategory} from '../../utils/index';
import { addApplication } from '../../api/register';
import { getPersonalRegistrations } from '../../api/register';
import { Top} from "@element-plus/icons-vue";
const route = useRoute();
const articleId = Number(route.params.id);
const eventId = ref(0);
const userId = ref(0);
const applying = ref(false);
const applied = ref(false);
const full = ref(false);
const eventstart = ref(true);
const eventend = ref(false);
const token = sessionStorage.getItem('token');
const showBackToTop = ref(false);
const buttonTop = ref('80%'); // 初始位置

function handleScroll() {
  const scrollY = window.scrollY;
  showBackToTop.value = scrollY > 200; // 当滚动距离超过200px时显示按钮
  buttonTop.value = `${scrollY + window.innerHeight - 100}px`; // 动态调整按钮位置
}
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
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
function eventCheck(){
    getEvent(eventId.value).then(res => {
      //console.log(res.data.result)
      if(new Date().getTime() < new Date(res.data.result.enrollStartTime).getTime())eventstart.value = false;
      if(new Date().getTime() > new Date(res.data.result.enrollEndTime).getTime())eventend.value = true;
      if(res.data.result.enrollNumber>= res.data.result.recruitNumber)full.value = true;
      userApplied()
    })
}
function userApplied(){
    getPersonalRegistrations().then(res => {
      console.log(res.data.result)
        res.data.result.forEach((item: any) => {
            if(item.id === eventId.value){
                applied.value = true;
            }
        });
      if(eventstart.value === true && eventend.value === false && full.value === false &&applied.value === false)getinfo();
    });
}
function getinfo(){
    applying.value = true;
    userInfo().then(res => {
        form.value.name= res.data.result.name
        form.value.phone = res.data.result.phone
        form.value.studentId = res.data.result.studentId
        userId.value = res.data.result.id
    })
    if(eventId.value!=0)
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
    eventId: eventId.value,
    userId: userId.value,
  }).then(res => {
    console.log(res);
    if (res.data.code === '000') {
      console.log('申请成功');
      ElMessage.success('申请成功');
      applied.value = true;
      applying.value = false;
    }
  });
}
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
        eventCheck();
        console.log(JSON.parse(res.data.result.content));
        const delta = JSON.parse(res.data.result.content);
        quill.setContents(delta);
        htmlContent.value = quill.root.innerHTML;
    });
}
setTimeout(function () {
    if (document) {
        document.getElementById("parentIframe").click();
    }
}, 0);
</script>

<style scoped>
.back-to-top {
  position: fixed;
  right: 20px;
  bottom: 10px; /* 固定在视口底部 */
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgb(255, 255, 255);
  border-radius: 4px;
  width: 40px;
  height: 40px;
  color: rgb(132, 145, 165);
  box-shadow: rgba(0, 0, 0, 0.1) 0px 1px 3px;
  cursor: pointer;
  transition: opacity 0.3s; /* 平滑过渡效果 */
}
.top-icon {
  font-size: 24px; /* 增大图标 */
  font-weight: bold; /* 加粗图标 */
}
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
    width: 70%;
    height: auto;
}

.html-content {
    width: 100%;
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
.application {
  display: flex;
  justify-content: flex-end; /* 将内容靠右对齐 */
  padding: 10px; /* 可选：添加一些内边距 */
}
.disabled-button {
  background-color: #cccccc !important;
  cursor: not-allowed !important;
  border-color: #cccccc !important;
}
</style>
