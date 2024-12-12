<template>
    <div class="smart-contract-platform">
      <div class="sidebar">
        <aside>   
            <nav>
                <ul>
                    <li :class="{ active: activeMenu === 'home','custom-font': true }" @click="setActiveMenu('home')">主页</li>
                    <li :class="{ active: activeMenu === 'new-project' ,'custom-font': true}" @click="setActiveMenu('new-project')">新建项目</li>
                    <li :class="{ active: activeMenu === 'new-article' ,'custom-font': true}" @click="setActiveMenu('new-article')">新建文章</li>
                    <li :class="{ active: activeMenu === 'view-project','custom-font': true }" @click="setActiveMenu('view-project')">查看项目</li>
                    <li :class="{ active: activeMenu === 'view-article','custom-font': true }" @click="setActiveMenu('view-article')">查看文章</li>
                    <li :class="{ active: activeMenu === 'drafts' ,'custom-font': true}" @click="setActiveMenu('drafts')">草稿箱</li>
                </ul>
            </nav>
        </aside>
        <main v-if="activeMenu === 'view-project'&& if_edit_event=== false">
          <div v-if="!searchable_event">
            <el-icon name="filter" @click="searchable_event = true" class="large-icon">
            <Filter/>
            </el-icon>
          </div>
          <div class="top" v-if="searchable_event">
          <el-form ref="filter_event" label-width="120px" class="input-form" status-icon>
                <el-form-item label="项目名称/Id" prop="name">
                    <el-input v-model="searchQuery" placeholder="请输入"/>
                </el-form-item>
                <el-form-item label="项目状态" prop="completed">
                  <el-select v-model="isCompleted" placeholder="请选择" >
                    <el-option value="null" label="全部"/>
                    <el-option value="false" label="未结束"/>
                    <el-option value="true" label="已结束"/>
                  </el-select>
                </el-form-item>
                <el-form-item label="项目负责人" prop="name">
                    <el-input v-model="owner" placeholder="请输入"/>
                </el-form-item>
                <el-form-item label="项目类型" prop="type">
                  <el-select v-model="type" placeholder="请选择" >
                    <el-option value="null" label="全部"/>
                    <el-option value="MEDICAL" label="医疗"/>
                    <el-option value="CLEANUP" label="清理"/>
                    <el-option value="EXPLAIN" label="讲解"/>
                    <el-option value="LAYOUT" label="布置"/>
                    <el-option value="GUIDE" label="引导"/>
                    <el-option value="TEACHING" label="支教"/>
                  </el-select>
                </el-form-item>
                <el-form-item label="项目地址" prop="address">
                    <el-input v-model="address" placeholder="请输入"/>
                </el-form-item>
            </el-form>
            <div class="btns">
                <el-button type="primary" @click="search_event"> 筛选 </el-button>
                <el-button type="primary" @click="resetSearch"> 清空筛选条件 </el-button>
            </div>
          </div>
  <!-- <button class="actions-button" @click="search_event">筛选</button>
  <button class="reset-button" @click="resetSearch">清空筛选条件</button> -->

          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>项目名称</th>
                <th>负责人</th>
                <th>活动地址</th>
                <th>类型</th>
                <th>是否结束</th>
                <th>最近更新时间</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="event in filtered_events" :key="event.id">
                <td>{{ event.id }}</td>
                <td>{{ event.name }}</td>
                <td>{{ event.contactPeople }}</td>
                <td>{{ event.location }}</td>
                <td>{{ event.type }}</td>
                <td>{{ event.finished ? '已结束' : '未结束' }}</td>
                <td>{{ parseTime(event.updateTime) }}</td>
                <td>
                    <button class="edit-button" @click="editevent(event.id)">修改</button>
                    <button class="delete-button" @click="deleteevent(event.id)">删除</button>
                </td>
                <!-- <td><button class="export-button" @click="exportevent(event.id)">Export</button></td> -->
              </tr>
            </tbody>
          </table>
          <div class="pagination">
            <!-- Pagination controls go here -->
          </div>
        </main>
        <main v-if="activeMenu === 'view-project'&& if_edit_event=== true">
            <NewTable :param1="editid_event" @submitted="handleEventSubmitted"/>
        </main>
        <main v-if="activeMenu === 'view-article'&& if_edit_article=== false">
          <div v-if="!searchable_article">
            <el-icon name="filter" @click="searchable_article = true" class="large-icon">
            <Filter/>
            </el-icon>
          </div>
          <div class="top" v-if="searchable_article">
            <el-form ref="filter_article" label-width="120px" class="input-form" status-icon>
              <el-form-item label="文章名称/Id" prop="name">
                <el-input v-model="article_name" placeholder="请输入"/>
              </el-form-item>
              <el-form-item label="作者" prop="author">
                <el-input v-model="author_name" placeholder="请输入"/>
              </el-form-item>
              <el-form-item label="对应项目" prop="event">
                <el-input v-model="event_name" placeholder="请输入"/>
              </el-form-item>
            </el-form>
            <div class="btns">
              <el-button type="primary" @click="search_article"> 筛选 </el-button>
              <el-button type="primary" @click="resetSearch"> 清空筛选条件 </el-button>
            </div>
          </div>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>文章名称</th>
                <th>作者</th>
                <th>内容简介</th>
                <th>对应项目</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="article in articles" :key="article.id">
                <td>{{ article.id }}</td>
                <td>{{ article.title }}</td>
                <td>{{ article.author }}</td>
                <td>{{ article.abstracts }}...</td>
                <td>{{ article.eventName }}</td>
                <td>
                    <button class="edit-button" @click="editarticle(article.id)">修改</button>
                    <button class="delete-button" @click="deletearticle(article.id)">删除</button>
                </td>
              </tr>
            </tbody>
          </table>
        </main>
        <main v-if="activeMenu === 'view-article'&& if_edit_article=== true">
            <NewProject :param1="editid_article" @submitted="handleArticleSubmitted"/>
        </main>
        <main v-if="activeMenu === 'new-project'">
            <!-- <NewProject /> -->
            <NewTable :param1="0"/>
        </main>
        <main v-if="activeMenu === 'new-article'">
            <NewProject :param1="0"/>
            <!-- <NewTable /> -->
        </main>
        <main v-if="activeMenu === 'drafts'&& if_edit_draft=== false">
          <div v-if="!searchable_draft">
            <el-icon name="filter" @click="searchable_draft = true" class="large-icon">
            <Filter/>
          </el-icon>
          </div>
          <div class="top" v-if="searchable_draft">
            <el-form ref="filter_draft" label-width="120px" class="input-form" status-icon>
              <el-form-item label="草稿名称/Id" prop="name">
                <el-input v-model="draft_name" placeholder="请输入"/>
              </el-form-item>
              <el-form-item label="草稿作者" prop="author">
                <el-input v-model="draft_author" placeholder="请输入"/>
              </el-form-item>
              <el-form-item label="草稿对应项目" prop="event">
                <el-input v-model="draft_event" placeholder="请输入"/>
              </el-form-item>
            </el-form>
            <div class="btns">
              <el-button type="primary" @click="search_drafts"> 筛选 </el-button>
              <el-button type="primary" @click="resetSearch"> 清空筛选条件 </el-button>
            </div>
          </div>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>草稿名称</th>
                <th>作者</th>
                <th>草稿内容</th>
                <th>草稿项目</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="draft in filtered_drafts" :key="draft.id">
                <td>{{ draft.id }}</td>
                <td>{{ draft.title }}</td>
                <td>{{ draft.author }}</td>
                <td>{{ draft.abstracts }}...</td>
                <td>{{ draft.eventName }}</td>
                <td>
                    <button class="edit-button" @click="editdraft(draft.id)">编辑</button>
                    <button class="delete-button" @click="deletearticle(draft.id)">删除</button>
                </td>
              </tr>
            </tbody>
          </table>
        </main>
        <main v-if="activeMenu === 'drafts'&& if_edit_draft=== true">
            <NewProject :param1="editid_draft" @submitted="handledraftSubmitted"/>
        </main>
        <main v-if="activeMenu === 'home'">
          <h1>Home</h1>
          <p>Here you can view and manage your drafts.</p>
        </main>
      </div>
    </div>
  </template>
  
<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import NewProject from '../../components/Editor.vue'; // 导入新组件
import NewTable from '../../components/Table.vue'; // 导入新组件
import { adminGetArticle,adminGetDraft} from '../../api/article';
import { getEvent,adminGetEvent } from '../../api/event';
import { parseTime } from '../../utils/index';
import { Filter } from "@element-plus/icons-vue";
interface Event{
    id: number;
    name: string;
    contactPeople: string;
    location: string;
    type: string;
    finished: string;
    updateTime: string;
}
const events = ref<Event[]>([])
interface Article{
    id: number;
    title: string;
    author: string;
    abstracts: string;
    eventId: number;
    eventName: string;
}
const articles = ref<Article[]>([])
const drafts = ref<Article[]>([]);
//event类
const isCompleted = ref('null');
const owner = ref('');
const searchQuery = ref('');
const type = ref('null');
const address = ref('');
//article类
const article_name = ref('');
const event_name = ref('');
const author_name = ref('');
//draft类
const draft_name = ref('');
const draft_event = ref('');
const draft_author = ref('');
function handleArticle(){
    adminGetArticle().then(res => {
        if (res.data.code === '000') {
            //console.log("获取文章成功:", res);
            articles.value = res.data.result;
            for(const article of articles.value){
                getEvent(article.eventId).then(res => {
                    if (res.data.code === '000') {
                        //console.log("获取文章成功:", res);
                        article.eventName = res.data.result.name;
                    }
                    else if (res.data.code === '400') {
                        alert("获取文章失败，请稍后重试！");
                    }
                });
            } 
          filtered_articles.value = articles.value;
        }
        else if (res.data.code === '400') {
            alert("获取文章失败，请稍后重试！");
        }
    });
}
function handleEvent(){
    adminGetEvent().then(res => {
        if (res.data.code === '000') {
            //console.log("获取成功:", res);
            events.value = res.data.result;
            filtered_events.value = events.value;
            //console.log(events.value);
        }
        else if (res.data.code === '400') {
            alert("获取文章失败，请稍后重试！");
        }
    });
}
function handleDraft(){
    adminGetDraft().then(res => {
        if (res.data.code === '000') {
            console.log("获取文章成功:", res);
            drafts.value = res.data.result;
            for(const draft of drafts.value){
              if(draft.eventId !== 0){
                getEvent(draft.eventId).then(res => {
                    if (res.data.code === '000') {
                        //console.log("获取文章成功:", res);
                        draft.eventName = res.data.result.name;
                    }
                    else if (res.data.code === '400') {
                        alert("获取项目失败，请稍后重试！");
                    }
                });
              } 
            }
          filtered_drafts.value = drafts.value;
        }
        else if (res.data.code === '400') {
            alert("获取文章失败，请稍后重试！");
        }
    });
}
const activeMenu = ref(localStorage.getItem('activeMenu') || 'home');
origin();
function origin(){
  if(activeMenu.value === 'view-article')handleArticle();
  if(activeMenu.value === 'view-project')handleEvent();
  if(activeMenu.value === 'drafts')handleDraft();
}
watch(activeMenu, (newValue) => {
  localStorage.setItem('activeMenu', newValue);
});
function setActiveMenu(menu: string){
    activeMenu.value = menu;
    if(menu === 'view-article')handleArticle();
    if(menu === 'view-project')handleEvent();
    if(menu === 'drafts')handleDraft();
};
const if_edit_article = ref(false);
const if_edit_event = ref(false);
const if_edit_draft = ref(false);
const editid_article = ref(0);
const editid_event= ref(0);
const editid_draft= ref(0);
const searchable_article = ref(false);
const searchable_event = ref(false);
const searchable_draft = ref(false);
function editarticle(id: number){
    if_edit_article.value = true;
    editid_article .value = id;
    console.log("编辑文章",id);
};
function deletearticle(id: number){
    console.log("删除文章",id);
};
function editevent(id: number){
    if_edit_event.value = true;
    editid_event.value = id;
    console.log("编辑项目",id);
};
function deleteevent(id: number){
    console.log("删除项目",id);
};
function editdraft(id: number){
    if_edit_draft.value = true;
    editid_draft.value = id;
    console.log("编辑草稿",id);
};
function handleArticleSubmitted(){
  if_edit_article.value = false;
  handleArticle();
};
function handleEventSubmitted(){
  if_edit_event.value = false;
  handleEvent();
};
function handledraftSubmitted(){
  if_edit_draft.value = false;
  handleDraft();
};
const filtered_events = ref<typeof events.value>([]);
function search_event(){
    filtered_events.value = events.value.filter(event => event.name.includes(searchQuery.value) 
      || event.id.toString().includes(searchQuery.value)
    );
    if(type.value !== 'null'){
      filtered_events.value = filtered_events.value.filter(event => event.type.includes(type.value));
    }
    if(isCompleted.value !== 'null'){
      filtered_events.value = filtered_events.value.filter(event => event.finished.toString() === isCompleted.value);
    }
    if(owner.value !== ''){
      filtered_events.value = filtered_events.value.filter(event => event.contactPeople.includes(owner.value));
    }
    if(address.value !== ''){
      filtered_events.value = filtered_events.value.filter(event => event.location.includes(address.value));
    }
}
const filtered_articles = ref<typeof articles.value>([]);
function search_article(){
    filtered_articles.value = articles.value.filter(article => article.title.includes(article_name.value) 
      || article.id.toString().includes(article_name.value)
    );
    if(event_name.value !== ''){
      filtered_articles.value = filtered_articles.value.filter(article => article.eventName.includes(event_name.value));
    }
    if(author_name.value !== ''){
      filtered_articles.value = filtered_articles.value.filter(article => article.author.includes(author_name.value));
    }
}
const filtered_drafts = ref<typeof articles.value>([]);
function search_drafts(){
    filtered_drafts.value = drafts.value.filter(draft => draft.title.includes(draft_name.value) 
      || draft.id.toString().includes(draft_name.value)
    );
    if(event_name.value !== ''){
      filtered_drafts.value = filtered_drafts.value.filter(draft => draft.eventName.includes(draft_event.value));
    }
    if(author_name.value !== ''){
      filtered_drafts.value = filtered_drafts.value.filter(draft => draft.author.includes(draft_author.value));
    }
}
const resetSearch = () => {
    searchQuery.value = '';
    isCompleted.value = 'null';
    owner.value = '';
    type.value = 'null';
    address.value = '';
    article_name.value = '';
    event_name.value = '';
    author_name.value = '';
    draft_name.value = '';
    draft_event.value = '';
    draft_author.value = '';
    filtered_events.value = events.value;
    filtered_articles.value = articles.value;
    filtered_drafts.value = drafts.value;
};

</script>

<style scoped>
.large-icon {
  font-size: 32px; /* 放大图标 */
  cursor: pointer; /* 鼠标悬停时显示为指针 */
  border: 2px solid #ccc; /* 边框颜色 */
  padding: 10px; /* 内边距 */
  border-radius: 5px; /* 圆角边框 */
  display: inline-block; /* 使元素的尺寸包括内边距和边框 */
}
.top{ 
        width:100%; 
        border:1px solid#ccc; 
        /* box-shadow:3px 1px rgb(223,217,217);  */
        padding:10px 0; 
        flex:2; 
        display:flex; 
        flex-direction:column; 
        justify-content:space-between; 
        /*输入表单*/
        .input-form{ 
            display:flex; 
            flex-wrap:wrap; 
            justify-content:flex-start; 
            vertical-align:middle; 
        } 
        .input-form .el-form-item {
          flex: 0 1 30%;
          margin: 5px; /* 可选：添加一些间距 */
        }
        /*按钮组*/
        .btns{ 
            display:flex; 
            padding:0 10px; 
            margin-left:40px; 
        } 
    } 

.smart-contract-platform {
    display: flex;
    flex-direction: column;
    height: 100vh;
}
  
header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    background-color: #f5f5f5;
}
  
.custom-font {
    font-size: large;
    font-weight:lighter;
    cursor:grab;
    font-family: fantasy;
    color: #000;
}
header h1 {
    margin: 0;
    font-size: 24px;
}
  
.user-actions button {
    margin-left: 10px;
}
  
.sidebar {
    display: flex;
    flex: 1;
    
}
  
aside {
    width: 12%;
    background-color: #f8f8f9;
    color: white;
    font-family: fantasy;
    
}
  
aside nav ul {
    list-style: none;
    padding: 0;
    
}
  
aside nav ul li {
    padding: 10px;
    cursor: pointer;
}
  
aside nav ul li.active {
    background-color: #86b7e8;
}

aside nav ul li:hover {
    background-color: #c2dcf7;
}
  
main {
    width: 88%;
    flex-grow: 1;
    padding: 20px;
    background-color: #f8f8fa; /* 设置背景颜色为白色 */
}
  
.search-bar {
    display: flex;
    margin-bottom: 20px;
}
  
.search-bar input {
    flex-grow: 1;
    margin-right: 5px;
    padding: 10px;
    border-radius: 5px; /* 设置圆角 */
    max-width: 300px; /* 设置最大宽度 */
}
  
.search-bar button {
    padding: 10px 20px;
    margin-right: 5px;
    border-radius: 5px; /* 设置圆角 */
}
  
.actions-button {
    background-color: #3498db;
    color: white;
    border: none;
    cursor: pointer;
}
  
.reset-button {
    background-color: #09d209;
    color: white;
    border: none;
    cursor: pointer;
}
  
.actions button {
    padding: 10px 20px;
    margin-right: 5px;
    border-radius: 5px;
}
 
  
.delete-button {
    background-color: #e74c3c;
    color: white;
    border: none;
    cursor: pointer;
}
  
.export-button {
    background-color: #f39c12;
    color: white;
    border: none;
    cursor: pointer;
    border-radius: 10px; /* 设置圆角 */
}
  
table {
    width: 100%;
    border-collapse: collapse;
}
  
table th, table td {
    padding: 10px;
    border: 1px solid #95a5a6;
    text-align: left;
}
  
table thead th {
    background-color: #0bade7;
    color: #ecf0f1;
}
  
.pagination {
    margin-top: 20px;
    text-align: center;
}

.edit-button {
  background-color: #4CAF50; /* 绿色 */
  color: white;
  border: none;
  padding: 10px 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;
  border-radius: 4px;
}

.delete-button {
  background-color: #f44336; /* 红色 */
  color: white;
  border: none;
  padding: 10px 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;
  border-radius: 4px;
}

.edit-button:hover {
  background-color: #45a049;
}

.delete-button:hover {
  background-color: #d32f2f;
}
</style>